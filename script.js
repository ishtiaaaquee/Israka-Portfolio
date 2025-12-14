/**
 * Utility class for common helper functions
 */
class Utils {
    /**
     * Debounce function for performance optimization
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
    static debounce(func, wait) {
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
     * Log console easter egg
     */
    static logEasterEgg() {
        console.log('%c👋 Hello there!', 'font-size: 20px; font-weight: bold; color: #667eea;');
        console.log('%cInterested in the code? Check out the repository!', 'font-size: 14px; color: #764ba2;');
    }
}

/**
 * NavigationManager - Handles all navigation-related functionality
 */
class NavigationManager {
    constructor() {
        this.headerOffset = 70;
        this.mobileMenuBtn = document.getElementById('mobile-menu-btn');
        this.mobileMenu = document.getElementById('mobile-menu');
        this.navbar = document.getElementById('navbar');
        this.sections = document.querySelectorAll('section');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.init();
    }

    /**
     * Initialize all navigation features
     */
    init() {
        this.setupSmoothScrolling();
        this.setupMobileMenu();
        this.setupActiveLinks();
        this.setupNavbarEffect();
    }

    /**
     * Setup smooth scrolling for anchor links
     */
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => this.handleAnchorClick(e, anchor));
        });
    }

    /**
     * Handle anchor link click
     * @param {Event} e - Click event
     * @param {HTMLElement} anchor - Anchor element
     */
    handleAnchorClick(e, anchor) {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        
        if (target) {
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - this.headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            this.closeMobileMenu();
        }
    }

    /**
     * Setup mobile menu toggle functionality
     */
    setupMobileMenu() {
        if (this.mobileMenuBtn && this.mobileMenu) {
            this.mobileMenuBtn.addEventListener('click', () => this.toggleMobileMenu());
        }
    }

    /**
     * Toggle mobile menu visibility
     */
    toggleMobileMenu() {
        this.mobileMenu.classList.toggle('hidden');
    }

    /**
     * Close mobile menu if open
     */
    closeMobileMenu() {
        if (this.mobileMenu && !this.mobileMenu.classList.contains('hidden')) {
            this.mobileMenu.classList.add('hidden');
        }
    }

    /**
     * Setup active navigation link highlighting
     */
    setupActiveLinks() {
        const updateActiveLink = Utils.debounce(() => {
            this.updateActiveNavLink();
        }, 50);

        window.addEventListener('scroll', updateActiveLink, { passive: true });
    }

    /**
     * Update active navigation link based on scroll position
     */
    updateActiveNavLink() {
        let current = '';
        const scrollPosition = window.pageYOffset + 100;
        
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        this.navLinks.forEach(link => {
            link.classList.remove('text-secondary', 'border-b-2', 'border-secondary');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('text-secondary', 'border-b-2', 'border-secondary');
            }
        });
    }

    /**
     * Setup navbar scroll effect
     */
    setupNavbarEffect() {
        const updateNavbar = Utils.debounce(() => {
            this.updateNavbarShadow();
        }, 10);

        window.addEventListener('scroll', updateNavbar, { passive: true });
    }

    /**
     * Update navbar shadow based on scroll position
     */
    updateNavbarShadow() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            this.navbar.classList.add('shadow-2xl');
            this.navbar.classList.remove('shadow-lg');
        } else {
            this.navbar.classList.add('shadow-lg');
            this.navbar.classList.remove('shadow-2xl');
        }
    }
}

/**
 * AnimationManager - Handles all scroll-based animations
 */
class AnimationManager {
    constructor() {
        this.observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -100px 0px'
        };
        
