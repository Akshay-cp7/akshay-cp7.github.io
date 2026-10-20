// Turns CorelDRAW bytes into laid out SVG pages. Shared by the app's viewer page and the
// desktop test harness. cdr_engine.js (libcdr compiled to WebAssembly) must load first.
(function (global) {
  'use strict';

  const SVGNS = 'http://www.w3.org/2000/svg';
  let enginePromise = null;

  function engine() {
    if (!enginePromise) enginePromise = global.CdrEngine();
    return enginePromise;
  }

  // ---------- file facts ----------

  // libcdr's version number: 100 per major release, CorelDRAW 7 = 700 ... X8 = 1800
  const VERSION_NAMES = {
    300: 'CorelDRAW 3', 400: 'CorelDRAW 4', 500: 'CorelDRAW 5', 600: 'CorelDRAW 6', 700: 'CorelDRAW 7',
    800: 'CorelDRAW 8', 900: 'CorelDRAW 9', 1000: 'CorelDRAW 10', 1100: 'CorelDRAW 11', 1200: 'CorelDRAW 12',
    1300: 'CorelDRAW X3', 1400: 'CorelDRAW X4', 1500: 'CorelDRAW X5', 1600: 'CorelDRAW X6',
    1700: 'CorelDRAW X7', 1800: 'CorelDRAW X8', 1900: 'CorelDRAW 2017', 2000: 'CorelDRAW 2018',
    2100: 'CorelDRAW 2019', 2200: 'CorelDRAW 2020', 2300: 'CorelDRAW 2021', 2400: 'CorelDRAW 2022',
    2500: 'CorelDRAW 2024', 2600: 'CorelDRAW 2025',
  };

  function versionName(v) {
    if (!v) return null;
    const major = Math.floor(v / 100) * 100;
    if (VERSION_NAMES[major]) return VERSION_NAMES[major];
    return major > 2600 ? 'CorelDRAW 2025 or newer' : null;
  }

  // ---------- fonts ----------

  const SCRIPT = /script|hand|brush|vladimir|corsiva|harlow|freehand|kunstler|edwardian|mistral|vivaldi|palace|calligra|pristina|segoe print|gabriola|signature|allura|vibes|pacifico|lobster|dancing|satisfy|cursive|chancery|zapf|blackadder|rage|curlz|magneto|kaufmann|brody|ballantines|shelley|commercial/;
  const CONDENSED = /impact|anton|bebas|haettenschweiler|oswald|condensed|compressed|narrow|agency|league gothic|univers cond/;
  const MONO = /mono|courier|consolas|typewriter|lucida console|ocr[ -]?a|ocr[ -]?b|letter gothic/;
  const SERIF = /times|garamond|baskerville|georgia|californian|antiqua|cambria|century|bodoni|bookman|palatino|copperplate|serif|roman|minion|caslon|goudy|trajan|perpetua|rockwell|elephant|castellar|engravers|constantia|optima|footlight|high tower|bell mt|modern no|centaur|old ?style|didot|clarendon|cooper|sylfaen|batang|mincho|song|tinos|liberation serif|dutch|swiss 721 bt serif|souvenir|benguiat|lubalin|american typewriter|egyptian|serifa|playfair|lora|merriweather/;
  // weight lives in the font name for families like Arial Black
  const HEAVY = /black|heavy|ultra|extra ?bold|fat/;

  // fonts that draw lowercase as small capitals
  const CAPS = /engravers|copperplate|castellar|goudy stout|felix titling|algerian|bank gothic|trajan|desdemona|stencil|colonna|perpetua titling/;

  function standIn(name) {
    const n = name.toLowerCase();
    if (SCRIPT.test(n)) return { family: 'CdrScript', generic: 'cursive' };
    if (CONDENSED.test(n)) return { family: 'CdrCondensed', generic: 'sans-serif' };
    if (MONO.test(n)) return { family: 'CdrMono', generic: 'monospace' };
    if (SERIF.test(n)) return { family: 'CdrSerif', generic: 'serif' };
    return { family: 'CdrSans', generic: 'sans-serif' };
  }

  function fontStack(name) {
    if (!name) return 'CdrSans, sans-serif';
    const s = standIn(name);
    return `"${name.replace(/"/g, '')}", ${s.family}, ${s.generic}`;
  }

  // Which fonts on this page the phone does not have. document.fonts.check is true for
  // anything installed or loaded, so a name it rejects will be drawn with our stand in.
  function missingFonts(names) {
    const out = [];
    for (const name of names) {
      let has = false;
      try { has = document.fonts.check(`12px "${name}"`) && !isGenericOnly(name); } catch (e) { has = false; }
      if (!has) out.push({ name, standIn: standIn(name).family });
    }
    return out;
  }

  // Chrome answers true for unknown names when nothing needs loading, so probe the width too.
  const probeCtx = document.createElement('canvas').getContext('2d');
  function isGenericOnly(name) {
    const sample = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJ0123456789';
    probeCtx.font = '40px monospace';
    const mono = probeCtx.measureText(sample).width;
    probeCtx.font = `40px "${name}", monospace`;
    const w1 = probeCtx.measureText(sample).width;
    probeCtx.font = '40px serif';
    const serif = probeCtx.measureText(sample).width;
    probeCtx.font = `40px "${name}", serif`;
    const w2 = probeCtx.measureText(sample).width;
    return w1 === mono && w2 === serif;
  }

  // ---------- text layout ----------

  const measureCtx = document.createElement('canvas').getContext('2d');

  function runFont(run) {
    const style = run.attrs['font-style'] || 'normal';
    const weight = run.attrs['font-weight'] || 'normal';
    return `${style} ${weight} ${run.size}px ${run.attrs['font-family'] || 'CdrSans, sans-serif'}`;
  }

  function measure(run, text) {
    measureCtx.font = runFont(run);
    return measureCtx.measureText(text).width;
  }

  function ascentOf(run) {
    measureCtx.font = runFont(run);
    const m = measureCtx.measureText('Hg');
    return m.fontBoundingBoxAscent || run.size * 0.9;
  }

  // Flattens a <text> into lines of styled runs, splitting on paragraphs and line breaks.
  function collectLines(textEl) {
    const lines = [];
    let line = [];
    const paras = textEl.querySelectorAll(':scope > tspan[data-para]');
    const groups = paras.length ? [...paras] : [textEl];
    groups.forEach((para) => {
      const paraAlign = para.getAttribute && para.getAttribute('data-align');
      line = [];
      const push = () => { lines.push({ runs: line, align: paraAlign, paraEnd: false }); line = []; };
      const addText = (text, attrs) => {
        if (!text) return;
        const size = parseFloat(attrs['font-size'] || textEl.getAttribute('font-size') || '12');
        text.split('\n').forEach((piece, i) => {
          if (i > 0) push();
          if (piece.length) line.push({ text: piece, attrs, size });
        });
      };
      para.childNodes.forEach((node) => {
        if (node.nodeType === 1 && node.getAttribute('data-br')) { push(); return; }
        if (node.nodeType !== 1) { addText(node.textContent, {}); return; }
        const attrs = {};
        for (const a of node.attributes) attrs[a.name] = a.value;
        // a run may carry its own line breaks
        node.childNodes.forEach((child) => {
          if (child.nodeType === 1 && child.getAttribute('data-br')) push();
          else addText(child.textContent, attrs);
        });
      });
      push();
      lines[lines.length - 1].paraEnd = true;
    });
    // libcdr wraps every text object in leading/trailing newlines: drop empty edge lines
    while (lines.length && !lines[0].runs.length) lines.shift();
    while (lines.length && !lines[lines.length - 1].runs.length) lines.pop();
    return lines;
  }

  // Greedy word wrap of one logical line into lines no wider than maxWidth.
  function wrap(line, maxWidth) {
    const words = [];
    line.runs.forEach((run) => {
      run.text.split(/(\s+)/).forEach((w) => { if (w.length) words.push({ run, text: w }); });
    });
    const out = [];
    let cur = [];
    let width = 0;
    const flush = (end) => {
      while (cur.length && /^\s+$/.test(cur[cur.length - 1].text)) cur.pop();
      if (cur.length || end) out.push({ runs: mergeRuns(cur), align: line.align, paraEnd: end && line.paraEnd });
      cur = [];
      width = 0;
    };
    words.forEach((w) => {
      const ww = measure(w.run, w.text);
      if (!cur.length && /^\s+$/.test(w.text)) return;
      if (width + ww > maxWidth && cur.length && !/^\s+$/.test(w.text)) flush(false);
      if (!cur.length && /^\s+$/.test(w.text)) return;
      cur.push(w);
      width += ww;
    });
    flush(true);
    return out;
  }

  function mergeRuns(words) {
    const runs = [];
    words.forEach((w) => {
      const last = runs[runs.length - 1];
      if (last && last.base === w.run) last.text += w.text;
      else runs.push({ base: w.run, text: w.text, attrs: w.run.attrs, size: w.run.size });
    });
    return runs;
  }

  const LINE_PITCH = 1.2;

  function layoutText(textEl, fileVersion) {
    const kind = textEl.getAttribute('data-kind');
    if (!kind) return;
    const num = (a) => parseFloat(textEl.getAttribute(a) || '0');
    const x = num('data-x'), y = num('data-y'), w = num('data-w');
    const hasOrigin = textEl.hasAttribute('data-ox');
    const ox = num('data-ox'), oy = num('data-oy');
    const alignCode = parseInt(textEl.getAttribute('data-align') || '0', 10);

    let lines = collectLines(textEl);
    if (!lines.length) return;
    if (kind === 'frame' && w > 0) lines = lines.flatMap((l) => wrap(l, w));

    let anchor = 'start';
    if (alignCode === 2) anchor = 'middle';
    else if (alignCode === 3) anchor = 'end';

    let ax;
    if (kind === 'frame') ax = anchor === 'middle' ? x + w / 2 : anchor === 'end' ? x + w : x;
    else ax = hasOrigin ? ox : x;

    const first = lines.find((l) => l.runs.length) || lines[0];
    const firstSize = Math.max(...first.runs.map((r) => r.size), 1);
    let baseline;
    if (kind === 'frame') baseline = y + ascentOf(first.runs[0] || { attrs: {}, size: firstSize });
    else baseline = hasOrigin ? oy : y + firstSize * 0.8;

    while (textEl.firstChild) textEl.removeChild(textEl.firstChild);
    textEl.removeAttribute('x');
    textEl.removeAttribute('y');
    textEl.setAttribute('text-anchor', anchor);
    // CorelDRAW users indent with runs of spaces; a plain 'xml:space' attribute has no
    // namespace, so Chrome ignores it and collapses them
    textEl.style.whiteSpace = 'pre';

    lines.forEach((line, i) => {
      const size = line.runs.length ? Math.max(...line.runs.map((r) => r.size)) : firstSize;
      if (i > 0) baseline += size * LINE_PITCH;
      const lineEl = document.createElementNS(SVGNS, 'tspan');
      lineEl.setAttribute('x', ax.toFixed(2));
      lineEl.setAttribute('y', baseline.toFixed(2));
      line.runs.forEach((run) => {
        const span = document.createElementNS(SVGNS, 'tspan');
        for (const [k, v] of Object.entries(run.attrs)) span.setAttribute(k, v);
        span.textContent = run.text;
        lineEl.appendChild(span);
      });
      const justify = kind === 'frame' && (alignCode === 5 || (alignCode === 4 && !line.paraEnd));
      if (justify && line.runs.length) {
        lineEl.setAttribute('textLength', w.toFixed(2));
        lineEl.setAttribute('lengthAdjust', 'spacing');
      }
      textEl.appendChild(lineEl);
    });
    if (kind === 'box') fitToInk(textEl, lines, w, ax, fileVersion);
  }

  // A stand in font can draw far wider than the designer's font (Great Vibes for a brush
  // script), running the text off its underline or into the art beside it. Artistic text's
  // box is its ink width from X6 on, but about twice the ink in X5, so squeeze the line back
  // to that width. Never stretch: a narrow stand in is only misplaced, a wide one collides.
  function fitToInk(textEl, lines, w, ax, fileVersion) {
    if (!(w > 0)) return;
    const ink = Math.floor((fileVersion || 0) / 100) === 15 ? w / 2.06 : w;
    let widest = 0;
    lines.forEach((line) => {
      widest = Math.max(widest, line.runs.reduce((sum, run) => sum + measure(run, run.text), 0));
    });
    if (widest <= ink * 1.03) return;
    const f = ink / widest;
    const old = textEl.getAttribute('transform');
    const squeeze = `translate(${ax.toFixed(2)} 0) scale(${f.toFixed(4)} 1) translate(${(-ax).toFixed(2)} 0)`;
    textEl.setAttribute('transform', old ? `${old} ${squeeze}` : squeeze);
  }

  // ---------- pages ----------

  function prepareSvg(svgText) {
    const doc = new DOMParser().parseFromString(svgText, 'image/svg+xml');
    const svg = doc.documentElement;
    if (svg.nodeName !== 'svg') throw new Error('bad svg');
    const fonts = new Set();
    svg.querySelectorAll('[font-family]').forEach((el) => {
      const name = el.getAttribute('font-family');
      fonts.add(name);
      el.setAttribute('font-family', fontStack(name));
      if (CAPS.test(name.toLowerCase())) el.setAttribute('font-variant', 'small-caps');
      if (HEAVY.test(name.toLowerCase()) && !el.getAttribute('font-weight')) el.setAttribute('font-weight', '900');
      else if (/\bbold\b|\bbd\b/.test(name.toLowerCase()) && !el.getAttribute('font-weight')) el.setAttribute('font-weight', 'bold');
    });
    return { svg: document.importNode(svg, true), fonts };
  }

  function pageBox(svg) {
    const vb = (svg.getAttribute('viewBox') || '0 0 612 792').split(/[\s,]+/).map(Number);
    return { x: vb[0], y: vb[1], width: vb[2], height: vb[3] };
  }

  // Everything drawn, in user units. Called once the svg is in the DOM and laid out.
  function drawingBox(svg) {
    let box = null;
    for (const el of svg.children) {
      if (el.nodeName === 'defs') continue;
      let b;
      try { b = el.getBBox(); } catch (e) { continue; }
      if (!b || (b.width === 0 && b.height === 0)) continue;
      box = box ? union(box, b) : { x: b.x, y: b.y, width: b.width, height: b.height };
    }
    return box;
  }

  function union(a, b) {
    const x = Math.min(a.x, b.x), y = Math.min(a.y, b.y);
    return { x, y, width: Math.max(a.x + a.width, b.x + b.width) - x, height: Math.max(a.y + a.height, b.y + b.height) - y };
  }

  function overlapShare(drawing, page) {
    const x = Math.max(drawing.x, page.x), y = Math.max(drawing.y, page.y);
    const w = Math.min(drawing.x + drawing.width, page.x + page.width) - x;
    const h = Math.min(drawing.y + drawing.height, page.y + page.height) - y;
    const area = drawing.width * drawing.height;
    return w > 0 && h > 0 && area > 0 ? (w * h) / area : 0;
  }

  // Renders every page into `host` (one .cdr-page element each). Returns facts for the UI.
  async function render(bytes, host) {
    const M = await engine();
    const ptr = M._malloc(bytes.length);
    M.HEAPU8.set(bytes, ptr);
    let count;
    try { count = M._cdr_render(ptr, bytes.length); } finally { M._free(ptr); }
    const rawVersion = M._cdr_version();
    const version = versionName(rawVersion);
    if (count < 0) {
      M._cdr_clear();
      return { ok: false, reason: count === -1 ? 'not-cdr' : 'parse-failed', version };
    }
    const pages = [];
    for (let i = 0; i < count; i++) pages.push(M.UTF8ToString(M._cdr_page(i)));
    M._cdr_clear();

    const prepared = pages.map(prepareSvg);
    // load only the stand in faces this file needs, before measuring any text
    const faces = new Set();
    prepared.forEach(({ fonts }) => fonts.forEach((f) => faces.add(standIn(f).family)));
    await Promise.all([...faces].flatMap((f) => [`20px ${f}`, `bold 20px ${f}`, `italic 20px ${f}`]
      .map((spec) => document.fonts.load(spec).catch(() => null))));
    const allFonts = new Set();
    const facts = [];
    host.textContent = '';
    for (const { svg, fonts } of prepared) {
      fonts.forEach((f) => allFonts.add(f));
      const wrapEl = document.createElement('div');
      wrapEl.className = 'cdr-page';
      wrapEl.appendChild(svg);
      host.appendChild(wrapEl);
      svg.querySelectorAll('text[data-kind]').forEach((t) => layoutText(t, rawVersion));
      const page = pageBox(svg);
      const drawing = drawingBox(svg);
      facts.push({ page, drawing, onPage: drawing ? overlapShare(drawing, page) : 1 });
    }
    return { ok: true, pages: facts, version, fonts: [...allFonts], missingFonts: missingFonts([...allFonts]) };
  }

  // Points the page's svg at either its page or its drawing, with a margin, and paints the page.
  function frame(pageEl, facts, mode) {
    const svg = pageEl.querySelector('svg');
    const useDrawing = mode === 'drawing' && facts.drawing;
    let box = useDrawing ? facts.drawing : facts.page;
    const pad = Math.max(box.width, box.height) * (useDrawing ? 0.03 : 0);
    box = { x: box.x - pad, y: box.y - pad, width: box.width + 2 * pad, height: box.height + 2 * pad };
    svg.setAttribute('viewBox', `${box.x} ${box.y} ${box.width} ${box.height}`);
    svg.setAttribute('width', box.width);
    svg.setAttribute('height', box.height);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.style.overflow = useDrawing ? 'visible' : 'hidden';
    return box;
  }

  global.CdrView = {
    warm: () => engine().then(() => true), render, frame, versionName, standIn, layoutText };
})(window);
