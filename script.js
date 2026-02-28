// =====================
// NAV SCROLL
// =====================
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
});

// =====================
// HAMBURGER
// =====================
const hamburger = document.getElementById('hamburgerBtn');
const navLinks = document.querySelector('.nav-links');
const navOverlay = document.getElementById('navOverlay');

function openMenu() {
    navLinks.classList.add('open');
    navOverlay.style.display = 'block';
    requestAnimationFrame(() => { navOverlay.style.opacity = '1'; });
    document.body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-expanded', 'true');
    const [b0, b1, b2] = hamburger.querySelectorAll('span');
    b0.style.transform = 'translateY(7px) rotate(45deg)';
    b1.style.opacity = '0';
    b2.style.transform = 'translateY(-7px) rotate(-45deg)';
    document.getElementById(`navCloseBtn`).style.display = `block`;
}

function closeMenu() {
    navLinks.classList.remove('open');
    navOverlay.style.opacity = '0';
    setTimeout(() => { navOverlay.style.display = ''; }, 320);
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
    const [b0, b1, b2] = hamburger.querySelectorAll('span');
    b0.style.transform = '';
    b1.style.opacity = '';
    b2.style.transform = '';
    document.getElementById(`navCloseBtn`).style.display = `none`;
}
document.getElementById(`navCloseBtn`).addEventListener(`click`,closeMenu)

hamburger.addEventListener('click', () => {
    navLinks.classList.contains('open') ? closeMenu() : openMenu();
});

navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
navOverlay.addEventListener('click', closeMenu);

document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        closeMenu();
        hamburger.focus();
    }
});

