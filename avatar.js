/* =====================================================================
   PORTFOLIO – ENZO CHERIF
   avatar.js — portrait vivant (WebGL, une seule image haute définition)
   ---------------------------------------------------------------------
   Principe (façon « Live2D ») : le portrait est posé sur une grille de
   points déformée à chaque image.
   • Tête : rotation gauche/droite et haut/bas simulée par parallaxe de
     profondeur (le nez bouge plus que les oreilles), inclinaison autour
     du cou, avec inertie (ressort). Le buste accompagne très peu.
   • Yeux : iris sur calques séparés, découpés par la forme exacte des
     yeux ; ils suivent le curseur plus vite que la tête.
   • Clignements : paupières reconstruites (3 étapes), irréguliers.
   • Expressions par déformation locale : léger sourire, sourcils levés
     (curiosité / surprise discrète), sourcils froncés (air pensif).
   • Au repos : micro-mouvements, micro-saccades, coups d'œil, humeurs
     tirées au hasard sans répétition mécanique.
   Limites assumées : pas de vraie vue de profil ni de bouche ouverte
   (l'image source ne contient ni l'intérieur de la bouche ni les côtés).
   Repli : sans WebGL / avec « réduire les animations » → image fixe.
   ===================================================================== */
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const now = () => performance.now();
  const rand = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const smooth = (e0, e1, x) => { const t = clamp((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t); };

  function loadImage(src) {
    return new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });
  }

  /* ---------------- géométrie du visage (pixels de l'image 1262 × 1246) ---------------- */
  const G = {
    W: 1262, H: 1246,
    head: { cx: 612, cy: 440, rx: 360, ry: 470 },     // tête + cheveux + oreilles
    face: { cx: 612, cy: 520, rx: 300, ry: 360 },     // profondeur (nez au plus proche)
    pivot: { x: 612, y: 900 },                        // cou
    browL: [500, 408], browR: [722, 396], browInL: [562, 412], browInR: [664, 404],
    mouthL: [508, 643], mouthR: [722, 632], cheekL: [470, 560], cheekR: [760, 550]
  };
  const gauss = (x, y, p, sx, sy) => Math.exp(-(((x - p[0]) / sx) ** 2 + ((y - p[1]) / sy) ** 2));

  /* ---------------- shaders ---------------- */
  const VS = `
    attribute vec2 aPos; attribute vec2 aUV; varying vec2 vUV;
    void main(){ vUV = aUV; gl_Position = vec4(aPos, 0.0, 1.0); }`;
  const FS = `
    precision mediump float;
    varying vec2 vUV;
    uniform sampler2D uBase, uMask, uIrisL, uIrisR, uLidL, uLidR;
    uniform vec4 uIrisBoxL, uIrisBoxR, uLidBoxL, uLidBoxR;   // x, y, w, h en UV
    uniform vec2 uOffL, uOffR;                               // décalage des iris (UV)
    uniform float uLid;                                      // 0 = ouvert … 3 = fermé
    vec4 over(vec4 c, vec4 s, float k){ float a = s.a * k; return vec4(mix(c.rgb, s.rgb, a), c.a + a * (1.0 - c.a)); }
    vec4 lid(sampler2D t, vec4 box, vec2 uv, float f){
      vec2 p = (uv - box.xy) / box.zw;
      if (p.x < 0.0 || p.y < 0.0 || p.x > 1.0 || p.y > 1.0 || f <= 0.0) return vec4(0.0);
      float k = clamp(floor(f - 0.0001), 0.0, 2.0);          // étape courante (0,1,2)
      float fr = f - k;                                       // mélange vers l'étape suivante
      vec4 b = texture2D(t, vec2(p.x, (k + p.y) / 3.0));
      fr = clamp(fr, 0.0, 1.0);
      if (k < 0.5) return vec4(b.rgb, b.a * fr);                // apparition de la 1re étape
      vec4 a = texture2D(t, vec2(p.x, (k - 1.0 + p.y) / 3.0));
      vec4 pm = mix(vec4(a.rgb * a.a, a.a), vec4(b.rgb * b.a, b.a), fr);  // mélange en prémultiplié
      return vec4(pm.rgb / max(pm.a, 0.0001), pm.a);
    }
    void main(){
      vec4 c = texture2D(uBase, vUV);
      vec2 m = texture2D(uMask, vUV).rg;
      vec2 pl = (vUV - uIrisBoxL.xy - uOffL) / uIrisBoxL.zw;
      if (m.r > 0.0 && pl.x > 0.0 && pl.y > 0.0 && pl.x < 1.0 && pl.y < 1.0) c = over(c, texture2D(uIrisL, pl), m.r);
      vec2 pr = (vUV - uIrisBoxR.xy - uOffR) / uIrisBoxR.zw;
      if (m.g > 0.0 && pr.x > 0.0 && pr.y > 0.0 && pr.x < 1.0 && pr.y < 1.0) c = over(c, texture2D(uIrisR, pr), m.g);
      c = over(c, lid(uLidL, uLidBoxL, vUV, uLid), 1.0);
      c = over(c, lid(uLidR, uLidBoxR, vUV, uLid), 1.0);
      gl_FragColor = vec4(c.rgb * c.a, c.a);                  // alpha prémultiplié
    }`;

  async function initAvatar(root) {
    if (!root || reduceMotion) return;
    const D = window.__AVATAR_DATA;
    if (!D) return;
    const stage = root.querySelector('.hc-breath') || root;

    const canvas = document.createElement('canvas');
    canvas.className = 'av-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    const gl = canvas.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: true });
    if (!gl) return;                                          // repli : image fixe

    let imgs;
    try { imgs = await Promise.all(['base', 'mask', 'irisL', 'irisR', 'lidL', 'lidR'].map(k => loadImage(D[k]))); }
    catch (e) { return; }

    /* ----- programme ----- */
    function sh(type, src) { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; }
    const prog = gl.createProgram();
    try { gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS)); }
    catch (e) { return; }
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    function tex(img, unit, mip) {
      const t = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      if (mip) { gl.generateMipmap(gl.TEXTURE_2D); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR); }
      else gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      return t;
    }
    tex(imgs[0], 0, true); tex(imgs[1], 1, true);             // base & masque en 1024² (mipmaps)
    tex(imgs[2], 2, false); tex(imgs[3], 3, false); tex(imgs[4], 4, false); tex(imgs[5], 5, false);
    const U = n => gl.getUniformLocation(prog, n);
    ['uBase', 'uMask', 'uIrisL', 'uIrisR', 'uLidL', 'uLidR'].forEach((n, i) => gl.uniform1i(U(n), i));
    const g = D.geom;
    const box = b => [b[0] / g.W, b[1] / g.H, b[2] / g.W, b[3] / g.H];
    gl.uniform4fv(U('uIrisBoxL'), box(g.irisL)); gl.uniform4fv(U('uIrisBoxR'), box(g.irisR));
    gl.uniform4fv(U('uLidBoxL'), box(g.lidL));   gl.uniform4fv(U('uLidBoxR'), box(g.lidR));
    const uOffL = U('uOffL'), uOffR = U('uOffR'), uLid = U('uLid');

    /* ----- grille déformable ----- */
    const NX = 56, NY = 56, NV = (NX + 1) * (NY + 1);
    const src = new Float32Array(NV * 2), uv = new Float32Array(NV * 2), pos = new Float32Array(NV * 2);
    const wHead = new Float32Array(NV), depth = new Float32Array(NV);
    const wBrowL = new Float32Array(NV), wBrowR = new Float32Array(NV), wInL = new Float32Array(NV), wInR = new Float32Array(NV);
    const wMouL = new Float32Array(NV), wMouR = new Float32Array(NV), wChk = new Float32Array(NV);
    for (let j = 0, k = 0; j <= NY; j++) for (let i = 0; i <= NX; i++, k++) {
      const x = i / NX * G.W, y = j / NY * G.H;
      src[2 * k] = x; src[2 * k + 1] = y; uv[2 * k] = i / NX; uv[2 * k + 1] = j / NY;
      const hx = (x - G.head.cx) / G.head.rx, hy = (y - G.head.cy) / G.head.ry;
      const r = Math.sqrt(hx * hx + hy * hy);
      wHead[k] = (1 - smooth(0.95, 1.22, r)) * (1 - smooth(835, 960, y));       // s'éteint vers le col
      const fx = (x - G.face.cx) / G.face.rx, fy = (y - G.face.cy) / G.face.ry;
      depth[k] = Math.sqrt(Math.max(0, 1 - fx * fx - fy * fy));
      wBrowL[k] = gauss(x, y, G.browL, 85, 30); wBrowR[k] = gauss(x, y, G.browR, 85, 30);
      wInL[k] = gauss(x, y, G.browInL, 38, 22); wInR[k] = gauss(x, y, G.browInR, 38, 22);
      wMouL[k] = gauss(x, y, G.mouthL, 34, 26); wMouR[k] = gauss(x, y, G.mouthR, 34, 26);
      wChk[k] = gauss(x, y, G.cheekL, 55, 45) + gauss(x, y, G.cheekR, 55, 45);
    }
    const idx = [];
    for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) {
      const a = j * (NX + 1) + i, b = a + 1, c = a + NX + 1, d = c + 1;
      idx.push(a, b, c, b, d, c);
    }
    const posBuf = gl.createBuffer(), uvBuf = gl.createBuffer(), ib = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuf); gl.bufferData(gl.ARRAY_BUFFER, uv, gl.STATIC_DRAW);
    const aUV = gl.getAttribLocation(prog, 'aUV'); gl.enableVertexAttribArray(aUV); gl.vertexAttribPointer(aUV, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf); gl.bufferData(gl.ARRAY_BUFFER, pos, gl.DYNAMIC_DRAW);
    const aPos = gl.getAttribLocation(prog, 'aPos'); gl.enableVertexAttribArray(aPos); gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(idx), gl.STATIC_DRAW);
    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    stage.appendChild(canvas);
    function resize() {
      const r = stage.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(clamp(r.width * dpr, 64, 1400)), h = Math.round(w * G.H / G.W);
      if (canvas.width !== w) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); }
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });
    root.classList.add('av-live');

    /* ---------------- état animé ----------------
       Chaque paramètre a une cible et suit un ressort (tête : lent, avec un
       léger dépassement ; yeux : rapide ; expressions : moyen). */
    const P = {};
    function param(name, k, c) { P[name] = { v: 0, vel: 0, t: 0, k, c }; }
    param('yaw', 42, 10.5); param('pitch', 42, 10.5); param('roll', 30, 9.5);
    param('gx', 260, 30); param('gy', 260, 30);
    param('brow', 60, 14); param('frown', 60, 14); param('smile', 45, 12.5);
    function stepParams(dt) {
      for (const n in P) {
        const p = P[n];
        p.vel += (p.k * (p.t - p.v) - p.c * p.vel) * dt;
        p.v += p.vel * dt;
      }
    }

    /* ---------------- entrées ---------------- */
    const fineMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    let px = 0, py = 0, tracking = false, lastMove = 0;
    let look = null, mood = null;
    const IDLE_MS = 3500;
    if (fineMouse) {
      window.addEventListener('pointermove', e => {
        if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
        px = e.clientX; py = e.clientY; lastMove = now(); tracking = true;
        if (mood) endMood();
      }, { passive: true });
      document.documentElement.addEventListener('mouseleave', () => { tracking = false; });
      window.addEventListener('blur', () => { tracking = false; });
    }
    window.addEventListener('pointerdown', e => {
      if (e.pointerType !== 'touch') return;
      const a = aim(e.clientX, e.clientY);
      look = { yaw: a.yaw * 0.8, pitch: a.pitch * 0.8, gx: a.gx, gy: a.gy, until: now() + 1500 };
      if (mood) endMood();
    }, { passive: true });

    // position écran d'un point de l'image
    function screenPt(x, y) {
      const r = canvas.getBoundingClientRect();
      return [r.left + x / G.W * r.width, r.top + y / G.H * r.height];
    }
    function aim(sx, sy) {
      const [cx, cy] = screenPt(612, 470);
      const dx = sx - cx, dy = sy - cy;
      return {
        yaw: Math.tanh(dx / 620), pitch: Math.tanh(dy / 420),       // tête : amplitude douce
        gx: Math.tanh(dx / 300), gy: Math.tanh(dy / 260)            // yeux : plus vifs
      };
    }

    /* ---------------- clignements ---------------- */
    let blink = null, nextBlink = now() + rand(1500, 3200);
    function startBlink() {
      const dbl = Math.random() < 0.17;
      blink = { t0: now(), dur: 190, dbl };
    }
    function lidValue(t) {
      if (!blink) return 0;
      let e = t - blink.t0;
      if (blink.dbl && e > blink.dur) { e -= blink.dur + 70; if (e < 0) return 0; }
      if (e > blink.dur) { blink = null; nextBlink = t + (Math.random() < 0.12 ? rand(6500, 9500) : rand(2300, 5800)); return 0; }
      const x = e / blink.dur;                         // fermeture rapide, réouverture un peu plus lente
      const v = x < 0.38 ? x / 0.38 : x < 0.52 ? 1 : 1 - (x - 0.52) / 0.48;
      return 3 * clamp(v, 0, 1);
    }

    /* ---------------- humeurs au repos ---------------- */
    const MOODS = [
      { n: 'glance',    w: 3.0 },
      { n: 'softSmile', w: 2.6 },
      { n: 'pensive',   w: 2.0 },
      { n: 'curious',   w: 1.9 },
      { n: 'surprise',  w: 0.7 },
      { n: 'warm',      w: 1.3 }
    ];
    const recent = [];
    let nextMood = now() + rand(4500, 7500);
    function pickMood() {
      const pool = MOODS.filter(m => !recent.includes(m.n));
      let x = Math.random() * pool.reduce((s, m) => s + m.w, 0);
      for (const m of pool) { x -= m.w; if (x <= 0) return m.n; }
      return pool[0].n;
    }
    function startMood(t, forced) {
      const n = forced || pickMood(); recent.push(n); if (recent.length > 2) recent.shift();
      const side = Math.random() < 0.62 ? -1 : 1;     // plutôt vers le contenu, à gauche
      const M = { n, t0: t };
      switch (n) {
        case 'glance':    Object.assign(M, { dur: rand(1100, 2000), gx: side * rand(0.55, 0.95), gy: rand(-0.5, 0.35), yaw: side * rand(0.12, 0.3), pitch: rand(-0.15, 0.1) }); break;
        case 'softSmile': Object.assign(M, { dur: rand(1800, 2800), smile: rand(0.55, 0.8), brow: 0.15, gy: 0.05 }); break;
        case 'warm':      Object.assign(M, { dur: rand(1600, 2400), smile: 1, brow: 0.25, roll: side * 0.35, yaw: side * 0.1 }); break;
        case 'pensive':   Object.assign(M, { dur: rand(2000, 3000), frown: 0.9, gx: side * 0.6, gy: -0.85, pitch: -0.25, roll: -side * 0.45, yaw: side * 0.15 }); break;
        case 'curious':   Object.assign(M, { dur: rand(1400, 2200), brow: 0.85, roll: side * 0.6, gx: side * 0.5, yaw: side * 0.2, smile: 0.2 }); break;
        case 'surprise':  Object.assign(M, { dur: rand(700, 1000), brow: 1.1, pitch: -0.12, then: 'softSmile' }); break;
      }
      mood = M;
      nextMood = t + rand(6500, 12500);
    }
    function endMood() { mood = null; }
    // petit accès de test (outils de vérification) : root.__avatar.force('curious') / .blink()
    root.__avatar = { force: n => { lastMove = 0; tracking = false; startMood(now(), n); }, blink: () => startBlink(), params: P };

    /* ---------------- boucle ---------------- */
    let visible = true, running = false, last = 0, microT = 0, micro = { gx: 0, gy: 0 };
    function wake() { if (!running && visible && !document.hidden) { running = true; last = 0; requestAnimationFrame(frame); } }
    new IntersectionObserver(es => { visible = es[0].isIntersecting; wake(); }, { threshold: 0.05 }).observe(root);
    document.addEventListener('visibilitychange', wake);

    const t0 = now();
    function frame(ts) {
      if (!visible || document.hidden) { running = false; return; }
      const dt = last ? Math.min((ts - last) / 1000, 0.05) : 0.016;
      last = ts;
      const t = now(), s = (t - t0) / 1000;

      // --- cibles
      const idle = !tracking || t - lastMove > IDLE_MS;
      let tg = { yaw: 0, pitch: 0, roll: 0, gx: 0, gy: 0, brow: 0, frown: 0, smile: 0.08 };
      if (look && t > look.until) look = null;
      if (look) Object.assign(tg, { yaw: look.yaw, pitch: look.pitch, gx: look.gx, gy: look.gy });
      else if (!idle) {
        const a = aim(px, py);
        Object.assign(tg, { yaw: a.yaw, pitch: a.pitch, gx: a.gx, gy: a.gy, roll: -a.yaw * 0.25 });
      } else {
        if (!mood && !blink && t > nextMood) startMood(t);
        if (mood) {
          if (t - mood.t0 > mood.dur) {
            const next = mood.then; mood = null;
            if (next && Math.random() < 0.7) { recent.push(next); if (recent.length > 2) recent.shift(); mood = { n: next, t0: t, dur: rand(1200, 1800), smile: 0.7, brow: 0.2 }; }
          } else {
            for (const k of ['yaw', 'pitch', 'roll', 'gx', 'gy', 'brow', 'frown', 'smile']) if (mood[k] !== undefined) tg[k] = mood[k];
          }
        }
        // micro-mouvements d'attente (jamais tout à fait immobile)
        tg.yaw += 0.05 * Math.sin(s * 0.37) + 0.03 * Math.sin(s * 0.91 + 1.3);
        tg.pitch += 0.04 * Math.sin(s * 0.29 + 0.7);
        tg.roll += 0.12 * Math.sin(s * 0.23 + 2.1);
      }
      // micro-saccades des yeux
      if (t > microT) { micro = { gx: rand(-0.06, 0.06), gy: rand(-0.05, 0.05) }; microT = t + rand(700, 2400); }
      tg.gx += micro.gx; tg.gy += micro.gy;
      if (root.__avatar && root.__avatar.hold) Object.assign(tg, root.__avatar.hold);   // test uniquement
      for (const k in tg) if (P[k]) P[k].t = tg[k];
      stepParams(dt);

      // --- clignements (et parfois un clignement lors d'un grand changement de regard)
      if (!blink && t > nextBlink) startBlink();
      const lidV = (root.__avatar && root.__avatar.lid != null) ? root.__avatar.lid : lidValue(t);

      // --- déformation de la grille (pixels de l'image)
      const yaw = P.yaw.v, pitch = P.pitch.v, roll = P.roll.v * 0.05;   // roll en radians (≈ ±3°)
      const brow = P.brow.v, frown = P.frown.v, smile = P.smile.v;
      const cr = Math.cos(roll), sr = Math.sin(roll);
      for (let k = 0; k < NV; k++) {
        const x = src[2 * k], y = src[2 * k + 1], w = wHead[k], z = depth[k];
        let dx = 0, dy = 0;
        if (w > 0.001) {
          // rotation apparente par parallaxe de profondeur
          dx += w * yaw * (9 + 25 * z);
          dy += w * pitch * (6 + 17 * z);
          // inclinaison autour du cou
          const rx = x - G.pivot.x, ry = y - G.pivot.y;
          dx += w * (rx * cr - ry * sr - rx);
          dy += w * (rx * sr + ry * cr - ry);
          // expressions
          dy -= brow * 12 * (wBrowL[k] + wBrowR[k]);
          dy += frown * 4 * (wInL[k] + wInR[k]);
          dx += frown * 3 * (wInL[k] - wInR[k]);
          dx += smile * (-6 * wMouL[k] + 6 * wMouR[k]);
          dy -= smile * (8.5 * (wMouL[k] + wMouR[k]) + 3.5 * wChk[k]);
        }
        // le buste accompagne très légèrement
        const wb = (1 - w) * smooth(760, 1000, y);
        dx += wb * yaw * 3.5;
        pos[2 * k] = (x + dx) / G.W * 2 - 1;
        pos[2 * k + 1] = 1 - (y + dy) / G.H * 2;
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, pos);

      // --- yeux (UV) : limites d'amplitude comme la version précédente
      const gx = P.gx.v, gy = P.gy.v;
      const ox = 7 * clamp(gx, -1, 1) / G.W;
      const oy = (gy < 0 ? 3.2 : 2.4) * clamp(gy, -1, 1) / G.H;
      const conv = 0.8 / G.W;                                // légère convergence
      gl.uniform2f(uOffL, ox + conv, oy); gl.uniform2f(uOffR, ox - conv, oy);
      gl.uniform1f(uLid, lidV);

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawElements(gl.TRIANGLES, idx.length, gl.UNSIGNED_SHORT, 0);
      requestAnimationFrame(frame);
    }
    wake();
  }

  function boot() { document.querySelectorAll('[data-avatar]').forEach(initAvatar); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
