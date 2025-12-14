/**
 * AnimationManager - Handles all scroll-based animations
 * Extends BaseManager for common functionality
 */
class AnimationManager extends BaseManager {
    constructor(config = {}) {
        super({
            threshold: 0.15,
            rootMargin: '0px 0px -100px 0px',
            fadeTransitionDuration: 800,
            cardTransitionDuration: 600,
            cardStaggerDelay: 100,
            ...config
        });
        
        this.observers = [];
    }

    /**
     * Initialize animation manager
     */
    init() {
        if (this.isInitialized) {
            this.log('Already initialized');
            return;
        }

        document.addEventListener('DOMContentLoaded', () => {
            this.setupFadeInAnimations();
            this.setupProjectCardAnimations();
            this.isInitialized = true;
            this.log('Initialized successfully');
        });
    }

    /**
     * Create intersection observer options
     * @returns {Object} Observer options
     */
    getObserverOptions() {
        return {
            threshold: this.getConfig('threshold'),
            rootMargin: this.getConfig('rootMargin')
        };
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
        }, this.getObserverOptions());

        this.observers.push(observer);

        const fadeElements = document.querySelectorAll('.fade-in-on-scroll');
        fadeElements.forEach(element => {
            this.prepareFadeElement(element);
            observer.observe(element);
        });

        this.log(`Observing ${fadeElements.length} fade-in elements`);
    }

    /**
     * Prepare element for fade-in animation
     * @param {HTMLElement} element - Element to prepare
     */
    prepareFadeElement(element) {
        const duration = this.getConfig('fadeTransitionDuration');
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`;
    }

    /**
     * Animate element fade-in
     * @param {HTMLElement} element - Element to animate
     */
    animateFadeIn(element) {
        element.classList.add('animate-fade-in-up');
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
        this.log(`Animated fade-in for element: ${element.className}`);
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

        this.log(`Observing ${projectCards.length} project cards`);
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
                    const delay = index * this.getConfig('cardStaggerDelay');
                    setTimeout(() => {
                        this.animateProjectCard(entry.target);
                    }, delay);
                    cardObserver.unobserve(entry.target);
                }
            });
        }, this.getObserverOptions());
        
        this.observers.push(cardObserver);
        cardObserver.observe(card);
    }

    /**
     * Animate project card
     * @param {HTMLElement} card - Card to animate
     */
    animateProjectCard(card) {
        const duration = this.getConfig('cardTransitionDuration');
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
        card.style.transition = `all ${duration}ms ease-out`;
        this.log(`Animated project card: ${card.id || 'unnamed'}`);
    }

    /**
     * Destroy and cleanup observers
     */
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers = [];
        
        super.destroy();
        this.log('Destroyed successfully');
    }
}
