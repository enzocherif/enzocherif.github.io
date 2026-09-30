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


  /* Personnage animé du hero : voir avatar.js */

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

  /* About : la route de la carte se trace une fois visible */
  const aboutMap = document.querySelector('.about-map');
  if (aboutMap && !reduceMotion && 'IntersectionObserver' in window) {
    aboutMap.classList.add('armed');
    new IntersectionObserver((es, o) => {
      if (es[0].isIntersecting) { aboutMap.classList.add('go'); o.disconnect(); }
    }, { threshold: 0.35 }).observe(aboutMap);
  }
  /* ══════════════════════════════════════════════════════════════════
     PROJECTS — cartes animées
     - apparition en cascade quand la grille arrive à l'écran
     - chiffres clés qui comptent jusqu'à leur valeur
     - halo qui suit le curseur + légère inclinaison 3D (souris seulement)
     - panneau « How I did it » qui glisse par-dessus la carte
     - filtres avec sortie / entrée animées
  ══════════════════════════════════════════════════════════════════ */
  const pgrid = document.querySelector('.pgrid');
  const pcards = [...document.querySelectorAll('.pcard')];

  const countUp = el => {
    const target = parseFloat(el.dataset.count);
    const dec = (el.dataset.count.split('.')[1] || '').length;
    if (reduceMotion || isNaN(target)) { el.textContent = el.dataset.count; return; }
    const t0 = performance.now(), dur = 1400;
    const tick = t => {
      const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = (target * e).toFixed(dec);
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const revealCards = list => list.forEach((c, i) => {
    c.style.setProperty('--d', i);
    c.classList.add('in');
    const n = c.querySelector('.pcard-num');
    if (n && !n.dataset.done) { n.dataset.done = '1'; setTimeout(() => countUp(n), i * 110 + 250); }
    setTimeout(() => c.classList.add('settled'), 900 + i * 110);
  });

  // rejoue l'apparition à chaque fois que la carte revient à l'écran
  const resetCard = c => {
    c.classList.remove('in', 'settled');
    const n = c.querySelector('.pcard-num');
    if (n) { delete n.dataset.done; n.textContent = '0'; }
  };
  if (pgrid && !reduceMotion && 'IntersectionObserver' in window) {
    pgrid.classList.add('armed');
    pcards.forEach(resetCard);
    let batch = [], batchTimer = 0;
    const cardObs = new IntersectionObserver(entries => {
      entries.forEach(en => {
        const c = en.target;
        if (en.isIntersecting && !c.classList.contains('in')) batch.push(c);
        else if (!en.isIntersecting && !c.classList.contains('open')) resetCard(c);
      });
      clearTimeout(batchTimer);
      batchTimer = setTimeout(() => {
        const list = batch.filter(c => !c.hidden).sort((x, y) => pcards.indexOf(x) - pcards.indexOf(y));
        batch = [];
        revealCards(list);
      }, 30);
    }, { threshold: 0.12 });
    pcards.forEach(c => cardObs.observe(c));
  }

  // halo + inclinaison 3D
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reduceMotion) {
    pcards.forEach(c => {
      c.addEventListener('pointermove', e => {
        const r = c.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        c.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
        c.style.setProperty('--my', (y * 100).toFixed(1) + '%');
        if (!c.classList.contains('open')) {
          c.style.setProperty('--ry', ((x - .5) * 7).toFixed(2) + 'deg');
          c.style.setProperty('--rx', ((.5 - y) * 6).toFixed(2) + 'deg');
        }
      });
      c.addEventListener('pointerleave', () => { c.style.setProperty('--rx', '0deg'); c.style.setProperty('--ry', '0deg'); });
    });
  }

  // panneau de détails
  const setOpen = (c, open) => {
    const btn = c.querySelector('.pcard-more'), det = c.querySelector('.pcard-detail');
    if (open) { det.hidden = false; requestAnimationFrame(() => c.classList.add('open')); c.style.setProperty('--rx', '0deg'); c.style.setProperty('--ry', '0deg'); }
    else { c.classList.remove('open'); setTimeout(() => { if (!c.classList.contains('open')) det.hidden = true; }, 500); }
    btn.setAttribute('aria-expanded', String(open));
  };
  pcards.forEach(c => {
    c.querySelector('.pcard-more')?.addEventListener('click', () => { setOpen(c, true); c.querySelector('.pcard-close').focus({ preventScroll: true }); });
    c.querySelector('.pcard-close')?.addEventListener('click', () => { setOpen(c, false); c.querySelector('.pcard-more').focus({ preventScroll: true }); });
    c.addEventListener('keydown', e => { if (e.key === 'Escape' && c.classList.contains('open')) { setOpen(c, false); c.querySelector('.pcard-more').focus(); } });
  });

  // filtres
  const pfilters = document.querySelectorAll('.pfilter');
  pfilters.forEach(btn => btn.addEventListener('click', () => {
    const f = btn.dataset.f;
    pfilters.forEach(b => { const on = b === btn; b.classList.toggle('active', on); b.setAttribute('aria-pressed', String(on)); });
    const show = c => f === 'all' || c.dataset.cat === f;
    pcards.forEach(c => { if (c.classList.contains('open')) setOpen(c, false); });
    if (reduceMotion) { pcards.forEach(c => { c.hidden = !show(c); }); return; }
    pcards.filter(c => !c.hidden && !show(c)).forEach(c => c.classList.add('leaving'));
    setTimeout(() => {
      pcards.forEach(c => { c.classList.remove('leaving'); c.hidden = !show(c); c.classList.remove('in', 'settled'); });
      requestAnimationFrame(() => revealCards(pcards.filter(c => !c.hidden)));
    }, 260);
  }));

  /* ══════════════════════════════════════════════════════════════════
     THAILAND — signal PWM interactif, chiffres et apparitions au scroll
  ══════════════════════════════════════════════════════════════════ */
  const pwm = document.querySelector('[data-pwm]');
  if (pwm) {
    const wave = pwm.querySelector('.pwm-wave'), avg = pwm.querySelector('.pwm-avg'), grid = pwm.querySelector('.pwm-grid');
    const out = pwm.querySelector('[data-duty]'), range = pwm.querySelector('input');
    const W = 600, H = 150, TOP = 22, BOT = 128, N = 5;
    let g = '';
    for (let i = 1; i < 10; i++) g += `M${i * 60} 0V${H}`;
    for (let j = 1; j < 4; j++) g += `M0 ${j * 37.5}H${W}`;
    grid.setAttribute('d', g);
    let duty = 50, target = 50, phase = 0, raf = 0, auto = !reduceMotion, visible = true, last = 0;
    const draw = () => {
      const P = W / N, off = (phase % 1) * P;
      let d = `M0 ${BOT}`;
      for (let k = -1; k <= N; k++) {
        const x0 = k * P - off, x1 = x0 + P * duty / 100, x2 = x0 + P;
        d += `L${Math.max(0, x0).toFixed(1)} ${BOT}L${Math.max(0, x0).toFixed(1)} ${TOP}L${Math.min(W, Math.max(0, x1)).toFixed(1)} ${TOP}L${Math.min(W, Math.max(0, x1)).toFixed(1)} ${BOT}L${Math.min(W, Math.max(0, x2)).toFixed(1)} ${BOT}`;
      }
      wave.setAttribute('d', d);
      const ya = BOT - (BOT - TOP) * duty / 100;
      avg.setAttribute('d', `M0 ${ya.toFixed(1)}H${W}`);
      out.textContent = Math.round(duty);
      if (auto) range.value = Math.round(duty);
    };
    const tick = t => {
      raf = 0;
      const dt = Math.min(0.05, (t - (last || t)) / 1000); last = t;
      if (auto) target = 50 + 32 * Math.sin(t / 1600);
      duty += (target - duty) * Math.min(1, dt * 6);
      phase += dt * 0.35;
      draw();
      if (visible && !document.hidden) raf = requestAnimationFrame(tick);
    };
    const start = () => { if (!raf && !reduceMotion) { last = 0; raf = requestAnimationFrame(tick); } };
    range.addEventListener('input', () => { auto = false; target = +range.value; if (reduceMotion) { duty = target; draw(); } start(); });
    draw();
    if ('IntersectionObserver' in window) new IntersectionObserver(es => { visible = es[0].isIntersecting; if (visible) start(); }).observe(pwm);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) start(); });
    start();
  }

  const th = document.querySelector('.th');
  if (th && !reduceMotion && 'IntersectionObserver' in window) {
    th.classList.add('armed');
    const els = th.querySelectorAll('.th-hero, .th-stats li, .th-split > *, .th-pillars .cp-pillar, .th-highlight, .th-gallery figure, .lab-phase, .th-bottom > *');
    els.forEach(el => el.classList.add('th-reveal'));
    th.querySelectorAll('.th-stats li').forEach((el, i) => el.style.transitionDelay = (i * 0.1) + 's');
    th.querySelectorAll('.th-pillars .cp-pillar').forEach((el, i) => el.style.transitionDelay = (i * 0.12) + 's');
    th.querySelectorAll('.th-gallery figure').forEach((el, i) => el.style.transitionDelay = (i * 0.1) + 's');
    const io = new IntersectionObserver(es => es.forEach(en => {
      const el = en.target;
      const ns = el.hasAttribute('data-count') ? [el] : [...el.querySelectorAll('[data-count]')];
      if (en.isIntersecting) { el.classList.add('in'); ns.forEach(n => countUp(n)); }
      else { el.classList.remove('in'); ns.forEach(n => { n.textContent = '0'; }); }
    }), { threshold: 0.15 });
    els.forEach(el => io.observe(el));
  }

  /* ══════════════════════════════════════════════════════════════════
     CERTIFICATIONS — apparition rejouée, compteurs, halo au curseur
  ══════════════════════════════════════════════════════════════════ */
  const cc = document.querySelector('.cc');
  if (cc) {
    if (!reduceMotion && 'IntersectionObserver' in window) {
      cc.classList.add('armed');
      const els = cc.querySelectorAll('.cc-stats li, .ccard');
      els.forEach((el, i) => { el.classList.add('cc-reveal'); el.style.transitionDelay = ((i % 3) * 0.1) + 's'; });
      const io = new IntersectionObserver(es => es.forEach(en => {
        const el = en.target, ns = [...el.querySelectorAll('[data-count]')];
        if (en.isIntersecting) { el.classList.add('in'); ns.forEach(n => countUp(n)); }
        else { el.classList.remove('in'); ns.forEach(n => { n.textContent = '0'; }); }
      }), { threshold: 0.15 });
      els.forEach(el => io.observe(el));
    }
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      cc.querySelectorAll('.ccard').forEach(c => c.addEventListener('pointermove', e => {
        const r = c.getBoundingClientRect();
        c.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
        c.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
      }));
    }
  }

  /* Current Position : barre du contrat VIE (mise à jour selon la date du jour) */
  const contract = document.querySelector('.cp-contract');
  if (contract) {
    const start = new Date(contract.dataset.start + 'T00:00:00');
    const end = new Date(contract.dataset.end + 'T23:59:59');
    const now = new Date();
    const p = Math.min(1, Math.max(0, (now - start) / (end - start)));
    const months = (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth() + 1;
    const month = Math.min(months, Math.max(1, (now.getFullYear() - start.getFullYear()) * 12 + now.getMonth() - start.getMonth() + 1));
    contract.querySelector('.cp-fill').style.setProperty('--p', (p * 100).toFixed(1) + '%');
    const label = contract.querySelector('[data-now]');
    const track = contract.querySelector('.cp-track');
    if (now > end) { label.textContent = 'Completed'; track.setAttribute('aria-valuenow', months); }
    else if (now < start) { label.textContent = 'Starts Nov 2025'; track.setAttribute('aria-valuenow', 0); }
    else { label.textContent = `Month ${month} of ${months}`; track.setAttribute('aria-valuenow', month); }
    track.setAttribute('aria-valuemax', months);
  }

  /* Current Position : le flux de données s'allume une fois visible */
  const flow = document.querySelector('.cp-flow');
  if (flow && !reduceMotion && 'IntersectionObserver' in window) {
    flow.classList.add('armed');
    new IntersectionObserver((es, o) => {
      if (es[0].isIntersecting) { flow.classList.add('go'); o.disconnect(); }
    }, { threshold: 0.4 }).observe(flow);
  }

  /* Glossaire : au toucher, ouvre / ferme la définition */
  document.querySelectorAll('.gl').forEach(g => {
    // garde la bulle dans l'écran
    const fit = () => {
      const tip = g.querySelector('.gl-tip');
      tip.style.setProperty('--shift', '0px');
      const r = tip.getBoundingClientRect(), m = 10, W = document.documentElement.clientWidth;
      const shift = r.left < m ? m - r.left : (r.right > W - m ? (W - m) - r.right : 0);
      tip.style.setProperty('--shift', shift + 'px');
    };
    g.addEventListener('mouseenter', fit);
    g.addEventListener('focus', fit);
    g.addEventListener('touchstart', fit, { passive: true });
    g.addEventListener('click', e => {
      e.stopPropagation();
      const was = g.classList.contains('open');
      document.querySelectorAll('.gl.open').forEach(o => o.classList.remove('open'));
      if (!was) g.classList.add('open');
    });
  });
  document.addEventListener('click', () => document.querySelectorAll('.gl.open').forEach(o => o.classList.remove('open')));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') document.querySelectorAll('.gl.open').forEach(o => o.classList.remove('open')); });

  // mobile : la carte défile horizontalement ; on la centre sur l'Europe au départ
  const mapScroll = document.querySelector('.map-scroll');
  if (mapScroll && mapScroll.scrollWidth > mapScroll.clientWidth) {
    mapScroll.scrollLeft = (mapScroll.scrollWidth - mapScroll.clientWidth) * 0.45;
  }


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
     SKILLS — terminal interactif
     1. à l'apparition : la commande `skills --list` se tape toute seule,
        petit spinner, puis les compétences s'affichent ligne par ligne ;
     2. ensuite le visiteur peut taper ses propres commandes (help,
        whoami, python, contact, clear…) ou cliquer sur les suggestions.
  ══════════════════════════════════════════════════════════════════ */
  const SKILLS = [
    { name: 'Python',     color: '#ffd43b', desc: 'Data analysis, AI, scripting',        tag: 'AI · Data',  tagc: '#00ffee',
      more: 'Renault automation tools (Pandas, Tkinter), Alstom configuration tool (PyQt), ML projects (scikit-learn, TensorFlow).' },
    { name: 'MATLAB',     color: '#ff8c42', desc: 'Advanced simulation & modeling',       tag: 'Simulation', tagc: '#ff8c42',
      more: 'ABS & EBD braking model in Simulink, interactive vehicle dynamics simulator (App Designer).' },
    { name: 'C / C++',    color: '#7aa2ff', desc: 'Embedded systems, low-level software', tag: 'Embedded',   tagc: '#ff5ecf',
      more: 'ROS nodes on TurtleBot, TI TMS320F28335 power control, integration with Alstom Solution Core.' },
    { name: 'C#',         color: '#b388ff', desc: 'Graphical user interfaces (GUIs)',     tag: 'Desktop',    tagc: '#b388ff',
      more: 'CFMS RIP Tool at Alstom (train log analysis), UART supervision UI for a mobile robot.' },
    { name: 'Java',       color: '#f89820', desc: 'Backend & mobile development',         tag: 'Backend',    tagc: '#ffd23f',
      more: 'Object-oriented programming, backend and mobile app development.' },
    { name: 'SQL',        color: '#4fc1ff', desc: 'Relational databases',                 tag: 'Data',       tagc: '#00ffee',
      more: 'Relational modeling, queries and data extraction.' },
    { name: 'HTML',       color: '#ff6b4a', desc: 'Web page structure',                   tag: 'Web',        tagc: '#56b6ff',
      more: 'Semantic, accessible page structure — like this portfolio.' },
    { name: 'CSS',        color: '#56b6ff', desc: 'Styling & layout',                     tag: 'Web',        tagc: '#56b6ff',
      more: 'Responsive layouts, animations and the neon look of this site.' },
    { name: 'JavaScript', color: '#f7df1e', desc: 'Dynamic web interfaces',               tag: 'Web',        tagc: '#56b6ff',
      more: 'Interactive UI — including this terminal and the little train scene.' },
    { name: 'Bash',       color: '#7ee787', desc: 'Automation via shell scripts',         tag: 'Tooling',    tagc: '#7ee787',
      more: 'Linux scripting, build and automation tasks.' }
  ];

  // Version accessible (lecteurs d'écran)
  const skillsList = document.getElementById('skills-list');
  if (skillsList) {
    SKILLS.forEach(s => {
      const li = document.createElement('li');
      li.textContent = `${s.name} – ${s.desc}`;
      skillsList.appendChild(li);
    });
  }

  const termBody = document.getElementById('terminal-body');
  if (termBody) {
    const esc = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const sleep = ms => new Promise(r => setTimeout(r, reduceMotion ? 0 : ms));
    const PROMPT = '<span class="t-user">enzo@portfolio</span><span class="t-sep">:</span><span class="t-path">~/skills</span><span class="t-sym">$</span>';
    let busy = true;
    const history = [];
    let histIdx = 0;

    const scrollDown = () => { termBody.scrollTop = termBody.scrollHeight; };
    const addLine = (html, cls = '') => {
      const d = document.createElement('div');
      d.className = 't-line ' + cls;
      d.innerHTML = html;
      termBody.appendChild(d);
      scrollDown();
      return d;
    };

    // ligne de saisie : champ réel (invisible) + texte et curseur bloc affichés
    const inputLine = document.createElement('div');
    inputLine.className = 't-line t-input-line';
    inputLine.innerHTML = `${PROMPT} <span class="t-typed"></span><span class="t-caret"></span>`;
    const typedEl = inputLine.querySelector('.t-typed');
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 't-input';
    input.setAttribute('aria-label', 'Type a terminal command, for example help');
    input.setAttribute('autocomplete', 'off');
    input.setAttribute('autocapitalize', 'off');
    input.setAttribute('spellcheck', 'false');
    inputLine.appendChild(input);

    const showInput = () => {
      typedEl.textContent = '';
      input.value = '';
      termBody.appendChild(inputLine);
      scrollDown();
      busy = false;
    };
    const hideInput = () => { if (inputLine.parentNode) inputLine.remove(); busy = true; };

    // tape une commande caractère par caractère sur une ligne de prompt
    async function typeCommand(cmd) {
      const line = addLine(`${PROMPT} <span class="t-cmd"></span><span class="t-caret"></span>`);
      const out = line.querySelector('.t-cmd');
      for (const ch of cmd) { out.textContent += ch; await sleep(55 + Math.random() * 45); }
      await sleep(260);
      line.querySelector('.t-caret').remove();
    }

    async function spinner(text, ms) {
      const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
      const line = addLine(`<span class="t-spin">⠋</span> <span class="t-dim">${esc(text)}</span>`);
      const sp = line.querySelector('.t-spin');
      const t0 = performance.now();
      let k = 0;
      while (!reduceMotion && performance.now() - t0 < ms) { sp.textContent = frames[k++ % frames.length]; await sleep(70); }
      line.remove();
    }

    async function listSkills() {
      await spinner('fetching skills…', 700);
      addLine(`<span class="t-dim">  #  LANGUAGE     USED FOR</span>`, 't-head');
      const t0 = performance.now();
      for (const [i, s] of SKILLS.entries()) {
        const row = addLine(`
          <span class="t-check">✔</span>
          <span class="t-name" style="--lc:${s.color}">${esc(s.name)}</span>
          <span class="t-desc">${esc(s.desc)}</span>
          <span class="t-tag" style="--tc:${s.tagc}">${esc(s.tag)}</span>`, 't-row');
        row.style.setProperty('--i', i);
        requestAnimationFrame(() => row.classList.add('in'));
        await sleep(110);
      }
      const secs = ((performance.now() - t0) / 1000 + 0.12).toFixed(2);
      await sleep(250);
      addLine(`<span class="t-ok">✔ ${SKILLS.length} skills loaded</span> <span class="t-dim">in ${secs}s · type <b>help</b> or a language name (e.g. <b>python</b>)</span>`, 't-summary');
    }

    const COMMANDS = {
      help: () => {
        addLine('<span class="t-dim">Available commands:</span>');
        [['skills', 'list my programming skills'], ['&lt;language&gt;', 'details, e.g. python, matlab, c#'],
         ['whoami', 'who is Enzo?'], ['projects', 'jump to my projects'], ['resume', 'open my resume'],
         ['contact', 'how to reach me'], ['clear', 'clear the terminal']]
          .forEach(([c, d]) => addLine(`<span class="t-kw">${c}</span><span class="t-dim">${d}</span>`, 't-help'));
      },
      whoami: () => {
        addLine('<span class="t-name" style="--lc:#00ffee">Enzo CHERIF</span> — ATC Software Engineer (VIE) @ <b>Alstom</b>, Pittsburgh 🇺🇸');
        addLine('<span class="t-dim">Dual degree: mechatronic systems &amp; robotics (SeaTech INP Toulon) and artificial intelligence (Université de Toulon)</span>');
      },
      skills: () => listSkills(),
      ls: () => listSkills(),
      contact: () => {
        addLine('✉  <a href="mailto:enzocherife@gmail.com">enzocherife@gmail.com</a>');
        addLine('in <a href="https://www.linkedin.com/in/enzo-cherif-0465b5165/" target="_blank" rel="noopener">linkedin.com/in/enzo-cherif</a>');
        addLine('⌥  <a href="https://github.com/enzocherif" target="_blank" rel="noopener">github.com/enzocherif</a>');
      },
      resume: () => {
        addLine('📄 <a href="rapports/RESUME%20ENZO%20CHERIF.pdf" target="_blank" rel="noopener">RESUME ENZO CHERIF.pdf</a>');
      },
      cv: () => COMMANDS.resume(),
      projects: async () => {
        addLine('<span class="t-dim">→ opening projects…</span>');
        await sleep(500);
        document.getElementById('projects')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
      },
      date: () => addLine(new Date().toString()),
      clear: () => { termBody.innerHTML = ''; },
      hire: () => addLine('<span class="t-ok">✔ Excellent choice!</span> → <a href="mailto:enzocherife@gmail.com?subject=Opportunity">enzocherife@gmail.com</a> 🚀'),
      exit: () => addLine('<span class="t-dim">Nice try — there is no escape from this portfolio 😄</span>')
    };

    async function run(raw) {
      const cmd = raw.trim();
      if (!cmd) return;
      const key = cmd.toLowerCase();
      const first = key.split(/\s+/)[0];
      const skill = SKILLS.find(s => [s.name.toLowerCase(), s.name.toLowerCase().replace(/\s/g, '')].includes(key)
        || (key === 'c' || key === 'c++' || key === 'cpp') && s.name === 'C / C++'
        || (key === 'js') && s.name === 'JavaScript'
        || (key === 'csharp') && s.name === 'C#');
      if (skill) {
        addLine(`<span class="t-name" style="--lc:${skill.color}">${esc(skill.name)}</span> <span class="t-tag" style="--tc:${skill.tagc}">${esc(skill.tag)}</span>`);
        addLine(`<span class="t-dim">└─</span> ${esc(skill.more)}`);
      } else if (first === 'sudo') {
        addLine('<span class="t-err">enzo is not in the sudoers file.</span> <span class="t-dim">This incident will be reported 😉</span>');
      } else if (first === 'echo') {
        addLine(esc(cmd.slice(5)));
      } else if (COMMANDS[first]) {
        await COMMANDS[first]();
      } else {
        addLine(`<span class="t-err">zsh: command not found: ${esc(first)}</span> <span class="t-dim">— try <b>help</b></span>`);
      }
    }

    async function submit(raw, typed = false) {
      if (busy) return;
      hideInput();
      if (typed) await typeCommand(raw);
      else addLine(`${PROMPT} <span class="t-cmd">${esc(raw)}</span>`);
      if (raw.trim()) { history.push(raw); histIdx = history.length; }
      await run(raw);
      showInput();
    }

    input.addEventListener('input', () => { typedEl.textContent = input.value; });
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); const v = input.value; input.value = ''; submit(v).then(() => input.focus({ preventScroll: true })); }
      else if (e.key === 'ArrowUp' && history.length) { e.preventDefault(); histIdx = Math.max(0, histIdx - 1); input.value = history[histIdx]; typedEl.textContent = input.value; }
      else if (e.key === 'ArrowDown' && history.length) { e.preventDefault(); histIdx = Math.min(history.length, histIdx + 1); input.value = history[histIdx] || ''; typedEl.textContent = input.value; }
      else if (e.key === 'l' && e.ctrlKey) { e.preventDefault(); termBody.innerHTML = ''; showInput(); input.focus(); }
    });
    input.addEventListener('focus', () => inputLine.classList.add('focused'));
    input.addEventListener('blur', () => inputLine.classList.remove('focused'));
    termBody.addEventListener('click', e => {
      if (e.target.closest('a')) return;
      if (!busy && window.getSelection().toString() === '') input.focus({ preventScroll: true });
    });
    document.querySelectorAll('.term-chip').forEach(btn =>
      btn.addEventListener('click', () => submit(btn.dataset.cmd, true))
    );

    // séquence d'introduction, déclenchée quand la section apparaît
    async function intro() {
      await sleep(300);
      await typeCommand('skills --list');
      await listSkills();
      showInput();
    }
    const termSec = document.getElementById('competences');
    if (reduceMotion || !('IntersectionObserver' in window)) intro();
    else {
      const termObs = new IntersectionObserver((es, o) => {
        if (es[0].isIntersecting) { o.disconnect(); intro(); }
      }, { threshold: 0.35 });
      termObs.observe(termSec);
    }
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

    const hoverSelector = 'a, button, .card, .project-item img, .flip-scene, .btn-glow, .btn-glow-outline, .btn-download, .btn-view-all, .actor, .train, input, textarea';
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
     D. MINI-SCÈNE ANIMÉE (sous « See all my projects »)
        - quai du haut : un visiteur rejoint une amie, ils discutent
          (bulles), se font signe puis il repart ; un chat passe parfois ;
        - voie du bas : un chef de gare pousse une locomotive.
        Clics :
          visiteur  → ballon / selfie / moonwalk / salto (à tour de rôle)
          amie      → high-five si le visiteur est à côté, sinon « viens ! »
          chef      → glisse et tombe (étoiles), puis se relève
          loco/wagon→ ajoute un wagon (max 3) / un passager fait coucou
          chat      → s'assoit et miaule
        L'horloge de la scène ne tourne que si elle est visible.
  --------------------------------------------------------------- */
  function figureSVG(kind) {
    const acc = {
      cap:       '<path class="acc" d="M21 11 Q30 0 39 11"/><path class="acc" d="M38 10 H47"/>',
      bun:       '<circle class="acc solid" cx="20.5" cy="7.5" r="4.2"/>',
      conductor: '<path class="acc solid" d="M21 5.5 H39 V-1 H21 Z"/><path class="acc" d="M19 6 H46"/>'
    }[kind] || '';
    return `
      <svg class="figure" viewBox="0 -6 60 106" aria-hidden="true">
        <line class="limb back leg leg-l" x1="27" y1="56" x2="27" y2="97"/>
        <g class="upper">
          <line class="limb back arm arm-l" x1="25" y1="30" x2="25" y2="52"/>
          <path class="limb torso" d="M23 26 Q30 21.5 37 26 L35.5 57 Q30 60 24.5 57 Z"/>
          <g class="head">
            <circle class="skull" cx="30" cy="12.5" r="9"/>
            <circle class="solid" cx="34.2" cy="11.2" r="1.5"/>
            <path class="mouth" d="M31.5 16.2 Q34.5 18.4 37 16"/>
            ${acc}
          </g>
          <g class="arm arm-r">
            <line class="limb" x1="35" y1="30" x2="35" y2="52"/>
            <rect class="prop phone" x="31.5" y="49" width="7" height="11" rx="1.6"/>
          </g>
        </g>
        <line class="limb leg leg-r" x1="33" y1="56" x2="33" y2="97"/>
      </svg>`;
  }

  const wheelSVG = (cx, cy, r) => `
      <g class="wheel" style="transform-origin:${cx}px ${cy}px">
        <circle cx="${cx}" cy="${cy}" r="${r}"/>
        <line x1="${cx - r + 2}" y1="${cy}" x2="${cx + r - 2}" y2="${cy}"/>
        <line x1="${cx}" y1="${cy - r + 2}" x2="${cx}" y2="${cy + r - 2}"/>
      </g>`;

  function trainSVG() {
    return `
      <svg class="loco" viewBox="0 0 120 66" aria-hidden="true">
        <defs><clipPath id="cab-clip"><rect x="13" y="18" width="18" height="12" rx="2"/></clipPath></defs>
        <rect x="6" y="12" width="34" height="34" rx="3"/>
        <rect class="window" x="13" y="18" width="18" height="12" rx="2"/>
        <g clip-path="url(#cab-clip)">
          <g class="passenger">
            <circle class="p-head" cx="21" cy="25" r="4.3"/>
            <circle class="p-eye" cx="22.8" cy="24.3" r=".9"/>
            <line class="p-arm" x1="25.5" y1="29" x2="29" y2="21.5"/>
          </g>
        </g>
        <path d="M2 12 H44"/>
        <rect x="40" y="23" width="58" height="23" rx="10"/>
        <path d="M53 23 Q58 15 63 23"/>
        <rect x="78" y="9" width="10" height="14"/>
        <path d="M74 9 H92"/>
        <circle class="lamp" cx="100" cy="31" r="3.2"/>
        <path d="M98 40 L112 50 H98"/>
        <path d="M2 50 H106"/>
        ${wheelSVG(22, 55, 9)}${wheelSVG(58, 57, 7)}${wheelSVG(82, 57, 7)}
        <path class="rod" d="M22 55 L82 57"/>
      </svg>`;
  }

  function wagonSVG() {
    return `
      <svg class="loco" viewBox="0 0 64 66" aria-hidden="true">
        <path d="M0 42 H6 M58 42 H64"/>
        <rect x="5" y="20" width="54" height="28" rx="3"/>
        <path d="M3 20 H61"/>
        <rect class="window" x="11" y="26" width="16" height="10" rx="2"/>
        <rect class="window" x="37" y="26" width="16" height="10" rx="2"/>
        <path d="M3 50 H61"/>
        ${wheelSVG(17, 56, 7)}${wheelSVG(47, 56, 7)}
      </svg>`;
  }

  function catSVG() {
    return `
      <svg class="cat-svg" viewBox="0 0 50 36" aria-hidden="true">
        <path class="tail" d="M10 19 Q2 12 5 3"/>
        <line class="cleg cleg-a" x1="14" y1="24" x2="14" y2="34"/>
        <line class="cleg cleg-b" x1="18" y1="24" x2="18" y2="34"/>
        <ellipse class="cbody" cx="22" cy="20" rx="13" ry="7"/>
        <line class="cleg cleg-b front" x1="29" y1="24" x2="29" y2="34"/>
        <line class="cleg cleg-a front" x1="33" y1="24" x2="33" y2="34"/>
        <g class="chead">
          <path class="cface" d="M33 10 L34 2.5 L38 7.5 L41 2.5 L43.5 10 A6.2 6.2 0 1 1 33 10 Z"/>
          <circle class="solid" cx="40.5" cy="12" r="1.1"/>
        </g>
      </svg>`;
  }

  function initBuddyScene(footer) {
    const stage = document.createElement('div');
    stage.className = 'buddy-stage';
    stage.setAttribute('aria-hidden', 'true');
    stage.innerHTML = `
      <div class="lane lane-top"><div class="platform"></div></div>
      <div class="lane lane-bottom"><div class="rails"></div></div>
      <div class="scene-flash"></div>`;
    footer.appendChild(stage);
    const laneTop = stage.querySelector('.lane-top');
    const laneBottom = stage.querySelector('.lane-bottom');
    const flash = stage.querySelector('.scene-flash');

    const makeActor = (kind, color, lane, inner, extraClass = '') => {
      const el = document.createElement('div');
      el.className = `actor is-idle actor-${kind} ${extraClass}`;
      el.style.setProperty('--c', color);
      el.style.setProperty('--dir', 1);
      el.innerHTML = `<div class="bubble"></div><div class="body">${inner}</div>`;
      lane.appendChild(el);
      return { el, bubble: el.querySelector('.bubble'), x: 0, dir: 1, talking: false, acting: false, frozen: false };
    };
    const A = makeActor('cap', '#00ffee', laneTop, figureSVG('cap'));             // le visiteur
    const B = makeActor('bun', '#ffd23f', laneTop, figureSVG('bun'));             // son amie
    const C = makeActor('conductor', '#ff5ecf', laneBottom, figureSVG('conductor')); // chef de gare
    const cat = makeActor('cat', '#c9a7ff', laneTop, catSVG(), 'cat');

    // accessoires : ballon du visiteur, étoiles du chef de gare
    A.el.insertAdjacentHTML('beforeend', '<span class="ball"></span>');
    C.el.insertAdjacentHTML('beforeend', '<span class="stars"><i>★</i><i>✦</i><i>★</i></span>');

    const trainEl = document.createElement('div');
    trainEl.className = 'train';
    trainEl.style.setProperty('--c', '#00ffee');
    trainEl.innerHTML = `<div class="bubble"></div>${trainSVG()}`;
    laneBottom.appendChild(trainEl);
    const train = { el: trainEl, bubble: trainEl.querySelector('.bubble'), x: 0, talking: false };
    const wagons = [];

    /* ---- moteur : horloge qui n'avance que si la scène est visible ---- */
    let clock = 0, last = null, running = false, nextPuff = 0;
    const waiters = [], tweens = [];
    const movers = new Set();
    const W = () => stage.clientWidth;
    const pick = arr => arr[Math.floor(Math.random() * arr.length)];
    const hands = () => C.el.offsetWidth * 0.92;           // bras tendus du chef
    const locoW = () => train.el.offsetWidth;
    const wagonW = () => locoW() * 64 / 120;
    const convoyW = () => locoW() + wagons.length * (wagonW() + 2);

    const setFace = (a, dir) => {
      a.dir = dir;
      a.el.classList.toggle('face-left', dir < 0);
      a.el.style.setProperty('--dir', dir);
    };
    const setState = (a, st) => {
      a.el.classList.remove('is-idle', 'is-walking', 'is-pushing', 'is-waving');
      a.el.classList.add(st);
    };
    const render = () => {
      [A, B, C, cat].forEach(a => { a.el.style.transform = `translate3d(${a.x}px,0,0)`; });
      const back = C.x + hands();
      wagons.forEach((w, i) => {
        w.x = back + (wagons.length - 1 - i) * (wagonW() + 2);
        w.el.style.transform = `translate3d(${w.x}px,0,0)`;
      });
      train.x = back + wagons.length * (wagonW() + 2);
      train.el.style.transform = `translate3d(${train.x}px,0,0)`;
    };
    const wait = ms => new Promise(r => waiters.push({ t: clock + ms, r }));
    const moveTo = (a, x, speed, state = 'is-walking') => new Promise(r => {
      setFace(a, x >= a.x ? 1 : -1);
      setState(a, state);
      a.target = x; a.speed = speed;
      a.done = () => { setState(a, 'is-idle'); r(); };
      movers.add(a);
    });
    // déplacement « chorégraphié » (hors trajets scriptés), avec easing
    const tweenX = (a, to, dur) => new Promise(r => {
      tweens.push({ a, from: a.x, to, dur, t0: clock, r });
    });
    const ease = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    async function say(a, text, ms = 1800) {
      a.talking = true;
      a.bubble.textContent = text;
      a.bubble.style.setProperty('--shift', '0px');
      const bw = a.bubble.offsetWidth;                       // garde la bulle dans la scène
      const centre = a.x + a.el.offsetWidth / 2;
      const left = centre - bw / 2;
      const clamped = Math.min(Math.max(left, 6), W() - bw - 6);
      a.bubble.style.setProperty('--shift', (clamped - left) + 'px');
      a.el.classList.add('is-talking');
      a.bubble.classList.add('show');
      await wait(ms);
      a.bubble.classList.remove('show');
      a.el.classList.remove('is-talking');
      await wait(300);
      a.talking = false;
    }
    const quickSay = (a, text, ms) => { if (!a.talking) say(a, text, ms); };

    // lance une action : fige le personnage, pose les classes, attend, nettoie
    async function perform(a, cls, ms, during) {
      a.acting = true; a.frozen = true;
      a.el.classList.add('is-acting', cls);
      if (during) await during();
      else await wait(ms);
      a.el.classList.remove(cls, 'is-acting');
      await wait(120);
      a.frozen = false; a.acting = false;
    }

    function puff(big = false) {
      const scale = locoW() / 120;
      const p = document.createElement('span');
      p.className = 'puff' + (big ? ' big' : '');
      p.style.left = (train.x + 83 * scale) + 'px';
      p.style.bottom = (12 + 57 * scale) + 'px';
      laneBottom.appendChild(p);
      p.addEventListener('animationend', () => p.remove());
    }
    function sparkle(x, bottom, lane, n = 8) {
      for (let i = 0; i < n; i++) {
        const s = document.createElement('span');
        s.className = 'sparkle';
        const ang = (Math.PI * 2 * i) / n;
        s.style.left = x + 'px';
        s.style.bottom = bottom + 'px';
        s.style.setProperty('--sx', Math.cos(ang) * 22 + 'px');
        s.style.setProperty('--sy', Math.sin(ang) * 22 + 'px');
        lane.appendChild(s);
        s.addEventListener('animationend', () => s.remove());
      }
    }

    function loop(ts) {
      if (!running) { last = null; return; }
      const dt = last === null ? 16 : Math.min(ts - last, 50);
      last = ts;
      clock += dt;
      for (const a of [...movers]) {
        if (a.frozen) continue;
        const d = a.target - a.x, step = a.speed * dt / 1000;
        if (Math.abs(d) <= step) { a.x = a.target; movers.delete(a); a.done(); }
        else a.x += Math.sign(d) * step;
      }
      for (let i = tweens.length - 1; i >= 0; i--) {
        const tw = tweens[i], p = Math.min((clock - tw.t0) / tw.dur, 1);
        tw.a.x = tw.from + (tw.to - tw.from) * ease(p);
        if (p >= 1) { tweens.splice(i, 1); tw.r(); }
      }
      const rolling = movers.has(C) && !C.frozen && C.el.classList.contains('is-pushing');
      train.el.classList.toggle('is-rolling', rolling);
      wagons.forEach(w => w.el.classList.toggle('is-rolling', rolling));
      if (rolling && clock >= nextPuff) { puff(); nextPuff = clock + 700; }
      for (let i = waiters.length - 1; i >= 0; i--) {
        if (clock >= waiters[i].t) waiters.splice(i, 1)[0].r();
      }
      render();
      requestAnimationFrame(loop);
    }

    /* ---- positions de départ ---- */
    B.x = W() * 0.62; setFace(B, -1);
    A.x = -70;
    C.x = -(convoyW() + hands() + 40);
    cat.x = -80;
    render();

    if (reduceMotion) {           // version statique, sans mouvement
      A.x = B.x - A.el.offsetWidth * 1.35; setFace(A, 1);
      C.x = W() * 0.1;
      render();
      return;
    }

    /* =============== ACTIONS AU CLIC =============== */

    // --- Visiteur : 4 animations à tour de rôle ---
    const visitorActs = ['ball', 'selfie', 'moonwalk', 'salto'];
    let visitorTurn = 0;
    async function visitorAct() {
      if (A.acting) return;
      let act = visitorActs[visitorTurn++ % visitorActs.length];
      if (act === 'moonwalk') {
        // recule dans le dos de là où il regarde ; s'il n'a pas la place → salto
        const to = Math.min(Math.max(A.x - A.dir * 75, 8), W() - A.el.offsetWidth - 8);
        if (Math.abs(to - A.x) < 35) act = 'salto';
        else {
          const home = A.x;
          await perform(A, 'act-moonwalk', 0, async () => {
            quickSay(A, 'Hee-hee! 🕺', 1500);
            await tweenX(A, to, 1500);
            A.el.classList.remove('act-moonwalk');
            A.el.classList.add('act-return');
            await tweenX(A, home, 900);
            A.el.classList.remove('act-return');
          });
          return;
        }
      }
      if (act === 'salto') {
        await perform(A, 'act-salto', 1000);
        quickSay(A, 'Ta-da! ✨', 1300);
      } else if (act === 'selfie') {
        await perform(A, 'act-selfie', 0, async () => {
          await wait(450);
          quickSay(A, 'Selfie! 📸', 1400);
          flash.classList.remove('go'); void flash.offsetWidth; flash.classList.add('go');
          await wait(1200);
        });
      } else if (act === 'ball') {
        await perform(A, 'act-ball', 2300);
        quickSay(A, 'Goal! ⚽', 1300);
      }
    }

    // --- Amie : high-five si le visiteur est tout près, sinon « viens ! » ---
    async function friendAct() {
      if (B.acting) return;
      const gap = A.x - B.x;
      const near = Math.abs(gap) < B.el.offsetWidth * 2 && !A.acting && !movers.has(A);
      if (near) {
        A.acting = true; A.frozen = true;
        const sideB = Math.sign(gap) || 1;                  // côté où se trouve A
        const faceA = A.dir, faceB = B.dir;
        setFace(B, sideB); setFace(A, -sideB);
        const homeA = A.x, homeB = B.x, step = Math.abs(gap) * 0.22;
        await perform(B, 'act-hi5', 0, async () => {
          A.el.classList.add('is-acting', 'act-hi5');
          await Promise.all([tweenX(A, homeA - sideB * step, 380), tweenX(B, homeB + sideB * step, 380)]);
          const mid = (A.x + B.x) / 2 + B.el.offsetWidth / 2;
          sparkle(mid, B.el.offsetHeight + 4, laneTop, 10);
          if (!A.talking) quickSay(B, 'High five! 🙌', 1400);
          await wait(650);
          A.el.classList.remove('act-hi5', 'is-acting');
          await Promise.all([tweenX(A, homeA, 450), tweenX(B, homeB, 450)]);
        });
        setFace(A, faceA); setFace(B, faceB);
        A.frozen = false; A.acting = false;
      } else {
        const towardA = (A.x > -40 && A.x < W()) ? Math.sign(A.x - B.x) || -1 : -1;
        const face = B.dir;
        setFace(B, towardA);
        await perform(B, 'act-call', 0, async () => {
          quickSay(B, 'Come here! 👋', 1500);
          await wait(1500);
        });
        setFace(B, face);
      }
    }

    // --- Chef de gare : il glisse et tombe, étoiles, puis se relève ---
    async function conductorAct() {
      if (C.acting) return;
      await perform(C, 'act-fall', 0, async () => {
        await wait(2100);
        quickSay(C, 'Oops! 😅', 1300);
        C.el.classList.remove('act-fall');
        await wait(500);
      });
    }

    // --- Loco / wagons : ajoute un wagon (max 3) ou un passager fait coucou ---
    let trainClicks = 0, passengerBusy = false;
    function addWagon() {
      const el = document.createElement('div');
      el.className = 'train wagon wagon-new';
      el.style.setProperty('--c', '#00ffee');
      el.innerHTML = wagonSVG();
      laneBottom.appendChild(el);
      el.addEventListener('click', trainAct);
      el.addEventListener('animationend', () => el.classList.remove('wagon-new'), { once: true });
      wagons.push({ el, x: 0 });
      C.x -= wagonW() + 2;                     // la loco ne bouge pas : le chef recule
      if (movers.has(C) && C.target < C.x) C.target = C.x;
      render();
      quickSay(C, pick(['One more?! 😩', 'Heavier… 💦', 'Seriously? 😤']), 1400);
    }
    async function passenger() {
      if (passengerBusy) return;
      passengerBusy = true;
      train.el.classList.add('show-passenger');
      quickSay(train, pick(['Hello from the cab! 👋', 'Choo choo! 🚂', 'Tickets please! 🎫']), 1500);
      puff(true); setTimeout(() => puff(true), 180);
      await wait(1900);
      train.el.classList.remove('show-passenger');
      await wait(400);
      passengerBusy = false;
    }
    function trainAct() {
      trainClicks++;
      if (wagons.length < 3 && trainClicks % 2 === 1) addWagon();
      else passenger();
    }

    // --- Chat : s'assoit et miaule ---
    async function catAct() {
      if (cat.acting) return;
      await perform(cat, 'act-sit', 0, async () => {
        await wait(250);
        await say(cat, pick(['Meow 🐾', 'Mrrr… 😺', 'Purr ✨']), 1500);
      });
    }

    A.el.addEventListener('click', visitorAct);
    B.el.addEventListener('click', friendAct);
    C.el.addEventListener('click', conductorAct);
    trainEl.addEventListener('click', trainAct);
    cat.el.addEventListener('click', catAct);

    /* =============== SCÈNES EN BOUCLE =============== */

    // --- scène 1 : la rencontre ---
    const DIALOGS = [
      ['Hey! 👋', 'Oh, hi!', 'Seen the ROS robot?', 'Yes, it maps by itself! 🤖'],
      ['Coffee? ☕', 'Only if it’s automated!', 'Python script?', 'Already running 😎'],
      ['Nice train, huh?', 'Made for Alstom 🚆', 'Is it fast?', 'Safety first! 🛡️'],
      ['Hi there!', 'Hello!', 'Checked the projects?', 'On it! 🚀'],
      ['Guess what?', 'What?', 'Excel took 2 weeks…', '…now 30 sec! ⚡']
    ];
    const idleUntilFree = async a => { while (a.acting) await wait(150); };
    async function meetLoop() {
      let fromLeft = true, prev = null;
      for (;;) {
        let d; do { d = pick(DIALOGS); } while (d === prev); prev = d;
        const w = W();
        const spot = fromLeft ? w * 0.62 : w * 0.38;          // l'amie se place en face
        await idleUntilFree(B);
        if (Math.abs(B.x - spot) > 4) await moveTo(B, spot, 40);
        setFace(B, fromLeft ? -1 : 1);
        await wait(400);
        await idleUntilFree(A);
        A.x = fromLeft ? -70 : w + 30;
        const gap = A.el.offsetWidth * 1.35;
        await moveTo(A, fromLeft ? B.x - gap : B.x + gap, 70);
        setFace(A, fromLeft ? 1 : -1);
        await wait(250);
        for (let i = 0; i < 4; i++) {
          const who = i % 2 ? B : A;
          await idleUntilFree(who);
          await say(who, d[i], [1700, 1800, 2000, 2300][i]);
        }
        await idleUntilFree(A); await idleUntilFree(B);
        setState(A, 'is-waving'); setState(B, 'is-waving');
        await wait(1300);
        setState(A, 'is-idle'); setState(B, 'is-idle');
        await wait(200);
        await idleUntilFree(A);
        await moveTo(A, fromLeft ? -80 : W() + 40, 65);
        await wait(1800);
        fromLeft = !fromLeft;
      }
    }

    // --- scène 2 : le chef de gare pousse le train ---
    async function trainLoop() {
      await wait(1500);
      for (;;) {
        C.x = -(convoyW() + hands() + 30);
        render();
        await moveTo(C, W() * (0.25 + Math.random() * 0.2), 50, 'is-pushing');
        await idleUntilFree(C);
        await say(C, pick(['Phew… 😮‍💨', 'So heavy! 💪', 'Next stop: Pittsburgh 🇺🇸', 'All aboard! 🎫']), 1700);
        await wait(250);
        await idleUntilFree(C);
        await moveTo(C, W() + 40, 50, 'is-pushing');
        await wait(2800);
      }
    }

    // --- scène 3 : un chat traverse le quai de temps en temps ---
    async function catLoop() {
      await wait(9000);
      for (;;) {
        const ltr = Math.random() < 0.5;
        cat.x = ltr ? -70 : W() + 20;
        await moveTo(cat, ltr ? W() + 20 : -70, 58);
        await wait(22000 + Math.random() * 18000);
      }
    }

    /* ---- lecture / pause selon la visibilité ---- */
    const io = new IntersectionObserver(entries => {
      const vis = entries[0].isIntersecting;
      stage.classList.toggle('paused', !vis);
      if (vis && !running) { running = true; requestAnimationFrame(loop); }
      else if (!vis) running = false;
    }, { threshold: 0.05 });
    io.observe(stage);

    window.addEventListener('resize', () => {
      if (!movers.has(B) && !B.acting) B.x = Math.min(B.x, W() - B.el.offsetWidth - 10);
      render();
    }, { passive: true });

    meetLoop();
    trainLoop();
    catLoop();
  }

  const buddyFooter = document.querySelector('.projects-footer');
  if (buddyFooter) initBuddyScene(buddyFooter);

});