// =====================
// SCROLL REVEAL
// =====================
const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('visible');
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// =====================
// 3D CARD TILT
// =====================
const card3d = document.getElementById('card3d');
if (card3d) {
    card3d.addEventListener('mousemove', (e) => {
        const rect = card3d.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const rotX = -(y / rect.height) * 14;
        const rotY = (x / rect.width) * 14;
        card3d.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.03)`;
    });
    card3d.addEventListener('mouseleave', () => {
        card3d.style.transform = 'perspective(600px) rotateX(0) rotateY(0) scale(1)';
    });
}

// =====================
// PARALLAX SCROLLING
// Only on pointer/hover capable devices (not touch/mobile)
// =====================
if (window.matchMedia('(hover: hover) and (min-width: 901px)').matches) {
    function onScroll() {
        const scrollY = window.scrollY;

        // Hero orbs parallax
        const orbs = document.querySelectorAll('#hero .orb');
        orbs.forEach((orb, i) => {
            const speed = [0.3, 0.2, 0.4][i];
            orb.style.transform = `translateY(${scrollY * speed}px)`;
        });

        // Hero content parallax
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.transform = `translateY(${scrollY * 0.12}px)`;
            heroContent.style.opacity = Math.max(0, 1 - scrollY / 600);
        }

        // Floating card parallax
        const heroCard = document.querySelector('.hero-card-3d');
        if (heroCard) {
            heroCard.style.transform = `translateY(calc(-50% + ${scrollY * 0.18}px))`;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
}

// =====================
// COUNTER ANIMATION
// =====================
function animateCounter(el, target, suffix) {
    let current = 0;
    const step = target / 50;
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        el.textContent = Math.floor(current) + suffix;
    }, 30);
}

// Trigger counters when hero card enters view
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            const values = e.target.querySelectorAll('.card-3d-value');
            const data = [[10, '+'], [98, '%'], [3, '+']];
            values.forEach((v, i) => {
                const num = v.querySelector('span');
                const suffix = data[i][1];
                const base = v.cloneNode(true);
                // simple approach: animate text content
                let ct = 0;
                const target = data[i][0];
                const interval = setInterval(() => {
                    ct += Math.ceil(target / 40);
                    if (ct >= target) ct = target;
                    v.innerHTML = ct + `<span>${suffix}</span>`;
                    if (ct >= target) clearInterval(interval);
                }, 30);
            });
            heroObserver.disconnect();
        }
    });
});
const heroCard = document.querySelector('.hero-card-3d');
if (heroCard) heroObserver.observe(heroCard);

// =====================
// ACTIVE NAV LINK
// =====================
const sections = document.querySelectorAll('section[id], header[id]');
const navLinksAll = document.querySelectorAll('.nav-links a');

const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            navLinksAll.forEach(a => {
                a.style.color = '';
                if (a.getAttribute('href') === '#' + e.target.id) {
                    a.style.color = 'var(--terracotta)';
                }
            });
        }
    });
}, { rootMargin: '-40% 0px -40% 0px' });

sections.forEach(s => activeObserver.observe(s));

// =====================
// SMOOTH SECTION SCROLL
// =====================
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
            e.preventDefault();
            setTimeout(() => {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 50)
        }
    });
});

// =====================
// TESTIMONIALS CAROUSEL
// Auto-scroll + prev/next buttons + drag/swipe + dots
// =====================
/* (function () {
    const wrapper = document.getElementById('tWrapper');
    const track = document.getElementById('testimonialsTrack');
    const prevBtn = document.getElementById('tPrev');
    const nextBtn = document.getElementById('tNext');
    const dotsEl = document.getElementById('tDots');

    if (!wrapper || !track) return;

    // Only the first 4 cards are "real" (rest are loop duplicates)
    const CARD_COUNT = 4;
    const GAP = 24; // px, matches CSS gap: 1.5rem

    // Build dots
    let dots = [];
    for (let i = 0; i < CARD_COUNT; i++) {
        const d = document.createElement('button');
        d.className = 'dot t-dot' + (i === 0 ? ' active' : '');
        d.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
        d.addEventListener('click', () => goTo(i));
        dotsEl.appendChild(d);
        dots.push(d);
    }

    let currentIndex = 0;
    let autoTimer = null;
    let isUserInteracting = false;

    function getCardWidth() {
        const card = track.querySelector('.testimonial-card');
        return card ? card.getBoundingClientRect().width + GAP : 364;
    }

    function updateDots(idx) {
        dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    }

    function goTo(idx, smooth = true) {
        currentIndex = ((idx % CARD_COUNT) + CARD_COUNT) % CARD_COUNT;
        const cardW = getCardWidth();
        wrapper.scrollTo({ left: currentIndex * cardW, behavior: smooth ? 'smooth' : 'instant' });
        updateDots(currentIndex);
    }

    function startAuto() {
        stopAuto();
        autoTimer = setInterval(() => {
            if (!isUserInteracting) goTo(currentIndex + 1);
        }, 3800);
    }

    function stopAuto() {
        clearInterval(autoTimer);
    }

    function resumeAuto() {
        isUserInteracting = false;
        startAuto();
    }

    // Sync index from scroll position (for drag)
    wrapper.addEventListener('scroll', () => {
        const cardW = getCardWidth();
        const nearest = Math.round(wrapper.scrollLeft / cardW);
        const idx = ((nearest % CARD_COUNT) + CARD_COUNT) % CARD_COUNT;
        if (idx !== currentIndex) {
            currentIndex = idx;
            updateDots(currentIndex);
        }
    }, { passive: true });

    prevBtn.addEventListener('click', () => { isUserInteracting = true; goTo(currentIndex - 1); stopAuto(); setTimeout(resumeAuto, 5000); });
    nextBtn.addEventListener('click', () => { isUserInteracting = true; goTo(currentIndex + 1); stopAuto(); setTimeout(resumeAuto, 5000); });

    // --- Mouse drag ---
    let mDragging = false, mStartX = 0, mScrollLeft = 0;

    wrapper.addEventListener('mousedown', e => {
        mDragging = true;
        mStartX = e.pageX - wrapper.offsetLeft;
        mScrollLeft = wrapper.scrollLeft;
        wrapper.classList.add('dragging');
        isUserInteracting = true;
        stopAuto();
    });

    wrapper.addEventListener('mousemove', e => {
        if (!mDragging) return;
        e.preventDefault();
        const x = e.pageX - wrapper.offsetLeft;
        wrapper.scrollLeft = mScrollLeft - (x - mStartX);
    });

    const endDrag = () => {
        if (!mDragging) return;
        mDragging = false;
        wrapper.classList.remove('dragging');
        // Snap to nearest
        const cardW = getCardWidth();
        goTo(Math.round(wrapper.scrollLeft / cardW));
        setTimeout(resumeAuto, 5000);
    };

    wrapper.addEventListener('mouseup', endDrag);
    wrapper.addEventListener('mouseleave', endDrag);

    // --- Touch drag ---
    let tStartX = 0, tScrollLeft = 0;

    wrapper.addEventListener('touchstart', e => {
        tStartX = e.touches[0].pageX;
        tScrollLeft = wrapper.scrollLeft;
        isUserInteracting = true;
        stopAuto();
    }, { passive: true });

    wrapper.addEventListener('touchmove', e => {
        const dx = tStartX - e.touches[0].pageX;
        wrapper.scrollLeft = tScrollLeft + dx;
    }, { passive: true });

    wrapper.addEventListener('touchend', () => {
        const cardW = getCardWidth();
        goTo(Math.round(wrapper.scrollLeft / cardW));
        setTimeout(resumeAuto, 5000);
    });

    // Pause auto when hovering
    wrapper.addEventListener('mouseenter', () => { isUserInteracting = true; stopAuto(); });
    wrapper.addEventListener('mouseleave', () => { isUserInteracting = false; startAuto(); });

    // Make wrapper scrollable with overflow-x
    wrapper.style.overflowX = 'auto';
    wrapper.style.scrollbarWidth = 'none';
    wrapper.style.msOverflowStyle = 'none';
    wrapper.style.scrollSnapType = 'x mandatory';
    track.style.paddingBottom = '2px'; // prevent clipping

    // Apply scroll-snap to cards
    track.querySelectorAll('.testimonial-card').forEach(c => {
        c.style.scrollSnapAlign = 'start';
    });

    // Hide webkit scrollbar via JS-injected style
    const scrollStyle = document.createElement('style');
    scrollStyle.textContent = '#tWrapper::-webkit-scrollbar { display: none; }';
    document.head.appendChild(scrollStyle);

    startAuto();
})(); */

// =====================
// MARQUEE — drag/swipe to scroll manually, auto resumes after
// =====================
(function () {
    const strip = document.querySelector('.marquee-strip');
    const mtrack = document.getElementById('marqueeTrack');
    if (!strip || !mtrack) return;

    let mDrag = false, mX = 0, mSL = 0, mPaused = false;
    let resumeTimer = null;

    function pauseMarquee() {
        mPaused = true;
        mtrack.style.animationPlayState = 'paused';
    }

    function resumeMarquee() {
        mPaused = false;
        mtrack.style.animationPlayState = 'running';
    }

    // Mouse
    strip.addEventListener('mousedown', e => {
        mDrag = true;
        mX = e.pageX;
        mSL = strip.scrollLeft;
        pauseMarquee();
        strip.style.cursor = 'grabbing';
        clearTimeout(resumeTimer);
    });

    strip.addEventListener('mousemove', e => {
        if (!mDrag) return;
        strip.scrollLeft = mSL - (e.pageX - mX);
    });

    const endMDrag = () => {
        if (!mDrag) return;
        mDrag = false;
        strip.style.cursor = '';
        resumeTimer = setTimeout(resumeMarquee, 2500);
    };
    strip.addEventListener('mouseup', endMDrag);
    strip.addEventListener('mouseleave', endMDrag);

    // Touch
    let tX = 0, tSL = 0;
    strip.addEventListener('touchstart', e => {
        tX = e.touches[0].pageX;
        tSL = strip.scrollLeft;
        pauseMarquee();
        clearTimeout(resumeTimer);
    }, { passive: true });

    strip.addEventListener('touchmove', e => {
        strip.scrollLeft = tSL - (e.touches[0].pageX - tX);
    }, { passive: true });

    strip.addEventListener('touchend', () => {
        resumeTimer = setTimeout(resumeMarquee, 2500);
    });

    // Make the strip itself overflow-x scrollable for drag
    strip.style.overflowX = 'auto';
    strip.style.scrollbarWidth = 'none';
    strip.style.cursor = 'grab';
    const mStyle = document.createElement('style');
    mStyle.textContent = '.marquee-strip::-webkit-scrollbar { display: none; }';
    document.head.appendChild(mStyle);
})();