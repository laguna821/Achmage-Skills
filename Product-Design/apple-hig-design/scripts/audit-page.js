// HIG audit for a rendered page. Runs inside the browser and returns a plain object.
// How to run:
//   - Browser automation: read this file as text and evaluate it in the page (for example page.evaluate(source)).
//   - DevTools: paste it into the console.
// Options: set window.HIG_AUDIT before running, for example
//   window.HIG_AUDIT = { pxPerPt: 2.88, minTextPt: 11, canvas: [1080, 1350] }          // card news, 1080 px wide
//   window.HIG_AUDIT = { pxPerPt: 1, minTextPt: 23, canvas: [1920, 1080], safe: [60, 80] } // slides (tvOS reference)
//   window.HIG_AUDIT = { pxPerPt: 1, minTextPt: 11, minTarget: 44 }                       // phone-size web
//   window.HIG_AUDIT = { pxPerPt: 1, minTextPt: 10, minTarget: 28 }                       // desktop web (macOS reference)
// Thresholds come from references/tokens.md: text floors, the minimum contrast table (up to 17 pt: 4.5:1;
// 18 pt and up or bold: 3:1) and control sizes. Text over images, gradients or blur cannot be measured here:
// it is counted as "unmeasured" so you check it by eye or with scripts/contrast.mjs.
(() => {
  const o = Object.assign({ pxPerPt: 1, minTextPt: 11, minTarget: 44, canvas: null, safe: null, font: 'Pretendard' }, window.HIG_AUDIT || {});
  const parse = c => { const m = c && c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(/[\s,\/]+/).filter(Boolean).map(Number); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; };
  const lin = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  const lum = c => 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);
  const blend = (f, b) => ({ r: f.r * f.a + b.r * (1 - f.a), g: f.g * f.a + b.g * (1 - f.a), b: f.b * f.a + b.b * (1 - f.a), a: 1 });
  // appearance: a forced data-theme wins; otherwise the page's color-scheme and the system preference decide
  const forced = document.documentElement.dataset.theme;
  const scheme = (getComputedStyle(document.documentElement).colorScheme || 'normal').trim();
  const prefersDark = matchMedia('(prefers-color-scheme: dark)').matches;
  const dark = forced ? forced === 'dark' : (scheme === 'dark' || (scheme.includes('dark') && prefersDark));
  const rootBg = parse(getComputedStyle(document.documentElement).backgroundColor);
  const bodyBg = parse(getComputedStyle(document.body).backgroundColor);
  const canvasBg = (rootBg && rootBg.a > 0) ? rootBg : (bodyBg && bodyBg.a > 0) ? bodyBg : (dark ? { r: 18, g: 18, b: 18, a: 1 } : { r: 255, g: 255, b: 255, a: 1 });
  const bgOf = el => {
    const stack = [];
    for (let e = el; e && e.nodeType === 1; e = e.parentElement) {
      const cs = getComputedStyle(e);
      if ((cs.backgroundImage && cs.backgroundImage !== 'none') || (cs.backdropFilter && cs.backdropFilter !== 'none')) return null;
      const c = parse(cs.backgroundColor);
      if (c && c.a > 0) { stack.push(c); if (c.a >= 1) break; }
    }
    let base = canvasBg;
    for (let i = stack.length - 1; i >= 0; i--) base = blend(stack[i], base);
    return base;
  };
  // visible to sighted people: has size, not hidden, not inside aria-hidden, not a 1 px visually-hidden text
  const visible = el => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 1 && r.height > 1 && cs.visibility !== 'hidden' && cs.display !== 'none' && parseFloat(cs.opacity) > 0.05 && !el.closest('[aria-hidden="true"], .hk-visually-hidden, [hidden]'); };
  const textEls = new Set();
  const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, { acceptNode: n => (n.textContent.trim() ? 1 : 2) });
  while (tw.nextNode()) { const p = tw.currentNode.parentElement; if (p && !['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE'].includes(p.tagName) && visible(p)) textEls.add(p); }
  const sample = el => [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join(' ').slice(0, 30);
  const families = {}, small = [], contrast = [];
  let unmeasured = 0, minPt = Infinity, minSample = '';
  for (const el of textEls) {
    const cs = getComputedStyle(el);
    const pt = parseFloat(cs.fontSize) / o.pxPerPt;
    const weight = parseInt(cs.fontWeight, 10) || 400;
    const fam = cs.fontFamily.split(',')[0].replace(/["']/g, '').trim();
    families[fam] = (families[fam] || 0) + 1;
    if (pt < minPt) { minPt = pt; minSample = sample(el); }
    if (pt < o.minTextPt - 0.05) small.push(`${pt.toFixed(1)} pt "${sample(el)}"`);
    if (el.closest('[disabled], [aria-disabled="true"]')) continue; // inactive controls are exempt from contrast minimums
    const fg0 = parse(cs.color), bg = bgOf(el);
    if (!fg0 || !bg) { unmeasured++; continue; }
    const fg = fg0.a < 1 ? blend(fg0, bg) : fg0;
    const L1 = lum(fg), L2 = lum(bg);
    const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    const need = (pt >= 18 || weight >= 700) ? 3 : 4.5;
    if (ratio < need) contrast.push(`${ratio.toFixed(2)}:1 < ${need}:1 at ${pt.toFixed(1)} pt/${weight} "${sample(el)}"`);
  }
  // placeholders: empty fields show placeholder text, which must meet the same minimums
  for (const el of document.querySelectorAll('input[placeholder], textarea[placeholder]')) {
    if (!visible(el) || el.value || el.disabled) continue;
    const cs = getComputedStyle(el, '::placeholder');
    const pt = parseFloat(getComputedStyle(el).fontSize) / o.pxPerPt;
    const weight = parseInt(cs.fontWeight, 10) || 400;
    const fg0 = parse(cs.color), bg = bgOf(el);
    if (!fg0 || !bg) { unmeasured++; continue; }
    const fg = fg0.a < 1 ? blend(fg0, bg) : fg0;
    const L1 = lum(fg), L2 = lum(bg);
    const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    const need = (pt >= 18 || weight >= 700) ? 3 : 4.5;
    if (ratio < need) contrast.push(`${ratio.toFixed(2)}:1 < ${need}:1 at ${pt.toFixed(1)} pt placeholder "${el.placeholder.slice(0, 24)}"`);
  }
  const loaded = [...new Set([...document.fonts].filter(f => f.status === 'loaded').map(f => f.family.replace(/["']/g, '')))];
  const fontOk = loaded.some(f => f.includes(o.font)) && Object.keys(families).every(f => f.includes(o.font) || f === 'monospace');
  const inter = [...document.querySelectorAll('a[href], button, input, select, textarea, summary, [role="button"], [role="link"], [role="tab"], [role="switch"], [onclick], [tabindex]:not([tabindex="-1"])')].filter(visible);
  const name = e => (e.getAttribute('aria-label') || (e.getAttribute('aria-labelledby') && document.getElementById(e.getAttribute('aria-labelledby'))?.textContent) || e.getAttribute('title') || e.textContent || (e.labels && [...e.labels].map(l => l.textContent).join(' ')) || e.getAttribute('alt') || '').trim();
  const targets = inter.map(e => { const r = e.getBoundingClientRect(); return { w: Math.round(r.width / o.pxPerPt), h: Math.round(r.height / o.pxPerPt), n: (name(e) || e.tagName.toLowerCase()).slice(0, 20) }; })
    .filter(t => Math.min(t.w, t.h) < o.minTarget).map(t => `${t.w}x${t.h} pt "${t.n}"`);
  const unnamed = inter.filter(e => !['INPUT', 'SELECT', 'TEXTAREA'].includes(e.tagName) && !name(e)).map(e => e.outerHTML.slice(0, 60));
  const fieldsNoLabel = [...document.querySelectorAll('input:not([type=hidden]):not([type=submit]):not([type=button]), select, textarea')].filter(visible).filter(e => !(e.labels && e.labels.length) && !e.getAttribute('aria-label') && !e.getAttribute('aria-labelledby')).map(e => e.getAttribute('placeholder') || e.name || e.id || e.tagName.toLowerCase());
  const clickNotButton = [...document.querySelectorAll('[onclick]')].filter(e => !['A', 'BUTTON', 'INPUT', 'SUMMARY', 'SELECT', 'TEXTAREA'].includes(e.tagName) && !e.getAttribute('role') && visible(e)).map(e => e.textContent.trim().slice(0, 20));
  const imgNoAlt = [...document.querySelectorAll('img')].filter(i => !i.hasAttribute('alt')).map(i => i.getAttribute('src'));
  const viewport = document.querySelector('meta[name="viewport"]')?.getAttribute('content') || '';
  const zoomBlocked = /user-scalable\s*=\s*(no|0)|maximum-scale\s*=\s*1(\.0)?\b/i.test(viewport);
  const clipped = [...document.querySelectorAll('body *')].filter(e => { const cs = getComputedStyle(e); return /hidden|clip/.test(cs.overflow + cs.overflowY) && e.scrollHeight > e.clientHeight + 2 && e.textContent.trim().length > 0 && visible(e); }).map(e => e.textContent.trim().slice(0, 30));
  let canvases = 0; const outside = [], unsafe = [];
  if (o.canvas) {
    const [W, H] = o.canvas;
    const cand = [...document.querySelectorAll('body *')].filter(e => { const r = e.getBoundingClientRect(); return Math.abs(r.width - W) < 2 && Math.abs(r.height - H) < 2; });
    const tops = cand.filter(c => !cand.some(x => x !== c && x.contains(c)));
    canvases = tops.length;
    for (const c of tops) {
      const cr = c.getBoundingClientRect();
      for (const el of textEls) {
        if (!c.contains(el)) continue;
        const r = el.getBoundingClientRect();
        if (r.left < cr.left - 1 || r.right > cr.right + 1 || r.top < cr.top - 1 || r.bottom > cr.bottom + 1) outside.push(sample(el));
        else if (o.safe && (r.left < cr.left + o.safe[1] - 1 || r.right > cr.right - o.safe[1] + 1 || r.top < cr.top + o.safe[0] - 1 || r.bottom > cr.bottom - o.safe[0] + 1)) unsafe.push(sample(el));
      }
    }
  }
  const cap = a => a.slice(0, 6);
  const issues = [];
  if (!fontOk) issues.push(`font: expected ${o.font}; used ${Object.keys(families).join(', ')}; loaded ${loaded.join(', ') || 'none'}`);
  if (small.length) issues.push(`text below ${o.minTextPt} pt: ${small.length}`);
  if (contrast.length) issues.push(`contrast below the HIG table: ${contrast.length}`);
  if (targets.length) issues.push(`targets under ${o.minTarget} pt: ${targets.length}`);
  if (unnamed.length) issues.push(`controls without a name: ${unnamed.length}`);
  if (fieldsNoLabel.length) issues.push(`fields without a label: ${fieldsNoLabel.length}`);
  if (clickNotButton.length) issues.push(`click handlers on non-controls: ${clickNotButton.length}`);
  if (imgNoAlt.length) issues.push(`images without alt: ${imgNoAlt.length}`);
  if (zoomBlocked) issues.push('zoom blocked in the viewport meta');
  if (clipped.length) issues.push(`clipped text boxes: ${clipped.length}`);
  if (outside.length) issues.push(`text outside the canvas: ${outside.length}`);
  if (unsafe.length) issues.push(`text inside the safe-area margin: ${unsafe.length}`);
  return {
    summary: issues.length ? issues : ['no automatic findings (still check text over images, motion and meaning by eye)'],
    appearance: dark ? 'dark' : 'light',
    text: { elements: textEls.size, smallestPt: Math.round(minPt * 10) / 10, smallestSample: minSample, belowFloor: cap(small), unmeasured },
    fonts: { used: families, loaded },
    contrast: cap(contrast),
    targets: cap(targets),
    unnamedControls: cap(unnamed),
    fieldsWithoutLabel: cap(fieldsNoLabel),
    clickHandlersOnNonControls: cap(clickNotButton),
    imagesWithoutAlt: cap(imgNoAlt),
    zoomBlocked,
    clippedText: cap(clipped),
    canvas: o.canvas ? { found: canvases, textOutside: cap(outside), textInSafeMargin: cap(unsafe) } : null,
  };
})();
