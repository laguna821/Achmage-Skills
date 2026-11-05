/* HIG Kit · status group. Needs hk-base.js. One IIFE; every component registers with HK.define.
   Components: progress, ring, toast-item (+ HK.toast), tip (+ HK.tip), badge, skeleton, skeleton-toggle, bar-chart, gauge, banner. */
(() => {
  'use strict';
  const HK = window.HK;
  if (!HK) { console.error('[hk-status] load hk-base.js first'); return; }

  const ICON = {
    x: '<svg class="hk-icon" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" ><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>',
  };
  const fmt = n => Number(n).toLocaleString();
  const pct = (v, max) => Math.round((v / (max || 100)) * 100);
  const fill = (tpl, o) => tpl.replace(/\{(\w+)\}/g, (_, k) => (k in o ? o[k] : ''));

  /* ---------- 1. Progress bar: keeps the value text in step with <progress> ---------- */
  HK.define('progress', root => {
    const bar = root.querySelector('progress');
    const out = root.querySelector('.hk-progress__value');
    if (!bar) return;
    const tpl = root.dataset.valueText || '{percent}%';
    const sync = () => {
      const max = bar.max || 1, value = bar.value;
      if (out) out.textContent = fill(tpl, { value: fmt(value), max: fmt(max), percent: pct(value, max) });
      if (!root.dataset.state || root.dataset.state === 'done') {
        if (bar.hasAttribute('value') && value >= max) root.dataset.state = 'done'; else if (root.dataset.state === 'done') delete root.dataset.state;
      }
    };
    new MutationObserver(sync).observe(bar, { attributes: true, attributeFilter: ['value', 'max'] });
    sync();
  });

  /* ---------- 3. Progress ring: aria-valuenow drives the arc, the text and the done check ---------- */
  HK.define('ring', ring => {
    const tpl = ring.dataset.valueText || '{percent}% 완료';
    const sync = () => {
      const min = +ring.getAttribute('aria-valuemin') || 0, max = +ring.getAttribute('aria-valuemax') || 100;
      const v = Math.min(max, Math.max(min, +ring.getAttribute('aria-valuenow') || 0));
      const p = pct(v - min, max - min);
      ring.style.setProperty('--value', p);
      const text = fill(tpl, { percent: p, value: fmt(v), max: fmt(max) });
      ring.setAttribute('aria-valuetext', text);
      if (p >= 100) ring.setAttribute('data-complete', ''); else ring.removeAttribute('data-complete');
      const out = ring.closest('.hk-ring-row')?.querySelector('.hk-ring-row__value');
      if (out) out.textContent = text;
    };
    new MutationObserver(sync).observe(ring, { attributes: true, attributeFilter: ['aria-valuenow', 'aria-valuemax', 'aria-valuemin'] });
    sync();
  });

  /* ---------- 4. Toast with undo ---------- */
  // HK.toast({ message, undoLabel, onUndo, undoneMessage, closeLabel, duration, container, shortcut })
  // shortcut: true or false turns Ctrl/Cmd+Z on or off; left out, it is on unless the page has an element with data-hk-own-undo.
  // duration: 0 = stays until dismissed or replaced; otherwise ms, never below 6000. Pauses on hover and focus.
  const MIN_MS = 6000;
  let region = null;
  const regionFor = (container, opener) => {
    if (container) {
      let r = container.querySelector(':scope > .hk-toast-region');
      if (!r) { r = document.createElement('div'); r.className = 'hk-toast-region'; r.setAttribute('data-contained', ''); container.appendChild(r); }
      return r;
    }
    if (!region || !region.isConnected) { region = document.createElement('div'); region.className = 'hk-toast-region'; }
    // fixed position, so the DOM spot is free: put it right after the opener, so Tab reaches Undo next
    if (opener && opener.isConnected && opener.offsetParent !== null && opener !== document.body && opener.parentNode) opener.insertAdjacentElement('afterend', region);
    else if (!region.parentNode) document.body.appendChild(region);
    return region;
  };

  HK.toast = (opts = {}) => {
    const o = Object.assign({ message: '', undoLabel: '', closeLabel: '닫기', duration: 8000, undoneMessage: '' }, opts);
    const opener = document.activeElement;
    const r = regionFor(o.container, opener);
    r.querySelectorAll('.hk-toast').forEach(t => t.hkDismiss ? t.hkDismiss(false) : t.remove()); // one at a time: replace
    const el = document.createElement('div');
    el.className = 'hk-toast';
    el.setAttribute('data-hk', 'toast-item');
    el.innerHTML = '<p class="hk-toast__msg" role="status"></p>' +
      (o.undoLabel ? '<button type="button" class="hk-toast__undo" data-toast-undo></button>' : '') +
      '<button type="button" class="hk-toast__close" data-toast-close>' + ICON.x + '</button>';
    el.querySelector('[data-toast-close]').setAttribute('aria-label', o.closeLabel);
    if (o.undoLabel) el.querySelector('[data-toast-undo]').textContent = o.undoLabel;
    el.hkOpts = o; el.hkOpener = opener;
    r.appendChild(el);
    HK.init(el);
    // fill the live region after insertion so assistive technologies announce it
    setTimeout(() => { const m = el.querySelector('.hk-toast__msg'); if (m && el.isConnected) m.textContent = o.message; }, 60);
    return el;
  };

  HK.define('toast-item', el => {
    const o = el.hkOpts || { duration: +el.dataset.duration || 0, undoneMessage: el.dataset.undoneMessage || '', shortcut: el.dataset.shortcut === undefined ? undefined : el.dataset.shortcut !== 'false' };
    // Ctrl/Cmd+Z: an explicit option wins; otherwise on, unless the page declares its own undo ([data-hk-own-undo] anywhere)
    const shortcutOn = () => (o.shortcut !== undefined ? !!o.shortcut : !document.querySelector('[data-hk-own-undo]'));
    const duration = o.duration > 0 ? Math.max(MIN_MS, o.duration) : 0;
    let timer = null, hovered = false, focused = false;
    const arm = () => { clearTimeout(timer); timer = null; if (duration && !hovered && !focused) timer = setTimeout(() => dismiss(true), duration); };
    const onKey = e => {
      // Undo through the system shortcut as well, unless the user is typing
      if (shortcutOn() && !e.defaultPrevented && (e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'z' && el.querySelector('[data-toast-undo]:not(:disabled)')) {
        const t = e.target; if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
        e.preventDefault(); undo();
      }
    };
    function dismiss(restoreFocus = true) {
      clearTimeout(timer); document.removeEventListener('keydown', onKey);
      const hadFocus = el.contains(document.activeElement);
      el.dispatchEvent(new CustomEvent('hk-toast-dismiss', { bubbles: true }));
      if (el.hkOpts) el.remove(); else el.hidden = true;
      if (hadFocus && restoreFocus && el.hkOpener && el.hkOpener.isConnected && el.hkOpener !== document.body) el.hkOpener.focus();
    }
    function undo() {
      const btn = el.querySelector('[data-toast-undo]'); if (!btn || btn.disabled) return;
      el.dispatchEvent(new CustomEvent('hk-undo', { bubbles: true }));
      if (typeof o.onUndo === 'function') o.onUndo();
      if (o.undoneMessage) HK.announce(o.undoneMessage); // the result of the undo is announced
      dismiss(true);
    }
    el.hkDismiss = dismiss;
    el.addEventListener('click', e => {
      if (e.target.closest('[data-toast-undo]')) undo();
      else if (e.target.closest('[data-toast-close]')) dismiss(true);
    });
    el.addEventListener('keydown', e => { if (e.key === 'Escape') { e.stopPropagation(); dismiss(true); } });
    el.addEventListener('pointerenter', () => { hovered = true; arm(); });
    el.addEventListener('pointerleave', () => { hovered = false; arm(); });
    el.addEventListener('focusin', () => { focused = true; arm(); });
    el.addEventListener('focusout', e => { if (!el.contains(e.relatedTarget)) { focused = false; arm(); } });
    document.addEventListener('keydown', onKey);
    arm();
  });

  /* ---------- 6. Tips ---------- */
  // inline: <div class="hk-tip" data-hk="tip"> ... <button data-tip-close>
  // popover: <div class="hk-tip hk-tip--popover" data-hk="tip" data-anchor="#id" hidden> ; HK.tip.show('#tipId', {focus:true})
  const openTips = new Set();
  const placeTip = tip => {
    const a = document.querySelector(tip.dataset.anchor); if (!a) return;
    const ar = a.getBoundingClientRect(), w = tip.offsetWidth, h = tip.offsetHeight, gap = 12, pad = 8;
    const below = ar.bottom + gap + h + pad <= innerHeight || ar.top - gap - h < pad;
    const top = below ? ar.bottom + gap : ar.top - gap - h;
    const left = Math.min(Math.max(ar.left + ar.width / 2 - w / 2, pad), Math.max(pad, innerWidth - w - pad));
    const ax = Math.min(Math.max(ar.left + ar.width / 2 - left, 24), w - 24);
    tip.style.top = Math.max(pad, top) + 'px'; tip.style.left = left + 'px';
    tip.style.setProperty('--hk-arrow-x', ax + 'px');
    tip.dataset.placement = below ? 'bottom' : 'top';
  };
  const hideTip = (tip, restore = true) => {
    if (!tip || tip.hidden) return;
    const hadFocus = tip.contains(document.activeElement);
    tip.hidden = true; openTips.delete(tip);
    const a = tip.dataset.anchor && document.querySelector(tip.dataset.anchor);
    if (a) a.removeAttribute('aria-describedby');
    tip.dispatchEvent(new CustomEvent('hk-tip-close', { bubbles: true }));
    if (hadFocus && restore) {
      const back = tip.hkReturn && tip.hkReturn.isConnected ? tip.hkReturn : a;
      if (back) back.focus();
      else { const host = tip.parentElement; if (host) { host.tabIndex = -1; host.focus({ preventScroll: true }); host.addEventListener('blur', () => host.removeAttribute('tabindex'), { once: true }); } }
    }
  };
  HK.tip = {
    show(ref, { focus = false } = {}) {
      const tip = typeof ref === 'string' ? document.querySelector(ref) : ref; if (!tip) return;
      [...openTips].forEach(t => { if (t !== tip) hideTip(t, false); }); // one at a time
      tip.hkReturn = document.activeElement;
      tip.hidden = false; openTips.add(tip);
      if (tip.dataset.anchor) {
        const a = document.querySelector(tip.dataset.anchor);
        if (a && tip.id) a.setAttribute('aria-describedby', tip.id);
        placeTip(tip);
      }
      if (focus) tip.querySelector('[data-tip-close]')?.focus();
    },
    hide(ref) { hideTip(typeof ref === 'string' ? document.querySelector(ref) : ref); },
  };
  HK.define('tip', tip => {
    tip.addEventListener('click', e => { if (e.target.closest('[data-tip-close]')) hideTip(tip); });
    tip.addEventListener('keydown', e => { if (e.key === 'Escape') { e.stopPropagation(); hideTip(tip); } });
    if (tip.classList.contains('hk-tip--popover')) {
      tip.setAttribute('role', 'dialog');
      const re = () => { if (!tip.hidden) placeTip(tip); };
      addEventListener('resize', re); addEventListener('scroll', re, true);
      document.addEventListener('pointerdown', e => {
        if (tip.hidden || tip.contains(e.target)) return;
        const a = tip.dataset.anchor && document.querySelector(tip.dataset.anchor);
        if (a && a.contains(e.target)) return;
        if (e.target.closest('[data-tip-open]')) return;
        hideTip(tip, false);
      });
    }
  });
  // optional trigger: <button data-hk="tip-open" data-target="#tip">
  HK.define('tip-open', b => b.addEventListener('click', () => HK.tip.show(b.dataset.target, { focus: true })));

  /* ---------- 7. Badge ---------- */
  // <span class="hk-badge" data-hk="badge" data-count="3" data-max="99" data-label="읽지 않은 알림 {n}개"></span>
  HK.define('badge', b => {
    const render = () => {
      const n = Math.max(0, parseInt(b.dataset.count, 10) || 0), max = parseInt(b.dataset.max, 10) || 99;
      b.hidden = n === 0; // no badge when nothing is new
      const shown = n > max ? max + '+' : String(n);
      const label = fill(b.dataset.label || '읽지 않은 항목 {n}개', { n: fmt(n) });
      b.innerHTML = '<span aria-hidden="true">' + shown + '</span><span class="hk-visually-hidden"></span>';
      b.lastChild.textContent = label;
    };
    new MutationObserver(render).observe(b, { attributes: true, attributeFilter: ['data-count', 'data-max', 'data-label'] });
    render();
  });

  /* ---------- 8. Skeleton ---------- */
  // <div data-hk="skeleton" id="x" aria-busy="true"> <div data-skeleton-placeholder>..</div> <div data-skeleton-content hidden>..</div> </div>
  HK.define('skeleton', root => {
    const ph = root.querySelector('[data-skeleton-placeholder]'), ct = root.querySelector('[data-skeleton-content]');
    root.hkLoaded = loaded => {
      root.setAttribute('aria-busy', loaded ? 'false' : 'true');
      if (ph) ph.hidden = loaded;
      if (ct) ct.hidden = !loaded;
    };
  });
  HK.define('skeleton-toggle', b => {
    let loaded = false;
    b.addEventListener('click', () => {
      const t = document.querySelector(b.dataset.target); if (!t || !t.hkLoaded) return;
      loaded = !loaded; t.hkLoaded(loaded);
      b.textContent = loaded ? b.dataset.labelLoaded : b.dataset.labelLoading;
      HK.announce(loaded ? b.dataset.announce || '' : '');
    });
  });

  /* ---------- 9. Bar chart: SVG built from the data table ---------- */
  const niceTicks = max => {
    const raw = max / 4, mag = Math.pow(10, Math.floor(Math.log10(raw || 1)));
    const step = [1, 2, 5, 10].map(m => m * mag).find(s => s >= raw) || mag;
    const top = Math.ceil(max / step) * step;
    const t = []; for (let v = 0; v <= top + 1e-9; v += step) t.push(v);
    return t;
  };
  const NS = 'http://www.w3.org/2000/svg';
  const mk = (n, a = {}, text) => { const e = document.createElementNS(NS, n); for (const k in a) e.setAttribute(k, a[k]); if (text != null) e.textContent = text; return e; };

  HK.define('bar-chart', fig => {
    const table = fig.querySelector('table');
    if (!table) return;
    const id = fig.id || (fig.id = HK.uid('chart'));
    const rows = [...table.querySelectorAll('tbody tr')].map(tr => ({
      label: tr.querySelector('th').textContent.trim(),
      value: parseFloat(tr.querySelector('td').dataset.value || tr.querySelector('td').textContent.replace(/[^\d.\-]/g, '')),
    }));
    const unit = fig.dataset.unit || '', xLabel = fig.dataset.xLabel || '', yLabel = fig.dataset.yLabel || '';
    const titleEl = fig.querySelector('.hk-chart__title'), sumEl = fig.querySelector('.hk-chart__summary');
    const ticks = niceTicks(Math.max(...rows.map(r => r.value), 1));
    const top = ticks[ticks.length - 1];
    // hidden description of type, axes and bounds (charts: describe chart type, axes, bounds)
    const desc = document.createElement('p');
    desc.className = 'hk-visually-hidden'; desc.id = id + '-desc';
    desc.textContent = '막대 차트. 가로축은 ' + xLabel + ', 세로축은 ' + yLabel + (unit ? '(' + unit + ')' : '') + ', 값 범위는 0에서 ' + fmt(top) + '까지입니다. 항목 ' + rows.length + '개의 값은 표에 있습니다.';
    fig.appendChild(desc);
    table.classList.add('hk-visually-hidden');
    const svgBox = document.createElement('div'); svgBox.className = 'hk-chart__plot';
    (sumEl || titleEl || table).insertAdjacentElement(sumEl || titleEl ? 'afterend' : 'beforebegin', svgBox);
    if (titleEl && !titleEl.id) titleEl.id = id + '-title';
    if (sumEl && !sumEl.id) sumEl.id = id + '-sum';

    const draw = () => {
      const W = Math.max(240, Math.round(svgBox.clientWidth || fig.clientWidth || 320));
      const H = Math.round(Math.min(300, Math.max(200, W * 0.6)));
      const maxTick = Math.max(...ticks.map(t => fmt(t).length));
      const m = { t: 40, r: 8, b: 48, l: 12 + maxTick * 7 };
      const pw = W - m.l - m.r, ph = H - m.t - m.b, band = pw / rows.length, bw = Math.min(band * 0.62, 48);
      const y = v => m.t + ph - (v / top) * ph;
      const svg = mk('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H, role: 'img', focusable: 'false' });
      svg.setAttribute('aria-labelledby', [titleEl && titleEl.id, sumEl && sumEl.id, desc.id].filter(Boolean).join(' '));
      if (yLabel) svg.appendChild(mk('text', { x: 0, y: 12, class: 'hk-chart__axis-title' }, yLabel + (unit ? ' (' + unit + ')' : '')));
      ticks.forEach(t => {
        svg.appendChild(mk('line', { x1: m.l, x2: W - m.r, y1: y(t), y2: y(t), class: t === 0 ? 'hk-chart__axis' : 'hk-chart__grid' }));
        svg.appendChild(mk('text', { x: m.l - 8, y: y(t) + 4, 'text-anchor': 'end', 'aria-hidden': 'true' }, fmt(t)));
      });
      const step = Math.max(1, Math.ceil((Math.max(...rows.map(r => r.label.length)) * 7.5) / band));
      rows.forEach((r, i) => {
        const cx = m.l + band * i + band / 2, h = (r.value / top) * ph;
        svg.appendChild(mk('rect', { x: cx - bw / 2, y: y(r.value), width: bw, height: Math.max(h, 0), rx: 4, class: 'hk-chart__bar' }));
        svg.appendChild(mk('text', { x: cx, y: y(r.value) - 6, 'text-anchor': 'middle', class: 'hk-chart__value' }, fmt(r.value)));
        if (i % step === 0) svg.appendChild(mk('text', { x: cx, y: m.t + ph + 18, 'text-anchor': 'middle' }, r.label));
      });
      if (xLabel) svg.appendChild(mk('text', { x: m.l + pw / 2, y: H - 6, 'text-anchor': 'middle', class: 'hk-chart__axis-title' }, xLabel));
      svgBox.replaceChildren(svg);
    };
    draw();
    let last = svgBox.clientWidth;
    if (window.ResizeObserver) new ResizeObserver(() => { if (Math.abs(svgBox.clientWidth - last) > 1) { last = svgBox.clientWidth; draw(); } }).observe(svgBox);
  });

  /* ---------- 10. Gauge: a level within a range (role="meter") ---------- */
  // <div class="hk-gauge" data-hk="gauge" data-value-text="{max}개 중 {value}개 완료"> with a .hk-gauge__track[role=meter] holding .hk-gauge__fill
  HK.define('gauge', root => {
    const track = root.querySelector('.hk-gauge__track');
    const out = root.querySelector('.hk-gauge__value');
    if (!track) return;
    const tpl = root.dataset.valueText || '{value} / {max}';
    const sync = () => {
      const min = +track.getAttribute('aria-valuemin') || 0, max = +track.getAttribute('aria-valuemax') || 0;
      const v = Math.min(max, Math.max(min, +track.getAttribute('aria-valuenow') || 0));
      const empty = max <= min, full = !empty && v >= max;
      const p = empty ? 0 : pct(v - min, max - min);
      root.style.setProperty('--value', p);
      root.toggleAttribute('data-empty', empty);
      root.toggleAttribute('data-full', full);
      track.hidden = empty;                                   // nothing to measure: no bar, only the text
      let text = fill(tpl, { value: fmt(v), max: fmt(max), percent: p });
      if (empty && root.dataset.emptyText) text = root.dataset.emptyText;
      else if (full && root.dataset.fullText) text = root.dataset.fullText;
      if (!empty) track.setAttribute('aria-valuetext', text);
      if (out) out.textContent = text;
      // optional tier colors: data-warn / data-critical are fractions (0 to 1) of the range; text stays the carrier of the meaning
      const f = empty ? 0 : (v - min) / (max - min);
      const lvl = root.dataset.critical && f >= +root.dataset.critical ? 'critical' : (root.dataset.warn && f >= +root.dataset.warn ? 'warn' : '');
      if (lvl) root.dataset.level = lvl; else delete root.dataset.level;
    };
    new MutationObserver(sync).observe(track, { attributes: true, attributeFilter: ['aria-valuenow', 'aria-valuemax', 'aria-valuemin'] });
    sync();
  });

  /* ---------- 11. Banner: persistent inline message ---------- */
  // <section class="hk-banner hk-banner--warning" data-hk="banner"> icon, .hk-banner__body (title, text), .hk-banner__actions (up to 2 buttons)
  HK.define('banner', el => {
    if (!el.hasAttribute('role')) el.setAttribute('role', el.classList.contains('hk-banner--error') ? 'alert' : 'status');
    const title = el.querySelector('.hk-banner__title');
    if (title && !el.hasAttribute('aria-labelledby') && !el.hasAttribute('aria-label')) {
      title.id = title.id || HK.uid('hk-banner');
      el.setAttribute('aria-labelledby', title.id);
    }
    const n = el.querySelectorAll('.hk-banner__actions > button, .hk-banner__actions > a').length;
    if (n > 2) console.warn('[hk-banner] at most two actions; found ' + n);
  });})();
