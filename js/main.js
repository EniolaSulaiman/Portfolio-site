// =====================
// NAV SCROLL
// =====================
const nav = document.querySelector('.nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

// =====================
// HAMBURGER
// =====================
const hamburger = document.getElementById('hamburgerBtn');
const navLinks   = document.querySelector('.nav-links');
const navOverlay = document.getElementById('navOverlay');
const navClose   = document.getElementById('navCloseBtn');

function openMenu() {
  if (!navLinks) return;
  navLinks.classList.add('open');

  // FIX #9: Use CSS class instead of inline style toggling
  if (navOverlay) navOverlay.classList.add('overlay-visible');

  if (navClose) navClose.style.display = 'block';
  document.body.style.overflow = 'hidden';
  if (hamburger) hamburger.setAttribute('aria-expanded', 'true');
  const bars = hamburger?.querySelectorAll('span');
  if (bars) {
    bars[0].style.transform = 'translateY(7px) rotate(45deg)';
    bars[1].style.opacity = '0';
    bars[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  }
}

function closeMenu() {
  if (!navLinks) return;
  navLinks.classList.remove('open');

  // FIX #9: Remove CSS class — transition handled entirely in CSS
  if (navOverlay) navOverlay.classList.remove('overlay-visible');

  if (navClose) navClose.style.display = 'none';
  document.body.style.overflow = '';
  if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
  const bars = hamburger?.querySelectorAll('span');
  if (bars) {
    bars[0].style.transform = '';
    bars[1].style.opacity = '';
    bars[2].style.transform = '';
  }
}

if (hamburger) hamburger.addEventListener('click', () => navLinks?.classList.contains('open') ? closeMenu() : openMenu());
if (navClose) navClose.addEventListener('click', closeMenu);
if (navOverlay) navOverlay.addEventListener('click', closeMenu);
navLinks?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

// =====================
// ACTIVE NAV LINK
// FIX #10: Removed hardcoded class="active" from index.html — JS handles it
// =====================
(function() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    // First clear any hardcoded active classes to avoid duplicates
    a.classList.remove('active');
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

// =====================
// SCROLL REVEAL
// =====================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// =====================
// SMOOTH SCROLL
// =====================
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50); }
  });
});

