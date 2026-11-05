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
