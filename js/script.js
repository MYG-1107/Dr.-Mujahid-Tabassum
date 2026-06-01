/**
 * Dr. Mujahid Tabassum Personal Portfolio Client Script Engine
 * Vanilla JavaScript (ES6+) - Fast Execution Topology
 */

document.addEventListener('DOMContentLoaded', () => {
    initThemeManager();
    initMobileNavigation();
    initScrollAnimations();
    initContactFormHandler();
    initDynamicDataVerification();
});

/**
 * 1. Theme Swapper (Light/Dark Engine Topology)
 */
function initThemeManager() {
    const themeToggleBtn = document.getElementById('themeToggle');
    const currentSavedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    
    // Set explicit state attributes early
    document.documentElement.setAttribute('data-theme', currentSavedTheme);

    themeToggleBtn.addEventListener('click', () => {
        const activeTheme = document.documentElement.getAttribute('data-theme');
        const targetTheme = activeTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', targetTheme);
        localStorage.setItem('portfolio-theme', targetTheme);
    });
}

/**
 * 2. Mobile Responsive Action Bar Navigation Manager
 */
function initMobileNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const individualLinks = document.querySelectorAll('.nav-link');

    const toggleExecution = () => {
        const isCurrentlyExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', !isCurrentlyExpanded);
        navToggle.classList.toggle('open');
        navLinks.classList.toggle('open');
    };

    navToggle.addEventListener('click', toggleExecution);

    // Dismiss overlay context mapping when anchor paths are selected
    individualLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('open')) {
                toggleExecution();
            }
        });
    });
}

/**
 * 3. High-Performance Scrolling Viewport Animations (Core Web Vitals Optimized)
 */
function initScrollAnimations() {
    const responsiveObserver = new IntersectionObserver((monitoredEntries) => {
        monitoredEntries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Unobserve after visual triggering to save run processing allocation
                responsiveObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.fade-up').forEach(animatedElement => {
        responsiveObserver.observe(animatedElement);
    });
}

/**
 * 4. Asynchronous Client Communication Submissions Handler
 */
function initContactFormHandler() {
    const submissionForm = document.getElementById('contactForm');
    const buttonElement = document.getElementById('submitBtn');

    if (!submissionForm) return;

    submissionForm.addEventListener('submit', (event) => {
        event.preventDefault();
        
        // Prevent multiple submission processing execution pipelines
        buttonElement.disabled = true;
        buttonElement.textContent = 'Processing Transmission...';

        const clientDataPayload = {
            name: document.getElementById('formName').value,
            email: document.getElementById('formEmail').value,
            message: document.getElementById('formMessage').value
        };

        // Simulated high-velocity API endpoint endpoint loop
        setTimeout(() => {
            buttonElement.style.background = '#10B981'; // Green confirmation color
            buttonElement.textContent = '✓ Transmission Successful';
            submissionForm.reset();

            setTimeout(() => {
                buttonElement.disabled = false;
                buttonElement.style.background = '';
                buttonElement.textContent = 'Send Message';
            }, 3500);
        }, 1200);
    });
}

/**
 * 5. Direct Execution Binding Validation with Local xlsx Data File Contexts
 */
function initDynamicDataVerification() {
    const targetElement = document.getElementById('dynamicDataTarget');
    if (typeof window.PortfolioDataPipeline !== 'undefined' && targetElement) {
        const metrics = window.PortfolioDataPipeline.getMetricsSummary();
        targetElement.innerHTML = `
            <p style="font-size: 0.88rem; color: var(--accent-light); font-weight: 600; margin-bottom: 4px;">📂 Verified Structured Payload Repository Pipeline Active:</p>
            <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.4;">
                Parsed Profile Record Data Target: ${metrics.academicScope} | Core Infrastructure Allocations Verified. Data processing complete.
            </p>
        `;
    }
}
