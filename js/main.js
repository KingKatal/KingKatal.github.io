// ── THEME TOGGLE ──
const html = document.documentElement;
const themeBtn = document.getElementById('theme-toggle');
let isDark = true;

const icon = (id, cls = '') => `<svg class="icon${cls ? ' ' + cls : ''}" aria-hidden="true"><use href="#${id}"/></svg>`;

function setTheme(dark) {
  isDark = dark;
  html.setAttribute('data-theme', dark ? 'dark' : 'light');
  // Icon reflects the CURRENT mode (moon while dark, sun while light)
  themeBtn.innerHTML = icon(dark ? 'i-moon' : 'i-sun');
  themeBtn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
  themeBtn.setAttribute('title', dark ? 'Switch to light theme' : 'Switch to dark theme');
  localStorage.setItem('theme', dark ? 'dark' : 'light');
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', dark ? '#060b18' : '#fbfcfe');
  // Force the browser to recalculate styles so the new theme paints immediately
  void document.body.offsetHeight;
}

const savedTheme = localStorage.getItem('theme');
setTheme(savedTheme ? savedTheme === 'dark' : true);
themeBtn.addEventListener('click', () => setTheme(!isDark));

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── NAVBAR SCROLL ──
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ── MOBILE MENU ──
const hamburger = document.getElementById('nav-hamburger');
const navLinks  = document.getElementById('nav-links');

function closeMenu() {
  navbar.classList.remove('menu-open');
  navLinks.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.setAttribute('aria-label', 'Open navigation menu');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  const willOpen = !navLinks.classList.contains('open');
  navbar.classList.toggle('menu-open', willOpen);
  navLinks.classList.toggle('open', willOpen);
  hamburger.setAttribute('aria-expanded', String(willOpen));
  hamburger.setAttribute('aria-label', willOpen ? 'Close navigation menu' : 'Open navigation menu');
  document.body.style.overflow = willOpen ? 'hidden' : '';
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('click', e => { if (!navbar.contains(e.target)) closeMenu(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

// ── PARTICLE CANVAS ──
const canvas = document.getElementById('hero-canvas');
const ctx    = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x  = Math.random() * canvas.width;
    this.y  = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.r  = Math.random() * 1.5 + 0.5;
    this.alpha = Math.random() * 0.4 + 0.1;
    this.color = Math.random() > 0.6 ? '#22D3EE' : '#4F6BF0';
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle   = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// Draw connecting lines between nearby particles
function drawLines() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx   = particles[i].x - particles[j].x;
      const dy   = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 120) {
        ctx.save();
        ctx.globalAlpha = (1 - dist/120) * 0.12;
        ctx.strokeStyle = '#4F6BF0';
        ctx.lineWidth   = 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
        ctx.restore();
      }
    }
  }
}

function initParticles() {
  particles = [];
  const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 12000));
  for (let i = 0; i < count; i++) particles.push(new Particle());
}
initParticles();
window.addEventListener('resize', initParticles);

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawLines();
  requestAnimationFrame(animateParticles);
}
// Respect reduced-motion preference: skip the particle animation loop entirely
if (!prefersReducedMotion) animateParticles();

// ── TYPED TEXT ──
const typedEl   = document.getElementById('typed-text');
const typedRole = document.querySelector('.typed-cursor');
const roles     = ['IT Officer & Educator', 'GIS Specialist', 'Data Analyst', 'Full-Stack Developer', 'Graphic Designer', 'Founder, KataTech Solutions'];
let roleIdx = 0, charIdx = 0, deleting = false;

function typeEffect() {
  const current = roles[roleIdx];
  if (!deleting) {
    typedEl.textContent = current.substring(0, charIdx + 1);
    charIdx++;
    if (charIdx === current.length) {
      deleting = true;
      setTimeout(typeEffect, 2000);
      return;
    }
  } else {
    typedEl.textContent = current.substring(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      deleting = false;
      roleIdx  = (roleIdx + 1) % roles.length;
    }
  }
  setTimeout(typeEffect, deleting ? 60 : 90);
}
// Respect reduced-motion preference: show a static role instead of typing
if (prefersReducedMotion) {
  typedEl.textContent = roles[0];
} else {
  typeEffect();
}

// ── SCROLL REVEAL ──
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
const observer  = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
revealEls.forEach(el => observer.observe(el));

