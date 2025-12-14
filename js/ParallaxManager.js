/**
 * ParallaxManager - Handles parallax effects
 * Extends BaseManager for common functionality
 */
class ParallaxManager extends BaseManager {
    constructor(config = {}) {
        super({
            scrollParallaxSpeed: 0.3,
            mouseParallaxRange: 15,
            mouseParallaxSpeed: 0.3,
            enableScrollParallax: true,
            enableMouseParallax: true,
            ...config
        });
        
        this.scrollTicking = false;
        this.mouseMoveTicking = false;
        this.listeners = [];
    }

    /**
     * Initialize parallax manager
     */
    init() {
        if (this.isInitialized) {
            this.log('Already initialized');
            return;
        }

        if (this.getConfig('enableScrollParallax')) {
            this.setupScrollParallax();
        }
        
        if (this.getConfig('enableMouseParallax')) {
            this.setupMouseParallax();
        }
        
        this.isInitialized = true;
        this.log('Initialized successfully');
    }

    /**
     * Setup scroll-based parallax effect
     */
    setupScrollParallax() {
        const listener = () => {
            if (!this.scrollTicking) {
                window.requestAnimationFrame(() => this.updateScrollParallax());
                this.scrollTicking = true;
            }
        };
        
        window.addEventListener('scroll', listener, { passive: true });
        this.listeners.push({ element: window, event: 'scroll', handler: listener });
        this.log('Scroll parallax enabled');
    }

    /**
     * Update scroll parallax effect
     */
    updateScrollParallax() {
        const scrolled = window.pageYOffset;
        const heroSection = document.getElementById('home');
        
        if (heroSection && scrolled < window.innerHeight) {
            const speed = this.getConfig('scrollParallaxSpeed');
            heroSection.style.transform = `translateY(${scrolled * speed}px)`;
        }
        
        this.scrollTicking = false;
    }

    /**
     * Setup mouse-based parallax effect
     */
    setupMouseParallax() {
        const listener = (e) => {
            if (!this.mouseMoveTicking && e.clientY < window.innerHeight) {
                window.requestAnimationFrame(() => this.updateMouseParallax(e));
                this.mouseMoveTicking = true;
            }
        };
        
        document.addEventListener('mousemove', listener);
        this.listeners.push({ element: document, event: 'mousemove', handler: listener });
        this.log('Mouse parallax enabled');
    }

    /**
     * Update mouse parallax effect
     * @param {MouseEvent} e - Mouse event
     */
    updateMouseParallax(e) {
        const heroSection = document.getElementById('home');
        
        if (heroSection) {
            const range = this.getConfig('mouseParallaxRange');
            const x = (e.clientX / window.innerWidth) * range - (range / 2);
            const y = (e.clientY / window.innerHeight) * range - (range / 2);
            
            this.applyParallaxToCircles(heroSection, x, y);
        }
        
        this.mouseMoveTicking = false;
    }

    /**
     * Apply parallax effect to circular elements
     * @param {HTMLElement} container - Container element
     * @param {number} x - X offset
     * @param {number} y - Y offset
     */
    applyParallaxToCircles(container, x, y) {
        const circles = container.querySelectorAll('.absolute.rounded-full');
        const baseSpeed = this.getConfig('mouseParallaxSpeed');
        
        circles.forEach((circle, index) => {
            const speed = (index + 1) * baseSpeed;
            circle.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
        });
    }

    /**
     * Set parallax speed
     * @param {number} speed - New speed value
     */
    setScrollSpeed(speed) {
        this.setConfig('scrollParallaxSpeed', speed);
        this.log(`Scroll parallax speed set to ${speed}`);
    }

    /**
     * Set mouse parallax range
     * @param {number} range - New range value
     */
    setMouseRange(range) {
        this.setConfig('mouseParallaxRange', range);
        this.log(`Mouse parallax range set to ${range}`);
    }

    /**
     * Enable/disable scroll parallax
     * @param {boolean} enabled - Enable state
     */
    toggleScrollParallax(enabled) {
        this.setConfig('enableScrollParallax', enabled);
        this.log(`Scroll parallax ${enabled ? 'enabled' : 'disabled'}`);
    }

    /**
     * Enable/disable mouse parallax
     * @param {boolean} enabled - Enable state
     */
    toggleMouseParallax(enabled) {
        this.setConfig('enableMouseParallax', enabled);
        this.log(`Mouse parallax ${enabled ? 'enabled' : 'disabled'}`);
    }

    /**
     * Destroy and cleanup
     */
    destroy() {
        this.listeners.forEach(({ element, event, handler }) => {
            element.removeEventListener(event, handler);
        });
        this.listeners = [];
        
        super.destroy();
        this.log('Destroyed successfully');
    }
}
