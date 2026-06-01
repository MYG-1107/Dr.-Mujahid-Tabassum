/**
 * Dr. Mujahid Tabassum – Portfolio JavaScript
 * Vanilla JS, no dependencies, performance-optimized
 * Version: 2.0
 */

'use strict';

/* ========================================================
   UTILITY FUNCTIONS
======================================================== */

/** Throttle: limits function calls to once per `ms` milliseconds */
const throttle = (fn, ms = 100) => {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= ms) { last = now; fn(...args); }
  };
};

/** Safely query a single element */
const qs  = (sel, ctx = document) => ctx.querySelector(sel);
/** Safely query multiple elements */
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ========================================================
   THEME MANAGER (Dark / Light)
======================================================== */
const ThemeManager = (() => {
  const ROOT    = document.documentElement;
  const BTN     = qs('#themeToggle');
  const ICON    = qs('.theme-icon');
  const STORAGE = 'portfolio-theme';

  const THEMES = {
    dark:  { icon: '☀', label: 'Switch to light mode'  },
    light: { icon: '🌙', label: 'Switch to dark mode' }
  };

  /** Apply a theme without transition flash */
  function apply(theme) {
    ROOT.setAttribute('data-theme', theme);
    if (ICON) ICON.textContent = THEMES[theme].icon;
    if (BTN)  BTN.setAttribute('aria-label', THEMES[theme].label);
    localStorage.setItem(STORAGE, theme);
  }

  function toggle() {
    const current = ROOT.getAttribute('data-theme') || 'dark';
    apply(current === 'dark' ? 'light' : 'dark');
  }

  function init() {
    // Prefer stored preference, then system preference
    const stored = localStorage.getItem(STORAGE);
    const system = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    apply(stored || system);

    if (BTN) BTN.addEventListener('click', toggle);

    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', e => {
      if (!localStorage.getItem(STORAGE)) apply(e.matches ? 'light' : 'dark');
    });
  }

  return { init };
})();


/* ========================================================
   NAVIGATION
======================================================== */
const NavManager = (() => {
  const navbar     = qs('#navbar');
  const navToggle  = qs('#navToggle');
  const navLinks   = qs('#navLinks');
  const allLinks   = qsa('.nav-link');
  const sections   = qsa('section[id]');

  function setScrolled() {
    navbar?.classList.toggle('scrolled', window.scrollY > 40);
  }

  function closeMenu() {
    navLinks?.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
    navToggle?.classList.remove('open');
  }

  function toggleMenu() {
    const open = navLinks?.classList.toggle('open');
    navToggle?.setAttribute('aria-expanded', String(open));
    navToggle?.classList.toggle('open', open);
  }

  /** Highlight nav link matching the current viewport section */
  function highlightActive() {
    const scrollMid = window.scrollY + window.innerHeight / 2;
    let current = '';

    sections.forEach(sec => {
      if (sec.offsetTop <= scrollMid) current = sec.id;
    });

    allLinks.forEach(a => {
      const href = a.getAttribute('href')?.slice(1);
      a.classList.toggle('active', href === current);
    });
  }

  function init() {
    navToggle?.addEventListener('click', toggleMenu);

    // Close mobile menu on link click
    allLinks.forEach(a => a.addEventListener('click', closeMenu));

    // Close on outside click
    document.addEventListener('click', e => {
      if (navLinks?.classList.contains('open') &&
          !navbar?.contains(e.target)) closeMenu();
    });

    // Close on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeMenu();
    });

    window.addEventListener('scroll', throttle(() => {
      setScrolled();
      highlightActive();
    }, 80), { passive: true });

    setScrolled();
    highlightActive();
  }

  return { init };
})();


/* ========================================================
   SCROLL PROGRESS BAR
======================================================== */
const ScrollProgress = (() => {
  const bar = qs('#scrollProgress');

  function update() {
    if (!bar) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + '%';
  }

  function init() {
    window.addEventListener('scroll', throttle(update, 30), { passive: true });
    update();
  }

  return { init };
})();


/* ========================================================
   INTERSECTION OBSERVER – FADE UP ANIMATIONS
======================================================== */
const FadeObserver = (() => {
  function init() {
    const elements = qsa('.fade-up');
    if (!elements.length) return;

    // If reduced motion is preferred, make all visible immediately
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      elements.forEach(el => el.classList.add('in-view'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target); // Animate once
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(el => observer.observe(el));
  }

  return { init };
})();


/* ========================================================
   SKILL BAR ANIMATIONS
======================================================== */
const SkillBars = (() => {
  function animateBars(container) {
    qsa('.skill-fill', container).forEach(fill => {
      const target = fill.dataset.width || '0';
      fill.style.width = target + '%';
    });
  }

  function init() {
    const container = qs('#skillBars');
    if (!container) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      animateBars(container);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        animateBars(container);
        observer.disconnect();
      }
    }, { threshold: 0.2 });

    observer.observe(container);
  }

  return { init };
})();


