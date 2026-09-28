/* =====================================================================
   PORTFOLIO – ENZO CHERIF
   projets.js — page "All My Projects" (particules, filtres, typewriter)
   ===================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Fond à particules (ignoré si le CDN est indisponible) ---------- */
  if (typeof window.particlesJS === 'function' && !reduceMotion) {
    particlesJS('particles-js', {
      particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: '#00ffea' },
        shape: { type: 'circle' },
        opacity: { value: 0.5 },
        size: { value: 3 },
        line_linked: { enable: true, distance: 150, color: '#00ffea', opacity: 0.4, width: 1 },
        move: { enable: true, speed: 2, direction: 'none', out_mode: 'out' }
      },
      interactivity: {
        detect_on: 'canvas',
        events: {
          onhover: { enable: true, mode: 'grab' },
          onclick: { enable: true, mode: 'push' },
          resize: true
        },
        modes: {
          grab: { distance: 200, line_linked: { opacity: 0.6 } },
          push: { particles_nb: 4 }
        }
      },
      retina_detect: true
    });
  }

  /* ---------- Accordéon des filtres ---------- */
  const toggleBtn = document.querySelector('.filter-toggle');
  const panel = document.querySelector('.filter-panel');
  if (toggleBtn && panel) {
    toggleBtn.addEventListener('click', () => {
      const open = panel.classList.toggle('open');
      toggleBtn.classList.toggle('active', open);
      toggleBtn.setAttribute('aria-expanded', String(open));
    });
  }

  /* ---------- Filtrage des cartes ---------- */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const noResults = document.getElementById('no-results');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => {
        b.classList.toggle('active', b === btn);
        b.setAttribute('aria-pressed', String(b === btn));
      });
      const filter = btn.dataset.filter;
      let visible = 0;
      projectCards.forEach(card => {
        const show = filter === 'all' || card.classList.contains(filter);
        card.hidden = !show;
        if (show) visible++;
      });
      if (noResults) noResults.hidden = visible > 0;
    });
  });

  /* ---------- Année du footer ---------- */
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Typewriter ---------- */
  const typeEl = document.getElementById('typewriter');
  if (!typeEl) return;
  const words = [
    'simulation',
    'AI & robotics',
    'data processing',
    'embedded systems',
    'machine learning',
    'real-time control',
    'image classification',
    'intelligent automation'
  ];
  if (reduceMotion) { typeEl.textContent = words.join(', '); return; }

  let wordIndex = 0, charIndex = 0, isDeleting = false;
  const typingSpeed = 120, deletingSpeed = 80, pauseAfter = 2000;

  function tick() {
    const current = words[wordIndex];
    if (!isDeleting) {
      typeEl.textContent = current.slice(0, ++charIndex);
      if (charIndex === current.length) {
        isDeleting = true;
        return setTimeout(tick, pauseAfter);
      }
    } else {
      typeEl.textContent = current.slice(0, --charIndex);
      if (charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
      }
    }
    setTimeout(tick, isDeleting ? deletingSpeed : typingSpeed);
  }
  tick();
});
