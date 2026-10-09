// ===== MAIN JAVASCRIPT FILE =====
// Author: @sken.blk website
// Description: Modern, accessible, and performant JavaScript for tattoo artist portfolio

(function() {
    'use strict';

    // ===== CONSTANTS & CONFIGURATION =====
    const CONFIG = {
        INTRO_GRACE: 150,          // assets ready within this time = cached: no curtain
        INTRO_MIN: 700,            // once shown, stay long enough not to blink
        INTRO_GALLERY_WAIT: 4500,  // how long the first portfolio rows may hold it
        INTRO_MAX: 8000,           // hard limit, whatever the connection
        IMAGE_RETRY_DELAY: 1500,
        LIGHTBOX_FADE: 250,
        // Works shown per step: two full rows of 4 on wide screens, full rows
        // of 2 or 3 below (6 divides by both), so there is never an orphan tile
        PORTFOLIO_ITEMS_PER_LOAD: { wide: 8, narrow: 6 },
        VIDEO_LOOP_FADE: 0.7,   // seconds before the end at which a video fades to its poster
        TITLE_HOLD: 2000,       // ms the hero title rests, readable, between two stirs
        PORTFOLIO_IMAGE_PATH: './assets/images/portfolio/web/',
        PORTFOLIO_SIZES: '(min-width: 1100px) 25vw, (min-width: 600px) 33vw, 50vw',
        THEME_COLORS: { dark: '#0b0b0c', light: '#f4f4f2' },

        // Booking requests.
        // ENDPOINT: URL of a form service that accepts a multipart POST (with
        // the pictures). Left empty, the request opens in WhatsApp instead.
        BOOKING: {
            ENDPOINT: '',
            WHATSAPP: '393272127922',
            MAX_FILES: 5,
            MAX_FILE_MB: 8,
            MONTHS_AHEAD: 6   // how far ahead a preferred date can be picked
        }
    };

    const root = document.documentElement;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const desktopNav = window.matchMedia('(min-width: 900px)');
    const wideGrid = window.matchMedia('(min-width: 1100px)'); // 4-column portfolio

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
    // A real loading curtain, not a timed intro. It appears only when the
    // first pictures are not available yet (first visit, slow connection),
    // its bar follows the actual downloads, and it lifts when they are in.
    // With everything already cached it never shows.
    const Preloader = {
        init(onDone) {
            this.preloader = document.getElementById('preloader');
            this.onDone = onDone;
            this.finished = false;

            if (!this.preloader || reducedMotion.matches) {
                detach(this.preloader);
                onDone();
                return;
            }

            this.bar = this.preloader.querySelector('.preloader__bar');

            const startedAt = performance.now();
            const elapsed = () => performance.now() - startedAt;
            const wait = (ms) => new Promise(resolve => setTimeout(resolve, Math.max(0, ms)));

            // Needed for the first screen / for the first rows of the portfolio
            const critical = this.getCriticalAssets();
            const gallery = this.getGalleryAssets();
            const assets = critical.concat(gallery);

            let loaded = 0;
            assets.forEach(asset => asset.then(() => {
                loaded++;
                this.setProgress(loaded / assets.length);
            }));

            const everything = Promise.all(assets);

            Promise.race([
                everything.then(() => true),
                wait(CONFIG.INTRO_GRACE).then(() => false)
            ]).then(alreadyCached => {
                if (alreadyCached) {
                    this.finish(true);
                    return;
                }

                root.classList.add('is-locked');
                this.preloader.classList.add('is-loading');

                // First screen is mandatory; the gallery gets a fair chance,
                // but a slow connection never holds the page hostage.
                const ready = Promise.all(critical).then(() => Promise.race([
                    Promise.all(gallery),
                    wait(CONFIG.INTRO_GALLERY_WAIT - elapsed())
                ]));

                Promise.race([ready, wait(CONFIG.INTRO_MAX)])
                    .then(() => wait(CONFIG.INTRO_MIN - elapsed())) // no blink on fast loads
                    .then(() => this.finish(false));
            });
        },

        // Resolves when the image has loaded (or failed: a broken file must
        // never block the page).
        whenImage(image) {
            if (image.complete && image.naturalWidth > 0) return Promise.resolve();

            return new Promise(resolve => {
                image.addEventListener('load', resolve, { once: true });
                image.addEventListener('error', resolve, { once: true });
            });
        },

        getCriticalAssets() {
            const assets = [];

            // Ask for the two faces of the first screen explicitly: `fonts.ready`
            // alone can resolve before the browser has even requested them.
            if (document.fonts && document.fonts.load) {
                ['800 1em "Sofia Sans Extra Condensed"', '400 1em "Geist"'].forEach(font => {
                    assets.push(document.fonts.load(font).catch(() => {}));
                });
            }

            const heroVideo = document.querySelector('.hero__video');
            if (heroVideo && heroVideo.poster) {
                const poster = new Image();
                poster.src = heroVideo.poster;
                assets.push(this.whenImage(poster));
            }

            const logo = document.querySelector('.nav__logo img');
            if (logo) assets.push(this.whenImage(logo));

            return assets;
        },

        getGalleryAssets() {
            return Array.from(document.querySelectorAll('.portfolio__image[loading="eager"]'))
                .map(image => this.whenImage(image));
        },

        setProgress(value, force) {
            // Pictures that arrive after the curtain has lifted must not move the bar back
            if (this.finished && !force) return;
            this.bar?.style.setProperty('--progress', value.toFixed(3));
        },

        finish(instant) {
            if (this.finished) return;
            this.finished = true;

            if (instant) {
                detach(this.preloader);
                this.onDone();
                return;
            }

            // Let the bar reach the end before the curtain lifts
            this.setProgress(1, true);
            setTimeout(() => {
                this.preloader.classList.add('is-done');
                root.classList.remove('is-locked');
                this.onDone();
                setTimeout(() => detach(this.preloader), 600);
            }, 250);
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
            FluidLines.refreshColor();

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

    // ===== LOOPING VIDEOS MODULE =====
    // The hero and process videos play by themselves, muted, for as long as
    // they are on screen. The loop point is hidden: just before the end the
    // video fades out to its poster (which is its own first frame), rewinds
    // behind it and fades back in, so it never visibly jumps to the start.
    const LoopingVideos = {
        init() {
            const videos = document.querySelectorAll('.hero__video, .video-showcase__video');
            const saveData = navigator.connection && navigator.connection.saveData;

            if (reducedMotion.matches || saveData) {
                // Nothing moves on its own: the process videos get native controls instead
                document.querySelectorAll('.video-showcase__video').forEach(video => {
                    video.controls = true;
                });
                return;
            }

            videos.forEach(video => this.setup(video));
        },

        setup(video) {
            video.muted = true;
            video.loop = false; // the loop is handled below, with the fade
            video.playsInline = true;
            video.classList.add('fx-loop');

            // The poster stays behind the video for the fade to land on
            if (video.poster) {
                video.parentElement.style.backgroundImage = `url("${video.poster}")`;
            }

            video.addEventListener('timeupdate', () => {
                const remaining = video.duration - video.currentTime;
                if (remaining > 0 && remaining < CONFIG.VIDEO_LOOP_FADE) {
                    video.classList.add('is-rewinding');
                }
            });

            video.addEventListener('ended', () => {
                video.currentTime = 0;
                this.play(video);
            });

            video.addEventListener('seeked', () => {
                if (video.currentTime < 0.3) video.classList.remove('is-rewinding');
            });

            if (!window.IntersectionObserver) {
                this.play(video);
                return;
            }

            // Play only while visible: saves battery and data
            new IntersectionObserver(([entry]) => {
                if (entry.isIntersecting) {
                    this.play(video);
                } else {
                    video.pause();
                }
            }, { threshold: 0.1 }).observe(video);
        },

        play(video) {
            const attempt = video.play();
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
        liquid(element, filterId, duration, shape, onDone) {
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
                    if (onDone) onDone();
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

        // The handle arrives warped and settles, like ink finding its edge.
        // It then rests, readable, and the ink stirs again: a slow loop that
        // runs only while the hero is on screen and the tab is visible.
        startTitleLoop(first) {
            const title = document.querySelector('.hero__name');
            if (!title || reducedMotion.matches) return;
            if (!first && this.liquidJobs.has('fx-liquid-title')) return; // already stirring

            clearTimeout(this.titleTimer);

            const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
            // On arrival it starts warped (it is fading in anyway). Afterwards
            // the distortion swells in before settling, so it never snaps.
            const swell = 0.22;
            const shape = first
                ? (t) => 90 * (1 - easeOutExpo(t))
                : (t) => (t < swell
                    ? 70 * Math.pow(t / swell, 2)
                    : 70 * (1 - easeOutExpo((t - swell) / (1 - swell))));

            this.liquid(title, 'fx-liquid-title', first ? 1700 : 2200, shape, () => {
                this.titleTimer = setTimeout(() => {
                    if (this.isHeroVisible()) this.startTitleLoop(false);
                }, CONFIG.TITLE_HOLD);
            });
        },

        stopTitleLoop() {
            clearTimeout(this.titleTimer);
        },

        isHeroVisible() {
            return !document.hidden && !document.body.classList.contains('is-past-hero');
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

            // Crossing the 4-column breakpoint: start again with full rows
            wideGrid.addEventListener('change', () => this.applyFilters());

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
            if (this.bodyFilter) {
                this.bodyFilter.value = 'all';
                CustomSelect.sync(this.bodyFilter);
            }

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
                this.displayedItems + this.getItemsPerLoad()
            );

            // The first rows are fetched straight away (the preloader waits for
            // them); everything loaded later stays lazy.
            const eager = this.displayedItems === 0;

            itemsToShow.forEach((item, index) => {
                const portfolioItem = this.createPortfolioItem(item, index, eager);
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

        createPortfolioItem(item, index, eager) {
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
            image.loading = eager ? 'eager' : 'lazy';
            image.decoding = 'async';
            image.draggable = false;
            image.sizes = CONFIG.PORTFOLIO_SIZES;
            image.srcset = `${base}-480.webp 480w, ${base}-960.webp 960w`;

            // Until the picture arrives the tile shows a soft placeholder (CSS).
            // One retry on failure, then the placeholder stays, with the logo.
            let retried = false;
            const markLoaded = () => {
                image.classList.add('is-loaded');
                portfolioItem.classList.add('has-image');
                portfolioItem.classList.remove('is-broken');
            };

            image.addEventListener('load', markLoaded);
            image.addEventListener('error', () => {
                if (retried) {
                    portfolioItem.classList.add('is-broken');
                    return;
                }
                retried = true;
                setTimeout(() => {
                    image.removeAttribute('srcset');
                    image.src = `${base}-480.webp?retry=1`;
                }, CONFIG.IMAGE_RETRY_DELAY);
            });

            image.src = `${base}-480.webp`;
            if (image.complete && image.naturalWidth > 0) markLoaded();

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

        getItemsPerLoad() {
            const perLoad = CONFIG.PORTFOLIO_ITEMS_PER_LOAD;
            return wideGrid.matches ? perLoad.wide : perLoad.narrow;
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

    // ===== FLUID LINES MODULE =====
    // Marbled ink behind the page, in the manner of the fluid tattoos: the
    // lines are the contours of a noise field that is warped by more noise
    // and drifts through time, so they bend, nest, split and rejoin with no
    // pattern and never repeat. Each stroke swells and thins along its length
    // and fades to nothing where the field goes quiet. Kept at the edge of
    // perception (see the canvas opacity). One fixed canvas behind all
    // content; a single still frame with reduced motion, paused while hidden.
    const FluidLines = {
        CELL: 10,                   // px between field samples (the curves are traced between them)
        FRAME_MS: 1000 / 30,
        SPEED: 0.000035,            // field time per millisecond: a shape lives for about half a minute
        // [contour level, weight]: weight 1 is a full stroke that swells,
        // a low weight is the hairline that runs alongside it
        LEVELS: [[-0.23, 1], [-0.185, 0.2], [0.05, 1], [0.1, 0.2], [0.29, 0.65]],
        WIDTHS: [0.5, 0.8, 1.2, 1.8, 2.6, 3.6, 4.8],
        // Which cell edges a contour crosses, per corner pattern (0 top, 1 right, 2 bottom, 3 left)
        CASES: [
            [], [3, 2], [2, 1], [3, 1], [0, 1], [0, 3, 2, 1], [0, 2], [0, 3],
            [0, 3], [0, 2], [0, 1, 3, 2], [0, 1], [3, 1], [2, 1], [3, 2], []
        ],

        init() {
            this.canvas = document.createElement('canvas');
            this.canvas.className = 'fluid-lines';
            this.canvas.setAttribute('aria-hidden', 'true');
            document.body.insertBefore(this.canvas, document.body.firstChild);

            this.context = this.canvas.getContext('2d');
            if (!this.context) return;

            this.seed();
            this.buckets = this.WIDTHS.map(() => []);
            this.refreshColor();
            this.resize();

            // ResizeObserver, not a resize listener: fires once per layout change
            if (window.ResizeObserver) {
                new ResizeObserver(() => this.resize()).observe(document.documentElement);
            }

            if (reducedMotion.matches) return; // the single frame from resize() stays

            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    cancelAnimationFrame(this.frame);
                } else {
                    this.start();
                }
            });

            this.start();
        },

        // A new shuffle on every visit: the drawing is never the same twice
        seed() {
            const table = new Uint8Array(256);
            for (let i = 0; i < 256; i++) table[i] = i;
            for (let i = 255; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                const swap = table[i];
                table[i] = table[j];
                table[j] = swap;
            }

            this.perm = new Uint8Array(512);
            for (let i = 0; i < 512; i++) this.perm[i] = table[i & 255];
            this.offset = Math.random() * 200;
        },

        // Lines take the text colour, so they are white on dark and ink on light.
        // Strokes are drawn solid and the whole canvas is faded, so overlapping
        // pieces of a line never add up to a darker spot.
        refreshColor() {
            if (!this.canvas) return;
            this.color = getComputedStyle(root).getPropertyValue('--color-text').trim() || '#f2f2f0';
            this.canvas.style.opacity = root.classList.contains('light') ? '0.085' : '0.075';
            if (this.width) this.draw(this.lastTime || 0);
        },

        resize() {
            const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
            const width = window.innerWidth;
            const height = window.innerHeight;

            if (width === this.width && height === this.height) return;

            this.width = width;
            this.height = height;
            this.cols = Math.ceil(width / this.CELL);
            this.rows = Math.ceil(height / this.CELL);
            this.values = new Float32Array((this.cols + 1) * (this.rows + 1));
            // Size of one "pool" of the field: follows the screen, within limits
            this.feature = Math.min(Math.max(Math.min(width, height) * 0.5, 240), 460);

            this.canvas.width = Math.round(width * ratio);
            this.canvas.height = Math.round(height * ratio);
            this.context.setTransform(ratio, 0, 0, ratio, 0, 0);
            this.draw(this.lastTime || 0);
        },

        start() {
            cancelAnimationFrame(this.frame);
            let last = 0;

            const tick = (now) => {
                this.frame = requestAnimationFrame(tick);
                if (now - last < this.FRAME_MS) return;
                last = now;
                this.draw(now);
            };

            this.frame = requestAnimationFrame(tick);
        },

        gradient(hash, x, y, z) {
            const h = hash & 15;
            const u = h < 8 ? x : y;
            const v = h < 4 ? y : (h === 12 || h === 14 ? x : z);
            return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
        },

        // Classic 3D gradient noise, roughly -1..1; the third axis is time
        noise(x, y, z) {
            const p = this.perm;
            const fx = Math.floor(x);
            const fy = Math.floor(y);
            const fz = Math.floor(z);
            const X = fx & 255;
            const Y = fy & 255;
            const Z = fz & 255;
            x -= fx;
            y -= fy;
            z -= fz;

            const u = x * x * x * (x * (x * 6 - 15) + 10);
            const v = y * y * y * (y * (y * 6 - 15) + 10);
            const w = z * z * z * (z * (z * 6 - 15) + 10);

            const A = p[X] + Y;
            const B = p[X + 1] + Y;
            const AA = p[A] + Z;
            const AB = p[A + 1] + Z;
            const BA = p[B] + Z;
            const BB = p[B + 1] + Z;
            const g = this.gradient;

            const x00 = g(p[AA], x, y, z);
            const x10 = g(p[AB], x, y - 1, z);
            const x01 = g(p[AA + 1], x, y, z - 1);
            const x11 = g(p[AB + 1], x, y - 1, z - 1);
            const near = x00 + u * (g(p[BA], x - 1, y, z) - x00);
            const far = x10 + u * (g(p[BB], x - 1, y - 1, z) - x10);
            const near2 = x01 + u * (g(p[BA + 1], x - 1, y, z - 1) - x01);
            const far2 = x11 + u * (g(p[BB + 1], x - 1, y - 1, z - 1) - x11);
            const front = near + v * (far - near);
            const back = near2 + v * (far2 - near2);

            return front + w * (back - front);
        },

        smooth(from, to, value) {
            const k = Math.min(Math.max((value - from) / (to - from), 0), 1);
            return k * k * (3 - 2 * k);
        },

        draw(time) {
            const { context, width, height, cols, rows, values, buckets } = this;
            if (!context || !width) return;

            this.lastTime = time;

            const cell = this.CELL;
            const scale = 1 / this.feature;
            const stretch = scale * 0.62;   // pools are taller than wide, like ink running down
            const t = this.offset + time * this.SPEED;
            // The drawing slides a little with the page instead of sitting still behind it
            const drift = reducedMotion.matches ? 0 : window.scrollY * 0.12;

            // 1. Sample the field: noise looked up through a second, slower noise
            //    (that warp is what turns blobs into marbling)
            for (let row = 0, i = 0; row <= rows; row++) {
                const v = (row * cell + drift) * stretch;
                for (let col = 0; col <= cols; col++, i++) {
                    const u = col * cell * scale;
                    const warpX = this.noise(u * 0.9 + 11.3, v * 0.9, t * 0.6);
                    const warpY = this.noise(u * 0.9, v * 0.9 + 37.7, t * 0.6 + 5.1);
                    values[i] = this.noise(u + warpX * 1.9, v + warpY * 1.9, t);
                }
            }

            // 2. Trace the contours cell by cell, sorting the pieces by stroke width
            for (let b = 0; b < buckets.length; b++) buckets[b].length = 0;

            const stride = cols + 1;
            let x0 = 0, y0 = 0, a = 0, b = 0, c = 0, d = 0, level = 0;
            let pointX = 0, pointY = 0;

            const cross = (edge) => {
                if (edge === 0) {
                    pointX = x0 + cell * (level - a) / (b - a); pointY = y0;
                } else if (edge === 1) {
                    pointX = x0 + cell; pointY = y0 + cell * (level - b) / (c - b);
                } else if (edge === 2) {
                    pointX = x0 + cell * (level - d) / (c - d); pointY = y0 + cell;
                } else {
                    pointX = x0; pointY = y0 + cell * (level - a) / (d - a);
                }
            };

            const emit = (edgeFrom, edgeTo, weight) => {
                cross(edgeFrom);
                const x1 = pointX, y1 = pointY;
                cross(edgeTo);
                const x2 = pointX, y2 = pointY;

                const u = (x1 + x2) * 0.5 * scale;
                const v = ((y1 + y2) * 0.5 + drift) * stretch;

                // Where the lines exist at all: wide areas stay empty, edges taper off
                const presence = this.smooth(-0.24, 0.12, this.noise(u * 0.5 + 50.5, v * 0.5 + 50.5, t * 0.5 + 9.2));
                if (presence <= 0) return;

                let lineWidth = 0.65;
                if (weight >= 0.5) {
                    // The stroke fattens and thins on its own, unrelated to its shape
                    const swell = this.smooth(-0.15, 0.4, this.noise(u * 1.6 + 90.1, v * 1.6, t * 0.8 + 3.3));
                    lineWidth = (0.55 + 4.2 * swell * swell) * weight;
                }
                lineWidth *= presence;
                if (lineWidth < 0.3) return;

                let index = 0;
                while (index < this.WIDTHS.length - 1 && this.WIDTHS[index] < lineWidth) index++;
                buckets[index].push(x1, y1, x2, y2);
            };

            for (let l = 0; l < this.LEVELS.length; l++) {
                level = this.LEVELS[l][0];
                const weight = this.LEVELS[l][1];

                for (let row = 0; row < rows; row++) {
                    y0 = row * cell;
                    let i = row * stride;

                    for (let col = 0; col < cols; col++, i++) {
                        a = values[i];
                        b = values[i + 1];
                        c = values[i + stride + 1];
                        d = values[i + stride];

                        const pattern = (a > level ? 8 : 0) | (b > level ? 4 : 0) | (c > level ? 2 : 0) | (d > level ? 1 : 0);
                        if (pattern === 0 || pattern === 15) continue;

                        x0 = col * cell;
                        const edges = this.CASES[pattern];
                        emit(edges[0], edges[1], weight);
                        if (edges.length === 4) emit(edges[2], edges[3], weight);
                    }
                }
            }

            // 3. One stroke call per width
            context.clearRect(0, 0, width, height);
            context.strokeStyle = this.color;
            context.lineCap = 'round';

            for (let k = 0; k < buckets.length; k++) {
                const pieces = buckets[k];
                if (!pieces.length) continue;

                context.lineWidth = this.WIDTHS[k];
                context.beginPath();
                for (let i = 0; i < pieces.length; i += 4) {
                    context.moveTo(pieces[i], pieces[i + 1]);
                    context.lineTo(pieces[i + 2], pieces[i + 3]);
                }
                context.stroke();
            }
        }
    };

    // ===== CUSTOM SELECT MODULE =====
    // Replaces the system drop-down with one drawn in the site's own style
    // (the native list ignores the theme and looks like the OS, not the site).
    // The real <select> stays in the page, hidden, as the source of truth:
    // forms, filters and browsers without JS keep working unchanged.
    const CustomSelect = {
        instances: new Map(),
        openInstance: null,

        init() {
            document.querySelectorAll('select.form__select').forEach(select => this.enhance(select));

            document.addEventListener('pointerdown', (e) => {
                if (this.openInstance && !this.openInstance.wrapper.contains(e.target)) {
                    this.close(this.openInstance);
                }
            });
        },

        enhance(select) {
            const uid = select.id || `select-${this.instances.size + 1}`;

            const wrapper = document.createElement('div');
            wrapper.className = 'select';
            select.parentNode.insertBefore(wrapper, select);
            wrapper.appendChild(select);

            const button = document.createElement('button');
            button.type = 'button';
            button.id = `${uid}-button`;
            button.className = 'form__select select__button';
            button.setAttribute('aria-haspopup', 'listbox');
            button.setAttribute('aria-expanded', 'false');
            button.setAttribute('aria-controls', `${uid}-list`);

            const value = document.createElement('span');
            value.className = 'select__value';
            button.appendChild(value);

            // Name: the visible <label> if there is one, else the select's aria-label
            const label = select.id ? document.querySelector(`label[for="${select.id}"]`) : null;
            if (label) {
                label.id = label.id || `${uid}-label`;
                button.setAttribute('aria-labelledby', `${label.id} ${button.id}`);
                label.addEventListener('click', (e) => {
                    e.preventDefault();
                    button.focus();
                });
            }

            const list = document.createElement('ul');
            list.id = `${uid}-list`;
            list.className = 'select__list';
            list.setAttribute('role', 'listbox');
            list.tabIndex = -1;
            list.hidden = true;

            const options = Array.from(select.options).map((option, index) => {
                const item = document.createElement('li');
                item.id = `${uid}-option-${index}`;
                item.className = 'select__option';
                item.setAttribute('role', 'option');
                item.dataset.index = index;
                item.textContent = option.text;
                list.appendChild(item);
                return item;
            });

            select.classList.add('select__native');
            select.tabIndex = -1;
            select.setAttribute('aria-hidden', 'true');
            wrapper.append(button, list);

            const instance = {
                select, wrapper, button, value, list, options,
                activeIndex: select.selectedIndex,
                baseLabel: label ? '' : (select.getAttribute('aria-label') || '')
            };
            this.instances.set(select, instance);

            button.addEventListener('click', () => this.toggle(instance));
            button.addEventListener('keydown', (e) => this.handleKey(instance, e));
            list.addEventListener('click', (e) => {
                const item = e.target.closest('.select__option');
                if (item) this.choose(instance, Number(item.dataset.index));
            });
            select.addEventListener('change', () => this.sync(select));

            this.sync(select);
        },

        // Bring the custom control in line with the native value
        // (call it after changing `select.value` from code)
        sync(select) {
            const instance = this.instances.get(select);
            if (!instance) return;

            const index = Math.max(select.selectedIndex, 0);
            const text = select.options[index] ? select.options[index].text : '';

            instance.value.textContent = text;
            instance.button.classList.toggle('is-placeholder', !select.value);
            if (instance.baseLabel) {
                instance.button.setAttribute('aria-label', `${instance.baseLabel}: ${text}`);
            }

            instance.options.forEach((item, i) => {
                item.setAttribute('aria-selected', String(i === index));
                item.classList.toggle('is-selected', i === index);
            });
        },

        syncAll() {
            this.instances.forEach((instance, select) => this.sync(select));
        },

        toggle(instance) {
            if (this.openInstance === instance) {
                this.close(instance);
            } else {
                this.open(instance);
            }
        },

        open(instance) {
            if (this.openInstance) this.close(this.openInstance);

            instance.list.hidden = false;
            instance.wrapper.classList.add('is-open');
            instance.button.setAttribute('aria-expanded', 'true');
            this.openInstance = instance;

            // Open upwards when there is not enough room below
            const rect = instance.button.getBoundingClientRect();
            const below = window.innerHeight - rect.bottom;
            const needed = instance.list.offsetHeight + 12;
            instance.wrapper.classList.toggle('is-up', below < needed && rect.top > below);

            this.setActive(instance, Math.max(instance.select.selectedIndex, 0));
        },

        close(instance) {
            instance.list.hidden = true;
            instance.wrapper.classList.toggle('is-open', false);
            instance.wrapper.classList.toggle('is-up', false);
            instance.button.setAttribute('aria-expanded', 'false');
            instance.button.toggleAttribute('aria-activedescendant', false);
            if (this.openInstance === instance) this.openInstance = null;
        },

        setActive(instance, index) {
            const last = instance.options.length - 1;
            instance.activeIndex = Math.min(Math.max(index, 0), last);

            instance.options.forEach((item, i) => item.classList.toggle('is-active', i === instance.activeIndex));

            const active = instance.options[instance.activeIndex];
            if (active) {
                instance.button.setAttribute('aria-activedescendant', active.id);
                active.scrollIntoView({ block: 'nearest' });
            }
        },

        choose(instance, index) {
            if (instance.select.selectedIndex !== index) {
                instance.select.selectedIndex = index;
                instance.select.dispatchEvent(new Event('change', { bubbles: true }));
            }
            this.close(instance);
            instance.button.focus();
        },

        handleKey(instance, e) {
            const isOpen = this.openInstance === instance;

            switch (e.key) {
                case 'ArrowDown':
                case 'ArrowUp': {
                    e.preventDefault();
                    if (!isOpen) {
                        this.open(instance);
                    } else {
                        this.setActive(instance, instance.activeIndex + (e.key === 'ArrowDown' ? 1 : -1));
                    }
                    break;
                }
                case 'Home':
                case 'End':
                    if (isOpen) {
                        e.preventDefault();
                        this.setActive(instance, e.key === 'Home' ? 0 : instance.options.length - 1);
                    }
                    break;
                case 'Enter':
                case ' ':
                    e.preventDefault();
                    if (isOpen) {
                        this.choose(instance, instance.activeIndex);
                    } else {
                        this.open(instance);
                    }
                    break;
                case 'Escape':
                    if (isOpen) {
                        e.preventDefault();
                        e.stopPropagation();
                        this.close(instance);
                    }
                    break;
                case 'Tab':
                    if (isOpen) this.close(instance);
                    break;
                default:
                    this.typeAhead(instance, e, isOpen);
            }
        },

        // Typing a letter jumps to the next option starting with it
        typeAhead(instance, e, isOpen) {
            if (e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey) return;

            const letter = e.key.toLowerCase();
            const count = instance.options.length;
            const from = isOpen ? instance.activeIndex : instance.select.selectedIndex;

            for (let step = 1; step <= count; step++) {
                const index = (from + step) % count;
                if (instance.options[index].textContent.trim().toLowerCase().startsWith(letter)) {
                    if (isOpen) {
                        this.setActive(instance, index);
                    } else {
                        this.choose(instance, index);
                    }
                    break;
                }
            }
        }
    };
    // ===== FORMS MODULE =====
    // Booking request in four short steps: idea, placement, references, date
    // and contacts. Where the request goes is decided in CONFIG.BOOKING: to a
    // form endpoint when one is configured, otherwise WhatsApp opens with the
    // whole request already written.
    const Forms = {
        init() {
            this.bookingForm = document.getElementById('booking-form');
            if (!this.bookingForm) return;

            this.steps = Array.from(this.bookingForm.querySelectorAll('.form__step'));
            this.progressItems = this.bookingForm.querySelectorAll('.steps__item');
            this.counter = this.bookingForm.querySelector('.steps__count');
            this.prevBtn = this.bookingForm.querySelector('[data-step-prev]');
            this.nextBtn = this.bookingForm.querySelector('[data-step-next]');
            this.submitBtn = this.bookingForm.querySelector('button[type="submit"]');
            this.donePanel = document.getElementById('booking-done');

            this.currentStep = 0;
            this.files = [];
            this.previewUrls = [];

            this.bindEvents();
            this.setupUpload();
            this.setupCalendar();

            this.bookingForm.classList.add('is-enhanced');
            this.showStep(0, false);
        },

        bindEvents() {
            this.bookingForm.addEventListener('submit', (e) => this.handleBookingSubmit(e));
            this.prevBtn?.addEventListener('click', () => this.showStep(this.currentStep - 1, true));
            this.nextBtn?.addEventListener('click', () => this.goNext());

            this.donePanel?.querySelector('[data-booking-restart]')?.addEventListener('click', () => this.restart());

            // Real-time validation
            const inputs = this.bookingForm.querySelectorAll('.form__input, .form__textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearError(input));
            });
        },

        // ----- Steps -----
        showStep(index, moveFocus) {
            const last = this.steps.length - 1;
            this.currentStep = Math.min(Math.max(index, 0), last);

            this.steps.forEach((step, i) => {
                step.hidden = i !== this.currentStep;
            });

            this.progressItems.forEach((item, i) => {
                item.classList.toggle('is-done', i < this.currentStep);
                item.classList.toggle('is-current', i === this.currentStep);
            });

            if (this.counter) this.counter.textContent = `${this.currentStep + 1} / ${this.steps.length}`;
            if (this.prevBtn) this.prevBtn.hidden = this.currentStep === 0;
            if (this.nextBtn) this.nextBtn.hidden = this.currentStep === last;
            if (this.submitBtn) this.submitBtn.hidden = this.currentStep !== last;

            if (moveFocus) {
                const legend = this.steps[this.currentStep].querySelector('.form__legend');
                legend?.focus({ preventScroll: true });
                this.bookingForm.scrollIntoView({ block: 'nearest', behavior: reducedMotion.matches ? 'auto' : 'smooth' });
            }
        },

        goNext() {
            if (this.validateStep(this.currentStep)) {
                this.showStep(this.currentStep + 1, true);
            }
        },

        validateStep(index) {
            const fields = this.steps[index].querySelectorAll('[required]');
            let firstInvalid = null;

            fields.forEach(field => {
                if (!this.validateField(field) && !firstInvalid) firstInvalid = field;
            });

            firstInvalid?.focus();
            return !firstInvalid;
        },

        restart() {
            this.bookingForm.reset();
            this.files = [];
            this.syncFiles();
            if (this.dateInput) this.dateInput.value = '';
            this.renderCalendar();
            CustomSelect.syncAll();

            this.donePanel.hidden = true;
            this.bookingForm.hidden = false;
            this.showStep(0, true);
        },

        // ----- Submit -----
        async handleBookingSubmit(e) {
            e.preventDefault();

            // Enter inside a field moves on instead of sending half a request
            if (this.currentStep < this.steps.length - 1) {
                this.goNext();
                return;
            }

            const invalidStep = this.steps.findIndex((step, i) => !this.validateStep(i));
            if (invalidStep !== -1) {
                this.showStep(invalidStep, false);
                this.validateStep(invalidStep);
                return;
            }

            const formData = new FormData(this.bookingForm);

            // Check honeypot
            if (formData.get('website')) return;

            const endpoint = CONFIG.BOOKING.ENDPOINT;

            if (!endpoint) {
                // No endpoint configured: hand the request over to WhatsApp.
                // (Opened right here, inside the click, so it is not blocked.)
                const url = this.getWhatsAppUrl();
                window.open(url, '_blank', 'noopener');
                this.showDone('whatsapp', url);
                return;
            }

            setButtonLoading(this.submitBtn, true);

            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    body: formData,
                    headers: { Accept: 'application/json' }
                });

                if (!response.ok) throw new Error(`Server replied ${response.status}`);
                this.showDone('sent');
            } catch (error) {
                this.showError("Invio non riuscito. Riprova o scrivimi su WhatsApp.");
                console.error('Form submission error:', error);
            } finally {
                setButtonLoading(this.submitBtn, false);
            }
        },

        getFieldText(name) {
            const field = this.bookingForm.elements[name];
            if (!field) return '';

            if (field.tagName === 'SELECT') {
                return field.value ? field.options[field.selectedIndex].text : '';
            }
            return (field.value || '').trim();
        },

        getDateText() {
            if (!this.dateInput || !this.dateInput.value) return '';

            const [year, month, day] = this.dateInput.value.split('-').map(Number);
            return new Date(year, month - 1, day).toLocaleDateString('it-IT', {
                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
            });
        },

        // The whole request as a ready-to-send WhatsApp message
        getWhatsAppUrl() {
            const date = this.getDateText();
            const time = this.getFieldText('preferred-time');
            const budget = this.getFieldText('budget');

            const lines = [
                'Ciao Sken! Vorrei prenotare un tatuaggio.',
                '',
                ['Nome', this.getFieldText('name')],
                ['Stile', this.getFieldText('tattoo-type')],
                ['Zona', this.getFieldText('body-area')],
                ['Dimensioni', this.getFieldText('size')],
                ['Idea', this.getFieldText('message')],
                ['Budget', /^\d+([.,]\d+)?$/.test(budget) ? `${budget} €` : budget],
                ['Data preferita', date ? (time ? `${date} (${time})` : date) : ''],
                ['Email', this.getFieldText('email')],
                ['Telefono', this.getFieldText('phone')],
                ['Foto di riferimento', this.files.length ? `${this.files.length}, le allego qui sotto` : '']
            ]
                .filter(line => typeof line === 'string' || line[1])
                .map(line => (typeof line === 'string' ? line : `${line[0]}: ${line[1]}`));

            return `https://wa.me/${CONFIG.BOOKING.WHATSAPP}?text=${encodeURIComponent(lines.join('\n'))}`;
        },

        showDone(mode, url) {
            const title = this.donePanel.querySelector('.booking__done-title');
            const text = this.donePanel.querySelector('.booking__done-text');
            const link = this.donePanel.querySelector('.booking__done-link');

            if (mode === 'whatsapp') {
                title.textContent = 'Manca solo un tocco';
                const count = this.files.length;
                const attach = count === 1
                    ? 'allega lì la foto di riferimento'
                    : `allega lì le ${count} foto di riferimento`;

                text.textContent = count
                    ? `Si è aperto WhatsApp con la tua richiesta già scritta: premi invia e ${attach}.`
                    : 'Si è aperto WhatsApp con la tua richiesta già scritta: premi invia e ti rispondo appena possibile.';
                link.href = url;
                link.hidden = false;
            } else {
                title.textContent = 'Richiesta inviata';
                text.textContent = 'Grazie! Ti rispondo appena possibile per confermare data e dettagli.';
                link.hidden = true;
            }

            this.bookingForm.hidden = true;
            this.donePanel.hidden = false;
            this.donePanel.focus({ preventScroll: true });
            this.donePanel.scrollIntoView({ block: 'nearest' });
        },
        // ----- Reference pictures -----
        setupUpload() {
            this.fileInput = this.bookingForm.querySelector('#references');
            this.dropZone = this.bookingForm.querySelector('.upload');
            this.fileList = this.bookingForm.querySelector('.upload__list');
            this.fileError = document.getElementById('references-error');
            if (!this.fileInput || !this.dropZone) return;

            this.fileInput.addEventListener('change', () => this.addFiles(this.fileInput.files));

            ['dragenter', 'dragover'].forEach(type => {
                this.dropZone.addEventListener(type, (e) => {
                    e.preventDefault();
                    this.dropZone.classList.add('is-dragover');
                });
            });

            ['dragleave', 'drop'].forEach(type => {
                this.dropZone.addEventListener(type, (e) => {
                    e.preventDefault();
                    this.dropZone.classList.toggle('is-dragover', false);
                });
            });

            this.dropZone.addEventListener('drop', (e) => this.addFiles(e.dataTransfer.files));

            this.fileList.addEventListener('click', (e) => {
                const button = e.target.closest('[data-file-index]');
                if (!button) return;

                this.files.splice(Number(button.dataset.fileIndex), 1);
                this.fileError.textContent = '';
                this.syncFiles();
                this.fileInput.focus();
            });
        },

        addFiles(fileList) {
            const { MAX_FILES, MAX_FILE_MB } = CONFIG.BOOKING;
            let message = '';

            Array.from(fileList).forEach(file => {
                if (!file.type.startsWith('image/')) {
                    message = 'Puoi allegare solo immagini.';
                } else if (file.size > MAX_FILE_MB * 1024 * 1024) {
                    message = `Ogni immagine può pesare al massimo ${MAX_FILE_MB} MB.`;
                } else if (this.files.length >= MAX_FILES) {
                    message = `Puoi allegare fino a ${MAX_FILES} immagini.`;
                } else if (!this.files.some(f => f.name === file.name && f.size === file.size)) {
                    this.files.push(file);
                }
            });

            this.fileError.textContent = message;
            this.syncFiles();
        },

        syncFiles() {
            if (!this.fileInput) return;

            // Keep the real input in step with the list, so the pictures travel with the form
            try {
                const transfer = new DataTransfer();
                this.files.forEach(file => transfer.items.add(file));
                this.fileInput.files = transfer.files;
            } catch (e) { /* older browsers: the list is still shown, files go via WhatsApp */ }

            this.previewUrls.forEach(url => URL.revokeObjectURL(url));
            this.previewUrls = this.files.map(file => URL.createObjectURL(file));

            this.fileList.textContent = '';
            this.files.forEach((file, index) => {
                const item = document.createElement('li');
                item.className = 'upload__item';

                const thumb = document.createElement('img');
                thumb.className = 'upload__thumb';
                thumb.src = this.previewUrls[index];
                thumb.alt = '';

                const name = document.createElement('span');
                name.className = 'upload__name';
                name.textContent = file.name;

                const size = document.createElement('span');
                size.className = 'upload__size';
                size.textContent = `${(file.size / (1024 * 1024)).toFixed(1).replace('.', ',')} MB`;

                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'upload__discard';
                button.dataset.fileIndex = index;
                button.setAttribute('aria-label', `Togli ${file.name}`);
                button.innerHTML = '<span class="icon-close"></span>';

                item.append(thumb, name, size, button);
                this.fileList.appendChild(item);
            });

            this.fileList.hidden = this.files.length === 0;
        },

        // ----- Preferred date -----
        // A small calendar in the site's own style. It collects a preference,
        // not a confirmed slot: past days and Sundays (studio closed) are off.
        setupCalendar() {
            this.calendar = document.getElementById('booking-calendar');
            this.dateInput = this.bookingForm.querySelector('[name="preferred-date"]');
            if (!this.calendar || !this.dateInput) return;

            const today = new Date();
            this.calendarMin = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
            this.calendarView = new Date(this.calendarMin.getFullYear(), this.calendarMin.getMonth(), 1);
            this.calendarLast = new Date(today.getFullYear(), today.getMonth() + CONFIG.BOOKING.MONTHS_AHEAD, 1);

            this.calendar.addEventListener('click', (e) => {
                const nav = e.target.closest('[data-calendar-nav]');
                const day = e.target.closest('[data-date]');

                if (nav) {
                    const direction = Number(nav.dataset.calendarNav);
                    this.calendarView = new Date(this.calendarView.getFullYear(), this.calendarView.getMonth() + direction, 1);
                    this.renderCalendar();
                    this.calendar.querySelector(`[data-calendar-nav="${direction}"]:not(:disabled)`)?.focus();
                } else if (day) {
                    // A second click on the chosen day clears the preference
                    this.dateInput.value = this.dateInput.value === day.dataset.date ? '' : day.dataset.date;
                    this.renderCalendar();
                    this.calendar.querySelector(`[data-date="${day.dataset.date}"]`)?.focus();
                }
            });

            this.renderCalendar();
        },

        renderCalendar() {
            if (!this.calendar) return;

            const year = this.calendarView.getFullYear();
            const month = this.calendarView.getMonth();
            const pad = (n) => String(n).padStart(2, '0');

            const monthLabel = this.calendarView.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' });
            const offset = (new Date(year, month, 1).getDay() + 6) % 7; // weeks start on Monday
            const daysInMonth = new Date(year, month + 1, 0).getDate();

            const atStart = this.calendarView <= new Date(this.calendarMin.getFullYear(), this.calendarMin.getMonth(), 1);
            const atEnd = this.calendarView >= this.calendarLast;

            let cells = '<span class="calendar__blank"></span>'.repeat(offset);

            for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(year, month, day);
                const iso = `${year}-${pad(month + 1)}-${pad(day)}`;
                const isOff = date < this.calendarMin || date.getDay() === 0;
                const isSelected = iso === this.dateInput.value;
                const label = date.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' });

                cells += `<button type="button" class="calendar__day${isSelected ? ' is-selected' : ''}" data-date="${iso}" aria-label="${label}" aria-pressed="${isSelected}"${isOff ? ' disabled' : ''}>${day}</button>`;
            }

            const weekdays = ['L', 'M', 'M', 'G', 'V', 'S', 'D']
                .map(letter => `<span class="calendar__weekday" aria-hidden="true">${letter}</span>`)
                .join('');

            const choice = this.getDateText();

            this.calendar.innerHTML = `
                <div class="calendar__header">
                    <button type="button" class="calendar__nav" data-calendar-nav="-1" aria-label="Mese precedente"${atStart ? ' disabled' : ''}><span class="icon-arrow icon-arrow--left"></span></button>
                    <span class="calendar__month" aria-live="polite">${monthLabel}</span>
                    <button type="button" class="calendar__nav" data-calendar-nav="1" aria-label="Mese successivo"${atEnd ? ' disabled' : ''}><span class="icon-arrow"></span></button>
                </div>
                <div class="calendar__grid">${weekdays}${cells}</div>
                <p class="calendar__choice" aria-live="polite">${choice ? `Preferenza: ${choice}` : 'Nessuna data scelta'}</p>
            `;
        },

        // ----- Validation -----
        validateField(field) {
            const value = field.value.trim();
            let errorMessage = '';

            // Clear previous errors
            this.clearError(field);

            // Required field validation
            if (field.hasAttribute('required') && !value) {
                errorMessage = 'Questo campo è obbligatorio';
            }
            // Email validation
            else if (field.name === 'email' && value && !this.isValidEmail(value)) {
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
            field.classList.toggle('error', false);
            field.toggleAttribute('aria-invalid', false);
        },

        // ----- Notifications -----
        showError(message) {
            this.showNotification(message, 'error');
        },

        showNotification(message, type) {
            const notification = document.createElement('div');
            notification.className = `notification notification--${type}`;
            notification.setAttribute('role', type === 'error' ? 'alert' : 'status');
            notification.innerHTML = `
                <div class="notification__content">
                    <p></p>
                    <button class="notification__close" type="button" aria-label="Chiudi notifica">&times;</button>
                </div>
            `;
            notification.querySelector('p').textContent = message;

            document.body.appendChild(notification);
            setTimeout(() => notification.classList.add('show'), 100);

            const dismiss = () => {
                clearTimeout(timer);
                notification.classList.add('hide');
                setTimeout(() => detach(notification), 400);
            };
            const timer = setTimeout(dismiss, 6000);

            notification.querySelector('.notification__close').addEventListener('click', dismiss);
        }
    };
    // ===== SCROLL ANIMATIONS MODULE =====
    const ScrollAnimations = {
        init() {
            this.setupReveal();
            this.setupPlaceholders();
            this.setupFloatingActions();
        },

        // Static pictures get the same loading placeholder as the portfolio
        setupPlaceholders() {
            document.querySelectorAll('.about__photo').forEach(image => {
                const frame = image.parentElement;
                const markLoaded = () => frame.classList.add('has-image');

                if (image.complete && image.naturalWidth > 0) {
                    markLoaded();
                } else {
                    image.addEventListener('load', markLoaded, { once: true });
                }
            });
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
                const wasPast = document.body.classList.contains('is-past-hero');
                document.body.classList.toggle('is-past-hero', isPast);
                this.backToTopBtn?.classList.toggle('visible', isPast);

                // The title loop rests while the hero is away and resumes with it
                if (isPast) {
                    Effects.stopTitleLoop();
                } else if (wasPast) {
                    Effects.startTitleLoop(false);
                }
            };

            if (!hero || !window.IntersectionObserver) {
                setPastHero(true);
            } else {
                new IntersectionObserver(([entry]) => {
                    setPastHero(!entry.isIntersecting);
                }, { threshold: 0.25 }).observe(hero);
            }

            document.addEventListener('visibilitychange', () => {
                if (Effects.isHeroVisible() && root.classList.contains('is-ready')) {
                    Effects.startTitleLoop(false);
                }
            });

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
            Navigation, Theme, FluidLines, LoopingVideos, CustomSelect, Portfolio, Lightbox,
            FAQ, Forms, ScrollAnimations, Accessibility
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
            Effects.startTitleLoop(true);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeApp);
    } else {
        initializeApp();
    }

})();
