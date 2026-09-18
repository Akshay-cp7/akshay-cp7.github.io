const DATA = {"dates":["2026-06-21","2026-06-22","2026-06-23","2026-06-24","2026-06-25","2026-06-26","2026-06-27","2026-06-28","2026-06-29","2026-06-30","2026-07-01","2026-07-02","2026-07-03","2026-07-04","2026-07-05","2026-07-06","2026-07-07","2026-07-08","2026-07-09","2026-07-10","2026-07-11","2026-07-12","2026-07-13","2026-07-14","2026-07-15","2026-07-16","2026-07-17","2026-07-18","2026-07-19","2026-07-20","2026-07-21","2026-07-22","2026-07-23","2026-07-24","2026-07-25","2026-07-26","2026-07-27","2026-07-28","2026-07-29","2026-07-30","2026-07-31","2026-08-01","2026-08-02","2026-08-03","2026-08-04","2026-08-05","2026-08-06","2026-08-07","2026-08-08","2026-08-09","2026-08-10","2026-08-11","2026-08-12","2026-08-13","2026-08-14","2026-08-15","2026-08-16","2026-08-17","2026-08-18","2026-08-19","2026-08-20","2026-08-21","2026-08-22","2026-08-23","2026-08-24","2026-08-25","2026-08-26","2026-08-27","2026-08-28","2026-08-29","2026-08-30","2026-08-31","2026-09-01","2026-09-02","2026-09-03","2026-09-04","2026-09-05","2026-09-06","2026-09-07","2026-09-08","2026-09-09","2026-09-10","2026-09-11","2026-09-12","2026-09-13","2026-09-14","2026-09-15","2026-09-16","2026-09-17","2026-09-18"],"ads":[13.82,15.33,20.12,14.49,15.2,16.42,11.27,15.78,17.55,19.97,10.52,13.56,10.7,21.07,19.62,10.32,24.27,24.25,19.83,19.44,12.62,10.54,18.65,0.0,0.0,14.58,11.29,18.48,18.26,25.11,19.91,22.13,19.93,22.9,19.53,16.56,29.42,29.63,27.08,24.9,17.94,16.51,17.74,13.79,27.02,20.28,28.98,20.33,31.6,29.67,13.17,0.0,0.0,0.0,33.49,21.8,15.26,26.93,30.24,19.74,16.0,21.35,35.09,30.87,17.12,20.05,16.97,16.17,32.79,19.04,27.83,25.46,19.72,32.37,18.58,30.72,18.47,0.0,21.01,22.5,39.6,35.76,23.76,38.2,21.73,26.44,38.13,32.99,19.45,42.29],"placed":[3,4,4,2,3,4,4,4,4,5,1,4,5,5,2,2,5,6,6,3,4,4,4,0,1,6,5,3,4,5,8,5,5,7,5,6,5,5,7,7,5,5,2,3,5,4,7,4,7,6,3,0,1,1,5,5,2,8,9,5,4,3,7,6,7,5,3,1,9,5,3,5,2,14,5,7,4,0,5,2,8,2,4,10,7,3,4,8,5,5],"delivered":[0,0,0,0,0,1,1,1,0,4,3,1,4,4,2,1,2,2,3,3,1,3,2,3,1,7,3,5,1,0,1,1,1,3,3,2,4,6,5,2,2,8,5,1,3,4,4,4,3,0,2,0,3,4,1,1,3,1,1,1,2,1,3,3,6,6,3,0,2,5,4,4,1,2,3,3,2,3,4,5,6,1,4,0,3,2,5,3,3,5],"rev":[0.0,0.0,0.0,0.0,0.0,34.0,34.0,34.0,0.0,136.0,102.0,34.0,136.0,136.0,68.0,34.0,68.0,68.0,102.0,102.0,34.0,102.0,68.0,102.0,34.0,238.0,102.0,170.0,34.0,0.0,34.0,34.0,34.0,102.0,102.0,68.0,136.0,204.0,170.0,68.0,68.0,272.0,170.0,34.0,102.0,136.0,136.0,136.0,102.0,0.0,68.0,0.0,102.0,136.0,34.0,34.0,102.0,34.0,34.0,34.0,68.0,34.0,102.0,102.0,204.0,204.0,102.0,0.0,68.0,170.0,136.0,136.0,34.0,68.0,102.0,102.0,68.0,102.0,136.0,170.0,204.0,34.0,136.0,0.0,102.0,68.0,170.0,102.0,102.0,170.0],"cogs":[0.0,0.0,0.0,0.0,0.0,19.4,19.4,19.4,0.0,77.6,58.2,19.4,77.6,77.6,38.8,19.4,38.8,38.8,58.2,58.2,19.4,58.2,38.8,58.2,19.4,135.8,58.2,97.0,19.4,0.0,19.4,19.4,19.4,58.2,58.2,38.8,77.6,116.4,97.0,38.8,38.8,155.2,97.0,19.4,58.2,77.6,77.6,77.6,58.2,0.0,38.8,0.0,58.2,77.6,19.4,19.4,58.2,19.4,19.4,19.4,38.8,19.4,58.2,58.2,116.4,116.4,58.2,0.0,38.8,97.0,77.6,77.6,19.4,38.8,58.2,58.2,38.8,58.2,77.6,97.0,116.4,19.4,77.6,0.0,58.2,38.8,97.0,58.2,58.2,97.0],"tools":[3.58,0.02,0.03,0.0,1.04,5.56,0.0,0.0,21.54,0.8,8.01,0.31,10.41,16.72,0.01,0.04,0.01,5.18,1.23,16.33,3.41,6.33,3.2,0.23,8.77,0.08,21.38,1.79,0.1,0.03,0.2,0.86,2.18,0.04,0.28,0.17,0.0,5.87,0.09,1.91,0.18,0.07,3.18,1.57,2.46,0.03,17.21,22.51,5.66,17.38,2.35,0.0,4.28,8.24,0.01,1.18,0.69,0.28,0.0,13.13,0.11,13.77,0.95,6.43,0.07,2.38,2.02,0.0,15.89,0.02,7.01,14.67,0.28,0.01,17.24,0.0,4.99,0.4,7.49,0.39,0.02,2.89,9.81,0.97,0.6,8.5,16.94,22.55,0.01,7.44],"business":[17.4,15.35,20.15,14.49,16.24,41.38,30.67,35.18,39.09,98.37,76.73,33.27,98.71,115.39,58.43,29.76,63.08,68.23,79.26,93.97,35.43,75.07,60.65,58.43,28.17,150.46,90.87,117.27,37.76,25.14,39.51,42.39,41.51,81.14,78.01,55.53,107.02,151.9,124.17,65.61,56.92,171.78,117.92,34.76,87.68,97.91,123.79,120.44,95.46,47.05,54.32,0.0,62.48,85.84,52.9,42.38,74.15,46.61,49.64,52.27,54.91,54.52,94.24,95.5,133.59,138.83,77.19,16.17,87.48,116.06,112.44,117.73,39.4,71.18,94.02,88.92,62.26,58.6,106.1,119.89,156.02,58.05,111.17,39.17,80.53,73.74,152.07,113.74,77.66,146.73],"personal":[59.56,26.93,38.0,37.59,37.36,37.76,52.48,48.21,31.58,37.37,1044.16,36.06,28.04,62.09,151.39,27.87,35.67,34.11,32.78,26.87,55.03,46.77,28.8,37.9,28.1,27.83,30.69,55.94,54.11,131.46,35.06,27.25,35.76,33.14,53.65,43.43,28.59,28.66,34.91,36.18,31.82,901.01,51.7,32.51,38.29,134.78,30.23,31.37,54.71,63.96,34.72,27.05,27.14,27.99,34.72,57.22,58.7,36.22,27.75,31.88,130.3,35.29,53.01,49.19,27.64,36.05,37.13,36.98,35.38,61.95,46.22,34.21,1265.07,35.77,38.38,35.84,137.92,44.86,28.6,31.0,27.59,30.15,29.69,52.89,56.47,31.9,31.08,27.49,34.14,27.9],"invest":[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,2300.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,2300.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,2300.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],"salary":[0.0,0.0,0.0,0.0,0.0,0.0,0.0,4200.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,4200.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,4200.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0]};

