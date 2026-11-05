/* HIG Kit core: a tiny registry so components bind to markup with data-hk="name" (space-separated
   names allowed). Components register with HK.define(name, init); init(el) runs once per element,
   on load and for elements added later. No dependencies. */
(() => {
  'use strict';
  const HK = (window.HK = window.HK || {});
  const defs = new Map();
  let ready = false;

  function initIn(root) {
    if (!root || root.nodeType !== 1 && root.nodeType !== 9) return;
    for (const [name, init] of defs) {
      const sel = `[data-hk~="${name}"]`;
      const list = [...root.querySelectorAll(sel)];
      if (root.nodeType === 1 && root.matches(sel)) list.unshift(root);
      for (const el of list) {
        el.__hk = el.__hk || {};
        if (el.__hk[name]) continue;
        el.__hk[name] = true;
        try { init(el); } catch (e) { console.error('[hk] ' + name, e); }
      }
    }
  }

  HK.define = (name, init) => { defs.set(name, init); if (ready) initIn(document); };
  HK.init = (root = document) => initIn(root);
  HK.compact = () => matchMedia('(max-width: 743px)').matches;           // house-style 11 size classes
  HK.reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  HK.uid = (p = 'hk') => p + '-' + Math.random().toString(36).slice(2, 8);
  HK.setTheme = t => { if (t) document.documentElement.dataset.theme = t; else delete document.documentElement.dataset.theme; };
  HK.isDark = () => getComputedStyle(document.documentElement).colorScheme.includes('dark');

  // polite announcements for assistive technologies
  let live = null;
  HK.announce = (msg) => {
    if (!live) {
      live = document.createElement('div');
      live.className = 'hk-visually-hidden';
      live.setAttribute('role', 'status');
      live.setAttribute('aria-live', 'polite');
      document.body.appendChild(live);
    }
    live.textContent = '';
    setTimeout(() => { live.textContent = msg; }, 30);
  };

  // focus helpers for overlays
  HK.focusables = (root) => [...root.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')]
    .filter(el => el.offsetParent !== null || el === document.activeElement);

  // density: data-hk="density" on an app root switches to the desktop (.hk-mac) density on regular widths
  // with a fine pointer, and back to touch density otherwise [HIG transfer: macOS sizes for pointer use]
  HK.define('density', (el) => {
    const mq = matchMedia('(min-width: 744px) and (pointer: fine)');
    const apply = () => el.classList.toggle('hk-mac', mq.matches);
    apply();
    mq.addEventListener('change', apply);
  });

  function start() {
    ready = true;
    initIn(document);
    new MutationObserver(muts => {
      for (const m of muts) for (const n of m.addedNodes) if (n.nodeType === 1) initIn(n);
    }).observe(document.documentElement, { childList: true, subtree: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();


/* ===== group: controls ===== */
/* HIG Kit controls: behavior for button, segmented, switch, stepper, slider, field, textview, search.
   Needs hk-base.js. Events: controls dispatch a bubbling CustomEvent "hk:change" (detail: value) and
   the search field dispatches "hk:search" (detail: { query, scope }). */
(() => {
  'use strict';
  const HK = window.HK;
  if (!HK) { console.error('[hk-controls] load hk-base.js first'); return; }

  // Lucide icons (stroke 1.75), paths copied from assets/icons/lucide/*.svg
  const ICONS = {
    x: '<path d="M18 6 6 18" /><path d="m6 6 12 12" />',
    'circle-x': '<circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" />',
    'circle-alert': '<circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" />'
  };
  const icon = (name) => `<svg class="hk-icon" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${ICONS[name]}</svg>`;
  const ids = (...els) => els.filter(Boolean).map(e => e.id).join(' ');
  const emit = (el, name, detail) => el.dispatchEvent(new CustomEvent(name, { bubbles: true, detail }));

  /* 1. Button: a busy button keeps its place and focus but ignores activation */
  HK.define('button', el => {
    const sync = () => {
      if (el.getAttribute('aria-busy') === 'true' && !el.querySelector('.hk-btn__spinner')) {
        const s = document.createElement('span');
        s.className = 'hk-btn__spinner'; s.setAttribute('aria-hidden', 'true');
        el.prepend(s);
      } else if (el.getAttribute('aria-busy') !== 'true') {
        el.querySelector(':scope > .hk-btn__spinner')?.remove();
      }
    };
    sync();
    new MutationObserver(sync).observe(el, { attributes: true, attributeFilter: ['aria-busy'] });
    el.addEventListener('click', e => {
      if (el.getAttribute('aria-busy') === 'true') { e.preventDefault(); e.stopImmediatePropagation(); }
    }, true);
  });

  /* 2. Segmented control: radiogroup, roving tabindex, arrow keys select */
  HK.define('segmented', el => {
    const items = [...el.querySelectorAll('[role="radio"]')];
    if (!items.length) return;
    el.setAttribute('role', 'radiogroup');
    el.classList.add('hk-seg');
    items.forEach(i => i.classList.add('hk-seg__item'));
    el.style.setProperty('--_n', items.length);
    const ind = document.createElement('span');
    ind.className = 'hk-seg__indicator'; ind.setAttribute('aria-hidden', 'true');
    el.prepend(ind);
    let cur = Math.max(0, items.findIndex(i => i.getAttribute('aria-checked') === 'true'));
    const set = (n, { focus = false, silent = false } = {}) => {
      cur = n;
      items.forEach((it, k) => { it.setAttribute('aria-checked', String(k === n)); it.tabIndex = k === n ? 0 : -1; });
      el.style.setProperty('--_i', n);
      if (focus) items[n].focus();
      if (!silent) emit(el, 'hk:change', { index: n, value: items[n].dataset.value ?? items[n].textContent.trim() });
    };
    set(cur, { silent: true });
    requestAnimationFrame(() => el.setAttribute('data-ready', ''));
    const enabled = d => { let n = cur; for (let k = 0; k < items.length; k++) { n = (n + d + items.length) % items.length; if (!items[n].disabled) return n; } return cur; };
    items.forEach((it, k) => it.addEventListener('click', () => { if (!it.disabled) set(k); }));
    el.addEventListener('keydown', e => {
      const map = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
      let n = null;
      if (e.key in map) n = enabled(map[e.key]);
      else if (e.key === 'Home') n = items.findIndex(i => !i.disabled);
      else if (e.key === 'End') n = items.length - 1 - [...items].reverse().findIndex(i => !i.disabled);
      if (n === null) return;
      e.preventDefault(); set(n, { focus: true });
    });
  });

  /* 3. Toggle: switch */
  HK.define('switch', el => {
    el.setAttribute('role', 'switch');
    if (!el.hasAttribute('aria-checked')) el.setAttribute('aria-checked', 'false');
    if (!el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby')) {
      const lab = el.closest('.hk-toggle')?.querySelector('.hk-toggle__label');
      if (lab) { lab.id = lab.id || HK.uid('hk-tl'); el.setAttribute('aria-labelledby', lab.id); }
    }
    el.addEventListener('click', () => {
      const on = el.getAttribute('aria-checked') !== 'true';
      el.setAttribute('aria-checked', String(on));
      emit(el, 'hk:change', { checked: on });
    });
  });

  /* 4. Stepper: min, max, step; keyboard: arrows on any part, PageUp/PageDown by 10 steps, Home/End */
  HK.define('stepper', el => {
    const minus = el.querySelector('[data-step="-1"]'), plus = el.querySelector('[data-step="1"]');
    const out = el.querySelector('.hk-stepper__value');
    if (!minus || !plus || !out) return;
    el.setAttribute('role', 'group');
    const min = el.dataset.min !== undefined ? +el.dataset.min : -Infinity;
    const max = el.dataset.max !== undefined ? +el.dataset.max : Infinity;
    const step = +(el.dataset.step || 1);
    const unit = el.dataset.unit || '';
    let v = +(el.dataset.value ?? out.textContent) || 0;
    out.setAttribute('aria-live', 'polite');
    const render = () => {
      out.textContent = v + unit;
      minus.setAttribute('aria-disabled', String(v <= min));
      plus.setAttribute('aria-disabled', String(v >= max));
      el.dataset.value = v;
    };
    const to = (n) => { n = Math.min(max, Math.max(min, n)); if (n === v) return; v = n; render(); emit(el, 'hk:change', { value: v }); };
    render();
    let timer = null, rep = null;
    const stop = () => { clearTimeout(timer); clearInterval(rep); };
    for (const b of [minus, plus]) {
      const d = +b.dataset.step;
      b.addEventListener('pointerdown', e => {
        if (e.button > 0 || b.getAttribute('aria-disabled') === 'true') return;
        to(v + d * step);
        timer = setTimeout(() => { rep = setInterval(() => to(v + d * step), 90); }, 450);
      });
      b.addEventListener('click', e => { if (e.detail === 0) to(v + d * step); });   // keyboard activation only
    }
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(t => el.addEventListener(t, stop));
    el.addEventListener('keydown', e => {
      const k = { ArrowUp: 1, ArrowRight: 1, ArrowDown: -1, ArrowLeft: -1, PageUp: 10, PageDown: -10 }[e.key];
      if (k) { e.preventDefault(); to(v + k * step); }
      else if (e.key === 'Home' && isFinite(min)) { e.preventDefault(); to(min); }
      else if (e.key === 'End' && isFinite(max)) { e.preventDefault(); to(max); }
    });
  });

  /* 5. Slider: native range, filled track via --p */
  HK.define('slider', el => {
    const out = el.dataset.output ? document.getElementById(el.dataset.output) : null;
    const unit = el.dataset.unit || '';
    const sync = () => {
      const min = +el.min || 0, max = el.max === '' ? 100 : +el.max;
      el.style.setProperty('--p', ((el.value - min) / (max - min)) * 100 + '%');
      if (out) out.textContent = el.value + unit;
      if (unit) el.setAttribute('aria-valuetext', el.value + unit);
    };
    el.addEventListener('input', sync);
    sync();
  });

  /* 6. Text field (also date, time and text view parts): label, hint, clear, error, count */
  HK.define('field', el => {
    const input = el.querySelector('.hk-field__input');
    if (!input) return;
    const control = el.querySelector('.hk-field__control') || input.parentElement;
    const label = el.querySelector('.hk-field__label');
    input.id = input.id || HK.uid('hk-in');
    if (label && !label.htmlFor) label.htmlFor = input.id;
    let foot = el.querySelector('.hk-field__foot');
    const hint = el.querySelector('.hk-field__hint');
    if (hint) hint.id = hint.id || HK.uid('hk-hint');
    const mk = (tag, cls) => { const n = document.createElement(tag); n.className = cls; return n; };
    const ensureFoot = () => foot || (foot = el.appendChild(mk('div', 'hk-field__foot')));

    let err = el.querySelector('.hk-field__error');
    if (!err) { err = mk('p', 'hk-field__error'); err.innerHTML = icon('circle-alert') + '<span></span>'; control.after(err); }
    err.id = err.id || HK.uid('hk-err');
    const errText = err.querySelector('span:last-child');

    let count = el.querySelector('.hk-field__count');
    if (!count && el.hasAttribute('data-count') && input.maxLength > 0) { count = mk('span', 'hk-field__count'); ensureFoot().append(count); }
    if (count) count.id = count.id || HK.uid('hk-count');

    const textLike = input.tagName === 'INPUT' && ['text', 'email', 'tel', 'url', 'password', 'number', 'search'].includes(input.type);
    let clear = null;
    if (textLike && el.dataset.clear !== 'false') {
      clear = mk('button', 'hk-field__clear');
      clear.type = 'button'; clear.hidden = true;
      clear.setAttribute('aria-label', el.dataset.clearLabel || '입력 지우기');
      clear.innerHTML = icon('circle-x');
      control.append(clear);
      clear.addEventListener('click', () => { input.value = ''; input.dispatchEvent(new Event('input', { bubbles: true })); input.focus(); });
    }

    const describe = () => {
      const parts = [hint, input.getAttribute('aria-invalid') === 'true' ? err : null, count];
      const extra = (input.dataset.describedby || '').trim();
      input.setAttribute('aria-describedby', [ids(...parts), extra].filter(Boolean).join(' '));
    };
    const setError = (msg) => {
      if (msg) { errText.textContent = msg; input.setAttribute('aria-invalid', 'true'); }
      else { input.removeAttribute('aria-invalid'); errText.textContent = ''; }
      describe();
    };
    el.hkSetError = setError;
    if (input.getAttribute('aria-invalid') === 'true' && !errText.textContent.trim()) setError(el.dataset.error || '입력을 확인해 주세요.');

    const sync = () => {
      if (clear) clear.hidden = !input.value || input.disabled || input.readOnly;
      if (count) {
        const n = input.value.length, m = input.maxLength;
        count.textContent = n + '/' + m;
        count.toggleAttribute('data-full', n >= m);
      }
    };
    let touched = false;
    input.addEventListener('input', () => {
      sync();
      if (input.getAttribute('aria-invalid') === 'true' && input.checkValidity()) setError('');
    });
    input.addEventListener('blur', () => {   // validate when leaving the field, not on every key
      touched = touched || !!input.value;
      if (!touched || el.dataset.validate === 'off') return;
      if (!input.checkValidity()) setError(el.dataset.error || input.validationMessage);
    });
    describe(); sync();
  });

  /* 7. Text view: grows with its content up to data-max-rows, then scrolls */
  HK.define('textview', el => {
    const ta = el.querySelector('textarea');
    if (!ta) return;
    const maxRows = +(el.dataset.maxRows || 8);
    const fit = () => {
      const cs = getComputedStyle(ta);
      const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.375;
      const pad = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
      ta.style.height = 'auto';
      const h = Math.min(ta.scrollHeight, lh * maxRows + pad);
      ta.style.height = h + 'px';
      ta.style.overflowY = ta.scrollHeight > h + 1 ? 'auto' : 'hidden';
    };
    ta.addEventListener('input', fit);
    addEventListener('resize', fit);
    document.fonts?.ready.then(fit);
    fit();
  });

  /* 8. Search field: clear, Cancel on compact widths while active, Enter submits, optional scope bar */
  HK.define('search', el => {
    const input = el.querySelector('.hk-search__input');
    if (!input) return;
    const bar = el.querySelector('.hk-search__bar') || el;
    const field = el.querySelector('.hk-search__field') || input.parentElement;
    el.setAttribute('role', 'search');
    let clear = el.querySelector('.hk-search__clear');
    if (!clear) {
      clear = document.createElement('button');
      clear.type = 'button'; clear.className = 'hk-search__clear'; clear.hidden = true;
      clear.setAttribute('aria-label', el.dataset.clearLabel || '검색어 지우기');
      clear.innerHTML = icon('circle-x');
      field.append(clear);
    }
    const cancel = el.querySelector('.hk-search__cancel');
    const scopes = el.querySelector('.hk-search__scopes');
    const sync = () => { clear.hidden = !input.value; };
    const leave = () => { el.removeAttribute('data-active'); };
    input.addEventListener('input', sync);
    el.addEventListener('focusin', () => el.setAttribute('data-active', ''));
    el.addEventListener('focusout', e => { if (!e.relatedTarget || !el.contains(e.relatedTarget)) { if (!input.value) leave(); } });
    clear.addEventListener('click', () => { input.value = ''; sync(); input.focus(); emit(el, 'hk:change', { query: '' }); });
    if (cancel) {
      cancel.addEventListener('pointerdown', e => e.preventDefault());   // keep focus so the click lands
      cancel.addEventListener('click', () => { input.value = ''; sync(); leave(); input.blur(); emit(el, 'hk:change', { query: '' }); });
    }
    input.addEventListener('keydown', e => {
      if (e.key === 'Escape') { if (input.value) { input.value = ''; sync(); emit(el, 'hk:change', { query: '' }); } else { leave(); input.blur(); } }
    });
    const scopeValue = () => scopes?.querySelector('[role="radio"][aria-checked="true"]')?.dataset.value ?? null;
    const form = el.tagName === 'FORM' ? el : el.closest('form');
    (form || el).addEventListener('submit', e => {
      if (!form || !form.getAttribute('action')) e.preventDefault();   // in-page search unless the form has an action
      emit(el, 'hk:search', { query: input.value.trim(), scope: scopeValue() });
    });
    if (scopes) scopes.addEventListener('hk:change', () => { if (input.value.trim()) emit(el, 'hk:search', { query: input.value.trim(), scope: scopeValue() }); });
    sync();
  });

  /* 11. Completion check: a toggle-like round button with checkbox semantics (role="checkbox" and
     aria-checked, or a plain button with aria-pressed). Click, Space and Enter toggle; hk:change {checked}.
     data-strike="#id" mirrors the state to data-done on the row text (style it with .hk-strike). */
  HK.define('complete', el => {
    if (!el.hasAttribute('role') && !el.hasAttribute('aria-pressed')) el.setAttribute('role', 'checkbox');
    if (el.tagName !== 'BUTTON') { console.warn('[hk-complete] use a <button type="button">'); }
    const attr = el.getAttribute('role') === 'checkbox' ? 'aria-checked' : 'aria-pressed';
    if (!el.hasAttribute(attr)) el.setAttribute(attr, 'false');
    if (el.tagName === 'BUTTON' && !el.hasAttribute('type')) el.type = 'button';
    const target = el.dataset.strike ? document.querySelector(el.dataset.strike) : null;
    const isOn = () => el.getAttribute(attr) === 'true';
    const mirror = () => { if (target) target.setAttribute('data-done', String(isOn())); };
    mirror();
    el.addEventListener('click', () => {
      if (el.disabled || el.getAttribute('aria-disabled') === 'true') return;
      el.setAttribute(attr, String(!isOn()));
      mirror();
      emit(el, 'hk:change', { checked: isOn() });
    });
    // external changes to the attribute (the app restoring state) keep the strike-through in step
    new MutationObserver(mirror).observe(el, { attributes: true, attributeFilter: [attr] });
  });
})();


/* ===== group: nav ===== */
/* HIG Kit, group "nav": behavior for the app shell, sidebar, navigation bar, list rows, table, sheet, alert,
   action sheet, popover and pull-down menu. Needs hk-base.js. Disclosure and tab bar need no script. */
(() => {
  'use strict';
  const HK = window.HK;
  if (!HK) { console.error('[hk-nav] load hk-base.js first'); return; }
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const hasPopover = typeof HTMLElement !== 'undefined' && 'showPopover' in HTMLElement.prototype;

  // ----- openers: any [data-hk-open="#id"] opens a dialog (modal) or a popover; focus returns to it -----
  document.addEventListener('click', e => {
    const b = e.target.closest && e.target.closest('[data-hk-open]');
    if (!b) return;
    const t = $(b.dataset.hkOpen);
    if (t) t.__opener = b;
  }, true);
  document.addEventListener('click', e => {
    const b = e.target.closest && e.target.closest('[data-hk-open]');
    if (!b) return;
    const t = $(b.dataset.hkOpen);
    if (t instanceof HTMLDialogElement && !t.open) t.showModal();
  });

  // ----- anchored placement shared by popover, action sheet (regular) and menu -----
  function place(el, anchor, o = {}) {
    const clear = () => { ['left', 'top'].forEach(p => el.style.removeProperty(p)); el.style.removeProperty('--hk-arrow-x'); el.removeAttribute('data-side'); el.dataset.placed = 'true'; };
    if (!anchor || (o.compactSheet && HK.compact())) { clear(); return; }
    const gap = o.arrow ? 12 : 4, m = 8;
    const a = anchor.getBoundingClientRect(), w = el.offsetWidth, h = el.offsetHeight;
    const vw = document.documentElement.clientWidth, vh = window.innerHeight;
    const roomB = vh - a.bottom - gap - m, roomT = a.top - gap - m;
    const below = roomB >= h || roomB >= roomT;
    let top = below ? a.bottom + gap : a.top - gap - h;
    top = Math.max(m, Math.min(top, vh - h - m));
    let left = o.align === 'start' ? a.left : a.left + a.width / 2 - w / 2;
    left = Math.max(m, Math.min(left, vw - w - m));
    el.style.left = left + 'px'; el.style.top = top + 'px';
    el.style.setProperty('--hk-arrow-x', Math.max(20, Math.min(a.left + a.width / 2 - left, w - 20)) + 'px');
    el.dataset.side = below ? 'bottom' : 'top';
    el.dataset.placed = 'true';
  }
  const trackPlacement = (el, fn, isOpen) => {
    const again = () => { if (isOpen()) fn(); };
    addEventListener('resize', again);
    addEventListener('scroll', again, true);
  };

  // ----- app shell: the same destinations in the tab bar and the sidebar -----
  HK.define('app', app => {
    const views = $$('[data-view]', app);
    const select = id => {
      $$('[data-dest]', app).forEach(a => {
        if (a.dataset.dest === id) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
      });
      views.forEach(v => { v.hidden = v.dataset.view !== id; });
      const sc = $('.hk-app__main', app); if (sc) sc.scrollTop = 0;
    };
    app.addEventListener('click', e => {
      const a = e.target.closest('[data-dest]');
      if (a && app.contains(a)) {
        e.preventDefault();
        select(a.dataset.dest);
        HK.announce(a.textContent.replace(/\s+/g, ' ').trim());
      }
      const t = e.target.closest('[data-hk-sidebar-toggle]');
      if (t) {
        const hide = app.dataset.sidebar !== 'hidden';
        if (hide) app.dataset.sidebar = 'hidden'; else delete app.dataset.sidebar;
        $$('[data-hk-sidebar-toggle]', app).forEach(b => b.setAttribute('aria-expanded', String(!hide)));
      }
    });
    const tabs = $$('.hk-tabbar .hk-tab', app);
    if (tabs.length > 5) console.warn('[hk-nav] a tab bar holds at most five destinations; move the rest to a sidebar or a list');
  });

  // ----- sidebar: one tab stop, arrow keys, Home and End, Left and Right for groups -----
  HK.define('sidebar', nav => {
    const items = () => $$('.hk-sidebar__item', nav).filter(i => i.offsetParent !== null);
    const setStop = cur => { $$('.hk-sidebar__item', nav).forEach(i => i.setAttribute('tabindex', i === cur ? '0' : '-1')); };
    const start = () => $('.hk-sidebar__item[aria-current="page"]', nav) || items()[0];
    setStop(start());
    nav.addEventListener('focusin', e => { const i = e.target.closest('.hk-sidebar__item'); if (i) setStop(i); });
    nav.addEventListener('click', () => { setTimeout(() => { const c = $('.hk-sidebar__item[aria-current="page"]', nav); if (c && !nav.contains(document.activeElement)) setStop(c); }); });
    nav.addEventListener('keydown', e => {
      const cur = e.target.closest('.hk-sidebar__item'); if (!cur) return;
      const list = items(), i = list.indexOf(cur);
      let n = null;
      if (e.key === 'ArrowDown') n = list[Math.min(i + 1, list.length - 1)];
      else if (e.key === 'ArrowUp') n = list[Math.max(i - 1, 0)];
      else if (e.key === 'Home') n = list[0];
      else if (e.key === 'End') n = list[list.length - 1];
      else if (e.key === 'ArrowRight' && cur.tagName === 'SUMMARY') { const d = cur.parentElement; if (!d.open) { d.open = true; e.preventDefault(); return; } n = list[i + 1]; }
      else if (e.key === 'ArrowLeft') {
        const d = cur.parentElement;
        if (cur.tagName === 'SUMMARY' && d.open) { d.open = false; e.preventDefault(); return; }
        const up = cur.closest('details'); const sum = up && (up.contains(cur) && up.firstElementChild !== cur ? up.firstElementChild : null);
        if (sum) n = sum;
      }
      if (n) { e.preventDefault(); n.focus(); }
    });
  });

  // ----- navigation bar / toolbar: glass only while content scrolls beneath, large title becomes inline -----
  HK.define('navbar', bar => {
    const scroller = bar.closest('[data-hk-scroll], .hk-app__main');
    const large = bar.dataset.large ? $(bar.dataset.large) : (bar.nextElementSibling && bar.nextElementSibling.matches('.hk-navbar__large') ? bar.nextElementSibling : null);
    if (large) bar.setAttribute('data-large', '');
    const top = () => scroller ? scroller.scrollTop : window.scrollY;
    // data-show on the large title: "compact" (default), "always" or "never" (see README); a hidden large title means the inline title always shows
    const shown = () => { const m = large && large.dataset.show; return !!large && (m === 'always' || (m !== 'never' && HK.compact())); };
    const update = () => {
      bar.toggleAttribute('data-scrolled', top() > 1);
      const collapsed = !shown() || large.getBoundingClientRect().bottom <= bar.getBoundingClientRect().bottom + 1;
      bar.toggleAttribute('data-collapsed', collapsed);
    };
    (scroller || window).addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update);
    if (large) new MutationObserver(update).observe(large, { attributes: true, attributeFilter: ['data-show'] });
    update();
  });

  // ----- list: switch rows, option rows (checkmark), swipe actions -----
  HK.define('switchrow', btn => {
    btn.addEventListener('click', () => { btn.setAttribute('aria-checked', String(btn.getAttribute('aria-checked') !== 'true')); });
  });
  HK.define('choicelist', ul => {
    const opts = () => $$('[role="radio"]', ul);
    const stop = cur => opts().forEach(o => o.setAttribute('tabindex', o === cur ? '0' : '-1'));
    const pick = o => { opts().forEach(x => x.setAttribute('aria-checked', String(x === o))); stop(o); o.focus(); };
    stop(opts().find(o => o.getAttribute('aria-checked') === 'true') || opts()[0]);
    ul.addEventListener('click', e => { const o = e.target.closest('[role="radio"]'); if (o && o.getAttribute('aria-disabled') !== 'true') pick(o); });
    ul.addEventListener('keydown', e => {
      const l = opts().filter(o => o.getAttribute('aria-disabled') !== 'true'), i = l.indexOf(document.activeElement);
      if (i < 0) return;
      const d = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
      if (d) { e.preventDefault(); pick(l[(i + d + l.length) % l.length]); }
    });
  });
  HK.define('swipe', row => {
    const main = $('.hk-row__main', row), acts = $('.hk-row__actions', row);
    if (!main || !acts) return;
    const measure = () => { const w = acts.offsetWidth; if (w) row.style.setProperty('--hk-actions-w', w + 'px'); return w || 144; };
    measure();
    ['pointerenter', 'focusin', 'pointerdown'].forEach(t => row.addEventListener(t, measure));
    let sx = 0, sy = 0, base = 0, x = 0, mode = null, w = 0, t0 = 0, justDragged = false;
    const rtl = () => getComputedStyle(row).direction === 'rtl';
    main.addEventListener('pointerdown', e => {
      if (e.pointerType === 'mouse') return;
      w = measure(); sx = e.clientX; sy = e.clientY; t0 = e.timeStamp; mode = 'wait'; base = row.hasAttribute('data-open') ? -w : 0; x = base;
    });
    main.addEventListener('pointermove', e => {
      if (!mode) return;
      const dx = (e.clientX - sx) * (rtl() ? -1 : 1), dy = e.clientY - sy;
      if (mode === 'wait') {
        if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) { mode = 'drag'; row.setAttribute('data-swiping', ''); main.setPointerCapture(e.pointerId); }
        else if (Math.abs(dy) > 8) { mode = null; return; }
        else return;
      }
      x = Math.max(-w - 24, Math.min(0, base + dx));
      main.style.transform = `translateX(${x * (rtl() ? -1 : 1)}px)`;
    });
    const end = e => {
      if (mode === 'drag') {
        const fast = (e.clientX - sx) / Math.max(1, e.timeStamp - t0);
        const open = x < -w / 2 || (fast < -0.5 && x < 0);
        main.style.removeProperty('transform');
        row.removeAttribute('data-swiping');
        row.toggleAttribute('data-open', open && fast < 0.5);
        justDragged = true; setTimeout(() => { justDragged = false; });
      }
      mode = null;
    };
    main.addEventListener('pointerup', end);
    main.addEventListener('pointercancel', end);
    main.addEventListener('click', e => {
      if (justDragged || row.hasAttribute('data-open')) { e.preventDefault(); e.stopPropagation(); row.removeAttribute('data-open'); }
    }, true);
    row.addEventListener('keydown', e => { if (e.key === 'Escape' && row.hasAttribute('data-open')) { row.removeAttribute('data-open'); main.focus(); } });
    document.addEventListener('pointerdown', e => { if (!row.contains(e.target)) row.removeAttribute('data-open'); });
    acts.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      row.removeAttribute('data-open');
      row.dispatchEvent(new CustomEvent('hk:row-action', { bubbles: true, detail: { action: b.dataset.action || b.textContent.trim(), button: b } }));
    });
  });

  // ----- table: sortable headers with aria-sort, row hover and selection -----
  HK.define('table', table => {
    const body = table.tBodies[0];
    const rows = () => [...body.rows];
    const heads = [...table.tHead.rows[0].cells];
    heads.forEach((th, idx) => {
      const btn = $('.hk-table__sort', th); if (!btn) return;
      btn.addEventListener('click', () => {
        const dir = th.getAttribute('aria-sort') === 'ascending' ? 'descending' : 'ascending';
        heads.forEach(h => h.removeAttribute('aria-sort'));
        th.setAttribute('aria-sort', dir);
        const key = r => { const c = r.cells[idx]; const v = c.dataset.sort ?? c.textContent.trim(); const n = parseFloat(v); return Number.isNaN(n) || /[a-z\uAC00-\uD7A3]/i.test(v.replace(/e/i, '')) ? v : n; };
        const f = dir === 'ascending' ? 1 : -1;
        rows().sort((a, b) => { const x = key(a), y = key(b); return (typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y), undefined, { numeric: true })) * f; }).forEach(r => body.appendChild(r));
        HK.announce(`${btn.textContent.trim()}, ${dir}`);
      });
    });
    const setRow = (r, on) => { r.setAttribute('aria-selected', String(on)); const c = $('input[type="checkbox"]', r); if (c) c.checked = on; };
    const all = $('thead input[type="checkbox"]', table);
    const sync = () => { if (!all) return; const n = rows().filter(r => r.getAttribute('aria-selected') === 'true').length; all.checked = n === rows().length; all.indeterminate = n > 0 && n < rows().length; };
    rows().forEach(r => { if (!r.hasAttribute('aria-selected')) r.setAttribute('aria-selected', 'false'); });
    body.addEventListener('click', e => {
      const r = e.target.closest('tr'); if (!r || e.target.closest('a, button')) return;
      const box = e.target.closest('input[type="checkbox"]');
      setRow(r, box ? box.checked : r.getAttribute('aria-selected') !== 'true'); sync();
    });
    if (all) all.addEventListener('change', () => { rows().forEach(r => setRow(r, all.checked)); });
  });

  // ----- sheet: native dialog; Cancel leading, confirm trailing, Escape closes, swipe down on compact -----
  HK.define('sheet', dlg => {
    let dirty = false;
    const form = $('form', dlg);
    const disc = dlg.dataset.discard ? $(dlg.dataset.discard) : null;
    // data-discard-ask: when unsaved input asks before closing. "cancel" (default): Cancel, Escape and swipe-down all ask;
    // "swipe": only the swipe-down asks, Cancel and Escape close at once; "never": nothing asks.
    const askOn = via => { const m = dlg.dataset.discardAsk || 'cancel'; return m === 'cancel' || (m === 'swipe' && via === 'swipe'); };
    if (form) form.addEventListener('input', () => { dirty = true; });
    const requestCancel = (via = 'cancel') => {
      if (dirty && disc && askOn(via)) { disc.returnValue = ''; disc.__opener = $('[value="cancel"]', dlg); disc.showModal(); } else dlg.close('cancel');
    };
    dlg.addEventListener('cancel', e => { e.preventDefault(); requestCancel('cancel'); });
    dlg.addEventListener('click', e => {
      const c = e.target.closest('[value="cancel"], [data-hk-close]');
      if (c && dlg.contains(c)) { e.preventDefault(); requestCancel('cancel'); }
    });
    if (disc) disc.addEventListener('close', () => { if (disc.returnValue === 'discard') { dirty = false; dlg.close('cancel'); } });
    dlg.addEventListener('close', () => {
      dirty = false; dlg.style.removeProperty('transform');
      const o = dlg.__opener; if (o && o.isConnected) o.focus();
    });
    const grab = $('.hk-sheet__grab', dlg);
    if (grab) {
      let y0 = null, dy = 0, t0 = 0;
      grab.addEventListener('pointerdown', e => { y0 = e.clientY; dy = 0; t0 = e.timeStamp; grab.setPointerCapture(e.pointerId); dlg.style.transition = 'none'; });
      grab.addEventListener('pointermove', e => { if (y0 === null) return; dy = Math.max(0, e.clientY - y0); dlg.style.transform = `translateY(${dy}px)`; });
      const up = e => {
        if (y0 === null) return;
        const v = dy / Math.max(1, e.timeStamp - t0);
        y0 = null; dlg.style.removeProperty('transition'); dlg.style.removeProperty('transform');
        if (dy > 100 || v > 0.6) requestCancel('swipe');
      };
      grab.addEventListener('pointerup', up); grab.addEventListener('pointercancel', up);
    }
  });

  // ----- alert: alertdialog, no light dismiss, Escape cancels; no default button when destructive -----
  HK.define('alert', dlg => {
    dlg.setAttribute('role', 'alertdialog');
    dlg.setAttribute('tabindex', '-1');
    const orig = dlg.showModal.bind(dlg);
    dlg.showModal = () => {
      orig();
      const d = $('[autofocus]', dlg) || $('.hk-alert__btn--default', dlg);
      if (d && !dlg.hasAttribute('data-destructive')) d.focus(); else dlg.focus();
    };
    dlg.addEventListener('cancel', () => { dlg.returnValue = 'cancel'; });
    dlg.addEventListener('close', () => { const o = dlg.__opener; if (o && o.isConnected) o.focus(); });
  });

  // ----- action sheet: bottom group + separate Cancel on compact, popover from its source on regular -----
  HK.define('actionsheet', dlg => {
    dlg.setAttribute('tabindex', '-1');
    const anchor = () => dlg.__opener;
    const doPlace = () => {
      if (HK.compact()) { place(dlg, null); return; }
      place(dlg, anchor(), { arrow: true });
    };
    const orig = dlg.showModal.bind(dlg);
    dlg.showModal = () => {
      dlg.removeAttribute('data-placed');
      if (!dlg.__opener) { const ae = document.activeElement; if (ae && ae !== document.body) dlg.__opener = ae; }
      orig();
      doPlace();
      dlg.focus({ preventScroll: true }); // no default action: the first Tab reaches the first choice
    };
    trackPlacement(dlg, doPlace, () => dlg.open);
    dlg.addEventListener('cancel', () => { dlg.returnValue = 'cancel'; });
    dlg.addEventListener('click', e => {
      if (e.target !== dlg) return;
      const inside = $$('.hk-actionsheet__group, .hk-actionsheet__cancel', dlg).some(g => { const r = g.getBoundingClientRect(); return e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom; });
      if (!inside) dlg.close('cancel');
    });
    // regular: the dialog box itself is the popover surface, so a click on the backdrop lands on the dialog element's outside
    document.addEventListener('pointerdown', e => {
      if (!dlg.open || HK.compact()) return;
      const r = dlg.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dlg.close('cancel');
    }, true);
    dlg.addEventListener('close', () => { const o = dlg.__opener; dlg.__opener = null; if (o && o.isConnected) o.focus(); });
  });

  // ----- popover: anchored with an arrow on regular, a bottom sheet on compact; one at a time -----
  HK.define('popover', pop => {
    pop.classList.add('hk-popover');
    pop.setAttribute('popover', 'auto');
    if (!pop.hasAttribute('tabindex')) pop.setAttribute('tabindex', '-1');
    if (!hasPopover) { console.warn('[hk-nav] Popover API missing'); return; }
    $$(`[data-hk-open="#${pop.id}"]`).forEach(b => { b.popoverTargetElement = pop; b.setAttribute('aria-haspopup', 'dialog'); b.setAttribute('aria-expanded', 'false'); });
    const open = () => pop.matches(':popover-open');
    const doPlace = () => place(pop, pop.__opener, { arrow: true, compactSheet: true });
    pop.addEventListener('beforetoggle', e => { if (e.newState === 'open') pop.removeAttribute('data-placed'); });
    pop.addEventListener('toggle', e => {
      const o = pop.__opener; if (o) o.setAttribute('aria-expanded', String(e.newState === 'open'));
      if (e.newState === 'open') { doPlace(); pop.focus({ preventScroll: true }); }
    });
    trackPlacement(pop, doPlace, open);
    pop.addEventListener('click', e => { if (e.target.closest('[data-hk-close]')) pop.hidePopover(); });
  });

  // ----- pull-down menu: role=menu items, arrow keys, typeahead, checkmarks, Escape returns focus -----
  HK.define('menu', root => {
    const btn = $('[aria-haspopup="menu"]', root), list = $('[role="menu"]', root);
    if (!btn || !list || !hasPopover) return;
    list.classList.add('hk-menu__list');
    list.setAttribute('popover', 'auto');
    if (!list.id) list.id = HK.uid('menu');
    btn.setAttribute('aria-controls', list.id);
    btn.setAttribute('aria-expanded', 'false');
    btn.popoverTargetElement = list;
    const items = () => $$('[role^="menuitem"]', list);
    const focusItem = i => { const l = items(); if (l.length) l[(i + l.length) % l.length].focus({ preventScroll: true }); };
    const doPlace = () => place(list, btn, { align: 'start' });
    let via = 'pointer';
    btn.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); via = e.key === 'ArrowUp' ? 'last' : 'first'; if (!list.matches(':popover-open')) list.showPopover(); }
      else if (e.key === 'Enter' || e.key === ' ') via = 'first';
    });
    btn.addEventListener('pointerdown', () => { via = 'first'; });
    list.addEventListener('beforetoggle', e => { if (e.newState === 'open') list.removeAttribute('data-placed'); });
    list.addEventListener('toggle', e => {
      btn.setAttribute('aria-expanded', String(e.newState === 'open'));
      if (e.newState === 'open') { doPlace(); focusItem(via === 'last' ? -1 : 0); via = 'pointer'; }
    });
    trackPlacement(list, doPlace, () => list.matches(':popover-open'));
    const groupOf = it => {
      const g = [it]; for (let n = it.previousElementSibling; n && n.matches('[role^="menuitem"]'); n = n.previousElementSibling) g.push(n);
      for (let n = it.nextElementSibling; n && n.matches('[role^="menuitem"]'); n = n.nextElementSibling) g.push(n);
      return g;
    };
    list.addEventListener('keydown', e => {
      const l = items(), i = l.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); focusItem(i + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); focusItem(i - 1); }
      else if (e.key === 'Home') { e.preventDefault(); focusItem(0); }
      else if (e.key === 'End') { e.preventDefault(); focusItem(-1); }
      else if (e.key === 'Tab') { list.hidePopover(); }
      else if (e.key.length === 1 && /\S/.test(e.key) && !e.ctrlKey && !e.metaKey) {
        const k = e.key.toLowerCase(), order = [...l.slice(i + 1), ...l.slice(0, i + 1)];
        const m = order.find(x => x.textContent.trim().toLowerCase().startsWith(k)); if (m) m.focus();
      }
    });
    list.addEventListener('click', e => {
      const it = e.target.closest('[role^="menuitem"]'); if (!it || it.getAttribute('aria-disabled') === 'true') return;
      const role = it.getAttribute('role');
      if (role === 'menuitemcheckbox') it.setAttribute('aria-checked', String(it.getAttribute('aria-checked') !== 'true'));
      else if (role === 'menuitemradio') groupOf(it).filter(x => x.getAttribute('role') === 'menuitemradio').forEach(x => x.setAttribute('aria-checked', String(x === it)));
      list.hidePopover();
      root.dispatchEvent(new CustomEvent('hk:menu-select', { bubbles: true, detail: { item: it, label: it.textContent.trim() } }));
    });
    list.addEventListener('pointermove', e => { const it = e.target.closest('[role^="menuitem"]'); if (it && document.activeElement !== it) it.focus({ preventScroll: true }); });
  });
})();





/* ===== group: status ===== */
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
