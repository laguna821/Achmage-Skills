/* Demo deck engine: a presentation that is also a live product demo.
   Define window.DECK before this script (see index.html and references/media/demo-deck.md).
   Each step dims the product and spotlights one element with a popover tip, or shows a title card,
   or hands the product to the presenter (live). Icons: Lucide (ISC), from assets/icons/lucide.

   Navigation model: every key press or click updates the wanted step at once; one runner brings the
   product to that step's state in order (no action runs twice), and steps that need a clean product
   are prepared in a hidden second frame and swapped in when ready, so the screen never goes blank. */
(() => {
  'use strict';
  const D = window.DECK || {};
  const STEPS = D.steps || [];
  const W = 1920, H = 1080, SAFE_X = 80, SAFE_Y = 60, GAP = 26;
  const ICON_CLICK = "<svg aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.25\" stroke-linecap=\"round\" stroke-linejoin=\"round\" > <path d=\"M14 4.1 12 6\" /> <path d=\"m5.1 8-2.9-.8\" /> <path d=\"m6 12-1.9 2\" /> <path d=\"M7.2 2.2 8 5.1\" /> <path d=\"M9.037 9.69a.498.498 0 0 1 .653-.653l11 4.5a.5.5 0 0 1-.074.949l-4.349 1.041a1 1 0 0 0-.74.739l-1.04 4.35a.5.5 0 0 1-.95.074z\" /> </svg>";
  const ICON_HAND = "<svg aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.25\" stroke-linecap=\"round\" stroke-linejoin=\"round\" > <path d=\"M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2\" /> <path d=\"M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2\" /> <path d=\"M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8\" /> <path d=\"M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15\" /> </svg>";
  const L = Object.assign({
    live: '직접 써 보세요',
    liveOn: '직접 조작 중 · L 키를 누르면 돌아옵니다',
    reset: '이 단계의 처음 상태로 되돌렸습니다',
    pick: '요소 고르기: 클릭하면 선택자를 복사합니다 · P 키로 끝내기',
    pickImage: '영역 고르기: 끌어서 사각형을 그리면 좌표를 복사합니다 · P 키로 끝내기',
    copied: '복사함',
    missing: '대상을 찾지 못했습니다',
    help: [['→ Space PageDown', '다음'], ['← PageUp', '이전'], ['Home End', '처음, 끝'], ['클릭', '밝게 표시된 곳을 누르면 결과 단계로'], ['L', '직접 조작 켜고 끄기'], ['R', '이 단계 다시 맞추기'], ['F', '전체 화면'], ['P', '대상 고르기 (작성용)'], ['?', '도움말']],
  }, D.labels || {});
  const $ = s => document.querySelector(s);
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const nextFrame = () => new Promise(r => requestAnimationFrame(() => r()));
  const clamp = (v, a, b) => Math.min(Math.max(v, a), b);
  const root = document.documentElement;
  root.dataset.theme = D.theme === 'light' ? 'light' : 'dark';
  if (D.title) document.title = D.title;
  if (D.dim != null) root.style.setProperty('--dim', String(D.dim));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const T = reduce ? 0 : 460;
  root.style.setProperty('--t', T + 'ms');

  // ---------- DOM ----------
  let stage = $('#stage');
  if (!stage) { stage = document.createElement('div'); stage.id = 'stage'; document.body.appendChild(stage); }
  stage.innerHTML = `
<div id="frame"><div id="bar"><i></i><i></i><i></i><div id="url"></div></div>
  <div id="screen"><div id="status"><span class="time">9:41</span><span class="island"></span></div>
    <div id="view"><div id="cam"><iframe class="pf" title="product"></iframe><iframe class="pf" title="product" tabindex="-1"></iframe><img id="shot" alt=""></div></div>
    <div id="homebar"><i></i></div></div></div>
<div id="spot"></div><div id="shield"></div><div id="pickring"></div>
<div id="title" aria-live="polite"><p class="eyebrow"></p><h1></h1><p class="sub"></p></div>
<div id="pop" role="note" aria-live="polite"><div class="arrow"></div><p class="eyebrow"></p><h2></h2><p class="body"></p><p class="hint"></p></div>
<div id="livebar">${ICON_HAND}<span></span></div>
<div id="dots" aria-hidden="true"></div><div id="hud" role="status"></div>
<div id="help"><div>${L.help.map(([k, v]) => `<div><kbd>${k}</kbd>${v}</div>`).join('')}</div></div>`;
  const spot = $('#spot'), shield = $('#shield'), pop = $('#pop'), dots = $('#dots'), hudEl = $('#hud'), pickring = $('#pickring'), cam = $('#cam');

  // ---------- product and device frame ----------
  const P0 = D.product || {};
  const phone = P0.device === 'phone';
  const P = Object.assign(phone ? { width: 402, height: 874, statusBar: true } : { width: 1440, height: 900 }, P0);
  const insets = phone && P.statusBar !== false;
  const topIn = insets ? 54 : 0, botIn = insets ? 34 : 0;
  const BAR = phone ? 0 : 40, BEZ = phone ? 14 : 0;
  const base = phone ? (H - 2 * SAFE_Y - 2 * BEZ) / P.height : Math.min((W - 2 * SAFE_X) / P.width, (H - 2 * SAFE_Y - BAR) / P.height);
  const scrW = P.width * base, scrH = P.height * base;
  const frameW = scrW + 2 * BEZ, frameH = scrH + BAR + 2 * BEZ;
  const frameX = Math.round((W - frameW) / 2 + (phone ? (P.offsetX || 0) : 0)), frameY = Math.round((H - frameH) / 2);
  const vw = P.width, vh = P.height - topIn - botIn;
  const viewX = frameX + BEZ, viewY = frameY + BAR + BEZ + topIn * base;
  const viewRect = { x: viewX, y: viewY, w: vw * base, h: vh * base };
  const frameEl = $('#frame');
  frameEl.className = phone ? 'phone' : 'desktop';
  Object.assign(frameEl.style, { left: frameX + 'px', top: frameY + 'px', width: frameW + 'px', height: frameH + 'px' });
  const screenR = phone ? Math.round(47 * base) : 0; // [House] generic phone outline, not Apple artwork
  if (phone) frameEl.style.borderRadius = screenR + BEZ + 'px';
  Object.assign($('#screen').style, { left: BEZ + 'px', top: BAR + BEZ + 'px', width: scrW + 'px', height: scrH + 'px', borderRadius: screenR + 'px' });
  if (!phone) $('#url').textContent = P.url || D.title || '';
  const st = $('#status'), hb = $('#homebar');
  if (phone) {
    st.style.height = topIn * base + 'px';
    Object.assign(st.querySelector('.time').style, { left: 46 * base + 'px', top: 16 * base + 'px', fontSize: 17 * base + 'px' });
    Object.assign(st.querySelector('.island').style, { top: 11 * base + 'px', width: 126 * base + 'px', height: 37 * base + 'px', borderRadius: 19 * base + 'px' });
    hb.style.height = botIn * base + 'px';
    Object.assign(hb.querySelector('i').style, { bottom: 8 * base + 'px', width: 134 * base + 'px', height: 5 * base + 'px', borderRadius: 3 * base + 'px' });
    if (!insets) { st.style.display = 'none'; hb.style.display = 'none'; }
  }
  Object.assign($('#view').style, { top: topIn * base + 'px', width: vw * base + 'px', height: vh * base + 'px' });
  const frames = [...document.querySelectorAll('#cam .pf')];
  let active = frames[0];
  const backOf = () => (active === frames[0] ? frames[1] : frames[0]);
  if (P.image) { frames.forEach(f => { f.style.display = 'none'; }); Object.assign($('#shot').style, { display: 'block', width: vw + 'px', height: vh + 'px' }); }
  else frames.forEach(f => Object.assign(f.style, { width: vw + 'px', height: vh + 'px' }));
  const docOf = f => { try { return f.contentDocument; } catch (e) { return null; } };
  const frameDoc = () => (P.image ? null : docOf(active));

  // ---------- camera (zoom toward the target) ----------
  let camState = { z: 1, tx: 0, ty: 0 };
  function setCam(z, cx, cy) {
    const s = base * z;
    const tx = z > 1 ? clamp(viewRect.w / 2 - cx * s, viewRect.w - vw * s, 0) : 0;
    const ty = z > 1 ? clamp(viewRect.h / 2 - cy * s, viewRect.h - vh * s, 0) : 0;
    camState = { z, tx, ty };
    cam.style.transform = `translate(${tx}px, ${ty}px) scale(${s})`;
  }
  const toStage = r => ({ x: viewX + camState.tx + r.x * base * camState.z, y: viewY + camState.ty + r.y * base * camState.z, w: r.w * base * camState.z, h: r.h * base * camState.z });
  function clip(a, b) {
    const x = Math.max(a.x, b.x), y = Math.max(a.y, b.y);
    return { x, y, w: Math.max(0, Math.min(a.x + a.w, b.x + b.w) - x), h: Math.max(0, Math.min(a.y + a.h, b.y + b.h) - y) };
  }
  setCam(1, 0, 0);

  // ---------- fit the stage to the window ----------
  let fitS = 1, offX = 0, offY = 0;
  function fit() {
    fitS = Math.min(innerWidth / W, innerHeight / H);
    offX = (innerWidth - W * fitS) / 2; offY = (innerHeight - H * fitS) / 2;
    stage.style.transform = `translate(${offX}px, ${offY}px) scale(${fitS})`;
  }
  addEventListener('resize', fit); fit();

  // ---------- helpers ----------
  let hudTimer = 0;
  function hud(text, ms) {
    clearTimeout(hudTimer);
    hudEl.textContent = text || '';
    hudEl.classList.toggle('on', !!text);
    if (text && ms) hudTimer = setTimeout(() => hudEl.classList.remove('on'), ms);
  }
  const kindOf = i => { const s = STEPS[i]; return !s ? 'title' : (s.kind || (s.target ? 'focus' : 'title')); };
  const hasDo = s => !!(s && s.do && s.do.length);
  function measure(step) {
    const t = step.target;
    if (!t) return null;
    if (Array.isArray(t)) return { x: t[0], y: t[1], w: t[2], h: t[3], radius: step.radius ?? 12 };
    const doc = frameDoc();
    const el = doc && doc.querySelector(t);
    if (!el) { hud(`${L.missing}: ${t}`, 5000); console.warn('[demo deck] target not found:', t); return null; }
    const win = doc.defaultView;
    const r0 = el.getBoundingClientRect();
    if (r0.top < 0 || r0.bottom > win.innerHeight || r0.left < 0 || r0.right > win.innerWidth) el.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'instant' });
    const r = el.getBoundingClientRect();
    const radius = step.radius ?? (parseFloat(win.getComputedStyle(el).borderTopLeftRadius) || 0);
    return { x: r.left, y: r.top, w: r.width, h: r.height, radius };
  }
  function setSpot(h, radius) {
    if (!h) { Object.assign(spot.style, { left: W / 2 + 'px', top: H / 2 + 'px', width: '0px', height: '0px', borderRadius: '0px' }); return; }
    Object.assign(spot.style, { left: h.x + 'px', top: h.y + 'px', width: h.w + 'px', height: h.h + 'px', borderRadius: radius + 'px' });
  }
  function setShield(h) {
    shield.style.clipPath = h ? `path(evenodd, 'M0 0H${W}V${H}H0Z M${h.x} ${h.y}h${h.w}v${h.h}h${-h.w}Z')` : 'none';
  }
  function fillText(el, sel, text) { el.querySelector(sel).textContent = text || ''; }
  function fillPop(step) {
    fillText(pop, '.eyebrow', step.eyebrow);
    fillText(pop, 'h2', step.title);
    fillText(pop, '.body', step.body);
    const hint = pop.querySelector('.hint');
    hint.innerHTML = step.hint ? `${ICON_CLICK}<span></span>` : '';
    if (step.hint) hint.querySelector('span').textContent = step.hint;
  }
  function placePop(h, step) {
    const pw = pop.offsetWidth, ph = pop.offsetHeight;
    const cx = h.x + h.w / 2, cy = h.y + h.h / 2;
    const fits = {
      right: () => h.x + h.w + GAP + pw <= W - SAFE_X,
      left: () => h.x - GAP - pw >= SAFE_X,
      bottom: () => h.y + h.h + GAP + ph <= H - SAFE_Y,
      top: () => h.y - GAP - ph >= SAFE_Y,
    };
    const order = [...new Set([step.placement, 'right', 'left', 'bottom', 'top'].filter(Boolean))];
    const side = order.find(s => fits[s] && fits[s]()) || null;
    let x, y;
    if (side === 'right' || side === 'left') { x = side === 'right' ? h.x + h.w + GAP : h.x - GAP - pw; y = clamp(cy - ph / 2, SAFE_Y, H - SAFE_Y - ph); }
    else if (side) { y = side === 'bottom' ? h.y + h.h + GAP : h.y - GAP - ph; x = clamp(cx - pw / 2, SAFE_X, W - SAFE_X - pw); }
    else { x = W - SAFE_X - pw; y = H - SAFE_Y - ph - 40; }
    Object.assign(pop.style, { left: x + 'px', top: y + 'px' });
    const ar = pop.querySelector('.arrow');
    ar.className = 'arrow ' + ({ right: 'left', left: 'right', bottom: 'up', top: 'down' }[side] || '');
    ar.style.display = side ? 'block' : 'none';
    ar.style.top = ''; ar.style.left = '';
    if (side === 'right' || side === 'left') ar.style.top = clamp(cy - y - 18, 28, ph - 64) + 'px';
    else if (side) ar.style.left = clamp(cx - x - 18, 28, pw - 64) + 'px';
  }
  function renderDots(i) {
    const n = STEPS.length;
    dots.innerHTML = n <= 10 ? STEPS.map((_, k) => `<i class="${k === i ? 'on' : ''}"></i>`).join('') : `<span>${i + 1} / ${n}</span>`;
  }
  function chromeFromProduct() {
    const doc = frameDoc();
    if (P.chrome) { st.style.background = hb.style.background = P.chrome; st.style.color = P.chromeText || '#000'; hb.querySelector('i').style.background = P.chromeText || '#000'; return; }
    if (!phone || !insets || !doc) return;
    const win = doc.defaultView;
    const paint = (yy, box, ink) => {
      let e = doc.elementFromPoint(vw / 2, yy) || doc.body, bg = '';
      while (e) { bg = win.getComputedStyle(e).backgroundColor; if (bg && !/rgba\(0, 0, 0, 0\)|transparent/.test(bg)) break; e = e.parentElement; bg = ''; }
      bg = bg || win.getComputedStyle(doc.documentElement).backgroundColor || '#fff';
      if (/rgba\(0, 0, 0, 0\)|transparent/.test(bg)) bg = '#fff';
      const m = (bg.match(/[\d.]+/g) || [255, 255, 255]).map(Number);
      const dark = (0.2126 * m[0] + 0.7152 * m[1] + 0.0722 * m[2]) / 255 < 0.5;
      box.style.background = bg;
      ink(dark ? '#fff' : '#000');
    };
    paint(1, st, c => { st.style.color = c; });
    paint(vh - 1, hb, c => { hb.querySelector('i').style.background = c; });
  }

  // ---------- product frames: loading, hooks and scripted actions ----------
  const expecting = new Set();
  let dirty = false;         // the visible product changed outside the script
  function hook(f) {
    const doc = docOf(f);
    if (!doc || doc.__deck) return;
    doc.__deck = true;
    doc.addEventListener('keydown', onFrameKey, true);
    doc.addEventListener('click', e => onFrameClick(e, f), true);
    if (picking && f === active) setPick(true, true);
  }
  frames.forEach(f => f.addEventListener('load', () => {
    hook(f);
    if (!expecting.has(f) && f === active && f.getAttribute('src')) dirty = true; // the product navigated on its own
    expecting.delete(f);
  }));
  async function loadInto(f) {
    // unload the old page first: a product may save its state on beforeunload, which would undo the storage reset
    if (f.getAttribute('src') && f.getAttribute('src') !== 'about:blank') {
      await new Promise(r => { const h = () => { f.removeEventListener('load', h); r(); }; f.addEventListener('load', h); f.src = 'about:blank'; });
    }
    return new Promise(res => {
      const done = async () => {
        f.removeEventListener('load', done);
        const doc = docOf(f);
        if (doc && doc.fonts && doc.fonts.ready) await Promise.race([doc.fonts.ready, sleep(1500)]);
        await nextFrame();
        res();
      };
      expecting.add(f);
      f.addEventListener('load', done);
      if (P.resetStorage) { try { localStorage.clear(); sessionStorage.clear(); } catch (e) { /* ignore */ } }
      const u = new URL(P.src, location.href);
      u.searchParams.set('_deck', Date.now().toString(36) + Math.random().toString(36).slice(2, 6));
      f.src = u.href;
    });
  }
  async function act(step, fast, doc, skip) {
    const list = (step && step.do) || [];
    if (!doc || !list.length) return;
    const win = doc.defaultView;
    for (let i = skip || 0; i < list.length; i++) {
      const a = list[i];
      const q = s => doc.querySelector(s);
      if (a.click) { const el = q(a.click); if (el) el.click(); else console.warn('[demo deck] click target not found:', a.click); }
      else if (a.type) {
        const el = q(a.type[0]);
        if (el) {
          el.focus();
          const setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el), 'value')?.set;
          setter ? setter.call(el, a.type[1]) : (el.value = a.type[1]);
          el.dispatchEvent(new win.Event('input', { bubbles: true }));
          el.dispatchEvent(new win.Event('change', { bubbles: true }));
        }
      }
      else if (a.scroll) q(a.scroll)?.scrollIntoView({ block: 'center', behavior: 'instant' });
      else if (a.focus) q(a.focus)?.focus();
      else if (a.wait && !fast) await sleep(a.wait);
      await nextFrame();
    }
    if (fast) await sleep(90);
  }
  async function settle(step) {
    // wait until the target exists and stops moving (the product's own animations), at most step.settle ms
    if (!step || typeof step.target !== 'string') return;
    const doc = frameDoc();
    if (!doc) return;
    const max = step.settle ?? 1000, t0 = performance.now();
    let last = '', same = 0;
    while (performance.now() - t0 < max) {
      const el = doc.querySelector(step.target);
      if (el) {
        const r = el.getBoundingClientRect();
        const key = [r.left, r.top, r.width, r.height].map(Math.round).join(',');
        if (r.width > 0 && key === last) { if (++same >= 3) return; } else { same = 0; last = key; }
      }
      await nextFrame();
    }
  }

  // ---------- navigation: one runner, latest request wins, actions never repeat ----------
  let want = 0, shown = -1, applied = -1, busy = false, forceReload = false, skipFirst = -1, live = false, picking = false, popTimer = 0, imgReady = false;
  function request(n, force) {
    if (!STEPS.length) return;
    n = clamp(n, 0, STEPS.length - 1);
    if (n === want && n === shown && !force) return;
    if (live) { live = false; stage.classList.remove('live'); dirty = true; }
    want = n;
    renderDots(n);
    if (n !== shown || force) { clearTimeout(popTimer); pop.classList.remove('on'); }
    pump();
  }
  async function freshTo(n) {
    const back = backOf();
    await loadInto(back);
    const doc = docOf(back);
    for (let k = 0; k <= n; k++) await act(STEPS[k], k < n, doc, 0);
    const old = active;
    active = back;
    back.classList.add('on');
    old.classList.remove('on');
    applied = n; dirty = false; skipFirst = -1;
    chromeFromProduct();
    if (picking) setPick(true, true);
  }
  async function pump() {
    if (busy) return;
    busy = true;
    try {
      for (let guard = 0; guard < 200; guard++) {
        const n = want;
        if (n === shown && !forceReload) break;
        if (P.image) {
          if (!imgReady) { await new Promise(res => { const img = $('#shot'); img.onload = img.onerror = () => res(); img.src = P.image; if (img.complete && img.naturalWidth) res(); }); imgReady = true; }
          applied = n;
        } else if (forceReload || dirty || applied < 0 || (n < applied && STEPS.slice(n + 1, applied + 1).some(hasDo))) {
          forceReload = false;
          await freshTo(n);
          if (want !== n) continue;
        } else if (n > applied) {
          for (let k = applied + 1; k <= n; k++) {
            const skip = skipFirst === k ? 1 : 0;
            if (skip) skipFirst = -1;
            await act(STEPS[k], k < n, frameDoc(), skip);
            applied = k;
            if (want < k) break;
          }
          if (want !== n) continue;
        } else {
          applied = n; // moving back over steps that change nothing
        }
        await settle(STEPS[n]);
        if (want !== n) continue;
        render(n);
        shown = n;
        if (want === n && !forceReload) break;
      }
    } finally {
      busy = false;
    }
    if (want !== shown || forceReload) pump();
  }
  function render(i) {
    const step = STEPS[i];
    const kind = kindOf(i);
    stage.dataset.kind = kind;
    renderDots(i);
    clearTimeout(popTimer);
    pop.classList.remove('on');
    history.replaceState(null, '', '#' + (i + 1));
    if (kind === 'title') {
      setCam(1, 0, 0); setSpot(null); setShield(null);
      const t = $('#title');
      fillText(t, '.eyebrow', step.eyebrow); fillText(t, 'h1', step.title); fillText(t, '.sub', step.body);
      if (step.dim != null) stage.style.setProperty('--title-dim', String(step.dim)); else stage.style.removeProperty('--title-dim');
      return;
    }
    if (kind === 'live') {
      setCam(1, 0, 0); setSpot(null); setShield(null);
      $('#livebar span').textContent = step.title || L.live;
      return;
    }
    const r = measure(step);
    if (!r) {
      setCam(1, 0, 0); setSpot(null); setShield(null); fillPop(step);
      placePop({ x: W / 2, y: H / 2, w: 0, h: 0 }, { placement: 'bottom' });
      pop.classList.add('on');
      return;
    }
    setCam(step.zoom || 1, r.x + r.w / 2, r.y + r.h / 2);
    const s = toStage(r);
    const pad = step.pad ?? 12;
    const hole = clip({ x: s.x - pad, y: s.y - pad, w: s.w + 2 * pad, h: s.h + 2 * pad }, viewRect);
    const radius = Math.min(r.radius * base * camState.z + pad, hole.h / 2, hole.w / 2);
    setSpot(hole, radius); setShield(hole);
    fillPop(step);
    popTimer = setTimeout(() => { placePop(hole, step); pop.classList.add('on'); }, Math.round(T * 0.4));
  }
  function setLive(on) {
    if (on === live) return;
    live = on;
    stage.classList.toggle('live', on);
    clearTimeout(popTimer);
    if (on) {
      $('#livebar span').textContent = L.liveOn;
      pop.classList.remove('on'); setShield(null); hud('');
      dirty = true;
    } else {
      $('#livebar span').textContent = STEPS[shown]?.title || L.live;
      forceReload = true;          // put the product back into this step's scripted state
      request(shown, true);
    }
  }
  function toggleHelp(force) { $('#help').classList.toggle('on', force); }
  function refocusDeck() {
    try { const d = frameDoc(); if (d && d.activeElement && d.activeElement.blur) d.activeElement.blur(); } catch (e) { /* ignore */ }
    window.focus();
  }

  // a click inside the spotlight: if the next step scripts the same click, the presenter's click is that
  // action, so move to the result step at once; any other change marks the product as off-script
  function onFrameClick(e, f) {
    if (f !== active || picking) return;
    if (live || kindOf(shown) === 'live' || shown !== want) { dirty = true; return; }
    const step = STEPS[shown], next = STEPS[shown + 1];
    const doc = docOf(f);
    const tgt = step && typeof step.target === 'string' ? doc.querySelector(step.target) : null;
    const onTarget = !!tgt && (tgt === e.target || tgt.contains(e.target));
    const first = next && next.do && next.do[0];
    const scriptedEl = first && first.click ? doc.querySelector(first.click) : null;
    const scripted = onTarget && scriptedEl && (scriptedEl === e.target || scriptedEl.contains(e.target)); // only a click on the scripted control itself
    if (scripted) {
      skipFirst = shown + 1;
      setTimeout(() => { refocusDeck(); request(shown + 1); }, 0);
    } else {
      dirty = true;
      if (onTarget) setTimeout(() => { refocusDeck(); setLive(true); }, 0);
      else setTimeout(refocusDeck, 0);
    }
  }

  // ---------- picking targets while authoring ----------
  let pickEl = null, drag = null, pickDoc = null;
  function selectorFor(el) {
    const esc = s => (window.CSS && CSS.escape ? CSS.escape(s) : s);
    if (el.id) return '#' + esc(el.id);
    const al = el.getAttribute('aria-label');
    if (al) return `${el.tagName.toLowerCase()}[aria-label="${al.replace(/"/g, '\\"')}"]`;
    const parts = [];
    for (let e = el; e && e.nodeType === 1 && e.tagName !== 'BODY'; e = e.parentElement) {
      if (e.id) { parts.unshift('#' + esc(e.id)); break; }
      let p = e.tagName.toLowerCase();
      const cls = [...e.classList].slice(0, 2);
      if (cls.length) p += '.' + cls.map(esc).join('.');
      const sib = e.parentElement ? [...e.parentElement.children].filter(x => x.tagName === e.tagName) : [];
      if (sib.length > 1) p += `:nth-of-type(${sib.indexOf(e) + 1})`;
      parts.unshift(p);
    }
    return parts.join(' > ');
  }
  const pickMove = e => {
    pickEl = e.target;
    const r = pickEl.getBoundingClientRect();
    const s = toStage({ x: r.left, y: r.top, w: r.width, h: r.height });
    Object.assign(pickring.style, { left: s.x + 'px', top: s.y + 'px', width: s.w + 'px', height: s.h + 'px' });
    hud(selectorFor(pickEl));
  };
  const pickClick = e => {
    e.preventDefault(); e.stopPropagation();
    const sel = selectorFor(pickEl || e.target);
    const text = `{ target: '${sel.replace(/'/g, "\\'")}' }`;
    navigator.clipboard?.writeText(text).catch(() => {});
    console.log('[demo deck]', text);
    hud(`${L.copied}: ${sel}`);
  };
  const toStageXY = e => ({ x: (e.clientX - offX) / fitS, y: (e.clientY - offY) / fitS });
  const toProduct = p => ({ x: (p.x - viewX - camState.tx) / (base * camState.z), y: (p.y - viewY - camState.ty) / (base * camState.z) });
  function setPick(on, quiet) {
    picking = on;
    stage.classList.toggle('picking', on);
    if (pickDoc) { pickDoc.removeEventListener('mousemove', pickMove, true); pickDoc.removeEventListener('click', pickClick, true); pickDoc = null; }
    const doc = frameDoc();
    if (on && doc) { doc.addEventListener('mousemove', pickMove, true); doc.addEventListener('click', pickClick, true); pickDoc = doc; }
    if (!quiet) hud(on ? (P.image ? L.pickImage : L.pick) : '');
  }
  stage.addEventListener('mousedown', e => { if (picking && P.image) { drag = toStageXY(e); e.preventDefault(); } });
  stage.addEventListener('mousemove', e => {
    if (!picking || !P.image || !drag) return;
    const p = toStageXY(e);
    Object.assign(pickring.style, { left: Math.min(p.x, drag.x) + 'px', top: Math.min(p.y, drag.y) + 'px', width: Math.abs(p.x - drag.x) + 'px', height: Math.abs(p.y - drag.y) + 'px' });
  });
  stage.addEventListener('mouseup', e => {
    if (!picking || !P.image || !drag) return;
    const a = toProduct(drag), b = toProduct(toStageXY(e));
    drag = null;
    const rect = [Math.round(Math.min(a.x, b.x)), Math.round(Math.min(a.y, b.y)), Math.round(Math.abs(b.x - a.x)), Math.round(Math.abs(b.y - a.y))];
    const text = `{ target: [${rect.join(', ')}] }`;
    navigator.clipboard?.writeText(text).catch(() => {});
    console.log('[demo deck]', text);
    hud(`${L.copied}: ${text}`);
  });

  // ---------- input ----------
  const NEXT = ['ArrowRight', 'ArrowDown', 'PageDown', ' '], PREV = ['ArrowLeft', 'ArrowUp', 'PageUp'];
  function onKey(e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key;
    if ($('#help').classList.contains('on')) { toggleHelp(false); e.preventDefault(); return; }
    if (live) { if (k === 'l' || k === 'L' || k === 'Escape') { e.preventDefault(); setLive(false); } return; }
    if (NEXT.includes(k)) { e.preventDefault(); request(want + 1); }
    else if (PREV.includes(k)) { e.preventDefault(); request(want - 1); }
    else if (k === 'Home') { e.preventDefault(); request(0); }
    else if (k === 'End') { e.preventDefault(); request(STEPS.length - 1); }
    else if (k === 'l' || k === 'L') { if (kindOf(shown) !== 'live') setLive(true); }
    else if (k === 'r' || k === 'R') { forceReload = true; request(want, true); hud(L.reset, 1600); }
    else if (k === 'f' || k === 'F') { document.fullscreenElement ? document.exitFullscreen() : root.requestFullscreen?.(); }
    else if (k === 'p' || k === 'P') setPick(!picking);
    else if (k === '?') toggleHelp(true);
  }
  function onFrameKey(e) {
    // keys pressed while the product has focus (any of the two frames)
    const t = e.target;
    const typing = !!(t && t.closest && t.closest('input, textarea, select, [contenteditable=""], [contenteditable="true"]'));
    if (live) { if (!typing && ['l', 'L', 'Escape'].includes(e.key)) { e.preventDefault(); e.stopPropagation(); setLive(false); } return; }
    if (kindOf(shown) === 'live') {
      if (!typing && ['ArrowRight', 'ArrowLeft', 'PageDown', 'PageUp'].includes(e.key)) { e.stopPropagation(); onKey(e); }
      return;
    }
    if (typing && e.key !== 'Escape') return;
    e.stopPropagation();
    onKey(e);
  }
  addEventListener('keydown', onKey);
  shield.addEventListener('click', () => { if (!picking && D.clickToAdvance !== false) request(want + 1); });
  addEventListener('hashchange', () => { const n = (parseInt(location.hash.slice(1), 10) || 1) - 1; if (n !== shown) request(n); });

  // ---------- start ----------
  (async () => {
    renderDots(0);
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
    want = clamp((parseInt(location.hash.slice(1), 10) || 1) - 1, 0, Math.max(0, STEPS.length - 1));
    renderDots(want);
    pump();
  })();
  window.deck = {
    go: n => request(n), next: () => request(want + 1), prev: () => request(want - 1),
    get index() { return shown; }, get wanted() { return want; }, get busy() { return busy; }, steps: STEPS,
    idle: async () => { while (busy || shown !== want) await sleep(30); await sleep(Math.round(T * 0.4) + 260); },
  };
})();
