// ===== MAIN JAVASCRIPT FILE =====
// Author: @sken.blk website
// Description: Modern, accessible, and performant JavaScript for tattoo artist portfolio

(function() {
    'use strict';

    // ===== PRELOADER SYSTEM =====
    const PreloaderSystem = {
        totalAssets: 0,
        loadedAssets: 0,
        progressBar: null,
        progressText: null,
        preloader: null,

        init() {
            this.progressBar = document.getElementById('progress-bar');
            this.progressText = document.getElementById('progress-text');
            this.preloader = document.getElementById('preloader');
            
            // Safety timeout - hide preloader after max 10 seconds
            this.safetyTimeout = setTimeout(() => {
                console.warn('Preloader timeout reached, force showing website');
                this.onAllAssetsLoaded();
            }, 10000);
            
            // Preload critical assets
            this.preloadAssets();
        },

        async preloadAssets() {
            const criticalAssets = this.getCriticalAssets();
            this.totalAssets = criticalAssets.length;

            console.log(`Preloading ${this.totalAssets} critical assets...`);

            // Preload all assets in parallel but track progress
            const promises = criticalAssets.map(asset => this.loadAsset(asset));
            
            try {
                await Promise.allSettled(promises);
                this.onAllAssetsLoaded();
            } catch (error) {
                console.warn('Some assets failed to load:', error);
                this.onAllAssetsLoaded(); // Still proceed to show the site
            }
        },

        getCriticalAssets() {
            const assets = [];

            // Hero images and videos
            assets.push('./assets/images/artist-photo.jpg');
            assets.push('./assets/images/videos/kling_20250820_Image_to_Video__5915_0.mp4');
            assets.push('./assets/images/videos/3b47eaae-5fba-4cac-96b2-6926e8ec99b5.mp4');
            
            // Portfolio images (first load)
            const portfolioImages = [
                './assets/images/portfolio/braccio_1.jpg',
                './assets/images/portfolio/braccio_2.jpg',
                './assets/images/portfolio/braccio_3.jpg',
                './assets/images/portfolio/gamba_1.jpg',
                './assets/images/portfolio/gamba_2.jpg',
                './assets/images/portfolio/gamba_3.jpg',
                './assets/images/portfolio/torso_1.jpg',
                './assets/images/portfolio/torso_2.jpg',
                './assets/images/portfolio/schiena_1.jpg',
                './assets/images/portfolio/schiena_2.jpg',
                './assets/images/portfolio/collo_1.jpg',
                './assets/images/portfolio/viso_1.jpg'
            ];
            
            assets.push(...portfolioImages);
            
            // Essential UI images
            assets.push('./assets/images/favicon.png');
            assets.push('./assets/images/og-image.jpg');

            return assets;
        },

        loadAsset(src) {
            return new Promise((resolve, reject) => {
                const isVideo = src.includes('.mp4') || src.includes('.webm');
                const element = isVideo ? document.createElement('video') : document.createElement('img');
                
                const onLoad = () => {
                    this.loadedAssets++;
                    this.updateProgress();
                    resolve(src);
                };

                const onError = () => {
                    console.warn(`Failed to load asset: ${src}`);
                    this.loadedAssets++;
                    this.updateProgress();
                    resolve(src); // Resolve anyway to not block the loading
                };

                if (isVideo) {
                    element.addEventListener('canplaythrough', onLoad, { once: true });
                    element.addEventListener('error', onError, { once: true });
                    element.muted = true;
                    element.preload = 'metadata';
                } else {
                    element.addEventListener('load', onLoad, { once: true });
                    element.addEventListener('error', onError, { once: true });
                }

                element.src = src;
            });
        },

        updateProgress() {
            const percentage = Math.round((this.loadedAssets / this.totalAssets) * 100);
            
            if (this.progressBar) {
                this.progressBar.style.width = `${percentage}%`;
            }
            
            if (this.progressText) {
                this.progressText.textContent = `${percentage}%`;
            }

            console.log(`Loading progress: ${this.loadedAssets}/${this.totalAssets} (${percentage}%)`);
        },

        onAllAssetsLoaded() {
            console.log('All critical assets loaded!');
            
            // Clear safety timeout
            if (this.safetyTimeout) {
                clearTimeout(this.safetyTimeout);
            }
            
            // Ensure 100% is shown
            if (this.progressBar) {
                this.progressBar.style.width = '100%';
            }
            if (this.progressText) {
                this.progressText.textContent = '100%';
            }

            // Wait a moment then hide preloader
            setTimeout(() => {
                this.hidePreloader();
            }, 500);
        },

        hidePreloader() {
            document.body.classList.remove('loading');
            
            if (this.preloader) {
                this.preloader.classList.add('hidden');
                
                // Remove preloader from DOM after animation
                setTimeout(() => {
                    if (this.preloader && this.preloader.parentNode) {
                        this.preloader.parentNode.removeChild(this.preloader);
                    }
                }, 500);
            }

            // Initialize main application
            initializeApp();
        }
    };

    // ===== CONSTANTS & CONFIGURATION =====
    const CONFIG = {
        ANIMATION_DURATION: 300,
        DEBOUNCE_DELAY: 250,
        INTERSECTION_THRESHOLD: 0.1,
        LAZY_LOAD_MARGIN: '50px',
        PORTFOLIO_ITEMS_PER_LOAD: 6,
    };

    // ===== UTILITY FUNCTIONS =====
    
    /**
     * Debounce function to limit the rate of function execution
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Throttle function for scroll events
     */
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Check if element is in viewport
     */
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    /**
     * Smooth scroll to element
     */
    function smoothScrollTo(element, offset = 80) {
        const elementPosition = element.offsetTop - offset;
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    }

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

    // ===== PORTFOLIO DATA =====
    const portfolioData = [
        {
            id: 1,
            title: 'Dark Creation I',
            style: 'dark',
            area: 'polpaccio',
            year: '2024',
            duration: '5h',
            image: './assets/images/portfolio/IMG_0092.jpeg',
            thumbnail: './assets/images/portfolio/IMG_0092.jpeg',
            description: 'Opera dark realizzata sul polpaccio con dettagli intricati'
        },
        {
            id: 2,
            title: 'Blackwork Masterpiece',
            style: 'blackwork',
            area: 'spalla',
            year: '2024',
            duration: '8h',
            image: './assets/images/portfolio/IMG_3407.jpeg',
            thumbnail: './assets/images/portfolio/IMG_3407.jpeg',
            description: 'Complessa composizione blackwork sulla spalla posteriore'
        },
        {
            id: 3,
            title: 'Fluid Anatomy',
            style: 'fluid',
            area: 'orecchio',
            year: '2024',
            duration: '6h',
            image: './assets/images/portfolio/IMG_3605.jpeg',
            thumbnail: './assets/images/portfolio/IMG_3605.jpeg',
            description: 'Design fluido delicato per l\'area dell\'orecchio'
        },
        {
            id: 4,
            title: 'Dark Portrait',
            style: 'dark',
            area: 'braccio',
            year: '2024',
            duration: '7h',
            image: './assets/images/portfolio/IMG_3634.jpeg',
            thumbnail: './assets/images/portfolio/IMG_3634.jpeg',
            description: 'Ritratto dark dettagliato sul braccio'
        },
        {
            id: 5,
            title: 'Geometric Flow',
            style: 'blackwork',
            area: 'dita',
            year: '2024',
            duration: '4h',
            image: './assets/images/portfolio/IMG_3774.jpeg',
            thumbnail: './assets/images/portfolio/IMG_3774.jpeg',
            description: 'Geometrie precise sulle dita in blackwork contemporaneo'
        },
        {
            id: 6,
            title: 'Dark Nature',
            style: 'dark',
            area: 'avambraccio',
            year: '2024',
            duration: '9h',
            image: './assets/images/portfolio/IMG_4738.jpeg',
            thumbnail: './assets/images/portfolio/IMG_4738.jpeg',
            description: 'Elementi naturali dark sull\'avambraccio'
        },
        {
            id: 7,
            title: 'Fluid Expression',
            style: 'fluid',
            area: 'braccio',
            year: '2024',
            duration: '5h',
            image: './assets/images/portfolio/IMG_4934.jpeg',
            thumbnail: './assets/images/portfolio/IMG_4934.jpeg',
            description: 'Espressione artistica fluida sul braccio'
        },
        {
            id: 8,
            title: 'Minimalist Black',
            style: 'blackwork',
            area: 'braccio',
            year: '2024',
            duration: '3h',
            image: './assets/images/portfolio/IMG_4952.jpeg',
            thumbnail: './assets/images/portfolio/IMG_4952.jpeg',
            description: 'Minimalismo blackwork sul braccio'
        },
        {
            id: 9,
            title: 'Dark Composition',
            style: 'dark',
            area: 'polso',
            year: '2024',
            duration: '6h',
            image: './assets/images/portfolio/IMG_5006_jpg.jpeg',
            thumbnail: './assets/images/portfolio/IMG_5006_jpg.jpeg',
            description: 'Composizione dark dettagliata sul polso'
        },
        {
            id: 10,
            title: 'Abstract Flow',
            style: 'fluid',
            area: 'braccio',
            year: '2024',
            duration: '7h',
            image: './assets/images/portfolio/IMG_5451.jpeg',
            thumbnail: './assets/images/portfolio/IMG_5451.jpeg',
            description: 'Astrattismo fluido che valorizza il braccio'
        },
        {
            id: 11,
            title: 'Precision Work',
            style: 'blackwork',
            area: 'avambraccio',
            year: '2024',
            duration: '4h',
            image: './assets/images/portfolio/IMG_6251.jpeg',
            thumbnail: './assets/images/portfolio/IMG_6251.jpeg',
            description: 'Lavoro di precisione sull\'avambraccio'
        },
        {
            id: 12,
            title: 'Digital Art I',
            style: 'dark',
            area: 'braccio',
            year: '2024',
            duration: '2h',
            image: './assets/images/portfolio/IMG_6651.png',
            thumbnail: './assets/images/portfolio/IMG_6651.png',
            description: 'Design digitale dark sul braccio'
        },
        {
            id: 13,
            title: 'Modern Geometry',
            style: 'blackwork',
            area: 'braccio',
            year: '2024',
            duration: '5h',
            image: './assets/images/portfolio/IMG_6652.png',
            thumbnail: './assets/images/portfolio/IMG_6652.png',
            description: 'Geometrie moderne blackwork sul braccio'
        },
        {
            id: 14,
            title: 'Dark Vision',
            style: 'dark',
            area: 'braccio',
            year: '2024',
            duration: '8h',
            image: './assets/images/portfolio/IMG_6653.png',
            thumbnail: './assets/images/portfolio/IMG_6653.png',
            description: 'Visione dark realizzata sul braccio'
        },
        {
            id: 15,
            title: 'Fluid Design',
            style: 'fluid',
            area: 'polpaccio',
            year: '2024',
            duration: '6h',
            image: './assets/images/portfolio/IMG_6655.png',
            thumbnail: './assets/images/portfolio/IMG_6655.png',
            description: 'Design fluido che valorizza il polpaccio'
        },
        {
            id: 16,
            title: 'Complex Pattern',
            style: 'blackwork',
            area: 'polpaccio',
            year: '2024',
            duration: '7h',
            image: './assets/images/portfolio/IMG_6656.png',
            thumbnail: './assets/images/portfolio/IMG_6656.png',
            description: 'Pattern complesso blackwork sul polpaccio'
        },
        {
            id: 17,
            title: 'Artistic Expression',
            style: 'dark',
            area: 'braccio',
            year: '2024',
            duration: '9h',
            image: './assets/images/portfolio/IMG_6657.png',
            thumbnail: './assets/images/portfolio/IMG_6657.png',
            description: 'Espressione artistica dark sul braccio'
        },
        {
            id: 18,
            title: 'Creative Flow - Bozza',
            style: 'fluid',
            area: 'bozza',
            year: '2024',
            duration: '5h',
            image: './assets/images/portfolio/IMG_7301.png',
            thumbnail: './assets/images/portfolio/IMG_7301.png',
            description: 'Bozza creativa per design fluido'
        },
        {
            id: 19,
            title: 'Bold Statement - Bozza',
            style: 'blackwork',
            area: 'bozza',
            year: '2024',
            duration: '4h',
            image: './assets/images/portfolio/IMG_7797.png',
            thumbnail: './assets/images/portfolio/IMG_7797.png',
            description: 'Bozza per statement blackwork audace'
        },
        {
            id: 20,
            title: 'Masterwork Series I - Bozza',
            style: 'dark',
            area: 'bozza',
            year: '2024',
            duration: '8h',
            image: './assets/images/portfolio/IMG_8330.png',
            thumbnail: './assets/images/portfolio/IMG_8330.png',
            description: 'Prima bozza della serie masterwork dark'
        },
        {
            id: 21,
            title: 'Masterwork Series II - Bozza',
            style: 'blackwork',
            area: 'bozza',
            year: '2024',
            duration: '7h',
            image: './assets/images/portfolio/IMG_8331.png',
            thumbnail: './assets/images/portfolio/IMG_8331.png',
            description: 'Seconda bozza della serie masterwork'
        },
        {
            id: 22,
            title: 'Fluid Masterwork - Bozza',
            style: 'fluid',
            area: 'bozza',
            year: '2024',
            duration: '10h',
            image: './assets/images/portfolio/IMG_8332.png',
            thumbnail: './assets/images/portfolio/IMG_8332.png',
            description: 'Bozza per masterwork fluido di grande impatto'
        },
        {
            id: 23,
            title: 'Dark Evolution - Bozza',
            style: 'dark',
            area: 'bozza',
            year: '2024',
            duration: '6h',
            image: './assets/images/portfolio/IMG_8333.png',
            thumbnail: './assets/images/portfolio/IMG_8333.png',
            description: 'Bozza per evoluzione del stile dark personale'
        },
        {
            id: 24,
            title: 'Contemporary Art - Bozza',
            style: 'blackwork',
            area: 'bozza',
            year: '2024',
            duration: '5h',
            image: './assets/images/portfolio/IMG_8334.png',
            thumbnail: './assets/images/portfolio/IMG_8334.png',
            description: 'Bozza per arte contemporanea blackwork'
        },
        {
            id: 25,
            title: 'Signature Work',
            style: 'fluid',
            area: 'gamba',
            year: '2024',
            duration: '8h',
            image: './assets/images/portfolio/IMG_8335.png',
            thumbnail: './assets/images/portfolio/IMG_8335.png',
            description: 'Opera firma dell\'artista su gamba'
        },
        {
            id: 26,
            title: 'Final Creation',
            style: 'fluid',
            area: 'gamba',
            year: '2024',
            duration: '4h',
            image: './assets/images/IMG_8481.webp',
            thumbnail: './assets/images/IMG_8481.webp',
            description: 'Creazione finale che rappresenta l\'evoluzione stilistica'
        },
        {
            id: 27,
            title: 'Artistic Vision',
            style: 'blackwork',
            area: 'braccio',
            year: '2024',
            duration: '7h',
            image: './assets/images/portfolio/IMG_8379.jpeg',
            thumbnail: './assets/images/portfolio/IMG_8379.jpeg',
            description: 'Visione artistica blackwork sul braccio'
        },
        {
            id: 28,
            title: 'Innovative Design',
            style: 'dark',
            area: 'gamba',
            year: '2024',
            duration: '9h',
            image: './assets/images/portfolio/IMG_8347.png',
            thumbnail: './assets/images/portfolio/IMG_8347.png',
            description: 'Design innovativo dark sulla gamba'
        }
    ];

    // ===== NAVIGATION MODULE =====
    const Navigation = {
        init() {
            this.nav = document.querySelector('.nav');
            this.navToggle = document.getElementById('nav-toggle');
            this.navMenu = document.getElementById('nav-menu');
            this.navLinks = document.querySelectorAll('.nav__link');
            
            this.bindEvents();
            this.setupScrollDetection();
        },

        bindEvents() {
            // Mobile menu toggle
            if (this.navToggle && this.navMenu) {
                this.navToggle.addEventListener('click', () => this.toggleMobileMenu());
            }

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!this.nav.contains(e.target) && this.navMenu.classList.contains('active')) {
                    this.closeMobileMenu();
                }
            });

            // Smooth scroll for navigation links
            this.navLinks.forEach(link => {
                link.addEventListener('click', (e) => this.handleNavClick(e));
            });

            // Keyboard navigation
            this.navToggle?.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleMobileMenu();
                }
            });
        },

        toggleMobileMenu() {
            const isOpen = this.navToggle.getAttribute('aria-expanded') === 'true';
            
            this.navToggle.setAttribute('aria-expanded', !isOpen);
            this.navMenu.classList.toggle('active');
            
            // Trap focus in mobile menu
            if (!isOpen) {
                this.navLinks[0]?.focus();
            }
        },

        closeMobileMenu() {
            this.navToggle.setAttribute('aria-expanded', 'false');
            this.navMenu.classList.remove('active');
        },

        handleNavClick(e) {
            e.preventDefault();
            
            const href = e.target.getAttribute('href');
            if (!href.startsWith('#')) return;

            const targetElement = document.querySelector(href);
            if (targetElement) {
                smoothScrollTo(targetElement);
                this.closeMobileMenu();
                this.setActiveLink(e.target);
            }
        },

        setActiveLink(activeLink) {
            this.navLinks.forEach(link => link.classList.remove('active'));
            activeLink.classList.add('active');
        },

        setupScrollDetection() {
            const scrollHandler = throttle(() => {
                // Add scrolled class to nav
                if (window.scrollY > 50) {
                    this.nav.classList.add('scrolled');
                } else {
                    this.nav.classList.remove('scrolled');
                }

                // Update active navigation link
                this.updateActiveNavLink();
            }, 100);

            window.addEventListener('scroll', scrollHandler);
        },

        updateActiveNavLink() {
            const sections = document.querySelectorAll('section[id]');
            const scrollPosition = window.scrollY + 100;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    const activeLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);
                    if (activeLink) {
                        this.setActiveLink(activeLink);
                    }
                }
            });
        }
    };

    // ===== THEME MODULE =====
    const Theme = {
        init() {
            this.themeToggle = document.getElementById('theme-toggle');
            this.currentTheme = localStorage.getItem('theme') || 'dark';
            
            this.setTheme(this.currentTheme);
            this.bindEvents();
        },

        bindEvents() {
            this.themeToggle?.addEventListener('click', () => this.toggleTheme());
        },

        setTheme(theme) {
            document.documentElement.className = theme;
            localStorage.setItem('theme', theme);
            this.currentTheme = theme;

            // Update theme toggle aria-label
            if (this.themeToggle) {
                const label = theme === 'dark' ? 'Passa al tema chiaro' : 'Passa al tema scuro';
                this.themeToggle.setAttribute('aria-label', label);
            }
        },

        toggleTheme() {
            const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
            this.setTheme(newTheme);
        }
    };

    // ===== PORTFOLIO MODULE =====
    const Portfolio = {
        init() {
            this.portfolioGrid = document.getElementById('portfolio-grid');
            this.filterButtons = document.querySelectorAll('.filter-btn');
            this.bodyFilter = document.getElementById('body-filter');
            this.loadMoreBtn = document.getElementById('load-more');
            
            this.currentFilters = {
                style: 'all',
                area: 'all'
            };
            this.displayedItems = 0;
            this.filteredData = [...portfolioData];

            this.renderPortfolio();
            this.bindEvents();
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

            // Portfolio item clicks (for lightbox)
            this.portfolioGrid?.addEventListener('click', (e) => {
                const portfolioItem = e.target.closest('.portfolio__item');
                if (portfolioItem) {
                    const itemId = parseInt(portfolioItem.dataset.id);
                    Lightbox.open(itemId);
                }
            });
        },

        handleStyleFilter(button) {
            const filter = button.getAttribute('data-filter');
            
            // Update active button
            this.filterButtons.forEach(btn => btn.classList.remove('filter-btn--active'));
            button.classList.add('filter-btn--active');
            
            this.currentFilters.style = filter;
            this.applyFilters();
        },

        handleBodyFilter() {
            this.currentFilters.area = this.bodyFilter.value;
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
                this.portfolioGrid.innerHTML = '';
            }

            const itemsToShow = this.filteredData.slice(
                this.displayedItems, 
                this.displayedItems + CONFIG.PORTFOLIO_ITEMS_PER_LOAD
            );

            itemsToShow.forEach(item => {
                const portfolioItem = this.createPortfolioItem(item);
                this.portfolioGrid.appendChild(portfolioItem);
            });

            this.displayedItems += itemsToShow.length;

            // Show/hide load more button
            if (this.displayedItems >= this.filteredData.length) {
                this.loadMoreBtn?.classList.add('hidden');
            } else {
                this.loadMoreBtn?.classList.remove('hidden');
            }

            // Trigger animation for new items
            this.animateNewItems();
        },

        createPortfolioItem(item) {
            const portfolioItem = document.createElement('div');
            portfolioItem.className = 'portfolio__item animate-on-scroll';
            portfolioItem.setAttribute('data-id', item.id);
            portfolioItem.setAttribute('data-style', item.style);
            portfolioItem.setAttribute('data-area', item.area);

            portfolioItem.innerHTML = `
                <img 
                    src="${item.thumbnail}" 
                    alt="${item.title}" 
                    class="portfolio__image"
                    loading="lazy"
                    data-full-image="${item.image}"
                >
                <div class="portfolio__overlay">
                    <div class="portfolio__info">
                        <div class="portfolio__style">${this.getStyleLabel(item.style)}</div>
                        <div class="portfolio__area">${this.getAreaLabel(item.area)}</div>
                    </div>
                </div>
            `;

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

        loadMore() {
            setButtonLoading(this.loadMoreBtn, true);
            
            // Simulate network delay
            setTimeout(() => {
                this.renderPortfolio();
                setButtonLoading(this.loadMoreBtn, false);
            }, 500);
        },

        animateNewItems() {
            const newItems = this.portfolioGrid.querySelectorAll('.portfolio__item:not(.animated)');
            
            newItems.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('animated');
                }, index * 100);
            });
        }
    };

    // ===== LIGHTBOX MODULE =====
    const Lightbox = {
        init() {
            this.lightbox = document.getElementById('lightbox');
            this.lightboxImage = this.lightbox?.querySelector('.lightbox__image');
            this.lightboxTitle = this.lightbox?.querySelector('.lightbox__title');
            this.lightboxStyle = this.lightbox?.querySelector('.lightbox__style');
            this.lightboxArea = this.lightbox?.querySelector('.lightbox__area');
            this.lightboxYear = this.lightbox?.querySelector('.lightbox__year');
            this.lightboxDuration = this.lightbox?.querySelector('.lightbox__duration');
            this.lightboxDescription = this.lightbox?.querySelector('.lightbox__description');
            
            this.closeBtn = this.lightbox?.querySelector('.lightbox__close');
            this.prevBtn = this.lightbox?.querySelector('.lightbox__prev');
            this.nextBtn = this.lightbox?.querySelector('.lightbox__next');
            this.overlay = this.lightbox?.querySelector('.lightbox__overlay');

            this.currentIndex = 0;
            this.currentData = [];

            this.bindEvents();
        },

        bindEvents() {
            // Close lightbox
            this.closeBtn?.addEventListener('click', () => this.close());
            this.overlay?.addEventListener('click', () => this.close());

            // Navigation
            this.prevBtn?.addEventListener('click', () => this.prev());
            this.nextBtn?.addEventListener('click', () => this.next());

            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (this.lightbox?.classList.contains('active')) {
                    switch(e.key) {
                        case 'Escape':
                            this.close();
                            break;
                        case 'ArrowLeft':
                            this.prev();
                            break;
                        case 'ArrowRight':
                            this.next();
                            break;
                    }
                }
            });

            // Touch gestures for mobile
            let startX = 0;
            let endX = 0;

            this.lightbox?.addEventListener('touchstart', (e) => {
                startX = e.changedTouches[0].screenX;
            });

            this.lightbox?.addEventListener('touchend', (e) => {
                endX = e.changedTouches[0].screenX;
                this.handleSwipe(startX, endX);
            });
        },

        handleSwipe(startX, endX) {
            const threshold = 50;
            const diff = startX - endX;

            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    this.next(); // Swipe left - next image
                } else {
                    this.prev(); // Swipe right - previous image
                }
            }
        },

        open(itemId) {
            const item = portfolioData.find(p => p.id === itemId);
            if (!item) return;

            // Set current data to filtered portfolio
            this.currentData = Portfolio.filteredData;
            this.currentIndex = this.currentData.findIndex(p => p.id === itemId);

            this.showItem(item);
            this.lightbox?.classList.add('active');
            document.body.style.overflow = 'hidden';

            // Focus management
            this.closeBtn?.focus();
        },

        close() {
            this.lightbox?.classList.remove('active');
            document.body.style.overflow = '';
        },

        prev() {
            if (this.currentIndex > 0) {
                this.currentIndex--;
            } else {
                this.currentIndex = this.currentData.length - 1;
            }
            this.showItem(this.currentData[this.currentIndex]);
        },

        next() {
            if (this.currentIndex < this.currentData.length - 1) {
                this.currentIndex++;
            } else {
                this.currentIndex = 0;
            }
            this.showItem(this.currentData[this.currentIndex]);
        },

        showItem(item) {
            if (this.lightboxImage) {
                this.lightboxImage.src = item.image;
                this.lightboxImage.alt = item.title;
            }

            if (this.lightboxTitle) this.lightboxTitle.textContent = item.title;
            if (this.lightboxStyle) this.lightboxStyle.textContent = Portfolio.getStyleLabel(item.style);
            if (this.lightboxArea) this.lightboxArea.textContent = Portfolio.getAreaLabel(item.area);
            if (this.lightboxYear) this.lightboxYear.textContent = item.year;
            if (this.lightboxDuration) this.lightboxDuration.textContent = item.duration;
            if (this.lightboxDescription) this.lightboxDescription.textContent = item.description;

            // Update navigation button states
            this.updateNavigationButtons();
        },

        updateNavigationButtons() {
            if (this.prevBtn) {
                this.prevBtn.style.display = this.currentData.length > 1 ? 'block' : 'none';
            }
            if (this.nextBtn) {
                this.nextBtn.style.display = this.currentData.length > 1 ? 'block' : 'none';
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
            const answer = item.querySelector('.faq__answer');
            const isExpanded = question.getAttribute('aria-expanded') === 'true';

            // Close all other FAQ items
            this.faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    const otherQuestion = otherItem.querySelector('.faq__question');
                    const otherAnswer = otherItem.querySelector('.faq__answer');
                    otherQuestion.setAttribute('aria-expanded', 'false');
                    otherAnswer.style.display = 'none';
                }
            });

            // Toggle current item
            question.setAttribute('aria-expanded', !isExpanded);
            answer.style.display = isExpanded ? 'none' : 'block';
        }
    };

    // ===== FORMS MODULE =====
    const Forms = {
        init() {
            this.bookingForm = document.getElementById('booking-form');
            this.apprenticeForm = document.getElementById('apprentice-form');
            
            this.bindEvents();
        },

        bindEvents() {
            // Booking form
            this.bookingForm?.addEventListener('submit', (e) => this.handleBookingSubmit(e));
            
            // Apprentice form
            this.apprenticeForm?.addEventListener('submit', (e) => this.handleApprenticeSubmit(e));

            // Real-time validation
            const inputs = document.querySelectorAll('.form__input, .form__textarea, .form__select');
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearError(input));
            });
        },

        async handleBookingSubmit(e) {
            e.preventDefault();
            
            const form = e.target;
            const submitBtn = form.querySelector('button[type="submit"]');
            
            if (!this.validateForm(form)) return;

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
                this.showError('Errore durante l\'invio del modulo. Riprova più tardi.');
                console.error('Form submission error:', error);
            } finally {
                setButtonLoading(submitBtn, false);
            }
        },

        async handleApprenticeSubmit(e) {
            e.preventDefault();
            
            const form = e.target;
            const submitBtn = form.querySelector('button[type="submit"]');
            
            if (!this.validateForm(form)) return;

            setButtonLoading(submitBtn, true);

            try {
                const formData = new FormData(form);
                const response = await this.submitForm('/api/apprentice', formData);
                
                if (response.ok) {
                    this.showSuccess('Candidatura inviata con successo! Ti contatteremo presto.');
                    form.reset();
                } else {
                    throw new Error('Errore durante l\'invio');
                }
            } catch (error) {
                this.showError('Errore durante l\'invio del modulo. Riprova più tardi.');
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
                errorMessage = 'Questo campo è obbligatorio';
            }
            // Email validation
            else if (fieldName === 'email' && value && !this.isValidEmail(value)) {
                errorMessage = 'Inserisci un indirizzo email valido';
            }
            // Age validation
            else if (fieldName === 'age' && value) {
                const age = parseInt(value);
                if (age < 18 || age > 65) {
                    errorMessage = 'L\'età deve essere compresa tra 18 e 65 anni';
                }
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
            field.setAttribute('aria-invalid', 'false');
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
            notification.innerHTML = `
                <div class="notification__content">
                    <p>${message}</p>
                    <button class="notification__close" aria-label="Chiudi notifica">&times;</button>
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
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    };

    // ===== SCROLL ANIMATIONS MODULE =====
    const ScrollAnimations = {
        init() {
            this.setupIntersectionObserver();
            this.setupBackToTop();
        },

        setupIntersectionObserver() {
            if (!window.IntersectionObserver) return;

            const options = {
                threshold: CONFIG.INTERSECTION_THRESHOLD,
                rootMargin: '0px 0px -50px 0px'
            };

            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                    }
                });
            }, options);

            // Observe elements
            const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
            elementsToAnimate.forEach(element => {
                this.observer.observe(element);
            });
        },

        setupBackToTop() {
            this.backToTopBtn = document.getElementById('back-to-top');
            
            if (!this.backToTopBtn) return;

            // Show/hide based on scroll position
            const scrollHandler = throttle(() => {
                if (window.scrollY > 500) {
                    this.backToTopBtn.classList.add('visible');
                } else {
                    this.backToTopBtn.classList.remove('visible');
                }
            }, 100);

            window.addEventListener('scroll', scrollHandler);

            // Click handler
            this.backToTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    };

    // ===== LAZY LOADING MODULE =====
    const LazyLoading = {
        init() {
            if (!window.IntersectionObserver) {
                // Fallback for older browsers
                this.loadAllImages();
                return;
            }

            this.setupLazyLoading();
        },

        setupLazyLoading() {
            const options = {
                rootMargin: CONFIG.LAZY_LOAD_MARGIN
            };

            this.imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target);
                        this.imageObserver.unobserve(entry.target);
                    }
                });
            }, options);

            // Observe lazy images
            const lazyImages = document.querySelectorAll('img[loading="lazy"]');
            lazyImages.forEach(img => {
                this.imageObserver.observe(img);
            });
        },

        loadImage(img) {
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            }

            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });
        },

        loadAllImages() {
            const lazyImages = document.querySelectorAll('img[loading="lazy"]');
            lazyImages.forEach(img => this.loadImage(img));
        }
    };

    // ===== PERFORMANCE MODULE =====
    const Performance = {
        init() {
            this.optimizeImages();
        },

        optimizeImages() {
            // Convert images to WebP if supported
            if (this.supportsWebP()) {
                const images = document.querySelectorAll('img[src$=".jpg"], img[src$=".png"]');
                images.forEach(img => {
                    const webpSrc = img.src.replace(/\.(jpg|png)$/, '.webp');
                    
                    // Test if WebP version exists
                    const testImg = new Image();
                    testImg.onload = () => {
                        img.src = webpSrc;
                    };
                    testImg.src = webpSrc;
                });
            }
        },

        supportsWebP() {
            return new Promise((resolve) => {
                const webP = new Image();
                webP.onload = webP.onerror = () => {
                    resolve(webP.height === 2);
                };
                webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
            });
        }
    };

    // ===== ACCESSIBILITY MODULE =====
    const Accessibility = {
        init() {
            this.setupFocusManagement();
            this.setupKeyboardNavigation();
            this.setupReducedMotion();
        },

        setupFocusManagement() {
            // Skip to main content
            const skipLink = document.createElement('a');
            skipLink.href = '#main';
            skipLink.textContent = 'Vai al contenuto principale';
            skipLink.className = 'skip-link sr-only';
            document.body.insertBefore(skipLink, document.body.firstChild);

            // Focus outline for keyboard users
            let isUsingKeyboard = false;

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    isUsingKeyboard = true;
                    document.body.classList.add('keyboard-navigation');
                }
            });

            document.addEventListener('mousedown', () => {
                isUsingKeyboard = false;
                document.body.classList.remove('keyboard-navigation');
            });
        },

        setupKeyboardNavigation() {
            // Escape key handling
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    // Close any open modals, menus, etc.
                    const openMenus = document.querySelectorAll('.nav__menu.active');
                    openMenus.forEach(menu => {
                        Navigation.closeMobileMenu();
                    });

                    if (Lightbox.lightbox?.classList.contains('active')) {
                        Lightbox.close();
                    }
                }
            });
        },

        setupReducedMotion() {
            // Respect user's motion preferences
            const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
            
            if (mediaQuery.matches) {
                document.documentElement.style.setProperty('--transition-fast', '0.01ms');
                document.documentElement.style.setProperty('--transition-base', '0.01ms');
                document.documentElement.style.setProperty('--transition-slow', '0.01ms');
            }
        }
    };

    // ===== INITIALIZATION =====
    
    // Initialize app after preloading is complete
    function initializeApp() {
        console.log('🎨 Initializing @sken.blk website...');
        
        // Initialize all modules
        Navigation.init();
        Theme.init();
        Portfolio.init();
        Lightbox.init();
        FAQ.init();
        Forms.init();
        ScrollAnimations.init();
        LazyLoading.init();
        Performance.init();
        Accessibility.init();

        // Add loaded class to body
        document.body.classList.add('loaded');

        console.log('🎨 @sken.blk website initialized successfully!');
    }

    // Start preloading when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        console.log('🎨 Starting @sken.blk website preloader...');
        PreloaderSystem.init();
    });

    // ===== ERROR HANDLING =====
    window.addEventListener('error', (e) => {
        console.error('JavaScript error:', e.error);
        // Send error to analytics in production
    });

    window.addEventListener('unhandledrejection', (e) => {
        console.error('Unhandled promise rejection:', e.reason);
        // Send error to analytics in production
    });

})();