/* ESTAZY demo — a static copy of the real dashboard, filled with one invented
   business in US dollars. Everything on screen is derived from DATA above, so
   the claims in the advice tab can be checked against the charts. */

const $ = (id) => document.getElementById(id);
const sum = (a) => a.reduce((t, x) => t + x, 0);
const usd = (n, dp = 0) =>
  (n < 0 ? '-$' : '$') + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: dp, maximumFractionDigits: dp });

const DAYS = DATA.dates.length;
const T = {
  ads: sum(DATA.ads),
  placed: sum(DATA.placed),
  delivered: sum(DATA.delivered),
  rev: sum(DATA.rev),
  cogs: sum(DATA.cogs),
  business: sum(DATA.business),
  personal: sum(DATA.personal),
  invest: sum(DATA.invest),
  salary: sum(DATA.salary),
};
T.kept = T.rev - T.cogs;
T.out = T.business + T.personal;
T.in = T.salary + T.rev;
T.net = T.in - T.out - T.invest;
T.perAdDollar = T.kept / T.ads;
T.costPerDelivered = T.ads / T.delivered;
T.deliveryRate = T.delivered / T.placed;
T.darkDays = DATA.ads.filter((a) => a < 0.01).length;

/* The unit economics the whole argument rests on. */
const AOV = T.rev / T.delivered;          // 34.00
const UNIT_COST = T.cogs / T.delivered;   // 19.40
const UNIT_KEPT = AOV - UNIT_COST;        // 14.60 — break-even cost per delivered order

