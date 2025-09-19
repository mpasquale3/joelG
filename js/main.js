// Main JavaScript functionality for JG Fit Coach website

// Global variables
let currentQuizQuestion = 0;
let quizAnswers = [];
let lifestyleScore = 0;
let bodybuildingScore = 0;

// Hero Carousel functionality
const HeroCarousel = {
    currentSlide: 0,
    slides: [],
    indicators: [],
    autoPlayInterval: null,
    isPlaying: true,
    autoPlayDelay: 4000, // 4 seconds

    init() {
        this.slides = document.querySelectorAll('.carousel-slide');
        this.indicators = document.querySelectorAll('.indicator');
        
        if (this.slides.length === 0) return; // No carousel on this page

        this.attachEventListeners();
        this.startAutoPlay();
        console.log('Hero carousel initialized with', this.slides.length, 'slides');
    },

    attachEventListeners() {
        // Navigation arrows
        const prevBtn = document.querySelector('.carousel-nav.prev');
        const nextBtn = document.querySelector('.carousel-nav.next');
        
        if (prevBtn) prevBtn.addEventListener('click', () => this.previousSlide());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextSlide());

        // Dot indicators
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });

        // Pause on hover, resume on mouse leave
        const carousel = document.querySelector('.hero-carousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', () => this.pauseAutoPlay());
            carousel.addEventListener('mouseleave', () => this.resumeAutoPlay());
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.isCarouselVisible()) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.previousSlide();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case ' ': // Spacebar
                    e.preventDefault();
                    this.isPlaying ? this.pauseAutoPlay() : this.resumeAutoPlay();
                    break;
            }
        });
    },

    isCarouselVisible() {
        const carousel = document.querySelector('.hero-carousel');
        return carousel && carousel.offsetParent !== null;
    },

    goToSlide(index) {
        if (index < 0 || index >= this.slides.length) return;

        // Remove active class from current slide and indicator
        this.slides[this.currentSlide].classList.remove('active');
        this.indicators[this.currentSlide].classList.remove('active');

        // Update current slide
        this.currentSlide = index;

        // Add active class to new slide and indicator
        this.slides[this.currentSlide].classList.add('active');
        this.indicators[this.currentSlide].classList.add('active');

        // Reset auto-play timer
        this.resetAutoPlay();
    },

    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(nextIndex);
    },

    previousSlide() {
        const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.goToSlide(prevIndex);
    },

    startAutoPlay() {
        if (this.autoPlayInterval) return;
        
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayDelay);
        this.isPlaying = true;
    },

    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
        this.isPlaying = false;
    },

    resumeAutoPlay() {
        if (!this.isPlaying && !this.autoPlayInterval) {
            this.startAutoPlay();
        }
    },

    resetAutoPlay() {
        this.pauseAutoPlay();
        this.resumeAutoPlay();
    },

    // Preload images for better performance
    preloadImages() {
        this.slides.forEach(slide => {
            const img = slide.querySelector('img');
            if (img && img.src) {
                const preloadImg = new Image();
                preloadImg.src = img.src;
            }
        });
    }
};

