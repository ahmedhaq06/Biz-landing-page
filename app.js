// JavaScript for AutoConnect - AI Business Automation

// Mobile menu toggle
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (!mobileMenuBtn || !mobileMenu) return;
    
    mobileMenuBtn.addEventListener('click', () => {
        const isHidden = mobileMenu.classList.contains('hidden');
        
        if (isHidden) {
            mobileMenu.classList.remove('hidden');
            // Animate hamburger to X
            const spans = mobileMenuBtn.querySelectorAll('span');
            spans[0].classList.add('rotate-45', 'translate-y-2');
            spans[1].classList.add('opacity-0');
            spans[2].classList.add('-rotate-45', '-translate-y-2');
        } else {
            mobileMenu.classList.add('hidden');
            // Animate X back to hamburger
            const spans = mobileMenuBtn.querySelectorAll('span');
            spans[0].classList.remove('rotate-45', 'translate-y-2');
            spans[1].classList.remove('opacity-0');
            spans[2].classList.remove('-rotate-45', '-translate-y-2');
        }
    });
    
    // Close menu when clicking a link
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            const spans = mobileMenuBtn.querySelectorAll('span');
            spans[0].classList.remove('rotate-45', 'translate-y-2');
            spans[1].classList.remove('opacity-0');
            spans[2].classList.remove('-rotate-45', '-translate-y-2');
        });
    });
}

// Smooth scroll for anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href && href !== '#') {
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
}

// Stats slider animation
function initStatsSlider() {
    const slider = document.getElementById('stats-slider');
    if (!slider) return;
    
    const dots = document.querySelectorAll('.slider-dot');
    let currentSlide = 0;
    const totalSlides = 3;
    const slideInterval = 3000; // 3 seconds per slide
    
    function updateDots() {
        dots.forEach((dot, index) => {
            if (index === currentSlide) {
                dot.classList.remove('bg-white/40');
                dot.classList.add('bg-white');
            } else {
                dot.classList.remove('bg-white');
                dot.classList.add('bg-white/40');
            }
        });
    }
    
    function slideToNext() {
        currentSlide = (currentSlide + 1) % totalSlides;
        const translateX = -currentSlide * 100;
        slider.style.transform = `translateX(${translateX}%)`;
        updateDots();
    }
    
    function slideTo(index) {
        currentSlide = index;
        const translateX = -currentSlide * 100;
        slider.style.transform = `translateX(${translateX}%)`;
        updateDots();
    }
    
    // Add click handlers to dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            slideTo(index);
            // Reset auto-slide interval
            clearInterval(autoSlide);
            autoSlide = setInterval(slideToNext, slideInterval);
        });
    });
    
    // Start auto-sliding
    let autoSlide = setInterval(slideToNext, slideInterval);
}

// Scroll animations - Intersection Observer
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');
    animatedElements.forEach(el => observer.observe(el));
}

// Initialize everything
async function init() {
    // Initialize interactions
    initMobileMenu();
    initSmoothScroll();
    initStatsSlider();
    initScrollAnimations();
    
    console.log('AutoConnect initialized ✓');
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
