/*
    script.js
    - Renders services and pricing from data objects
    - Keeps code modular and easy to update for different client niches
    - Adds accordion and smooth-scroll behavior
*/

// Mobile menu toggle - MUST RUN AFTER DOM LOADS
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mainNav = document.getElementById('mobileNavWrapper');
    const overlay = document.getElementById('mobileMenuOverlay');

    console.log('Mobile menu button:', mobileMenuBtn);
    console.log('Nav wrapper:', mainNav);
    console.log('Overlay:', overlay);

    if (mobileMenuBtn && mainNav) {
        // Toggle menu function
        function toggleMenu() {
            const isActive = mobileMenuBtn.classList.contains('active');
            
            if (isActive) {
                // Close menu
                mobileMenuBtn.classList.remove('active');
                mainNav.classList.remove('active');
                if (overlay) overlay.classList.remove('active');
                document.body.classList.remove('menu-open');
            } else {
                // Open menu
                mobileMenuBtn.classList.add('active');
                mainNav.classList.add('active');
                if (overlay) overlay.classList.add('active');
                document.body.classList.add('menu-open');
            }
            
            console.log('Menu active:', mainNav.classList.contains('active'));
        }

        // Button click
        mobileMenuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Menu button clicked!');
            toggleMenu();
        });

        // Overlay click to close
        if (overlay) {
            overlay.addEventListener('click', () => {
                toggleMenu();
            });
        }

        // Close menu when clicking a nav link
        const navLinks = mainNav.querySelectorAll('.nav-link, .btn-get-start');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                mainNav.classList.remove('active');
                if (overlay) overlay.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
    } else {
        console.error('Mobile menu elements not found!');
    }
});

// ---- Data (update these objects to change services/pricing) ----
const servicesData = [
    {
        id: 'receptionist',
        title: 'AI Receptionist / Customer Support',
        bullets: [
            'Handles incoming calls & answers FAQs',
            'Schedules, reschedules and cancels appointments',
            'Gathers basic client info and stores to Google Sheets/CRM',
            'Works 24/7 to reduce human costs and missed calls'
        ]
    },
    {
        id: 'leads',
        title: 'Lead Generation Services',
        bullets: [
            'Curated leads for businesses (insurance, salons, med-spas, etc.)',
            'Sourced via social research, forms, and community platforms',
            'Optional Enterprise bundle with AI Receptionist for full automation'
        ]
    }
    ,
    {
        id: 'appointments',
        title: 'Appointment Booking & Scheduling',
        bullets: [
            'Real-time booking with calendar integrations',
            'Automated reminders and confirmations',
            'Timezone-aware scheduling for global clients'
        ]
    }
];

// Pricing data with dual currency support
const pricingData = [
    { id: 'starter', label: 'Starter', priceUSD: 100, priceINR: 4000, frequency: 'month', desc: 'AI Receptionist: Automate your business communications and bookings 24/7 with our intelligent AI receptionist.' },
    { id: 'professional', label: 'Professional', priceUSD: 100, priceINR: 4000, frequency: 'month', desc: 'Lead Generation: Get high quality, ready-to-convert customer leads tailored for your business niche.' },
    { id: 'enterprise', label: 'Enterprise Plan', price: 'Custom', frequency: '', desc: 'Discounted bundle when purchasing multiple services (AI receptionist + leads).' }
];

// Global variable to store detected region
let userRegion = 'US'; // default

// Detect user region via IP geolocation
async function detectUserRegion() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        userRegion = data.country_code || 'US';
        localStorage.setItem('userRegion', userRegion);
        console.log('Detected region:', userRegion);
    } catch (error) {
        console.log('Geolocation detection failed, checking localStorage...');
        // Fallback to cached value if API fails
        const cached = localStorage.getItem('userRegion');
        if (cached) {
            userRegion = cached;
            console.log('Using cached region:', userRegion);
        } else {
            userRegion = 'US';
            console.log('Using default USD pricing');
        }
    }
    
    return userRegion;
}

// ---- Rendering helpers ----
function createEl(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text) el.textContent = text;
    return el;
}

// Render services into #services-container
function renderServices() {
    const container = document.getElementById('services-container');
    if (!container) return;
    container.innerHTML = '';

    servicesData.forEach(s => {
        const card = createEl('div', 'service-card');
        const h4 = createEl('h4', 'service-title', s.title);
        card.appendChild(h4);

        // Render bullets as simple paragraph points (no bulleted list)
        s.bullets.forEach(b => {
            const p = createEl('p', 'service-point', b);
            card.appendChild(p);
        });

        container.appendChild(card);
    });
}

// Render pricing into #pricing-container
function renderPricing() {
    const container = document.getElementById('pricing-container');
    if (!container) return;
    container.innerHTML = '';

    pricingData.forEach(p => {
        const card = createEl('div', 'pricing-card');
        const badge = createEl('div', 'pricing-badge', p.label);
        
        // Determine price based on user region
        let priceEl;
        let displayPrice, currencySymbol;
        
        if (p.price === 'Custom') {
            // Enterprise plan - always show "Custom"
            priceEl = createEl('div', 'pricing-price', p.price);
        } else {
            // Use region-specific pricing
            if (userRegion === 'IN') {
                displayPrice = p.priceINR;
                currencySymbol = '₹';
            } else {
                displayPrice = p.priceUSD;
                currencySymbol = '$';
            }
            
            priceEl = createEl('div', 'pricing-price', `${currencySymbol}${displayPrice}`);
            if (p.frequency) {
                const freq = document.createElement('span');
                freq.textContent = `/${p.frequency}`;
                freq.style.fontSize = '0.5em';
                freq.style.fontWeight = '400';
                priceEl.appendChild(freq);
            }
        }

        const desc = createEl('div', 'pricing-desc', p.desc);

        // Pricing cards are informational only; a single global contact button appears below the cards.
        card.appendChild(badge);
        card.appendChild(priceEl);
        card.appendChild(desc);
        card.appendChild(createEl('div', 'pricing-spacer'));

        container.appendChild(card);
    });
}

// ---- Existing interactions ----
function initAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(item => {
        item.addEventListener('click', () => {
            accordionItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });
}

// ---- Initialization ----
async function init() {
    // Detect user region first
    await detectUserRegion();
    
    // Then render content with correct pricing
    renderServices();
    renderPricing();
    initAccordion();
    initSmoothScroll();
    initAnimations();
    initPricingContact();
}

document.addEventListener('DOMContentLoaded', init);

// ---- Animations & entrance effects ----
function initAnimations() {
    // initial nav pulse
    const nav = document.querySelector('.nav-wrapper');
    if (nav) {
        nav.classList.add('animate-bounce');
        setTimeout(() => nav.classList.remove('animate-bounce'), 6200);
    }

    // staggered reveal for major sections
    const appearTargets = document.querySelectorAll('.hero, .services-section, .pricing-section, .testimonials-section');
    appearTargets.forEach((el, idx) => {
        el.classList.add('anim-hidden');
        setTimeout(() => el.classList.add('anim-show'), 120 * idx + 80);
    });

    // on-scroll reveal using IntersectionObserver
    const ioTargets = document.querySelectorAll('.anim-on-scroll, .service-card, .pricing-card, .testimonial-card');
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.14 });

    ioTargets.forEach(t => {
        t.classList.add('anim-on-scroll');
        io.observe(t);
    });
}

// Single Contact button behavior - removed since button is now a link to pricing.html
function initPricingContact() {
    // Button is now a link, no JS needed
}