// Testimonials Carousel functionality
const TestimonialsCarousel = {
    currentSlide: 0,
    slides: [],
    indicators: [],
    autoPlayInterval: null,
    isPlaying: true,
    autoPlayDelay: 6000, // 6 seconds - longer for reading testimonials

    init() {
        this.slides = document.querySelectorAll('.testimonial-slide');
        this.indicators = document.querySelectorAll('.testimonial-indicator');
        
        if (this.slides.length === 0) return; // No testimonials carousel on this page

        this.attachEventListeners();
        this.startAutoPlay();
        console.log('Testimonials carousel initialized with', this.slides.length, 'slides');
    },

    attachEventListeners() {
        // Navigation arrows
        const prevBtn = document.querySelector('.testimonials-nav.prev');
        const nextBtn = document.querySelector('.testimonials-nav.next');
        
        if (prevBtn) prevBtn.addEventListener('click', () => this.previousSlide());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextSlide());

        // Dot indicators
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });

        // Pause on hover, resume on mouse leave
        const carousel = document.querySelector('.testimonials-carousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', () => this.pauseAutoPlay());
            carousel.addEventListener('mouseleave', () => this.resumeAutoPlay());
        }

        // Touch/swipe support for mobile
        this.addTouchSupport();
    },

    addTouchSupport() {
        const carousel = document.querySelector('.testimonials-carousel');
        if (!carousel) return;

        let startX = 0;
        let currentX = 0;
        let isDragging = false;

        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            this.pauseAutoPlay();
        });

        carousel.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
            e.preventDefault(); // Prevent scrolling
        });

        carousel.addEventListener('touchend', () => {
            if (!isDragging) return;
            isDragging = false;

            const diffX = startX - currentX;
            const threshold = 50; // Minimum swipe distance

            if (Math.abs(diffX) > threshold) {
                if (diffX > 0) {
                    this.nextSlide(); // Swipe left = next
                } else {
                    this.previousSlide(); // Swipe right = previous
                }
            }

            this.resumeAutoPlay();
        });
    },

    goToSlide(index) {
        if (index < 0 || index >= this.slides.length) return;

        // Remove active class from current slide and indicator
        if (this.slides[this.currentSlide]) {
            this.slides[this.currentSlide].classList.remove('active');
        }
        if (this.indicators[this.currentSlide]) {
            this.indicators[this.currentSlide].classList.remove('active');
        }

        // Update current slide
        this.currentSlide = index;

        // Add active class to new slide and indicator
        this.slides[this.currentSlide].classList.add('active');
        if (this.indicators[this.currentSlide]) {
            this.indicators[this.currentSlide].classList.add('active');
        }

        // Reset auto-play timer
        this.resetAutoPlay();
    },

    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(nextIndex);
    },

    previousSlide() {
        const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.goToSlide(prevIndex);
    },

    startAutoPlay() {
        if (this.autoPlayInterval) return;
        
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayDelay);
        this.isPlaying = true;
    },

    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
        this.isPlaying = false;
    },

    resumeAutoPlay() {
        if (!this.isPlaying && !this.autoPlayInterval) {
            this.startAutoPlay();
        }
    },

    resetAutoPlay() {
        this.pauseAutoPlay();
        this.resumeAutoPlay();
    }
};

// Quiz questions and scoring
const quizQuestions = [
    {
        question: "What's your primary fitness goal?",
        options: [
            { text: "Improve general health and wellness", lifestyle: 3, bodybuilding: 0 },
            { text: "Build muscle and physique", lifestyle: 1, bodybuilding: 2 },
            { text: "Compete in bodybuilding", lifestyle: 0, bodybuilding: 3 },
            { text: "Get personalized training", lifestyle: 2, bodybuilding: 1 }
        ]
    },
    {
        question: "What's your current fitness experience?",
        options: [
            { text: "Complete beginner", lifestyle: 2, bodybuilding: 0 },
            { text: "Some experience (6 months - 2 years)", lifestyle: 2, bodybuilding: 1 },
            { text: "Experienced (2+ years)", lifestyle: 1, bodybuilding: 2 },
            { text: "Competitive athlete", lifestyle: 0, bodybuilding: 3 }
        ]
    },
    {
        question: "What type of coaching do you prefer?",
        options: [
            { text: "Online/Virtual coaching", lifestyle: 2, bodybuilding: 2 },
            { text: "In-person training", lifestyle: 2, bodybuilding: 1 },
            { text: "Specialized posing coaching", lifestyle: 0, bodybuilding: 3 },
            { text: "Flexible - either works", lifestyle: 1, bodybuilding: 1 }
        ]
    },
    {
        question: "What motivates you most?",
        options: [
            { text: "Long-term health and longevity", lifestyle: 3, bodybuilding: 0 },
            { text: "Building an impressive physique", lifestyle: 1, bodybuilding: 2 },
            { text: "Competing and stage presence", lifestyle: 0, bodybuilding: 3 },
            { text: "Personal achievement and confidence", lifestyle: 2, bodybuilding: 1 }
        ]
    }
];