/* Investments: seven holdings, one pile, mostly idle. */
const HOLDINGS = [
  { name: 'Index fund', held: 7900, yr: 5.9 },
  { name: 'Bond fund', held: 4300, yr: 3.1 },
  { name: 'Retirement account', held: 3120, yr: 6.4 },
  { name: 'Gold ETF', held: 900, yr: 4.8 },
  { name: 'Robo advisor', held: 760, yr: 5.2 },
  { name: 'Crypto', held: 740, yr: -11.2 },
  { name: 'One single stock', held: 680, yr: 2.0 },
];
const HELD = sum(HOLDINGS.map((h) => h.held));
const QUARTER = DAYS / 365;
HOLDINGS.forEach((h) => { h.gain = h.held * (h.yr / 100) * QUARTER; });
const GAIN = sum(HOLDINGS.map((h) => h.gain));
const BLENDED = (GAIN / HELD) / QUARTER * 100;
const SMALL = HOLDINGS.filter((h) => h.held < 800);
const SMALL_GAIN = sum(SMALL.map((h) => h.gain));
const smallResult = () => (SMALL_GAIN < 0 ? `lost ${usd(-SMALL_GAIN)}` : `made ${usd(SMALL_GAIN)}`);

/* Products. Counts and prices are chosen to reproduce the daily totals above. */
const PRODUCTS = [
  { name: 'Ceramic planter set', n: 98, price: 39, cost: 21.81 },
  { name: 'Wall hook pack', n: 65, price: 25, cost: 13.60 },
  { name: 'Desk organiser', n: 45, price: 31, cost: 18.90 },
  { name: 'Grow light', n: 23, price: 44, cost: 26.50 },
];
PRODUCTS.forEach((p) => { p.rev = p.n * p.price; p.spent = p.n * p.cost; p.kept = p.rev - p.spent; });

const CATEGORIES = [
  { name: 'Stock from the supplier', amt: T.cogs, kind: 'business' },
  { name: 'Rent', amt: 2700, kind: 'personal' },
  { name: 'Advertising', amt: T.ads, kind: 'business' },
  { name: 'Groceries', amt: 1612, kind: 'personal' },
  { name: 'Subscriptions and software', amt: 858, kind: 'personal' },
  { name: 'Eating out', amt: 731, kind: 'personal' },
  { name: 'Transport and fuel', amt: 624, kind: 'personal' },
  { name: 'Tools and equipment', amt: sum(DATA.tools), kind: 'business' },
  { name: 'Everything else', amt: 498, kind: 'personal' },
];

/* ------------------------------------------------- the ad spending ceiling

   Days are grouped by how much was spent on ads that day, and each group is
   asked what one delivered order cost. Spending more does buy more orders,
   but each one costs more than the last — so the useful question is not
   "is it working" but "at what budget does an order stop paying for itself". */

const BANDS = [
  { label: 'under $15', lo: 0.01, hi: 15 },
  { label: '$15 to $22', lo: 15, hi: 22 },
  { label: '$22 to $28', lo: 22, hi: 28 },
  { label: 'over $28', lo: 28, hi: 1e9 },
];
BANDS.forEach((b) => {
  const idx = DATA.ads.map((a, i) => [a, i]).filter(([a]) => a >= b.lo && a < b.hi).map(([, i]) => i);
  b.days = idx.length;
  b.ads = sum(idx.map((i) => DATA.ads[i]));
  b.placed = sum(idx.map((i) => DATA.placed[i]));
  b.budget = b.ads / b.days;
  b.cost = b.ads / (b.placed * T.deliveryRate);
});

/* Least squares through the four band points: cost = a + b x budget. */
const FIT = (() => {
  const n = BANDS.length;
  const sx = sum(BANDS.map((b) => b.budget));
  const sy = sum(BANDS.map((b) => b.cost));
  const sxx = sum(BANDS.map((b) => b.budget ** 2));
  const sxy = sum(BANDS.map((b) => b.budget * b.cost));
  const slope = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  const intercept = (sy - slope * sx) / n;
  return { slope, intercept, breakEvenBudget: (UNIT_KEPT - intercept) / slope };
})();

const AVG_BUDGET = T.ads / DAYS;

/* 95% confidence interval on the delivery rate, so the page can say how sure
   it is rather than quoting a bare percentage. */
const CI = 1.96 * Math.sqrt((T.deliveryRate * (1 - T.deliveryRate)) / T.placed) * 100;

/* --------------------------------------------------------------- drawing */

const NS = 'http://www.w3.org/2000/svg';
const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

function statRow(cards) {
  return cards.map((c, i) => `
    <div class="stat${c.tone ? ' tone-' + c.tone : ''}" style="animation-delay:${i * 60}ms">
      <div class="stat-label">${esc(c.label)}</div>
      <div class="stat-value">${esc(c.value)}</div>
      ${c.sub ? `<div class="stat-sub">${esc(c.sub)}</div>` : ''}
    </div>`).join('');
}

function barRows(rows, max, tone) {
  const top = max || Math.max(...rows.map((r) => r.value));
  return rows.map((r) => `
    <div class="bar-row">
      <div class="bar-label">
        <span class="bar-cat">${esc(r.label)}</span>
        <span class="bar-val">${esc(r.display)}</span>
      </div>
      <div class="bar-track">
        <div class="bar-fill" style="width:${Math.max(1, (r.value / top) * 100)}%;background:${r.color || tone || 'var(--cyan-dim)'}"></div>
      </div>
      ${r.sub ? `<div class="bar-sub">${esc(r.sub)}</div>` : ''}
    </div>`).join('');
}

/* A multi-series line chart on a 0-based axis. Written by hand rather than
   pulled from a library: the whole page is three files and no dependencies. */
