/**
 * NavigationManager - Handles all navigation-related functionality
 * Extends BaseManager for common functionality
 */
class NavigationManager extends BaseManager {
    constructor(config = {}) {
        super({
            headerOffset: 70,
            scrollDebounce: 50,
            navbarDebounce: 10,
            navbarShadowThreshold: 50,
            ...config
        });
        
        this.mobileMenuBtn = null;
        this.mobileMenu = null;
        this.navbar = null;
        this.sections = [];
        this.navLinks = [];
        this.listeners = [];
    }

    /**
     * Initialize navigation manager
     */
    init() {
        if (this.isInitialized) {
            this.log('Already initialized');
            return;
        }

        this.cacheDOM();
        this.setupSmoothScrolling();
        this.setupMobileMenu();
        this.setupActiveLinks();
        this.setupNavbarEffect();
        
        this.isInitialized = true;
        this.log('Initialized successfully');
    }

    /**
     * Cache DOM elements
     */
    cacheDOM() {
        this.mobileMenuBtn = document.getElementById('mobile-menu-btn');
        this.mobileMenu = document.getElementById('mobile-menu');
        this.navbar = document.getElementById('navbar');
        this.sections = document.querySelectorAll('section');
        this.navLinks = document.querySelectorAll('.nav-link');
    }

    /**
     * Setup smooth scrolling for anchor links
     */
    setupSmoothScrolling() {
        const anchors = document.querySelectorAll('a[href^="#"]');
        anchors.forEach(anchor => {
            const listener = (e) => this.handleAnchorClick(e, anchor);
            anchor.addEventListener('click', listener);
            this.listeners.push({ element: anchor, event: 'click', handler: listener });
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
            this.scrollToElement(target);
            this.closeMobileMenu();
        }
    }

    /**
     * Scroll to specific element
     * @param {HTMLElement} element - Element to scroll to
     */
    scrollToElement(element) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - this.getConfig('headerOffset');

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }

    /**
     * Setup mobile menu toggle functionality
     */
    setupMobileMenu() {
        if (this.mobileMenuBtn && this.mobileMenu) {
            const listener = () => this.toggleMobileMenu();
            this.mobileMenuBtn.addEventListener('click', listener);
            this.listeners.push({ element: this.mobileMenuBtn, event: 'click', handler: listener });
        }
    }

    /**
     * Toggle mobile menu visibility
     */
    toggleMobileMenu() {
        this.mobileMenu.classList.toggle('hidden');
        this.log('Mobile menu toggled');
    }

    /**
     * Close mobile menu if open
     */
    closeMobileMenu() {
        if (this.mobileMenu && !this.mobileMenu.classList.contains('hidden')) {
            this.mobileMenu.classList.add('hidden');
            this.log('Mobile menu closed');
        }
    }

    /**
     * Setup active navigation link highlighting
     */
    setupActiveLinks() {
        const updateActiveLink = Utils.debounce(() => {
            this.updateActiveNavLink();
        }, this.getConfig('scrollDebounce'));

        const listener = updateActiveLink;
        window.addEventListener('scroll', listener, { passive: true });
        this.listeners.push({ element: window, event: 'scroll', handler: listener });
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

        this.highlightNavLink(current);
    }

    /**
     * Highlight navigation link
     * @param {string} sectionId - Section ID to highlight
     */
    highlightNavLink(sectionId) {
        this.navLinks.forEach(link => {
            link.classList.remove('text-secondary', 'border-b-2', 'border-secondary');
            if (link.getAttribute('href').substring(1) === sectionId) {
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
        }, this.getConfig('navbarDebounce'));

        const listener = updateNavbar;
        window.addEventListener('scroll', listener, { passive: true });
        this.listeners.push({ element: window, event: 'scroll', handler: listener });
    }

    /**
     * Update navbar shadow based on scroll position
     */
    updateNavbarShadow() {
        const currentScroll = window.pageYOffset;
        const threshold = this.getConfig('navbarShadowThreshold');
        
        if (currentScroll > threshold) {
            this.navbar.classList.add('shadow-2xl');
            this.navbar.classList.remove('shadow-lg');
        } else {
            this.navbar.classList.add('shadow-lg');
            this.navbar.classList.remove('shadow-2xl');
        }
    }

    /**
     * Destroy and cleanup
     */
    destroy() {
        // Remove all event listeners
        this.listeners.forEach(({ element, event, handler }) => {
            element.removeEventListener(event, handler);
        });
        this.listeners = [];
        
        super.destroy();
        this.log('Destroyed successfully');
    }
}
