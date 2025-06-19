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

/* ==========  UI GLOBALE  ============================================= */
document.addEventListener('DOMContentLoaded', () => {
/* ---------------- Nav active on scroll ---------------------------- */
const navLinks = document.querySelectorAll('.header-nav a');
const sections = Array.from(navLinks).map(link =>
  document.querySelector(link.getAttribute('href'))
);
const navObs = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      navLinks.forEach(l=>l.classList.toggle(
        'active',
        l.getAttribute('href') === '#'+entry.target.id
      ));
    }
  });
},{ rootMargin:'-40% 0px -50% 0px' });      // zone centrale du viewport

sections.forEach(sec=> sec && navObs.observe(sec));

/* ---------- Burger toggle mobile ---------------------------------- */
const burger = document.getElementById("burger");
const mobileNav = document.getElementById("mobile-nav");

burger.addEventListener("click", () => {
  const isOpen = burger.classList.contains("open");
  burger.classList.toggle("open", !isOpen);
  mobileNav.classList.toggle("open", !isOpen);
});

// Fermer le menu quand on clique sur un lien
document.querySelectorAll('#mobile-nav a').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('open');
    mobileNav.classList.remove('open');
  });
});


  /* ------------------------------------------------------------------ */
  /* 1)  COULEUR PRINCIPALE                                             */
  /* ------------------------------------------------------------------ */
  const mainColor =
    getComputedStyle(document.documentElement)
      .getPropertyValue('--main-color')
      .trim() || '#00ffca';

  /* ------------------------------------------------------------------ */
  /* 2)  PARTICLES DANS LE HEADER                                       */
  /* ------------------------------------------------------------------ */
  particlesJS('particles-js',{
    particles:{
      number:{ value:60, density:{ enable:true, value_area:800 }},
      color :{ value: mainColor },
      shape :{ type:'circle' },
      opacity:{ value:0.5, random:true },
      size  :{ value:3,   random:true },
      move  :{ enable:true, speed:2 }
    },
    interactivity:{
      detect_on:'canvas',
      events:{
        onhover:{ enable:true,  mode:['grab','bubble'] },
        onclick:{ enable:true,  mode:'push' },
        resize:true
      },
      modes:{
        grab   :{ distance:150, line_linked:{ opacity:0.7 }},
        bubble :{ distance:200, size:6, opacity:0.8, duration:2, speed:3 },
        push   :{ particles_nb:4 }
      }
    },
    retina_detect:true
  });

  /* ------------------------------------------------------------------ */
  /* 3)  TEXTE “TYPED” (si tu le gardes)                                */
  /* ------------------------------------------------------------------ */
  const typedText = document.querySelector('.typed-text');
  if(typedText){
    const words = [
	  'AI Explorer',
      'Automation Engineer',
      'Python Developer',
	  'Embedded Software',
      'Robotics Enthusiast',
      'Mechatronics Engineer'
    ];
    let idx = 0, char = 0, erase = false;
    const speed = () => (erase ? 50 : 100);
    const tick  = () => {
      if(!erase && char === words[idx].length){
        erase = true; setTimeout(tick, 1600); return;
      }
      if(erase && char === 0){
        erase = false; idx = (idx+1)%words.length;
      }
      typedText.textContent =
        words[idx].substring(0, erase ? --char : ++char);
      setTimeout(tick, speed());
    };
    tick();
  }

  /* ------------------------------------------------------------------ */
  /* 4)  HALO INTERACTIF SOUS LE CURSEUR                                */
  /* ------------------------------------------------------------------ */

  /* ------------------------------------------------------------------ */
  /* 5)  REVEAL-ON-SCROLL (ABOUT)                                       */
  /* ------------------------------------------------------------------ */
  const toReveal = document.querySelectorAll('#about-title, .about-container');
  const obs = new IntersectionObserver((entries,o)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('reveal'); o.unobserve(e.target);
      }
    });
  },{ threshold:0.25 });
  toReveal.forEach(el=>obs.observe(el));

  /* ------------------------------------------------------------------ */
  /* 6)  HEADER HIDE/SHOW                                               */
  /* ------------------------------------------------------------------ */
  const header        = document.getElementById('fullscreen-header');
  let   lastScrollTop = 0;
  window.addEventListener('scroll', ()=> {
	  const st = window.scrollY || document.documentElement.scrollTop;

	  if (st > lastScrollTop) {
		// on descend → on cache
		header.classList.add('hide');
	  } else if (st === 0) {
		// uniquement quand on est tout en haut de la page
		header.classList.remove('hide');
	  }
	  lastScrollTop = st <= 0 ? 0 : st;
	});
  const stickyNav = document.querySelector('.sticky-nav');

	window.addEventListener('scroll', () => {
	  if (window.scrollY > 100) {
		stickyNav.classList.add('show');
	  } else {
		stickyNav.classList.remove('show');
	  }
	});


  AOS.init({
	  duration: 800,      // ms
	  once: true,         // ne rejoue pas quand on remonte
	  offset: 120         // déclenche un peu avant d’être visible
	});
