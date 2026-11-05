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