/* ========================================================
   COUNTER ANIMATIONS (Hero Stats)
======================================================== */
const CounterAnimation = (() => {
  function countUp(el) {
    const target = parseInt(el.dataset.count, 10);
    if (isNaN(target)) return;

    const duration  = 1400;
    const start     = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }

    requestAnimationFrame(step);
  }

  function init() {
    const counters = qsa('[data-count]');
    if (!counters.length) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      counters.forEach(el => { el.textContent = el.dataset.count; });
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          countUp(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
  }

  return { init };
})();


/* ========================================================
   BACK TO TOP BUTTON
======================================================== */
const BackToTop = (() => {
  const btn = qs('#backTop');

  function update() {
    if (!btn) return;
    const show = window.scrollY > 500;
    btn.hidden = !show;
  }

  function init() {
    if (!btn) return;
    btn.hidden = true;
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    window.addEventListener('scroll', throttle(update, 150), { passive: true });
    update();
  }

  return { init };
})();


/* ========================================================
   CONTACT FORM – CLIENT-SIDE VALIDATION + MAILTO FALLBACK
======================================================== */
const ContactForm = (() => {
  function init() {
    const form   = qs('#contactForm');
    const status = qs('#formStatus');
    const btn    = qs('#submitBtn');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Clear previous status
      status.textContent = '';
      status.className = 'form-status';

      const name    = form.contactName.value.trim();
      const email   = form.contactEmail.value.trim();
      const subject = form.contactSubject?.value.trim() || 'Portfolio Enquiry';
      const message = form.contactMessage.value.trim();

      // Validation
      const errors = [];
      if (!name)                errors.push('Please enter your name.');
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
                                errors.push('Please enter a valid email address.');
      if (!message)             errors.push('Please enter a message.');

      if (errors.length) {
        status.textContent = errors[0];
        status.classList.add('error');
        return;
      }

      // Simulate send + open mailto as fallback
      btn.disabled = true;
      const origText = btn.querySelector('.btn-text').textContent;
      btn.querySelector('.btn-text').textContent = 'Sending…';

      await new Promise(r => setTimeout(r, 600)); // small UX delay

      // Compose mailto (works without a backend)
      const mailBody =
        `Name: ${name}%0D%0AFrom: ${email}%0D%0A%0D%0A${encodeURIComponent(message)}`;
      const mailto = `mailto:mujee1983@gmail.com?subject=${encodeURIComponent(subject)}&body=${mailBody}`;

      try {
        window.location.href = mailto;
        status.textContent = '✓ Your mail client should open. Thank you!';
        status.classList.add('success');
        form.reset();
      } catch {
        status.textContent = 'Please email directly: mujee1983@gmail.com';
        status.classList.add('error');
      } finally {
        btn.disabled = false;
        btn.querySelector('.btn-text').textContent = origText;
      }
    });
  }

  return { init };
})();


/* ========================================================
   SMOOTH SCROLL POLYFILL (for Safari < 15.4)
======================================================== */
const SmoothScroll = (() => {
  function init() {
    // Modern browsers with scroll-behavior: smooth don't need this
    // But we add it for robustness on anchor clicks
    qsa('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const target = qs(a.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Update URL hash without jumping
        history.pushState(null, '', a.getAttribute('href'));
      });
    });
  }

  return { init };
})();


/* ========================================================
   YEAR UPDATER (footer copyright)
======================================================== */
function updateYear() {
  const el = qs('#currentYear');
  if (el) el.textContent = new Date().getFullYear();
}


/* ========================================================
   KEYBOARD ACCESSIBILITY: FOCUS-VISIBLE POLYFILL HINT
======================================================== */
function initFocusVisible() {
  // Add 'js-focus-visible' class support (CSS already handles :focus-visible)
  document.addEventListener('keydown', () => document.body.classList.add('using-keyboard'));
  document.addEventListener('mousedown', () => document.body.classList.remove('using-keyboard'));
}


/* ========================================================
   LAZY LOAD IMAGES (for future image additions)
======================================================== */
function initLazyImages() {
  if ('IntersectionObserver' in window) {
    const lazyImages = qsa('img[loading="lazy"]');
    const imgObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          imgObserver.unobserve(img);
        }
      });
    });
    lazyImages.forEach(img => imgObserver.observe(img));
  }
}


/* ========================================================
   BOOTSTRAP ALL MODULES
======================================================== */
function boot() {
  ThemeManager.init();
  NavManager.init();
  ScrollProgress.init();
  FadeObserver.init();
  SkillBars.init();
  CounterAnimation.init();
  BackToTop.init();
  ContactForm.init();
  SmoothScroll.init();
  updateYear();
  initFocusVisible();
  initLazyImages();

  // Log version in console (useful for debugging)
  console.info('%cDr. Mujahid Tabassum Portfolio v2.0', 'color:#5b8dee;font-weight:bold;font-size:14px;');
}

// Boot when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
