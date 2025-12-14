# Object-Oriented JavaScript Architecture

This portfolio uses a modular, object-oriented JavaScript architecture following SOLID principles.

## Directory Structure

```
js/
├── utils.js              # Utility functions and helpers
├── BaseManager.js        # Abstract base class for all managers
├── NavigationManager.js  # Navigation and menu functionality
├── AnimationManager.js   # Scroll animations and effects
├── ParallaxManager.js    # Parallax effects
└── app.js               # Main application entry point
```

## OOP Concepts Used

### 1. **Encapsulation**
- Each manager encapsulates its own state and behavior
- Private properties managed through closures and class fields
- Public API exposed through methods

### 2. **Inheritance**
- `BaseManager` provides common functionality
- All managers extend `BaseManager`
- Shared methods: `init()`, `destroy()`, `getConfig()`, `setConfig()`, `log()`

### 3. **Abstraction**
- `BaseManager` is abstract and cannot be instantiated
- Enforces implementation of `init()` method in subclasses
- Hides complex implementation details

### 4. **Polymorphism**
- Each manager implements its own version of `init()` and `destroy()`
- Same interface, different implementations

### 5. **Composition**
- `PortfolioApp` composes multiple managers
- Managers work together but remain independent

### 6. **Singleton Pattern**
- `PortfolioApp` implements singleton pattern
- Ensures only one instance exists

## Class Documentation

### Utils (Static Class)
Provides utility functions used across the application.

**Methods:**
- `debounce(func, wait)` - Debounce function calls
- `throttle(func, limit)` - Throttle function calls
- `logEasterEgg()` - Display console message
- `getOffsetTop(element)` - Get element offset
- `isInViewport(element)` - Check viewport visibility

### BaseManager (Abstract Class)
Base class for all managers with common functionality.

**Methods:**
- `init()` - Must be implemented by subclasses
- `destroy()` - Cleanup and remove listeners
- `getConfig(key, defaultValue)` - Get configuration value
- `setConfig(key, value)` - Set configuration value
- `log(message)` - Debug logging

### NavigationManager
Handles all navigation-related functionality.

**Configuration:**
- `headerOffset: 70` - Header height offset
- `scrollDebounce: 50` - Scroll event debounce time
- `navbarDebounce: 10` - Navbar update debounce time
- `navbarShadowThreshold: 50` - Scroll threshold for shadow

**Features:**
- Smooth scrolling to sections
- Mobile menu toggle
- Active link highlighting
- Navbar shadow on scroll
- Event listener cleanup

### AnimationManager
Manages scroll-based animations using Intersection Observer.

**Configuration:**
- `threshold: 0.15` - Observer threshold
- `rootMargin: '0px 0px -100px 0px'` - Observer margins
- `fadeTransitionDuration: 800` - Fade animation duration (ms)
- `cardTransitionDuration: 600` - Card animation duration (ms)
- `cardStaggerDelay: 100` - Delay between card animations (ms)

**Features:**
- Fade-in animations
- Project card stagger effects
- Observer cleanup

### ParallaxManager
Handles parallax effects for enhanced visual experience.

**Configuration:**
- `scrollParallaxSpeed: 0.3` - Scroll parallax multiplier
- `mouseParallaxRange: 15` - Mouse movement range (px)
- `mouseParallaxSpeed: 0.3` - Mouse parallax multiplier
- `enableScrollParallax: true` - Toggle scroll effect
- `enableMouseParallax: true` - Toggle mouse effect

**Features:**
- Scroll-based parallax
- Mouse movement parallax
- RequestAnimationFrame optimization
- Individual effect toggling

### PortfolioApp (Singleton)
Main application orchestrator that manages all components.

**Features:**
- Singleton pattern implementation
- Manager initialization
- Global error handling
- Debug mode control
- Centralized configuration

## Usage Examples

### Basic Usage
```javascript
// Application auto-initializes on load
// Access via window.portfolioApp
```

### Enable Debug Mode
```javascript
window.portfolioApp.enableDebug();
```

### Access Specific Manager
```javascript
const navManager = window.portfolioApp.getManager('navigation');
navManager.scrollToElement(document.getElementById('about'));
```

### Adjust Parallax Speed
```javascript
const parallaxManager = window.portfolioApp.getManager('parallax');
parallaxManager.setScrollSpeed(0.5);
parallaxManager.setMouseRange(20);
```

### Reload Application
```javascript
window.portfolioApp.reload();
```

## Benefits of This Architecture

1. **Maintainability** - Easy to understand and modify
2. **Testability** - Classes can be tested independently
3. **Scalability** - Easy to add new managers
4. **Reusability** - Managers can be used in other projects
5. **Debugging** - Built-in debug mode for all components
6. **Performance** - Proper cleanup prevents memory leaks
7. **Type Safety** - JSDoc comments for better IDE support

## Adding New Features

To add a new manager:

1. Create new file in `js/` directory
2. Extend `BaseManager` class
3. Implement `init()` method
4. Add to `PortfolioApp.initializeManagers()`
5. Include script in index.html

Example:
```javascript
class ContactFormManager extends BaseManager {
    init() {
        // Your implementation
    }
}
```
