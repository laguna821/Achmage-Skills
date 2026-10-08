import {createRequire as __coreCreateRequire} from "node:module"; const require=__coreCreateRequire(import.meta.url); import {extensionUrl as __extensionUrl,extensionPath as __extensionPath} from "./extensions.mjs";
import {
  disableOrtTelemetry
} from "./chunk-AN7BM5RT.mjs";
import {
  OCR_DET_MODEL,
  OCR_REC_DICT,
  OCR_REC_MODEL,
  ensureOcrModels,
  extractPageBlocksWithLines,
  getOcrModelsDir,
  parseCharacterDict
} from "./chunk-4KEIBFBR.mjs";
import {
  OPTIONAL_DEP_INSTALL_HINT
} from "./chunk-PZTNOUTU.mjs";

// node_modules/kordoc/dist/chunk-32ZUIHSY.js
import { readFile } from "fs/promises";
import { join } from "path";
var INK_LUMA_MAX = 205;
var MIN_LINE_LENGTH_PT = 20;
var MAX_LINE_WIDTH_PT = 2.5;
var GAP_TOL_PX = 2;
var BAND_OVERLAP_RATIO = 0.5;
var SURROUND_INK_RATIO = 0.35;
var DOT_MAX_GAP_PT = 1.3;
var DOT_MAX_DASH_PT = 4;
var DOT_MAX_PERIOD_PT = 2.2;
var DOT_MIN_COUNT = 8;
var DOT_TOUCH_PT = 1.5;
var FILL_DELTA = 10;
var FILL_MIN_LENGTH_PT = 10;
var FILL_MIN_DEPTH_PT = 4;
var FILL_FLAT_TOL = 12;
var FILL_FLAT_RATIO = 0.8;
function detectRulingLines(rgba, width, height, scale) {
  const minLenPx = Math.round(MIN_LINE_LENGTH_PT * scale);
  const maxThickPx = Math.max(1, Math.floor(MAX_LINE_WIDTH_PT * scale));
  const ink = new Uint8Array(width * height);
  const luma = new Uint8Array(width * height);
  for (let p = 0, i = 0; p < ink.length; p++, i += 4) {
    const l = rgba[i] * 77 + rgba[i + 1] * 150 + rgba[i + 2] * 29 >> 8;
    luma[p] = l;
    if (l <= INK_LUMA_MAX && rgba[i + 3] >= 128) ink[p] = 1;
  }
  const solid = (m, base, step, span) => solidRuns(m, base, step, span, minLenPx);
  const dot = {
    maxGap: Math.max(2, Math.round(DOT_MAX_GAP_PT * scale)),
    maxDash: Math.max(2, Math.round(DOT_MAX_DASH_PT * scale)),
    maxPeriod: DOT_MAX_PERIOD_PT * scale
  };
  const dotted = (m, base, step, span) => dottedRuns(m, base, step, span, minLenPx, dot.maxGap, dot.maxDash, dot.maxPeriod);
  const horizontals = detectBands(ink, width, height, maxThickPx, false, solid);
  const verticals = detectBands(ink, width, height, maxThickPx, true, solid);
  const dotH = detectBands(ink, width, height, maxThickPx, false, dotted);
  const dotV = detectBands(ink, width, height, maxThickPx, true, dotted);
  const tol = Math.max(2, Math.round(DOT_TOUCH_PT * scale));
  const allH = [...horizontals, ...dotH], allV = [...verticals, ...dotV];
  const touchesV = (a) => allV.some((p) => p.x1 >= a.x1 - tol && p.x1 <= a.x2 + tol && a.y1 >= p.y1 - tol && a.y1 <= p.y2 + tol);
  const touchesH = (a) => allH.some((p) => p.y1 >= a.y1 - tol && p.y1 <= a.y2 + tol && a.x1 >= p.x1 - tol && a.x1 <= p.x2 + tol);
  horizontals.push(...dotH.filter(touchesV));
  verticals.push(...dotV.filter(touchesH));
  const inkV = [...verticals];
  const ruleH = horizontals.filter((p) => inkV.some((v) => v.x1 >= p.x1 - tol && v.x1 <= p.x2 + tol && p.y1 >= v.y1 - tol && p.y1 <= v.y2 + tol));
  const fill = fillEdges(luma, width, height, scale);
  const fillH = fill.horizontals.filter((a) => ruleH.some((p) => Math.abs(p.x1 - a.x1) <= tol && Math.abs(p.x2 - a.x2) <= tol));
  horizontals.push(...fillH);
  const edgeH = [...ruleH, ...fillH];
  verticals.push(...fill.verticals.filter((a) => inkV.some((p) => Math.abs(p.x1 - a.x1) <= tol && p.y1 <= a.y2 + tol && p.y2 >= a.y1 - tol) || edgeH.some((p) => (Math.abs(p.x1 - a.x1) <= tol || Math.abs(p.x2 - a.x1) <= tol) && p.y1 >= a.y1 - tol && p.y1 <= a.y2 + tol)));
  const cellDividers = [];
  const frames = [];
  for (let i = 0; i < horizontals.length && frames.length < 32; i++) {
    const a = horizontals[i];
    for (let j = i + 1; j < horizontals.length && frames.length < 32; j++) {
      const b = horizontals[j];
      if (Math.abs(a.x1 - b.x1) > tol || Math.abs(a.x2 - b.x2) > tol) continue;
      const y1 = Math.min(a.y1, b.y1), y2 = Math.max(a.y1, b.y1);
      if (a.x2 - a.x1 < minLenPx * 3 || y2 - y1 < minLenPx * 2) continue;
      if (![a.x1, a.x2].every((x) => verticals.some((v) => Math.abs(v.x1 - x) <= tol && v.y1 <= y1 + tol && v.y2 >= y2 - tol))) continue;
      frames.push({ x1: a.x1, x2: a.x2, y1, y2 });
    }
  }
  if (frames.length) {
    const faint = new Uint8Array(ink.length);
    for (let p = 0; p < faint.length; p++) if (luma[p] <= 240 && rgba[p * 4 + 3] >= 128) faint[p] = 1;
    const hs = detectBands(faint, width, height, maxThickPx, false, solid);
    const vs = detectBands(faint, width, height, maxThickPx, true, solid);
    for (const f of frames) {
      const innerH = hs.filter((h) => h.y1 > f.y1 + tol && h.y1 < f.y2 - tol && Math.abs(h.x1 - f.x1) <= tol && Math.abs(h.x2 - f.x2) <= tol);
      const innerV = vs.filter((v) => v.x1 > f.x1 + tol && v.x1 < f.x2 - tol && Math.abs(v.y1 - f.y1) <= tol && Math.abs(v.y2 - f.y2) <= tol);
      if (innerH.length < 3 || innerV.length < 1) continue;
      for (const h of innerH) if (!horizontals.some((p) => Math.abs(p.y1 - h.y1) <= tol && p.x1 <= h.x1 + tol && p.x2 >= h.x2 - tol)) horizontals.push(h);
      for (const v of innerV) if (!verticals.some((p) => Math.abs(p.x1 - v.x1) <= tol && p.y1 <= v.y1 + tol && p.y2 >= v.y2 - tol)) {
        verticals.push(v);
        cellDividers.push(v);
      }
    }
  }
  return { horizontals, verticals, ...cellDividers.length ? { cellDividers } : {} };
}
function fillEdges(pageLuma, width, height, scale) {
  const k = Math.max(1, Math.round(scale));
  const w = Math.floor(width / k), h = Math.floor(height / k), n = w * h;
  const luma = new Uint8Array(n);
  const hist = new Uint32Array(256);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let mx = 0;
      for (let by = 0; by < k; by++) {
        let i = (y * k + by) * width + x * k;
        for (let bx = 0; bx < k; bx++, i++) if (pageLuma[i] > mx) mx = pageLuma[i];
      }
      luma[y * w + x] = mx;
      hist[mx]++;
    }
  }
  let bg = 255;
  for (let v = 0; v < 256; v++) if (hist[v] > hist[bg]) bg = v;
  const tint = new Uint8Array(n);
  for (let p = 0; p < n; p++) if (luma[p] < bg - FILL_DELTA) tint[p] = 1;
  const depth = Math.max(2, Math.round(FILL_MIN_DEPTH_PT * scale / k));
  const minLen = Math.round(FILL_MIN_LENGTH_PT * scale / k);
  const solid = (m, base, step, span) => solidRuns(m, base, step, span, minLen);
  const run = new Uint16Array(n);
  const mask = new Uint8Array(n);
  const out = { horizontals: [], verticals: [] };
  for (const [dx, dy] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
    const step = dy * w + dx;
    const ys = dy > 0 ? [h - 1, -1, -1] : [0, h, 1];
    const xs = dx > 0 ? [w - 1, -1, -1] : [0, w, 1];
    for (let y = ys[0]; y !== ys[1]; y += ys[2]) {
      for (let x = xs[0]; x !== xs[1]; x += xs[2]) {
        const p = y * w + x;
        const nx = x + dx, ny = y + dy;
        run[p] = tint[p] ? nx >= 0 && nx < w && ny >= 0 && ny < h ? Math.min(65535, run[p + step] + 1) : 1 : 0;
      }
    }
    mask.fill(0);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const p = y * w + x;
        if (run[p] < depth) continue;
        const ox = x - dx, oy = y - dy;
        if (ox < 0 || oy < 0 || ox >= w || oy >= h || !tint[p - step]) mask[p] = 1;
      }
    }
    const vertical = dx !== 0;
    const flat = (s) => {
      const d = depth >> 1;
      const vals = [];
      if (vertical) {
        const x = Math.round(s.x1) + dx * d;
        for (let y = Math.round(s.y1); y <= s.y2; y++) if (x >= 0 && x < w) vals.push(luma[y * w + x]);
      } else {
        const y = Math.round(s.y1) + dy * d;
        for (let x = Math.round(s.x1); x <= s.x2; x++) if (y >= 0 && y < h) vals.push(luma[y * w + x]);
      }
      if (!vals.length) return false;
      const med = [...vals].sort((a, b) => a - b)[vals.length >> 1];
      return vals.filter((v) => Math.abs(v - med) <= FILL_FLAT_TOL).length >= vals.length * FILL_FLAT_RATIO;
    };
    for (const s of detectBands(mask, w, h, 1, vertical, solid)) {
      if (!flat(s)) continue;
      const c = (v) => v * k + (k - 1) / 2;
      (vertical ? out.verticals : out.horizontals).push({ x1: c(s.x1), y1: c(s.y1), x2: c(s.x2), y2: c(s.y2), thicknessPx: 1 });
    }
  }
  return out;
}
function solidRuns(mask, base, step, span, minLenPx) {
  const runs = [];
  let runStart = -1;
  let gap = 0;
  for (let pos = 0; pos <= span; pos++) {
    const on = pos < span && mask[base + pos * step] === 1;
    if (on) {
      if (runStart < 0) runStart = pos;
      gap = 0;
    } else if (runStart >= 0) {
      if (++gap > GAP_TOL_PX || pos >= span) {
        const hi = pos - gap;
        if (hi - runStart + 1 >= minLenPx) runs.push({ lo: runStart, hi });
        runStart = -1;
        gap = 0;
      }
    }
  }
  return runs;
}
function dottedRuns(mask, base, step, span, minLenPx, maxGap, maxDash, maxPeriod) {
  const runs = [];
  const chain = [];
  const median2 = (xs) => xs.sort((a, b) => a - b)[xs.length >> 1];
  const flush = () => {
    const cnt = chain.length >> 1;
    if (cnt >= DOT_MIN_COUNT && chain[chain.length - 1] - chain[0] + 1 >= minLenPx) {
      const periods = [], dashes = [], gaps2 = [];
      for (let k = 0; k < cnt; k++) {
        dashes.push(chain[2 * k + 1] - chain[2 * k] + 1);
        if (k) {
          periods.push(chain[2 * k] - chain[2 * k - 2]);
          gaps2.push(chain[2 * k] - chain[2 * k - 1] - 1);
        }
      }
      if (median2(periods) <= maxPeriod || median2(dashes) >= 1.5 * median2(gaps2)) runs.push({ lo: chain[0], hi: chain[chain.length - 1] });
    }
    chain.length = 0;
  };
  let s = -1;
  for (let pos = 0; pos <= span; pos++) {
    const on = pos < span && mask[base + pos * step] === 1;
    if (on) {
      if (s < 0) s = pos;
      continue;
    }
    if (s < 0) continue;
    const lo = s, hi = pos - 1;
    s = -1;
    if (hi - lo + 1 > maxDash) {
      flush();
      continue;
    }
    if (chain.length && lo - chain[chain.length - 1] - 1 > maxGap) flush();
    chain.push(lo, hi);
  }
  flush();
  return runs;
}
function detectBands(ink, width, height, maxThickPx, transpose, readRuns) {
  const lines = transpose ? width : height;
  const span = transpose ? height : width;
  const step = transpose ? width : 1;
  const baseOf = (line) => transpose ? line : line * width;
  const out = [];
  let open = [];
  const surroundInkRatio = (b, side) => {
    if (side < 0 || side >= lines) return 0;
    let dark = 0, total = 0;
    const base = baseOf(side);
    for (let pos = b.lo; pos <= b.hi; pos += 3) {
      total++;
      if (ink[base + pos * step] === 1) dark++;
    }
    return total > 0 ? dark / total : 0;
  };
  const emit = (b) => {
    const thick = b.last - b.first + 1;
    if (thick > maxThickPx) return;
    if (surroundInkRatio(b, b.first - 2) >= SURROUND_INK_RATIO && surroundInkRatio(b, b.last + 2) >= SURROUND_INK_RATIO) return;
    const center = (b.first + b.last) / 2;
    out.push(
      transpose ? { x1: center, y1: b.lo, x2: center, y2: b.hi, thicknessPx: thick } : { x1: b.lo, y1: center, x2: b.hi, y2: center, thicknessPx: thick }
    );
  };
  for (let line = 0; line < lines; line++) {
    const runs = readRuns(ink, baseOf(line), step, span);
    const next = [];
    const used = /* @__PURE__ */ new Set();
    for (const band of open) {
      if (band.last !== line - 1) {
        emit(band);
        continue;
      }
      let merged = false;
      for (let r = 0; r < runs.length; r++) {
        if (used.has(r)) continue;
        const run = runs[r];
        const overlap = Math.min(band.hi, run.hi) - Math.max(band.lo, run.lo) + 1;
        const shorter = Math.min(band.hi - band.lo, run.hi - run.lo) + 1;
        if (overlap >= shorter * BAND_OVERLAP_RATIO) {
          band.lo = Math.min(band.lo, run.lo);
          band.hi = Math.max(band.hi, run.hi);
          band.last = line;
          next.push(band);
          used.add(r);
          merged = true;
          break;
        }
      }
      if (!merged) emit(band);
    }
    for (let r = 0; r < runs.length; r++) {
      if (!used.has(r)) next.push({ lo: runs[r].lo, hi: runs[r].hi, first: line, last: line });
    }
    open = next;
  }
  for (const band of open) emit(band);
  return out;
}
function rulingToPdfLines(ruling, scale, pdfHeight) {
  const horizontals = ruling.horizontals.map((s) => {
    const y = pdfHeight - (s.y1 + s.y2) / 2 / scale;
    return {
      x1: Math.min(s.x1, s.x2) / scale,
      y1: y,
      x2: Math.max(s.x1, s.x2) / scale,
      y2: y,
      lineWidth: s.thicknessPx / scale
    };
  });
  const verticals = ruling.verticals.map((s) => {
    const x = (s.x1 + s.x2) / 2 / scale;
    const yA = pdfHeight - Math.max(s.y1, s.y2) / scale;
    const yB = pdfHeight - Math.min(s.y1, s.y2) / scale;
    return { x1: x, y1: yA, x2: x, y2: yB, lineWidth: s.thicknessPx / scale };
  });
  return { horizontals, verticals };
}
function grayCrop(rgba, pageW, box) {
  const out = new Uint8Array(box.w * box.h);
  for (let y = 0; y < box.h; y++) {
    let si = ((box.y + y) * pageW + box.x) * 4;
    let di = y * box.w;
    for (let x = 0; x < box.w; x++, si += 4, di++) {
      out[di] = rgba[si] * 77 + rgba[si + 1] * 150 + rgba[si + 2] * 29 >> 8;
    }
  }
  return out;
}
function inkStats(gray) {
  const hist = new Uint32Array(256);
  for (let i = 0; i < gray.length; i++) hist[gray[i]]++;
  const total = gray.length;
  let sumAll = 0;
  for (let v = 0; v < 256; v++) sumAll += v * hist[v];
  let wB = 0, sumB = 0, best = -1, thr = 127;
  for (let t = 0; t < 256; t++) {
    wB += hist[t];
    if (wB === 0) continue;
    const wF = total - wB;
    if (wF === 0) break;
    sumB += t * hist[t];
    const mB = sumB / wB;
    const mF = (sumAll - sumB) / wF;
    const between = wB * wF * (mB - mF) * (mB - mF);
    if (between > best) {
      best = between;
      thr = t;
    }
  }
  let nDark = 0, sDark = 0;
  for (let v = 0; v <= thr; v++) {
    nDark += hist[v];
    sDark += v * hist[v];
  }
  const nLight = total - nDark;
  const sLight = sumAll - sDark;
  if (nDark === 0 || nLight === 0) return { threshold: thr, darkInk: true, contrast: 0, inkRatio: 0 };
  const darkInk = nDark <= nLight;
  return {
    threshold: thr,
    darkInk,
    contrast: sLight / nLight - sDark / nDark,
    inkRatio: (darkInk ? nDark : nLight) / total
  };
}
function splitRowBands(gray, w, h, ink, minBandRatio) {
  const isInk = (v) => ink.darkInk ? v <= ink.threshold : v > ink.threshold;
  const colInk = new Uint32Array(w);
  for (let y = 0; y < h; y++) {
    const off = y * w;
    for (let x = 0; x < w; x++) if (isInk(gray[off + x])) colInk[x]++;
  }
  const ruleCol = new Uint8Array(w);
  let liveW = 0;
  for (let x = 0; x < w; x++) {
    if (colInk[x] >= h * 0.85) ruleCol[x] = 1;
    else liveW++;
  }
  const rowInk = new Uint32Array(h);
  for (let y = 0; y < h; y++) {
    let n = 0;
    const off = y * w;
    for (let x = 0; x < w; x++) if (!ruleCol[x] && isInk(gray[off + x])) n++;
    rowInk[y] = n >= liveW * 0.85 ? 0 : n;
  }
  const blank = Math.max(1, Math.floor(w * 0.02));
  let bands = [];
  let start = -1;
  for (let y = 0; y <= h; y++) {
    const on = y < h && rowInk[y] > blank;
    if (on && start < 0) start = y;
    else if (!on && start >= 0) {
      bands.push([start, y]);
      start = -1;
    }
  }
  const inkCols = (y0, y1) => {
    let x0 = w, x1 = -1;
    for (let y = y0; y < y1; y++) {
      const off = y * w;
      for (let x = 0; x < w; x++) if (!ruleCol[x] && isInk(gray[off + x])) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
      }
    }
    return x1 >= x0 ? [x0, x1 + 1] : [0, w];
  };
  if (bands.length <= 1) return [{ y0: bands[0]?.[0] ?? 0, y1: bands[0]?.[1] ?? h, x0: 0, x1: w }];
  const widths = bands.map(([y0, y1]) => {
    const [a, b] = inkCols(y0, y1);
    return b - a;
  }).sort((a, b) => a - b);
  const charSize = widths[widths.length >> 1];
  const minBand = Math.max(3, minBandRatio * charSize);
  for (let i = 0; i + 1 < bands.length; ) {
    const gap = bands[i + 1][0] - bands[i][1];
    if (gap <= Math.max(2, charSize * 0.15) && bands[i + 1][1] - bands[i][0] <= charSize * 1.3) {
      bands.splice(i, 2, [bands[i][0], bands[i + 1][1]]);
    } else i++;
  }
  while (bands.length > 1 && bands[0][0] <= 1 && bands[0][1] - bands[0][0] < minBand) bands.shift();
  while (bands.length > 1 && bands[bands.length - 1][1] >= h - 1 && bands[bands.length - 1][1] - bands[bands.length - 1][0] < minBand) bands.pop();
  for (; ; ) {
    let idx = -1, minH = Infinity;
    for (let i = 0; i < bands.length; i++) {
      const bh = bands[i][1] - bands[i][0];
      if (bh < minBand && bh < minH) {
        minH = bh;
        idx = i;
      }
    }
    if (idx < 0 || bands.length === 1) break;
    const gapPrev = idx > 0 ? bands[idx][0] - bands[idx - 1][1] : Infinity;
    const gapNext = idx < bands.length - 1 ? bands[idx + 1][0] - bands[idx][1] : Infinity;
    const j = gapPrev <= gapNext ? idx - 1 : idx + 1;
    const a = Math.min(idx, j), b = Math.max(idx, j);
    bands = [...bands.slice(0, a), [bands[a][0], bands[b][1]], ...bands.slice(b + 1)];
  }
  if (bands.length === 1) return [{ y0: bands[0][0], y1: bands[0][1], x0: 0, x1: w }];
  return bands.map(([y0, y1]) => {
    const [x0, x1] = inkCols(y0, y1);
    return { y0, y1, x0, x1 };
  });
}
function components(gray, w, h, ink) {
  const isInk = (v) => ink.darkInk ? v <= ink.threshold : v > ink.threshold;
  const comps = [];
  const label = new Int32Array(w * h);
  const stack = [];
  for (let p0 = 0; p0 < w * h; p0++) {
    if (label[p0] || !isInk(gray[p0])) continue;
    const c = { x0: w, x1: 0, y0: h, y1: 0, id: comps.length + 1 };
    label[p0] = c.id;
    stack.push(p0);
    while (stack.length) {
      const p = stack.pop();
      const x = p % w, y = p / w | 0;
      if (x < c.x0) c.x0 = x;
      if (x + 1 > c.x1) c.x1 = x + 1;
      if (y < c.y0) c.y0 = y;
      if (y + 1 > c.y1) c.y1 = y + 1;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
        const q = ny * w + nx;
        if (!label[q] && isInk(gray[q])) {
          label[q] = c.id;
          stack.push(q);
        }
      }
    }
    if (c.y1 - c.y0 < h * 0.85 && c.x1 - c.x0 < w * 0.85) comps.push(c);
  }
  return { comps, label };
}
function leadingTriangle(gray, w, h, ink) {
  const { comps, label } = components(gray, w, h, ink);
  let charH = 0;
  for (const c of comps) charH = Math.max(charH, c.y1 - c.y0);
  const first = comps.filter((c) => c.y1 - c.y0 >= charH * 0.4).sort((a, b) => a.x0 - b.x0)[0];
  if (!first || charH < 8) return null;
  const cw = first.x1 - first.x0, ch = first.y1 - first.y0;
  if (cw < ch * 0.8 || cw > ch * 1.8) return null;
  const rowSpan = (y) => {
    let n = 0, lo = -1, hi = -1, runs = 0, prev = false;
    for (let x = first.x0; x < first.x1; x++) {
      const on = label[y * w + x] === first.id;
      if (on) {
        n++;
        if (lo < 0) lo = x - first.x0;
        hi = x - first.x0;
        if (!prev) runs++;
      }
      prev = on;
    }
    return { n, lo, hi, runs };
  };
  const base = Math.max(rowSpan(first.y1 - 1).n, rowSpan(first.y1 - 2).n);
  if (base < cw * 0.7) return null;
  for (let y = first.y0; y < first.y0 + Math.max(1, Math.round(ch * 0.2)); y++) {
    const r = rowSpan(y);
    if (r.n === 0) continue;
    if (r.hi - r.lo + 1 > cw * 0.4 || (r.lo + r.hi) / 2 < cw * 0.25 || (r.lo + r.hi) / 2 > cw * 0.75) return null;
  }
  const mid = rowSpan(first.y0 + Math.round(ch * 0.6));
  if (mid.lo < 0 || mid.lo > cw * 0.3 || mid.hi < cw * 0.7) return null;
  return mid.runs >= 2 ? "\u25B3" : "\u25B2";
}
function leaderRuns(gray, w, h, ink, minDots) {
  const comps = components(gray, w, h, ink).comps.sort((a, b) => a.x0 - b.x0);
  const blobs = [];
  for (const c of comps) {
    const last = blobs[blobs.length - 1];
    if (last && c.x0 < last.x1) {
      last.x1 = Math.max(last.x1, c.x1);
      last.y0 = Math.min(last.y0, c.y0);
      last.y1 = Math.max(last.y1, c.y1);
    } else blobs.push({ x0: c.x0, x1: c.x1, y0: c.y0, y1: c.y1 });
  }
  let charH = 0;
  for (const b of blobs) charH = Math.max(charH, b.y1 - b.y0);
  if (charH < 8) return [];
  const small = (c) => c.x1 - c.x0 <= charH * 0.3 && c.y1 - c.y0 <= charH * 0.3;
  let bandTop = h, bandBot = 0;
  for (const c of comps) if (!small(c)) {
    bandTop = Math.min(bandTop, c.y0);
    bandBot = Math.max(bandBot, c.y1);
  }
  const cy = (c) => (c.y0 + c.y1) / 2;
  const isDot = (b) => small(b) && cy(b) >= bandTop && cy(b) <= bandBot;
  const runs = [];
  for (let i = 0; i < blobs.length; ) {
    if (!isDot(blobs[i])) {
      i++;
      continue;
    }
    let j = i;
    while (j + 1 < blobs.length && isDot(blobs[j + 1]) && blobs[j + 1].x0 - blobs[j].x1 <= charH && Math.abs(cy(blobs[j + 1]) - cy(blobs[i])) <= charH * 0.2) j++;
    const x0 = blobs[i].x0, x1 = blobs[j].x1, y = cy(blobs[i]);
    const onLine = comps.some((c) => !small(c) && c.y0 <= y && c.y1 >= y && (c.x1 <= x0 + 2 && c.x1 >= x0 - 2 * charH || c.x0 >= x1 - 2 && c.x0 <= x1 + 2 * charH));
    const run = blobs.slice(i, j + 1).filter((b) => b.x0 > 0 && b.x1 < w);
    const spread = (xs) => {
      const v = [...xs].sort((a, b) => a - b).slice(xs.length >= 5 ? 1 : 0, xs.length >= 5 ? -1 : void 0);
      return v[v.length - 1] / Math.max(1, v[0]);
    };
    const even = run.length >= 2 && spread(run.map((b) => b.x1 - b.x0)) <= 2.5 && spread(run.map((b) => b.y1 - b.y0)) <= 2.5 && spread(run.slice(1).map((b, k) => b.x0 - run[k].x0)) <= 1.8;
    if (j - i + 1 >= minDots && onLine && even) runs.push([x0, x1]);
    i = j + 1;
  }
  return runs;
}
function inkBounds(gray, w, h, ink) {
  const isInk = (v) => ink.darkInk ? v <= ink.threshold : v > ink.threshold;
  const colInk = new Uint32Array(w);
  const rowInk = new Uint32Array(h);
  for (let y = 0; y < h; y++) {
    const off = y * w;
    for (let x = 0; x < w; x++) if (isInk(gray[off + x])) {
      colInk[x]++;
      rowInk[y]++;
    }
  }
  const ruleCol = new Uint8Array(w), ruleRow = new Uint8Array(h);
  for (let x = 0; x < w; x++) if (colInk[x] >= h * 0.85) ruleCol[x] = 1;
  for (let y = 0; y < h; y++) if (rowInk[y] >= w * 0.85) ruleRow[y] = 1;
  let x0 = w, x1 = -1, y0 = h, y1 = -1;
  for (let y = 0; y < h; y++) {
    if (ruleRow[y]) continue;
    const off = y * w;
    for (let x = 0; x < w; x++) {
      if (ruleCol[x] || !isInk(gray[off + x])) continue;
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }
  }
  if (x1 < x0 || y1 < y0) return { x0: 0, y0: 0, x1: w, y1: h };
  return { x0, y0, x1: x1 + 1, y1: y1 + 1 };
}
function bracketFeatures(gray, w, h, ink, cx) {
  const { comps, label } = components(gray, w, h, ink);
  let charH = 0;
  for (const c of comps) charH = Math.max(charH, c.y1 - c.y0);
  if (charH < 8) return null;
  const tol = Math.max(2, charH * 0.3);
  let best = null, bestD = Infinity;
  for (const c of comps) {
    if (c.y1 - c.y0 < charH * 0.3 || c.x1 < cx - tol || c.x0 > cx + tol) continue;
    const d = Math.abs((c.x0 + c.x1) / 2 - cx);
    if (d < bestD) {
      bestD = d;
      best = c;
    }
  }
  if (!best) return null;
  const b = best;
  const cw = b.x1 - b.x0, ch = b.y1 - b.y0;
  if (cw < 3 || ch < 8) return null;
  const spans = [];
  for (let y = b.y0; y < b.y1; y++) {
    let n = 0;
    for (let x = b.x0; x < b.x1; x++) if (label[y * w + x] === b.id) n++;
    spans.push(n);
  }
  const band = Math.max(1, Math.round(ch * 0.15));
  const top = Math.max(...spans.slice(0, band)) / cw, bottom = Math.max(...spans.slice(ch - band)) / cw;
  const midRows = spans.slice(Math.floor(ch * 0.3), Math.ceil(ch * 0.7)).sort((p, q) => p - q);
  const stroke = midRows[midRows.length >> 1] ?? 0;
  const taper = spans.filter((n) => n > stroke && n < cw).length / ch;
  const fill = spans.reduce((a, n) => a + n, 0) / (cw * ch);
  return { top, bottom, taper, fill, cw, ch, charH };
}
function romanStems(gray, w, h, ink, prevX, nextX) {
  const { comps, label } = components(gray, w, h, ink);
  let charH = 0;
  for (const c of comps) charH = Math.max(charH, c.y1 - c.y0);
  if (charH < 10) return null;
  const x0 = prevX + charH * 0.35, x1 = nextX - charH * 0.35;
  const sel = comps.filter((c) => c.y1 - c.y0 >= charH * 0.6 && (c.x0 + c.x1) / 2 >= x0 && (c.x0 + c.x1) / 2 < x1);
  if (!sel.length) return null;
  const ids = new Set(sel.map((c) => c.id));
  const ux0 = Math.min(...sel.map((c) => c.x0)), ux1 = Math.max(...sel.map((c) => c.x1));
  const uy0 = Math.min(...sel.map((c) => c.y0)), uy1 = Math.max(...sel.map((c) => c.y1));
  const uh = uy1 - uy0;
  const counts = /* @__PURE__ */ new Map();
  let rows = 0;
  for (let y = uy0 + Math.floor(uh * 0.25); y < uy1 - Math.floor(uh * 0.25); y++) {
    let runs = 0, len = 0, thick = false;
    for (let x = ux0; x <= ux1; x++) {
      const on = x < ux1 && ids.has(label[y * w + x]);
      if (on) len++;
      else if (len) {
        runs++;
        if (len > uh * 0.35) thick = true;
        len = 0;
      }
    }
    rows++;
    if (!thick) counts.set(runs, (counts.get(runs) ?? 0) + 1);
  }
  const [n, k] = [...counts].sort((a, b) => b[1] - a[1])[0] ?? [0, 0];
  return n >= 1 && n <= 3 && k >= rows * 0.7 ? n : null;
}
function circledAt(gray, w, h, ink, xs) {
  const { comps } = components(gray, w, h, ink);
  let charH = 0;
  for (const c of comps) charH = Math.max(charH, c.y1 - c.y0);
  const rings = charH < 10 ? [] : comps.filter((r) => {
    const rw = r.x1 - r.x0, rh = r.y1 - r.y0;
    return rh >= charH * 0.55 && rw >= rh * 0.8 && rw <= rh * 1.25 && comps.some((d) => d !== r && d.x0 > r.x0 && d.x1 < r.x1 && d.y0 > r.y0 && d.y1 < r.y1 && d.y1 - d.y0 >= rh * 0.35);
  });
  return xs.map((x) => rings.some((r) => x >= r.x0 && x <= r.x1));
}
function quoteHead(gray, w, h, ink, cx) {
  const { comps, label } = components(gray, w, h, ink);
  let charH = 0;
  for (const c of comps) charH = Math.max(charH, c.y1 - c.y0);
  if (charH < 10) return null;
  const tall = comps.filter((c) => c.y1 - c.y0 >= charH * 0.6);
  if (!tall.length) return null;
  const mid = (Math.min(...tall.map((c) => c.y0)) + Math.max(...tall.map((c) => c.y1))) / 2;
  let best = null, bestD = charH * 0.4;
  for (const c of comps) {
    const ch = c.y1 - c.y0, d = Math.abs((c.x0 + c.x1) / 2 - cx);
    if (ch < charH * 0.12 || ch > charH * 0.5 || (c.y0 + c.y1) / 2 > mid || d > bestD) continue;
    bestD = d;
    best = c;
  }
  if (!best) return null;
  let n = 0, sy = 0;
  for (let y = best.y0; y < best.y1; y++) for (let x = best.x0; x < best.x1; x++) if (label[y * w + x] === best.id) {
    n++;
    sy += y;
  }
  return n ? (sy / n - best.y0) / (best.y1 - best.y0) : null;
}
function edgeTrim(gray, w, h, ink) {
  const isInk = (v) => ink.darkInk ? v <= ink.threshold : v > ink.threshold;
  const colInk = new Uint32Array(w);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (isInk(gray[y * w + x])) colInk[x]++;
  const ruleCol = new Uint8Array(w);
  let liveW = 0;
  for (let x = 0; x < w; x++) {
    if (colInk[x] >= h * 0.85) ruleCol[x] = 1;
    else liveW++;
  }
  const blank = Math.max(1, Math.floor(w * 0.02));
  const bands = [];
  let start = -1;
  for (let y = 0; y <= h; y++) {
    let n = 0;
    if (y < h) {
      for (let x = 0; x < w; x++) if (!ruleCol[x] && isInk(gray[y * w + x])) n++;
    }
    const on = y < h && n > blank && n < liveW * 0.85;
    if (on && start < 0) start = y;
    else if (!on && start >= 0) {
      bands.push([start, y]);
      start = -1;
    }
  }
  let y0 = 0, y1 = h;
  if (bands.length >= 2 && h >= 24) {
    const mh = Math.max(...bands.map(([a, b]) => b - a));
    const [top, next] = [bands[0], bands[1]], [bot, prev] = [bands[bands.length - 1], bands[bands.length - 2]];
    if (top[0] <= 1 && top[1] - top[0] < mh * 0.45) y0 = top[1] + next[0] >> 1;
    if (bot[1] >= h - 1 && bot[1] - bot[0] < mh * 0.45) y1 = bot[0] + prev[1] + 1 >> 1;
    if (y0 > 0 || y1 < h) {
      let runs = 0, len = 0;
      for (let x = 0; x <= w; x++) {
        let on = false;
        if (x < w && !ruleCol[x]) for (let y = y0; y < y1 && !on; y++) on = isInk(gray[y * w + x]);
        if (on) len++;
        else {
          if (len >= (y1 - y0) * 0.3) runs++;
          len = 0;
        }
      }
      if (runs < 2) {
        y0 = 0;
        y1 = h;
      }
    }
  }
  const textCol = (x) => {
    for (let y = y0; y < y1; y++) if (isInk(gray[y * w + x])) return true;
    return false;
  };
  const border = (x) => colInk[x] >= h * 0.95;
  const gap = Math.max(2, Math.round(h * 0.1));
  const clearFrom = (x, dir) => {
    for (let k = 0; k < gap; k++) {
      const c = x + dir * k;
      if (c < 0 || c >= w || textCol(c)) return false;
    }
    return true;
  };
  let x0 = 0, x1 = w;
  for (let x = 0; x < w * 0.2; x++) {
    if (border(x)) {
      let e = x;
      while (e + 1 < w && border(e + 1)) e++;
      if (clearFrom(e + 1, 1)) x0 = e + 1;
      break;
    }
    if (textCol(x)) break;
  }
  for (let x = w - 1; x >= w * 0.8; x--) {
    if (border(x)) {
      let e = x;
      while (e - 1 >= 0 && border(e - 1)) e--;
      if (clearFrom(e - 1, -1)) x1 = e;
      break;
    }
    if (textCol(x)) break;
  }
  return y0 > 0 || y1 < h || x0 > 0 || x1 < w ? { x0, x1, y0, y1 } : null;
}
function tallInkCount(gray, w, h, ink) {
  const { comps } = components(gray, w, h, ink);
  let charH = 0;
  for (const c of comps) charH = Math.max(charH, c.y1 - c.y0);
  const tall = comps.filter((c) => c.y1 - c.y0 >= charH * 0.5).sort((a, b) => a.x0 - b.x0);
  let n = 0, end = -1;
  for (const c of tall) {
    if (c.x0 >= end) n++;
    end = Math.max(end, c.x1);
  }
  return n;
}
function gapGlyphs(gray, w, h, ink) {
  const { comps, label } = components(gray, w, h, ink);
  let charH = 0;
  for (const c of comps) charH = Math.max(charH, c.y1 - c.y0);
  if (charH < 10) return { glyphs: [], bandH: 0 };
  const tall = comps.filter((c) => c.y1 - c.y0 >= charH * 0.6);
  const bandT = Math.min(...tall.map((c) => c.y0)), bandB = Math.max(...tall.map((c) => c.y1)), bh = bandB - bandT;
  const inBand = (c) => c.y1 > bandT && c.y0 < bandB;
  const out = [];
  for (const c of comps) {
    if (!inBand(c)) continue;
    const cw = c.x1 - c.x0, ch = c.y1 - c.y0;
    if (ch >= bh * 0.9 && cw <= bh * 0.15) continue;
    const others = comps.filter((o) => o !== c && inBand(o) && !(o.x0 >= c.x0 && o.x1 <= c.x1 && o.y0 >= c.y0 && o.y1 <= c.y1));
    const apart = !others.some((o) => o.x0 < c.x1 + 1 && o.x1 > c.x0 - 1);
    const nearlyApart = !others.some((o) => Math.min(o.x1, c.x1) - Math.max(o.x0, c.x0) > 2);
    const spans = [], runs = [];
    let n = 0;
    for (let y = c.y0; y < c.y1; y++) {
      let s = 0, r = 0, prev = false;
      for (let x = c.x0; x < c.x1; x++) {
        const on = label[y * w + x] === c.id;
        if (on) {
          s++;
          if (!prev) r++;
        }
        prev = on;
      }
      spans.push(s);
      runs.push(r);
      n += s;
    }
    const fill = n / (cw * ch), cy = ((c.y0 + c.y1) / 2 - bandT) / bh;
    const band = Math.max(1, Math.round(ch * 0.15));
    const top = Math.max(...spans.slice(0, band)) / cw, bottom = Math.max(...spans.slice(ch - band)) / cw;
    let mark = null;
    const speck = Math.max(3, bh * 0.08);
    const dot = ch <= bh * 0.25 && cw <= bh * 0.25 && ch >= speck && cw >= speck && cw >= ch * 0.6 && cw <= ch * 1.6;
    const small = ch <= bh * 0.25 && cw <= bh * 0.25 && ch >= 2 && cw >= 2 && cw >= ch * 0.6 && cw <= ch * 1.6 && fill >= 0.6 && cy >= 0.3 && cy <= 0.7;
    if (!apart && !(nearlyApart && ch >= bh * 0.6)) {
      if (small) out.push({ x0: c.x0, x1: c.x1, mark: "\xB7" });
      continue;
    }
    if (!apart) {
    } else if (dot && fill >= 0.6 && cy >= 0.3 && cy <= 0.7) mark = "\xB7";
    else if (small) mark = "\xB7";
    else if (dot && fill >= 0.6 && cy >= 0.75 && cw >= ch * 0.8) mark = ".";
    else if (ch <= bh * 0.4 && ch >= speck && cw >= ch * 0.75 && cw <= ch * 1.3 && fill < 0.6 && runs[ch >> 1] === 2 && cy >= 0.6) mark = "\u3002";
    else if (ch <= bh * 0.15 && cw >= ch * 2 && cw <= bh * 0.8 && fill >= 0.7 && cy >= 0.35 && cy <= 0.75) mark = "-";
    else if (ch >= bh * 0.5 && cw >= ch * 0.9 && cw <= ch * 1.4 && fill >= 0.4 && runs.every((r) => r <= 1) && top <= 0.4 && bottom >= 0.8) mark = "\u25B2";
    else if (ch >= bh * 0.3 && ch <= bh * 0.65 && fill < 0.5) {
      const stem = (from, to) => {
        let sx = 0, k = 0;
        for (let y = from; y < to; y++) for (let x = c.x0; x < c.x1; x++) if (label[y * w + x] === c.id) {
          sx += x - c.x0;
          k++;
        }
        return k ? sx / k / cw : 0.5;
      };
      if (c.y0 <= bandT + bh * 0.15 && top >= 0.7 && bottom <= 0.5 && stem(c.y0 + band, c.y1) <= 0.35) mark = "\u300C";
      else if (c.y1 >= bandB - bh * 0.15 && bottom >= 0.7 && top <= 0.5 && stem(c.y0, c.y1 - band) >= 0.65) mark = "\u300D";
    } else if (ch >= charH * 0.6 && cw >= ch * 0.8 && cw <= ch * 1.25 && fill < 0.5 && top >= 0.8 && bottom >= 0.8 && runs[ch >> 1] === 2) mark = ch <= charH * 0.92 ? "\u25A1" : "\u25A1\0";
    if (!mark && ch >= bh * 0.6 && cw >= ch * 0.25 && cw <= ch * 0.7 && fill <= 0.4 && runs.every((r) => r <= 1)) {
      const mx = (y) => {
        let sx = 0, k = 0;
        for (let x = c.x0; x < c.x1; x++) if (label[y * w + x] === c.id) {
          sx += x;
          k++;
        }
        return k ? sx / k : NaN;
      };
      if (mx(c.y0 + band) - mx(c.y1 - 1 - band) >= cw * 0.5) mark = "/";
    }
    if (mark) out.push({ x0: c.x0, x1: c.x1, mark });
  }
  return { glyphs: out, bandH: bh };
}
function ringBullet(gray, w, h, ink, cx) {
  const { comps, label } = components(gray, w, h, ink);
  let charH = 0;
  for (const c2 of comps) charH = Math.max(charH, c2.y1 - c2.y0);
  if (charH < 10) return null;
  const tall = comps.filter((c2) => c2.y1 - c2.y0 >= charH * 0.6);
  const bandT = Math.min(...tall.map((c2) => c2.y0)), bh = Math.max(...tall.map((c2) => c2.y1)) - bandT;
  let best = null, bestD = bh * 0.6;
  for (const c2 of comps) {
    const d = Math.abs((c2.x0 + c2.x1) / 2 - cx);
    if (c2.y1 - c2.y0 >= bh * 0.3 && d < bestD) {
      bestD = d;
      best = c2;
    }
  }
  if (!best) return null;
  const c = best, cw = c.x1 - c.x0, ch = c.y1 - c.y0;
  if (cw < ch * 0.85 || cw > ch * 1.2) return null;
  const runs = (xs, at) => {
    let n2 = 0, len = 0, mx2 = 0, mn = Infinity;
    for (const k of [...xs, -1]) {
      if (k >= 0 && at(k)) {
        if (!len) n2++;
        len++;
        mx2 = Math.max(mx2, len);
      } else {
        if (len) mn = Math.min(mn, len);
        len = 0;
      }
    }
    return { n: n2, mx: mx2, mn };
  };
  const my = c.y0 + c.y1 >> 1, mx = c.x0 + c.x1 >> 1;
  const row = runs(Array.from({ length: cw }, (_, k) => c.x0 + k), (x) => label[my * w + x] === c.id);
  const col = runs(Array.from({ length: ch }, (_, k) => c.y0 + k), (y) => label[y * w + mx] === c.id);
  if (row.n !== 2 || col.n !== 2) return null;
  let n = 0;
  for (let y = c.y0; y < c.y1; y++) for (let x = c.x0; x < c.x1; x++) if (label[y * w + x] === c.id) n++;
  const fill = n / (cw * ch), rel = ch / bh;
  if (rel >= 0.62 && (fill <= 0.23 ? row.mx <= cw * 0.1 : fill <= 0.33 && row.mn <= cw * 0.08)) return "\u25CB";
  if (rel <= 0.58 && fill >= 0.24) return "\u3147";
  if (rel >= 0.6 && rel <= 0.8 && fill >= 0.3 && ((c.y0 + c.y1) / 2 - bandT) / bh >= 0.55) return "o";
  return null;
}
function discAt(gray, w, h, ink, cx) {
  const { comps, label } = components(gray, w, h, ink);
  let charH = 0;
  for (const c2 of comps) charH = Math.max(charH, c2.y1 - c2.y0);
  if (charH < 10) return false;
  const tall = comps.filter((c2) => c2.y1 - c2.y0 >= charH * 0.6);
  const bh = Math.max(...tall.map((c2) => c2.y1)) - Math.min(...tall.map((c2) => c2.y0));
  const c = comps.filter((o) => Math.abs((o.x0 + o.x1) / 2 - cx) <= bh * 0.4).sort((a, b) => Math.abs((a.x0 + a.x1) / 2 - cx) - Math.abs((b.x0 + b.x1) / 2 - cx))[0];
  if (!c) return false;
  const cw = c.x1 - c.x0, ch = c.y1 - c.y0;
  if (ch < bh * 0.45 || ch > bh * 1.05 || cw < ch * 0.8 || cw > ch * 1.25) return false;
  let n = 0;
  for (let y = c.y0; y < c.y1; y++) for (let x = c.x0; x < c.x1; x++) if (label[y * w + x] === c.id) n++;
  const fill = n / (cw * ch);
  return fill >= 0.65 && fill <= 0.9;
}
function serifOne(gray, w, h, ink, cx) {
  const { comps, label } = components(gray, w, h, ink);
  let charH = 0;
  for (const c2 of comps) charH = Math.max(charH, c2.y1 - c2.y0);
  if (charH < 10) return false;
  const c = comps.filter((o) => o.x0 - 3 <= cx && o.x1 + 3 >= cx && o.y1 - o.y0 >= charH * 0.6).sort((a, b) => b.y1 - b.y0 - (a.y1 - a.y0))[0];
  if (!c) return false;
  const ch = c.y1 - c.y0;
  const span = (a, b) => {
    let mn = Infinity, mx = -1;
    for (let y = c.y0 + Math.floor(ch * a); y < c.y0 + Math.ceil(ch * b); y++) for (let x = c.x0; x < c.x1; x++) if (label[y * w + x] === c.id) {
      mn = Math.min(mn, x);
      mx = Math.max(mx, x);
    }
    return [mn, mx];
  };
  const [m0, m1] = span(0.4, 0.6), [t0, t1] = span(0, 0.2), [b0, b1] = span(0.8, 1);
  const sw = m1 - m0 + 1;
  const even = (l, r) => l >= sw * 0.4 && r >= sw * 0.4 && Math.abs(l - r) <= Math.max(l, r) * 0.35;
  return sw >= 2 && sw <= ch * 0.3 && even(m0 - t0, t1 - m1) && even(m0 - b0, b1 - m1);
}
function starRun(gray, w, h, ink, cx) {
  const { comps, label } = components(gray, w, h, ink);
  let charH = 0;
  for (const c of comps) charH = Math.max(charH, c.y1 - c.y0);
  if (charH < 10) return 0;
  const tall = comps.filter((c) => c.y1 - c.y0 >= charH * 0.6);
  const bandT = Math.min(...tall.map((c) => c.y0)), bh = Math.max(...tall.map((c) => c.y1)) - bandT;
  const star = (c) => {
    const cw = c.x1 - c.x0, ch = c.y1 - c.y0;
    if (ch < bh * 0.2 || ch > bh * 0.5 || cw < ch * 0.7 || cw > ch * 1.4 || ((c.y0 + c.y1) / 2 - bandT) / bh > 0.55) return false;
    let n = 0;
    for (let y = c.y0; y < c.y1; y++) for (let x = c.x0; x < c.x1; x++) if (label[y * w + x] === c.id) n++;
    const fill = n / (cw * ch);
    return fill >= 0.25 && fill <= 0.65;
  };
  const stars2 = comps.filter(star).sort((a, b) => a.x0 - b.x0);
  const k = stars2.findIndex((c) => cx >= c.x0 - (c.x1 - c.x0) && cx <= c.x1 + (c.x1 - c.x0));
  if (k < 0) return 0;
  let lo = k, hi = k;
  while (lo > 0 && stars2[lo].x0 - stars2[lo - 1].x1 <= stars2[lo].x1 - stars2[lo].x0) lo--;
  while (hi + 1 < stars2.length && stars2[hi + 1].x0 - stars2[hi].x1 <= stars2[hi].x1 - stars2[hi].x0) hi++;
  return hi - lo + 1;
}
var BRACKET_TAPER = 0.16;
var BRACKET_SOLID = 0.4;
var BRACKET_WIDE = 0.265;
var BRACKET_LENS = 0.35;
function bracketShape(f, close) {
  const [near, far] = close ? [f.bottom, f.top] : [f.top, f.bottom];
  const paren = close ? ")" : "(";
  if (near >= 0.7 && far <= 0.5) return f.taper < BRACKET_TAPER ? close ? "\u300D" : "\u300C" : paren;
  if (near >= 0.7 && far >= 0.7 && f.taper >= BRACKET_TAPER) {
    return f.fill >= BRACKET_SOLID && (f.cw >= f.ch * BRACKET_WIDE || f.taper >= BRACKET_LENS) ? close ? "\u3011" : "\u3010" : paren;
  }
  return null;
}
function leadingBullet(gray, w, h, ink, firstX) {
  const { comps, label } = components(gray, w, h, ink);
  let charH = 0;
  for (const c of comps) charH = Math.max(charH, c.y1 - c.y0);
  if (charH < 10) return null;
  const cand = comps.filter((c) => c.y1 - c.y0 >= charH * 0.15).sort((a, b) => a.x0 - b.x0);
  const first = cand[0];
  if (!first) return null;
  const cl = cand.filter((c) => c.x0 < first.x1 && c.x1 > first.x0);
  const x0 = Math.min(...cl.map((c) => c.x0)), x1 = Math.max(...cl.map((c) => c.x1)), y0 = Math.min(...cl.map((c) => c.y0)), y1 = Math.max(...cl.map((c) => c.y1));
  const cw = x1 - x0, ch = y1 - y0;
  if (cw < ch * 0.8 || cw > ch * 1.25) return null;
  const next = cand.find((c) => c.x0 >= x1);
  if (next && next.x0 - x1 < ch * 0.3) return null;
  let inkN = 0;
  for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) if (cl.some((c) => label[y * w + x] === c.id)) inkN++;
  const fill = inkN / (cw * ch);
  const rel = ch / charH;
  const ring2 = (c) => {
    const a = c.x1 - c.x0, b = c.y1 - c.y0;
    return a >= b * 0.75 && a <= b * 1.33;
  };
  const nested = cl.length >= 2 && cl.some((a) => cl.some((b) => a !== b && b.x0 > a.x0 && b.x1 < a.x1 && b.y0 > a.y0 && b.y1 < a.y1 && ring2(b) && Math.abs(b.x0 + b.x1 - (a.x0 + a.x1)) <= (a.x1 - a.x0) * 0.2 && Math.abs(b.y0 + b.y1 - (a.y0 + a.y1)) <= (a.y1 - a.y0) * 0.2));
  const span = (y) => {
    let n = 0;
    for (let x = x0; x < x1; x++) if (cl.some((c) => label[y * w + x] === c.id)) n++;
    return n;
  };
  const band = Math.max(1, Math.round(ch * 0.15));
  const edgeFull = (from, dir) => {
    let m = 0;
    for (let k = 0; k < band; k++) m = Math.max(m, span(from + dir * k));
    return m >= cw * 0.8;
  };
  let midRuns = 0;
  {
    let prev = false;
    const my = y0 + (ch >> 1);
    for (let x = x0; x < x1; x++) {
      const on = cl.some((c) => label[my * w + x] === c.id);
      if (on && !prev) midRuns++;
      prev = on;
    }
  }
  const hollowSquare = cl.length === 1 && fill < 0.5 && midRuns === 2 && edgeFull(y0, 1) && edgeFull(y1 - 1, -1);
  let mark = null;
  if (hollowSquare && rel >= 0.6 && rel <= 0.92) mark = "\u25A1";
  else if (nested && fill < 0.45 && rel >= 0.6) mark = "\u25CE";
  else if (cl.length === 1 && fill >= 0.9 && rel >= 0.28 && rel <= 0.6) mark = "\u25AA";
  else if (cl.length === 1 && fill >= 0.65 && fill <= 0.88 && rel >= 0.5 && rel <= 0.8) mark = "\u25CF";
  if (!mark) return null;
  return { mark, covers: firstX <= x1 + ch * 0.3 };
}
function restoreGlyphs(rgba, pageW, box, text, steps, stepPx, note = {}) {
  const chars = [...text];
  if (chars.length !== steps.length) return text;
  const gray = grayCrop(rgba, pageW, box);
  const c = { chars, cx: (i) => (steps[i] + 0.5) * stepPx, gray, w: box.w, h: box.h, ink: inkStats(gray) };
  if (/[[\]]/.test(text)) brackets(c);
  if (/['"]/.test(text)) quotes(c);
  if (/(^|\D)[1-9](\D|$)/.test(text)) circled(c);
  if (text.includes("*")) stars(c);
  if (/[\u00b7\u2022]/.test(text)) discs(c);
  gaps(c);
  note.ringLead = ring(c);
  if (/[I1Ⅰ-Ⅲ]|^\s*\./.test(text)) roman(c);
  return chars.join("");
}
function brackets({ chars, cx, gray, w, h, ink }) {
  for (let i = 0; i < chars.length; i++) {
    if (chars[i] !== "[" && chars[i] !== "]") continue;
    const f = bracketFeatures(gray, w, h, ink, cx(i));
    const shape = f && bracketShape(f, chars[i] === "]");
    if (shape) chars[i] = shape;
  }
}
function quotes({ chars, cx, gray, w, h, ink }) {
  const year = (i) => chars[i] === "'" && !/[\p{L}\p{N}]/u.test(chars[i - 1] ?? "") && /^\d{2}(?!\d)/.test(chars.slice(i + 1, i + 4).join(""));
  const single = { "'": chars.filter((c, i) => c === "'" && !year(i)).length === 1, '"': chars.filter((c) => c === '"').length === 1 };
  const open = { "'": false, '"': false };
  for (let i = 0; i < chars.length; i++) {
    const c = chars[i];
    const kind = c === "'" || c === "\u2018" || c === "\u2019" ? "'" : c === '"' || c === "\u201C" || c === "\u201D" ? '"' : null;
    if (!kind) continue;
    if (c !== kind) {
      open[kind] = c === "\u2018" || c === "\u201C";
      continue;
    }
    if (open[kind]) {
      open[kind] = false;
      continue;
    }
    if (!year(i) && !single[kind]) continue;
    const r = quoteHead(gray, w, h, ink, cx(i));
    if (r !== null && r >= 0.47) {
      chars[i] = kind === "'" ? "\u2018" : "\u201C";
      open[kind] = true;
    }
  }
}
function circled({ chars, cx, gray, w, h, ink }) {
  const at = chars.flatMap((c, i) => /^[1-9]$/.test(c) && !/\d/.test(chars[i - 1] ?? "") && !/\d/.test(chars[i + 1] ?? "") ? [i] : []);
  if (!at.length) return;
  const hit = circledAt(gray, w, h, ink, at.map(cx));
  at.forEach((i, k) => {
    if (hit[k]) chars[i] = String.fromCharCode(9311 + Number(chars[i]));
  });
}
function stars({ chars, cx, gray, w, h, ink }) {
  for (let i = 0; i < chars.length; i++) {
    if (chars[i] !== "*" || chars[i - 1] === "*") continue;
    let e = i;
    while (chars[e + 1] === "*") e++;
    const n = starRun(gray, w, h, ink, cx(i));
    if (n > e - i + 1 && n <= 4) chars[e] += "*".repeat(n - (e - i + 1));
    i = e;
  }
}
function discs({ chars, cx, gray, w, h, ink }) {
  for (let i = 0; i < chars.length; i++) if (/^[\u00b7\u2022]$/.test(chars[i]) && discAt(gray, w, h, ink, cx(i))) chars[i] = "\u25CF";
}
function gaps({ chars, cx, gray, w, h, ink }) {
  const { glyphs, bandH } = gapGlyphs(gray, w, h, ink);
  if (!glyphs.length) return;
  const live = chars.map((c, i) => i).filter((i) => chars[i].trim());
  if (!live.length) return;
  const d = [];
  for (let k = 0; k + 1 < live.length; k++) if (/[가-힣]$/.test(chars[live[k]]) && /^[가-힣]/.test(chars[live[k + 1]])) d.push(cx(live[k + 1]) - cx(live[k]));
  const pitch = d.length >= 2 ? d.sort((a, b) => a - b)[d.length >> 1] : bandH;
  const nearTo = (g) => (i) => Math.abs(cx(i) - (g.x0 + g.x1) / 2) <= Math.max(pitch * 0.45, (g.x1 - g.x0) / 2 + 1);
  const loose = glyphs.filter((g) => /^[\u00b7.]/.test(g.mark) && !live.some(nearTo(g)));
  for (const g of glyphs.sort((a, b) => a.x0 - b.x0)) {
    const mid = (g.x0 + g.x1) / 2;
    const near = nearTo(g);
    const cover = live.filter(near);
    if (g.mark === "\xB7") {
      const sp = chars.findIndex((c, i) => c === " " && near(i));
      const p = sp >= 0 ? chars.slice(0, sp).reverse().find((c) => c.trim()) : void 0, q = sp >= 0 ? chars.slice(sp + 1).find((c) => c.trim()) : void 0;
      if (p && q && /[가-힣]$/.test(p) && /^[가-힣]/.test(q) && !loose.some((o) => o !== g && Math.abs((o.x0 + o.x1) / 2 - mid) <= pitch * 1.5)) chars[sp] = "\xB7";
      continue;
    }
    if (cover.length) {
      if (g.mark.startsWith("\u25A1") && cover.length === 1 && /^[0Oo\u25cb]$/.test(chars[cover[0]])) chars[cover[0]] = "\u25A1";
      continue;
    }
    if (g.mark === "\u25A1\0") continue;
    const before = live.filter((i) => cx(i) < mid), after = live.filter((i) => cx(i) > mid);
    if (!before.length) {
      if (after.length && /^[\u3002\u00b7\u300c\u25b2]$/.test(g.mark) && /^[가-힣]/.test(chars[after[0]])) chars[after[0]] = g.mark + chars[after[0]];
      else if (g.mark === "-" && /^[\dⅰ-ⅹivx]+\s*-$/.test(chars.join("").trim())) chars[after[0]] = "-" + chars[after[0]];
      continue;
    }
    if (!after.length && g.mark !== ".") continue;
    if (g.mark === "/" && !(/\d$/.test(chars[before[before.length - 1]]) && /^\d/.test(chars[after[0]]))) continue;
    const prev = chars[before[before.length - 1]], next = after.length ? chars[after[0]] : "";
    if (g.mark === "\xB7" || g.mark === ".") {
      if (loose.some((o) => o !== g && Math.abs((o.x0 + o.x1) / 2 - mid) <= pitch * 1.5)) continue;
      if (/[\u2026.\u00b7]$/.test(prev) || /^[\u2026.\u00b7]/.test(next)) continue;
    }
    if (g.mark === "\xB7") {
      if (/^\d/.test(next)) continue;
      const sp = chars.findIndex((c, i) => c === " " && near(i));
      if (sp >= 0) {
        chars[sp] = g.mark;
        continue;
      }
    }
    chars[before[before.length - 1]] += g.mark;
  }
}
function ring({ chars, cx, gray, w, h, ink }) {
  const k = chars.findIndex((c) => c.trim());
  if (k < 0 || !/^[\u3147Oo0\u25cb]$/.test(chars[k])) return false;
  const rest = chars.slice(k + 1).join("").trimStart();
  if (!/^[(\[「【<]?[가-힣]/.test(rest)) return false;
  const r = ringBullet(gray, w, h, ink, cx(k));
  if (r) chars[k] = r;
  return r !== null;
}
function roman({ chars, cx, gray, w, h, ink }) {
  const ROMAN = /^[IⅠ-Ⅲ]$/, LATIN = /[A-Za-z]$/;
  for (let i = 0; i < chars.length; i++) {
    if (chars[i] !== "1" || /[\dA-Za-z]$/.test(chars[i - 1] ?? "") || /^[\dA-Za-z,]/.test(chars[i + 1] ?? "")) continue;
    if (serifOne(gray, w, h, ink, cx(i))) chars[i] = "\u2160";
  }
  const inRoman = (i) => ROMAN.test(chars[i]) || chars[i] === "1" && (ROMAN.test(chars[i - 1] ?? "") || ROMAN.test(chars[i + 1] ?? ""));
  const k = chars.findIndex((c) => c.trim());
  if (chars[k] === "." && chars.slice(k + 1).some((c) => /[가-힣A-Za-z0-9]/.test(c))) {
    const n = romanStems(gray, w, h, ink, -Infinity, cx(k));
    if (n) chars[k] = String.fromCharCode(8543 + n) + chars[k];
  }
  for (let s = 0; s < chars.length; ) {
    if (!inRoman(s) || s > 0 && LATIN.test(chars[s - 1])) {
      s++;
      continue;
    }
    let e = s;
    while (e < chars.length && inRoman(e)) e++;
    const tok = chars.slice(s, e).join("");
    if (e < chars.length && /^[A-Za-z]/.test(chars[e])) {
      s = e;
      continue;
    }
    let p = s - 1, q = e;
    while (p >= 0 && !chars[p].trim()) p--;
    while (q < chars.length && !chars[q].trim()) q++;
    const n = romanStems(gray, w, h, ink, p >= 0 ? cx(p) : -Infinity, q < chars.length ? cx(q) : Infinity);
    const canon = n ? [["\u2160", "I"], ["\u2161", "II"], ["\u2162", "III"]][n - 1] : null;
    if (canon && !canon.includes(tok)) {
      chars[s] = canon[0];
      for (let i = s + 1; i < e; i++) chars[i] = "";
    }
    s = e;
  }
}
var HANGUL_START = /^[\uac00-\ud7a3]/;
function restoreSymbols(text, ringDecided = false) {
  let s = text;
  if (!ringDecided) s = s.replace(/^([Oo])(\s?)(?=[\uac00-\ud7a3])/, "\u25CB$2");
  s = s.replace(/(?<![A-Za-z])O{2,}(?![A-Za-z])/g, (m, i) => /[\uac00-\ud7a3]$/.test(s.slice(Math.max(0, i - 2), i).trimEnd()) || /^\s?[\uac00-\ud7a3]/.test(s.slice(i + m.length)) ? "\u25CB".repeat(m.length) : m);
  s = s.replace(/[\u2206\u0394]/g, "\u25B3");
  s = s.replace(/\(cid:\d*\)/g, "");
  return smartQuotes(joinDigitGroups(s));
}
function joinDigitGroups(s) {
  return s.replace(/(?<![\d,])\d{1,3}(?:, ?\d{3})+(?![\d])/g, (m) => m.replace(/, /g, ","));
}
function smartQuotes(s) {
  if (!/['"]/.test(s)) return s;
  const chars = [...s];
  for (const q of ["'", '"']) {
    const [open, close] = q === "'" ? ["\u2018", "\u2019"] : ["\u201C", "\u201D"];
    const pos = [];
    for (let i = 0; i < chars.length; i++) {
      if (chars[i] !== q) continue;
      const prev2 = i > 0 ? chars[i - 1] : "";
      if (q === "'" && !/[\p{L}\p{N}]/u.test(prev2) && /^\d{2}(?!\d)/.test(chars.slice(i + 1, i + 4).join(""))) {
        chars[i] = close;
        continue;
      }
      pos.push(i);
    }
    if (pos.length === 0) continue;
    const first = pos[0];
    const prev = first > 0 ? chars[first - 1] : "";
    const atOpen = prev === "" || /[\s(\[{<\u300c\u300e\u3010\u3008\u300a\u2018\u201c·,:]/.test(prev);
    let isOpen = pos.length % 2 === 0 || atOpen;
    for (const i of pos) {
      chars[i] = isOpen ? open : close;
      isOpen = !isOpen;
    }
  }
  return chars.join("");
}
function isDotFragment(text) {
  return /^[\s.\u00b7\u2024\u2025\u2026\u2027\u2219\u22c5\u318d]+$/.test(text);
}
function joinLeaderItems(items, ends) {
  const gone = /* @__PURE__ */ new Set();
  const sameLine = (a, b) => Math.abs(a.y + a.h / 2 - (b.y + b.h / 2)) <= Math.max(a.h, b.h) / 2;
  const merge = (left, right) => {
    const x2 = Math.max(left.x + left.w, right.x + right.w), y2 = Math.max(left.y + left.h, right.y + right.h);
    left.text = left.text.replace(/\s*\u2026$/, "") + " \u2026 " + right.text.replace(/^\u2026\s*/, "");
    left.x = Math.min(left.x, right.x);
    left.y = Math.min(left.y, right.y);
    left.w = x2 - left.x;
    left.h = y2 - left.y;
    left.confidence = Math.min(left.confidence, right.confidence);
    gone.add(right);
  };
  const neighbor = (it, toLeft) => {
    let best = null;
    for (const o of items) {
      if (o === it || gone.has(o) || !sameLine(o, it)) continue;
      if (toLeft ? o.x + o.w > it.x + 2 : o.x < it.x + it.w - 2) continue;
      if (!best || (toLeft ? o.x + o.w > best.x + best.w : o.x < best.x)) best = o;
    }
    return best;
  };
  for (const it of [...items].sort((a, b) => b.x - a.x)) {
    if (gone.has(it) || !ends.get(it)?.lead) continue;
    const left = neighbor(it, true);
    if (left) merge(left, it);
  }
  for (const it of [...items].sort((a, b) => a.x - b.x)) {
    if (gone.has(it) || !ends.get(it)?.trail) continue;
    const right = neighbor(it, false);
    if (right) merge(it, right);
  }
  const toc = items.filter((it) => !gone.has(it) && /\s\u2026\s\d{1,4}$/.test(it.text));
  if (toc.length >= 2) {
    for (const it of items) {
      if (gone.has(it) || toc.includes(it) || !/^[\s.:\u00b7\u2026]*\d{1,4}$/.test(it.text)) continue;
      const x2 = it.x + it.w;
      if (toc.filter((t) => Math.abs(t.x + t.w - x2) <= Math.max(t.h, it.h)).length < 2) continue;
      const left = neighbor(it, true);
      if (!left || toc.includes(left)) continue;
      left.text = left.text.replace(/[\s.:\u00b7\u2026]+$/, "");
      it.text = it.text.replace(/^[\s.:\u00b7\u2026]+/, "");
      merge(left, it);
    }
  }
  return items.filter((it) => !gone.has(it));
}
function restoreBulletItems(items) {
  for (const it of items) {
    if (it.text !== "O" && it.text !== "o") continue;
    const cy = it.y + it.h / 2;
    let next = null;
    for (const o of items) {
      if (o === it || o.x < it.x + it.w * 0.5) continue;
      if (Math.abs(o.y + o.h / 2 - cy) > Math.max(it.h, o.h) / 2) continue;
      if (o.x - (it.x + it.w) > it.h * 3) continue;
      if (!next || o.x < next.x) next = o;
    }
    if (next && HANGUL_START.test(next.text.trimStart())) it.text = "\u25CB";
  }
}
var REC_HEIGHT = 48;
var REC_MAX_WIDTH = 3200;
var MIN_SIZE = 3;
function bandBoxes(b, bands, pageH) {
  const out = [];
  for (let i = 0; i < bands.length; i++) {
    const { y0, y1, x0, x1 } = bands[i];
    const bh = y1 - y0;
    const upGap = i > 0 ? (y0 - bands[i - 1].y1) / 2 : y0;
    const downGap = i < bands.length - 1 ? (bands[i + 1].y0 - y1) / 2 : b.h - y1;
    const top = Math.max(0, Math.round(b.y + y0 - Math.min(bh * 0.2, upGap)));
    const bot = Math.min(pageH, Math.round(b.y + y1 + Math.min(bh * 0.2, downGap)));
    const left = Math.max(b.x, Math.round(b.x + x0 - bh * 0.2));
    const right = Math.min(b.x + b.w, Math.round(b.x + x1 + bh * 0.2));
    if (bot - top >= MIN_SIZE && right - left >= MIN_SIZE) out.push({ x: left, y: top, w: right - left, h: bot - top });
  }
  return out;
}
function lineCrop(rgba, pageW, box, rot, keep) {
  const srcW = rot === 0 ? box.w : box.h;
  const srcH = rot === 0 ? box.h : box.w;
  const rw = Math.min(REC_MAX_WIDTH, Math.max(16, Math.round(srcW * REC_HEIGHT / srcH)));
  const rgb = new Uint8Array(rw * REC_HEIGHT * 3);
  const at = (u, v) => {
    let px, py;
    if (rot === 0) {
      px = u;
      py = v;
    } else if (rot === 90) {
      px = box.w - 1 - v;
      py = u;
    } else {
      px = v;
      py = box.h - 1 - u;
    }
    return ((box.y + py) * pageW + (box.x + px)) * 4;
  };
  const fx = srcW / rw;
  const fy = srcH / REC_HEIGHT;
  for (let dy = 0; dy < REC_HEIGHT; dy++) {
    let sy = (dy + 0.5) * fy - 0.5;
    if (sy < 0) sy = 0;
    const y0 = Math.min(srcH - 1, Math.floor(sy));
    const y1 = Math.min(srcH - 1, y0 + 1);
    const wy = sy - y0;
    for (let dx = 0; dx < rw; dx++) {
      let sx = (dx + 0.5) * fx - 0.5;
      if (sx < 0) sx = 0;
      const x0 = Math.min(srcW - 1, Math.floor(sx));
      const x1 = Math.min(srcW - 1, x0 + 1);
      const wx = sx - x0;
      const i00 = at(x0, y0), i01 = at(x1, y0), i10 = at(x0, y1), i11 = at(x1, y1);
      const o = (dy * rw + dx) * 3;
      if (keep && rot === 0 && (sx < keep.x0 || sx >= keep.x1 || sy < keep.y0 || sy >= keep.y1)) {
        rgb[o] = rgb[o + 1] = rgb[o + 2] = keep.bg;
        continue;
      }
      for (let c = 0; c < 3; c++) {
        const top = rgba[i00 + c] * (1 - wx) + rgba[i01 + c] * wx;
        const bottom = rgba[i10 + c] * (1 - wx) + rgba[i11 + c] * wx;
        rgb[o + c] = Math.round(top * (1 - wy) + bottom * wy);
      }
    }
  }
  return { rgb, w: rw };
}
function splitBoxAtCellRules(b, rules) {
  const cuts = rules.filter((r) => r.x1 > b.x + b.h && r.x1 < b.x + b.w - b.h && r.y1 <= b.y + b.h * 0.25 && r.y2 >= b.y + b.h * 0.75).sort((a, c) => a.x1 - c.x1);
  if (!cuts.length) return [b];
  const out = [];
  let left = b.x;
  for (const r of cuts) {
    const edge = Math.floor(r.x1 - r.thicknessPx / 2 - 1);
    if (edge - left < b.h) continue;
    out.push({ ...b, x: left, w: edge - left });
    left = Math.ceil(r.x1 + r.thicknessPx / 2 + 1);
  }
  if (left < b.x + b.w) out.push({ ...b, x: left, w: b.x + b.w - left });
  return out;
}
var DEFAULT_OCR_TUNING = Object.freeze({
  detLongSide: 960,
  detThresh: 0.3,
  detBoxThresh: 0.6,
  detUnclip: 1.5,
  textScore: 0.5,
  recBatch: 1,
  splitTall: true,
  trimEdges: true,
  minInkContrast: 35,
  postprocess: true,
  tightBoxes: true,
  splitLeaders: true
});
var DET_MIN_SIZE = 3;
var DET_MAX_BOXES = 3e3;
var REC_MIN_WIDTH = 320;
var REC_BATCH_MAX_PIXELS = 48 * 16e3;
var TALL_RATIO = 1.5;
var ROTATE_RATIO = 3;
var KEEP_MARGIN = 0.06;
var LEADER_MIN_DOTS = 4;
var LEADER_CONTEXT = 0.5;
var MIN_INK_RATIO = 0.01;
var DET_MEAN = [0.485, 0.456, 0.406];
var DET_STD = [0.229, 0.224, 0.225];
var OcrEngine = class _OcrEngine {
  det;
  rec;
  dict;
  ort;
  sharp;
  constructor(parts) {
    this.det = parts.det;
    this.rec = parts.rec;
    this.dict = parts.dict;
    this.ort = parts.ort;
    this.sharp = parts.sharp;
  }
  static async create() {
    disableOrtTelemetry();
    const [ortMod, sharpModRaw] = await Promise.all([
      tryImport("onnxruntime-node", () => import(__extensionUrl("onnxruntime-node"))),
      tryImport(
        "sharp",
        () => import(__extensionUrl("sharp"))
      )
    ]);
    const sharpAny = sharpModRaw;
    const sharpMod = typeof sharpAny === "function" ? sharpAny : sharpAny.default ?? sharpAny;
    const dir = getOcrModelsDir();
    const sessionOpts = {
      graphOptimizationLevel: "all",
      executionProviders: ["cpu"],
      logSeverityLevel: 3
      // paddle2onnx 변환 잔여물 W 로그 폭주 억제
    };
    const [det, rec, dictYml] = await Promise.all([
      ortMod.InferenceSession.create(join(dir, OCR_DET_MODEL.filename), sessionOpts),
      ortMod.InferenceSession.create(join(dir, OCR_REC_MODEL.filename), sessionOpts),
      readFile(join(dir, OCR_REC_DICT.filename), "utf-8")
    ]);
    const dict = parseCharacterDict(dictYml);
    if (dict.length === 0) throw new Error("OCR \uC0AC\uC804 \uD30C\uC2F1 \uC2E4\uD328 \u2014 \uBAA8\uB378 \uCE90\uC2DC\uB97C \uC0AD\uC81C \uD6C4 \uC7AC\uB2E4\uC6B4\uB85C\uB4DC\uD558\uC138\uC694");
    return new _OcrEngine({ det, rec, dict, ort: ortMod, sharp: sharpMod });
  }
  /** onnxruntime-node 1.14+ InferenceSession.release() — 구버전은 무시 */
  async destroy() {
    for (const s of [this.det, this.rec]) {
      const rel = s.release;
      if (typeof rel === "function") {
        try {
          await rel.call(s);
        } catch {
        }
      }
    }
  }
  /**
   * 페이지 RGBA 픽셀 → 텍스트 라인 인식.
   * 반환 좌표는 입력 픽셀 기준. 라인은 위→아래, 좌→우 정렬.
   * @param stats 저신뢰(conf<0.5) 폐기 라인 카운트 출력 — 종전엔 무음 폐기라 관측 불가
   */
  async recognizePage(rgba, width, height, stats, tuning = DEFAULT_OCR_TUNING, cellRules = []) {
    if (width < DET_MIN_SIZE || height < DET_MIN_SIZE) return [];
    const detected = await this.detect(rgba, width, height, tuning, stats);
    const boxes = cellRules.length ? detected.flatMap((b) => splitBoxAtCellRules(b, cellRules)) : detected;
    const jobs = [];
    const joins = [];
    let group = 0;
    for (const b of boxes) {
      const gray = grayCrop(rgba, width, b);
      const ink = inkStats(gray);
      if (tuning.minInkContrast > 0 && ink.contrast < tuning.minInkContrast) continue;
      if (tuning.minInkContrast > 0 && ink.inkRatio < MIN_INK_RATIO) continue;
      if (tuning.splitTall && b.h >= b.w * TALL_RATIO) {
        const bands = splitRowBands(gray, b.w, b.h, ink, 0.45);
        if (bands.length >= 2) {
          for (const sub of bandBoxes(b, bands, height)) jobs.push({ box: sub, rot: 0, group: group++ });
          continue;
        }
        if (b.h >= b.w * ROTATE_RATIO) {
          for (const rot of [0, 90, 270]) jobs.push({ box: b, rot, group });
          group++;
          continue;
        }
      }
      const trim = tuning.trimEdges ? edgeTrim(gray, b.w, b.h, ink) : null;
      const keep = trim ? { ...trim, bg: median(gray) } : void 0;
      const leaders = tuning.splitLeaders ? leaderRuns(gray, b.w, b.h, ink, LEADER_MIN_DOTS) : [];
      if (leaders.length) {
        const join2 = joins.length;
        joins.push({ box: b, parts: [], trailDots: false });
        let x0 = 0, dots = false;
        for (const [a, c] of [...leaders, [b.w, b.w]]) {
          const bare = { x: b.x + x0, y: b.y, w: a - x0, h: b.h };
          const end = c > a ? Math.min(c, a + Math.round(b.h * LEADER_CONTEXT)) : a;
          x0 = c;
          if (bare.w >= DET_MIN_SIZE && inkStats(grayCrop(rgba, width, bare)).contrast >= Math.max(1, tuning.minInkContrast)) {
            jobs.push({ box: { ...bare, w: end - (bare.x - b.x) }, rot: 0, group: group++, join: join2, dotsBefore: dots, trimDots: end > a });
            dots = false;
          }
          if (c > a) dots = true;
        }
        joins[join2].trailDots = dots;
        continue;
      }
      if (keep) jobs.push({ box: b, rot: 0, group, keep });
      jobs.push({ box: b, rot: 0, group: group++ });
    }
    const results = await this.recognizeJobs(rgba, width, jobs, tuning.recBatch);
    const best = /* @__PURE__ */ new Map();
    const score = (job, confidence) => confidence - (job.keep ? KEEP_MARGIN : 0);
    jobs.forEach((job, i) => {
      const r = results[i];
      if (!r) return;
      const cur = best.get(job.group);
      if (!cur || score(job, r.confidence) > score(cur.job, cur.confidence)) best.set(job.group, { job, ...r });
    });
    let items = [];
    for (const { job, text: read, confidence, steps, stepPx } of best.values()) {
      const note = {};
      const raw = tuning.postprocess && job.rot === 0 ? restoreGlyphs(rgba, width, job.box, read, steps, stepPx, note) : read;
      let text = tuning.postprocess ? restoreSymbols(raw.trim(), note.ringLead) : raw;
      if (!text.trim()) continue;
      if (tuning.postprocess && job.rot === 0 && !/^[◎●▪□■○ㅇ]/.test(text)) {
        const chars = [...read], k = chars.findIndex((c) => c.trim());
        if (k >= 0 && steps.length === chars.length) {
          const g = grayCrop(rgba, width, job.box);
          const b = leadingBullet(g, job.box.w, job.box.h, inkStats(g), (steps[k] + 0.5) * stepPx);
          const body = (text.match(/[가-힣]/g) ?? []).length >= 4;
          const miss = /^[Oo0•·ㆍ∙‧○]/.test(text);
          if (b?.mark === "\u25CE" && b.covers && /^[Oo0○]/.test(text)) text = b.mark + " " + text.slice(1).trimStart();
          else if (b?.mark === "\u25A1") {
            if (!b.covers && body) text = b.mark + " " + text;
          } else if (b && b.mark !== "\u25CE" && body) text = b.covers ? miss ? b.mark + " " + text.slice(1).trimStart() : text : b.mark + " " + text;
        }
      }
      if (tuning.postprocess && /^\d/.test(text) && job.rot === 0) {
        const g = grayCrop(rgba, width, job.box);
        const tri = leadingTriangle(g, job.box.w, job.box.h, inkStats(g));
        if (tri) text = tri + text;
      }
      if (tuning.postprocess && isDotFragment(text)) continue;
      if (confidence < tuning.textScore) {
        if (stats) stats.droppedLowConf++;
        continue;
      }
      if (job.join !== void 0) {
        if (job.trimDots) text = text.replace(/[\s.:\u00b7\u2022\u2024\u2025\u2026\u2219\u22c5\u318d]+$/u, "");
        if (text) joins[job.join].parts.push({ x: job.box.x, text, dotsBefore: job.dotsBefore === true, confidence });
        continue;
      }
      items.push({ text, ...this.itemBox(rgba, width, job.box, tuning), confidence });
    }
    const leaderEnds = /* @__PURE__ */ new Map();
    for (const j of joins) {
      if (!j.parts.length) continue;
      j.parts.sort((a, b) => a.x - b.x);
      let text = "";
      for (const p of j.parts) text += (p.dotsBefore ? text ? " \u2026 " : "\u2026" : text ? " " : "") + p.text;
      if (j.trailDots) text += " \u2026";
      const item = { text, ...this.itemBox(rgba, width, j.box, tuning), confidence: Math.min(...j.parts.map((p) => p.confidence)) };
      items.push(item);
      leaderEnds.set(item, { lead: j.parts[0].dotsBefore, trail: j.trailDots });
    }
    if (leaderEnds.size) items = joinLeaderItems(items, leaderEnds);
    if (tuning.postprocess) restoreBulletItems(items);
    items.sort((a, b) => a.y - b.y || a.x - b.x);
    return items;
  }
  /** 결과 좌표 — det 박스 그대로 또는 박스 안 잉크 외곽 (tightBoxes) */
  itemBox(rgba, width, b, tuning) {
    if (!tuning.tightBoxes) return b;
    const gray = grayCrop(rgba, width, b);
    const t = inkBounds(gray, b.w, b.h, inkStats(gray));
    return { x: b.x + t.x0, y: b.y + t.y0, w: t.x1 - t.x0, h: t.y1 - t.y0 };
  }
  // ─── det ─────────────────────────────────────────────
  async detect(rgba, width, height, tuning, stats) {
    const ratio = tuning.detLongSide / Math.max(width, height);
    const dw = Math.max(32, Math.round(width * ratio / 32) * 32);
    const dh = Math.max(32, Math.round(height * ratio / 32) * 32);
    const rgb = await this.sharp(rgba, { raw: { width, height, channels: 4 } }).resize(dw, dh, { fit: "fill" }).removeAlpha().raw().toBuffer();
    const plane = dw * dh;
    const input = new Float32Array(3 * plane);
    for (let i = 0; i < plane; i++) {
      const r = rgb[i * 3] / 255;
      const g = rgb[i * 3 + 1] / 255;
      const b = rgb[i * 3 + 2] / 255;
      input[i] = (b - DET_MEAN[0]) / DET_STD[0];
      input[plane + i] = (g - DET_MEAN[1]) / DET_STD[1];
      input[2 * plane + i] = (r - DET_MEAN[2]) / DET_STD[2];
    }
    const tensor = new this.ort.Tensor("float32", input, [1, 3, dh, dw]);
    const out = await this.det.run({ [this.det.inputNames[0]]: tensor });
    const probMap = out[this.det.outputNames[0]].data;
    const rawBoxes = componentBoxes(probMap, dw, dh, tuning.detThresh, tuning.detBoxThresh);
    if (stats) stats.truncatedBoxes = Math.max(0, rawBoxes.length - DET_MAX_BOXES);
    const sx = width / dw;
    const sy = height / dh;
    const boxes = [];
    for (const rb of rawBoxes.slice(0, DET_MAX_BOXES)) {
      const bw = rb.x2 - rb.x1 + 1;
      const bh = rb.y2 - rb.y1 + 1;
      const delta = bw * bh * tuning.detUnclip / (2 * (bw + bh));
      const x1 = Math.max(0, Math.floor((rb.x1 - delta) * sx));
      const y1 = Math.max(0, Math.floor((rb.y1 - delta) * sy));
      const x2 = Math.min(width, Math.ceil((rb.x2 + 1 + delta) * sx));
      const y2 = Math.min(height, Math.ceil((rb.y2 + 1 + delta) * sy));
      if (x2 - x1 < DET_MIN_SIZE || y2 - y1 < DET_MIN_SIZE) continue;
      boxes.push({ x: x1, y: y1, w: x2 - x1, h: y2 - y1 });
    }
    return boxes;
  }
  // ─── rec ─────────────────────────────────────────────
  /** 라인 작업들을 폭 비율 순으로 배치 인식 — 결과는 jobs 순서 */
  async recognizeJobs(rgba, pageW, jobs, batchSize) {
    const crops = jobs.map((j) => lineCrop(rgba, pageW, j.box, j.rot, j.keep));
    const order = crops.map((_, i) => i).sort((a, b) => crops[a].w - crops[b].w);
    const results = new Array(jobs.length).fill(null);
    const plane = REC_HEIGHT;
    for (let s = 0; s < order.length; ) {
      let e = s + 1;
      while (e < order.length && e - s < Math.max(1, batchSize) && (e - s + 1) * Math.max(REC_MIN_WIDTH, crops[order[e]].w) * plane <= REC_BATCH_MAX_PIXELS) e++;
      const idx = order.slice(s, e);
      const bw = Math.max(REC_MIN_WIDTH, crops[idx[idx.length - 1]].w);
      const n = idx.length;
      const chw = 3 * REC_HEIGHT * bw;
      const input = new Float32Array(n * chw);
      idx.forEach((ci, k) => {
        const c = crops[ci];
        const base = k * chw;
        const p = REC_HEIGHT * bw;
        for (let y = 0; y < REC_HEIGHT; y++) {
          for (let x = 0; x < c.w; x++) {
            const src = (y * c.w + x) * 3;
            const dst = base + y * bw + x;
            input[dst] = c.rgb[src + 2] / 127.5 - 1;
            input[dst + p] = c.rgb[src + 1] / 127.5 - 1;
            input[dst + 2 * p] = c.rgb[src] / 127.5 - 1;
          }
        }
      });
      const tensor = new this.ort.Tensor("float32", input, [n, 3, REC_HEIGHT, bw]);
      const out = await this.rec.run({ [this.rec.inputNames[0]]: tensor });
      const logits = out[this.rec.outputNames[0]];
      const [, T, C] = logits.dims;
      const data = logits.data;
      idx.forEach((ci, k) => {
        const r = ctcDecode(data.subarray(k * T * C, (k + 1) * T * C), T, C, this.dict);
        const job = jobs[ci], src = job.rot === 0 ? job.box.w : job.box.h;
        let kept = r;
        const last = crops[ci].w * T / bw + 1;
        const chars = r ? [...r.text] : [];
        if (r && job.rot === 0 && chars.length === r.steps.length && r.steps.some((t) => t > last) && !r.text.includes("(cid:")) {
          const tallCh = (c) => !/[\s.,:;\u00b7\u2026'"\u2018-\u201d`\-_~]/.test(c);
          const g = grayCrop(rgba, pageW, job.box);
          const inside = chars.filter((c, i) => r.steps[i] <= last && tallCh(c)).length;
          let budget = inside <= 2 ? tallInkCount(g, job.box.w, job.box.h, inkStats(g)) - inside : Infinity;
          const keep = chars.map((c, i) => r.steps[i] <= last || !tallCh(c) || budget-- > 0);
          if (!keep.every(Boolean)) kept = { ...r, text: chars.filter((_, i) => keep[i]).join(""), steps: r.steps.filter((_, i) => keep[i]) };
        }
        results[ci] = kept && { ...kept, stepPx: bw / T * (src / crops[ci].w) };
      });
      s = e;
    }
    return results;
  }
};
function median(gray) {
  const hist = new Uint32Array(256);
  for (let i = 0; i < gray.length; i++) hist[gray[i]]++;
  for (let v = 0, n = 0; v < 256; v++) if ((n += hist[v]) * 2 >= gray.length) return v;
  return 255;
}
function ctcDecode(data, T, C, dict) {
  let text = "";
  let confSum = 0;
  let confCount = 0;
  let prev = -1;
  const runs = [];
  let open = [];
  for (let t = 0; t < T; t++) {
    const off = t * C;
    let best = 0;
    let bestV = data[off];
    for (let c = 1; c < C; c++) {
      const v = data[off + c];
      if (v > bestV) {
        bestV = v;
        best = c;
      }
    }
    const repeat = best === prev;
    prev = best;
    if (repeat && best !== 0) {
      for (const r of open) r[1] = t;
      continue;
    }
    open = [];
    if (best === 0) continue;
    let p = bestV;
    if (p > 1.0001 || p < 0) {
      let denom = 0;
      for (let c = 0; c < C; c++) denom += Math.exp(data[off + c] - bestV);
      p = 1 / denom;
    }
    confSum += p;
    confCount++;
    const tok = best >= 1 && best <= dict.length ? dict[best - 1] : best === dict.length + 1 ? " " : "";
    text += tok;
    for (const _ of tok) {
      const r = [t, t];
      runs.push(r);
      open.push(r);
    }
  }
  if (!text) return null;
  return { text, confidence: confCount > 0 ? confSum / confCount : 0, steps: runs.map(([a, b]) => (a + b) / 2) };
}
function componentBoxes(prob, w, h, thresh = DEFAULT_OCR_TUNING.detThresh, boxThresh = DEFAULT_OCR_TUNING.detBoxThresh) {
  const visited = new Uint8Array(w * h);
  const boxes = [];
  const stack = [];
  for (let start = 0; start < w * h; start++) {
    if (visited[start] || prob[start] <= thresh) continue;
    let x1 = start % w, x2 = x1, y1 = start / w | 0, y2 = y1;
    let sum = 0;
    let count = 0;
    stack.length = 0;
    stack.push(start);
    visited[start] = 1;
    while (stack.length) {
      const p = stack.pop();
      const px = p % w;
      const py = p / w | 0;
      sum += prob[p];
      count++;
      if (px < x1) x1 = px;
      if (px > x2) x2 = px;
      if (py < y1) y1 = py;
      if (py > y2) y2 = py;
      if (px > 0 && !visited[p - 1] && prob[p - 1] > thresh) {
        visited[p - 1] = 1;
        stack.push(p - 1);
      }
      if (px < w - 1 && !visited[p + 1] && prob[p + 1] > thresh) {
        visited[p + 1] = 1;
        stack.push(p + 1);
      }
      if (py > 0 && !visited[p - w] && prob[p - w] > thresh) {
        visited[p - w] = 1;
        stack.push(p - w);
      }
      if (py < h - 1 && !visited[p + w] && prob[p + w] > thresh) {
        visited[p + w] = 1;
        stack.push(p + w);
      }
    }
    if (x2 - x1 + 1 < DET_MIN_SIZE && y2 - y1 + 1 < DET_MIN_SIZE) continue;
    boxes.push({ x1, y1, x2, y2, score: sum / count });
  }
  return boxes.filter((b) => b.score >= boxThresh).sort((a, b) => a.y1 - b.y1 || a.x1 - b.x1);
}
async function tryImport(name, loader) {
  try {
    return await loader();
  } catch (e) {
    throw new Error(
      `\uB0B4\uC7A5 OCR \uC744 \uC0AC\uC6A9\uD558\uB824\uBA74 optional dependency '${name}' \uC774 \uD544\uC694\uD569\uB2C8\uB2E4. \`npm install ${name}\` \uD6C4 \uB2E4\uC2DC \uC2E4\uD589\uD558\uC138\uC694.${OPTIONAL_DEP_INSTALL_HINT} \uC6D0\uC778: ${e.message}`
    );
  }
}
var enginePromise = null;
function getOcrEngine() {
  if (!enginePromise) {
    enginePromise = OcrEngine.create().catch((err) => {
      enginePromise = null;
      throw err;
    });
  }
  return enginePromise;
}
var MAX_SKEW_DEG = 5;
var MIN_APPLY_DEG = 0.25;
var MIN_GAIN = 1.03;
var TARGET_LONG = 1e3;
function estimateSkew(rgba, width, height) {
  const step = Math.max(1, Math.ceil(Math.max(width, height) / TARGET_LONG));
  const sw = Math.floor(width / step), sh = Math.floor(height / step);
  const xs = [], ys = [];
  for (let y = 0; y < sh; y++) {
    for (let x = 0; x < sw; x++) {
      const i = (y * step * width + x * step) * 4;
      const l = rgba[i] * 77 + rgba[i + 1] * 150 + rgba[i + 2] * 29 >> 8;
      if (l < 128) {
        xs.push(x);
        ys.push(y);
      }
    }
  }
  if (xs.length < 200) return { angle: 0, gain: 1 };
  const diag = Math.ceil(Math.hypot(sw, sh));
  const hist = new Float64Array(2 * diag + 2);
  const score = (deg) => {
    const t = deg * Math.PI / 180;
    const c = Math.cos(t), s = Math.sin(t);
    hist.fill(0);
    for (let k = 0; k < xs.length; k++) hist[Math.round(ys[k] * c + xs[k] * s) + diag]++;
    let sum = 0;
    for (let i = 0; i < hist.length; i++) sum += hist[i] * hist[i];
    return sum;
  };
  const s0 = score(0);
  let best = 0, bestS = s0;
  for (let d = -MAX_SKEW_DEG; d <= MAX_SKEW_DEG + 1e-9; d += 0.2) {
    const v = score(d);
    if (v > bestS) {
      bestS = v;
      best = d;
    }
  }
  const coarse = best;
  for (let d = coarse - 0.2; d <= coarse + 0.2 + 1e-9; d += 0.02) {
    const v = score(d);
    if (v > bestS) {
      bestS = v;
      best = d;
    }
  }
  return { angle: +(-best).toFixed(2), gain: s0 > 0 ? bestS / s0 : 1 };
}
function deskewPage(rgba, width, height) {
  const est = estimateSkew(rgba, width, height);
  if (Math.abs(est.angle) < MIN_APPLY_DEG || est.gain < MIN_GAIN) return { rgba, angle: 0 };
  return { rgba: rotateRgba(rgba, width, height, est.angle), angle: est.angle };
}
function rotateRgba(rgba, width, height, deg) {
  const out = new Uint8Array(rgba.length);
  const t = deg * Math.PI / 180;
  const c = Math.cos(t), s = Math.sin(t);
  const cx = (width - 1) / 2, cy = (height - 1) / 2;
  for (let y = 0; y < height; y++) {
    const dy = y - cy;
    for (let x = 0; x < width; x++) {
      const dx = x - cx;
      const sx = c * dx - s * dy + cx;
      const sy = s * dx + c * dy + cy;
      const o = (y * width + x) * 4;
      const x0 = Math.floor(sx), y0 = Math.floor(sy);
      if (x0 < 0 || y0 < 0 || x0 >= width - 1 || y0 >= height - 1) {
        out[o] = 255;
        out[o + 1] = 255;
        out[o + 2] = 255;
        out[o + 3] = 255;
        continue;
      }
      const wx = sx - x0, wy = sy - y0;
      const i00 = (y0 * width + x0) * 4, i01 = i00 + 4, i10 = i00 + width * 4, i11 = i10 + 4;
      for (let ch = 0; ch < 4; ch++) {
        const top = rgba[i00 + ch] * (1 - wx) + rgba[i01 + ch] * wx;
        const bot = rgba[i10 + ch] * (1 - wx) + rgba[i11 + ch] * wx;
        out[o + ch] = Math.round(top * (1 - wy) + bot * wy);
      }
    }
  }
  return out;
}
var OCR_RENDER_SCALE = 3;
var MAX_OCR_PIXELS = 24e6;
var PAGE_TIMEOUT_MS = 12e4;
async function runPdfOcr(buffer, targets, mode, warnings, onProgress, detectTables = true, vectorOps, imageRegions) {
  const result = /* @__PURE__ */ new Map();
  if (targets.size === 0) return result;
  const pdfiumMod = await tryImport2(
    "@hyzyla/pdfium",
    () => import(__extensionUrl("@hyzyla/pdfium"))
  );
  if (mode === "builtin") {
    await ensureOcrModels((p) => {
      if (p.phase === "download" && p.downloaded === 0) {
        process.stderr.write(`[kordoc-ocr] ${p.spec.name} \uB2E4\uC6B4\uB85C\uB4DC \uC911 (~${p.spec.sizeMb}MB)...
`);
      }
    });
  }
  const engine = mode === "builtin" ? await getOcrEngine() : null;
  const pdfium = await pdfiumMod.PDFiumLibrary.init();
  const doc = await pdfium.loadDocument(new Uint8Array(buffer));
  try {
    let done = 0;
    const count = doc.getPageCount();
    for (const pageNo of [...targets].filter((p) => p >= 1 && p <= count).sort((a, b) => a - b)) {
      const page = doc.getPage(pageNo - 1);
      onProgress?.(++done, targets.size);
      try {
        const blocks = await withTimeout(
          ocrOnePage(page, pageNo, mode, engine, warnings, detectTables, vectorOps?.get(pageNo), imageRegions?.get(pageNo)),
          PAGE_TIMEOUT_MS,
          `OCR \uD398\uC774\uC9C0 ${pageNo} \uD0C0\uC784\uC544\uC6C3 (${PAGE_TIMEOUT_MS / 1e3}\uCD08)`
        );
        result.set(pageNo, blocks);
      } catch (e) {
        warnings.push({
          page: pageNo,
          message: `\uD398\uC774\uC9C0 ${pageNo} OCR \uC2E4\uD328: ${e instanceof Error ? e.message : String(e)}`,
          code: "OCR_FAILED"
        });
      }
    }
  } finally {
    doc.destroy();
    pdfium.destroy();
  }
  return result;
}
async function ocrOnePage(page, pageNo, mode, engine, warnings, detectTables, vectorOps, regions) {
  const { originalWidth: pdfW, originalHeight: pdfH } = page.getOriginalSize();
  const renderScale = Math.min(OCR_RENDER_SCALE, Math.sqrt(MAX_OCR_PIXELS / Math.max(1, pdfW * pdfH)));
  if (renderScale < OCR_RENDER_SCALE) {
    warnings.push({ page: pageNo, code: "PARTIAL_PARSE", message: `OCR \uB798\uC2A4\uD130 \uD53D\uC140 \uC0C1\uD55C\uC73C\uB85C \uB80C\uB354 \uD574\uC0C1\uB3C4\uB97C \uCD95\uC18C\uD588\uC2B5\uB2C8\uB2E4 (\uC791\uC740 \uAE00\uC790 \uC778\uC2DD \uACB0\uC190 \uAC00\uB2A5)` });
  }
  const closer = regions && mode === "builtin" && renderScale * 2 <= Math.sqrt(MAX_OCR_PIXELS / Math.max(1, pdfW * pdfH));
  const rendered = await page.render({
    scale: closer ? renderScale * 2 : renderScale,
    render: async ({ data }) => data
  });
  const hiRgba = closer ? bgraToRgba(rendered.data) : null;
  const { rgba, width: rw, height: rh } = hiRgba ? halve(hiRgba, rendered.width, rendered.height) : { rgba: bgraToRgba(rendered.data), width: rendered.width, height: rendered.height };
  if (mode === "builtin") {
    const upright = vectorOps ? rgba : deskewPage(rgba, rw, rh).rgba;
    const stats = { droppedLowConf: 0 };
    const ruling = vectorOps ? void 0 : detectRulingLines(upright, rw, rh, rh / pdfH);
    const items = await engine.recognizePage(upright, rw, rh, stats, regions ? REGION_TUNING : void 0, ruling?.cellDividers);
    if (stats.droppedLowConf > 0) {
      warnings.push({
        page: pageNo,
        message: `\uD398\uC774\uC9C0 ${pageNo}: \uC800\uC2E0\uB8B0 OCR \uB77C\uC778 ${stats.droppedLowConf}\uAC1C \uD3D0\uAE30 (\uC778\uC2DD \uACB0\uC190 \uAC00\uB2A5)`,
        code: "OCR_LOW_CONF"
      });
    }
    if (stats.truncatedBoxes) {
      warnings.push({ page: pageNo, message: `\uD398\uC774\uC9C0 ${pageNo}: OCR \uAC80\uCD9C \uC0C1\uC790\uAC00 \uB108\uBB34 \uB9CE\uC544 ${stats.truncatedBoxes}\uAC1C\uB294 \uC778\uC2DD\uD558\uC9C0 \uC54A\uC74C (\uC77C\uBD80 \uAE00 \uACB0\uC190)`, code: "PARTIAL_PARSE" });
    }
    const scale = rh / pdfH;
    if (regions) {
      const inside = (it, r) => {
        const cx = (it.x + it.w / 2) / scale, cy = pdfH - (it.y + it.h / 2) / scale;
        return cx >= r.x1 && cx <= r.x2 && cy >= r.y1 && cy <= r.y2;
      };
      const reads = hiRgba ? await closerReads(hiRgba, rw * 2, rh * 2, pdfH, scale * 2, regions, engine) : [];
      return regions.flatMap((r, k) => {
        let own = items.filter((it) => inside(it, r));
        const near = reads[k];
        if (near?.length && meanConfidence(near) > meanConfidence(own)) own = near;
        return own.length ? ocrItemsToBlocks(own, pageNo, pdfW, pdfH, scale, ruling && rulingToPdfLines(ruling, scale, pdfH), detectTables) : [];
      });
    }
    if (vectorOps) return ocrItemsToBlocks(items, pageNo, pdfW, pdfH, scale, void 0, detectTables, vectorOps);
    const extraLines = rulingToPdfLines(ruling, scale, pdfH);
    return ocrItemsToBlocks(items, pageNo, pdfW, pdfH, scale, extraLines, detectTables);
  }
  const sharpModRaw = await tryImport2(
    "sharp",
    () => import(__extensionUrl("sharp"))
  );
  const sharpAny = sharpModRaw;
  const sharp = typeof sharpAny === "function" ? sharpAny : sharpAny.default ?? sharpAny;
  const png = await sharp(rgba, { raw: { width: rw, height: rh, channels: 4 } }).png().toBuffer();
  const text = await mode(new Uint8Array(png), pageNo, "image/png");
  if (!text.trim()) {
    warnings.push({ page: pageNo, message: `\uD398\uC774\uC9C0 ${pageNo} OCR \uACB0\uACFC \uC5C6\uC74C`, code: "OCR_FAILED" });
    return [];
  }
  return [{ type: "paragraph", text: text.trim(), pageNumber: pageNo }];
}
function halve(src, w, h) {
  const W = w >> 1, H = h >> 1;
  const out = new Uint8Array(W * H * 4);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const a = (2 * y * w + 2 * x) * 4, b = a + w * 4, o = (y * W + x) * 4;
    for (let c = 0; c < 4; c++) out[o + c] = src[a + c] + src[a + 4 + c] + src[b + c] + src[b + 4 + c] + 2 >> 2;
  }
  return { rgba: out, width: W, height: H };
}
var REGION_TUNING = Object.freeze({ ...DEFAULT_OCR_TUNING, trimEdges: false });
function meanConfidence(items) {
  let n = 0, sum = 0;
  for (const it of items) {
    const len = [...it.text].length;
    n += len;
    sum += it.confidence * len;
  }
  return n ? sum / n : 0;
}
async function closerReads(rgba, rw, rh, pdfH, hi, regions, engine) {
  const out = [];
  for (const r of regions) {
    const x0 = Math.max(0, Math.floor(r.x1 * hi)), y0 = Math.max(0, Math.floor((pdfH - r.y2) * hi));
    const cw = Math.min(rw, Math.ceil(r.x2 * hi)) - x0, ch = Math.min(rh, Math.ceil((pdfH - r.y1) * hi)) - y0;
    if (cw < 16 || ch < 16) {
      out.push(null);
      continue;
    }
    const crop = new Uint8Array(cw * ch * 4);
    for (let y = 0; y < ch; y++) crop.set(rgba.subarray(((y0 + y) * rw + x0) * 4, ((y0 + y) * rw + x0 + cw) * 4), y * cw * 4);
    const items = await engine.recognizePage(crop, cw, ch, void 0, REGION_TUNING);
    out.push(items.map((it) => ({ ...it, x: (it.x + x0) / 2, y: (it.y + y0) / 2, w: it.w / 2, h: it.h / 2 })));
  }
  return out;
}
function ocrItemsToBlocks(items, pageNumber, pdfW, pdfH, scale, extraLines, detectTables = true, opList = { fnArray: [], argsArray: [] }) {
  const norm = items.map((it) => {
    const h = it.h / scale;
    return {
      text: it.text,
      x: Math.round(it.x / scale),
      // NormItem.y 는 pdfjs transform[5] = 베이스라인 (bottom-up) — 잉크 하단으로 근사
      y: Math.round(pdfH - (it.y + it.h) / scale),
      w: Math.round(it.w / scale),
      h: Math.round(h),
      // 박스는 잉크 외곽(engine tightBoxes) — 한글 줄 잉크 높이 ≈ 0.9em
      fontSize: Math.max(1, Math.round(h / 0.9)),
      fontName: "ocr",
      isHidden: false
    };
  });
  return extractPageBlocksWithLines(norm, pageNumber, opList, pdfW, pdfH, extraLines, detectTables);
}
async function tryImport2(name, loader) {
  try {
    return await loader();
  } catch (e) {
    throw new Error(
      `OCR \uC744 \uC0AC\uC6A9\uD558\uB824\uBA74 optional dependency '${name}' \uC774 \uD544\uC694\uD569\uB2C8\uB2E4. \`npm install ${name}\` \uD6C4 \uB2E4\uC2DC \uC2E4\uD589\uD558\uC138\uC694.${OPTIONAL_DEP_INSTALL_HINT} \uC6D0\uC778: ${e.message}`
    );
  }
}
async function withTimeout(promise, ms, msg) {
  promise.catch(() => {
  });
  let timer;
  try {
    return await Promise.race([
      promise,
      new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error(msg)), ms);
      })
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}
function bgraToRgba(bgra) {
  const out = new Uint8Array(bgra.length);
  for (let i = 0; i < bgra.length; i += 4) {
    out[i] = bgra[i + 2];
    out[i + 1] = bgra[i + 1];
    out[i + 2] = bgra[i];
    out[i + 3] = bgra[i + 3];
  }
  return out;
}

export {
  detectRulingLines,
  rulingToPdfLines,
  getOcrEngine,
  deskewPage,
  MAX_OCR_PIXELS,
  runPdfOcr,
  ocrItemsToBlocks
};