function lineChart(el, series, labels, fmt) {
  const W = 720, H = 240, L = 46, R = 10, TOP = 12, B = 26;
  const n = labels.length;
  const peak = Math.max(...series.flatMap((s) => s.values)) || 1;
  const step = Math.pow(10, Math.floor(Math.log10(peak)));
  const top = Math.ceil(peak / step) * step;
  const x = (i) => L + (i / (n - 1)) * (W - L - R);
  const y = (v) => TOP + (1 - v / top) * (H - TOP - B);

  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => {
    const v = top * f;
    return `<line class="grid-line" x1="${L}" y1="${y(v)}" x2="${W - R}" y2="${y(v)}"/>
            <text class="axis-label" x="${L - 8}" y="${y(v) + 3.5}" text-anchor="end">${fmt(v)}</text>`;
  }).join('');

  const marks = [0, Math.floor(n / 3), Math.floor((2 * n) / 3), n - 1].map((i, k, arr) => {
    const anchor = k === 0 ? 'start' : k === arr.length - 1 ? 'end' : 'middle';
    return `<text class="axis-label" x="${x(i)}" y="${H - 8}" text-anchor="${anchor}">${labels[i]}</text>`;
  }).join('');

  const paths = series.map((s) => {
    const d = s.values.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
    return `<path class="series-line" d="${d}" stroke="${s.color}"/>`;
  }).join('');

  el.innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="line chart">${ticks}${marks}${paths}</svg>`;
}

/* Grouped columns — used wherever two or three quantities share a period. */
function columnChart(el, groups, series, fmt, opts = {}) {
  const W = 720, H = 250, L = 52, R = 10, TOP = 14, B = 30;
  const peak = Math.max(...series.flatMap((s) => s.values), opts.rule ? opts.rule.at : 0) || 1;
  const step = Math.pow(10, Math.floor(Math.log10(peak)));
  const top = Math.ceil(peak / step) * step;
  const y = (v) => TOP + (1 - v / top) * (H - TOP - B);
  const slot = (W - L - R) / groups.length;
  const bw = Math.min(26, (slot * 0.74) / series.length);

  const ticks = [0, 0.5, 1].map((f) => {
    const v = top * f;
    return `<line class="grid-line" x1="${L}" y1="${y(v)}" x2="${W - R}" y2="${y(v)}"/>
            <text class="axis-label" x="${L - 8}" y="${y(v) + 3.5}" text-anchor="end">${fmt(v)}</text>`;
  }).join('');

  const bars = groups.map((g, gi) => {
    const cx = L + slot * gi + slot / 2;
    const start = cx - (bw * series.length) / 2;
    return series.map((s, si) => {
      const v = s.values[gi];
      const h = Math.max(1, (H - TOP - B) * (v / top));
      return `<rect x="${(start + si * bw).toFixed(1)}" y="${(H - B - h).toFixed(1)}" width="${(bw - 2).toFixed(1)}" height="${h.toFixed(1)}" rx="3" fill="${s.color}"/>`;
    }).join('') + `<text class="axis-label" x="${cx.toFixed(1)}" y="${H - 10}" text-anchor="middle">${esc(g)}</text>`;
  }).join('');

  const extra = opts.rule
    ? `<line x1="${L}" y1="${y(opts.rule.at)}" x2="${W - R}" y2="${y(opts.rule.at)}" stroke="${opts.rule.color}" stroke-width="1.5" stroke-dasharray="5 4"/>
       <text class="axis-label" x="${W - R}" y="${y(opts.rule.at) - 6}" text-anchor="end" style="fill:${opts.rule.color}">${esc(opts.rule.label)}</text>`
    : '';

  el.innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="column chart">${ticks}${bars}${extra}</svg>`;
}

function legend(el, items) {
  el.innerHTML = items.map((i) => `
    <span class="legend-item"><span class="legend-swatch" style="background:${i.color}"></span>${esc(i.label)}</span>`).join('');
}

function table(el, head, rows) {
  el.innerHTML = `<table class="data-table">
    <thead><tr>${head.map((h, i) => `<th${i ? ' class="num"' : ''}>${esc(h)}</th>`).join('')}</tr></thead>
    <tbody>${rows.map((r) => `<tr>${r.map((c, i) => {
      const cls = i ? ' class="num' + (typeof c === 'object' && c.tone ? ' ' + c.tone : '') + '"' : '';
      const text = typeof c === 'object' ? c.text : c;
      return `<td${cls}>${esc(text)}${typeof c === 'object' && c.sub ? `<span class="row-sub">${esc(c.sub)}</span>` : ''}</td>`;
    }).join('')}</tr>`).join('')}</tbody></table>`;
}

const monthKey = (iso) => iso.slice(0, 7);
const monthName = (key) => new Date(key + '-02').toLocaleDateString('en-US', { month: 'short' });
const dayLabel = (iso) => new Date(iso + 'T00:00:00').toLocaleDateString('en-US', { day: 'numeric', month: 'short' });

function byMonth(values) {
  const out = new Map();
  DATA.dates.forEach((d, i) => {
    const k = monthKey(d);
    out.set(k, (out.get(k) || 0) + values[i]);
  });
  return out;
}

