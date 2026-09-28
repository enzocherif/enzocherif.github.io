/* =====================================================================
   PORTFOLIO – ENZO CHERIF
   script.js — 7 effets scroll (bibliothèques CDN optionnelles : le site reste fonctionnel sans elles)
   ===================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // Préférence système « réduire les animations »
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Si AOS n'a pas pu être chargé (CDN bloqué / hors-ligne), on retire les
  // attributs data-aos pour que le contenu ne reste jamais invisible.
  if (typeof window.AOS === 'undefined' || reduceMotion) {
    document.querySelectorAll('[data-aos]').forEach(el => el.removeAttribute('data-aos'));
  }

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
    if (!els.length || reduceMotion || !('IntersectionObserver' in window)) return;

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
        const el = e.target;
        el.style.opacity   = '1';
        el.style.transform = 'none';
        obs.unobserve(el);
        // Une fois apparue, on rend la main au CSS : sinon le délai de
        // cascade retardait aussi le tilt au survol des cartes.
        el.addEventListener('transitionend', function clean(ev) {
          if (ev.propertyName !== 'opacity') return;
          el.removeEventListener('transitionend', clean);
          el.style.transition = '';
          el.style.transform  = '';
          el.style.willChange = '';
        });
      });
    }, { threshold: 0.12 });

    els.forEach(el => obs.observe(el));
  }

  stagger('.post-proj-card',  100);
  stagger('.renault-card',    120);
  stagger('.project-item',    130);
  stagger('.certif-card',      90);
  stagger('#tools .card',      80);
  stagger('#domains .card',    80);
  stagger('.tl-item',         150);


  /* ══════════════════════════════════════════════════════════════════
     EFFET 6 — PARALLAX léger (desktop uniquement)
  ══════════════════════════════════════════════════════════════════ */
  if (window.innerWidth > 768 && !reduceMotion) {
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
  if (typeof window.particlesJS === 'function' && !reduceMotion) particlesJS('particles-js', {
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
    if (reduceMotion) { words.length = 1; }
    let idx = 0, char = 0, erase = false;
    const speed = () => erase ? 50 : 100;
    const tick  = () => {
      if (!erase && char === words[idx].length) {
        if (words.length === 1) return;          // mouvement réduit : mot fixe
        erase = true; setTimeout(tick, 1600); return;
      }
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
  const navLinks  = document.querySelectorAll('.header-nav a, .sticky-nav a');
  const navObs    = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });
  const observed = new Set();
  navLinks.forEach(l => {
    const s = document.querySelector(l.getAttribute('href'));
    if (s && !observed.has(s)) { observed.add(s); navObs.observe(s); }
  });

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
  const mobileLinks = mobileNav.querySelectorAll('a');
  const setMenu = (open) => {
    burger.classList.toggle('open', open);
    mobileNav.classList.toggle('open', open);
    document.body.classList.toggle('nav-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    mobileNav.setAttribute('aria-hidden', String(!open));
    // liens non focalisables quand le menu est fermé
    mobileLinks.forEach(a => a.tabIndex = open ? 0 : -1);
    if (open && mobileLinks[0]) mobileLinks[0].focus({ preventScroll: true });
  };
  setMenu(false);
  burger.addEventListener('click', () => setMenu(!mobileNav.classList.contains('open')));
  mobileLinks.forEach(l => l.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) { setMenu(false); burger.focus(); }
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && mobileNav.classList.contains('open')) setMenu(false);
  });


  /* ══════════════════════════════════════════════════════════════════
     EXISTANT — AOS
  ══════════════════════════════════════════════════════════════════ */
  if (typeof window.AOS !== 'undefined' && !reduceMotion) {
    AOS.init({ duration: 800, once: true, offset: 120 });
  }


  /* ══════════════════════════════════════════════════════════════════
     EXISTANT — Accordion Thaïlande
  ══════════════════════════════════════════════════════════════════ */
  document.querySelectorAll('#stage-thailande .accordion-btn').forEach(btn => {
    btn.insertAdjacentHTML('beforeend', '<span class="arrow" aria-hidden="true">▼</span>');
    const panel = btn.nextElementSibling;
    panel.querySelectorAll('a').forEach(a => a.tabIndex = -1);   // fermé = hors tabulation
    btn.addEventListener('click', () => {
      const isOpen = panel.classList.contains('open');
      document.querySelectorAll('#stage-thailande .accordion-btn').forEach(b => {
        const p = b.nextElementSibling;
        p.style.maxHeight = null; p.classList.remove('open');
        p.querySelectorAll('a').forEach(a => a.tabIndex = -1);
        b.classList.remove('active'); b.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        panel.style.maxHeight = panel.scrollHeight + 'px';
        panel.classList.add('open');
        panel.querySelectorAll('a').forEach(a => a.removeAttribute('tabindex'));
        btn.classList.add('active'); btn.setAttribute('aria-expanded', 'true');
      }
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
  // Version accessible (lecteurs d'écran) : le <pre> animé est aria-hidden
  const skillsList = document.getElementById('skills-list');
  if (skillsList) {
    lines.slice(1).forEach(l => {
      const li = document.createElement('li');
      li.textContent = l.replace(/^->\s*/, '').replace(/\s{2,}-\s*/, ' – ');
      skillsList.appendChild(li);
    });
  }
  let tLine = 0, tChar = 0;
  const type = () => {
    if (tLine >= lines.length) return;
    if (tChar < lines[tLine].length) { terminal.textContent += lines[tLine][tChar++]; }
    else { terminal.textContent += '\n'; tLine++; tChar = 0; }
    setTimeout(type, 45);
  };
  const termSec = document.getElementById('competences');
  if (terminal && reduceMotion) {
    terminal.textContent = lines.join('\n');
  } else if (termSec && terminal) {
    const termObs = new IntersectionObserver((es, o) => {
      es.forEach(e => { if (e.isIntersecting) { type(); o.unobserve(e.target); } });
    }, { threshold: 0.3 });
    termObs.observe(termSec);
  }


  /* ══════════════════════════════════════════════════════════════════
     EXISTANT — Swiper
  ══════════════════════════════════════════════════════════════════ */
  if (typeof window.Swiper === 'function') new Swiper('.ref-wrapper .swiper', {
    loop: true,
    autoplay: reduceMotion ? false : { delay: 5500, disableOnInteraction: false, pauseOnMouseEnter: true },
    a11y: { enabled: true },
    speed: 750, slidesPerView: 1, spaceBetween: 30, grabCursor: true,
    // éléments passés directement : ils sont hors du conteneur .swiper
    pagination: { el: document.querySelector('.ref-wrapper .swiper-pagination'), clickable: true },
    navigation: {
      nextEl: document.querySelector('.ref-wrapper .swiper-button-next'),
      prevEl: document.querySelector('.ref-wrapper .swiper-button-prev')
    }
  });


  /* ══════════════════════════════════════════════════════════════════
     EXISTANT — Tilt + Back to top
  ══════════════════════════════════════════════════════════════════ */
  const tiltEl = document.querySelector('.tilt');
  if (tiltEl && window.matchMedia('(hover: hover)').matches && !reduceMotion) {
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



  /* ══════════════════════════════════════════════════════════════════
     NOUVEAUX EFFETS — Curseur néon, Tilt 3D, Flip projets, Glitch titres,
     Mascotte Neon Buddy interactive
  ══════════════════════════════════════════════════════════════════ */

  /* ---------------------------------------------------------------
     A. CURSEUR NEON MAGNETIQUE CUSTOM (desktop uniquement)
  --------------------------------------------------------------- */
  if (window.matchMedia('(hover: hover)').matches && window.innerWidth > 900 && !reduceMotion) {
    const neonCursor = document.createElement('div');
    neonCursor.id = 'neon-cursor';
    document.body.appendChild(neonCursor);

    let cx = window.innerWidth / 2, cy = window.innerHeight / 2;
    let tx = cx, ty = cy;
    window.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; }, { passive: true });

    const animateCursor = () => {
      cx += (tx - cx) * 0.25;
      cy += (ty - cy) * 0.25;
      neonCursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%)`;
      requestAnimationFrame(animateCursor);
    };
    animateCursor();

    const hoverSelector = 'a, button, .card, .project-item img, .flip-scene, .btn-glow, .btn-glow-outline, .btn-download, .btn-view-all, .neon-buddy, input, textarea';
    document.querySelectorAll(hoverSelector).forEach(el => {
      el.addEventListener('mouseenter', () => neonCursor.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => neonCursor.classList.remove('cursor-hover'));
    });
    window.addEventListener('mousedown', () => neonCursor.classList.add('cursor-click'));
    window.addEventListener('mouseup',   () => neonCursor.classList.remove('cursor-click'));
  }


  /* ---------------------------------------------------------------
     B. TILT 3D + GLOW SOURIS SUR LES CARTES (Domains / Tools)
  --------------------------------------------------------------- */
  if (window.matchMedia('(hover: hover)').matches) document.querySelectorAll('#domains .card, #tools .card').forEach(card => {
    const glow = document.createElement('div');
    glow.className = 'card-glow';
    card.appendChild(glow);

    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const cx2 = x / r.width  - 0.5;
      const cy2 = y / r.height - 0.5;
      card.style.transform = `rotateY(${cx2 * 16}deg) rotateX(${-cy2 * 16}deg) translateY(-6px) scale(1.03)`;
      card.style.setProperty('--mx', x + 'px');
      card.style.setProperty('--my', y + 'px');
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });


  /* ---------------------------------------------------------------
     C. FLIP 3D SUR LES IMAGES DE PROJETS
  --------------------------------------------------------------- */
  document.querySelectorAll('.project-item img').forEach(img => {
    const link = img.closest('.project-item')?.querySelector('.btn-download');

    const scene = document.createElement('div');
    scene.className = 'flip-scene';

    const flipCard = document.createElement('div');
    flipCard.className = 'flip-card';

    const front = document.createElement('div');
    front.className = 'flip-face flip-front';

    const back = document.createElement('div');
    back.className = 'flip-face flip-back';
    // Face arrière décorative (le bouton « Full Report » reste l'accès principal)
    back.setAttribute('aria-hidden', 'true');
    back.innerHTML = `
      <span class="flip-icon">📄</span>
      <a class="flip-cta" href="${link ? link.getAttribute('href') : '#'}" target="_blank" rel="noopener" tabindex="-1">View report</a>
    `;

    img.parentNode.insertBefore(scene, img);
    front.appendChild(img);
    flipCard.appendChild(front);
    flipCard.appendChild(back);
    scene.appendChild(flipCard);
  });


  /* ---------------------------------------------------------------
     D. MASCOTTES NEON BUDDIES — 3 bonhommes SVG, chacun avec son
        action en marchant. Balade horizontale + clic = explosion.
  --------------------------------------------------------------- */
  function buildBuddySVG(type){
    if (type === 'coder') {
      return `
      <svg viewBox="0 0 64 92">
        <g class="bob">
          <circle class="stroke" cx="32" cy="14" r="8"/>
          <path class="stroke fill-soft" d="M22,24 Q32,20 42,24 L40,50 Q32,54 24,50 Z"/>
          <g class="leg-l"><path class="stroke" d="M28,49 L21,76"/></g>
          <g class="leg-r"><path class="stroke" d="M36,49 L43,76"/></g>
          <g class="type-l"><path class="stroke" d="M24,32 L13,52"/></g>
          <g class="type-r"><path class="stroke" d="M40,32 L51,52"/></g>
          <g transform="translate(8,52)">
            <rect class="stroke" x="0" y="0" width="48" height="5" rx="1.5"/>
            <rect class="stroke laptop-screen" x="5" y="-22" width="38" height="22" rx="1.5"/>
            <line class="dim" x1="10" y1="-15" x2="38" y2="-15"/>
            <line class="dim" x1="10" y1="-10" x2="30" y2="-10"/>
            <line class="dim" x1="10" y1="-5" x2="34" y2="-5"/>
          </g>
        </g>
      </svg>`;
    }
    if (type === 'engineer') {
      return `
      <svg viewBox="0 0 64 92">
        <g class="bob">
          <circle class="stroke" cx="32" cy="14" r="8"/>
          <path class="stroke fill-soft" d="M22,24 Q32,20 42,24 L40,50 Q32,54 24,50 Z"/>
          <g class="leg-l"><path class="stroke" d="M28,49 L21,76"/></g>
          <g class="leg-r"><path class="stroke" d="M36,49 L43,76"/></g>
          <g class="arm-swing-l"><path class="stroke" d="M24,28 L13,38"/></g>
          <path class="stroke" d="M40,28 L51,42"/>
          <g class="wrench" transform="translate(52,42)">
            <path class="stroke" d="M0,0 L0,-15"/>
            <path class="stroke fill" d="M-5.5,7.5 L-5.5,2 L-1.5,-2.3 L1.5,-2.3 L5.5,2 L5.5,7.5 L1.5,11.5 L-1.5,11.5 Z"/>
            <circle cx="0" cy="6.5" r="2.4" fill="#080808"/>
          </g>
          <circle class="fill spark" cx="56" cy="46" r="1.6"/>
          <circle class="fill spark" cx="60" cy="51" r="1.2"/>
          <circle class="fill spark" cx="55" cy="54" r="1.3"/>
        </g>
      </svg>`;
    }
    return `
      <svg viewBox="0 0 64 92">
        <g class="bob">
          <circle class="stroke" cx="32" cy="14" r="8"/>
          <path class="stroke fill-soft" d="M22,24 Q32,20 42,24 L40,50 Q32,54 24,50 Z"/>
          <g class="leg-l"><path class="stroke" d="M28,49 L21,76"/></g>
          <g class="leg-r"><path class="stroke" d="M36,49 L43,76"/></g>
          <g class="arm-swing-l"><path class="stroke" d="M24,28 L14,42"/></g>
          <g class="arm-swing-r"><path class="stroke" d="M40,28 L50,42"/></g>
          <g transform="translate(32,-3)">
            <line class="bulb-ray dim" x1="0" y1="-3" x2="0" y2="-9"/>
            <line class="bulb-ray dim" x1="-7" y1="1" x2="-12" y2="-2"/>
            <line class="bulb-ray dim" x1="7" y1="1" x2="12" y2="-2"/>
            <circle class="fill bulb-core" cx="0" cy="2" r="5.5"/>
            <path class="stroke" d="M-3,7.5 L3,7.5" stroke-width="2.4"/>
          </g>
        </g>
      </svg>`;
  }

  function makeNeonBuddy(type, container, offsetIndex){
    const wrap = document.createElement('div');
    wrap.className = 'neon-buddy walking dir-right buddy-' + type;
    wrap.innerHTML = buildBuddySVG(type);
    wrap.setAttribute('aria-hidden', 'true');   // mascotte purement décorative
    container.appendChild(wrap);

    let dir = 1;
    let busy = false;
    let pending = null;

    const startLeft = 8 + offsetIndex * 70;

    const getMaxLeft = () => Math.max(startLeft, container.clientWidth - wrap.offsetWidth - 8);

    function step(){
      if (busy) return;
      const maxLeft = getMaxLeft();
      const target = dir === 1 ? maxLeft : startLeft;
      const current = parseFloat(wrap.style.left || startLeft);
      const distance = Math.abs(target - current);
      // vitesse ralentie x1.5 par rapport à la version précédente
      const duration = Math.max(2.25, (distance / 80) * 1.5);
      wrap.style.transition = `left ${duration}s linear`;
      wrap.classList.toggle('dir-left', dir === -1);
      wrap.style.left = target + 'px';
      dir *= -1;
    }

    wrap.style.left = startLeft + 'px';
    wrap.addEventListener('transitionend', (e) => {
      if (e.propertyName !== 'left' || busy) return;
      clearTimeout(pending);
      pending = setTimeout(step, 900 + Math.random() * 700);
    });
    pending = setTimeout(step, 800 + offsetIndex * 400 + Math.random() * 600);

    function burst(){
      const r = wrap.getBoundingClientRect();
      const cr = container.getBoundingClientRect();
      const ox = r.left - cr.left + r.width / 2;
      const oy = r.top  - cr.top  + r.height / 2;

      for (let i = 0; i < 14; i++) {
        const p = document.createElement('div');
        p.className = 'buddy-particle';
        const angle = (Math.PI * 2 * i) / 14;
        const dist  = 30 + Math.random() * 35;
        p.style.setProperty('--bx', Math.cos(angle) * dist + 'px');
        p.style.setProperty('--by', Math.sin(angle) * dist + 'px');
        const size = 3 + Math.random() * 4;
        p.style.width  = size + 'px';
        p.style.height = size + 'px';
        p.style.left = ox + 'px';
        p.style.top  = oy + 'px';
        container.appendChild(p);
        p.addEventListener('animationend', () => p.remove());
      }
    }

    wrap.addEventListener('click', () => {
      if (busy) return;
      busy = true;
      clearTimeout(pending);

      burst();
      wrap.classList.add('popped');
      wrap.style.transition = 'none';

      setTimeout(() => {
        wrap.style.left = startLeft + 'px';
        wrap.classList.remove('dir-left');
        wrap.classList.remove('popped');
        dir = 1;
        void wrap.offsetWidth; // force reflow avant de réactiver les transitions
        busy = false;
        pending = setTimeout(step, 900);
      }, 600);
    });
  }

  const buddyFooter = document.querySelector('.projects-footer');
  if (buddyFooter && !reduceMotion) {
    makeNeonBuddy('coder',    buddyFooter, 0);
    makeNeonBuddy('engineer', buddyFooter, 1);
    makeNeonBuddy('thinker',  buddyFooter, 2);
  }

});