// ── COUNTER ANIMATION ──
function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target) + (el.dataset.suffix || '');
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(e.target, parseInt(e.target.dataset.count), 1800);
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

// ── SKILL BAR ANIMATION ──
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.width;
      });
      barObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.skill-category').forEach(el => barObserver.observe(el));

// ── SMOOTH SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ── CONTACT FORM ──
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('.btn-submit');
    btn.innerHTML = `${icon('i-check')} Message Sent!`;
    btn.classList.add('success');
    setTimeout(() => {
      btn.innerHTML = `Send Message ${icon('i-send')}`;
      btn.classList.remove('success');
      form.reset();
    }, 3000);
  });
}

// ── ACTIVE NAV LINK ──
const sections  = document.querySelectorAll('section[id]');
const navItems  = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 120;
  sections.forEach(s => {
    if (scrollY >= s.offsetTop && scrollY < s.offsetTop + s.offsetHeight) {
      navItems.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${s.id}"]`);
      if (active) active.classList.add('active');
    }
  });
});

// ── SCROLL PROGRESS BAR ──
const progressBar = document.getElementById('scroll-progress');
if (progressBar) {
  const updateProgress = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    progressBar.style.width = pct + '%';
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();
}

// ── STAGGERED SECTION HEADINGS ──
const staggerEls = document.querySelectorAll('.stagger');
if (staggerEls.length) {
  const staggerObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        staggerObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });
  staggerEls.forEach(el => staggerObserver.observe(el));
}

// ── HERO PARALLAX (layered depth on scroll) ──
if (!prefersReducedMotion && window.innerWidth > 768) {
  const heroText   = document.querySelector('.hero-text');
  const heroVisual = document.querySelector('.hero-visual');
  const heroGrid   = document.querySelector('.hero-bg-grid');
  let ticking = false;

  const applyParallax = () => {
    const y = window.scrollY;
    if (y > window.innerHeight * 1.2) { ticking = false; return; }
    if (heroText)   heroText.style.transform   = `translateY(${y * 0.12}px)`;
    if (heroVisual) heroVisual.style.transform = `translateY(${y * -0.06}px)`;
    if (heroGrid)   heroGrid.style.transform   = `translateY(${y * 0.05}px)`;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(applyParallax); }
  }, { passive: true });
}

// ── 3D TILT CARDS (pointer-driven, desktop only) ──
if (!prefersReducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const MAX_TILT = 7;

  function attachTilt(el) {
    if (el.dataset.tiltReady) return;
    el.dataset.tiltReady = '1';
    el.classList.add('tilt');

    const inner = el;
    const glare = document.createElement('div');
    glare.className = 'tilt-glare';
    el.appendChild(glare);

    el.addEventListener('mousemove', ev => {
      const r = el.getBoundingClientRect();
      const px = (ev.clientX - r.left) / r.width;
      const py = (ev.clientY - r.top) / r.height;
      const rx = (0.5 - py) * MAX_TILT * 2;
      const ry = (px - 0.5) * MAX_TILT * 2;
      inner.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
      glare.style.background =
        `radial-gradient(circle at ${px * 100}% ${py * 100}%, rgba(255,255,255,0.18), transparent 55%)`;
    });

    el.addEventListener('mouseleave', () => {
      inner.style.transform = '';
    });
  }

  document.querySelectorAll('.service-card, .skill-category').forEach(attachTilt);
  window.attachTilt = attachTilt; // so dynamically added cards can opt in too
}

// ── WORK GALLERY + LIGHTBOX ──
const galleryGrid = document.getElementById('gallery-grid');
const lightbox    = document.getElementById('lightbox');

if (lightbox) {
  const lbIcon  = document.getElementById('lightbox-icon');
  const lbTitle = document.getElementById('lightbox-title');
  const lbDesc  = document.getElementById('lightbox-desc');
  const lbClose = document.getElementById('lightbox-close');
  let lastFocused = null;

  const openLightbox = item => {
    lastFocused = item;
    const { title, category, icon } = item.dataset;
    if (lbIcon) lbIcon.setAttribute('href', '#' + (icon || 'i-image'));
    if (lbTitle) lbTitle.textContent = title || 'Work Sample';
    if (lbDesc) lbDesc.textContent =
      `${category || 'Project'} — delivered by KataTech Solutions. Full case study and high-resolution samples available on request.`;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  };

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  };

  if (galleryGrid) {
    galleryGrid.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', () => openLightbox(item));
      item.addEventListener('keydown', ev => {
        if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); openLightbox(item); }
      });
    });
  }

  lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', ev => { if (ev.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', ev => {
    if (ev.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
  });
}