function byWeek(values) {
  const out = [];
  for (let i = 0; i < DAYS; i += 7) out.push(sum(values.slice(i, i + 7)));
  return out;
}

/* ----------------------------------------------------------------- views */

const DARK = (() => {
  const dark = DATA.ads.map((a, i) => [a, i]).filter(([a]) => a < 0.01).map(([, i]) => i);
  const lit = DATA.ads.map((a, i) => [a, i]).filter(([a]) => a >= 0.01).map(([, i]) => i);
  const darkRate = sum(dark.map((i) => DATA.placed[i])) / dark.length;
  const litRate = sum(lit.map((i) => DATA.placed[i])) / lit.length;
  const missed = (litRate - darkRate) * dark.length;
  return { days: dark.length, darkRate, litRate, missed, kept: missed * T.deliveryRate * UNIT_KEPT };
})();

const SUBS = { count: 14, unused: 5, monthly: 858 / 3, unusedMonthly: 61 };

function renderTopStats() {
  $('topStats').innerHTML = statRow([
    { label: 'Money in', value: usd(T.in), sub: 'salary and the shop' },
    { label: 'Money out', value: usd(T.out), sub: 'everything spent' },
    { label: 'Put into investments', value: usd(T.invest), sub: 'moved, not spent' },
    { label: 'Cash left over', value: usd(T.net), sub: T.net < 0 ? 'you went backwards' : 'kept', tone: T.net < 0 ? 'bad' : 'good' },
  ]);
  $('hudDate').textContent = `${dayLabel(DATA.dates[0])} to ${dayLabel(DATA.dates[DAYS - 1])} 2026 · ${DAYS} days`;
}

/* ---------------------------------------------------------------- advice */

function findings() {
  return [
    {
      status: 'new',
      title: 'You are feeding the slower of your two engines',
      why: `In 90 days you moved ${usd(T.invest)} into investments and ${usd(T.ads)} into ads. The investments returned ${usd(GAIN)}. The ads returned ${usd(T.kept)} of kept margin, which is ${usd(T.kept - T.ads)} after they paid for themselves.`,
      body: `A dollar in the investment pile earned 1.1 cents over the quarter. A dollar spent on ads earned ${(T.kept / T.ads - 1).toFixed(2)} of a dollar. That is not a close call, and it is the reason your cash came out at ${usd(T.net)} in a quarter where ${usd(T.in)} came in.`,
      action: `Move $2,000 of next quarter's investing into ad budget instead. Leave the retirement account alone. That one is not competing with the shop, it is insurance.`,
      meta: [`${T.delivered} settled orders`, `${T.perAdDollar.toFixed(2)}x kept per ad dollar`, `blended return ${BLENDED.toFixed(1)}%/yr`],
    },
    {
      status: 'new',
      title: `The ad budget has room to about ${usd(FIT.breakEvenBudget)} a day before an order stops paying`,
      why: `Grouped by daily budget, a delivered order costs ${usd(BANDS[0].cost, 2)} on days under $15 and ${usd(BANDS[3].cost, 2)} on days over $28. Fitted, it climbs about ${(FIT.slope * 100).toFixed(0)} cents for every extra dollar of daily budget.`,
      body: `An order stops being worth buying when it costs ${usd(UNIT_KEPT, 2)}, because that is what you keep on one. On the fitted line that happens near ${usd(FIT.breakEvenBudget)} a day. You are averaging ${usd(AVG_BUDGET, 2)}.`,
      action: `Step the daily budget up in stages, not in one jump, and stop when the cost of a delivered order approaches ${usd(UNIT_KEPT, 2)}.`,
      caveat: `Four points and a straight line. The most you have ever spent in a day is ${usd(Math.max(...DATA.ads))}, so ${usd(FIT.breakEvenBudget)} is a direction, not a target.`,
      meta: [`${BANDS.map((b) => b.days).reduce((a, b) => a + b, 0)} days with spend`, `fit: cost = ${FIT.intercept.toFixed(2)} + ${FIT.slope.toFixed(3)} x budget`],
    },
    {
      status: 'new',
      title: 'Three of the seven holdings are too small to be doing anything',
      why: `${SMALL.map((h) => h.name).join(', ')} hold ${usd(sum(SMALL.map((h) => h.held)))} between them, ${((sum(SMALL.map((h) => h.held)) / HELD) * 100).toFixed(1)}% of the pile, and between them they ${smallResult()} over the quarter.`,
      body: `They are three of the seven accounts you open, reconcile and worry about, for a combined result you would not notice if it vanished. Scattering is not diversifying. Below about $1,000 a holding mostly buys you admin.`,
      action: `Fold all three into the index fund, or into the shop. Either beats leaving them where they are.`,
      meta: [`${HOLDINGS.length} holdings`, `${usd(HELD)} invested`, `${usd(GAIN)} earned in 90 days`],
    },
    {
      status: 'new',
      title: `The ads were switched off entirely on ${DARK.days} of the last 90 days`,
      why: `On those days the shop took ${DARK.darkRate.toFixed(2)} orders a day. On the days ads ran it took ${DARK.litRate.toFixed(2)}.`,
      body: `That gap is about ${Math.round(DARK.missed)} orders not placed, and near ${usd(DARK.kept)} of margin not kept, for no reason except that nothing was watching the budget.`,
      action: `Set a low floor that never turns off. A day at $10 beats a day at zero, because zero has no tail.`,
      meta: [`${DARK.days} dark days`, `${(DARK.litRate / Math.max(DARK.darkRate, 0.01)).toFixed(1)}x fewer orders`],
    },
    {
      status: 'acted',
      title: 'Five subscriptions you have not opened in 60 days',
      why: `${SUBS.count} active subscriptions, ${usd(SUBS.monthly)} a month. ${SUBS.unused} of them have not been opened in 60 days and cost ${usd(SUBS.unusedMonthly)} a month.`,
      body: `That is ${usd(SUBS.unusedMonthly * 12)} a year, or about ${Math.round((SUBS.unusedMonthly * 12) / T.costPerDelivered)} delivered orders' worth of ad budget.`,
      action: `Cancelled on 2 September. Two were kept deliberately.`,
      meta: ['acted on 2 Sep 2026', `${usd(SUBS.unusedMonthly * 12)} a year`],
    },
    {
      status: 'dismissed',
      title: `Raising the planter set by 8% would add about ${usd(PRODUCTS[0].n * PRODUCTS[0].price * 0.08)} a quarter`,
      why: `The planter set is ${((PRODUCTS[0].kept / T.kept) * 100).toFixed(0)}% of everything you keep, at a ${((PRODUCTS[0].kept / PRODUCTS[0].rev) * 100).toFixed(0)}% margin.`,
      body: `Eight percent is ${usd(PRODUCTS[0].price * 0.08, 2)} more per set. At ${PRODUCTS[0].n} sets a quarter that is ${usd(PRODUCTS[0].n * PRODUCTS[0].price * 0.08)} with no extra ad spend, provided demand does not move.`,
      action: `Dismissed: you said two competitors sit $4 below and you would rather hold the price while the ads are still finding the audience. Recorded so it does not get raised again next month.`,
      meta: ['dismissed 9 Sep 2026'],
    },
  ];
}

