// ===== MAIN JAVASCRIPT FILE =====
// Author: @sken.blk website
// Description: Modern, accessible, and performant JavaScript for tattoo artist portfolio

(function() {
    'use strict';

    // ===== CONSTANTS & CONFIGURATION =====
    const CONFIG = {
        INTRO_DURATION: 900,
        LIGHTBOX_FADE: 250,
        PORTFOLIO_ITEMS_PER_LOAD: 12, // divisible by 2, 3 and 4 columns: no orphan tiles
        PORTFOLIO_IMAGE_PATH: './assets/images/portfolio/web/',
        PORTFOLIO_SIZES: '(min-width: 1100px) 25vw, (min-width: 600px) 33vw, 50vw',
        THEME_COLORS: { dark: '#0b0b0c', light: '#f4f4f2' }
    };

    const root = document.documentElement;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const desktopNav = window.matchMedia('(min-width: 900px)');

    // ===== UTILITY FUNCTIONS =====

    /**
     * Add loading state to button
     */
    function setButtonLoading(button, isLoading) {
        if (isLoading) {
            button.classList.add('loading');
            button.disabled = true;
        } else {
            button.classList.remove('loading');
            button.disabled = false;
        }
    }

    /**
     * Detach an element from the page
     */
    function detach(element) {
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
        }
    }

    /**
     * Lock / unlock page scroll and hide the page behind an overlay from
     * keyboard and screen reader users.
     */
    function setPageInert(isInert, keepNav) {
        root.classList.toggle('is-locked', isInert);
        document.querySelectorAll('main, .footer, .whatsapp-btn, .back-to-top').forEach(el => {
            el.inert = isInert;
        });
        const nav = document.querySelector('.nav');
        if (nav && !keepNav) nav.inert = isInert;
    }

    /**
     * Reveal on scroll, in both directions. The class goes on when an element
     * comes into view and off once it has completely left the screen, so the
     * animation plays again on the way back. `data-from` records which side it
     * left from, and the CSS mirrors the entrance when arriving from above.
     */
    function createRevealer(visibleClass) {
        if (!window.IntersectionObserver || reducedMotion.matches) {
            return {
                observe: (element) => element.classList.add(visibleClass),
                unobserve: () => {}
            };
        }

        const enterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const element = entry.target;
                if (!entry.isIntersecting || element.classList.contains(visibleClass)) return;

                // Entering through the top half means the page is moving up.
                // (Also covers jumps that skip the exit observer.)
                const rect = entry.boundingClientRect;
                const from = rect.top + rect.height / 2 < window.innerHeight / 2 ? 'above' : 'below';
                if (element.dataset.from !== from) {
                    element.dataset.from = from;
                    void element.offsetWidth; // apply the mirrored start state first
                }

                element.classList.add(visibleClass);
            });
        }, { rootMargin: '-8% 0px -8% 0px' });

        // Resets only when fully off screen, so nothing is seen disappearing
        const exitObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) return;
                entry.target.dataset.from = entry.boundingClientRect.top < 0 ? 'above' : 'below';
                entry.target.classList.remove(visibleClass);
            });
        });

        return {
            observe(element) {
                enterObserver.observe(element);
                exitObserver.observe(element);
            },
            unobserve(element) {
                enterObserver.unobserve(element);
                exitObserver.unobserve(element);
            }
        };
    }

    // ===== PORTFOLIO DATA =====
    // `file` is the image name inside assets/images/portfolio/web/, where each
    // work has three optimized versions: -480.webp, -960.webp and -full.webp.
    // The untouched originals stay in assets/images/portfolio/.
    const portfolioData = [
        { id: 1, title: 'Dark Creation I', style: 'dark', area: 'polpaccio', year: '2024', duration: '5h', file: 'IMG_0092', description: 'Opera dark realizzata sul polpaccio con dettagli intricati' },
        { id: 2, title: 'Blackwork Masterpiece', style: 'blackwork', area: 'spalla', year: '2024', duration: '8h', file: 'IMG_3407', description: 'Complessa composizione blackwork sulla spalla posteriore' },
        { id: 3, title: 'Fluid Anatomy', style: 'fluid', area: 'orecchio', year: '2024', duration: '6h', file: 'IMG_3605', description: 'Design fluido delicato per l\'area dell\'orecchio' },
        { id: 4, title: 'Dark Portrait', style: 'dark', area: 'braccio', year: '2024', duration: '7h', file: 'IMG_3634', description: 'Ritratto dark dettagliato sul braccio' },
        { id: 5, title: 'Geometric Flow', style: 'blackwork', area: 'dita', year: '2024', duration: '4h', file: 'IMG_3774', description: 'Geometrie precise sulle dita in blackwork contemporaneo' },
        { id: 6, title: 'Dark Nature', style: 'dark', area: 'avambraccio', year: '2024', duration: '9h', file: 'IMG_4738', description: 'Elementi naturali dark sull\'avambraccio' },
        { id: 7, title: 'Fluid Expression', style: 'fluid', area: 'braccio', year: '2024', duration: '5h', file: 'IMG_4934', description: 'Espressione artistica fluida sul braccio' },
        { id: 8, title: 'Minimalist Black', style: 'blackwork', area: 'braccio', year: '2024', duration: '3h', file: 'IMG_4952', description: 'Minimalismo blackwork sul braccio' },
        { id: 9, title: 'Dark Composition', style: 'dark', area: 'polso', year: '2024', duration: '6h', file: 'IMG_5006_jpg', description: 'Composizione dark dettagliata sul polso' },
        { id: 10, title: 'Abstract Flow', style: 'fluid', area: 'braccio', year: '2024', duration: '7h', file: 'IMG_5451', description: 'Astrattismo fluido che valorizza il braccio' },
        { id: 11, title: 'Precision Work', style: 'blackwork', area: 'avambraccio', year: '2024', duration: '4h', file: 'IMG_6251', description: 'Lavoro di precisione sull\'avambraccio' },
        { id: 12, title: 'Digital Art I', style: 'dark', area: 'braccio', year: '2024', duration: '2h', file: 'IMG_6651', description: 'Design digitale dark sul braccio' },
        { id: 13, title: 'Modern Geometry', style: 'blackwork', area: 'braccio', year: '2024', duration: '5h', file: 'IMG_6652', description: 'Geometrie moderne blackwork sul braccio' },
        { id: 14, title: 'Dark Vision', style: 'dark', area: 'braccio', year: '2024', duration: '8h', file: 'IMG_6653', description: 'Visione dark realizzata sul braccio' },
        { id: 15, title: 'Fluid Design', style: 'fluid', area: 'polpaccio', year: '2024', duration: '6h', file: 'IMG_6655', description: 'Design fluido che valorizza il polpaccio' },
        { id: 16, title: 'Complex Pattern', style: 'blackwork', area: 'polpaccio', year: '2024', duration: '7h', file: 'IMG_6656', description: 'Pattern complesso blackwork sul polpaccio' },
        { id: 17, title: 'Artistic Expression', style: 'dark', area: 'braccio', year: '2024', duration: '9h', file: 'IMG_6657', description: 'Espressione artistica dark sul braccio' },
        { id: 18, title: 'Creative Flow - Bozza', style: 'fluid', area: 'bozza', year: '2024', duration: '5h', file: 'IMG_7301', description: 'Bozza creativa per design fluido' },
        { id: 19, title: 'Bold Statement - Bozza', style: 'blackwork', area: 'bozza', year: '2024', duration: '4h', file: 'IMG_7797', description: 'Bozza per statement blackwork audace' },
        { id: 20, title: 'Masterwork Series I - Bozza', style: 'dark', area: 'bozza', year: '2024', duration: '8h', file: 'IMG_8330', description: 'Prima bozza della serie masterwork dark' },
        { id: 21, title: 'Masterwork Series II - Bozza', style: 'blackwork', area: 'bozza', year: '2024', duration: '7h', file: 'IMG_8331', description: 'Seconda bozza della serie masterwork' },
        { id: 22, title: 'Fluid Masterwork - Bozza', style: 'fluid', area: 'bozza', year: '2024', duration: '10h', file: 'IMG_8332', description: 'Bozza per masterwork fluido di grande impatto' },
        { id: 23, title: 'Dark Evolution - Bozza', style: 'dark', area: 'bozza', year: '2024', duration: '6h', file: 'IMG_8333', description: 'Bozza per evoluzione del stile dark personale' },
        { id: 24, title: 'Contemporary Art - Bozza', style: 'blackwork', area: 'bozza', year: '2024', duration: '5h', file: 'IMG_8334', description: 'Bozza per arte contemporanea blackwork' },
        { id: 25, title: 'Signature Work', style: 'fluid', area: 'gamba', year: '2024', duration: '8h', file: 'IMG_8335', description: 'Opera firma dell\'artista su gamba' },
        { id: 26, title: 'Final Creation', style: 'fluid', area: 'gamba', year: '2024', duration: '4h', file: 'IMG_8481', description: 'Creazione finale che rappresenta l\'evoluzione stilistica' },
        { id: 27, title: 'Artistic Vision', style: 'blackwork', area: 'braccio', year: '2024', duration: '7h', file: 'IMG_8379', description: 'Visione artistica blackwork sul braccio' },
        { id: 28, title: 'Innovative Design', style: 'dark', area: 'gamba', year: '2024', duration: '9h', file: 'IMG_8347', description: 'Design innovativo dark sulla gamba' }
    ];

    // ===== PRELOADER =====
    // A short brand curtain. The page loads behind it: nothing waits on it.
    const Preloader = {
        init(onDone) {
            this.preloader = document.getElementById('preloader');
            this.onDone = onDone;

            const skip = !this.preloader
                || root.classList.contains('no-intro')
                || reducedMotion.matches;

            if (skip) {
                detach(this.preloader);
                onDone();
                return;
            }

            root.classList.add('is-locked');
            setTimeout(() => this.hide(), CONFIG.INTRO_DURATION);
        },

        hide() {
            this.preloader.classList.add('is-done');
            root.classList.remove('is-locked');

            try {
                sessionStorage.setItem('intro-seen', '1');
            } catch (e) { /* storage unavailable: the intro simply plays again */ }

            this.onDone();
            setTimeout(() => detach(this.preloader), 600);
        }
    };

    // ===== NAVIGATION MODULE =====
    const Navigation = {
        init() {
            this.nav = document.querySelector('.nav');
            this.navToggle = document.getElementById('nav-toggle');
            this.navMenu = document.getElementById('nav-menu');
            this.navLinks = document.querySelectorAll('.nav__link');

            if (!this.nav) return;

            this.bindEvents();
            this.setupScrollDetection();
        },

        bindEvents() {
            if (!this.navToggle || !this.navMenu) return;

            this.navToggle.addEventListener('click', () => this.toggleMobileMenu());

            // Anchor scrolling is native (CSS scroll-behavior + scroll-padding)
            this.navLinks.forEach(link => {
                link.addEventListener('click', () => this.closeMobileMenu());
            });

            // Leaving the mobile layout always resets the menu
            desktopNav.addEventListener('change', () => this.closeMobileMenu());
        },

        isOpen() {
            return this.nav.classList.contains('is-open');
        },

        toggleMobileMenu() {
            if (this.isOpen()) {
                this.closeMobileMenu();
            } else {
                this.openMobileMenu();
            }
        },

        openMobileMenu() {
            this.nav.classList.add('is-open');
            this.navToggle.setAttribute('aria-expanded', 'true');
            this.navToggle.setAttribute('aria-label', 'Chiudi menu');
            setPageInert(true, true);
        },

        closeMobileMenu() {
            if (!this.navToggle || !this.isOpen()) return;

            this.nav.classList.remove('is-open');
            this.navToggle.setAttribute('aria-expanded', 'false');
            this.navToggle.setAttribute('aria-label', 'Apri menu');
            setPageInert(false, true);
        },

        setActiveLink(activeLink) {
            this.navLinks.forEach(link => {
                const isActive = link === activeLink;
                link.classList.toggle('active', isActive);
                if (isActive) {
                    link.setAttribute('aria-current', 'true');
                } else {
                    link.removeAttribute('aria-current');
                }
            });
        },

        setupScrollDetection() {
            if (!window.IntersectionObserver) {
                this.nav.classList.add('is-scrolled');
                return;
            }

            // Solid bar once the page leaves the very top
            const sentinel = document.createElement('div');
            sentinel.setAttribute('aria-hidden', 'true');
            sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:24px;pointer-events:none;';
            document.body.insertBefore(sentinel, document.body.firstChild);

            new IntersectionObserver(([entry]) => {
                this.nav.classList.toggle('is-scrolled', !entry.isIntersecting);
            }).observe(sentinel);

            // Active link: the section crossing the upper part of the viewport
            const sections = document.querySelectorAll('main section[id]');
            if (!sections.length) return;

            const sectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    const activeLink = document.querySelector(`.nav__link[href="#${entry.target.id}"]`);
                    if (activeLink) this.setActiveLink(activeLink);
                });
            }, { rootMargin: '-40% 0px -60% 0px' });

            sections.forEach(section => sectionObserver.observe(section));
        }
    };

    // ===== THEME MODULE =====
    const Theme = {
        init() {
            this.themeToggle = document.getElementById('theme-toggle');
            this.themeColorMeta = document.querySelector('meta[name="theme-color"]');

            let storedTheme = null;
            try {
                storedTheme = localStorage.getItem('theme');
            } catch (e) { /* storage unavailable: default theme */ }

            this.setTheme(storedTheme === 'light' ? 'light' : 'dark', false);
            this.bindEvents();
        },

        bindEvents() {
            this.themeToggle?.addEventListener('click', () => this.toggleTheme());
        },

        setTheme(theme, persist = true) {
            root.classList.toggle('light', theme === 'light');
            root.classList.toggle('dark', theme === 'dark');
            this.currentTheme = theme;

            if (persist) {
                try {
                    localStorage.setItem('theme', theme);
                } catch (e) { /* storage unavailable: theme lasts for this page only */ }
            }

            this.themeColorMeta?.setAttribute('content', CONFIG.THEME_COLORS[theme]);

            // Update theme toggle aria-label
            if (this.themeToggle) {
                const label = theme === 'dark' ? 'Passa al tema chiaro' : 'Passa al tema scuro';
                this.themeToggle.setAttribute('aria-label', label);
            }
        },

        toggleTheme() {
            const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
            Effects.themeSwitch(this.themeToggle, () => this.setTheme(newTheme));
        }
    };

    // ===== HERO VIDEO MODULE =====
    // Plays only when it is welcome (no reduced motion, no data saver)
    // and only while the hero is actually on screen.
    const HeroVideo = {
        init() {
            this.video = document.querySelector('.hero__video');
            if (!this.video) return;

            const saveData = navigator.connection && navigator.connection.saveData;
            if (reducedMotion.matches || saveData) return;

            if (!window.IntersectionObserver) {
                this.play();
                return;
            }

            new IntersectionObserver(([entry]) => {
                if (entry.isIntersecting) {
                    this.play();
                } else {
                    this.video.pause();
                }
            }, { threshold: 0.1 }).observe(this.video);
        },

        play() {
            const attempt = this.video.play();
            // Autoplay can be refused (low power mode): the poster stays visible
            if (attempt && attempt.catch) attempt.catch(() => {});
        }
    };

    // ===== EFFECTS MODULE =====
    // Small, optional flourishes. Each one checks for support and for the
    // reduced-motion preference, and leaves the page untouched otherwise.
    const Effects = {
        liquidJobs: new Map(),

        // --- Liquid distortion (SVG displacement), the "fluid" in the name ---
        // `shape(t)` maps progress 0..1 to a displacement amount in px.
        liquid(element, filterId, duration, shape) {
            const map = document.querySelector(`#${filterId} feDisplacementMap`);
            if (!map || reducedMotion.matches) return;

            this.stopLiquid(filterId);

            const job = { element, frame: 0 };
            this.liquidJobs.set(filterId, job);
            element.style.filter = `url(#${filterId})`;

            const start = performance.now();
            const tick = (now) => {
                const progress = Math.min((now - start) / duration, 1);
                map.setAttribute('scale', shape(progress).toFixed(2));

                if (progress < 1) {
                    job.frame = requestAnimationFrame(tick);
                } else {
                    this.stopLiquid(filterId);
                }
            };
            job.frame = requestAnimationFrame(tick);
        },

        stopLiquid(filterId) {
            const job = this.liquidJobs.get(filterId);
            if (!job) return;

            cancelAnimationFrame(job.frame);
            job.element.style.filter = '';
            this.liquidJobs.delete(filterId);
        },

        // The handle arrives warped and settles, like ink finding its edge
        settleTitle(strength = 1) {
            const title = document.querySelector('.hero__name');
            if (!title) return;

            const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
            this.liquid(title, 'fx-liquid-title', 1700, (t) => 90 * strength * (1 - easeOutExpo(t)));
        },

        // A single soft ripple when a work is hovered (mouse only)
        setupTileRipple(grid) {
            if (!grid || !window.matchMedia('(hover: hover)').matches) return;

            grid.addEventListener('mouseover', (e) => {
                const tile = e.target.closest('.portfolio__item');
                if (!tile || tile.contains(e.relatedTarget)) return;

                const image = tile.querySelector('.portfolio__image');
                this.liquid(image, 'fx-liquid-tile', 900, (t) => 14 * Math.sin(Math.PI * t) * (1 - t));
            });
        },

        // --- View transitions ---
        canMorph() {
            return typeof document.startViewTransition === 'function' && !reducedMotion.matches;
        },

        // Shared-element morph between two elements across a DOM update
        morph(fromElement, toElement, update) {
            fromElement.style.viewTransitionName = 'work';

            const transition = document.startViewTransition(() => {
                fromElement.style.viewTransitionName = '';
                update();
                toElement.style.viewTransitionName = 'work';
            });

            // A newer transition may skip this one: that is fine, not an error
            transition.ready.catch(() => {});
            transition.finished.finally(() => {
                toElement.style.viewTransitionName = '';
            });
        },

        // The new theme opens as a circle growing from the toggle
        themeSwitch(origin, update) {
            if (!this.canMorph() || !origin) {
                update();
                return;
            }

            const rect = origin.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            const radius = Math.hypot(
                Math.max(x, window.innerWidth - x),
                Math.max(y, window.innerHeight - y)
            );

            root.classList.add('theme-vt');
            const transition = document.startViewTransition(update);

            transition.ready.then(() => {
                root.animate(
                    { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
                    { duration: 700, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', pseudoElement: '::view-transition-new(root)' }
                );
            }).catch(() => {});

            transition.finished.finally(() => root.classList.toggle('theme-vt', false));
        }
    };

    // ===== VIDEO SHOWCASE MODULE =====
    // Posters with a quiet play control; native controls appear once playing.
    const VideoShowcase = {
        init() {
            this.items = document.querySelectorAll('.video-showcase__media');

            this.items.forEach(media => {
                const video = media.querySelector('video');
                const playButton = media.querySelector('.video-showcase__play');
                if (!video || !playButton) return;

                video.controls = false;
                playButton.hidden = false;

                playButton.addEventListener('click', () => {
                    this.pauseOthers(video);
                    playButton.hidden = true;
                    video.controls = true;
                    video.focus({ preventScroll: true }); // the button is gone: keep focus here

                    const attempt = video.play();
                    if (attempt && attempt.catch) attempt.catch(() => {});
                });

                video.addEventListener('play', () => this.pauseOthers(video));
            });
        },

        pauseOthers(current) {
            this.items.forEach(media => {
                const video = media.querySelector('video');
                if (video && video !== current && !video.paused) video.pause();
            });
        }
    };
    // ===== PORTFOLIO MODULE =====
    const Portfolio = {
        init() {
            this.portfolioGrid = document.getElementById('portfolio-grid');
            if (!this.portfolioGrid) return;

            this.filterButtons = document.querySelectorAll('.filter-btn');
            this.bodyFilter = document.getElementById('body-filter');
            this.loadMoreBtn = document.getElementById('load-more');
            this.emptyState = document.getElementById('portfolio-empty');
            this.resetBtn = document.getElementById('portfolio-reset');
            this.counter = document.getElementById('portfolio-count');

            this.currentFilters = {
                style: 'all',
                area: 'all'
            };
            this.displayedItems = 0;
            this.filteredData = [...portfolioData];

            this.setupReveal();
            this.renderPortfolio();
            this.bindEvents();
            Effects.setupTileRipple(this.portfolioGrid);
        },

        bindEvents() {
            // Style filter buttons
            this.filterButtons.forEach(button => {
                button.addEventListener('click', () => this.handleStyleFilter(button));
            });

            // Body area filter
            this.bodyFilter?.addEventListener('change', () => this.handleBodyFilter());

            // Load more button
            this.loadMoreBtn?.addEventListener('click', () => this.loadMore());

            // Empty state reset
            this.resetBtn?.addEventListener('click', () => this.resetFilters());

            // Portfolio item clicks (for lightbox)
            this.portfolioGrid.addEventListener('click', (e) => {
                const portfolioItem = e.target.closest('.portfolio__item');
                if (portfolioItem) {
                    const itemId = parseInt(portfolioItem.dataset.id, 10);
                    Lightbox.open(itemId, portfolioItem);
                }
            });
        },

        setActiveFilterButton(activeButton) {
            this.filterButtons.forEach(btn => {
                const isActive = btn === activeButton;
                btn.classList.toggle('filter-btn--active', isActive);
                btn.setAttribute('aria-pressed', String(isActive));
            });
        },

        handleStyleFilter(button) {
            this.setActiveFilterButton(button);
            this.currentFilters.style = button.getAttribute('data-filter');
            this.applyFilters();
        },

        handleBodyFilter() {
            this.currentFilters.area = this.bodyFilter.value;
            this.applyFilters();
        },

        resetFilters() {
            const allButton = document.querySelector('.filter-btn[data-filter="all"]');
            if (allButton) this.setActiveFilterButton(allButton);
            if (this.bodyFilter) this.bodyFilter.value = 'all';

            this.currentFilters = { style: 'all', area: 'all' };
            this.applyFilters();
        },

        applyFilters() {
            this.filteredData = portfolioData.filter(item => {
                const styleMatch = this.currentFilters.style === 'all' || item.style === this.currentFilters.style;
                const areaMatch = this.currentFilters.area === 'all' || item.area === this.currentFilters.area;
                return styleMatch && areaMatch;
            });

            this.displayedItems = 0;
            this.renderPortfolio();
        },

        renderPortfolio() {
            if (this.displayedItems === 0) {
                // Stop watching the tiles that are about to be discarded
                Array.from(this.portfolioGrid.children).forEach(tile => this.revealer.unobserve(tile));
                this.portfolioGrid.innerHTML = '';
            }

            const itemsToShow = this.filteredData.slice(
                this.displayedItems,
                this.displayedItems + CONFIG.PORTFOLIO_ITEMS_PER_LOAD
            );

            itemsToShow.forEach((item, index) => {
                const portfolioItem = this.createPortfolioItem(item, index);
                this.portfolioGrid.appendChild(portfolioItem);
                this.revealItem(portfolioItem);
            });

            this.displayedItems += itemsToShow.length;
            this.updateStatus();
        },

        updateStatus() {
            const total = this.filteredData.length;
            const isEmpty = total === 0;
            const hasMore = this.displayedItems < total;

            if (this.emptyState) this.emptyState.hidden = !isEmpty;
            if (this.loadMoreBtn) this.loadMoreBtn.hidden = !hasMore;
            if (this.counter) {
                this.counter.hidden = isEmpty;
                this.counter.textContent = `${this.displayedItems} di ${total} lavori`;
            }
        },

        createPortfolioItem(item, index) {
            const label = `${this.getStyleLabel(item.style)}, ${this.getAreaLabel(item.area)}`;
            const base = CONFIG.PORTFOLIO_IMAGE_PATH + item.file;

            const portfolioItem = document.createElement('button');
            portfolioItem.type = 'button';
            portfolioItem.className = 'portfolio__item';
            portfolioItem.style.setProperty('--i', index % 4);
            portfolioItem.setAttribute('data-id', item.id);
            portfolioItem.setAttribute('data-style', item.style);
            portfolioItem.setAttribute('data-area', item.area);
            portfolioItem.setAttribute('aria-label', `Apri immagine: ${label}`);

            const image = document.createElement('img');
            image.className = 'portfolio__image';
            image.alt = '';
            image.width = 480;
            image.height = 640;
            image.loading = 'lazy';
            image.decoding = 'async';
            image.draggable = false;
            image.sizes = CONFIG.PORTFOLIO_SIZES;
            image.srcset = `${base}-480.webp 480w, ${base}-960.webp 960w`;
            image.addEventListener('load', () => image.classList.add('is-loaded'), { once: true });
            image.src = `${base}-480.webp`;
            if (image.complete) image.classList.add('is-loaded');

            portfolioItem.appendChild(image);
            return portfolioItem;
        },

        getStyleLabel(style) {
            const labels = {
                'dark': 'Dark Tattoo',
                'fluid': 'Fluid Tattoo',
                'blackwork': 'Blackwork'
            };
            return labels[style] || style;
        },

        getAreaLabel(area) {
            const labels = {
                'braccio': 'Braccio',
                'avambraccio': 'Avambraccio',
                'spalla': 'Spalla Posteriore',
                'polpaccio': 'Polpaccio',
                'gamba': 'Gamba',
                'polso': 'Polso',
                'dita': 'Dita',
                'orecchio': 'Orecchio',
                'bozza': 'Bozza/Studio'
            };
            return labels[area] || area;
        },

        getTile(item) {
            return item ? this.portfolioGrid.querySelector(`.portfolio__item[data-id="${item.id}"]`) : null;
        },

        loadMore() {
            const firstNewIndex = this.displayedItems;
            this.renderPortfolio();

            // Keep keyboard users where the new works start
            const firstNewItem = this.portfolioGrid.children[firstNewIndex];
            if (firstNewItem) firstNewItem.focus({ preventScroll: true });
        },

        setupReveal() {
            this.revealer = createRevealer('is-in');
        },

        revealItem(portfolioItem) {
            this.revealer.observe(portfolioItem);
        }
    };

    // ===== LIGHTBOX MODULE =====
    const Lightbox = {
        init() {
            this.lightbox = document.getElementById('lightbox');
            if (!this.lightbox) return;

            this.lightboxImage = this.lightbox.querySelector('.lightbox__image');
            this.lightboxTitle = this.lightbox.querySelector('.lightbox__title');
            this.lightboxArea = this.lightbox.querySelector('.lightbox__area');
            this.lightboxCounter = this.lightbox.querySelector('.lightbox__counter');

            this.closeBtn = this.lightbox.querySelector('.lightbox__close');
            this.prevBtn = this.lightbox.querySelector('.lightbox__prev');
            this.nextBtn = this.lightbox.querySelector('.lightbox__next');
            this.overlay = this.lightbox.querySelector('.lightbox__overlay');
            this.stage = this.lightbox.querySelector('.lightbox__image-container');

            this.currentIndex = 0;
            this.currentData = [];
            this.trigger = null;

            this.bindEvents();
        },

        bindEvents() {
            // Close lightbox
            this.closeBtn.addEventListener('click', () => this.close());
            this.overlay.addEventListener('click', () => this.close());
            this.stage.addEventListener('click', (e) => {
                if (e.target === this.stage) this.close();
            });

            // Navigation
            this.prevBtn.addEventListener('click', () => this.prev());
            this.nextBtn.addEventListener('click', () => this.next());

            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (!this.isOpen()) return;

                switch (e.key) {
                    case 'Escape':
                        this.close();
                        break;
                    case 'ArrowLeft':
                        this.prev();
                        break;
                    case 'ArrowRight':
                        this.next();
                        break;
                    case 'Tab':
                        this.trapFocus(e);
                        break;
                }
            });

            // Touch gestures for mobile
            let startX = 0;
            let startY = 0;

            this.lightbox.addEventListener('touchstart', (e) => {
                startX = e.changedTouches[0].screenX;
                startY = e.changedTouches[0].screenY;
            }, { passive: true });

            this.lightbox.addEventListener('touchend', (e) => {
                const diffX = startX - e.changedTouches[0].screenX;
                const diffY = startY - e.changedTouches[0].screenY;
                this.handleSwipe(diffX, diffY);
            }, { passive: true });

            this.lightboxImage.addEventListener('load', () => {
                this.lightboxImage.classList.add('is-loaded');
                this.setAspectRatio(this.lightboxImage);
            });
        },

        isOpen() {
            return !this.lightbox.hidden;
        },

        trapFocus(e) {
            const focusable = [this.closeBtn, this.prevBtn, this.nextBtn].filter(el => !el.hidden);
            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        },

        handleSwipe(diffX, diffY) {
            const threshold = 50;

            // Horizontal intent only: vertical drags are not navigation
            if (Math.abs(diffX) < threshold || Math.abs(diffX) < Math.abs(diffY)) return;

            if (diffX > 0) {
                this.next(); // Swipe left - next image
            } else {
                this.prev(); // Swipe right - previous image
            }
        },

        open(itemId, trigger) {
            const item = portfolioData.find(p => p.id === itemId);
            if (!item) return;

            // Set current data to filtered portfolio
            this.currentData = Portfolio.filteredData;
            this.currentIndex = this.currentData.findIndex(p => p.id === itemId);
            this.trigger = trigger || document.activeElement;

            const show = () => {
                this.lightbox.hidden = false;
                this.showItem(item);
                setPageInert(true);
                this.closeBtn.focus();
            };

            const thumb = this.getTileImage(item);

            if (thumb && Effects.canMorph()) {
                // The tile grows into the lightbox picture
                this.lightbox.classList.add('is-instant', 'active');
                Effects.morph(thumb, this.lightboxImage, show);
            } else {
                this.lightbox.classList.remove('is-instant');
                show();
                requestAnimationFrame(() => this.lightbox.classList.add('active'));
            }
        },

        close() {
            if (!this.isOpen()) return;

            const hide = () => {
                this.lightbox.classList.remove('active', 'is-instant');
                this.lightbox.hidden = true;
                this.lightboxImage.removeAttribute('src');
                setPageInert(false);
                this.restoreFocus();
            };

            const thumb = this.getTileImage(this.currentData[this.currentIndex]);

            if (thumb && Effects.canMorph() && this.isOnScreen(thumb)) {
                // ...and shrinks back into the tile it came from
                Effects.morph(this.lightboxImage, thumb, hide);
                return;
            }

            // Fallback: plain fade
            this.lightbox.classList.remove('active', 'is-instant');
            setPageInert(false);
            this.restoreFocus();

            setTimeout(() => {
                this.lightbox.hidden = true;
                this.lightboxImage.removeAttribute('src');
            }, reducedMotion.matches ? 0 : CONFIG.LIGHTBOX_FADE);
        },

        restoreFocus() {
            const tile = Portfolio.getTile(this.currentData[this.currentIndex]) || this.trigger;
            if (tile && tile.isConnected) {
                tile.focus({ preventScroll: true });
            }
        },

        getTileImage(item) {
            const tile = Portfolio.getTile(item);
            return tile ? tile.querySelector('.portfolio__image') : null;
        },

        isOnScreen(element) {
            const rect = element.getBoundingClientRect();
            return rect.bottom > 0 && rect.top < window.innerHeight;
        },

        prev() {
            if (this.currentData.length < 2) return;

            if (this.currentIndex > 0) {
                this.currentIndex--;
            } else {
                this.currentIndex = this.currentData.length - 1;
            }
            this.showItem(this.currentData[this.currentIndex]);
        },

        next() {
            if (this.currentData.length < 2) return;

            if (this.currentIndex < this.currentData.length - 1) {
                this.currentIndex++;
            } else {
                this.currentIndex = 0;
            }
            this.showItem(this.currentData[this.currentIndex]);
        },

        getImageUrl(item) {
            return `${CONFIG.PORTFOLIO_IMAGE_PATH}${item.file}-full.webp`;
        },

        setAspectRatio(image) {
            if (image && image.naturalWidth && image.naturalHeight) {
                this.lightboxImage.style.setProperty('--ar', (image.naturalWidth / image.naturalHeight).toFixed(4));
            }
        },

        showItem(item) {
            const styleLabel = Portfolio.getStyleLabel(item.style);
            const areaLabel = Portfolio.getAreaLabel(item.area);
            const total = this.currentData.length;

            // Start from the thumbnail already on the page (instant, and it
            // gives the picture its proportions), then swap in the full size.
            const thumb = this.getTileImage(item);
            const previewUrl = (thumb && thumb.currentSrc) || `${CONFIG.PORTFOLIO_IMAGE_PATH}${item.file}-960.webp`;
            const fullUrl = this.getImageUrl(item);

            this.setAspectRatio(thumb);
            this.lightboxImage.classList.remove('is-loaded');
            this.lightboxImage.src = previewUrl;
            this.lightboxImage.alt = `${styleLabel}, ${areaLabel}`;

            const full = new Image();
            full.onload = () => {
                if (this.isOpen() && this.currentData[this.currentIndex] === item) {
                    this.lightboxImage.src = fullUrl;
                }
            };
            full.src = fullUrl;

            this.lightboxTitle.textContent = styleLabel;
            this.lightboxArea.textContent = areaLabel;
            this.lightboxCounter.textContent = `${this.currentIndex + 1} / ${total}`;

            // Update navigation button states
            this.updateNavigationButtons();
            this.preloadNeighbour();
        },

        updateNavigationButtons() {
            const hasSiblings = this.currentData.length > 1;
            this.prevBtn.hidden = !hasSiblings;
            this.nextBtn.hidden = !hasSiblings;
        },

        // Warm up the next image so swiping feels instant
        preloadNeighbour() {
            const nextItem = this.currentData[(this.currentIndex + 1) % this.currentData.length];
            if (nextItem && this.currentData.length > 1) {
                new Image().src = this.getImageUrl(nextItem);
            }
        }
    };

    // ===== FAQ MODULE =====
    const FAQ = {
        init() {
            this.faqItems = document.querySelectorAll('.faq__item');
            this.bindEvents();
        },

        bindEvents() {
            this.faqItems.forEach(item => {
                const question = item.querySelector('.faq__question');
                question?.addEventListener('click', () => this.toggleFAQ(item));
            });
        },

        toggleFAQ(item) {
            const question = item.querySelector('.faq__question');
            const isExpanded = question.getAttribute('aria-expanded') === 'true';

            // Close all other FAQ items
            this.faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle current item (the open/close animation lives in CSS)
            question.setAttribute('aria-expanded', String(!isExpanded));
        }
    };

    // ===== FORMS MODULE =====
    const Forms = {
        init() {
            this.bookingForm = document.getElementById('booking-form');
            this.bindEvents();
        },

        bindEvents() {
            // Booking form
            this.bookingForm?.addEventListener('submit', (e) => this.handleBookingSubmit(e));

            // Real-time validation
            const inputs = document.querySelectorAll('.booking__form .form__input, .booking__form .form__textarea, .booking__form .form__select');
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearError(input));
            });
        },

        async handleBookingSubmit(e) {
            e.preventDefault();

            const form = e.target;
            const submitBtn = form.querySelector('button[type="submit"]');

            if (!this.validateForm(form)) {
                form.querySelector('.error')?.focus();
                return;
            }

            setButtonLoading(submitBtn, true);

            try {
                const formData = new FormData(form);

                // Check honeypot
                if (formData.get('website')) {
                    throw new Error('Spam detected');
                }

                const response = await this.submitForm('/api/booking', formData);

                if (response.ok) {
                    this.showSuccess('Richiesta inviata con successo! Ti contatteremo presto.');
                    form.reset();
                } else {
                    throw new Error('Errore durante l\'invio');
                }
            } catch (error) {
                this.showError('Errore durante l\'invio del modulo. Riprova pi\u00f9 tardi.');
                console.error('Form submission error:', error);
            } finally {
                setButtonLoading(submitBtn, false);
            }
        },

        async submitForm(endpoint, formData) {
            // Simulate API call for demo
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({ ok: true });
                }, 1000);
            });
        },

        validateForm(form) {
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;

            requiredFields.forEach(field => {
                if (!this.validateField(field)) {
                    isValid = false;
                }
            });

            return isValid;
        },

        validateField(field) {
            const value = field.value.trim();
            const fieldName = field.name;
            let errorMessage = '';

            // Clear previous errors
            this.clearError(field);

            // Required field validation
            if (field.hasAttribute('required') && !value) {
                errorMessage = 'Questo campo \u00e8 obbligatorio';
            }
            // Email validation
            else if (fieldName === 'email' && value && !this.isValidEmail(value)) {
                errorMessage = 'Inserisci un indirizzo email valido';
            }

            if (errorMessage) {
                this.showFieldError(field, errorMessage);
                return false;
            }

            return true;
        },

        isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },

        showFieldError(field, message) {
            const errorElement = document.getElementById(`${field.id || field.name}-error`);
            if (errorElement) {
                errorElement.textContent = message;
            }
            field.classList.add('error');
            field.setAttribute('aria-invalid', 'true');
        },

        clearError(field) {
            const errorElement = document.getElementById(`${field.id || field.name}-error`);
            if (errorElement) {
                errorElement.textContent = '';
            }
            field.classList.remove('error');
            field.removeAttribute('aria-invalid');
        },

        showSuccess(message) {
            this.showNotification(message, 'success');
        },

        showError(message) {
            this.showNotification(message, 'error');
        },

        showNotification(message, type) {
            // Create notification element
            const notification = document.createElement('div');
            notification.className = `notification notification--${type}`;
            notification.setAttribute('role', type === 'error' ? 'alert' : 'status');
            notification.innerHTML = `
                <div class="notification__content">
                    <p>${message}</p>
                    <button class="notification__close" type="button" aria-label="Chiudi notifica">&times;</button>
                </div>
            `;

            // Add to page
            document.body.appendChild(notification);

            // Show notification
            setTimeout(() => notification.classList.add('show'), 100);

            // Auto remove
            const autoRemove = setTimeout(() => {
                this.removeNotification(notification);
            }, 5000);

            // Manual close
            const closeBtn = notification.querySelector('.notification__close');
            closeBtn.addEventListener('click', () => {
                clearTimeout(autoRemove);
                this.removeNotification(notification);
            });
        },

        removeNotification(notification) {
            notification.classList.add('hide');
            setTimeout(() => detach(notification), 400);
        }
    };

    // ===== SCROLL ANIMATIONS MODULE =====
    const ScrollAnimations = {
        init() {
            this.setupReveal();
            this.setupFloatingActions();
        },

        setupReveal() {
            const revealer = createRevealer('is-visible');
            document.querySelectorAll('[data-reveal]').forEach(element => revealer.observe(element));
        },

        // WhatsApp and back-to-top appear once the hero has left the screen,
        // so they never sit on top of the hero buttons.
        setupFloatingActions() {
            this.backToTopBtn = document.getElementById('back-to-top');
            const hero = document.querySelector('.hero');

            const setPastHero = (isPast) => {
                // Coming back up to the hero: the title settles again, more gently
                if (!isPast && document.body.classList.contains('is-past-hero')) {
                    Effects.settleTitle(0.5);
                }
                document.body.classList.toggle('is-past-hero', isPast);
                this.backToTopBtn?.classList.toggle('visible', isPast);
            };

            if (!hero || !window.IntersectionObserver) {
                setPastHero(true);
            } else {
                new IntersectionObserver(([entry]) => {
                    setPastHero(!entry.isIntersecting);
                }, { threshold: 0.25 }).observe(hero);
            }

            this.backToTopBtn?.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: reducedMotion.matches ? 'auto' : 'smooth'
                });
            });
        }
    };

    // ===== ACCESSIBILITY MODULE =====
    const Accessibility = {
        init() {
            this.setupKeyboardNavigation();
        },

        setupKeyboardNavigation() {
            // Escape closes the mobile menu (the lightbox handles its own keys)
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && Navigation.nav && Navigation.isOpen()) {
                    Navigation.closeMobileMenu();
                    Navigation.navToggle?.focus();
                }
            });
        }
    };

    // ===== INITIALIZATION =====

    function initializeApp() {
        // Each module starts on its own: if one fails, the others (and the
        // intro below, which un-hides the hero) still run.
        const modules = [
            Navigation, Theme, HeroVideo, Portfolio, Lightbox,
            VideoShowcase, FAQ, Forms, ScrollAnimations, Accessibility
        ];

        modules.forEach(module => {
            try {
                module.init();
            } catch (error) {
                console.error('Module failed to start:', error);
            }
        });

        // The intro never blocks the page: it lifts on its own timer
        Preloader.init(() => {
            root.classList.add('is-ready');
            Effects.settleTitle();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeApp);
    } else {
        initializeApp();
    }

})();