// ── FEATURED PROJECT SPOTLIGHT (carousel) ──
function initSpotlight(projects) {
  const wrap  = document.getElementById('spotlight');
  const track = document.getElementById('spotlight-track');
  const dots  = document.getElementById('spotlight-dots');
  if (!wrap || !track || !dots) return;

  const featured = projects.filter(p => p.featured);
  // Build a solid slide set: keep order stable, ensure at least 2 slides
  const slides = (featured.length >= 2 ? featured : [...featured, ...projects]).filter(
    (p, i, arr) => arr.indexOf(p) === i
  ).slice(0, 4);
  if (slides.length < 2) return;

  const svg = (id, cls = '') =>
    `<svg class="icon${cls ? ' ' + cls : ''}" aria-hidden="true"><use href="#${id}"/></svg>`;

  track.innerHTML = slides.map(p => {
    const name = (p.name || '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    const tags = (p.topics || []).slice(0, 4).map(t => `<span class="tag">${t}</span>`).join('');
    const icon = p.icon || 'i-monitor';
    const url  = p.html_url || 'https://github.com/KingKatal';
    return `
      <div class="spotlight-slide">
        <div class="spotlight-media">${svg(icon)}</div>
        <div class="spotlight-body">
          <div class="spotlight-eyebrow"><span class="dot"></span> Featured Project</div>
          <h3 class="spotlight-title">${name}</h3>
          <p class="spotlight-text">${p.description || 'A project by Gomezgani Chirwa — KataTech Solutions.'}</p>
          <div class="spotlight-meta">${tags}${p.language ? `<span class="tag">${p.language}</span>` : ''}</div>
          <div class="spotlight-actions">
            <a href="${url}" target="_blank" rel="noopener" class="btn btn-primary">
              View Project ${svg('i-arrow')}
            </a>
          </div>
        </div>
      </div>`;
  }).join('');

  dots.innerHTML = slides.map((_, i) =>
    `<button class="spotlight-dot${i === 0 ? ' active' : ''}" role="tab" aria-label="Featured project ${i + 1}"></button>`
  ).join('');

  const dotEls = [...dots.querySelectorAll('.spotlight-dot')];
  let index = 0;

  const go = next => {
    index = (next + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    dotEls.forEach((d, i) => d.classList.toggle('active', i === index));
  };

  document.getElementById('spotlight-prev')?.addEventListener('click', () => { go(index - 1); restart(); });
  document.getElementById('spotlight-next')?.addEventListener('click', () => { go(index + 1); restart(); });
  dotEls.forEach((d, i) => d.addEventListener('click', () => { go(i); restart(); }));

  // Autoplay (paused on hover/focus, disabled with reduced motion)
  let timer = null;
  const start = () => {
    if (prefersReducedMotion || timer) return;
    timer = setInterval(() => go(index + 1), 6500);
  };
  const stop = () => { clearInterval(timer); timer = null; };
  const restart = () => { stop(); start(); };

  wrap.addEventListener('mouseenter', stop);
  wrap.addEventListener('mouseleave', start);
  wrap.addEventListener('focusin', stop);
  wrap.addEventListener('focusout', start);

  // Keyboard navigation
  wrap.addEventListener('keydown', ev => {
    if (ev.key === 'ArrowLeft')  { go(index - 1); restart(); }
    if (ev.key === 'ArrowRight') { go(index + 1); restart(); }
  });

  wrap.hidden = false;
  wrap.classList.add('visible');
  start();
}

window.initSpotlight = initSpotlight;

// ── CURSOR GLOW (desktop only) ──
if (window.innerWidth > 768) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position:fixed; width:300px; height:300px; border-radius:50%;
    background:radial-gradient(circle, rgba(79,107,240,0.08) 0%, transparent 70%);
    pointer-events:none; z-index:9999; transition:transform 0.15s ease;
    transform:translate(-50%,-50%);
  `;
  document.body.appendChild(glow);
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
}
