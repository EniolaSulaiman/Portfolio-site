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
  if (navOverlay) { navOverlay.style.display = 'block'; requestAnimationFrame(() => { navOverlay.style.opacity = '1'; }); }
  if (navClose) navClose.style.display = 'block';
  document.body.style.overflow = 'hidden';
  if (hamburger) hamburger.setAttribute('aria-expanded', 'true');
  const bars = hamburger?.querySelectorAll('span');
  if (bars) { bars[0].style.transform = 'translateY(7px) rotate(45deg)'; bars[1].style.opacity = '0'; bars[2].style.transform = 'translateY(-7px) rotate(-45deg)'; }
}

function closeMenu() {
  if (!navLinks) return;
  navLinks.classList.remove('open');
  if (navOverlay) { navOverlay.style.opacity = '0'; setTimeout(() => { navOverlay.style.display = ''; }, 320); }
  if (navClose) navClose.style.display = 'none';
  document.body.style.overflow = '';
  if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
  const bars = hamburger?.querySelectorAll('span');
  if (bars) { bars[0].style.transform = ''; bars[1].style.opacity = ''; bars[2].style.transform = ''; }
}

if (hamburger) hamburger.addEventListener('click', () => navLinks?.classList.contains('open') ? closeMenu() : openMenu());
if (navClose) navClose.addEventListener('click', closeMenu);
if (navOverlay) navOverlay.addEventListener('click', closeMenu);
navLinks?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

// =====================
// ACTIVE NAV LINK
// =====================
(function() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
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
// =====================
if (window.matchMedia('(hover: hover) and (min-width: 901px)').matches) {
  document.addEventListener('mousemove', e => {
    const mx = (e.clientX / window.innerWidth - 0.5) * 2;
    const my = (e.clientY / window.innerHeight - 0.5) * 2;
    document.querySelectorAll('[data-parallax]').forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 1;
      el.style.transform = `translate(${mx * speed * 8}px, ${my * speed * 8}px)`;
    });
  });
}
