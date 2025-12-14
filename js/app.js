/**
 * PortfolioApp - Main application class
 * Implements Singleton pattern to ensure single instance
 */
class PortfolioApp {
    static instance = null;

    constructor(config = {}) {
        // Singleton pattern implementation
        if (PortfolioApp.instance) {
            return PortfolioApp.instance;
        }

        this.config = {
            debug: false,
            ...config
        };

        this.managers = {
            navigation: null,
            animation: null,
            parallax: null
        };

        PortfolioApp.instance = this;
        this.init();
    }

    /**
     * Initialize the portfolio application
     */
    init() {
        try {
            this.log('Initializing Portfolio Application...');
            
            this.initializeManagers();
            this.setupGlobalErrorHandling();
            Utils.logEasterEgg();
            
            this.log('Portfolio Application initialized successfully');
        } catch (error) {
            console.error('Error initializing Portfolio Application:', error);
        }
    }

    /**
     * Initialize all managers with configuration
     */
    initializeManagers() {
        const sharedConfig = { debug: this.config.debug };

        // Initialize Navigation Manager
        this.managers.navigation = new NavigationManager({
            ...sharedConfig,
            headerOffset: 70,
            scrollDebounce: 50,
            navbarDebounce: 10
        });
        this.managers.navigation.init();

        // Initialize Animation Manager
        this.managers.animation = new AnimationManager({
            ...sharedConfig,
            threshold: 0.15,
            fadeTransitionDuration: 800,
            cardStaggerDelay: 100
        });
        this.managers.animation.init();

        // Initialize Parallax Manager
        this.managers.parallax = new ParallaxManager({
            ...sharedConfig,
            scrollParallaxSpeed: 0.3,
            mouseParallaxRange: 15
        });
        this.managers.parallax.init();

        this.log('All managers initialized');
    }

    /**
     * Setup global error handling
     */
    setupGlobalErrorHandling() {
        window.addEventListener('error', (event) => {
            console.error('Global error caught:', event.error);
        });

        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
        });
    }

    /**
     * Get specific manager instance
     * @param {string} managerName - Name of the manager
     * @returns {BaseManager|null} Manager instance
     */
    getManager(managerName) {
        return this.managers[managerName] || null;
    }

    /**
     * Enable debug mode for all managers
     */
    enableDebug() {
        this.config.debug = true;
        Object.values(this.managers).forEach(manager => {
            if (manager) {
                manager.setConfig('debug', true);
            }
        });
        this.log('Debug mode enabled');
    }

    /**
     * Disable debug mode for all managers
     */
    disableDebug() {
        this.config.debug = false;
        Object.values(this.managers).forEach(manager => {
            if (manager) {
                manager.setConfig('debug', false);
            }
        });
    }

    /**
     * Reload all managers
     */
    reload() {
        this.log('Reloading application...');
        this.destroy();
        this.init();
    }

    /**
     * Destroy all managers and cleanup
     */
    destroy() {
        Object.values(this.managers).forEach(manager => {
            if (manager && typeof manager.destroy === 'function') {
                manager.destroy();
            }
        });
        
        this.managers = {
            navigation: null,
            animation: null,
            parallax: null
        };
        
        this.log('Application destroyed');
    }

    /**
     * Log message if debug mode is enabled
     * @param {string} message - Message to log
     */
    log(message) {
        if (this.config.debug) {
            console.log(`[PortfolioApp] ${message}`);
        }
    }

    /**
     * Get singleton instance
     * @returns {PortfolioApp} Application instance
     */
    static getInstance() {
        if (!PortfolioApp.instance) {
            new PortfolioApp();
        }
        return PortfolioApp.instance;
    }
}

// Initialize the application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.portfolioApp = new PortfolioApp({ debug: false });
    });
} else {
    window.portfolioApp = new PortfolioApp({ debug: false });
}

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioApp;
}