/* ---------- ACCORDION Stage Thaïlande ----------------------------- */
  document.querySelectorAll('#stage-thailande .accordion-btn').forEach(btn => {
    /* ajoute une petite flèche ▼ */
    btn.insertAdjacentHTML('beforeend','<span class="arrow">▼</span>');

    btn.addEventListener('click', () => {
      const panel  = btn.nextElementSibling;
      const isOpen = panel.classList.contains('open');

      /* ferme tous les panneaux */
      document.querySelectorAll('#stage-thailande .accordion-panel')
              .forEach(p => { p.style.maxHeight = null; p.classList.remove('open'); });
      document.querySelectorAll('#stage-thailande .accordion-btn')
              .forEach(b => b.classList.remove('active'));

      /* si fermé, on ouvre celui cliqué */
      if(!isOpen){
        panel.style.maxHeight = panel.scrollHeight + 'px';
        panel.classList.add('open');
        btn.classList.add('active');
      }
    });
  });
  
/* ------------------ Terminal “Compétences” ------------------------- */
  const terminal  = document.getElementById('terminal-content');
  const linesFr = [
	  "....................Programming Skills....................",
	  "-> Python      - Data analysis, AI, scripting",
	  "-> MATLAB      - Advanced simulation & modeling",
	  "-> C / C++     - Embedded systems, low-level software",
	  "-> C#          - Graphical user interfaces (GUIs)",
	  "-> Java        - Backend & mobile development",
	  "-> SQL         - Relational databases",
	  "-> HTML        - Web page structure",
	  "-> CSS         - Styling & layout",
	  "-> JavaScript  - Dynamic web interfaces",
	  "-> Bash        - Automation via shell scripts"
	];


  let line = 0, char = 0;

  const type = () => {
    if (line < linesFr.length) {
      if (char < linesFr[line].length) {
        terminal.textContent += linesFr[line][char++];
      } else {
        terminal.textContent += "\n";
        line++; char = 0;
      }
      setTimeout(type, 45);
    }
  };

  type();                     // démarre le typing dès l’arrivée à la section
  
/* ---------- Swiper Références ------------------------------------ */
  new Swiper('.swiper-container',{
    loop:true,
    autoplay:{ delay:5500, disableOnInteraction:false },
    speed:750,
    slidesPerView:1,
    spaceBetween:30,
    grabCursor:true,
    pagination:{ el:'.swiper-pagination', clickable:true },
    navigation:{ nextEl:'.swiper-button-next',
                 prevEl:'.swiper-button-prev' }
  });

/* ---------- active dots on scroll -------------------------------- */
  const items = document.querySelectorAll('.tl-item');

  const observer = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting) e.target.classList.add('active');
    });
  },{ threshold:0.5 });

  items.forEach(i=>observer.observe(i));

/* ---------- tilt effect for .tilt elements ------------------------ */
  const tiltEl = document.querySelector('.tilt');
  const strength = 12; // max deg

  if(tiltEl){
    tiltEl.addEventListener('mousemove', e=>{
      const rect = tiltEl.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width/2;
      const y = e.clientY - rect.top  - rect.height/2;
      const rx = (+1)*strength * y / (rect.height/2);
      const ry = (-1)*strength * x / (rect.width/2);
      tiltEl.style.transform =
        `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    tiltEl.addEventListener('mouseleave', ()=>{
      tiltEl.style.transform = 'none';
    });
  }
	const backToTop = document.getElementById("back-to-top");

	window.addEventListener("scroll", () => {
	  if (window.scrollY > 300) {
		backToTop.classList.add("visible");
	  } else {
		backToTop.classList.remove("visible");
	  }
	});

});



