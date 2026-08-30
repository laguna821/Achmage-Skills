/* render-qa-harness.js — render-audit 실행 하네스 (v3.5 → render-audit 1.0 이관)
 *
 * 정본 규칙: 20_Master-Skills/render-audit/references/render-qa.md
 * 소유: render-audit 스킬 (v3.6 분리 전에는 component-consulting-v3 Step 7.5,
 *       80_Build/scripts/render-qa-harness.js — 그 자리에는 포인터 스텁).
 * 계보: 실전 3호(educational-harness-engineering-web) `_work/rq-harness.js` 승격본.
 *
 * 사용 (프리뷰 콘솔 / javascript_tool):
 *   <script src=".../render-qa-harness.js"> 로드 후
 *   RQ1()          — 구조 검사 9항 (현재 폭·스킴)
 *   await RQ2()    — 픽셀 대비 실측 (현재 스킴)
 *   await RQ2ALL() — 대비, 라이트+다크
 *   await RQOBS()  — 씬 관측성·커버리지 회계 (현재 스킴)  [v3.5 신설]
 *   await RQOBSALL() — 관측성, 라이트+다크
 *
 * ⚠️ 페이지별 조정 의무 2가지 (조정했으면 기록한다):
 *   1. SCRIM 표 — 페이지의 .sc-* 스크림 구조 복제본. **CSS 를 수리하면 이
 *      표를 같이 고친다** (F39: 비동기 시 수리 후에도 같은 수치가 나와
 *      "수리가 안 먹혔다"로 오독된다). 장기 해법: 스크림 알파를 CSS 커스텀
 *      프로퍼티로 노출해 getComputedStyle 로 읽기.
 *   2. DECLARED_WIDTH_TOKENS — 프로젝트 폭 토큰 수 (G1).
 *
 * 원 부록(render-qa.md) 대비 이 구현이 고정한 결함 3가지:
 *   F36 — 섹션 선택자 'main > section' (중첩 <footer> 를 섹션으로 오인해
 *         거짓 위반 9건이 진짜 1건을 묻었던 실측).
 *   F38 — toRGBA(): modern `color(srgb 0.61 …)` 0–1 성분 지원. 구 정규식
 *         파서는 이를 0–255 로 읽어 8.2:1 을 1.67:1 로 보고했다 (그럴듯한
 *         거짓 FAIL — color-mix() 쓰는 모든 페이지에서 재발).
 *   F37 — RQ2 배경 스택: 불투명 배경을 만나면 정확 계산(solid), 반투명
 *         패널은 씬 픽셀 위에 합성(scene+panel). solid FAIL = 즉시 수리,
 *         scene FAIL = RQ3 육안 회부 — 이 분리가 수리 우선순위다.
 */