// =====================
// COUNTER ANIMATION
// =====================
function animateCount(el, target, suffix = '', decimals = 0) {
  let start = 0;
  const duration = 1800;
  const startTime = performance.now();
  function step(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const val = (start + (target - start) * eased).toFixed(decimals);
    el.textContent = val + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      const target = parseFloat(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      const decimals = el.dataset.decimals || 0;
      animateCount(el, target, suffix, decimals);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

// =====================
// FLOATING CARDS PARALLAX
// FIX #7: Only runs if the user has NOT requested reduced motion
// =====================
if (
  window.matchMedia('(prefers-reduced-motion: no-preference)').matches &&
  window.matchMedia('(hover: hover) and (min-width: 901px)').matches
) {
  document.addEventListener('mousemove', e => {
    const mx = (e.clientX / window.innerWidth - 0.5) * 2;
    const my = (e.clientY / window.innerHeight - 0.5) * 2;
    document.querySelectorAll('[data-parallax]').forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 1;
      el.style.transform = `translate(${mx * speed * 8}px, ${my * speed * 8}px)`;
    });
  });
}

// =====================
// CONTACT FORM — Formspree (FIX #1)
// Replace YOUR_FORM_ID in contact.html with your actual Formspree form ID
// =====================
const contactForm = document.querySelector('.contact-form-card form');
if (contactForm) {
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const originalBtnHTML = submitBtn ? submitBtn.innerHTML : '';

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Stop the default page-reload behaviour

    // Show a loading state so the user knows something is happening
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 0.8s linear infinite;">
          <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
        </svg>
        Sending...
      `;
    }

    // Remove any previous status messages
    const existing = contactForm.querySelector('.form-status');
    if (existing) existing.remove();

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        // Success — show confirmation and reset the form
        contactForm.reset();
        contactForm.insertAdjacentHTML('afterend', `
          <div class="form-status form-status--success" role="alert">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            <span>Thanks! I'll be in touch within 24 hours.</span>
          </div>
        `);
      } else {
        throw new Error('Server responded with an error');
      }
    } catch (err) {
      // Error — tell the user and suggest the email fallback
      contactForm.insertAdjacentHTML('afterend', `
        <div class="form-status form-status--error" role="alert">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span>Something went wrong. Please email me directly at <a href="mailto:eniolasulaiman.prodev@gmail.com">eniolasulaiman.prodev@gmail.com</a></span>
        </div>
      `);
    } finally {
      // Always restore the button so the user can try again
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
      }
    }
  });
}

// =====================
// CONSENT STORAGE KEY
// =====================
const CONSENT_KEY = 'es_cookie_consent'; // 'accepted' | 'declined'

// =====================
// LOAD GA4
// Injected only after consent — never on page load
// =====================
function loadGA4() {
  const id = window.GA4_ID;
  if (!id || id === 'G-HR8712T900' || document.getElementById('ga4-script')) return;

  // gtag script
  const s = document.createElement('script');
  s.id = 'ga4-script';
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(s);

  // gtag init
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', id, { anonymize_ip: true });
}

// =====================
// LOAD CALENDLY WIDGET
// Only fires on contact.html when it finds the embed container
// =====================
function loadCalendly() {
  const embed = document.getElementById('calendlyEmbed');
  const gate = document.getElementById('calendlyGate');
  if (!embed) return; // not on contact page

  // Show the embed, hide the gate
  embed.style.display = 'block';
  if (gate) gate.style.display = 'none';

  // Load Calendly's widget script once (idempotent)
  if (!document.getElementById('calendly-script')) {
    const s = document.createElement('script');
    s.id = 'calendly-script';
    s.src = 'https://assets.calendly.com/assets/external/widget.js';
    s.async = true;
    document.head.appendChild(s);
  }
}

// =====================
// APPLY CONSENT
// Called both on page load (if already decided) and on button click
// =====================
function applyConsent(decision) {
  if (decision === 'accepted') {
    loadGA4();
    loadCalendly();
  }
  // If declined: nothing loads. Gate message stays visible on contact page.
}

// =====================
// COOKIE BANNER — show / hide / respond
// =====================
const cookieBanner = document.getElementById('cookieBanner');
const acceptBtn = document.getElementById('cookieAccept');
const declineBtn = document.getElementById('cookieDecline');

function hideBanner() {
  if (!cookieBanner) return;
  cookieBanner.classList.remove('visible');
  // Remove from DOM after transition so it doesn't block tab order
  setTimeout(() => { cookieBanner.style.display = 'none'; }, 450);
}

function showBanner() {
  if (!cookieBanner) return;
  cookieBanner.style.display = '';
  // Slight delay so the CSS transition fires (display:none → block needs a frame)
  requestAnimationFrame(() => {
    requestAnimationFrame(() => cookieBanner.classList.add('visible'));
  });
}

// On accept
if (acceptBtn) {
  acceptBtn.addEventListener('click', () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    hideBanner();
    applyConsent('accepted');
  });
}

// On decline
if (declineBtn) {
  declineBtn.addEventListener('click', () => {
    localStorage.setItem(CONSENT_KEY, 'declined');
    hideBanner();
    // No scripts load — gate message stays on contact page
  });
}

// =====================
// ON PAGE LOAD — check stored preference
// =====================
(function initConsent() {
  const stored = localStorage.getItem(CONSENT_KEY);

  if (stored === 'accepted') {
    // Already consented — load everything silently, no banner
    applyConsent('accepted');
  } else if (stored === 'declined') {
    // Already declined — no banner, no scripts
  } else {
    // First visit — show the banner after a short delay
    // (avoids jarring flash on page load)
    setTimeout(showBanner, 1200);
  }
})();