// Utility functions
function addClass(element, className) {
    if (element && element.classList) {
        element.classList.add(className);
    }
}

function removeClass(element, className) {
    if (element && element.classList) {
        element.classList.remove(className);
    }
}

function hasClass(element, className) {
    return element && element.classList && element.classList.contains(className);
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    document.addEventListener('click', function(e) {
        if (e.target.matches('a[href^="#"]')) {
            e.preventDefault();
            const target = document.querySelector(e.target.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
}

// Mobile menu functionality (if needed later)
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function() {
            if (hasClass(nav, 'active')) {
                removeClass(nav, 'active');
                menuToggle.setAttribute('aria-expanded', 'false');
            } else {
                addClass(nav, 'active');
                menuToggle.setAttribute('aria-expanded', 'true');
            }
        });
        
        // Close menu when clicking nav links
        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                removeClass(nav, 'active');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
                removeClass(nav, 'active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
}

// Form validation helpers
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\+]?[1-9][\d]{0,15}$/;
    return re.test(phone.replace(/[\s\-\(\)]/g, ''));
}

function showFormError(input, message) {
    const formGroup = input.closest('.form-group');
    let errorElement = formGroup.querySelector('.form-error');
    
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'form-error';
        errorElement.style.color = '#EF4444';
        errorElement.style.fontSize = '0.875rem';
        errorElement.style.marginTop = '0.25rem';
        formGroup.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    input.style.borderColor = '#EF4444';
}

function clearFormError(input) {
    const formGroup = input.closest('.form-group');
    const errorElement = formGroup.querySelector('.form-error');
    
    if (errorElement) {
        errorElement.remove();
    }
    
    input.style.borderColor = '#D1D5DB';
}

// Enhanced form submission with validation
function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    const inputs = contactForm.querySelectorAll('input, select, textarea');
    
    // Real-time validation
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFormError(this);
        });
    });
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        const formData = new FormData(this);
        const data = {};
        
        // Validate all fields
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            // Scroll to first error
            const firstError = contactForm.querySelector('.form-error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }
        
        // Process form data
        for (let [key, value] of formData.entries()) {
            if (key === 'interestedServices') {
                if (!data[key]) data[key] = [];
                data[key].push(value);
            } else {
                data[key] = value;
            }
        }
        
        // Submit form (in a real implementation, you would send this to a server)
        console.log('Form submitted with data:', data);
        
        // Show success message
        showContactSuccess();
        
        // Optional: Send to email service like Formspree, Netlify Forms, etc.
        // submitToEmailService(data);
    });
}