function renderFindings() {
  $('findingsList').innerHTML = findings().map((f) => `
    <article class="finding ${f.status}">
      <div class="finding-head">
        <h3>${esc(f.title)}</h3>
        <span class="finding-status">${esc(f.status)}</span>
      </div>
      <p class="finding-why">${esc(f.why)}</p>
      <p>${esc(f.body)}</p>
      <p><strong class="tone-good-text">${esc(f.action)}</strong></p>
      ${f.caveat ? `<p class="caveat">${esc(f.caveat)}</p>` : ''}
      <div class="finding-meta">${f.meta.map((m) => `<span>${esc(m)}</span>`).join('')}</div>
    </article>`).join('');
  $('hudState').textContent = `${findings().filter((f) => f.status === 'new').length} things worth acting on`;
}

/* ----------------------------------------------------------------- money */

function renderMoney() {
  $('moneyMeta').textContent = `${DAYS} days to ${dayLabel(DATA.dates[DAYS - 1])} 2026`;

  $('moneyKpis').innerHTML = statRow([
    { label: 'Spent on the business', value: usd(T.business), sub: 'stock, ads, tools' },
    { label: 'Spent on living', value: usd(T.personal), sub: 'rent, food, the rest' },
    { label: 'Invested', value: usd(T.invest), sub: `${usd(GAIN)} earned back` },
    { label: 'Burn rate', value: `${usd(T.out / 3)}/mo`, sub: 'money actually spent' },
  ]);

  legend($('spendLegend'), [
    { label: 'business', color: 'var(--series-1)' },
    { label: 'living', color: 'var(--series-2)' },
  ]);
  lineChart($('spendChart'),
    [{ values: DATA.business, color: 'var(--series-1)' }, { values: DATA.personal, color: 'var(--series-2)' }],
    DATA.dates.map(dayLabel), (v) => usd(v));
  $('spendNote').textContent = `The spikes on the business line are supplier restocks. The tall ones on the living line are rent.`;

  const top = Math.max(...CATEGORIES.map((c) => c.amt));
  $('catChart').innerHTML = barRows(
    [...CATEGORIES].sort((a, b) => b.amt - a.amt).map((c) => ({
      label: c.name,
      value: c.amt,
      display: `${usd(c.amt)}  ·  ${((c.amt / T.out) * 100).toFixed(0)}%`,
      color: c.kind === 'business' ? 'var(--series-1)' : 'var(--seq-3)',
    })), top);

  const months = [...byMonth(DATA.salary).keys()];
  const inM = months.map((k) => byMonth(DATA.salary).get(k) + byMonth(DATA.rev).get(k));
  const outM = months.map((k) => byMonth(DATA.business).get(k) + byMonth(DATA.personal).get(k));
  const invM = months.map((k) => byMonth(DATA.invest).get(k) || 0);
  legend($('flowLegend'), [
    { label: 'came in', color: 'var(--good)' },
    { label: 'went out', color: 'var(--series-2)' },
    { label: 'put away', color: 'var(--cyan-dim)' },
  ]);
  columnChart($('flowChart'), months.map(monthName),
    [{ values: inM, color: 'var(--good)' }, { values: outM, color: 'var(--series-2)' }, { values: invM, color: 'var(--cyan-dim)' }],
    (v) => usd(v));
  $('flowNote').textContent = `June and September are part months here, so their bars are short for calendar reasons, not financial ones. Investing is drawn separately because it is not spending, but it leaves the account all the same, and that is why the quarter ended ${usd(T.net)}.`;

  table($('investTable'),
    ['Holding', 'Held', 'Return', '90 days'],
    [...HOLDINGS].sort((a, b) => b.held - a.held).map((h) => [
      h.name,
      usd(h.held),
      { text: `${h.yr > 0 ? '+' : ''}${h.yr}%/yr`, tone: h.yr < 0 ? 'neg' : '' },
      { text: usd(h.gain), tone: h.gain < 0 ? 'neg' : 'pos' },
    ]));
  $('investNote').textContent = `${usd(HELD)} across ${HOLDINGS.length} holdings, blended ${BLENDED.toFixed(1)}% a year. The shop kept ${usd(T.kept)} on ${usd(T.cogs + T.ads)} of working money over the same 90 days.`;
}

