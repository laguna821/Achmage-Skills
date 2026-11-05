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
