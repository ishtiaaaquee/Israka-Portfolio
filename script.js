// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 70;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
        }
    });
});

// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}

// Debounce function for better performance
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

// Active navigation link on scroll
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

const updateActiveLink = debounce(() => {
    let current = '';
    const scrollPosition = window.pageYOffset + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('text-secondary', 'border-b-2', 'border-secondary');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('text-secondary', 'border-b-2', 'border-secondary');
        }
    });
}, 50);

window.addEventListener('scroll', updateActiveLink, { passive: true });

// Navbar scroll effect
const navbar = document.getElementById('navbar');

const updateNavbar = debounce(() => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        navbar.classList.add('shadow-2xl');
        navbar.classList.remove('shadow-lg');
    } else {
        navbar.classList.add('shadow-lg');
        navbar.classList.remove('shadow-2xl');
    }
}, 10);

window.addEventListener('scroll', updateNavbar, { passive: true });

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all elements with fade-in-on-scroll class
document.addEventListener('DOMContentLoaded', () => {
    const fadeElements = document.querySelectorAll('.fade-in-on-scroll');
    fadeElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        observer.observe(element);
    });
});

// Observe project cards with stagger effect
document.addEventListener('DOMContentLoaded', () => {
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        entry.target.style.transition = 'all 0.6s ease-out';
                    }, index * 100); // Stagger effect
                    cardObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        cardObserver.observe(card);
    });
});

// Optimized parallax effect for hero section
let ticking = false;

const updateParallax = () => {
    const scrolled = window.pageYOffset;
    const heroSection = document.getElementById('home');
    
    if (heroSection && scrolled < window.innerHeight) {
        heroSection.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
    ticking = false;
};

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
    }
}, { passive: true });

// Optimized particle effect on mouse move
let mouseMoveTicking = false;

document.addEventListener('mousemove', (e) => {
    if (!mouseMoveTicking && e.clientY < window.innerHeight) {
        window.requestAnimationFrame(() => {
            const heroSection = document.getElementById('home');
            if (heroSection) {
                const x = (e.clientX / window.innerWidth) * 15 - 7.5;
                const y = (e.clientY / window.innerHeight) * 15 - 7.5;
                
                const circles = heroSection.querySelectorAll('.absolute.rounded-full');
                circles.forEach((circle, index) => {
                    const speed = (index + 1) * 0.3;
                    circle.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
                });
            }
            mouseMoveTicking = false;
        });
        mouseMoveTicking = true;
    }
});

// Console easter egg
console.log('%c👋 Hello there!', 'font-size: 20px; font-weight: bold; color: #667eea;');
console.log('%cInterested in the code? Check out the repository!', 'font-size: 14px; color: #764ba2;');