function validateField(input) {
    const value = input.value.trim();
    const isRequired = input.hasAttribute('required');
    const type = input.type;
    const name = input.name;
    
    // Clear previous errors
    clearFormError(input);
    
    // Required field validation
    if (isRequired && !value) {
        showFormError(input, 'This field is required');
        return false;
    }
    
    // Skip further validation if field is empty and not required
    if (!value && !isRequired) {
        return true;
    }
    
    // Email validation
    if (type === 'email' || name === 'email') {
        if (!validateEmail(value)) {
            showFormError(input, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Phone validation
    if (type === 'tel' || name === 'phone') {
        if (value && !validatePhone(value)) {
            showFormError(input, 'Please enter a valid phone number');
            return false;
        }
    }
    
    return true;
}

function showContactSuccess() {
    const formContainer = document.getElementById('contact-form-container');
    const successMessage = document.getElementById('success-message');
    
    if (formContainer && successMessage) {
        addClass(formContainer, 'hidden');
        removeClass(successMessage, 'hidden');
        successMessage.scrollIntoView({ behavior: 'smooth' });
    }
}

// Intersection Observer for animations
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                addClass(entry.target, 'animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.card, .testimonial, .stat, .service-card');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Add CSS for animations
function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .card, .testimonial, .stat, .service-card {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .card:nth-child(1) { transition-delay: 0.1s; }
        .card:nth-child(2) { transition-delay: 0.2s; }
        .card:nth-child(3) { transition-delay: 0.3s; }
        
        .testimonial:nth-child(1) { transition-delay: 0.1s; }
        .testimonial:nth-child(2) { transition-delay: 0.2s; }
        .testimonial:nth-child(3) { transition-delay: 0.3s; }
        
        .stat:nth-child(1) { transition-delay: 0.1s; }
        .stat:nth-child(2) { transition-delay: 0.2s; }
        .stat:nth-child(3) { transition-delay: 0.3s; }
        .stat:nth-child(4) { transition-delay: 0.4s; }
        
        .form-error {
            animation: shake 0.5s ease-in-out;
        }
        
        @keyframes shake {
            0%, 20%, 40%, 60%, 80% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        }
        
        @media (prefers-reduced-motion: reduce) {
            .card, .testimonial, .stat, .service-card {
                transition: none;
                opacity: 1;
                transform: none;
            }
        }
    `;
    document.head.appendChild(style);
}

// Loading performance optimization
function optimizeImages() {
    const images = document.querySelectorAll('img');
    
    // Add loading="lazy" to images not above the fold
    images.forEach((img, index) => {
        if (index > 2) { // Skip first few images above the fold
            img.loading = 'lazy';
        }
    });
    
    // Add error handling for images
    images.forEach(img => {
        img.addEventListener('error', function() {
            const placeholder = this.parentElement.querySelector('.placeholder');
            if (placeholder) {
                placeholder.style.display = 'flex';
            }
            this.style.display = 'none';
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('JG Fit Coach website loaded');
    
    // Initialize carousels first
    HeroCarousel.init();
    TestimonialsCarousel.init();
    
    // Initialize core functionality
    initSmoothScrolling();
    initMobileMenu();
    setupContactForm();
    addAnimationStyles();
    initAnimations();
    optimizeImages();
    
    // Add accessibility improvements
    addAccessibilityFeatures();
    
    // Initialize page-specific functionality
    const currentPage = document.body.getAttribute('data-page') || getCurrentPage();
    initPageSpecific(currentPage);
});

function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('services')) return 'services';
    if (path.includes('contact')) return 'contact';
    if (path.includes('faq')) return 'faq';
    return 'home';
}

function initPageSpecific(page) {
    switch(page) {
        case 'services':
            initServicesPage();
            break;
        case 'contact':
            initContactPage();
            break;
        case 'faq':
            initFAQPage();
            break;
        case 'home':
            initHomePage();
            break;
    }
}

function initHomePage() {
    // Preload carousel images for better performance
    if (HeroCarousel.slides.length > 0) {
        HeroCarousel.preloadImages();
    }
    console.log('Home page initialized');
}

function initServicesPage() {
    console.log('Services page initialized');
}

function initContactPage() {
    console.log('Contact page initialized');
}

function initFAQPage() {
    console.log('FAQ page initialized');
}

// Accessibility improvements
function addAccessibilityFeatures() {
    // Add skip navigation link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #000;
        color: #fff;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1000;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content identifier
    const main = document.querySelector('main') || document.querySelector('.hero, .section');
    if (main && !main.id) {
        main.id = 'main-content';
    }
    
    // Improve focus indicators
    const style = document.createElement('style');
    style.textContent = `
        .skip-link:focus {
            top: 6px !important;
        }
        
        button:focus,
        a:focus,
        input:focus,
        select:focus,
        textarea:focus {
            outline: 2px solid #5FEFA7;
            outline-offset: 2px;
        }
        
        .nav-link:focus {
            background: rgba(95, 239, 167, 0.1);
            border-radius: 4px;
        }
    `;
    document.head.appendChild(style);
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // In production, you might want to send this to an error logging service
});

// Service Worker for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered'))
            .catch(error => console.log('SW registration failed'));
    });
}

// Export functions for use in other scripts
window.JGFitCoach = {
    validateEmail,
    validatePhone,
    showFormError,
    clearFormError,
    addClass,
    removeClass,
    hasClass
};