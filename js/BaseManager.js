/**
 * BaseManager - Abstract base class for all managers
 * Implements common functionality and enforces interface
 */
class BaseManager {
    constructor(config = {}) {
        if (new.target === BaseManager) {
            throw new Error("BaseManager is an abstract class and cannot be instantiated directly");
        }
        
        this.config = config;
        this.isInitialized = false;
    }

    /**
     * Initialize the manager - must be implemented by subclasses
     */
    init() {
        throw new Error("Method 'init()' must be implemented by subclass");
    }

    /**
     * Destroy/cleanup the manager
     */
    destroy() {
        this.isInitialized = false;
    }

    /**
     * Get configuration value
     * @param {string} key - Configuration key
     * @param {*} defaultValue - Default value if key not found
     * @returns {*} Configuration value
     */
    getConfig(key, defaultValue = null) {
        return this.config[key] !== undefined ? this.config[key] : defaultValue;
    }

    /**
     * Set configuration value
     * @param {string} key - Configuration key
     * @param {*} value - Value to set
     */
    setConfig(key, value) {
        this.config[key] = value;
    }

    /**
     * Log message if debug mode is enabled
     * @param {string} message - Message to log
     */
    log(message) {
        if (this.config.debug) {
            console.log(`[${this.constructor.name}] ${message}`);
        }
    }
}
