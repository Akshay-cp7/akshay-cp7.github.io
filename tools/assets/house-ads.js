// Promotes Akshay's own Play apps and games on the tool pages. Android visitors only:
// everyone else can't install them, so they see nothing. Needs apps-data.js first.
//
//   HouseAds.mount(el, { page: 'cdr-to-pdf', tags: ['design', 'pdf'], apps: 4, games: 2 })
//   HouseAds.android  -> true on Android, for pages that hide their own Play boxes
(function (global) {
  'use strict';

  const android = /Android/i.test(navigator.userAgent);

  const CSS = `
.ha { margin: 28px 0; }
.ha h2, .ha .ha-title { font-size: 18px; margin: 0 0 10px; font-weight: 600; }
.ha-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 10px; }
.ha-card { display: flex; gap: 12px; align-items: center; padding: 10px 12px; border: 1px solid var(--line); border-radius: 14px; background: var(--card); color: var(--ink); text-decoration: none; }
.ha-card img { width: 48px; height: 48px; border-radius: 12px; flex: none; background: var(--line); }
.ha-card .ha-txt { flex: 1; min-width: 0; line-height: 1.3; }
.ha-card b { display: block; font-size: 15px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ha-card small { display: block; color: var(--soft); font-size: 13px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ha-card .ha-get { flex: none; font-size: 13px; font-weight: 600; color: var(--accent); border: 1.5px solid var(--accent); border-radius: 999px; padding: 4px 12px; }
.ha-tag { display: inline-block; font-size: 11px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; color: var(--soft); margin-left: 6px; }
`;

  function shuffle(list) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }

  // The utm tags show up in Play Console's acquisition report, per tool page.
  function link(app, page) {
    const ref = encodeURIComponent(`utm_source=akshaycp&utm_medium=web&utm_campaign=${page}`);
    return `https://play.google.com/store/apps/details?id=${app.id}&referrer=${ref}`;
  }

  function card(app, page) {
    const a = document.createElement('a');
    a.className = 'ha-card';
    a.href = link(app, page);
    a.rel = 'noopener';
    const img = document.createElement('img');
    img.src = app.icon; img.alt = ''; img.loading = 'lazy'; img.width = 48; img.height = 48;
    const txt = document.createElement('span');
    txt.className = 'ha-txt';
    const b = document.createElement('b');
    b.textContent = app.name;
    if (app.kind === 'game') { const t = document.createElement('span'); t.className = 'ha-tag'; t.textContent = 'Game'; b.appendChild(t); }
    const s = document.createElement('small');
    s.textContent = app.line || (app.kind === 'game' ? 'Free puzzle game' : 'Free on Google Play');
    txt.append(b, s);
    const get = document.createElement('span');
    get.className = 'ha-get'; get.textContent = 'Install';
    a.append(img, txt, get);
    return a;
  }

  let styled = false;
  function mount(el, opts) {
    if (!android || !el || !global.HOUSE_APPS) return;
    if (!styled) { const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st); styled = true; }
    const o = Object.assign({ page: 'tools', tags: [], apps: 4, games: 2, skip: [], title: 'More free apps and games' }, opts);
    const pool = global.HOUSE_APPS.filter((a) => !o.skip.includes(a.id));
    const fits = (a) => a.tags.some((t) => o.tags.includes(t));
    const apps = shuffle(pool.filter((a) => a.kind === 'app' && fits(a)));
    // top up with the rest of the catalogue when a page's tags are thin
    const rest = shuffle(pool.filter((a) => a.kind === 'app' && !fits(a)));
    const picked = apps.concat(rest).slice(0, o.apps).concat(shuffle(pool.filter((a) => a.kind === 'game')).slice(0, o.games));
    el.textContent = '';
    el.classList.add('ha');
    const h = document.createElement('p');
    h.className = 'ha-title'; h.textContent = o.title;
    const list = document.createElement('div');
    list.className = 'ha-list';
    picked.forEach((a) => list.appendChild(card(a, o.page)));
    el.append(h, list);
    el.hidden = false;
  }

  global.HouseAds = { mount, android };
})(window);
