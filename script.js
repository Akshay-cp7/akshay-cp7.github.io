/* ==========================================================================
   akshaycp.com
   Hand written motion: particle morphs, smooth scroll, cursor, section demos.
   ========================================================================== */
(() => {
  "use strict";

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (v, a, b) => Math.min(Math.max(v, a), b);

  const REDUCE = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const FINE = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const SMALL = () => innerWidth < 960;
  const HAS_GSAP = typeof gsap !== "undefined";
  if (HAS_GSAP) gsap.registerPlugin(ScrollTrigger);

  const mouse = { x: innerWidth / 2, y: innerHeight / 2, nx: 0, ny: 0 };
  addEventListener("pointermove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.nx = (e.clientX / innerWidth) * 2 - 1;
    mouse.ny = -(e.clientY / innerHeight) * 2 + 1;
  }, { passive: true });

  // Scroll velocity, the same whether Lenis or native scroll drives the page
  const scroll = { y: scrollY, last: scrollY, vel: 0, dir: 1 };
  const tickScroll = () => {
    scroll.y = scrollY;
    const d = scroll.y - scroll.last;
    scroll.vel = lerp(scroll.vel, d, 0.12);
    if (Math.abs(d) > 0.5) scroll.dir = Math.sign(d);
    scroll.last = scroll.y;
  };

  /* ------------------------------------------------------------------------
     Text splitting
     ------------------------------------------------------------------------ */
  const WS = /([ \t\n\r]+)/;

  function splitChars(el) {
    if (!el.getAttribute("aria-label")) el.setAttribute("aria-label", el.textContent.replace(/\s+/g, " ").trim());
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(WS).forEach((part) => {
            if (!part) return;
            if (WS.test(part)) return frag.append(" ");
            const w = document.createElement("span");
            w.className = "w";
            w.setAttribute("aria-hidden", "true");
            for (const c of part) {
              const s = document.createElement("span");
              s.className = "ch";
              s.textContent = c;
              w.append(s);
            }
            frag.append(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== "BR") walk(n);
      });
    };
    walk(el);
    return $$(".ch", el);
  }

  // Wraps each word in a clipping span; returns the inner spans with a line index
  function splitWords(el, clip = true) {
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(WS).forEach((part) => {
            if (!part) return;
            if (WS.test(part)) return frag.append(" ");
            const outer = document.createElement("span");
            outer.className = clip ? "wl" : "w";
            if (clip) {
              const inner = document.createElement("span");
              inner.textContent = part;
              outer.append(inner);
            } else outer.textContent = part;
            frag.append(outer);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== "BR") walk(n);
      });
    };
    walk(el);
    const outers = $$(clip ? ".wl" : ".w", el);
    let line = -1, top = null;
    return outers.map((o) => {
      const t = Math.round(o.offsetTop);
      if (top === null || Math.abs(t - top) > 4) { line++; top = t; }
      return { el: clip ? o.firstChild : o, line };
    });
  }

  /* ------------------------------------------------------------------------
     Particle field (three.js)
     ------------------------------------------------------------------------ */
  const Field = (() => {
    const canvas = $("#gl");
    if (typeof THREE === "undefined" || !canvas) return null;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: "high-performance" });
    } catch {
      return null;
    }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
    renderer.setSize(innerWidth, innerHeight, false);

    const N = SMALL() ? 3200 : 6500;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 100);
    camera.position.z = 10;

    const outer = new THREE.Group();
    const inner = new THREE.Group();
    outer.add(inner);
    scene.add(outer);

    const rand = new Float32Array(N * 4);
    for (let i = 0; i < rand.length; i++) rand[i] = Math.random();
    const from = new Float32Array(N * 3);
    const to = new Float32Array(N * 3);

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(to, 3));
    geo.setAttribute("aFrom", new THREE.BufferAttribute(from, 3));
    geo.setAttribute("aTo", new THREE.BufferAttribute(to, 3));
    geo.setAttribute("aRand", new THREE.BufferAttribute(rand, 4));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 50);

    const U = {
      uT: { value: 0 },
      uP: { value: 1 },
      uMouse: { value: new THREE.Vector2(99, 99) },
      uVel: { value: 0 },
      uSize: { value: SMALL() ? 7 : 6.5 },
      uMulti: { value: 1 },
      uCenter: { value: new THREE.Vector2(0, 0) },
      uPR: { value: renderer.getPixelRatio() },
      uOpacity: { value: 0 },
      uA: { value: new THREE.Color("#3279f9") },
      uB: { value: new THREE.Color("#a142f4") },
    };

    const mat = new THREE.ShaderMaterial({
      uniforms: U,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
      vertexShader: /* glsl */ `
        attribute vec3 aFrom; attribute vec3 aTo; attribute vec4 aRand;
        uniform float uT, uP, uVel, uSize, uPR, uMulti; uniform vec2 uMouse, uCenter; uniform vec3 uA, uB;
        varying vec3 vC; varying float vAl; varying float vAng;
        vec3 pal(float t) {
          if (t < 0.2) return vec3(0.196, 0.475, 0.976);
          if (t < 0.4) return vec3(0.918, 0.263, 0.208);
          if (t < 0.6) return vec3(0.984, 0.737, 0.016);
          if (t < 0.8) return vec3(0.204, 0.659, 0.325);
          return vec3(0.631, 0.259, 0.957);
        }
        void main() {
          float d = aRand.x * 0.4;
          float p = clamp((uP - d) / 0.6, 0.0, 1.0);
          p = p * p * (3.0 - 2.0 * p);
          vec3 pos = mix(aFrom, aTo, p);
          float s = sin(p * 3.14159);
          pos += (aRand.yzw - 0.5) * 3.2 * s;
          pos += vec3(sin(uT * 0.7 + aRand.y * 6.28), cos(uT * 0.6 + aRand.z * 6.28), sin(uT * 0.5 + aRand.w * 6.28)) * 0.045;
          vec4 wp = modelMatrix * vec4(pos, 1.0);
          wp.y += (aRand.x - 0.5) * uVel * 0.06;
          vec2 dir = wp.xy - uMouse;
          float dist = length(dir);
          wp.xy += normalize(dir + 1e-4) * smoothstep(1.6, 0.0, dist) * 0.7;
          vec2 rad = wp.xy - uCenter;
          vAng = atan(rad.y, rad.x) + (aFrom.x - aTo.x) * 0.05 * s;
          vec4 mv = viewMatrix * wp;
          gl_Position = projectionMatrix * mv;
          gl_PointSize = uSize * (0.6 + aRand.x * 0.8) * uPR * (10.0 / -mv.z);
          vC = mix(aRand.y < 0.5 ? uA : uB, pal(aRand.w), uMulti);
          vAl = 0.45 + 0.55 * aRand.z;
        }`,
      fragmentShader: /* glsl */ `
        uniform float uOpacity; varying vec3 vC; varying float vAl; varying float vAng;
        void main() {
          vec2 p = gl_PointCoord - 0.5;
          p.y = -p.y;
          float c = cos(vAng), sn = sin(vAng);
          vec2 q = vec2(c * p.x + sn * p.y, -sn * p.x + c * p.y);
          float a = (1.0 - smoothstep(0.07, 0.12, abs(q.y))) * (1.0 - smoothstep(0.3, 0.42, abs(q.x)));
          if (a < 0.02) discard;
          gl_FragColor = vec4(vC, a * vAl * uOpacity);
        }`,
    });
    const points = new THREE.Points(geo, mat);
    inner.add(points);

    /* ---- Shape library ---- */
    const shapes = {};
    const R = () => Math.random();

    function fromCanvas(draw, worldH, test, w = 600, h = 600) {
      const c = document.createElement("canvas");
      c.width = w; c.height = h;
      const x = c.getContext("2d", { willReadFrequently: true });
      draw(x, w, h);
      const d = x.getImageData(0, 0, w, h).data;
      const pts = [];
      for (let y = 0; y < h; y += 2)
        for (let i = 0; i < w; i += 2) {
          const k = (y * w + i) * 4;
          if (test ? test(d, k) : d[k + 3] > 128) pts.push(i, y);
        }
      if (!pts.length) return shapes.sphere;
      const out = new Float32Array(N * 3), s = worldH / h;
      for (let n = 0; n < N; n++) {
        const j = ((R() * pts.length) / 2 | 0) * 2;
        out[n * 3] = (pts[j] - w / 2 + R() * 2) * s;
        out[n * 3 + 1] = -(pts[j + 1] - h / 2 + R() * 2) * s;
        out[n * 3 + 2] = (R() - 0.5) * 0.5;
      }
      return out;
    }

    function build(fn) {
      const out = new Float32Array(N * 3);
      for (let i = 0; i < N; i++) {
        const v = fn(i);
        out[i * 3] = v[0]; out[i * 3 + 1] = v[1]; out[i * 3 + 2] = v[2];
      }
      return out;
    }

    shapes.galaxy = build((i) => {
      const arm = i % 3;
      const r = Math.pow(R(), 0.8) * 7.4 + 1.6;
      const a = arm * 2.0944 + r * 0.85 + (R() - 0.5) * 0.5;
      const sp = (R() - 0.5) * 0.7;
      return [Math.cos(a) * r + sp, (R() - 0.5) * 0.35 * (1.2 - r / 7), Math.sin(a) * r + sp];
    });
    shapes.sphere = build(() => {
      const u = R() * 2 - 1, t = R() * Math.PI * 2, r = 2.6 + (R() - 0.5) * 0.12;
      const q = Math.sqrt(1 - u * u);
      return [q * Math.cos(t) * r, u * r, q * Math.sin(t) * r];
    });
    shapes.helix = build((i) => {
      const t = (i / N) * Math.PI * 7;
      const y = (i / N) * 9 - 4.5;
      const strand = i % 3;
      if (strand === 2) {
        const k = R(), tt = Math.floor(t * 2) / 2;
        return [Math.cos(tt) * 1.3 * (k * 2 - 1), Math.floor((i / N) * 9 * 4) / 4 - 4.5, Math.sin(tt) * 1.3 * (k * 2 - 1)];
      }
      const ph = strand * Math.PI;
      return [Math.cos(t + ph) * 1.3 + (R() - 0.5) * 0.12, y + (R() - 0.5) * 0.1, Math.sin(t + ph) * 1.3 + (R() - 0.5) * 0.12];
    });
    shapes.stars = build(() => [(R() - 0.5) * 26, (R() - 0.5) * 15, (R() - 0.5) * 8 - 2]);

    function textShapes() {
      const font = (px) => `700 ${px}px "Google Sans Flex", sans-serif`;
      shapes.one = fromCanvas((x, w, h) => {
        x.fillStyle = "#fff"; x.textAlign = "center"; x.textBaseline = "middle";
        x.font = font(360); x.fillText("#1", w / 2, h / 2 + 20);
      }, 5.4);
      shapes.hello = fromCanvas((x, w, h) => {
        x.fillStyle = "#fff"; x.textAlign = "center"; x.textBaseline = "middle";
        x.font = font(200); x.fillText("HI.", w / 2, h / 2 + 10);
      }, 6.5);
      shapes.bubble = fromCanvas((x, w, h) => {
        x.fillStyle = "#fff";
        x.beginPath(); x.roundRect(70, 110, 460, 300, 70); x.fill();
        x.beginPath(); x.moveTo(150, 390); x.lineTo(110, 500); x.lineTo(250, 400); x.fill();
        x.globalCompositeOperation = "destination-out";
        [200, 300, 400].forEach((cx) => { x.beginPath(); x.arc(cx, 260, 34, 0, Math.PI * 2); x.fill(); });
      }, 5.2);
      shapes.grid = fromCanvas((x) => {
        x.fillStyle = "#fff";
        for (let r = 0; r < 4; r++)
          for (let c = 0; c < 4; c++) { x.beginPath(); x.roundRect(60 + c * 125, 60 + r * 125, 100, 100, 28); x.fill(); }
      }, 4.6);
      shapes.chart = fromCanvas((x) => {
        x.strokeStyle = "#fff"; x.fillStyle = "#fff"; x.lineCap = "round"; x.lineJoin = "round";
        x.lineWidth = 16;
        x.beginPath(); x.moveTo(40, 470); x.bezierCurveTo(160, 440, 200, 380, 280, 360); x.bezierCurveTo(360, 340, 400, 200, 470, 190); x.lineTo(560, 90); x.stroke();
        x.globalAlpha = 1;
        [60, 150, 240, 330, 420, 510].forEach((bx, i) => x.fillRect(bx, 560 - (40 + i * 24), 30, 40 + i * 24));
      }, 4.6);
    }

    function birdShape() {
      return new Promise((res) => {
        const img = new Image();
        img.onload = () => {
          shapes.bird = fromCanvas((x, w, h) => x.drawImage(img, 0, 0, w, h), 7.2, (d, k) => d[k + 3] > 128 && d[k] + d[k + 1] + d[k + 2] < 330);
          res();
        };
        img.onerror = () => { shapes.bird = shapes.sphere; res(); };
        img.src = "swaylo.png";
      });
    }

    /* ---- Per section look ---- */
    // Google palette dashes; m = how much of the full palette shows through the section colours
    const LOOK = {
      galaxy: { x: 0, y: -0.2, s: 1, a: "#3279f9", b: "#a142f4", m: 1, tilt: 0.5, spin: 0.05, accent: "#3279f9" },
      bird:   { x: -3.4, y: 0, s: 1, o: 0.5, a: "#3279f9", b: "#a142f4", m: 0.15, accent: "#3279f9" },
      bubble: { x: 3.4, y: 0, s: 1, o: 0.5, a: "#34a853", b: "#3279f9", m: 0.1, accent: "#188038" },
      one:    { x: -3.4, y: 0, s: 1, o: 0.5, a: "#ea4335", b: "#fbbc04", m: 0.1, accent: "#d93025" },
      grid:   { x: 2.2, y: 0, s: 1, a: "#a142f4", b: "#3279f9", m: 1, accent: "#8430ce" },
      chart:  { x: -3.4, y: 0, s: 1, o: 0.5, a: "#34a853", b: "#3279f9", m: 0.1, accent: "#188038" },
      sphere: { x: -3.8, y: 0, s: 1, a: "#3279f9", b: "#ea4335", m: 0.7, spin: 0.12, accent: "#3279f9" },
      helix:  { x: -5.8, y: 0, s: 0.9, a: "#3279f9", b: "#ea4335", m: 0.5, spin: 0.25, accent: "#3279f9" },
      stars:  { x: 0, y: 0, s: 1, a: "#3279f9", b: "#a142f4", m: 1, accent: "#3279f9" },
      hello:  { x: 4.6, y: -0.4, s: 0.85, a: "#3279f9", b: "#ea4335", m: 1, accent: "#3279f9" },
    };

    let current = null, tween = null, spinSpeed = 0, shown = false;
    const baseOpacity = () => (SMALL() ? 0.32 : 0.85);
    const cur = new Float32Array(N * 3);

    function snapshot() {
      const p = U.uP.value;
      for (let i = 0; i < N; i++) {
        let q = clamp((p - rand[i * 4] * 0.4) / 0.6, 0, 1);
        q = q * q * (3 - 2 * q);
        for (let k = 0; k < 3; k++) cur[i * 3 + k] = from[i * 3 + k] + (to[i * 3 + k] - from[i * 3 + k]) * q;
      }
    }

    function set(name, instant) {
      const base = shapes[name];
      if (!base || name === current) return;
      current = name;
      const L = LOOK[name];
      const small = SMALL();
      const ox = small ? 0 : L.x, sc = (small ? 0.62 : 1) * L.s;

      snapshot();
      from.set(cur);
      for (let i = 0; i < N; i++) {
        to[i * 3] = base[i * 3] * sc + ox;
        to[i * 3 + 1] = base[i * 3 + 1] * sc + L.y;
        to[i * 3 + 2] = base[i * 3 + 2] * sc;
      }
      geo.attributes.aFrom.needsUpdate = true;
      geo.attributes.aTo.needsUpdate = true;

      if (tween) tween.kill();
      U.uP.value = instant ? 1 : 0;
      if (!instant) tween = gsap.to(U.uP, { value: 1, duration: 2, ease: "power2.inOut" });
      gsap.to(U.uA.value, { ...hex(L.a), duration: 1.2 });
      gsap.to(U.uB.value, { ...hex(L.b), duration: 1.2 });
      gsap.to(U.uMulti, { value: L.m, duration: 1.2 });
      if (shown) gsap.to(U.uOpacity, { value: baseOpacity() * (L.o || 1), duration: 1.2 });
      gsap.to(U.uCenter.value, { x: ox, y: L.y, duration: 2, ease: "power2.inOut" });
      gsap.to(outer.rotation, { x: L.tilt || 0, duration: 2, ease: "power2.inOut" });
      spinSpeed = L.spin || 0;
      if (!L.spin) gsap.to(inner.rotation, { y: Math.round(inner.rotation.y / (Math.PI * 2)) * Math.PI * 2, duration: 2, ease: "power2.inOut" });
      document.documentElement.style.setProperty("--accent", L.accent);
    }

    const hex = (h) => { const c = new THREE.Color(h); return { r: c.r, g: c.g, b: c.b }; };

    const halfH = Math.tan(THREE.MathUtils.degToRad(25)) * 10;
    let last = performance.now(), mx = 0, my = 0;
    function frame(now) {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      U.uT.value += dt;
      U.uVel.value = lerp(U.uVel.value, clamp(scroll.vel, -60, 60), 0.15);
      mx = lerp(mx, mouse.nx, 0.06);
      my = lerp(my, mouse.ny, 0.06);
      if (FINE) U.uMouse.value.set(mouse.nx * halfH * camera.aspect, mouse.ny * halfH);
      if (spinSpeed) inner.rotation.y += dt * spinSpeed;
      outer.rotation.y = Math.sin(U.uT.value * 0.15) * 0.18 + mx * 0.2;
      outer.position.y = my * 0.15;
      renderer.render(scene, camera);
    }

    function resize() {
      renderer.setSize(innerWidth, innerHeight, false);
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
    }
    addEventListener("resize", resize);

    async function init() {
      await Promise.all([document.fonts.load('700 100px "Google Sans Flex"').catch(() => {}), birdShape()]);
      textShapes();
    }

    // Start as a scattered cloud so the first morph has somewhere to come from
    from.set(shapes.stars); to.set(shapes.stars);

    return {
      init, set, frame,
      show: () => { shown = true; gsap.to(U.uOpacity, { value: baseOpacity() * (LOOK[current]?.o || 1), duration: 2 }); },
    };
  })();

  /* ------------------------------------------------------------------------
     Smooth scroll
     ------------------------------------------------------------------------ */
  let lenis = null;
  if (!REDUCE && HAS_GSAP && typeof Lenis !== "undefined") {
    lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1 });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }

  const goTo = (target) => {
    const el = typeof target === "string" ? $(target) : target;
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { duration: 1.6 });
    else el.scrollIntoView({ behavior: REDUCE ? "auto" : "smooth" });
  };
  $$('a[href^="#"]').forEach((a) =>
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      e.preventDefault();
      closeMenu();
      goTo(id);
    })
  );

  /* ------------------------------------------------------------------------
     Nav, menu, progress, clock
     ------------------------------------------------------------------------ */
  const nav = $(".nav"), burger = $(".nav-burger"), menu = $(".menu");
  function closeMenu() {
    menu.classList.remove("is-open");
    menu.setAttribute("aria-hidden", "true");
    burger.setAttribute("aria-expanded", "false");
    if (lenis && !document.body.classList.contains("is-loading")) lenis.start();
  }
  burger.addEventListener("click", () => {
    const open = !menu.classList.contains("is-open");
    if (!open) return closeMenu();
    menu.classList.add("is-open");
    menu.setAttribute("aria-hidden", "false");
    burger.setAttribute("aria-expanded", "true");
    if (lenis) lenis.stop();
  });

  const bar = $(".progress i");
  let navY = 0;
  function tickNav() {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? scroll.y / max : 0})`;
    nav.classList.toggle("is-solid", scroll.y > 40);
    if (Math.abs(scroll.y - navY) > 8) {
      nav.classList.toggle("is-hidden", scroll.y > navY && scroll.y > 300 && !menu.classList.contains("is-open"));
      navY = scroll.y;
    }
  }

  const clock = $("#clock");
  const fmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const tickClock = () => clock && (clock.textContent = `IST ${fmt.format(new Date())}`);
  tickClock();
  setInterval(tickClock, 1000);

  /* ------------------------------------------------------------------------
     Cursor, magnetic, tilt, scramble, spotlight
     ------------------------------------------------------------------------ */
  if (FINE && !REDUCE) {
    document.documentElement.classList.add("has-cursor");
    const cur = $(".cursor"), dot = $(".cursor-dot"), ring = $(".cursor-ring"), label = $(".cursor-label");
    let rx = mouse.x, ry = mouse.y;
    gsap.ticker.add(() => {
      rx = lerp(rx, mouse.x, 0.18);
      ry = lerp(ry, mouse.y, 0.18);
      dot.style.transform = `translate(${mouse.x}px, ${mouse.y}px)`;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
    });
    document.addEventListener("pointerover", (e) => {
      const t = e.target.closest("[data-cursor], a, button, input, textarea, label");
      cur.classList.remove("is-link", "is-label", "is-text");
      if (!t) return;
      if (t.dataset.cursor) { label.textContent = t.dataset.cursor; cur.classList.add("is-label"); }
      else if (t.matches("input:not([type=radio]), textarea")) cur.classList.add("is-text");
      else cur.classList.add("is-link");
    });
    document.addEventListener("pointerleave", () => gsap.to(cur, { opacity: 0, duration: 0.3 }));
    document.addEventListener("pointerenter", () => gsap.to(cur, { opacity: 1, duration: 0.3 }));

    $$(".magnetic").forEach((el) => {
      const inner = el.firstElementChild;
      const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3" });
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        xTo(dx * 0.3); yTo(dy * 0.4);
        if (inner) gsap.to(inner, { x: dx * 0.12, y: dy * 0.12, duration: 0.6, ease: "power3" });
      });
      el.addEventListener("pointerleave", () => {
        gsap.to(el, { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.35)" });
        if (inner) gsap.to(inner, { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.35)" });
      });
    });

    $$(".tilt").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(el, { rotateY: px * 14, rotateX: -py * 14, transformPerspective: 900, duration: 0.5, ease: "power2" });
      });
      el.addEventListener("pointerleave", () => gsap.to(el, { rotateY: 0, rotateX: 0, duration: 0.9, ease: "elastic.out(1, 0.4)" }));
    });

    $$(".spot").forEach((el) =>
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      })
    );

    // Floating preview images on the recognition list
    const hov = $(".hover-img"), hovImg = $("img", hov);
    let hx = 0, hy = 0, hvx = 0, showing = false;
    gsap.ticker.add(() => {
      const nx = lerp(hx, mouse.x, 0.12), ny = lerp(hy, mouse.y, 0.12);
      hvx = lerp(hvx, nx - hx, 0.2);
      hx = nx; hy = ny;
      hov.style.transform = `translate(${hx - 170}px, ${hy - 113}px) rotate(${clamp(hvx * 0.6, -14, 14)}deg) scale(${showing ? 1 : 0.8})`;
    });
    $$(".recog-list a").forEach((a) => {
      a.addEventListener("pointerenter", () => {
        hovImg.src = a.dataset.img;
        showing = true;
        gsap.to(hov, { opacity: 1, duration: 0.35 });
      });
      a.addEventListener("pointerleave", () => {
        showing = false;
        gsap.to(hov, { opacity: 0, duration: 0.35 });
      });
    });
  }

  const GLYPHS = "!<>-_\\/[]{}=+*^?#ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  $$(".scramble").forEach((el) => {
    const text = el.textContent;
    let raf;
    el.addEventListener("pointerenter", () => {
      if (REDUCE) return;
      let frame = 0;
      cancelAnimationFrame(raf);
      const run = () => {
        el.textContent = [...text].map((c, i) => (c === " " || i < frame / 2 ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0])).join("");
        if (frame++ < text.length * 2) raf = requestAnimationFrame(run);
        else el.textContent = text;
      };
      run();
    });
  });

  /* ------------------------------------------------------------------------
     Counters
     ------------------------------------------------------------------------ */
  function countUp(el, delay = 0) {
    const end = parseFloat(el.dataset.count), dec = +el.dataset.decimals || 0, suf = el.dataset.suffix || "";
    if (REDUCE || !HAS_GSAP) return (el.textContent = end.toFixed(dec) + suf);
    const o = { v: 0 };
    gsap.to(o, { v: end, duration: 1.8, delay, ease: "power3.out", onUpdate: () => (el.textContent = o.v.toFixed(dec) + suf) });
  }

  /* ------------------------------------------------------------------------
     Swaylo router
     ------------------------------------------------------------------------ */
  function routerDemo() {
    const svg = $(".router-svg");
    if (!svg) return;
    const packet = $("#packet"), chip = $("#chip"), ico = $("#chip-ico"), txt = $("#chip-txt");
    const provA = $("#prov-a"), provB = $("#prov-b");
    const path = (id) => $("#" + id);
    const STEPS = [
      { ico: "💬", txt: '"price for the combo?"', to: "text" },
      { ico: "🎤", txt: "voice note · 0:07", to: "voice" },
      { ico: "📷", txt: "photo of a handwritten address", to: "vision" },
      { ico: "💬", txt: '"kitne din me aayega?"', to: "text", failover: true },
      { ico: "💬", txt: '"ഓർഡർ ചെയ്യണം"', to: "text" },
    ];
    provA.classList.add("on");

    const along = (tl, p, dur) => {
      const len = p.getTotalLength(), o = { t: 0 };
      tl.to(o, {
        t: 1, duration: dur, ease: "power1.inOut",
        onUpdate: () => {
          const pt = p.getPointAtLength(o.t * len);
          packet.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
        },
      });
    };

    const tl = gsap.timeline({ repeat: -1, paused: true });
    STEPS.forEach((s) => {
      const model = $("#m-" + s.to);
      tl.call(() => { ico.textContent = s.ico; txt.textContent = s.txt; })
        .fromTo(chip, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "back.out(2)" })
        .set(packet, { opacity: 1 });
      along(tl, path("w-in"), 0.7);
      tl.to(".router-core .core-fill", { attr: { r: 27 }, duration: 0.15, yoyo: true, repeat: 1 });
      if (s.failover)
        tl.call(() => { provA.classList.replace("on", "down"); provB.classList.add("on"); })
          .to({}, { duration: 0.5 });
      along(tl, path("w-" + s.to), 0.7);
      tl.call(() => model.classList.add("on")).to({}, { duration: 0.6 });
      along(tl, path("o-" + s.to), 0.5);
      tl.call(() => model.classList.remove("on"))
        .to(packet, { opacity: 0, duration: 0.2 })
        .to(chip, { opacity: 0, y: -10, duration: 0.3 });
      if (s.failover) tl.call(() => { provA.classList.remove("down"); provA.classList.add("on"); provB.classList.remove("on"); });
    });
    ScrollTrigger.create({ trigger: ".router", start: "top 90%", end: "bottom 10%", onToggle: (st) => (st.isActive ? tl.play() : tl.pause()) });
  }

  /* ------------------------------------------------------------------------
     Shopdesk chat
     ------------------------------------------------------------------------ */
  function chatDemo() {
    const body = $("#wa-body"), status = $("#wa-status");
    if (!body) return;
    const time = () => new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit" }).format(new Date());
    const SCRIPT = [
      { me: true, html: '<div class="ad-img">🪴</div><div class="t">Hi, I saw this ad</div>', cls: "ad" },
      { me: false, html: "Hi! 🌱 The combo pack is <b>₹599</b>, Cash on Delivery, delivered to your door. Shall I book one?" },
      { me: true, html: '<div class="voice"><i>▶</i><span class="wave"></span><small style="margin:0">0:07</small></div>' },
      { me: false, html: 'Got it from your voice note: Flat 4B, Rose Villa, Kothrud, Pune 411038.<br><span class="tag">✓ Pincode checked with India Post</span>' },
      { me: true, html: "kitne din me aayega?" },
      { me: false, html: "4 se 5 din me pahunch jayega. Order book kar doon?" },
      { me: true, html: "haan 👍" },
      { me: false, html: "Booked ✅ Order #4821. Pay ₹599 when it arrives." },
    ];
    let i = 0, timer = null, active = false;

    // Drop only the bubbles that have scrolled off the top, measured before any slide in animation runs
    const trim = () => {
      const top = body.getBoundingClientRect().top;
      while (body.children.length > 1 && body.firstElementChild.getBoundingClientRect().top < top) body.firstElementChild.remove();
    };

    const add = (m) => {
      const b = document.createElement("div");
      b.className = `bub ${m.me ? "out" : "in"} ${m.cls || ""}`;
      b.innerHTML = `${m.html}<small>${time()}${m.me ? " ✓✓" : ""}</small>`;
      body.append(b);
      trim();
      gsap.from(b, { y: 20, opacity: 0, scale: 0.92, transformOrigin: m.me ? "100% 100%" : "0 100%", duration: 0.45, ease: "back.out(1.8)" });
    };

    const step = () => {
      if (!active) return;
      if (i >= SCRIPT.length) {
        timer = setTimeout(() => {
          gsap.to(body.children, { opacity: 0, duration: 0.4, onComplete: () => { body.innerHTML = ""; i = 0; step(); } });
        }, 3500);
        return;
      }
      const m = SCRIPT[i++];
      if (m.me) {
        add(m);
        timer = setTimeout(step, 1100);
      } else {
        const t = document.createElement("div");
        t.className = "bub in typing";
        t.innerHTML = "<i></i><i></i><i></i>";
        body.append(t);
        trim();
        status.textContent = "typing…";
        timer = setTimeout(() => {
          t.remove();
          status.textContent = "online";
          add(m);
          timer = setTimeout(step, 1500);
        }, 1100);
      }
    };
    ScrollTrigger.create({
      trigger: ".phone", start: "top 85%", end: "bottom 15%",
      onToggle: (st) => {
        active = st.isActive;
        clearTimeout(timer);
        if (active) step();
      },
    });
  }

  /* ------------------------------------------------------------------------
     Google Play search
     ------------------------------------------------------------------------ */
  function playDemo() {
    const q = $("#play-q"), list = $("#play-results");
    if (!q) return;
    const QUERIES = ["aadhaar to pdf", "aadhar card print", "id card to pdf"];
    const items = () => $$("li", list);
    const byId = (id) => $(`li[data-id="${id}"]`, list);
    let qi = 0, active = false, timer = null;

    const order = (ids, animate) => {
      const first = new Map(items().map((li) => [li, li.getBoundingClientRect().top]));
      ids.forEach((id) => list.append(byId(id)));
      items().forEach((li, n) => ($(".rank", li).textContent = li.dataset.id === "mine" && n === 0 ? "#1" : ""));
      if (!animate) return;
      items().forEach((li) => {
        const dy = first.get(li) - li.getBoundingClientRect().top;
        if (dy) gsap.fromTo(li, { y: dy }, { y: 0, duration: 0.9, ease: "power3.inOut" });
      });
    };

    const type = (text, done) => {
      let n = 0;
      const go = () => {
        if (!active) return;
        q.textContent = text.slice(0, ++n);
        if (n < text.length) timer = setTimeout(go, 60 + Math.random() * 60);
        else done();
      };
      go();
    };

    const cycle = () => {
      if (!active) return;
      q.textContent = "";
      order(["gov", "a", "mine", "b"].sort(() => Math.random() - 0.5), false);
      gsap.set(items(), { opacity: 0.25 });
      type(QUERIES[qi++ % QUERIES.length], () => {
        gsap.to(items(), { opacity: 1, duration: 0.3, stagger: 0.05 });
        timer = setTimeout(() => {
          order(["mine", "gov", "a", "b"], true);
          gsap.fromTo(byId("mine"), { scale: 1 }, { scale: 1.03, duration: 0.3, yoyo: true, repeat: 1, delay: 0.7 });
          timer = setTimeout(cycle, 3200);
        }, 600);
      });
    };
    ScrollTrigger.create({
      trigger: ".play", start: "top 85%", end: "bottom 15%",
      onToggle: (st) => {
        active = st.isActive;
        clearTimeout(timer);
        if (active) cycle();
      },
    });
  }

  /* ------------------------------------------------------------------------
     Orbit row: icon circles drift sideways and ride a wave
     ------------------------------------------------------------------------ */
  function orbit() {
    const track = $(".orbit-track");
    if (!track) return;
    const orbs = $$(".orb", track);
    let x = 0, t = 0;
    gsap.ticker.add((time, dt) => {
      const half = track.scrollWidth / 2;
      x -= (0.5 + Math.abs(scroll.vel) * 0.2) * scroll.dir;
      if (x <= -half) x += half;
      if (x > 0) x -= half;
      t += dt * 0.0006;
      track.style.transform = `translate3d(${x}px,0,0)`;
      const amp = SMALL() ? 26 : 46;
      orbs.forEach((o) => {
        const cx = o.offsetLeft + x + o.offsetWidth / 2;
        o.style.transform = `translateY(${Math.sin(cx / innerWidth * Math.PI * 2 + t) * amp}px)`;
      });
    });
  }

  /* ------------------------------------------------------------------------
     Scroll scenes
     ------------------------------------------------------------------------ */
  function scenes() {
    // Headings: characters rise in
    $$(".split-chars").forEach((h) => {
      const chars = splitChars(h);
      gsap.from(chars, {
        yPercent: 110, rotate: 8, opacity: 0, duration: 1, ease: "power4.out", stagger: 0.025,
        scrollTrigger: { trigger: h, start: "top 85%" },
      });
    });

    // Paragraphs: line by line
    $$(".reveal-lines").forEach((p) => {
      if (p.closest(".hero")) return;
      const words = splitWords(p);
      gsap.from(words.map((w) => w.el), {
        yPercent: 110, duration: 0.9, ease: "power3.out",
        delay: (i) => words[i].line * 0.07,
        scrollTrigger: { trigger: p, start: "top 88%" },
      });
    });

    // Statement: words light up as you read
    $$(".reveal-words").forEach((p) => {
      const words = splitWords(p, false).map((w) => w.el);
      gsap.to(words, { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: p, start: "top 80%", end: "bottom 45%", scrub: true } });
    });

    // Small things fade up
    gsap.utils.toArray(".facts li, .pills span, .tech-cloud span, .svc, .recog-list li, .cinfo, .socials a, .chart, .play, .router, .phone-wrap").forEach((el) => {
      gsap.from(el, { y: 40, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 92%" } });
    });

    // Counters
    $$("[data-count]").forEach((el) => {
      if (el.closest(".hero")) return;
      ScrollTrigger.create({ trigger: el, start: "top 90%", once: true, onEnter: () => countUp(el) });
    });

    // Hero leaves
    gsap.to(".hero-title", { yPercent: -30, opacity: 0.1, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

    // ESTAZY chart draws with scroll
    $$(".chart-line.a").forEach((p) => {
      const len = p.getTotalLength();
      gsap.fromTo(p, { strokeDasharray: len, strokeDashoffset: len }, {
        strokeDashoffset: 0, ease: "none",
        scrollTrigger: { trigger: ".chart", start: "top 80%", end: "center 45%", scrub: 1 },
      });
    });
    gsap.to("#chart-clip", { attr: { width: 400 }, ease: "none", scrollTrigger: { trigger: ".chart", start: "top 80%", end: "center 45%", scrub: 1 } });
    gsap.from(".chart-line.b", { opacity: 0, duration: 1, scrollTrigger: { trigger: ".chart", start: "top 75%" } });

    // Timeline
    gsap.to(".tl-line i", { scaleY: 1, ease: "none", scrollTrigger: { trigger: ".timeline", start: "top 60%", end: "bottom 60%", scrub: true } });
    $$(".tl-item").forEach((it) => {
      ScrollTrigger.create({ trigger: it, start: "top 60%", onToggle: (st) => it.classList.toggle("is-on", st.isActive || st.progress > 0), end: "max" });
      gsap.from(it, { x: 40, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: it, start: "top 85%" } });
    });

    // Contact title
    gsap.from(".contact-title .line > span", { yPercent: 110, duration: 1.2, ease: "power4.out", stagger: 0.12, scrollTrigger: { trigger: ".contact-title", start: "top 85%" } });
    gsap.from(".footer-big", { yPercent: 60, opacity: 0, ease: "none", scrollTrigger: { trigger: ".footer", start: "top bottom", end: "bottom bottom", scrub: true } });

    // Apps: horizontal scroll on desktop
    gsap.matchMedia().add("(min-width: 961px)", () => {
        const row = $(".apps-row");
        const dist = () => row.scrollWidth - (innerWidth - row.getBoundingClientRect().left);
        const tw = gsap.to(row, {
          x: () => -dist(), ease: "none",
          scrollTrigger: {
            trigger: ".apps", pin: ".apps-pin", start: "top top", end: () => "+=" + dist(), scrub: 1, invalidateOnRefresh: true,
            onUpdate: (st) => {
              const v = clamp(st.getVelocity() / 400, -6, 6);
              gsap.to(".app-card", { skewX: -v * 0.6, duration: 0.4, overwrite: "auto" });
            },
          },
        });
        return () => tw.kill();
    });

    // Which section are we in: morph the particles, recolour, update the nav label
    const label = $("#nav-section");
    $$("[data-shape]").forEach((sec) => {
      ScrollTrigger.create({
        trigger: sec, start: "top 55%", end: "bottom 55%",
        onToggle: (st) => {
          if (!st.isActive) return;
          if (Field) Field.set(sec.dataset.shape);
          else document.documentElement.style.setProperty("--accent", "#3279f9");
          if (label) label.textContent = sec.dataset.label;
        },
      });
    });
  }

  /* ------------------------------------------------------------------------
     Hero name: letters thicken near the cursor
     ------------------------------------------------------------------------ */
  function heroProximity(chars) {
    if (!FINE || REDUCE) return;
    const state = chars.map(() => ({ w: 500, y: 0 }));
    gsap.ticker.add(() => {
      if (scroll.y > innerHeight) return;
      const rects = chars.map((c) => c.getBoundingClientRect());
      chars.forEach((c, i) => {
        const r = rects[i];
        const d = Math.hypot(mouse.x - (r.left + r.width / 2), mouse.y - (r.top + r.height / 2));
        const k = clamp(1 - d / 380, 0, 1);
        const s = state[i];
        s.w = lerp(s.w, 480 + k * 320, 0.12);
        s.y = lerp(s.y, -k * 14, 0.12);
        c.style.fontWeight = s.w.toFixed(0);
        c.style.transform = `translateY(${s.y.toFixed(2)}px)`;
      });
    });
  }

  /* ------------------------------------------------------------------------
     Contact form (Formspree)
     ------------------------------------------------------------------------ */
  const form = $("#contact-form");
  if (form) {
    const btn = $("#submit-btn"), status = $("#form-status"), label = $("span", btn);
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      btn.disabled = true;
      label.textContent = "Sending…";
      status.className = "mono form-status";
      status.textContent = "";
      try {
        const res = await fetch("https://formspree.io/f/xpqyvnzl", { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
        if (!res.ok) throw new Error();
        status.classList.add("ok");
        status.textContent = "Sent. I'll get back to you soon.";
        form.reset();
      } catch {
        status.classList.add("err");
        status.textContent = "That didn't go through. Email me directly instead.";
      } finally {
        btn.disabled = false;
        label.textContent = "Send message";
      }
    });
  }

  /* ------------------------------------------------------------------------
     Boot
     ------------------------------------------------------------------------ */
  if (HAS_GSAP) gsap.ticker.add(() => { tickScroll(); tickNav(); });
  else addEventListener("scroll", () => { tickScroll(); tickNav(); }, { passive: true });

  function finishLoading() {
    document.body.classList.remove("is-loading");
    if (lenis) lenis.start();
  }

  if (!HAS_GSAP || REDUCE) {
    $("#loader").remove();
    finishLoading();
    $$("[data-count]").forEach((el) => countUp(el));
    if (HAS_GSAP) { routerDemo(); chatDemo(); playDemo(); }
    return;
  }

  const nameChars = splitChars($(".hero-name"));
  const heroLede = splitWords($(".hero-lede"));
  gsap.set(nameChars, { yPercent: 115 });
  gsap.set(heroLede.map((w) => w.el), { yPercent: 110 });
  gsap.set([".hero-pills", ".hero-actions .btn", ".hero-stats > div", ".hero-top", ".nav", ".scroll-cue"], { opacity: 0, y: 20 });

  const loadNum = $("#loader-num"), loadBar = $("#loader-bar");
  const prog = { v: 0 };
  const ready = Promise.all([document.fonts.ready, Field ? Field.init() : null]);
  const intro = gsap.timeline();
  intro
    .fromTo(".loader-name span", { yPercent: 105 }, { yPercent: 0, duration: 0.9, ease: "power4.out", stagger: 0.06 })
    .to(prog, {
      v: 100, duration: 1.6, ease: "power2.inOut",
      onUpdate: () => {
        loadNum.textContent = prog.v.toFixed(0);
        loadBar.style.transform = `scaleX(${prog.v / 100})`;
      },
    }, 0);

  Promise.all([ready, new Promise((r) => intro.eventCallback("onComplete", r))]).then(() => {
    // Whatever WebGL needed is built: start the render loop
    if (Field) {
      gsap.ticker.add((t) => Field.frame(t * 1000));
      Field.set("galaxy");
      Field.show();
    }
    scenes();
    routerDemo();
    chatDemo();
    playDemo();
    orbit();
    heroProximity(nameChars);

    gsap.timeline({ onComplete: () => ScrollTrigger.refresh() })
      .to(".loader-name span", { yPercent: -105, duration: 0.6, ease: "power3.in", stagger: 0.03 })
      .to(".loader-count, .loader-bar", { opacity: 0, duration: 0.3 }, "<")
      .to("#loader", { yPercent: -100, duration: 1, ease: "power4.inOut" }, "-=0.1")
      .add(finishLoading, "-=0.5")
      .set("#loader", { display: "none" })
      .to(nameChars, { yPercent: 0, duration: 1.3, ease: "power4.out", stagger: 0.045 }, "-=0.65")
      .to(".hero-pills, .hero-top, .nav", { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "<0.2")
      .to(heroLede.map((w) => w.el), { yPercent: 0, duration: 1, ease: "power3.out", stagger: { each: 0.01 } }, "<0.2")
      .to(".hero-actions .btn, .hero-stats > div, .scroll-cue", { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.08 }, "<0.3")
      .add(() => $$(".hero [data-count]").forEach((el, i) => countUp(el, i * 0.1)), "<");
  });

})();