(function () {
  'use strict';

  var DECLARED_WIDTH_TOKENS = 3;

  /* 실전 3호 페이지 기준값 — 새 페이지에서는 그 페이지의 .sc-* 구조로 교체.
   * a = 그라디언트의 최소 알파(보호가 가장 약한 지점), op = 층1 이미지 opacity,
   * mul = 층2 가 mix-blend-mode:multiply 인가, blur = 층1 블러 px.
   * dark = 다크 스킴 override (I2.7 스킴 변주 — 라이트-밴드 기법은 다크에서
   * 층1/층2 가 재정의되므로 표도 스킴별이다. 없으면 스킴 불변 = 라이트 값). */
  var SCRIM = {
    'sc-cover': { c: [10, 14, 12], a: 0.55, op: 1.00, mul: 1 },
    'sc-tone':  { c: [38, 46, 41], a: 0.45, op: 1.00, mul: 1 },
    'sc-echo':  { c: [10, 14, 12], a: 0.60, op: 0.25, mul: 1 }
  };
  function isDarkScheme() {
    var t = document.documentElement.getAttribute('data-theme');
    if (t) return t === 'dark';
    return window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches;
  }
  function scrimOf(cls) {
    var S = SCRIM[cls];
    if (!S) return null;
    if (isDarkScheme() && S.dark) {
      var m = {};
      for (var k in S) if (k !== 'dark') m[k] = S[k];
      for (var d in S.dark) m[d] = S.dark[d];
      return m;
    }
    return S;
  }

  function lum(r, g, b) {
    var f = function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  }
  /* F38 — 레거시 rgb()/rgba() 와 modern color(srgb r g b / a) 모두 지원 */
  function toRGBA(s) {
    if (!s) return null;
    var m = s.match(/[\d.]+(?:e-?\d+)?/g);
    if (!m) return null;
    var isModern = /^color\(/.test(s.trim());
    var r = +m[0], g = +m[1], b = +m[2];
    var a = m.length > 3 ? +m[3] : 1;
    if (isModern) { r *= 255; g *= 255; b *= 255; }
    return { c: [r, g, b], a: a };
  }
  function parseRGB(s) { var q = toRGBA(s); return q ? q.c : [255, 255, 255]; }
  function bgRGB(el) {
    var e = el;
    while (e) {
      var q = toRGBA(getComputedStyle(e).backgroundColor);
      if (q && q.a > 0) return q.c;
      e = e.parentElement;
    }
    return [255, 255, 255];
  }
  /* F37 — 텍스트→섹션 배경 스택 */
  function bgStack(t, sec) {
    var e = t, stack = [], opaque = null;
    while (e && e !== sec) {
      var q = toRGBA(getComputedStyle(e).backgroundColor);
      if (q) {
        if (q.a >= 0.98) { opaque = q.c; break; }
        if (q.a > 0.01) stack.push({ c: q.c, a: q.a });
      }
      e = e.parentElement;
    }
    return { opaque: opaque, stack: stack.reverse() };
  }
  function compositeOver(baseRGB, stack) {
    var r = baseRGB[0], g = baseRGB[1], b = baseRGB[2];
    for (var i = 0; i < stack.length; i++) {
      var s = stack[i];
      r = s.a * s.c[0] + (1 - s.a) * r;
      g = s.a * s.c[1] + (1 - s.a) * g;
      b = s.a * s.c[2] + (1 - s.a) * b;
    }
    return [r, g, b];
  }
  /* F36 — 페이지 수준 섹션만. 중첩 <footer>/<section> 은 섹션이 아니다. */
  function sections() { return [].slice.call(document.querySelectorAll('main > section, main > header, main > footer')); }
  function freezeMotion() {
    var st = document.getElementById('qa-notrans') || document.createElement('style');
    st.id = 'qa-notrans';
    st.textContent = '*{transition:none!important;animation:none!important}';
    if (!st.parentNode) document.head.appendChild(st);
  }
  function loadImg(src) {
    return new Promise(function (res) {
      var i = new Image();
      i.onload = function () { res(i); };
      i.onerror = function () { res(null); };
      i.src = src;
    });
  }
  function sceneOf(sec) {
    var cl = [].slice.call(sec.classList);
    var cls = cl.find(function (c) { return SCRIM[c]; });
    if (!cls) return null;
    var band = cl.find(function (c) { return /^band--/.test(c); });
    return (band && SCRIM[cls + '@' + band]) ? cls + '@' + band : cls;
  }
  function rawPos(sec, mobile) {
    var st = sec.getAttribute('style') || '';
    var m = mobile && st.match(/--raw-pos-m:\s*([^;"]+)/) || st.match(/--raw-pos:\s*([^;"]+)/);
    var px = 0.5, py = 0.5;
    if (m) {
      var parts = m[1].trim().split(/\s+/);
      parts.forEach(function (v, idx) {
        var q = v.match(/^([\d.]+)%$/);
        if (q) { var f = +q[1] / 100; if (idx === 0 && parts.length > 1) px = f; else py = f; }
      });
    }
    return { px: px, py: py };
  }
  /* 씬 합성 캔버스 — RQ2 와 RQOBS 공용 (스크림은 스킴-해석된 값 — I2.7) */
  async function compositeScene(sec, cls, band, scale) {
    var S = scrimOf(cls);
    var m = (sec.getAttribute('style') || '').match(/--section-img:url\(([^)]+)\)/);
    var img = m ? await loadImg(m[1]) : null;
    if (!img) return null;
    var sb = sec.getBoundingClientRect();
    var W = Math.max(80, Math.round(sb.width * scale)), H = Math.max(80, Math.round(sb.height * scale));
    var cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    var x = cv.getContext('2d', { willReadFrequently: true });
    x.fillStyle = 'rgb(' + band.join(',') + ')'; x.fillRect(0, 0, W, H);
    var mobile = window.innerWidth <= 767;
    var p = rawPos(sec, mobile);
    var s2 = Math.max(W / img.width, H / img.height), dw = img.width * s2, dh = img.height * s2;
    x.globalAlpha = S.op;
    if (S.blur) x.filter = 'blur(' + Math.max(1, S.blur * scale) + 'px)';
    if (S.lum) x.globalCompositeOperation = 'luminosity';
    if (S.horizon) {
      var bh = Math.min(H, Math.round(Math.min(window.innerHeight * 0.42, 420) * scale));
      x.save(); x.beginPath(); x.rect(0, H - bh, W, bh); x.clip();
      x.drawImage(img, -(dw - W) * p.px, H - bh, dw, dh); x.restore();
    } else {
      x.drawImage(img, -(dw - W) * p.px, -(dh - H) * p.py, dw, dh);
    }
    x.filter = 'none'; x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
    if (S.mul) {
      x.globalCompositeOperation = 'multiply';
      x.fillStyle = 'rgba(' + S.c.join(',') + ',' + S.a + ')';
      x.fillRect(0, 0, W, H);
      x.globalCompositeOperation = 'source-over';
    } else {
      x.fillStyle = 'rgba(' + (S.c || band).join(',') + ',' + S.a + ')';
      x.fillRect(0, 0, W, H);
    }
    return { cv: cv, ctx: x, sb: sb, scale: scale };
  }

  var TEXT_SEL = 'h1,h2,h3,p,li,td,th,summary,dt,dd,footer,span.figure,span.unit';

  /* ============================== RQ1 — 구조 9항 ============================== */
  window.RQ1 = function () {
    freezeMotion();
    var V = [], secs = sections();
    var nav = [].slice.call(document.querySelectorAll('*')).find(function (e) {
      return getComputedStyle(e).position === 'fixed' && e.getBoundingClientRect().top < 80 &&
        e.offsetHeight > 20 && e.offsetHeight < 120;
    });
    var navBand = nav ? nav.getBoundingClientRect().bottom + 24 : 0;
    var textBlocks = function (s) {
      return [].slice.call(s.querySelectorAll('h1,h2,h3,h4,p,li,td,th,summary'))
        .filter(function (t) { return t.offsetHeight > 0 && t.textContent.trim().length > 2; });
    };
    // RQ1-1 blend 침범
    secs.filter(function (s) { return /raw5-blend|sc-blend/.test(s.className); }).forEach(function (s) {
      var left = /blend-left/.test(s.className), r = s.getBoundingClientRect();
      textBlocks(s).forEach(function (t) {
        var rg = document.createRange(); rg.selectNodeContents(t);
        var tb = rg.getBoundingClientRect().width ? rg.getBoundingClientRect() : t.getBoundingClientRect();
        var cx = (tb.left + tb.right) / 2;
        var inMask = left ? cx < r.left + r.width / 2 : cx > r.left + r.width / 2;
        if (inMask) V.push(['RQ1-1', s.id || s.className, t.tagName]);
      });
    });
    // RQ1-2 무-트리트먼트 층1 위 텍스트
    [].slice.call(document.querySelectorAll('[class*="crop-"],[class*="crop "],.crop')).forEach(function (c) {
      if (c.textContent.trim().length > 2) V.push(['RQ1-2', c.className, c.textContent.slice(0, 30)]);
    });
    // RQ1-3/4 부유 도형 safe-zone (전면 배경 레이어 ≥85% 제외)
    [].slice.call(document.querySelectorAll('[aria-hidden="true"]')).filter(function (d) {
      var p = getComputedStyle(d).position;
      if (!((p === 'absolute' || p === 'fixed') && d.offsetWidth > 60)) return false;
      var sec = d.closest('section'); if (!sec) return false;
      var db = d.getBoundingClientRect(), sb = sec.getBoundingClientRect();
      return (db.width * db.height) / Math.max(1, sb.width * sb.height) < 0.85;
    }).forEach(function (d) {
      var db = d.getBoundingClientRect(), sec = d.closest('section'), sb = sec.getBoundingClientRect();
      if (navBand && db.top - sb.top < navBand - sb.top + 0.5 && db.top - sb.top < 120)
        V.push(['RQ1-4', d.className, 'starts in nav band']);
      textBlocks(sec).forEach(function (t) {
        var tb = t.getBoundingClientRect();
        if (t.contains(d) || d.contains(t)) return;
        if (tb.left < db.right && tb.right > db.left && tb.top < db.bottom && tb.bottom > db.top)
          V.push(['RQ1-3', d.className, 'overlaps ' + t.tagName]);
      });
    });
    // RQ1-5 슬라이드 단위
    var svh = window.innerHeight;
    secs.forEach(function (s) {
      if (s.dataset.slideExempt !== undefined) return;
      if (s.offsetHeight < svh * 0.98)
        V.push(['RQ1-5', s.id, Math.round(s.offsetHeight) + '<' + Math.round(svh * 0.98)]);
    });
    // RQ1-6 밝기 3연속 (페이지-상대 정규화 — 두 스킴 각각 실행할 것)
    var lums = secs.map(function (s) { var c = bgRGB(s); return lum(c[0], c[1], c[2]); });
    var mn = Math.min.apply(null, lums), mx = Math.max.apply(null, lums), span = Math.max(1e-6, mx - mn);
    var bands = secs.map(function (s, i) {
      var t = (lums[i] - mn) / span;
      return { s: s.id, b: t < 1 / 3 ? 'D' : t < 2 / 3 ? 'M' : 'L' };
    });
    for (var i = 2; i < bands.length; i++)
      if (bands[i].b === bands[i - 1].b && bands[i].b === bands[i - 2].b)
        V.push(['RQ1-6', bands[i - 2].s + '>' + bands[i].s, bands[i].b + ' x3']);
    // RQ1-7 가로 스크롤
    var de = document.documentElement;
    if (de.scrollWidth > de.clientWidth) V.push(['RQ1-7', 'document', de.scrollWidth + '>' + de.clientWidth]);
    // RQ1-8 에지 정렬 + 충전 (G2/G3)
    var edges = [];
    secs.forEach(function (s) {
      var w = s.querySelector(':scope > .wrap') || [].slice.call(s.children).find(function(c){ return c.tagName==='DIV' && !c.hasAttribute('aria-hidden'); }); if (!w) return;
      var x = Math.round(w.getBoundingClientRect().left);
      if (!edges.some(function (e) { return Math.abs(e - x) <= 2; })) edges.push(x);
    });
    if (edges.length > DECLARED_WIDTH_TOKENS)
      V.push(['RQ1-8', 'edges', edges.length + '>' + DECLARED_WIDTH_TOKENS + ': ' + edges.join(',')]);
    [].slice.call(document.querySelectorAll('[class*="grid"],[class*="cmp"],[class*="steps"],[class*="row"]'))
      .filter(function (g) { return getComputedStyle(g).display === 'grid'; })
      .forEach(function (g) {
        var cs = getComputedStyle(g);
        var tr = cs.gridTemplateColumns.split(' ').filter(Boolean).map(parseFloat);
        if (tr.length < 2 || tr.some(isNaN)) return;
        var gap = parseFloat(cs.columnGap) || 0;
        var sum = tr.reduce(function (a, b) { return a + b; }, 0) + gap * (tr.length - 1);
        var fill = sum / g.getBoundingClientRect().width;
        if (fill < 0.96) V.push(['RQ1-8fill', g.className.split(' ')[0], 'fill ' + fill.toFixed(3)]);
      });
    // RQ1-9 리크롭 배선 (v3.5, F41) — 모바일 폭에서 선언 vs 계산값 대조.
    // "emit 은 검사하는데 바인딩은 검사 안 한다"의 3번째 재발(F19 역할 시트 ·
    // F20 비트 필드 · F41 리크롭)이 이 항목의 존재 이유다.
    var rposmDeclared = 0, rposmChecked = 0;
    var norm = function (v) {
      var t = v.replace(/center/g, '50%').replace(/top|left/g, '0%')
               .replace(/bottom|right/g, '100%').trim().split(/\s+/);
      if (t.length === 1) t.push('50%');
      return t.join(' ');
    };
    secs.forEach(function (s) {
      var st = s.getAttribute('style') || '';
      var m = st.match(/--raw-pos-m:\s*([^;"]+)/);
      if (!m) return;
      rposmDeclared++;
      if (window.innerWidth > 767) return;
      rposmChecked++;
      var got = getComputedStyle(s, '::before').backgroundPosition;
      if (norm(m[1]) !== norm(got))
        V.push(['RQ1-9', s.id, 'declared ' + m[1].trim() + ' vs computed ' + got]);
    });
    return {
      w: window.innerWidth, theme: document.documentElement.getAttribute('data-theme') || 'light',
      sections: secs.length, n: V.length, violations: V,
      brightness: bands.map(function (x) { return x.b; }).join(''), edges: edges,
      rposm: { declared: rposmDeclared, checked: rposmChecked,
               note: '선언 수를 처방문 씬 테이블과 수동 대조할 것' }
    };
  };

  /* ====================== RQ2 — 픽셀 대비 (텍스트 하한) ====================== */
  window.RQ2 = async function () {
    freezeMotion();
    var scene = [], solid = [], checked = 0;
    var secs = sections();
    for (var si = 0; si < secs.length; si++) {
      var sec = secs[si];
      var cls = sceneOf(sec);
      var band = bgRGB(sec); /* test4 adapt: ancestor walk (F55) */
      var comp = cls ? await compositeScene(sec, cls, band, 1) : null;
      var seen = {};
      var nodes = [].slice.call(sec.querySelectorAll(TEXT_SEL));
      for (var ni = 0; ni < nodes.length; ni++) {
        var t = nodes[ni];
        if (!t.offsetHeight || t.textContent.trim().length < 3) continue;
        var key = t.tagName + t.className + t.textContent.slice(0, 18);
        if (seen[key]) continue; seen[key] = 1;
        var cs2 = getComputedStyle(t), col = parseRGB(cs2.color);
        var fs = parseFloat(cs2.fontSize), fw = +cs2.fontWeight || 400;
        var large = fs >= 24 || (fs >= 18.66 && fw >= 700), floor = large ? 3 : 4.5;
        var tl = lum(col[0], col[1], col[2]);
        var tb = t.getBoundingClientRect();
        if (tb.width < 4 || tb.height < 4) continue;
        checked++;
        var bs = bgStack(t, sec), cr, mode;
        if (bs.opaque) {
          var oc = compositeOver(bs.opaque, bs.stack);
          var bl = lum(oc[0], oc[1], oc[2]);
          cr = (Math.max(tl, bl) + 0.05) / (Math.min(tl, bl) + 0.05); mode = 'solid';
        } else if (comp) {
          var x0 = Math.max(0, Math.round(tb.left - comp.sb.left)), y0 = Math.max(0, Math.round(tb.top - comp.sb.top));
          var w = Math.min(comp.cv.width - x0, Math.round(tb.width)), h = Math.min(comp.cv.height - y0, Math.round(tb.height));
          if (w < 3 || h < 3) continue;
          var d = comp.ctx.getImageData(x0, y0, w, h).data, worst = Infinity;
          for (var p = 0; p < d.length; p += 28) {
            var px2 = compositeOver([d[p], d[p + 1], d[p + 2]], bs.stack);
            var L = lum(px2[0], px2[1], px2[2]);
            var c2 = (Math.max(tl, L) + 0.05) / (Math.min(tl, L) + 0.05);
            if (c2 < worst) worst = c2;
          }
          cr = worst; mode = bs.stack.length ? 'scene+panel' : 'scene';
        } else {
          var bc = compositeOver(band, bs.stack);
          var bl2 = lum(bc[0], bc[1], bc[2]);
          cr = (Math.max(tl, bl2) + 0.05) / (Math.min(tl, bl2) + 0.05); mode = 'solid';
        }
        if (cr < floor - 1e-9) {
          var rec = {
            sec: sec.id, el: t.tagName + '.' + (t.className || '').split(' ')[0],
            txt: t.textContent.trim().slice(0, 26), cr: +cr.toFixed(2), floor: floor,
            sc: cls || '-', mode: mode
          };
          (mode === 'solid' ? solid : scene).push(rec);
        }
      }
    }
    var sortf = function (a) { return a.sort(function (x, y) { return x.cr - y.cr; }); };
    return {
      theme: document.documentElement.getAttribute('data-theme') || 'light',
      w: window.innerWidth, checked: checked,
      solidFails: solid.length, sceneFails: scene.length,
      solid: sortf(solid).slice(0, 8), scene: sortf(scene).slice(0, 8)
    };
  };
  window.RQ2ALL = async function () {
    var root = document.documentElement;
    root.setAttribute('data-theme', 'light');
    var L = await window.RQ2();
    root.setAttribute('data-theme', 'dark');
    var D = await window.RQ2();
    root.setAttribute('data-theme', 'light');
    return { light: L, dark: D };
  };

  /* ============== RQOBS — 씬 관측성·커버리지 회계 (v3.5, F42/F43/F45) ==============
   * RQ2 의 쌍대: RQ2 는 "글자가 읽히는가"(스크림을 올리게 당김), RQOBS 는
   * "이미지가 살았는가"(스크림을 내리게 당김). 실측: 이 검사가 없던 v3.4 에서
   * 수리 루프가 스크림 단조 상승으로 수렴해 luma 씬 2곳이 죽었고(84%), 다크
   * 스킴 실효 무텍스처가 9/15 까지 불었는데 아무 게이트도 안 울렸다.
   * 지표: 합성 결과의 휘도 표준편차 ×1000 (텍스처 에너지). 경험 임계 8
   * (실전 3호 1런 보정 — 재보정 허용, 조정 시 기록). */
  window.RQOBS = async function (opts) {
    freezeMotion();
    var TH = (opts && opts.threshold) || 8;
    var secs = sections(), table = [];
    for (var si = 0; si < secs.length; si++) {
      var sec = secs[si];
      var cls = sceneOf(sec);
      // 콘텐츠 이미지(인라인 <img>·crop 도형)가 큰 지면은 배경 무이미지라도
      // 시각적으로 비어 있지 않다 (실전 3호 case-a) — 회계에서 textured 취급.
      var contentImg = [].slice.call(sec.querySelectorAll('img,[class*="crop"]'))
        .some(function (el) {
          var r = el.getBoundingClientRect();
          return r.width * r.height > 10000 && el.offsetParent !== null;
        });
      if (!cls) {
        table.push({ id: sec.id, sc: '-', sd: 0, contentImg: contentImg });
        continue;
      }
      var band = bgRGB(sec); /* test4 adapt: ancestor walk (F55) */
      var comp = await compositeScene(sec, cls, band, 0.25);
      if (!comp) { table.push({ id: sec.id, sc: cls, sd: -1, contentImg: contentImg }); continue; }
      var d = comp.ctx.getImageData(0, 0, comp.cv.width, comp.cv.height).data;
      var n = 0, m1 = 0, m2 = 0;
      for (var i = 0; i < d.length; i += 16) {
        var L = lum(d[i], d[i + 1], d[i + 2]); n++; m1 += L; m2 += L * L;
      }
      var mean = m1 / n, sd = Math.sqrt(Math.max(0, m2 / n - mean * mean));
      table.push({ id: sec.id, sc: cls, sd: +(sd * 1000).toFixed(1), contentImg: contentImg });
    }
    // 회계 (F42): 저질감 = sd<TH 이고 콘텐츠 이미지도 없는 지면
    var low = table.filter(function (r) { return r.sd < TH && !r.contentImg; });
    var imageless = table.filter(function (r) { return r.sc === '-' && !r.contentImg; });
    // 질감 런 (F45): 저질감 3연속
    var runs = [], run = [];
    table.forEach(function (r) {
      if (r.sd < TH && !r.contentImg) { run.push(r.id); }
      else { if (run.length >= 3) runs.push(run.slice()); run = []; }
    });
    if (run.length >= 3) runs.push(run);
    return {
      theme: document.documentElement.getAttribute('data-theme') || 'light',
      threshold: TH, table: table,
      lowTexture: low.map(function (r) { return r.id; }),
      imageless: imageless.map(function (r) { return r.id; }),
      lowCount: low.length, total: table.length,
      textureRuns: runs,
      verdict: (runs.length === 0 && low.length <= Math.ceil(table.length / 3))
        ? 'PASS' : 'REVISE (저질감 ' + low.length + '/' + table.length +
          (runs.length ? ' · 3연속 런 ' + runs.length + '건' : '') + ')'
    };
  };
  window.RQOBSALL = async function (opts) {
    var root = document.documentElement;
    root.setAttribute('data-theme', 'light');
    var L = await window.RQOBS(opts);
    root.setAttribute('data-theme', 'dark');
    var D = await window.RQOBS(opts);
    root.setAttribute('data-theme', 'light');
    return { light: L, dark: D };
  };
})();