/* ------------------------------------------------------------------ shop */

function renderShop() {
  $('shopKpis').innerHTML = statRow([
    { label: 'Kept after stock', value: usd(T.kept), sub: `on ${usd(T.rev)} of sales` },
    { label: 'Spent on ads', value: usd(T.ads), sub: `${usd(AVG_BUDGET, 2)} a day` },
    { label: 'Kept per ad dollar', value: `${T.perAdDollar.toFixed(2)}x`, sub: 'after stock, before ads', tone: 'good' },
    { label: 'Orders that landed', value: `${(T.deliveryRate * 100).toFixed(1)}%`, sub: `±${CI.toFixed(1)} points on ${T.placed}` },
  ]);

  legend($('adsLegend'), [
    { label: 'ad spend', color: 'var(--series-2)' },
    { label: 'margin kept', color: 'var(--good)' },
  ]);
  const weeks = byWeek(DATA.ads).map((_, i) => `w${i + 1}`);
  columnChart($('adsChart'), weeks,
    [{ values: byWeek(DATA.ads), color: 'var(--series-2)' },
     { values: byWeek(DATA.rev).map((r, i) => r - byWeek(DATA.cogs)[i], 0), color: 'var(--good)' }],
    (v) => usd(v));
  $('adsNote').textContent = `Kept margin lags ad spend by about a week, because an order is only counted once it has actually arrived.`;

  const failed = T.placed - T.delivered;
  const refused = Math.round(failed * 0.65);
  $('funnel').innerHTML = barRows([
    { label: 'Orders placed', value: T.placed, display: `${T.placed}`, color: 'var(--cyan-dim)' },
    { label: 'Delivered and paid for', value: T.delivered, display: `${T.delivered}  ·  ${(T.deliveryRate * 100).toFixed(0)}%`, color: 'var(--good)' },
    { label: 'Refused at the door', value: refused, display: `${refused}  ·  ${((refused / T.placed) * 100).toFixed(0)}%`, color: 'var(--bad)', sub: 'shipped, came back, cost you the postage' },
    { label: 'Cancelled before dispatch', value: failed - refused, display: `${failed - refused}  ·  ${(((failed - refused) / T.placed) * 100).toFixed(0)}%`, color: 'var(--warn)', sub: 'never left, cost nothing' },
  ], T.placed);

  columnChart($('ceilingChart'), BANDS.map((b) => b.label),
    [{ values: BANDS.map((b) => b.cost), color: 'var(--series-1)' }],
    (v) => usd(v, 0),
    { rule: { at: UNIT_KEPT, color: 'var(--bad)', label: `break even ${usd(UNIT_KEPT, 2)}` } });
  $('ceilingNote').textContent = BANDS.map((b) => `${b.label}: ${usd(b.cost, 2)} an order over ${b.days} days`).join('  ·  ')
    + `. The red line is what one delivered order is worth to you, so the gap under it is the profit.`;

  table($('productTable'),
    ['Product', 'Delivered', 'Sales', 'Kept', 'Margin'],
    [...PRODUCTS].sort((a, b) => b.kept - a.kept).map((p) => [
      p.name, String(p.n), usd(p.rev), { text: usd(p.kept), tone: 'pos' },
      `${((p.kept / p.rev) * 100).toFixed(0)}%`,
    ]));
}

/* -------------------------------------------------------------- briefing */