        this.init();
    }

    /**
     * Initialize animations when DOM is ready
     */
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupFadeInAnimations();
            this.setupProjectCardAnimations();
        });
    }

    /**
     * Setup fade-in animations for elements
     */
    setupFadeInAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateFadeIn(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, this.observerOptions);

        const fadeElements = document.querySelectorAll('.fade-in-on-scroll');
        fadeElements.forEach(element => {
            this.prepareFadeElement(element);
            observer.observe(element);
        });
    }

    /**
     * Prepare element for fade-in animation
     * @param {HTMLElement} element - Element to prepare
     */
    prepareFadeElement(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
    }

    /**
     * Animate element fade-in
     * @param {HTMLElement} element - Element to animate
     */
    animateFadeIn(element) {
        element.classList.add('animate-fade-in-up');
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }

    /**
     * Setup staggered animations for project cards
     */
    setupProjectCardAnimations() {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach((card, index) => {
            this.prepareProjectCard(card);
            this.observeProjectCard(card, index);
        });
    }

    /**
     * Prepare project card for animation
     * @param {HTMLElement} card - Card element
     */
    prepareProjectCard(card) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
    }

    /**
     * Setup observer for project card with stagger effect
     * @param {HTMLElement} card - Card element
     * @param {number} index - Card index for stagger delay
     */
    observeProjectCard(card, index) {
        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        this.animateProjectCard(entry.target);
                    }, index * 100); // Stagger effect
                    cardObserver.unobserve(entry.target);
                }
            });
        }, this.observerOptions);
        
        cardObserver.observe(card);
    }

    /**
     * Animate project card
     * @param {HTMLElement} card - Card to animate
     */
    animateProjectCard(card) {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
        card.style.transition = 'all 0.6s ease-out';
    }
}

/**
 * ParallaxManager - Handles parallax effects
 */
class ParallaxManager {
    constructor() {
        this.scrollTicking = false;
        this.mouseMoveTicking = false;
        this.parallaxSpeed = 0.3;
        this.mouseParallaxRange = 15;
        
        this.init();
    }

    /**
     * Initialize parallax effects
     */
    init() {
        this.setupScrollParallax();
        this.setupMouseParallax();
    }

    /**
     * Setup scroll-based parallax effect
     */
    setupScrollParallax() {
        window.addEventListener('scroll', () => {
            if (!this.scrollTicking) {
                window.requestAnimationFrame(() => this.updateScrollParallax());
                this.scrollTicking = true;
            }
        }, { passive: true });
    }

    /**
     * Update scroll parallax effect
     */
    updateScrollParallax() {
        const scrolled = window.pageYOffset;
        const heroSection = document.getElementById('home');
        
        if (heroSection && scrolled < window.innerHeight) {
            heroSection.style.transform = `translateY(${scrolled * this.parallaxSpeed}px)`;
        }
        
        this.scrollTicking = false;
    }

    /**
     * Setup mouse-based parallax effect
     */
    setupMouseParallax() {
        document.addEventListener('mousemove', (e) => {
            if (!this.mouseMoveTicking && e.clientY < window.innerHeight) {
                window.requestAnimationFrame(() => this.updateMouseParallax(e));
                this.mouseMoveTicking = true;
            }
        });
    }

    /**
     * Update mouse parallax effect
     * @param {MouseEvent} e - Mouse event
     */
    updateMouseParallax(e) {
        const heroSection = document.getElementById('home');
        
        if (heroSection) {
            const x = (e.clientX / window.innerWidth) * this.mouseParallaxRange - (this.mouseParallaxRange / 2);
            const y = (e.clientY / window.innerHeight) * this.mouseParallaxRange - (this.mouseParallaxRange / 2);
            
            const circles = heroSection.querySelectorAll('.absolute.rounded-full');
            circles.forEach((circle, index) => {
                const speed = (index + 1) * 0.3;
                circle.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
            });
        }
        
        this.mouseMoveTicking = false;
    }
}

/**
 * PortfolioApp - Main application class
 */
class PortfolioApp {
    constructor() {
        this.navigationManager = null;
        this.animationManager = null;
        this.parallaxManager = null;
        
        this.init();
    }

    /**
     * Initialize the portfolio application
     */
    init() {
        this.navigationManager = new NavigationManager();
        this.animationManager = new AnimationManager();
        this.parallaxManager = new ParallaxManager();
        
        Utils.logEasterEgg();
    }
}

// Initialize the application
const app = new PortfolioApp();
