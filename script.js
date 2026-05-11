/* =====================================================================
   PORTFOLIO – ENZO CHERIF
   script.js — 7 effets scroll
   ===================================================================== */

/* ==========  FORMULAIRE CONTACT  ===================================== */
function sendEmail(event){
  event.preventDefault();
  const name    = document.getElementById('name').value;
  const email   = document.getElementById('email').value;
  const message = document.getElementById('message').value;
  const mailto  =
    `mailto:enzo.cherif@example.com?subject=Message depuis le portfolio`
    + `&body=Nom : ${encodeURIComponent(name)}%0A`
    + `E-mail : ${encodeURIComponent(email)}%0A%0A`
    + `${encodeURIComponent(message)}`;
  window.location.href = mailto;
}

document.addEventListener('DOMContentLoaded', () => {

  const mainColor =
    getComputedStyle(document.documentElement)
      .getPropertyValue('--main-color').trim() || '#00ffee';

  /* ══════════════════════════════════════════════════════════════════
     EFFET 1 — PROGRESS BAR néon en haut de page
  ══════════════════════════════════════════════════════════════════ */
  const progressBar = document.createElement('div');
  progressBar.id = 'scroll-progress';
  progressBar.style.cssText = [
    'position:fixed', 'top:0', 'left:0', 'height:3px', 'width:0%',
    'background:linear-gradient(90deg,#00ffee,#00bfff)',
    'box-shadow:0 0 10px #00ffee,0 0 20px #00ffee',
    'z-index:9999', 'transition:width 0.08s linear', 'pointer-events:none'
  ].join(';');
  document.body.appendChild(progressBar);

  const scrollArrow = document.querySelector('.scroll-down');

  window.addEventListener('scroll', () => {
    const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    progressBar.style.width = Math.min(pct, 100) + '%';
    // Masquer la flèche dès qu'on scroll
    if (scrollArrow) scrollArrow.classList.toggle('hidden', window.scrollY > 80);
  }, { passive: true });


  /* ══════════════════════════════════════════════════════════════════
     EFFET 2 — HERO slide-in au chargement (par mot)
  ══════════════════════════════════════════════════════════════════ */
  const heroEls = [
    { sel: '.big-intro',       delay: 0,    x: -50, y: 0  },
    { sel: '.typing-subline',  delay: 180,  x: -40, y: 0  },
    { sel: '.social-icons',    delay: 340,  x: 0,   y: 20 },
    { sel: '.header-buttons',  delay: 460,  x: 0,   y: 20 },
  ];

  heroEls.forEach(({ sel, delay, x, y }) => {
    const el = document.querySelector(sel);
    if (!el) return;
    el.style.cssText += `opacity:0;transform:translate(${x}px,${y}px);
      transition:opacity 0.9s ${delay}ms cubic-bezier(.22,1,.36,1),
                 transform 0.9s ${delay}ms cubic-bezier(.22,1,.36,1);will-change:transform,opacity;`;
  });

  requestAnimationFrame(() => setTimeout(() => {
    heroEls.forEach(({ sel }) => {
      const el = document.querySelector(sel);
      if (el) { el.style.opacity = '1'; el.style.transform = 'translate(0,0)'; }
    });
  }, 80));


  /* ══════════════════════════════════════════════════════════════════
     EFFET 3 — MAGNETIC HOVER sur les boutons CTA
  ══════════════════════════════════════════════════════════════════ */
  document.querySelectorAll('.btn-glow, .btn-glow-outline, .renault-report-btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      btn.style.transition = 'transform 0.08s ease';
    });
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width  / 2) * 0.32;
      const y = (e.clientY - r.top  - r.height / 2) * 0.32;
      btn.style.transform = `translate(${x}px,${y}px) scale(1.05)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transition = 'transform 0.45s cubic-bezier(.22,1,.36,1)';
      btn.style.transform  = '';
    });
  });


  /* ══════════════════════════════════════════════════════════════════
     EFFET 4 — COUNTER animé sur le KPI Renault
  ══════════════════════════════════════════════════════════════════ */
  const kpiEl = document.querySelector('.renault-kpi-number');
  if (kpiEl) {
    let rafId = null;

    const runCounter = () => {
      kpiEl.innerHTML = '1–2 wks <span class="renault-arrow">\u2192</span> <span id="kpi-count">0</span> sec';
      const span = document.getElementById('kpi-count');
      if (rafId) cancelAnimationFrame(rafId);
      const start = performance.now();
      const dur   = 1400;
      const tick = (now) => {
        const t    = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        span.textContent = Math.round(ease * 30);
        if (t < 1) rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame(tick);
    };

    const resetKpi = () => {
      if (rafId) cancelAnimationFrame(rafId);
      kpiEl.innerHTML = '1–2 wks <span class="renault-arrow">\u2192</span> 0 sec';
    };

    const kpiObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          runCounter();
        } else {
          resetKpi();
        }
      });
    }, { threshold: 0.65 });
    kpiObs.observe(kpiEl);
  }


  /* ══════════════════════════════════════════════════════════════════
     EFFET 5 — STAGGER d'entrée sur les cartes
  ══════════════════════════════════════════════════════════════════ */
  function stagger(selector, step = 110) {
    const els = document.querySelectorAll(selector);
    if (!els.length) return;

    els.forEach((el, i) => {
      el.style.opacity   = '0';
      el.style.transform = 'translateY(28px)';
      el.style.transition =
        `opacity 0.6s ${i * step}ms cubic-bezier(.22,1,.36,1),
         transform 0.6s ${i * step}ms cubic-bezier(.22,1,.36,1)`;
      el.style.willChange = 'opacity,transform';
    });

    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.style.opacity   = '1';
        e.target.style.transform = 'none';
        obs.unobserve(e.target);
      });
    }, { threshold: 0.12 });

    els.forEach(el => obs.observe(el));
  }

  stagger('.post-proj-card',  100);
  stagger('.renault-card',    120);
  stagger('.project-item',    130);
  stagger('.certif-item',      90);
  stagger('#tools .card',      80);
  stagger('#domains .card',    80);
  stagger('.tl-item',         150);


  /* ══════════════════════════════════════════════════════════════════
     EFFET 6 — PARALLAX léger (desktop uniquement)
  ══════════════════════════════════════════════════════════════════ */
  if (window.innerWidth > 768) {
    const parallax = [
      { id: 'post-actuel',     f: 0.10 },
      { id: 'stage-renault',   f: 0.08 },
      { id: 'stage-thailande', f: 0.08 },
    ].map(({ id, f }) => ({ el: document.getElementById(id), f }))
     .filter(x => x.el);

    // On applique le parallax sur le ::before (fond) via une var CSS
    parallax.forEach(({ el }) => {
      el.style.overflow = 'hidden';
    });

    window.addEventListener('scroll', () => {
      parallax.forEach(({ el, f }) => {
        const rect   = el.getBoundingClientRect();
        const offset = (window.innerHeight / 2 - (rect.top + rect.height / 2)) * f;
        el.style.backgroundPositionY = `calc(50% + ${offset}px)`;
        // aussi un léger translate sur le pseudo-élément via var
        el.style.setProperty('--px-offset', offset + 'px');
      });
    }, { passive: true });
  }


  /* ══════════════════════════════════════════════════════════════════
     EFFET 7 — TIMELINE scroll-driven (ligne qui grandit)
  ══════════════════════════════════════════════════════════════════ */
  const timeline = document.querySelector('.timeline');
  if (timeline) {
    // Ligne de progression réelle (les ::before/after ne sont pas scriptables)
    const line = document.createElement('div');
    line.id = 'tl-progress-line';
    line.style.cssText = [
      'position:absolute', 'left:50%', 'top:0', 'width:3px', 'height:0%',
      'background:linear-gradient(180deg,#00ffee,#00bfff)',
      'box-shadow:0 0 10px #00ffee,0 0 20px rgba(0,255,238,.4)',
      'transform:translateX(-50%)', 'border-radius:4px',
      'transition:height 0.25s ease', 'z-index:1', 'pointer-events:none'
    ].join(';');
    timeline.style.position = 'relative';
    timeline.appendChild(line);

    window.addEventListener('scroll', () => {
      const r   = timeline.getBoundingClientRect();
      const vis = Math.max(0, Math.min(window.innerHeight - r.top, r.height));
      line.style.height = Math.min((vis / r.height) * 120, 100) + '%';
    }, { passive: true });

    // Activation + micro-pop de chaque item
    const tlObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add('active');
        const content = e.target.querySelector('.tl-content');
        if (content) {
          content.style.transition = 'transform 0.35s cubic-bezier(.34,1.56,.64,1)';
          content.style.transform  = 'scale(1.05)';
          setTimeout(() => { content.style.transform = ''; }, 360);
        }
        tlObs.unobserve(e.target);
      });
    }, { threshold: 0.45 });

    document.querySelectorAll('.tl-item').forEach(i => tlObs.observe(i));
  }


  /* ══════════════════════════════════════════════════════════════════
     EXISTANT — particles.js
  ══════════════════════════════════════════════════════════════════ */
  particlesJS('particles-js', {
    particles: {
      number:  { value: 60, density: { enable: true, value_area: 800 } },
      color:   { value: mainColor },
      shape:   { type: 'circle' },
      opacity: { value: 0.5, random: true },
      size:    { value: 3,   random: true },
      move:    { enable: true, speed: 2 }
    },
    interactivity: {
      detect_on: 'canvas',
      events: {
        onhover: { enable: true,  mode: ['grab', 'bubble'] },
        onclick:  { enable: true,  mode: 'push' },
        resize: true
      },
      modes: {
        grab:   { distance: 150, line_linked: { opacity: 0.7 } },
        bubble: { distance: 200, size: 6, opacity: 0.8, duration: 2, speed: 3 },
        push:   { particles_nb: 4 }
      }
    },
    retina_detect: true
  });


  /* ══════════════════════════════════════════════════════════════════
     EXISTANT — Typed text
  ══════════════════════════════════════════════════════════════════ */
  const typedText = document.querySelector('.typed-text');
  if (typedText) {
    const words = [
      'AI Explorer', 'Automation Engineer', 'Python Developer',
      'Embedded Software', 'Robotics Enthusiast', 'Mechatronics Engineer'
    ];
    let idx = 0, char = 0, erase = false;
    const speed = () => erase ? 50 : 100;
    const tick  = () => {
      if (!erase && char === words[idx].length) { erase = true; setTimeout(tick, 1600); return; }
      if (erase  && char === 0)                 { erase = false; idx = (idx + 1) % words.length; }
      typedText.textContent = words[idx].substring(0, erase ? --char : ++char);
      setTimeout(tick, speed());
    };
    tick();
  }


  /* ══════════════════════════════════════════════════════════════════
     EXISTANT — Reveal About
  ══════════════════════════════════════════════════════════════════ */
  const revObs = new IntersectionObserver((entries, o) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('reveal'); o.unobserve(e.target); } });
  }, { threshold: 0.25 });
  document.querySelectorAll('#about-title, .about-container').forEach(el => revObs.observe(el));


  /* ══════════════════════════════════════════════════════════════════
     EXISTANT — Nav active + header hide + sticky
  ══════════════════════════════════════════════════════════════════ */
  const navLinks  = document.querySelectorAll('.header-nav a');
  const navObs    = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });
  navLinks.forEach(l => { const s = document.querySelector(l.getAttribute('href')); if (s) navObs.observe(s); });

  const header    = document.getElementById('fullscreen-header');
  const stickyNav = document.querySelector('.sticky-nav');
  let lastST      = 0;
  window.addEventListener('scroll', () => {
    const st = window.scrollY;
    if (st > lastST)  header.classList.add('hide');
    else if (st === 0) header.classList.remove('hide');
    lastST = st <= 0 ? 0 : st;
    stickyNav.classList.toggle('show', st > 100);
  }, { passive: true });


  /* ══════════════════════════════════════════════════════════════════
     EXISTANT — Burger mobile
  ══════════════════════════════════════════════════════════════════ */
  const burger    = document.getElementById('burger');
  const mobileNav = document.getElementById('mobile-nav');
  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    mobileNav.classList.toggle('open');
  });
  document.querySelectorAll('#mobile-nav a').forEach(l =>
    l.addEventListener('click', () => { burger.classList.remove('open'); mobileNav.classList.remove('open'); })
  );


  /* ══════════════════════════════════════════════════════════════════
     EXISTANT — AOS
  ══════════════════════════════════════════════════════════════════ */
  AOS.init({ duration: 800, once: true, offset: 120 });


  /* ══════════════════════════════════════════════════════════════════
     EXISTANT — Accordion Thaïlande
  ══════════════════════════════════════════════════════════════════ */
  document.querySelectorAll('#stage-thailande .accordion-btn').forEach(btn => {
    btn.insertAdjacentHTML('beforeend', '<span class="arrow">▼</span>');
    btn.addEventListener('click', () => {
      const panel  = btn.nextElementSibling;
      const isOpen = panel.classList.contains('open');
      document.querySelectorAll('#stage-thailande .accordion-panel').forEach(p => { p.style.maxHeight = null; p.classList.remove('open'); });
      document.querySelectorAll('#stage-thailande .accordion-btn').forEach(b => b.classList.remove('active'));
      if (!isOpen) { panel.style.maxHeight = panel.scrollHeight + 'px'; panel.classList.add('open'); btn.classList.add('active'); }
    });
  });


  /* ══════════════════════════════════════════════════════════════════
     EXISTANT — Terminal (déclenché par IntersectionObserver)
  ══════════════════════════════════════════════════════════════════ */
  const terminal = document.getElementById('terminal-content');
  const lines = [
    '....................Programming Skills....................',
    '-> Python      - Data analysis, AI, scripting',
    '-> MATLAB      - Advanced simulation & modeling',
    '-> C / C++     - Embedded systems, low-level software',
    '-> C#          - Graphical user interfaces (GUIs)',
    '-> Java        - Backend & mobile development',
    '-> SQL         - Relational databases',
    '-> HTML        - Web page structure',
    '-> CSS         - Styling & layout',
    '-> JavaScript  - Dynamic web interfaces',
    '-> Bash        - Automation via shell scripts'
  ];
  let tLine = 0, tChar = 0;
  const type = () => {
    if (tLine >= lines.length) return;
    if (tChar < lines[tLine].length) { terminal.textContent += lines[tLine][tChar++]; }
    else { terminal.textContent += '\n'; tLine++; tChar = 0; }
    setTimeout(type, 45);
  };
  const termSec = document.getElementById('competences');
  if (termSec) {
    const termObs = new IntersectionObserver((es, o) => {
      es.forEach(e => { if (e.isIntersecting) { type(); o.unobserve(e.target); } });
    }, { threshold: 0.3 });
    termObs.observe(termSec);
  }


  /* ══════════════════════════════════════════════════════════════════
     EXISTANT — Swiper
  ══════════════════════════════════════════════════════════════════ */
  new Swiper('.swiper-container', {
    loop: true,
    autoplay: { delay: 5500, disableOnInteraction: false },
    speed: 750, slidesPerView: 1, spaceBetween: 30, grabCursor: true,
    pagination: { el: '.swiper-pagination', clickable: true },
    navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }
  });


  /* ══════════════════════════════════════════════════════════════════
     EXISTANT — Tilt + Back to top
  ══════════════════════════════════════════════════════════════════ */
  const tiltEl = document.querySelector('.tilt');
  if (tiltEl) {
    tiltEl.addEventListener('mousemove', e => {
      const r = tiltEl.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top  - r.height / 2;
      tiltEl.style.transform = `perspective(700px) rotateX(${12*y/(r.height/2)}deg) rotateY(${-12*x/(r.width/2)}deg)`;
    });
    tiltEl.addEventListener('mouseleave', () => { tiltEl.style.transform = 'none'; });
  }

  const backToTop = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 300);
  }, { passive: true });

});