function renderBriefing() {
  $('briefing').innerHTML = `
    <h2>Friday morning</h2>
    <p>The quarter closed <strong>${usd(T.net)}</strong> on cash. Not because you spent badly. You
      spent ${usd(T.out)} against ${usd(T.in)} coming in. It went backwards because ${usd(T.invest)} went into
      investments on top of that. The money is not lost, it is just somewhere that is earning
      ${BLENDED.toFixed(1)}% while the shop next to it is turning ${T.perAdDollar.toFixed(2)}x.</p>

    <p>The shop had its best week yet: ${usd(Math.max(...byWeek(DATA.rev).map((r, i) => r - byWeek(DATA.cogs)[i])))}
      kept in week ${byWeek(DATA.rev).map((r, i) => r - byWeek(DATA.cogs)[i]).indexOf(Math.max(...byWeek(DATA.rev).map((r, i) => r - byWeek(DATA.cogs)[i]))) + 1}.
      ${T.delivered} of ${T.placed} orders have now settled, which puts the delivery rate at
      <strong>${(T.deliveryRate * 100).toFixed(1)}%</strong>, give or take ${CI.toFixed(1)} points.
      That is enough orders to trust the number now.</p>

    <p>Three things, in the order I would do them:</p>
    <ul>
      <li>Put a floor under the ad budget. It was off entirely on ${DARK.days} days and that cost
        about ${usd(DARK.kept)} for nothing.</li>
      <li>Move $2,000 of next quarter's investing into the shop instead. At today's numbers that
        buys roughly ${Math.round(2000 / T.costPerDelivered)} delivered orders and about
        ${usd((2000 / T.costPerDelivered) * UNIT_KEPT - 2000)} of profit after the ads pay for
        themselves.</li>
      <li>Fold the three small holdings into one. They ${smallResult()} between them
        and take up three of your seven accounts.</li>
    </ul>

    <p><em>One caution.</em> The ceiling on ad spend is real and it is measured. Each extra dollar
      of daily budget adds about ${(FIT.slope * 100).toFixed(0)} cents to the cost of an order. You
      have room, but it is not unlimited room, and the estimate of where it runs out rests on four
      points. Raise the budget in steps and watch the cost per delivered order, not the revenue.</p>`;
}

/* ------------------------------------------------------------ chrome */

function drawTicks() {
  const marks = [];
  for (let i = 0; i < 60; i++) {
    const angle = (i / 60) * Math.PI * 2;
    const long = i % 5 === 0;
    const r1 = long ? 74 : 78;
    marks.push(`<line x1="${100 + Math.cos(angle) * r1}" y1="${100 + Math.sin(angle) * r1}" x2="${100 + Math.cos(angle) * 82}" y2="${100 + Math.sin(angle) * 82}" opacity="${long ? 0.9 : 0.35}"/>`);
  }
  $('ticks').innerHTML = marks.join('');
}

function startField() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const canvas = $('field');
  const ctx = canvas.getContext('2d');
  let w, h, dots;

  const resize = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    w = canvas.width = innerWidth * dpr;
    h = canvas.height = innerHeight * dpr;
    canvas.style.width = `${innerWidth}px`;
    canvas.style.height = `${innerHeight}px`;
    const count = Math.min(70, Math.round((innerWidth * innerHeight) / 22000));
    dots = Array.from({ length: count }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.16 * dpr, vy: (Math.random() - 0.5) * 0.16 * dpr,
      r: (Math.random() * 1.3 + 0.4) * dpr,
    }));
  };

  const frame = () => {
    ctx.clearRect(0, 0, w, h);
    for (const d of dots) {
      d.x += d.vx; d.y += d.vy;
      if (d.x < 0) d.x = w; else if (d.x > w) d.x = 0;
      if (d.y < 0) d.y = h; else if (d.y > h) d.y = 0;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(64, 224, 208, .3)';
      ctx.fill();
    }
    const reach = 120 * Math.min(devicePixelRatio || 1, 2);
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dx = dots[i].x - dots[j].x, dy = dots[i].y - dots[j].y;
        const dist = Math.hypot(dx, dy);
        if (dist < reach) {
          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.strokeStyle = `rgba(64, 224, 208, ${0.09 * (1 - dist / reach)})`;
          ctx.lineWidth = Math.min(devicePixelRatio || 1, 2);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(frame);
  };

  addEventListener('resize', resize);
  resize();
  frame();
}

function showView(name) {
  document.querySelectorAll('.tab').forEach((t) => {
    const on = t.dataset.view === name;
    t.classList.toggle('is-active', on);
    t.setAttribute('aria-selected', String(on));
  });
  document.querySelectorAll('.view').forEach((v) => v.classList.toggle('is-active', v.id === `view-${name}`));
  if (history.replaceState) history.replaceState(null, '', `#${name}`);
}

document.addEventListener('click', (e) => {
  const tab = e.target.closest('.tab');
  if (tab) showView(tab.dataset.view);
});

const BOOT_LINES = ['reading the bank…', 'reading the ad ledger…', 'settling 231 orders…', 'estazy online'];

async function boot() {
  drawTicks();
  startField();

  const lines = $('bootLines');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const step = reduced ? 0 : 240;
  for (const [i, line] of BOOT_LINES.entries()) {
    await new Promise((r) => setTimeout(r, step));
    lines.insertAdjacentHTML('beforeend', i === BOOT_LINES.length - 1 ? `<div><b>${line}</b></div>` : `<div>${line}</div>`);
  }
  await new Promise((r) => setTimeout(r, reduced ? 0 : 300));
  $('boot').classList.add('done');
  $('app').hidden = false;

  renderTopStats();
  renderFindings();
  renderMoney();
  renderShop();
  renderBriefing();

  const wanted = location.hash.slice(1);
  if (wanted && document.querySelector(`.tab[data-view="${wanted}"]`)) showView(wanted);
}

boot();
