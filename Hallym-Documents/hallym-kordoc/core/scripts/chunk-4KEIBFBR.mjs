import {createRequire as __coreCreateRequire} from "node:module"; const require=__coreCreateRequire(import.meta.url); import {extensionUrl as __extensionUrl,extensionPath as __extensionPath} from "./extensions.mjs";
import {
  ensureModelsIn,
  getModelsDir
} from "./chunk-IF2FUB7X.mjs";
import {
  CELL_EDGES,
  HEADING_RATIO_H1,
  HEADING_RATIO_H2,
  HEADING_RATIO_H3,
  tidyScriptTags
} from "./chunk-HW7SKSEC.mjs";
import {
  safeMax,
  safeMin
} from "./chunk-PZTNOUTU.mjs";

// node_modules/kordoc/dist/chunk-ZNY5BRV6.js
import { join } from "path";
import { stat } from "fs/promises";
const { OPS } = await import(__extensionUrl("pdfjs-dist/legacy/build/pdf.mjs"));
const { OPS:OPS2 } = await import(__extensionUrl("pdfjs-dist/legacy/build/pdf.mjs"));
const { OPS:OPS3, ImageKind } = await import(__extensionUrl("pdfjs-dist/legacy/build/pdf.mjs"));
const { ImageKind:ImageKind2 } = await import(__extensionUrl("pdfjs-dist/legacy/build/pdf.mjs"));
var OCR_DET_MODEL = {
  name: "PP-OCRv5 mobile det",
  filename: "det.onnx",
  url: "https://huggingface.co/PaddlePaddle/PP-OCRv5_mobile_det_onnx/resolve/main/inference.onnx",
  sha256: "a431985659dc921974177a95adcfbb90fd9e51989a5e04d70d0b75f597b6e61d",
  sizeMb: 5
};
var OCR_REC_MODEL = {
  name: "PP-OCRv5 korean rec",
  filename: "rec_korean.onnx",
  url: "https://huggingface.co/PaddlePaddle/korean_PP-OCRv5_mobile_rec_onnx/resolve/main/inference.onnx",
  sha256: "92f0b7785e64fc9090106a241cf4c1eb97472824558272751b88a2a4476d3a08",
  sizeMb: 13
};
var OCR_REC_DICT = {
  name: "PP-OCRv5 korean dict",
  filename: "rec_korean.yml",
  url: "https://huggingface.co/PaddlePaddle/korean_PP-OCRv5_mobile_rec_onnx/resolve/main/inference.yml",
  sha256: "f757fa1c40e99edcf27e9cce879b93eb2a51fa46f5ef39095689b8c37dd75998",
  sizeMb: 1
};
var ALL_OCR_MODELS = [OCR_DET_MODEL, OCR_REC_MODEL, OCR_REC_DICT];
function getOcrModelsDir() {
  return getModelsDir("ppocr");
}
async function ensureOcrModels(onProgress) {
  return ensureModelsIn(getOcrModelsDir(), ALL_OCR_MODELS, onProgress);
}
async function ocrModelsCached() {
  const dir = getOcrModelsDir();
  for (const spec of ALL_OCR_MODELS) {
    try {
      if (!(await stat(join(dir, spec.filename))).size) return false;
    } catch {
      return false;
    }
  }
  return true;
}
function parseCharacterDict(yml) {
  const lines = yml.split("\n");
  const chars = [];
  let inDict = false;
  let dictIndent = -1;
  for (const line of lines) {
    if (!inDict) {
      const m2 = /^(\s*)character_dict:\s*$/.exec(line);
      if (m2) {
        inDict = true;
        dictIndent = m2[1].length;
      }
      continue;
    }
    const m = /^(\s*)- (.*)$/.exec(line);
    if (m && m[1].length >= dictIndent) {
      let v = m[2];
      if (v.length >= 2 && (v.startsWith("'") && v.endsWith("'") || v.startsWith('"') && v.endsWith('"'))) {
        v = v.slice(1, -1).replace(/''/g, "'");
      }
      chars.push(v);
      continue;
    }
    if (line.trim() !== "") break;
  }
  return chars;
}
var ORIENTATION_TOL = 2;
var MIN_LINE_LENGTH = 15;
var MAX_LINE_WIDTH = 5;
var THIN_FILL_MAX = 1.5;
var HIDDEN_FILL_TOL = 0.5;
function extractLines(fnArray, argsArray) {
  const horizontals = [];
  const verticals = [];
  const shortH = [];
  const shortV = [];
  const clipRects = [];
  const fillRects = [];
  let pathRects = [];
  let pathRectSegs = [];
  let fillColor = 0;
  const colorStack = [];
  let fillAlpha = 1, strokeAlpha = 1;
  const alphaStack = [];
  let strokeColor = 0;
  const strokeColorStack = [];
  const nonRules = /* @__PURE__ */ new Set();
  const hiddenBoxes = [];
  const paintedFills = /* @__PURE__ */ new Map();
  const thinFill = /* @__PURE__ */ new Set();
  const thinShortH = [];
  const thinShortV = [];
  let pendingClip = false;
  let lineWidth = 1;
  let ctm = [1, 0, 0, 1, 0, 0];
  const ctmStack = [];
  const applyCtm = (x, y) => [ctm[0] * x + ctm[2] * y + ctm[4], ctm[1] * x + ctm[3] * y + ctm[5]];
  const ctmScale = () => (Math.hypot(ctm[0], ctm[1]) + Math.hypot(ctm[2], ctm[3])) / 2;
  let currentPath = [];
  let pathStartX = 0, pathStartY = 0;
  let curX = 0, curY = 0;
  function pushSeg(x1, y1, x2, y2) {
    const [tx1, ty1] = applyCtm(x1, y1);
    const [tx2, ty2] = applyCtm(x2, y2);
    currentPath.push({ x1: tx1, y1: ty1, x2: tx2, y2: ty2 });
  }
  function pushRectangle(rx, ry, rw, rh) {
    const [ax, ay] = applyCtm(rx, ry), [bx, by] = applyCtm(rx + rw, ry + rh);
    pathRects.push({ x1: Math.min(ax, bx), y1: Math.min(ay, by), x2: Math.max(ax, bx), y2: Math.max(ay, by) });
    const effH = Math.abs(rh) * Math.hypot(ctm[2], ctm[3]);
    const effW = Math.abs(rw) * Math.hypot(ctm[0], ctm[1]);
    const start = currentPath.length;
    if (effH < ORIENTATION_TOL * 2) {
      pushSeg(rx, ry + rh / 2, rx + rw, ry + rh / 2);
    } else if (effW < ORIENTATION_TOL * 2) {
      pushSeg(rx + rw / 2, ry, rx + rw / 2, ry + rh);
    } else {
      pushSeg(rx, ry, rx + rw, ry);
      pushSeg(rx + rw, ry, rx + rw, ry + rh);
      pushSeg(rx + rw, ry + rh, rx, ry + rh);
      pushSeg(rx, ry + rh, rx, ry);
    }
    pathRectSegs.push({ start, end: currentPath.length, thin: Math.min(effH, effW) <= THIN_FILL_MAX });
  }
  function flushPath(isStroke, fromFill = false, filled = fromFill) {
    if (isStroke && (fromFill ? fillAlpha === 0 : strokeAlpha === 0 && !(filled && fillAlpha > 0))) {
      if (fromFill) {
        if (pathRects.length) hiddenBoxes.push(...pathRects);
        else captureClipRect(currentPath, hiddenBoxes);
      }
      pathRects = [];
      pathRectSegs = [];
      pendingClip = false;
      currentPath = [];
      return;
    }
    if (filled && fillAlpha === 0) filled = false;
    if (filled) {
      if (pathRects.length) for (const r of pathRects) fillRects.push(r);
      else captureClipRect(currentPath, fillRects, 0.3, 0.3);
    }
    const segRole = [];
    if (fromFill && pathRects.length) {
      const painted = paintedFills.get(fillColor) ?? [];
      pathRects.forEach((r, i) => {
        const segs = pathRectSegs[i];
        if (!segs) return;
        const hidden = painted.some((c) => r.x1 >= c.x1 - HIDDEN_FILL_TOL && r.x2 <= c.x2 + HIDDEN_FILL_TOL && r.y1 >= c.y1 - HIDDEN_FILL_TOL && r.y2 <= c.y2 + HIDDEN_FILL_TOL);
        const role = hidden ? "hidden" : segs.thin ? "thin" : void 0;
        for (let k = segs.start; k < segs.end; k++) segRole[k] = role;
      });
      for (const r of pathRects) painted.push(r);
      paintedFills.set(fillColor, painted);
    }
    const areaFill = fromFill && (pathRects.length > 0 || thickPath(currentPath));
    pathRects = [];
    pathRectSegs = [];
    if (!isStroke) {
      if (pendingClip) captureClipRect(currentPath, clipRects);
      pendingClip = false;
      currentPath = [];
      return;
    }
    pendingClip = false;
    const effWidth = lineWidth * ctmScale();
    const outs = [horizontals, verticals, shortH, shortV, thinShortH, thinShortV];
    const white = (fromFill ? fillColor : strokeColor) === 16777215;
    const from = white || areaFill ? outs.map((o) => o.length) : void 0;
    currentPath.forEach((seg, k) => {
      const role = segRole[k];
      if (role === "hidden") return;
      if (role === "thin") {
        const nh = horizontals.length, nv = verticals.length;
        classifyAndAdd(seg, effWidth, horizontals, verticals, fromFill, { h: thinShortH, v: thinShortV });
        for (const l of [...horizontals.slice(nh), ...verticals.slice(nv)]) thinFill.add(l);
        return;
      }
      classifyAndAdd(seg, effWidth, horizontals, verticals, fromFill, fromFill ? void 0 : { h: shortH, v: shortV });
    });
    if (from) outs.forEach((o, k) => {
      for (let n = from[k]; n < o.length; n++) if (white || k < 2 && !thinFill.has(o[n])) nonRules.add(o[n]);
    });
    currentPath = [];
  }
  for (let i = 0; i < fnArray.length; i++) {
    const op = fnArray[i];
    const args = argsArray[i];
    switch (op) {
      case OPS.setLineWidth:
        lineWidth = args[0] || 1;
        break;
      case OPS.save:
        ctmStack.push(ctm.slice());
        colorStack.push(fillColor);
        strokeColorStack.push(strokeColor);
        alphaStack.push([fillAlpha, strokeAlpha]);
        break;
      case OPS.restore:
        ctm = ctmStack.pop() ?? [1, 0, 0, 1, 0, 0];
        fillColor = colorStack.pop() ?? 0;
        strokeColor = strokeColorStack.pop() ?? 0;
        [fillAlpha, strokeAlpha] = alphaStack.pop() ?? [1, 1];
        break;
      case OPS.setGState: {
        const entries = args[0];
        if (!Array.isArray(entries)) break;
        for (const e of entries) {
          if (!Array.isArray(e) || typeof e[1] !== "number") continue;
          if (e[0] === "ca") fillAlpha = e[1];
          else if (e[0] === "CA") strokeAlpha = e[1];
        }
        break;
      }
      case OPS.setFillRGBColor: {
        const c = args;
        fillColor = c[0] << 16 | c[1] << 8 | c[2];
        break;
      }
      case OPS.setStrokeRGBColor: {
        const c = args;
        strokeColor = c[0] << 16 | c[1] << 8 | c[2];
        break;
      }
      case OPS.transform:
      case OPS.paintFormXObjectBegin: {
        let t = args;
        if (op === OPS.paintFormXObjectBegin) {
          ctmStack.push(ctm.slice());
          colorStack.push(fillColor);
          strokeColorStack.push(strokeColor);
          alphaStack.push([fillAlpha, strokeAlpha]);
          const m = args[0];
          if (!Array.isArray(m) || m.length < 6) break;
          t = m;
        }
        ctm = [
          ctm[0] * t[0] + ctm[2] * t[1],
          ctm[1] * t[0] + ctm[3] * t[1],
          ctm[0] * t[2] + ctm[2] * t[3],
          ctm[1] * t[2] + ctm[3] * t[3],
          ctm[0] * t[4] + ctm[2] * t[5] + ctm[4],
          ctm[1] * t[4] + ctm[3] * t[5] + ctm[5]
        ];
        break;
      }
      case OPS.paintFormXObjectEnd:
        ctm = ctmStack.pop() ?? [1, 0, 0, 1, 0, 0];
        fillColor = colorStack.pop() ?? 0;
        strokeColor = strokeColorStack.pop() ?? 0;
        [fillAlpha, strokeAlpha] = alphaStack.pop() ?? [1, 1];
        break;
      case OPS.constructPath: {
        const arg0 = args[0];
        if (Array.isArray(arg0)) {
          const subOps = arg0;
          const coords = args[1];
          let ci = 0;
          for (const subOp of subOps) {
            if (subOp === OPS.moveTo) {
              curX = coords[ci++];
              curY = coords[ci++];
              pathStartX = curX;
              pathStartY = curY;
            } else if (subOp === OPS.lineTo) {
              const x2 = coords[ci++], y2 = coords[ci++];
              pushSeg(curX, curY, x2, y2);
              curX = x2;
              curY = y2;
            } else if (subOp === OPS.rectangle) {
              const rx = coords[ci++], ry = coords[ci++];
              const rw = coords[ci++], rh = coords[ci++];
              pushRectangle(rx, ry, rw, rh);
            } else if (subOp === OPS.closePath) {
              if (curX !== pathStartX || curY !== pathStartY) {
                pushSeg(curX, curY, pathStartX, pathStartY);
              }
              curX = pathStartX;
              curY = pathStartY;
            } else if (subOp === OPS.curveTo) {
              ci += 6;
            } else if (subOp === OPS.curveTo2 || subOp === OPS.curveTo3) {
              ci += 4;
            }
          }
        } else {
          const afterOp = arg0;
          const dataArr = args[1];
          const pathData = dataArr?.[0];
          if (pathData && typeof pathData === "object") {
            const len = Object.keys(pathData).length;
            let di = 0;
            while (di < len) {
              const drawOp = pathData[di++];
              if (drawOp === 0) {
                curX = pathData[di++];
                curY = pathData[di++];
                pathStartX = curX;
                pathStartY = curY;
              } else if (drawOp === 1) {
                const x2 = pathData[di++], y2 = pathData[di++];
                pushSeg(curX, curY, x2, y2);
                curX = x2;
                curY = y2;
              } else if (drawOp === 2) {
                di += 6;
              } else if (drawOp === 3) {
                di += 4;
              } else if (drawOp === 4) {
                if (curX !== pathStartX || curY !== pathStartY) {
                  pushSeg(curX, curY, pathStartX, pathStartY);
                }
                curX = pathStartX;
                curY = pathStartY;
              } else {
                break;
              }
            }
          }
          if (afterOp === OPS.stroke || afterOp === OPS.closeStroke) {
            flushPath(true);
          } else if (afterOp === OPS.fill || afterOp === OPS.eoFill) {
            flushPath(true, true);
          } else if (afterOp === OPS.fillStroke || afterOp === OPS.eoFillStroke || afterOp === OPS.closeFillStroke || afterOp === OPS.closeEOFillStroke) {
            flushPath(true, false, true);
          } else if (afterOp === OPS.endPath) {
            flushPath(false);
          }
        }
        break;
      }
      case OPS.stroke:
      case OPS.closeStroke:
        flushPath(true);
        break;
      case OPS.fill:
      case OPS.eoFill:
        flushPath(true, true);
        break;
      case OPS.fillStroke:
      case OPS.eoFillStroke:
      case OPS.closeFillStroke:
      case OPS.closeEOFillStroke:
        flushPath(true, false, true);
        break;
      case OPS.endPath:
        flushPath(false);
        break;
      case OPS.clip:
      case OPS.eoClip:
        pendingClip = true;
        break;
    }
  }
  return {
    horizontals: chainShortSegments(horizontals, thinShortH, "h", (l) => thinFill.has(l)),
    verticals: chainShortSegments(verticals, thinShortV, "v", (l) => thinFill.has(l)),
    clipRects,
    fillRects,
    hiddenBoxes,
    shortH,
    shortV,
    nonRules
  };
}
var SHORT_CHAIN_POS_TOL = 0.5;
var SHORT_CHAIN_GAP = 0.2;
function chainShortSegments(longs, shorts, dir, chainable = (l) => !l.fromFill) {
  if (shorts.length === 0) return longs;
  const pos = (l) => dir === "h" ? l.y1 : l.x1;
  const lo = (l) => dir === "h" ? l.x1 : l.y1;
  const hi = (l) => dir === "h" ? l.x2 : l.y2;
  const shortSet = new Set(shorts);
  const all = [...longs.filter(chainable), ...shorts].sort((a, b) => pos(a) - pos(b) || lo(a) - lo(b));
  const absorbed = /* @__PURE__ */ new Set();
  const chained = [];
  const flush = (chain) => {
    if (!chain.some((l) => shortSet.has(l))) return;
    let s = Infinity, e = -Infinity, p = 0, w = 0;
    for (const l of chain) {
      s = Math.min(s, lo(l));
      e = Math.max(e, hi(l));
      p += pos(l);
      w = Math.max(w, l.lineWidth);
    }
    if (e - s < MIN_LINE_LENGTH) return;
    p /= chain.length;
    for (const l of chain) absorbed.add(l);
    const fill = chain.every((l) => l.fromFill) ? { fromFill: true } : {};
    chained.push(dir === "h" ? { x1: s, y1: p, x2: e, y2: p, lineWidth: w, ...fill } : { x1: p, y1: s, x2: p, y2: e, lineWidth: w, ...fill });
  };
  let band = [];
  const flushBand = () => {
    band.sort((a, b) => lo(a) - lo(b));
    let chain = [];
    let end = -Infinity;
    for (const l of band) {
      if (chain.length && lo(l) > end + SHORT_CHAIN_GAP) {
        flush(chain);
        chain = [];
      }
      chain.push(l);
      end = chain.length === 1 ? hi(l) : Math.max(end, hi(l));
    }
    if (chain.length) flush(chain);
    band = [];
  };
  for (const l of all) {
    if (band.length && pos(l) - pos(band[0]) > SHORT_CHAIN_POS_TOL) flushBand();
    band.push(l);
  }
  if (band.length) flushBand();
  if (chained.length === 0) return longs;
  return [...longs.filter((l) => !absorbed.has(l)), ...chained];
}
var CLIP_MIN_W = 4;
var CLIP_MIN_H = 2;
function thickPath(path) {
  if (!path.length) return false;
  let x1 = Infinity, y1 = Infinity, x2 = -Infinity, y2 = -Infinity;
  for (const s of path) {
    x1 = Math.min(x1, s.x1, s.x2);
    x2 = Math.max(x2, s.x1, s.x2);
    y1 = Math.min(y1, s.y1, s.y2);
    y2 = Math.max(y2, s.y1, s.y2);
  }
  return Math.min(x2 - x1, y2 - y1) > THIN_FILL_MAX;
}
function captureClipRect(path, out, minW = CLIP_MIN_W, minH = CLIP_MIN_H) {
  if (path.length < 3 || path.length > 5) return;
  let x1 = Infinity, y1 = Infinity, x2 = -Infinity, y2 = -Infinity;
  for (const s of path) {
    const dx = Math.abs(s.x2 - s.x1), dy = Math.abs(s.y2 - s.y1);
    if (dx > ORIENTATION_TOL && dy > ORIENTATION_TOL) return;
    x1 = Math.min(x1, s.x1, s.x2);
    x2 = Math.max(x2, s.x1, s.x2);
    y1 = Math.min(y1, s.y1, s.y2);
    y2 = Math.max(y2, s.y1, s.y2);
  }
  if (x2 - x1 < minW || y2 - y1 < minH) return;
  out.push({ x1, y1, x2, y2 });
}
function classifyAndAdd(seg, lineWidth, horizontals, verticals, fromFill = false, short) {
  const dx = Math.abs(seg.x2 - seg.x1);
  const dy = Math.abs(seg.y2 - seg.y1);
  const length = Math.sqrt(dx * dx + dy * dy);
  if (length < MIN_LINE_LENGTH) {
    if (!short || length <= 0) return;
    if (dy <= ORIENTATION_TOL && dx > dy) {
      const y = (seg.y1 + seg.y2) / 2;
      short.h.push({ x1: Math.min(seg.x1, seg.x2), y1: y, x2: Math.max(seg.x1, seg.x2), y2: y, lineWidth, fromFill });
    } else if (dx <= ORIENTATION_TOL && dy > dx) {
      const x = (seg.x1 + seg.x2) / 2;
      short.v.push({ x1: x, y1: Math.min(seg.y1, seg.y2), x2: x, y2: Math.max(seg.y1, seg.y2), lineWidth, fromFill });
    }
    return;
  }
  if (dy <= ORIENTATION_TOL) {
    const y = (seg.y1 + seg.y2) / 2;
    const x1 = Math.min(seg.x1, seg.x2);
    const x2 = Math.max(seg.x1, seg.x2);
    horizontals.push({ x1, y1: y, x2, y2: y, lineWidth, fromFill });
  } else if (dx <= ORIENTATION_TOL) {
    const x = (seg.x1 + seg.x2) / 2;
    const y1 = Math.min(seg.y1, seg.y2);
    const y2 = Math.max(seg.y1, seg.y2);
    verticals.push({ x1: x, y1, x2: x, y2, lineWidth, fromFill });
  }
}
function preprocessLines(horizontals, verticals, nonRules) {
  let h = horizontals.filter((l) => l.lineWidth <= MAX_LINE_WIDTH);
  let v = verticals.filter((l) => l.lineWidth <= MAX_LINE_WIDTH);
  h = dropShadingStacks(h, "h");
  v = dropShadingStacks(v, "v");
  h = mergeParallelLines(h, "h", nonRules);
  v = mergeParallelLines(v, "v", nonRules);
  return { horizontals: h, verticals: v };
}
var STACK_GAP = 2;
var STACK_MIN_LINES = 6;
function dropShadingStacks(lines, dir) {
  if (lines.length < STACK_MIN_LINES) return lines;
  const groups = /* @__PURE__ */ new Map();
  for (const l of lines) {
    const key = dir === "h" ? `${Math.round(l.x1)}:${Math.round(l.x2)}` : `${Math.round(l.y1)}:${Math.round(l.y2)}`;
    const arr = groups.get(key);
    if (arr) arr.push(l);
    else groups.set(key, [l]);
  }
  const dropped = /* @__PURE__ */ new Set();
  const coord = (l) => dir === "h" ? l.y1 : l.x1;
  for (const group of groups.values()) {
    if (group.length < STACK_MIN_LINES) continue;
    group.sort((a, b) => coord(a) - coord(b));
    let runStart = 0;
    for (let i = 1; i <= group.length; i++) {
      const gap = i < group.length ? coord(group[i]) - coord(group[i - 1]) : Infinity;
      if (gap < STACK_GAP) continue;
      if (i - runStart >= STACK_MIN_LINES) {
        let s = runStart;
        let e = i - 1;
        const wKey = (l) => Math.round(l.lineWidth * 100);
        const wCount = /* @__PURE__ */ new Map();
        for (let j = s; j <= e; j++) wCount.set(wKey(group[j]), (wCount.get(wKey(group[j])) ?? 0) + 1);
        let domW = 0;
        let domN = 0;
        for (const [w, n] of wCount) if (n > domN) {
          domW = w;
          domN = n;
        }
        const pitches = [];
        for (let j = s + 1; j <= e; j++) pitches.push(coord(group[j]) - coord(group[j - 1]));
        pitches.sort((a, b) => a - b);
        const medPitch = pitches[Math.floor(pitches.length / 2)] ?? 0;
        let fillN = 0;
        for (let j = s; j <= e; j++) if (group[j].fromFill) fillN++;
        const stackIsFill = fillN * 2 > e - s + 1;
        const edgeAlien = (j, inwardGap) => stackIsFill && !group[j].fromFill || wKey(group[j]) !== domW || medPitch > 0 && inwardGap > medPitch * 1.8;
        while (e - s + 1 >= STACK_MIN_LINES) {
          if (edgeAlien(s, coord(group[s + 1]) - coord(group[s]))) {
            s++;
            continue;
          }
          if (edgeAlien(e, coord(group[e]) - coord(group[e - 1]))) {
            e--;
            continue;
          }
          break;
        }
        if (e - s + 1 >= STACK_MIN_LINES) {
          for (let j = s; j <= e; j++) dropped.add(group[j]);
        }
      }
      runStart = i;
    }
  }
  return dropped.size ? lines.filter((l) => !dropped.has(l)) : lines;
}
var EDGE_ALIGN_TOL = 3;
var EDGE_MIN_RULES = 3;
var EDGE_MIN_SPAN = 12;
var EDGE_INSET = 15;
var EDGE_NEAR = 10;
var EDGE_CONNECT_TOL = 5;
var EDGE_YGAP_SPLIT_K = 2.5;
var EDGE_YGAP_ABS_MIN = 30;
var CHAIN_Y_TOL = 1.5;
var CHAIN_GAP = 3;
function chainCollinearRules(horizontals) {
  if (horizontals.length <= 1) return horizontals;
  const sorted = [...horizontals].sort((a, b) => a.y1 - b.y1 || a.x1 - b.x1);
  const rules2 = [];
  let bandStart = 0;
  const flushBand = (end) => {
    const band = sorted.slice(bandStart, end).sort((a, b) => a.x1 - b.x1);
    let cur = { ...band[0] };
    for (let i = 1; i < band.length; i++) {
      const seg = band[i];
      if (seg.x1 - cur.x2 <= CHAIN_GAP) {
        if (seg.x2 > cur.x2) cur.x2 = seg.x2;
        if (seg.lineWidth > cur.lineWidth) cur.lineWidth = seg.lineWidth;
      } else {
        rules2.push(cur);
        cur = { ...seg };
      }
    }
    rules2.push(cur);
  };
  for (let i = 1; i <= sorted.length; i++) {
    if (i === sorted.length || sorted[i].y1 - sorted[bandStart].y1 > CHAIN_Y_TOL) {
      flushBand(i);
      bandStart = i;
    }
  }
  return rules2;
}
function closeOpenTableEdges(horizontals, verticals) {
  if (horizontals.length < EDGE_MIN_RULES) return verticals;
  const groups = [];
  for (const hl of chainCollinearRules(horizontals)) {
    let placed = false;
    for (const g of groups) {
      if (Math.abs(g[0].x1 - hl.x1) <= EDGE_ALIGN_TOL && Math.abs(g[0].x2 - hl.x2) <= EDGE_ALIGN_TOL) {
        g.push(hl);
        placed = true;
        break;
      }
    }
    if (!placed) groups.push([hl]);
  }
  const splitGroups = [];
  for (const g of groups) {
    const sorted = [...g].sort((a, b) => a.y1 - b.y1);
    const gaps = [];
    for (let i = 1; i < sorted.length; i++) gaps.push(sorted[i].y1 - sorted[i - 1].y1);
    const median2 = gaps.length ? [...gaps].sort((a, b) => a - b)[gaps.length >> 1] : 0;
    const threshold = median2 * EDGE_YGAP_SPLIT_K;
    let cur = sorted.length ? [sorted[0]] : [];
    for (let i = 1; i < sorted.length; i++) {
      const yLo = sorted[i - 1].y1, yHi = sorted[i].y1;
      const gap = yHi - yLo;
      const gx1 = Math.min(sorted[i - 1].x1, sorted[i].x1);
      const gx2 = Math.max(sorted[i - 1].x2, sorted[i].x2);
      const bridged = verticals.some((vl) => vl.y1 <= yLo + EDGE_NEAR && vl.y2 >= yHi - EDGE_NEAR && vl.x1 >= gx1 - EDGE_CONNECT_TOL && vl.x1 <= gx2 + EDGE_CONNECT_TOL);
      if (median2 > 0 && gap > threshold && gap > EDGE_YGAP_ABS_MIN && !bridged && cur.length >= EDGE_MIN_RULES && sorted.length - i >= EDGE_MIN_RULES) {
        splitGroups.push(cur);
        cur = [];
      }
      cur.push(sorted[i]);
    }
    if (cur.length) splitGroups.push(cur);
  }
  const synthesized = [];
  for (const g of splitGroups) {
    if (g.length < EDGE_MIN_RULES) continue;
    let yMin = Infinity, yMax = -Infinity, x1 = 0, x2 = 0;
    for (const hl of g) {
      if (hl.y1 < yMin) yMin = hl.y1;
      if (hl.y1 > yMax) yMax = hl.y1;
      x1 += hl.x1;
      x2 += hl.x2;
    }
    x1 /= g.length;
    x2 /= g.length;
    if (yMax - yMin < EDGE_MIN_SPAN) continue;
    const crossCount = (v) => {
      let n = 0;
      for (const hl of g) {
        if (v.x1 >= hl.x1 - EDGE_CONNECT_TOL && v.x1 <= hl.x2 + EDGE_CONNECT_TOL && hl.y1 >= v.y1 - EDGE_CONNECT_TOL && hl.y1 <= v.y2 + EDGE_CONNECT_TOL) n++;
      }
      return n;
    };
    const hasInterior = verticals.some((v) => v.x1 > x1 + EDGE_INSET && v.x1 < x2 - EDGE_INSET && crossCount(v) >= 2);
    if (!hasInterior) continue;
    for (const edgeX of [x1, x2]) {
      const closed2 = verticals.some((v) => Math.abs(v.x1 - edgeX) <= EDGE_NEAR && v.y1 <= yMax + EDGE_CONNECT_TOL && v.y2 >= yMin - EDGE_CONNECT_TOL);
      if (!closed2) {
        synthesized.push({ x1: edgeX, y1: yMin, x2: edgeX, y2: yMax, lineWidth: 0.5 });
      }
    }
  }
  return synthesized.length ? [...verticals, ...synthesized] : verticals;
}
function mergeParallelLines(lines, dir, nonRules) {
  if (lines.length <= 1) return lines;
  const sorted = [...lines].sort((a, b) => {
    const posA = dir === "h" ? a.y1 : a.x1;
    const posB = dir === "h" ? b.y1 : b.x1;
    if (Math.abs(posA - posB) > 0.1) return posA - posB;
    return dir === "h" ? a.x1 - b.x1 : a.y1 - b.y1;
  });
  const MERGE_TOL = 3;
  const result = [sorted[0]];
  for (let i = 1; i < sorted.length; i++) {
    const prev = result[result.length - 1];
    const curr = sorted[i];
    const prevPos = dir === "h" ? prev.y1 : prev.x1;
    const currPos = dir === "h" ? curr.y1 : curr.x1;
    if (Math.abs(prevPos - currPos) <= MERGE_TOL) {
      const prevStart = dir === "h" ? prev.x1 : prev.y1;
      const prevEnd = dir === "h" ? prev.x2 : prev.y2;
      const currStart = dir === "h" ? curr.x1 : curr.y1;
      const currEnd = dir === "h" ? curr.x2 : curr.y2;
      const overlap2 = Math.min(prevEnd, currEnd) - Math.max(prevStart, currStart);
      const minLen = Math.min(prevEnd - prevStart, currEnd - currStart);
      if (overlap2 > minLen * 0.3) {
        if (nonRules?.has(prev) && !nonRules.has(curr)) nonRules.delete(prev);
        if (dir === "h") {
          prev.x1 = Math.min(prev.x1, curr.x1);
          prev.x2 = Math.max(prev.x2, curr.x2);
          prev.y1 = (prev.y1 + curr.y1) / 2;
          prev.y2 = prev.y1;
        } else {
          prev.y1 = Math.min(prev.y1, curr.y1);
          prev.y2 = Math.max(prev.y2, curr.y2);
          prev.x1 = (prev.x1 + curr.x1) / 2;
          prev.x2 = prev.x1;
        }
        prev.lineWidth = Math.max(prev.lineWidth, curr.lineWidth);
        continue;
      }
    }
    result.push(curr);
  }
  return result;
}
function filterPageBorderLines(horizontals, verticals, pageWidth, pageHeight) {
  const margin = 5;
  return {
    horizontals: horizontals.filter(
      (l) => !(Math.abs(l.y1) < margin || Math.abs(l.y1 - pageHeight) < margin) || l.x2 - l.x1 < pageWidth * 0.9
    ),
    verticals: verticals.filter(
      (l) => !(Math.abs(l.x1) < margin || Math.abs(l.x1 - pageWidth) < margin) || l.y2 - l.y1 < pageHeight * 0.9
    )
  };
}
function multiplyTransform(m, t) {
  return [
    m[0] * t[0] + m[2] * t[1],
    m[1] * t[0] + m[3] * t[1],
    m[0] * t[2] + m[2] * t[3],
    m[1] * t[2] + m[3] * t[3],
    m[0] * t[4] + m[2] * t[5] + m[4],
    m[1] * t[4] + m[3] * t[5] + m[5]
  ];
}
function transformedRect(ctm, x, y, w, h) {
  const corners = [[x, y], [x + w, y], [x, y + h], [x + w, y + h]];
  const xs = corners.map(([u, v]) => ctm[0] * u + ctm[2] * v + ctm[4]);
  const ys = corners.map(([u, v]) => ctm[1] * u + ctm[3] * v + ctm[5]);
  return { x1: Math.min(...xs), y1: Math.min(...ys), x2: Math.max(...xs), y2: Math.max(...ys) };
}
function intersect(a, b) {
  return b ? { x1: Math.max(a.x1, b.x1), y1: Math.max(a.y1, b.y1), x2: Math.min(a.x2, b.x2), y2: Math.min(a.y2, b.y2) } : a;
}
function extractImageRegions(fnArray, argsArray, respectClip = false) {
  const regions = [];
  let ctm = [1, 0, 0, 1, 0, 0];
  let clip = null;
  const stack = [];
  let pathRect;
  let pendingClip = false;
  for (let i = 0; i < fnArray.length; i++) {
    const op = fnArray[i];
    switch (op) {
      case OPS2.save:
        stack.push({ ctm, clip });
        break;
      case OPS2.restore: {
        const state = stack.pop();
        ctm = state?.ctm ?? [1, 0, 0, 1, 0, 0];
        clip = state?.clip ?? null;
        break;
      }
      case OPS2.transform: {
        const t = argsArray[i];
        if (Array.isArray(t) && t.length >= 6) ctm = multiplyTransform(ctm, t);
        break;
      }
      // Form XObject 는 /Matrix 공간에서 그린다 — pdfjs 인자 [matrix, bbox], End 에서 복원 (line-extract.ts 와 같음)
      case OPS2.paintFormXObjectBegin: {
        stack.push({ ctm, clip });
        const m = argsArray[i]?.[0];
        if (Array.isArray(m) && m.length >= 6) ctm = multiplyTransform(ctm, m);
        break;
      }
      case OPS2.paintFormXObjectEnd: {
        const state = stack.pop();
        ctm = state?.ctm ?? [1, 0, 0, 1, 0, 0];
        clip = state?.clip ?? null;
        break;
      }
      case OPS2.constructPath: {
        const [ops, coords] = argsArray[i];
        pathRect = pathRect === void 0 && ops?.length === 1 && ops[0] === OPS2.rectangle && coords?.length >= 4 ? transformedRect(ctm, coords[0], coords[1], coords[2], coords[3]) : null;
        break;
      }
      case OPS2.clip:
      case OPS2.eoClip:
        pendingClip = true;
        break;
      case OPS2.endPath:
      case OPS2.stroke:
      case OPS2.closeStroke:
      case OPS2.fill:
      case OPS2.eoFill:
      case OPS2.fillStroke:
      case OPS2.eoFillStroke:
      case OPS2.closeFillStroke:
      case OPS2.closeEOFillStroke:
        if (respectClip && pendingClip && pathRect) clip = intersect(pathRect, clip);
        pathRect = void 0;
        pendingClip = false;
        break;
      case OPS2.paintImageXObject:
      case OPS2.paintInlineImageXObject:
      case OPS2.paintImageMaskXObject:
      case OPS2.paintImageXObjectRepeat: {
        const { x1, y1, x2, y2 } = intersect(transformedRect(ctm, 0, 0, 1, 1), clip);
        if (x2 - x1 > 0 && y2 - y1 > 0) regions.push({ x1, y1, x2, y2 });
        break;
      }
    }
  }
  return regions;
}
var BRIDGE_X_TOL = 1.5;
var BRIDGE_MIN_GAP = 5;
var BRIDGE_MAX_GAP = 120;
var BRIDGE_BAND_TOL = 6;
var BRIDGE_MIN_COLUMNS = 3;
var BRIDGE_ENDPOINT_TOL = 2;
var BRIDGE_EDGE_EPS = 2;
function bridgeSplitColumnVerticals(horizontals, verticals) {
  if (verticals.length < 4 || horizontals.length === 0) return verticals;
  const sorted = [...verticals].sort((a, b) => a.x1 - b.x1 || a.y1 - b.y1);
  const candidates = [];
  let bandStart = 0;
  const collectBand = (end) => {
    const band = sorted.slice(bandStart, end).sort((a, b) => a.y1 - b.y1);
    for (let i = 1; i < band.length; i++) {
      const lower = band[i - 1], upper = band[i];
      const gap = upper.y1 - lower.y2;
      if (gap <= BRIDGE_MIN_GAP || gap > BRIDGE_MAX_GAP) continue;
      const x = (lower.x1 + upper.x1) / 2;
      const hasInteriorH = horizontals.some((h) => h.y1 > lower.y2 + BRIDGE_EDGE_EPS && h.y1 < upper.y1 - BRIDGE_EDGE_EPS && h.x1 <= x + BRIDGE_ENDPOINT_TOL && h.x2 >= x - BRIDGE_ENDPOINT_TOL);
      if (!hasInteriorH) continue;
      candidates.push({
        x,
        lo: lower.y2,
        hi: upper.y1,
        spanLo: lower.y1,
        spanHi: upper.y2,
        lineWidth: Math.min(lower.lineWidth, upper.lineWidth)
      });
    }
  };
  for (let i = 1; i <= sorted.length; i++) {
    if (i === sorted.length || sorted[i].x1 - sorted[bandStart].x1 > BRIDGE_X_TOL) {
      collectBand(i);
      bandStart = i;
    }
  }
  if (candidates.length < BRIDGE_MIN_COLUMNS) return verticals;
  const clusters = [];
  for (const c of candidates) {
    let placed = false;
    for (const cl of clusters) {
      if (Math.abs(cl[0].lo - c.lo) <= BRIDGE_BAND_TOL && Math.abs(cl[0].hi - c.hi) <= BRIDGE_BAND_TOL) {
        cl.push(c);
        placed = true;
        break;
      }
    }
    if (!placed) clusters.push([c]);
  }
  const synthesized = [];
  for (const cl of clusters) {
    if (cl.length < BRIDGE_MIN_COLUMNS) continue;
    const xs = cl.map((c) => c.x).sort((a, b) => a - b);
    const interiorXs = xs.slice(1, -1);
    const bandLo = Math.min(...cl.map((c) => c.lo));
    const bandHi = Math.max(...cl.map((c) => c.hi));
    const segmented = horizontals.some((h) => h.y1 > bandLo + BRIDGE_EDGE_EPS && h.y1 < bandHi - BRIDGE_EDGE_EPS && interiorXs.some((ix) => Math.abs(h.x1 - ix) <= BRIDGE_ENDPOINT_TOL || Math.abs(h.x2 - ix) <= BRIDGE_ENDPOINT_TOL));
    if (!segmented) continue;
    for (const c of cl) {
      synthesized.push({ x1: c.x, y1: c.spanLo, x2: c.x, y2: c.spanHi, lineWidth: c.lineWidth });
    }
  }
  return synthesized.length ? [...verticals, ...synthesized] : verticals;
}
function bridgeSkippedRowVerticals(horizontals, verticals, items) {
  if (verticals.length < 6 || items.length === 0) return verticals;
  const byX = /* @__PURE__ */ new Map();
  for (const v of verticals) {
    const key = [...byX.keys()].find((k) => Math.abs(k - v.x1) <= BRIDGE_X_TOL) ?? v.x1;
    byX.set(key, [...byX.get(key) ?? [], v]);
  }
  const gaps = [];
  for (const [x, segs] of byX) {
    const s = [...segs].sort((a, b) => a.y1 - b.y1);
    for (let i = 1; i < s.length; i++) {
      const lo = s[i - 1].y2, hi = s[i].y1;
      if (hi - lo > BRIDGE_MIN_GAP && hi - lo <= 40) gaps.push({ x, lo, hi, spanLo: s[i - 1].y1, spanHi: s[i].y2 });
    }
  }
  const rules2 = chainCollinearRules(horizontals);
  const added = [];
  const done = /* @__PURE__ */ new Set();
  for (const g of gaps) {
    if (done.has(g)) continue;
    const band = gaps.filter((o) => Math.abs(o.lo - g.lo) <= BRIDGE_BAND_TOL / 3 && Math.abs(o.hi - g.hi) <= BRIDGE_BAND_TOL / 3);
    for (const o of band) done.add(o);
    if (band.length < BRIDGE_MIN_COLUMNS) continue;
    const xs = band.map((o) => o.x);
    const x1 = Math.min(...xs), x2 = Math.max(...xs);
    const ruled = (y) => rules2.some((h) => Math.abs(h.y1 - y) <= BRIDGE_ENDPOINT_TOL && h.x1 <= x1 + BRIDGE_ENDPOINT_TOL && h.x2 >= x2 - BRIDGE_ENDPOINT_TOL);
    if (!ruled(g.lo) || !ruled(g.hi)) continue;
    const rowItems = items.filter((it) => {
      const cy = it.y + (it.h || it.fontSize) / 2;
      return cy > g.lo && cy < g.hi;
    });
    if (rowItems.length === 0 || rowItems.some((it) => xs.some((x) => it.x < x - 1 && it.x + it.w > x + 1))) continue;
    for (const o of band) added.push({ x1: o.x, y1: o.spanLo, x2: o.x, y2: o.spanHi, lineWidth: 0.5 });
  }
  return added.length ? [...verticals, ...added] : verticals;
}
var VERTEX_MERGE_FACTOR = 4;
var CONNECT_TOL = 5;
var MIN_COL_WIDTH = 15;
var MIN_ROW_HEIGHT = 6;
var MIN_COORD_MERGE_TOL = 8;
var CUT_FULLWIDTH_RATIO = 0.9;
var CUT_CROSS_EPS = 2;
var CUT_MIN_SIDE_VERTICALS = 2;
var CUT_EDGE_MARGIN = 12;
var CUT_INTERIOR_MATCH_TOL = 8;
var CUT_MAX_INTERIOR_OVERLAP = 0.5;
var CUT_VCHAIN_X_TOL = 1.5;
var CUT_VCHAIN_GAP = 1;
var NEST_STRICT_TOL = 0.5;
var NEST_MIN_GAP = 0.8;
var NEST_EDGE_COVER = 0.95;
var NEST_DOUBLE_RULE_GAP = 6;
var VERTEX_BUCKET_CELL = 100;
function lowerBound(sorted, key) {
  let lo = 0, hi = sorted.length;
  while (lo < hi) {
    const mid = lo + hi >> 1;
    if (sorted[mid] < key) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}
function buildVertices(horizontals, verticals) {
  const vertices = [];
  const tol = CONNECT_TOL;
  const queried = [...new Set(horizontals.map((h) => Math.floor(h.y1 / VERTEX_BUCKET_CELL)))].filter(Number.isFinite).sort((a, b) => a - b);
  const buckets = /* @__PURE__ */ new Map();
  for (const v of verticals) {
    const b1 = Math.floor((v.y1 - tol) / VERTEX_BUCKET_CELL);
    const b2 = Math.floor((v.y2 + tol) / VERTEX_BUCKET_CELL);
    for (let k = lowerBound(queried, b1); k < queried.length && queried[k] <= b2; k++) {
      const b = queried[k];
      const arr = buckets.get(b);
      if (arr) arr.push(v);
      else buckets.set(b, [v]);
    }
  }
  for (const h of horizontals) {
    const cand = buckets.get(Math.floor(h.y1 / VERTEX_BUCKET_CELL));
    if (!cand) continue;
    for (const v of cand) {
      if (v.x1 >= h.x1 - tol && v.x1 <= h.x2 + tol && h.y1 >= v.y1 - tol && h.y1 <= v.y2 + tol) {
        const radius = Math.max(h.lineWidth, v.lineWidth, 1);
        vertices.push({ x: v.x1, y: h.y1, radius });
      }
    }
  }
  return vertices;
}
function mergeVertices(vertices) {
  if (vertices.length <= 1) return vertices;
  let maxRadiusAll = 1;
  for (const v of vertices) {
    if (v.radius > maxRadiusAll) maxRadiusAll = v.radius;
  }
  const cell = Math.max(VERTEX_MERGE_FACTOR * maxRadiusAll, 1);
  const buckets = /* @__PURE__ */ new Map();
  for (let i = 0; i < vertices.length; i++) {
    const cx = Math.floor(vertices[i].x / cell);
    const cy = Math.floor(vertices[i].y / cell);
    let column = buckets.get(cx);
    if (!column) {
      column = /* @__PURE__ */ new Map();
      buckets.set(cx, column);
    }
    const arr = column.get(cy);
    if (arr) arr.push(i);
    else column.set(cy, [i]);
  }
  const merged = [];
  const used = new Array(vertices.length).fill(false);
  for (let i = 0; i < vertices.length; i++) {
    if (used[i]) continue;
    let sumX = vertices[i].x, sumY = vertices[i].y;
    let maxRadius = vertices[i].radius;
    let count = 1;
    const cx = Math.floor(vertices[i].x / cell);
    const cy = Math.floor(vertices[i].y / cell);
    const candidates = [];
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const arr = buckets.get(cx + dx)?.get(cy + dy);
        if (!arr) continue;
        for (const j of arr) {
          if (j > i && !used[j]) candidates.push(j);
        }
      }
    }
    candidates.sort((a, b) => a - b);
    for (const j of candidates) {
      if (used[j]) continue;
      const mergeTol = VERTEX_MERGE_FACTOR * Math.max(maxRadius, vertices[j].radius);
      if (Math.abs(vertices[i].x - vertices[j].x) <= mergeTol && Math.abs(vertices[i].y - vertices[j].y) <= mergeTol) {
        sumX += vertices[j].x;
        sumY += vertices[j].y;
        maxRadius = Math.max(maxRadius, vertices[j].radius);
        count++;
        used[j] = true;
      }
    }
    merged.push({ x: sumX / count, y: sumY / count, radius: maxRadius });
  }
  return merged;
}
function buildTableGrids(horizontals, verticals) {
  if (horizontals.length < 2 || verticals.length < 2) return [];
  const allVertices = buildVertices(horizontals, verticals);
  const vertices = mergeVertices(allVertices);
  if (vertices.length < 4) return [];
  const globalRadius = vertices.reduce((max, v) => Math.max(max, v.radius), 1);
  const allLines = [
    ...horizontals.map((l, i) => ({ ...l, type: "h", id: i })),
    ...verticals.map((l, i) => ({ ...l, type: "v", id: i + horizontals.length }))
  ];
  const groups = [];
  for (const g0 of groupConnectedLines(allLines)) {
    const { outer: g, nested } = splitNestedBoxes(g0);
    for (const n of nested) groups.push({ lines: n, fromSplit: true, nested: true });
    if (g.length === 0) continue;
    const bands = splitStackedGroup(g);
    for (const b of bands) groups.push({ lines: b, fromSplit: bands.length > 1 || nested.length > 0 });
  }
  const grids = [];
  const byY = [...vertices].sort((a, b) => a.y - b.y);
  const vertexYs = byY.map((v) => v.y);
  const lowerBoundY = (key) => {
    let lo = 0, hi = vertexYs.length;
    while (lo < hi) {
      const mid = lo + hi >> 1;
      if (vertexYs[mid] < key) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  };
  for (const { lines: group, fromSplit, nested } of groups) {
    const hLines = group.filter((l) => l.type === "h");
    const vLines = group.filter((l) => l.type === "v");
    if (hLines.length < 2 || vLines.length < 2) continue;
    let gx1 = Infinity, gy1 = Infinity, gx2 = -Infinity, gy2 = -Infinity;
    for (const l of vLines) {
      if (l.x1 < gx1) gx1 = l.x1;
      if (l.x1 > gx2) gx2 = l.x1;
    }
    for (const l of hLines) {
      if (l.y1 < gy1) gy1 = l.y1;
      if (l.y1 > gy2) gy2 = l.y1;
    }
    const groupBbox = {
      x1: gx1 - CONNECT_TOL,
      y1: gy1 - CONNECT_TOL,
      x2: gx2 + CONNECT_TOL,
      y2: gy2 + CONNECT_TOL
    };
    let groupVertices;
    if (fromSplit) {
      groupVertices = mergeVertices(buildVertices(hLines, vLines));
    } else {
      groupVertices = [];
      for (let k = lowerBoundY(groupBbox.y1); k < byY.length && vertexYs[k] <= groupBbox.y2; k++) {
        const v = byY[k];
        if (v.x >= groupBbox.x1 && v.x <= groupBbox.x2) groupVertices.push(v);
      }
    }
    const groupRadius = groupVertices.length > 0 ? groupVertices.reduce((max, v) => Math.max(max, v.radius), 1) : globalRadius;
    const coordMergeTol = Math.max(VERTEX_MERGE_FACTOR * groupRadius, MIN_COORD_MERGE_TOL);
    const leftEdge = Math.min(...vLines.map((v) => v.x1));
    const rightEdge = Math.max(...vLines.map((v) => v.x1));
    const underlines = hLines.filter((h) => {
      const crossings = /* @__PURE__ */ new Set();
      for (const v of vLines) {
        if (v.x1 >= h.x1 - CONNECT_TOL && v.x1 <= h.x2 + CONNECT_TOL && h.y1 >= v.y1 - CONNECT_TOL && h.y1 <= v.y2 + CONNECT_TOL) crossings.add(v.x1);
      }
      return crossings.size === 1 && Math.abs(h.x2 - rightEdge) <= CONNECT_TOL && h.x1 > (leftEdge + rightEdge) / 2 && h.x2 - h.x1 < (rightEdge - leftEdge) * 0.6;
    });
    const rowLines = underlines.length >= 3 && hLines.length - underlines.length <= 4 ? hLines.filter((h) => !underlines.includes(h)) : hLines;
    const rowVertices = rowLines.length === hLines.length ? groupVertices : groupVertices.filter((v) => rowLines.some((h) => Math.abs(v.y - h.y1) <= CONNECT_TOL));
    const rawYs = [
      ...rowLines.map((l) => l.y1),
      ...rowVertices.map((v) => v.y)
    ];
    const rowYs = clusterCoordinates(rawYs, coordMergeTol).sort((a, b) => b - a);
    const rawXs = [
      ...vLines.map((l) => l.x1),
      ...groupVertices.map((v) => v.x)
    ];
    const colXs = clusterCoordinates(rawXs, coordMergeTol).sort((a, b) => a - b);
    if (rowYs.length < 2 || colXs.length < 2) continue;
    const validColXs = enforceMinWidth(colXs, MIN_COL_WIDTH);
    const validRowYs = enforceMinHeight(rowYs, MIN_ROW_HEIGHT);
    if (validRowYs.length < 2 || validColXs.length < 2) continue;
    const bbox = {
      x1: validColXs[0],
      y1: validRowYs[validRowYs.length - 1],
      x2: validColXs[validColXs.length - 1],
      y2: validRowYs[0]
    };
    grids.push({ rowYs: validRowYs, colXs: validColXs, bbox, vertexRadius: groupRadius, ...nested ? { lineNested: true } : {} });
  }
  return [...mergeAdjacentGrids(grids.filter((g) => !g.lineNested)), ...grids.filter((g) => g.lineNested)];
}
var SHADE_CLIP_TOL = 1.5;
var SHADE_CLIP_MAX_AREA = 0.5;
function dropShadingClipGrids(clipGrids, lineGrids, fillRects, verticals = []) {
  if (clipGrids.length === 0 || lineGrids.length === 0 || fillRects.length === 0) return clipGrids;
  const near = (a, b) => Math.abs(a - b) <= SHADE_CLIP_TOL;
  const area = (b) => Math.max(0, b.x2 - b.x1) * Math.max(0, b.y2 - b.y1);
  const inter = (a, b) => area({ x1: Math.max(a.x1, b.x1), y1: Math.max(a.y1, b.y1), x2: Math.min(a.x2, b.x2), y2: Math.min(a.y2, b.y2) });
  return clipGrids.filter((c) => {
    if (!c.cells?.length || c.clipParent) return true;
    const sourceCells = c.cells.filter((cell) => !cell.filler);
    if (sourceCells.length === 0) return true;
    const shaded = sourceCells.every((cell) => fillRects.some((f) => near(f.x1, cell.bbox.x1) && near(f.x2, cell.bbox.x2) && near(f.y1, cell.bbox.y1) && near(f.y2, cell.bbox.y2)));
    if (!shaded) return true;
    const ruled = sourceCells.every((cell) => cell.bbox.x2 >= c.bbox.x2 - SHADE_CLIP_TOL || verticals.some((v) => Math.abs(v.x1 - cell.bbox.x2) <= SHADE_CLIP_TOL * 2 && Math.min(v.y2, cell.bbox.y2) - Math.max(v.y1, cell.bbox.y1) >= (cell.bbox.y2 - cell.bbox.y1) * 0.75));
    if (!ruled) return true;
    const host = lineGrids.find((l) => (
      // Inferred filler cells carry no boundary evidence. Replace their frame only
      // with a finer ruled grid of the same extent, never a larger surrounding form.
      (!c.cells.some((cell) => cell.filler) || near(c.bbox.x1, l.bbox.x1) && near(c.bbox.x2, l.bbox.x2) && near(c.bbox.y1, l.bbox.y1) && near(c.bbox.y2, l.bbox.y2) && l.rowYs.length > c.rowYs.length && sourceCells.every((cell) => [cell.bbox.y1, cell.bbox.y2].every((y) => l.rowYs.some((ly) => near(y, ly))))) && c.bbox.x1 >= l.bbox.x1 - SHADE_CLIP_TOL && c.bbox.x2 <= l.bbox.x2 + SHADE_CLIP_TOL && c.bbox.y1 >= l.bbox.y1 - SHADE_CLIP_TOL && c.bbox.y2 <= l.bbox.y2 + SHADE_CLIP_TOL && c.colXs.every((x) => l.colXs.some((lx) => near(lx, x))) && (clipGrids.reduce((s, o) => s + (o.cells?.some((cell) => cell.filler) ? o.cells.filter((cell) => !cell.filler).reduce((a, cell) => a + inter(cell.bbox, l.bbox), 0) : inter(o.bbox, l.bbox)), 0) <= area(l.bbox) * SHADE_CLIP_MAX_AREA || l.rowYs.length === c.rowYs.length + 1 && c.rowYs.every((y, i) => near(y, l.rowYs[i])) && l.colXs.length === c.colXs.length && c.colXs.every((x, i) => near(x, l.colXs[i])) && !clipGrids.some((o) => o !== c && inter(o.bbox, l.bbox) > 0))
    ));
    return !host;
  });
}
var INSET_CLIP_MIN = 2;
function dropInsetClipGrids(clipGrids, lineGrids) {
  if (clipGrids.length === 0 || lineGrids.length === 0) return clipGrids;
  const near = (a, b) => Math.abs(a - b) <= SHADE_CLIP_TOL;
  return clipGrids.filter((c) => c.clipParent || c.rowYs.length !== 2 || !lineGrids.some((l) => l.rowYs.length >= 3 && near(c.bbox.x1, l.bbox.x1) && near(c.bbox.x2, l.bbox.x2) && l.rowYs.some((top, r) => r + 1 < l.rowYs.length && top - c.bbox.y2 >= INSET_CLIP_MIN && c.bbox.y1 - l.rowYs[r + 1] >= INSET_CLIP_MIN)));
}
function dropHeadBandClipGrids(clipGrids, lineGrids) {
  if (clipGrids.length === 0 || lineGrids.length === 0) return clipGrids;
  const near = (a, b) => Math.abs(a - b) <= SHADE_CLIP_TOL;
  const overlaps = (a, b) => Math.min(a.x2, b.x2) > Math.max(a.x1, b.x1) && Math.min(a.y2, b.y2) > Math.max(a.y1, b.y1);
  return clipGrids.filter((c) => c.clipParent || !c.cells?.length || !lineGrids.some((l) => l.rowYs.length > c.rowYs.length && l.colXs.length === c.colXs.length && c.colXs.every((x, k) => near(x, l.colXs[k])) && c.rowYs.every((y, k) => near(y, l.rowYs[k])) && !clipGrids.some((o) => o !== c && overlaps(o.bbox, l.bbox))));
}
function enforceMinWidth(colXs, minWidth) {
  if (colXs.length <= 2) return colXs;
  const result = [colXs[0]];
  for (let i = 1; i < colXs.length; i++) {
    const prevX = result[result.length - 1];
    if (colXs[i] - prevX < minWidth && i < colXs.length - 1) {
      continue;
    }
    result.push(colXs[i]);
  }
  return result;
}
function enforceMinHeight(rowYs, minHeight) {
  if (rowYs.length <= 2) return rowYs;
  const result = [rowYs[0]];
  for (let i = 1; i < rowYs.length; i++) {
    const prevY = result[result.length - 1];
    if (prevY - rowYs[i] < minHeight && i < rowYs.length - 1) {
      continue;
    }
    result.push(rowYs[i]);
  }
  return result;
}
function mergeAdjacentGrids(grids) {
  if (grids.length <= 1) return grids;
  const sorted = [...grids].sort((a, b) => b.bbox.y2 - a.bbox.y2);
  const merged = [sorted[0]];
  for (let i = 1; i < sorted.length; i++) {
    const prev = merged[merged.length - 1];
    const curr = sorted[i];
    if (prev.colXs.length === curr.colXs.length) {
      const mergeTol = Math.max(VERTEX_MERGE_FACTOR * Math.max(prev.vertexRadius, curr.vertexRadius), 6) * 3;
      const colMatch = prev.colXs.every((x, ci) => Math.abs(x - curr.colXs[ci]) <= mergeTol);
      const verticalGap = prev.bbox.y1 - curr.bbox.y2;
      if (colMatch && verticalGap >= -CONNECT_TOL && verticalGap <= 20) {
        const allRowYs = [.../* @__PURE__ */ new Set([...prev.rowYs, ...curr.rowYs])].sort((a, b) => b - a);
        merged[merged.length - 1] = {
          rowYs: allRowYs,
          colXs: prev.colXs,
          bbox: {
            x1: Math.min(prev.bbox.x1, curr.bbox.x1),
            y1: Math.min(prev.bbox.y1, curr.bbox.y1),
            x2: Math.max(prev.bbox.x2, curr.bbox.x2),
            y2: Math.max(prev.bbox.y2, curr.bbox.y2)
          },
          vertexRadius: Math.max(prev.vertexRadius, curr.vertexRadius)
        };
        continue;
      }
    }
    merged.push(curr);
  }
  return merged;
}
function clusterCoordinates(values, tolerance) {
  if (values.length === 0) return [];
  const sorted = [...values].sort((a, b) => a - b);
  const clusters = [{ sum: sorted[0], count: 1 }];
  for (let i = 1; i < sorted.length; i++) {
    const last = clusters[clusters.length - 1];
    const avg = last.sum / last.count;
    if (Math.abs(sorted[i] - avg) <= tolerance) {
      last.sum += sorted[i];
      last.count++;
    } else {
      clusters.push({ sum: sorted[i], count: 1 });
    }
  }
  return clusters.map((c) => c.sum / c.count);
}
function chainVerticals(vs) {
  if (vs.length <= 1) return vs.map((v) => ({ y1: v.y1, y2: v.y2 }));
  const sorted = [...vs].sort((a, b) => a.x1 - b.x1 || a.y1 - b.y1);
  const rules2 = [];
  let bandStart = 0;
  const flushBand = (end) => {
    const band = sorted.slice(bandStart, end).sort((a, b) => a.y1 - b.y1);
    let cur = { y1: band[0].y1, y2: band[0].y2 };
    for (let i = 1; i < band.length; i++) {
      const seg = band[i];
      if (seg.y1 - cur.y2 <= CUT_VCHAIN_GAP) {
        if (seg.y2 > cur.y2) cur.y2 = seg.y2;
      } else {
        rules2.push(cur);
        cur = { y1: seg.y1, y2: seg.y2 };
      }
    }
    rules2.push(cur);
  };
  for (let i = 1; i <= sorted.length; i++) {
    if (i === sorted.length || sorted[i].x1 - sorted[bandStart].x1 > CUT_VCHAIN_X_TOL) {
      flushBand(i);
      bandStart = i;
    }
  }
  return rules2;
}
function splitStackedGroup(group) {
  const hs = group.filter((l) => l.type === "h");
  const vs = group.filter((l) => l.type === "v");
  if (hs.length < 3 || vs.length < 4) return [group];
  let gx1 = Infinity, gx2 = -Infinity;
  for (const l of group) {
    if (l.x1 < gx1) gx1 = l.x1;
    if (l.x2 > gx2) gx2 = l.x2;
  }
  const groupW = gx2 - gx1;
  if (groupW <= 0) return [group];
  const isInterior = (v) => v.x1 > gx1 + CUT_EDGE_MARGIN && v.x1 < gx2 - CUT_EDGE_MARGIN;
  const chained = chainVerticals(vs);
  const cuts = [];
  for (const h of hs) {
    const y = h.y1;
    if (h.x2 - h.x1 < groupW * CUT_FULLWIDTH_RATIO) continue;
    if (cuts.some((c) => Math.abs(c - y) <= CUT_CROSS_EPS)) continue;
    if (chained.some((v) => v.y1 < y - CUT_CROSS_EPS && v.y2 > y + CUT_CROSS_EPS)) continue;
    const above = vs.filter((v) => v.y1 >= y - CUT_CROSS_EPS);
    const below = vs.filter((v) => v.y2 <= y + CUT_CROSS_EPS);
    if (above.length < CUT_MIN_SIDE_VERTICALS || below.length < CUT_MIN_SIDE_VERTICALS) continue;
    const ia = above.filter(isInterior);
    const ib = below.filter(isInterior);
    if (ia.length === 0 || ib.length === 0) continue;
    let matched = 0;
    for (const a of ia) if (ib.some((b) => Math.abs(a.x1 - b.x1) <= CUT_INTERIOR_MATCH_TOL)) matched++;
    if (matched / Math.min(ia.length, ib.length) > CUT_MAX_INTERIOR_OVERLAP) continue;
    cuts.push(y);
  }
  if (cuts.length === 0) return [group];
  cuts.sort((a, b) => b - a);
  const bandOf = (y) => {
    let k = 0;
    while (k < cuts.length && y < cuts[k]) k++;
    return k;
  };
  const bands = Array.from({ length: cuts.length + 1 }, () => []);
  for (const v of vs) bands[bandOf((v.y1 + v.y2) / 2)].push(v);
  for (const h of hs) {
    const atCut = cuts.findIndex((c) => Math.abs(h.y1 - c) <= CUT_CROSS_EPS);
    if (atCut >= 0) {
      bands[atCut].push(h);
      bands[atCut + 1].push(h);
    } else {
      bands[bandOf(h.y1)].push(h);
    }
  }
  return bands.filter((b) => b.length > 0);
}
function splitNestedBoxes(group) {
  const comps = groupConnectedLines(group, NEST_STRICT_TOL);
  if (comps.length < 2) return { outer: group, nested: [] };
  const boxes = comps.map((c) => {
    const hs = c.filter((l) => l.type === "h"), vs = c.filter((l) => l.type === "v");
    if (hs.length < 2 || vs.length < 2) return null;
    const x1 = Math.min(...vs.map((v) => v.x1)), x2 = Math.max(...vs.map((v) => v.x1));
    const y1 = Math.min(...hs.map((h) => h.y1)), y2 = Math.max(...hs.map((h) => h.y1));
    if (x2 - x1 < 1 || y2 - y1 < 1) return null;
    const cover = (segs, a, b) => segs.reduce((s, [p, q]) => s + Math.max(0, Math.min(q, b) - Math.max(p, a)), 0) >= (b - a) * NEST_EDGE_COVER;
    const edgeH = (y) => cover(hs.filter((h) => Math.abs(h.y1 - y) <= NEST_STRICT_TOL).map((h) => [h.x1, h.x2]), x1, x2);
    const edgeV = (x) => cover(vs.filter((v) => Math.abs(v.x1 - x) <= NEST_STRICT_TOL).map((v) => [v.y1, v.y2]), y1, y2);
    return edgeH(y1) && edgeH(y2) && edgeV(x1) && edgeV(x2) ? { x1, y1, x2, y2 } : null;
  });
  const bboxOf = (c) => ({
    x1: Math.min(...c.map((l) => Math.min(l.x1, l.x2))),
    x2: Math.max(...c.map((l) => Math.max(l.x1, l.x2))),
    y1: Math.min(...c.map((l) => Math.min(l.y1, l.y2))),
    y2: Math.max(...c.map((l) => Math.max(l.y1, l.y2)))
  });
  const extents = comps.map(bboxOf);
  const nestedIdx = /* @__PURE__ */ new Set();
  comps.forEach((_, i) => {
    const b = boxes[i];
    if (!b) return;
    const e = extents[i];
    const uniq = (xs) => xs.filter((x, k) => xs.findIndex((y) => Math.abs(y - x) <= NEST_STRICT_TOL) === k).length;
    const bare = uniq(comps[i].filter((l) => l.type === "h").map((l) => l.y1)) === 2 && uniq(comps[i].filter((l) => l.type === "v").map((l) => l.x1)) === 2;
    const inside = comps.some((c, j) => {
      if (j === i || c.filter((l) => l.type === "v").length < 2 || !c.some((l) => l.type === "h")) return false;
      const p = extents[j];
      const gaps = [e.x1 - p.x1, p.x2 - e.x2, e.y1 - p.y1, p.y2 - e.y2];
      return gaps.every((g) => g >= NEST_MIN_GAP) && !(bare && gaps.every((g) => g <= NEST_DOUBLE_RULE_GAP));
    });
    if (!inside) return;
    const crossed = comps.some((c, j) => j !== i && c.some((l) => l.type === "h" ? l.y1 > e.y1 + NEST_MIN_GAP && l.y1 < e.y2 - NEST_MIN_GAP && Math.min(l.x2, e.x2) - Math.max(l.x1, e.x1) > NEST_MIN_GAP : l.x1 > e.x1 + NEST_MIN_GAP && l.x1 < e.x2 - NEST_MIN_GAP && Math.min(l.y2, e.y2) - Math.max(l.y1, e.y1) > NEST_MIN_GAP) && !(extents[j].x1 >= e.x1 && extents[j].x2 <= e.x2 && extents[j].y1 >= e.y1 && extents[j].y2 <= e.y2));
    if (!crossed) nestedIdx.add(i);
  });
  if (nestedIdx.size === 0) return { outer: group, nested: [] };
  return {
    outer: comps.filter((_, i) => !nestedIdx.has(i)).flat(),
    nested: comps.filter((_, i) => nestedIdx.has(i))
  };
}
var GROUP_BUCKET_CELL = 100;
function groupConnectedLines(lines, tol = CONNECT_TOL) {
  const parent = lines.map((_, i) => i);
  function find(x) {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  }
  function union(a, b) {
    const ra = find(a), rb = find(b);
    if (ra !== rb) parent[ra] = rb;
  }
  const span = lines.map((l) => [
    Math.floor((Math.min(l.x1, l.x2) - CONNECT_TOL) / GROUP_BUCKET_CELL),
    Math.floor((Math.max(l.x1, l.x2) + CONNECT_TOL) / GROUP_BUCKET_CELL),
    Math.floor((Math.min(l.y1, l.y2) - CONNECT_TOL) / GROUP_BUCKET_CELL),
    Math.floor((Math.max(l.y1, l.y2) + CONNECT_TOL) / GROUP_BUCKET_CELL)
  ]);
  const startXs = [...new Set(span.map((s) => s[0]))].filter(Number.isFinite).sort((a, b) => a - b);
  const startYs = [...new Set(span.map((s) => s[2]))].filter(Number.isFinite).sort((a, b) => a - b);
  const cellMap = /* @__PURE__ */ new Map();
  for (let i = 0; i < lines.length; i++) {
    const [cx1, cx2, cy1, cy2] = span[i];
    for (let a = lowerBound(startXs, cx1); a < startXs.length && startXs[a] <= cx2; a++) {
      for (let b = lowerBound(startYs, cy1); b < startYs.length && startYs[b] <= cy2; b++) {
        const key = startXs[a] + "," + startYs[b];
        const arr = cellMap.get(key);
        if (arr) arr.push(i);
        else cellMap.set(key, [i]);
      }
    }
  }
  const tested = /* @__PURE__ */ new Set();
  for (const arr of cellMap.values()) {
    for (let a = 0; a < arr.length; a++) {
      for (let b = a + 1; b < arr.length; b++) {
        const i = Math.min(arr[a], arr[b]);
        const j = Math.max(arr[a], arr[b]);
        const key = i * lines.length + j;
        if (tested.has(key)) continue;
        tested.add(key);
        if (linesIntersect(lines[i], lines[j], tol)) {
          union(i, j);
        }
      }
    }
  }
  const groups = /* @__PURE__ */ new Map();
  for (let i = 0; i < lines.length; i++) {
    const root = find(i);
    if (!groups.has(root)) groups.set(root, []);
    groups.get(root).push(lines[i]);
  }
  return [...groups.values()];
}
function linesIntersect(a, b, tol = CONNECT_TOL) {
  if (a.type === b.type) {
    if (a.type === "h") {
      if (Math.abs(a.y1 - b.y1) > tol) return false;
      return Math.min(a.x2, b.x2) >= Math.max(a.x1, b.x1) - tol;
    } else {
      if (Math.abs(a.x1 - b.x1) > tol) return false;
      return Math.min(a.y2, b.y2) >= Math.max(a.y1, b.y1) - tol;
    }
  }
  const h = a.type === "h" ? a : b;
  const v = a.type === "h" ? b : a;
  return v.x1 >= h.x1 - tol && v.x1 <= h.x2 + tol && h.y1 >= v.y1 - tol && h.y1 <= v.y2 + tol;
}
var CLIP_EDGE_TOL = 1.5;
var CLIP_ADJ_GAP = 0.15;
var CLIP_MIN_GROUP = 2;
var CLIP_MAX_PAGE_FRAC = 0.75;
var STRADDLE_MIN = 0.1;
var TITLED_FRAME_MIN_TOP = 0.2;
var TITLED_FRAME_MIN_WIDTH = 0.6;
var HEADER_BAND = 0.08;
var CLIP_MIN_W2 = 4;
var NARROW_FILL_MIN_W = 1;
var CLIP_MIN_H2 = 2;
var STROKE_NEAR = 2;
var STROKE_COVER = 0.5;
var CLIP_MIN_INVISIBLE = 0;
var CLIP_COORD_TOL = 0.3;
var overlap = (a1, a2, b1, b2) => Math.min(a2, b2) - Math.max(a1, b1);
function adjacent(a, b) {
  const al = (u, v) => Math.abs(u - v) <= CLIP_COORD_TOL;
  if ((Math.abs(a.x2 - b.x1) <= CLIP_ADJ_GAP || Math.abs(b.x2 - a.x1) <= CLIP_ADJ_GAP) && overlap(a.y1, a.y2, b.y1, b.y2) > CLIP_EDGE_TOL && (al(a.y1, b.y1) || al(a.y2, b.y2))) return true;
  if ((Math.abs(a.y2 - b.y1) <= CLIP_ADJ_GAP || Math.abs(b.y2 - a.y1) <= CLIP_ADJ_GAP) && overlap(a.x1, a.x2, b.x1, b.x2) > CLIP_EDGE_TOL && (al(a.x1, b.x1) || al(a.x2, b.x2))) return true;
  return false;
}
function contains(a, b) {
  return b.x1 >= a.x1 - CLIP_EDGE_TOL && b.x2 <= a.x2 + CLIP_EDGE_TOL && b.y1 >= a.y1 - CLIP_EDGE_TOL && b.y2 <= a.y2 + CLIP_EDGE_TOL && (b.x2 - b.x1 < a.x2 - a.x1 - CLIP_EDGE_TOL || b.y2 - b.y1 < a.y2 - a.y1 - CLIP_EDGE_TOL);
}
function clusterCoords(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const out = [];
  let run = [];
  for (const v of sorted) {
    if (run.length > 0 && v - run[run.length - 1] > CLIP_COORD_TOL) {
      out.push(run.reduce((s, x) => s + x, 0) / run.length);
      run = [];
    }
    run.push(v);
  }
  if (run.length > 0) out.push(run.reduce((s, x) => s + x, 0) / run.length);
  return out;
}
function dropSliverGaps(coords) {
  const out = [...coords];
  if (out.length > 2 && out[1] - out[0] < 1) out.splice(0, 2, (out[0] + out[1]) / 2);
  const n = out.length;
  if (n > 2 && out[n - 1] - out[n - 2] < 1) out.splice(n - 2, 2, (out[n - 2] + out[n - 1]) / 2);
  return out;
}
var nearestIndex = (coords, v) => {
  let best = 0;
  for (let i = 1; i < coords.length; i++) if (Math.abs(coords[i] - v) < Math.abs(coords[best] - v)) best = i;
  return best;
};
function edgeStroked(lines, dir, pos, a1, a2) {
  const len = a2 - a1;
  if (len <= 0) return true;
  for (const l of lines) {
    if (dir === "h") {
      if (Math.abs(l.y1 - pos) <= STROKE_NEAR && overlap(l.x1, l.x2, a1, a2) >= len * STROKE_COVER) return true;
    } else if (Math.abs(l.x1 - pos) <= STROKE_NEAR && overlap(l.y1, l.y2, a1, a2) >= len * STROKE_COVER) {
      return true;
    }
  }
  return false;
}
var CONT_X_TOL = 0.1;
function buildClipCellGrids(rects, strokedH, strokedV, pageWidth, pageHeight, textPoints = [], fillRects = [], prev = { lastCells: [], clips: [] }) {
  const pageArea = pageWidth * pageHeight;
  const sameRect = (a, b) => Math.abs(a.x1 - b.x1) <= CLIP_EDGE_TOL && Math.abs(a.x2 - b.x2) <= CLIP_EDGE_TOL && Math.abs(a.y1 - b.y1) <= CLIP_EDGE_TOL && Math.abs(a.y2 - b.y2) <= CLIP_EDGE_TOL;
  const cells = [];
  const buckets = /* @__PURE__ */ new Map();
  for (const r of rects) {
    if (r.x2 - r.x1 < CLIP_MIN_W2 || r.y2 - r.y1 < CLIP_MIN_H2) continue;
    if (pageArea > 0 && (r.x2 - r.x1) * (r.y2 - r.y1) >= pageArea * CLIP_MAX_PAGE_FRAC) continue;
    const bx = Math.floor(r.x1 / CLIP_EDGE_TOL), by = Math.floor(r.y1 / CLIP_EDGE_TOL);
    let duplicate = false;
    for (let dx = -1; dx <= 1 && !duplicate; dx++) {
      const ys2 = buckets.get(bx + dx);
      for (let dy = -1; dy <= 1 && !duplicate; dy++) {
        duplicate = ys2?.get(by + dy)?.some((c) => sameRect(c, r)) ?? false;
      }
    }
    if (duplicate) continue;
    cells.push(r);
    let ys = buckets.get(bx);
    if (!ys) {
      ys = /* @__PURE__ */ new Map();
      buckets.set(bx, ys);
    }
    const row = ys.get(by);
    if (row) row.push(r);
    else ys.set(by, [r]);
  }
  if (cells.length < 1) return { grids: [], containers: [], page: { lastCells: [], clips: [] } };
  const parent = new Array(cells.length).fill(-1);
  const area = (r) => (r.x2 - r.x1) * (r.y2 - r.y1);
  const straddles = (a, b) => {
    const ix = overlap(a.x1, a.x2, b.x1, b.x2), iy = overlap(a.y1, a.y2, b.y1, b.y2);
    if (ix <= CLIP_EDGE_TOL || iy <= CLIP_EDGE_TOL || contains(a, b) || contains(b, a)) return false;
    const inside = ix * iy / area(b);
    return inside > STRADDLE_MIN && inside < 1 - STRADDLE_MIN;
  };
  const canParent = cells.map((a, i) => !cells.some((b, j) => i !== j && straddles(a, b)));
  for (let i = 0; i < cells.length; i++) {
    for (let j = 0; j < cells.length; j++) {
      if (i === j || !canParent[j] || area(cells[j]) <= area(cells[i]) || !contains(cells[j], cells[i])) continue;
      const cur = parent[i];
      if (cur < 0 || contains(cells[cur], cells[j])) parent[i] = j;
    }
  }
  const ruledGaps = findRuledGaps(cells, parent, strokedH, strokedV);
  const isContainer = new Array(cells.length).fill(false);
  for (const p of parent) if (p >= 0) isContainer[p] = true;
  const tileParent = new Array(cells.length).fill(false);
  const tableClip = new Array(cells.length).fill(false);
  for (let p = 0; p < cells.length; p++) {
    if (!isContainer[p]) continue;
    let n = 0, x1 = Infinity, y1 = Infinity, x2 = -Infinity, y2 = -Infinity;
    for (let i = 0; i < cells.length; i++) {
      if (parent[i] !== p) continue;
      const k = cells[i];
      n++;
      x1 = Math.min(x1, k.x1);
      y1 = Math.min(y1, k.y1);
      x2 = Math.max(x2, k.x2);
      y2 = Math.max(y2, k.y2);
    }
    if (n < CLIP_MIN_GROUP) continue;
    const c = cells[p];
    if (Math.max(Math.abs(x1 - c.x1), Math.abs(x2 - c.x2), Math.abs(y1 - c.y1), Math.abs(y2 - c.y2)) <= CLIP_COORD_TOL) tileParent[p] = true;
  }
  for (let p = 0; p < cells.length; p++) {
    if (tileParent[p]) tableClip[p] = !cells.some((q, i) => i !== p && parent[i] === parent[p] && !tileParent[i] && adjacent(q, cells[p]));
  }
  const effParent = (i) => {
    let p = parent[i];
    for (let steps = 0; p >= 0 && steps <= cells.length; steps++) {
      if (!tableClip[p] && (isGridMember(p) || loneFrame(p) || continues(p))) return p;
      p = parent[p];
    }
    return -1;
  };
  const root = cells.map((_, i) => i);
  const find = (i) => {
    while (root[i] !== i) {
      root[i] = root[root[i]];
      i = root[i];
    }
    return i;
  };
  const edgeBin = (v) => Math.floor(v / CLIP_ADJ_GAP);
  const startsX = /* @__PURE__ */ new Map(), endsX = /* @__PURE__ */ new Map();
  const startsY = /* @__PURE__ */ new Map(), endsY = /* @__PURE__ */ new Map();
  const addEdge = (map, v, i) => {
    const k = edgeBin(v), row = map.get(k);
    if (row) row.push(i);
    else map.set(k, [i]);
  };
  for (let i = 0; i < cells.length; i++) {
    addEdge(startsX, cells[i].x1, i);
    addEdge(endsX, cells[i].x2, i);
    addEdge(startsY, cells[i].y1, i);
    addEdge(endsY, cells[i].y2, i);
  }
  for (let i = 0; i < cells.length; i++) {
    if (tableClip[i]) continue;
    const candidates = /* @__PURE__ */ new Set();
    const near = (map, v) => {
      const k = edgeBin(v);
      for (let d = -1; d <= 1; d++) for (const j of map.get(k + d) ?? []) if (j > i) candidates.add(j);
    };
    near(startsX, cells[i].x2);
    near(endsX, cells[i].x1);
    near(startsY, cells[i].y2);
    near(endsY, cells[i].y1);
    for (const j of [...candidates].sort((a, b) => a - b)) {
      if (tableClip[j] || parent[i] !== parent[j]) continue;
      if (adjacent(cells[i], cells[j])) {
        const ra = find(i), rb = find(j);
        if (ra !== rb) root[ra] = rb;
      }
    }
  }
  const stacked = /* @__PURE__ */ new Set();
  if (ruledGaps.some((g) => g.axis === "y" && g.both && g.hi - g.lo > STACKED_TABLE_GAP)) {
    for (let i = 0; i < cells.length; i++) {
      if (tableClip[i]) continue;
      const k = edgeBin(cells[i].y2);
      for (let d = -1; d <= 1; d++) {
        if ((startsY.get(k + d) ?? []).some((j) => j !== i && !tableClip[j] && parent[j] === parent[i] && adjacent(cells[i], cells[j]))) stacked.add(find(i));
      }
    }
  }
  const comp = cells.map((_, i) => find(i));
  for (const g of ruledGaps) {
    if (tableClip[g.i] || tableClip[g.j]) continue;
    if (g.axis === "y" && g.both && g.hi - g.lo > STACKED_TABLE_GAP && comp[g.i] !== comp[g.j] && stacked.has(comp[g.i]) && stacked.has(comp[g.j])) continue;
    const ra = find(g.i), rb = find(g.j);
    if (ra !== rb) root[ra] = rb;
  }
  if (prev.lastCells.length) {
    const headTop = pageHeight * (1 - HEADER_BAND);
    let top = -Infinity;
    for (let i = 0; i < cells.length; i++) if (parent[i] < 0 && !tableClip[i]) top = Math.max(top, cells[i].y2);
    const band = cells.flatMap((c, i) => parent[i] < 0 && !tableClip[i] && Math.abs(c.y2 - top) <= CLIP_COORD_TOL ? [i] : []);
    const y1 = band.length ? cells[band[0]].y1 : 0;
    if (band.length >= 2 && band.every((i) => Math.abs(cells[i].y1 - y1) <= CLIP_COORD_TOL) && !textPoints.some((p) => p.y > top + CLIP_EDGE_TOL && p.y < headTop)) {
      for (let f = 0; f < cells.length; f++) {
        const b = cells[f];
        if (parent[f] >= 0 || tableClip[f] || Math.abs(b.y2 - y1) > CLIP_ADJ_GAP) continue;
        const on = band.filter((i) => cells[i].x1 >= b.x1 - CLIP_COORD_TOL && cells[i].x2 <= b.x2 + CLIP_COORD_TOL);
        if (on.length < 2 || !on.some((i) => adjacent(cells[i], b))) continue;
        for (const i of on) {
          const ra = find(i), rb = find(f);
          if (ra !== rb) root[ra] = rb;
        }
      }
    }
  }
  const groups = /* @__PURE__ */ new Map();
  for (let i = 0; i < cells.length; i++) {
    const r = find(i);
    const g = groups.get(r);
    if (g) g.push(i);
    else groups.set(r, [i]);
  }
  const containers = cells.filter((_, i) => isContainer[i]);
  const groupSize = (i) => groups.get(find(i))?.length ?? 0;
  const isGridMember = (i) => groupSize(i) >= CLIP_MIN_GROUP;
  const framed = (r) => edgeStroked(strokedH, "h", r.y1, r.x1, r.x2) && edgeStroked(strokedH, "h", r.y2, r.x1, r.x2) && edgeStroked(strokedV, "v", r.x1, r.y1, r.y2) && edgeStroked(strokedV, "v", r.x2, r.y1, r.y2);
  const titledFrame = (r) => r.y1 >= pageHeight * TITLED_FRAME_MIN_TOP && r.x2 - r.x1 >= pageWidth * TITLED_FRAME_MIN_WIDTH && textPoints.some((p) => p.y < r.y1 && p.y > pageHeight * HEADER_BAND && p.x >= r.x1 - CLIP_EDGE_TOL && p.x <= r.x2 + CLIP_EDGE_TOL) && textPoints.some((p) => p.x > r.x1 && p.x < r.x2 && p.y > r.y1 && p.y < r.y2);
  const loneFrame = (i) => isContainer[i] && !isGridMember(i) && (framed(cells[i]) || titledFrame(cells[i]));
  const headY = pageHeight * (1 - HEADER_BAND);
  const continues = (i) => {
    if (!prev.lastCells.length || parent[i] >= 0 || tableClip[i] || isGridMember(i)) return void 0;
    const c = cells[i];
    const from = prev.lastCells.find((b) => Math.abs(b.x1 - c.x1) <= CONT_X_TOL && Math.abs(b.x2 - c.x2) <= CONT_X_TOL);
    if (!from) return void 0;
    if (prev.clips.some((k) => sameRect(k, c) && !sameRect(k, from))) return void 0;
    if (textPoints.some((p) => p.y > c.y2 && p.y < headY)) return void 0;
    if (cells.some((o) => o.y1 >= c.y2 - CLIP_EDGE_TOL && (o.y1 + o.y2) / 2 < headY)) return void 0;
    return from;
  };
  const parentAttachable = (i) => effParent(i) >= 0;
  const onlyChild = (i) => parent[i] >= 0 && parent.filter((p) => p === parent[i]).length === 1;
  const grids = [];
  for (const idxs of groups.values()) {
    const first = idxs[0];
    if (tableClip[first]) continue;
    const parentRect = parentAttachable(first) ? cells[effParent(first)] : void 0;
    if (idxs.length < CLIP_MIN_GROUP) {
      const from = continues(first);
      if (!from && !loneFrame(first) && !((parentRect || onlyChild(first)) && framed(cells[first]))) continue;
      const r = cells[first];
      grids.push({
        rowYs: [r.y2, r.y1],
        colXs: [r.x1, r.x2],
        bbox: { x1: r.x1, y1: r.y1, x2: r.x2, y2: r.y2 },
        vertexRadius: 1,
        cells: [{ row: 0, col: 0, rowSpan: 1, colSpan: 1, bbox: { x1: r.x1, y1: r.y1, x2: r.x2, y2: r.y2 } }],
        ...parentRect ? { clipParent: parentRect } : {},
        ...from ? { continues: from } : {}
      });
      continue;
    }
    const gs = ruledGaps.filter((g) => find(g.i) === find(first));
    const members = gs.length ? closeGaps(idxs.map((i) => cells[i]), gs) : idxs.map((i) => cells[i]);
    let edges = 0, invisible = 0;
    for (const r of members) {
      edges += 4;
      if (!edgeStroked(strokedH, "h", r.y1, r.x1, r.x2)) invisible++;
      if (!edgeStroked(strokedH, "h", r.y2, r.x1, r.x2)) invisible++;
      if (!edgeStroked(strokedV, "v", r.x1, r.y1, r.y2)) invisible++;
      if (!edgeStroked(strokedV, "v", r.x2, r.y1, r.y2)) invisible++;
    }
    if (invisible / edges < CLIP_MIN_INVISIBLE) continue;
    const colXs = dropSliverGaps(clusterCoords(members.flatMap((r) => [r.x1, r.x2])));
    const rowYs = clusterCoords(members.flatMap((r) => [r.y1, r.y2])).reverse();
    const band = parentRect ? void 0 : carriedBandTop(colXs, rowYs[0], strokedH, strokedV, textPoints, cells, prev.lastCells, headY);
    if (band !== void 0) rowYs.unshift(band);
    const numRows = rowYs.length - 1, numCols = colXs.length - 1;
    if (numRows < 1 || numCols < 1) continue;
    const occupied = Array.from({ length: numRows }, () => new Array(numCols).fill(false));
    const out = [];
    for (const r of members) {
      const c0 = nearestIndex(colXs, r.x1), c1 = nearestIndex(colXs, r.x2);
      const r0 = nearestIndex(rowYs, r.y2), r1 = nearestIndex(rowYs, r.y1);
      if (c1 <= c0 || r1 <= r0) continue;
      let clash = false;
      for (let rr = r0; rr < r1 && !clash; rr++) for (let cc = c0; cc < c1; cc++) if (occupied[rr][cc]) {
        clash = true;
        break;
      }
      if (clash) continue;
      for (let rr = r0; rr < r1; rr++) for (let cc = c0; cc < c1; cc++) occupied[rr][cc] = true;
      out.push({ row: r0, col: c0, rowSpan: r1 - r0, colSpan: c1 - c0, bbox: { x1: r.x1, y1: r.y1, x2: r.x2, y2: r.y2 } });
    }
    for (let rr = 0; rr < numRows; rr++) {
      for (let cc = 0; cc < numCols; cc++) {
        if (occupied[rr][cc]) continue;
        out.push({ row: rr, col: cc, rowSpan: 1, colSpan: 1, bbox: { x1: colXs[cc], y1: rowYs[rr + 1], x2: colXs[cc + 1], y2: rowYs[rr] }, filler: true });
      }
    }
    addNarrowEdgeCols(colXs, rowYs, out, fillRects);
    grids.push({
      rowYs,
      colXs,
      bbox: { x1: colXs[0], y1: rowYs[numRows], x2: colXs[colXs.length - 1], y2: rowYs[0] },
      vertexRadius: 1,
      cells: out,
      ...parentRect ? { clipParent: parentRect } : {}
    });
  }
  const tops = grids.filter((g) => !g.clipParent).flatMap((g) => g.cells.filter((c) => !c.filler).map((c) => c.bbox));
  let lastCells = [];
  if (tops.length) {
    const bottom = Math.min(...tops.map((b) => b.y1));
    const footY = pageHeight * HEADER_BAND;
    const below = (y) => y < bottom - CLIP_EDGE_TOL && y > footY;
    if (!textPoints.some((p) => below(p.y)) && !cells.some((o) => o.y2 < bottom && below((o.y1 + o.y2) / 2))) {
      lastCells = tops.filter((b) => Math.abs(b.y1 - bottom) <= CLIP_COORD_TOL && !cells.some((k) => Math.abs(k.x1 - b.x1) <= CONT_X_TOL && Math.abs(k.x2 - b.x2) <= CONT_X_TOL && k.y2 > b.y2 + CLIP_EDGE_TOL && contains(k, b)));
    }
  }
  return { grids, containers, page: { lastCells, clips: cells } };
}
var CLIP_SPACING_MAX = 3;
var STACKED_TABLE_GAP = 2.6;
function findRuledGaps(cells, parent, strokedH, strokedV) {
  const al = (u, v) => Math.abs(u - v) <= CLIP_COORD_TOL;
  const occupied = (i, j, x1, y1, x2, y2) => cells.some((k, n) => n !== i && n !== j && parent[n] === parent[i] && overlap(k.x1, k.x2, x1, x2) > CLIP_ADJ_GAP && overlap(k.y1, k.y2, y1, y2) > CLIP_ADJ_GAP);
  const gapBetween = (i, j) => {
    const a = cells[i], b = cells[j];
    const gv = a.y1 - b.y2;
    if (gv > CLIP_ADJ_GAP && gv <= CLIP_SPACING_MAX && overlap(a.x1, a.x2, b.x1, b.x2) > CLIP_EDGE_TOL && (al(a.x1, b.x1) || al(a.x2, b.x2)) && !occupied(i, j, Math.max(a.x1, b.x1), b.y2, Math.min(a.x2, b.x2), a.y1)) {
      const e1 = Math.max(a.x1, b.x1), e2 = Math.min(a.x2, b.x2);
      return { i, j, axis: "y", lo: b.y2, hi: a.y1, e1, e2, ...ruleEnd(strokedH, "h", b.y2, a.y1, e1, e2) };
    }
    const gh = b.x1 - a.x2;
    if (gh > CLIP_ADJ_GAP && gh <= CLIP_SPACING_MAX && overlap(a.y1, a.y2, b.y1, b.y2) > CLIP_EDGE_TOL && (al(a.y1, b.y1) || al(a.y2, b.y2)) && !occupied(i, j, a.x2, Math.max(a.y1, b.y1), b.x1, Math.min(a.y2, b.y2))) {
      const e1 = Math.max(a.y1, b.y1), e2 = Math.min(a.y2, b.y2);
      return { i, j, axis: "x", lo: a.x2, hi: b.x1, e1, e2, ...ruleEnd(strokedV, "v", a.x2, b.x1, e1, e2) };
    }
    return void 0;
  };
  const ruled = (g) => (g.axis === "y" ? strokedH : strokedV).some((l) => {
    const pos = g.axis === "y" ? l.y1 : l.x1;
    return (Math.abs(pos - g.lo) <= 0.5 || Math.abs(pos - g.hi) <= 0.5) && (g.axis === "y" ? overlap(l.x1, l.x2, g.e1, g.e2) : overlap(l.y1, l.y2, g.e1, g.e2)) >= (g.e2 - g.e1) * STROKE_COVER;
  });
  const root = cells.map((_, i) => i);
  const find = (i) => {
    while (root[i] !== i) {
      root[i] = root[root[i]];
      i = root[i];
    }
    return i;
  };
  const found = [];
  const widths = /* @__PURE__ */ new Map();
  const link = (g) => {
    found.push(g);
    const ri = find(g.i), rj = find(g.j);
    const w = [...widths.get(rj) ?? [], ...ri !== rj ? widths.get(ri) ?? [] : [], { axis: g.axis, w: g.hi - g.lo }];
    root[ri] = rj;
    widths.set(rj, w);
  };
  const cand = [];
  for (let i = 0; i < cells.length; i++) {
    for (let j = 0; j < cells.length; j++) {
      if (i === j || parent[i] !== parent[j]) continue;
      const g = gapBetween(i, j);
      if (!g) continue;
      const a = cells[i], b = cells[j];
      const both = g.axis === "y" ? al(a.x1, b.x1) && al(a.x2, b.x2) : al(a.y1, b.y1) && al(a.y2, b.y2);
      const isRuled = ruled(g);
      if (both && isRuled) link(g);
      else if (both || isRuled) cand.push([g, both]);
    }
  }
  if (!found.length) return [];
  for (let grew = true; grew; ) {
    grew = false;
    for (let k = cand.length - 1; k >= 0; k--) {
      const [g, both] = cand[k], w = g.hi - g.lo;
      if (![find(g.i), find(g.j)].some((r) => (widths.get(r) ?? []).some((s) => (both || s.axis === g.axis) && Math.abs(s.w - w) <= CLIP_COORD_TOL))) continue;
      link(g);
      cand.splice(k, 1);
      grew = true;
    }
  }
  return found;
}
function ruleEnd(lines, dir, lo, hi, e1, e2) {
  const at = (p) => lines.some((l) => Math.abs((dir === "h" ? l.y1 : l.x1) - p) <= 0.5 && (dir === "h" ? overlap(l.x1, l.x2, e1, e2) : overlap(l.y1, l.y2, e1, e2)) >= (e2 - e1) * STROKE_COVER);
  const atLo = at(lo), atHi = at(hi);
  return { to: atLo && !atHi ? lo : atHi && !atLo ? hi : (lo + hi) / 2, both: atLo && atHi };
}
function closeGaps(members, gaps) {
  const al = (u, v) => Math.abs(u - v) <= CLIP_COORD_TOL;
  const lines = [];
  for (const g of gaps) {
    const l = lines.find((k) => k.axis === g.axis && al(k.lo, g.lo) && al(k.hi, g.hi));
    if (l) {
      l.e1 = Math.min(l.e1, g.e1);
      l.e2 = Math.max(l.e2, g.e2);
      l.both &&= g.both;
    } else lines.push({ ...g });
  }
  const spacing = gaps.some((g) => g.axis === "x") && gaps.some((g) => g.axis === "y");
  const repeatedBlankColumn = (l) => {
    if (spacing || l.axis !== "x" || !l.both) return false;
    const spans = gaps.filter((g) => g.axis === "x" && al(g.lo, l.lo) && al(g.hi, l.hi)).map((g) => [g.e1, g.e2]).sort((a, b) => a[0] - b[0]);
    if (spans.length < 3) return false;
    let covered = 0, end = -Infinity, distinct = 0;
    for (const [lo, hi] of spans) {
      if (hi <= end + CLIP_COORD_TOL) continue;
      covered += hi - Math.max(lo, end);
      end = hi;
      distinct++;
    }
    const height = Math.max(...members.map((r) => r.y2)) - Math.min(...members.map((r) => r.y1));
    return distinct >= 3 && covered >= height * 0.65;
  };
  const out = members.map((r) => ({ ...r }));
  for (const l of lines) {
    const shared = (p) => members.some((u) => members.some((v) => u !== v && (l.axis === "y" ? Math.abs(u.y1 - v.y2) <= CLIP_ADJ_GAP && al(u.y1, p) && overlap(u.x1, u.x2, v.x1, v.x2) > CLIP_EDGE_TOL : Math.abs(u.x2 - v.x1) <= CLIP_ADJ_GAP && al(u.x2, p) && overlap(u.y1, u.y2, v.y1, v.y2) > CLIP_EDGE_TOL)));
    const atLo = shared(l.lo), atHi = shared(l.hi);
    if (repeatedBlankColumn(l) && !atLo && !atHi) continue;
    const to = atLo && !atHi ? l.lo : atHi && !atLo ? l.hi : l.to;
    const onEdge = (r) => l.axis === "y" ? al(r.y2, l.lo) || al(r.y1, l.hi) : al(r.x2, l.lo) || al(r.x1, l.hi);
    const span = (r) => l.axis === "y" ? [r.x1, r.x2] : [r.y1, r.y2];
    const take = /* @__PURE__ */ new Set();
    for (let grew = true; grew; ) {
      grew = false;
      for (let n = 0; n < members.length; n++) {
        if (take.has(n) || !onEdge(members[n])) continue;
        const [a1, a2] = span(members[n]);
        if (overlap(a1, a2, l.e1, l.e2) <= -(CLIP_SPACING_MAX + CLIP_COORD_TOL)) continue;
        take.add(n);
        l.e1 = Math.min(l.e1, a1);
        l.e2 = Math.max(l.e2, a2);
        grew = true;
      }
    }
    for (const n of take) {
      const r = members[n], s = out[n];
      if (l.axis === "y") {
        if (al(r.y2, l.lo)) s.y2 = to;
        if (al(r.y1, l.hi)) s.y1 = to;
      } else {
        if (al(r.x2, l.lo)) s.x2 = to;
        if (al(r.x1, l.hi)) s.x1 = to;
      }
    }
  }
  return out;
}
function carriedBandTop(colXs, top, strokedH, strokedV, textPoints, cells, prevLast, headY) {
  const x1 = colXs[0], x2 = colXs[colXs.length - 1];
  if (!prevLast.some((b) => overlap(b.x1, b.x2, x1, x2) > CLIP_EDGE_TOL)) return void 0;
  let y;
  for (const l of strokedH) {
    if (l.y1 > top + CLIP_MIN_H2 && l.x1 <= x1 + STROKE_NEAR && l.x2 >= x2 - STROKE_NEAR && (y === void 0 || l.y1 < y)) y = l.y1;
  }
  if (y === void 0 || !edgeStroked(strokedV, "v", x1, top, y) || !edgeStroked(strokedV, "v", x2, top, y)) return void 0;
  const above = Math.max(y, headY);
  const inX = (x) => x > x1 && x < x2;
  if (textPoints.some((p) => inX(p.x) && p.y > top && p.y < above)) return void 0;
  if (cells.some((c) => overlap(c.x1, c.x2, x1, x2) > CLIP_EDGE_TOL && c.y1 >= top - CLIP_EDGE_TOL && c.y1 < above)) return void 0;
  return y;
}
function addNarrowEdgeCols(colXs, rowYs, out, fills) {
  if (!fills.length) return;
  const rowIdx = (y) => {
    const i = nearestIndex(rowYs, y);
    return Math.abs(rowYs[i] - y) <= CLIP_COORD_TOL ? i : -1;
  };
  for (const side of ["l", "r"]) {
    const edge = side === "l" ? colXs[0] : colXs[colXs.length - 1];
    const hits = fills.filter((f) => {
      const w = f.x2 - f.x1;
      if (w < NARROW_FILL_MIN_W || w >= CLIP_MIN_W2 || Math.abs((side === "l" ? f.x2 : f.x1) - edge) > CLIP_COORD_TOL) return false;
      const r0 = rowIdx(f.y2), r1 = rowIdx(f.y1);
      return r0 >= 0 && r1 > r0;
    });
    if (!hits.length) continue;
    let x = side === "l" ? Infinity : -Infinity;
    for (const f of hits) x = side === "l" ? Math.min(x, f.x1) : Math.max(x, f.x2);
    if (side === "l") {
      colXs.unshift(x);
      for (const c of out) c.col++;
    } else colXs.push(x);
    const col = side === "l" ? 0 : colXs.length - 2;
    const [cx1, cx2] = [colXs[col], colXs[col + 1]];
    const taken = new Array(rowYs.length - 1).fill(false);
    for (const f of hits) {
      const r0 = rowIdx(f.y2), r1 = rowIdx(f.y1);
      if (taken.slice(r0, r1).some(Boolean)) continue;
      taken.fill(true, r0, r1);
      out.push({ row: r0, col, rowSpan: r1 - r0, colSpan: 1, bbox: { x1: cx1, y1: rowYs[r1], x2: cx2, y2: rowYs[r0] } });
    }
    for (let r = 0; r < taken.length; r++) {
      if (!taken[r]) out.push({ row: r, col, rowSpan: 1, colSpan: 1, bbox: { x1: cx1, y1: rowYs[r + 1], x2: cx2, y2: rowYs[r] }, filler: true });
    }
  }
}
function dropGridsInside(lineGrids, clipGrids, containers = []) {
  if (clipGrids.length === 0 && containers.length === 0) return lineGrids;
  const area = (b) => Math.max(0, b.x2 - b.x1) * Math.max(0, b.y2 - b.y1);
  const overlapsHalf = (g, b) => {
    const ix = Math.min(g.x2, b.x2) - Math.max(g.x1, b.x1);
    const iy = Math.min(g.y2, b.y2) - Math.max(g.y1, b.y1);
    if (ix <= 0 || iy <= 0) return false;
    const ga = area(g);
    return ga > 0 && ix * iy / ga >= 0.5;
  };
  return lineGrids.filter((g) => {
    if (clipGrids.some((c) => overlapsHalf(g.bbox, c.bbox))) return false;
    if (containers.some((c) => overlapsHalf(g.bbox, c))) return false;
    return true;
  });
}
function extractCells(grid, horizontals, verticals) {
  const { rowYs, colXs } = grid;
  const numRows = rowYs.length - 1;
  const numCols = colXs.length - 1;
  if (numRows <= 0 || numCols <= 0) return [];
  const vBorders = Array.from(
    { length: numRows },
    (_, r) => Array.from(
      { length: numCols + 1 },
      (_2, c) => hasVerticalLine(verticals, colXs[c], rowYs[r], rowYs[r + 1], grid.vertexRadius)
    )
  );
  const hBorders = Array.from(
    { length: numRows + 1 },
    (_, r) => Array.from(
      { length: numCols },
      (_2, c) => hasHorizontalLine(horizontals, rowYs[r], colXs[c], colXs[c + 1], grid.vertexRadius)
    )
  );
  const occupied = Array.from({ length: numRows }, () => Array(numCols).fill(false));
  const cells = [];
  for (let r = 0; r < numRows; r++) {
    for (let c = 0; c < numCols; c++) {
      if (occupied[r][c]) continue;
      let colSpan = 1;
      let rowSpan = 1;
      while (c + colSpan < numCols && !vBorders[r][c + colSpan]) {
        let canExpand = true;
        for (let dr = 0; dr < rowSpan; dr++) {
          if (vBorders[r + dr][c + colSpan]) {
            canExpand = false;
            break;
          }
        }
        if (!canExpand) break;
        colSpan++;
      }
      while (r + rowSpan < numRows) {
        let hasLine = false;
        for (let dc = 0; dc < colSpan; dc++) {
          if (hBorders[r + rowSpan][c + dc]) {
            hasLine = true;
            break;
          }
        }
        if (hasLine) break;
        rowSpan++;
      }
      for (let dr = 0; dr < rowSpan; dr++) {
        for (let dc = 0; dc < colSpan; dc++) {
          occupied[r + dr][c + dc] = true;
        }
      }
      cells.push({
        row: r,
        col: c,
        rowSpan,
        colSpan,
        bbox: {
          x1: colXs[c],
          y1: rowYs[r + rowSpan],
          x2: colXs[c + colSpan],
          y2: rowYs[r]
        }
      });
    }
  }
  return cells;
}
function hasVerticalLine(verticals, x, topY, botY, vertexRadius) {
  const tol = Math.max(VERTEX_MERGE_FACTOR * vertexRadius, 4);
  for (const v of verticals) {
    if (Math.abs(v.x1 - x) <= tol) {
      const cellH = Math.abs(topY - botY);
      if (cellH < 0.1) continue;
      const overlapTop = Math.min(v.y2, topY);
      const overlapBot = Math.max(v.y1, botY);
      const overlap2 = overlapTop - overlapBot;
      if (overlap2 >= cellH * 0.75) return true;
    }
  }
  return false;
}
function hasHorizontalLine(horizontals, y, leftX, rightX, vertexRadius) {
  const tol = Math.max(VERTEX_MERGE_FACTOR * vertexRadius, 4);
  for (const h of horizontals) {
    if (Math.abs(h.y1 - y) <= tol) {
      const cellW = Math.abs(rightX - leftX);
      if (cellW < 0.1) continue;
      const overlapLeft = Math.max(h.x1, leftX);
      const overlapRight = Math.min(h.x2, rightX);
      const overlap2 = overlapRight - overlapLeft;
      if (overlap2 >= cellW * 0.75) return true;
    }
  }
  return false;
}
function scriptKindsOfLine(sorted) {
  const kinds = sorted.map(() => null);
  if (sorted.length < 2) return kinds;
  const weight = /* @__PURE__ */ new Map();
  for (const it of sorted) {
    const k = Math.round(it.fontSize * 2) / 2;
    weight.set(k, (weight.get(k) ?? 0) + it.text.trim().length);
  }
  let bodyFs = 0, best = -1;
  for (const [fs, n] of weight) if (n > best || n === best && fs > bodyFs) {
    best = n;
    bodyFs = fs;
  }
  if (bodyFs <= 0) return kinds;
  const ys = sorted.filter((it) => Math.abs(it.fontSize - bodyFs) <= bodyFs * 0.12).map((it) => it.y).sort((a, b) => a - b);
  const bodyY = ys[ys.length >> 1];
  const isBody = (it) => it.fontSize > bodyFs * 0.85;
  for (let i = 1; i < sorted.length; i++) {
    const it = sorted[i], prev = sorted[i - 1];
    const t = it.text.trim();
    if (!t || t.length > 16 || isBody(it)) continue;
    if (!isBody(prev) && !kinds[i - 1]) continue;
    const gap = it.x - (prev.x + prev.w);
    if (gap > bodyFs * 0.35 || gap < -bodyFs * 0.5) continue;
    const dy = it.y - bodyY;
    if (dy >= bodyFs * 0.15) kinds[i] = "sup";
    else if (dy <= -bodyFs * 0.08) kinds[i] = "sub";
  }
  return kinds;
}
function tagScripts(text, lines) {
  const marks = [];
  let cursor = 0;
  for (const line of lines) {
    const kinds = scriptKindsOfLine(line);
    for (let k = 0; k < line.length; k++) {
      const t = line[k].text;
      if (!t) continue;
      const at = text.indexOf(t, cursor);
      if (at < 0 || /\S/.test(text.slice(cursor, at))) return text;
      if (kinds[k]) marks.push([at, at + t.length, kinds[k]]);
      cursor = at + t.length;
    }
  }
  if (!marks.length) return text;
  let out = text;
  for (let m = marks.length - 1; m >= 0; m--) {
    const [s, e, kind] = marks[m];
    out = out.slice(0, s) + `<${kind}>` + out.slice(s, e) + `</${kind}>` + out.slice(e);
  }
  return tidyScriptTags(out);
}
var MARKUP = /<\/?u>|~~/g;
var bump = (m, k) => {
  m.set(k, (m.get(k) ?? 0) + 1);
};
var pairKey = (a, b) => a * 65536 + b;
var bump2 = (m, k1, k2) => {
  let inner = m.get(k1);
  if (!inner) m.set(k1, inner = /* @__PURE__ */ new Map());
  bump(inner, k2);
};
var WrapLexicon = class {
  joined1 = /* @__PURE__ */ new Map();
  joined2 = /* @__PURE__ */ new Map();
  spaced1 = /* @__PURE__ */ new Map();
  spaced2 = /* @__PURE__ */ new Map();
  /** 줄 안(줄 첫·끝 어절 제외 — 꺾인 조각일 수 있다) 홀로 선 어절 수 — 한 음절 조각이 낱말("등"·"및"·"그")인지 가른다 */
  words = /* @__PURE__ */ new Map();
  /** 줄 안에서 이웃한 두 어절("개인정보 처리") — 이어 붙인 꼴 증거(joinedWord)의 거부권 */
  pairs = /* @__PURE__ */ new Set();
  /** 줄 글 한 줄을 증거로 더한다 — 탭(큰 갭)으로 나뉜 조각은 다른 칸·단이라 조각 사이는 어절 경계 증거로 쓰지 않는다 */
  addLine(text) {
    for (const seg of text.replace(MARKUP, "").split("	")) {
      const toks = seg.split(" ").filter((t) => t && !t.includes("]("));
      for (let i = 0; i < toks.length; i++) {
        const t = toks[i], n = t.length;
        if (i > 0 && i < toks.length - 1) bump(this.words, t);
        if (i + 1 < toks.length) this.pairs.add(t + " " + toks[i + 1]);
        for (let a = 0; a + 1 < n; a++) {
          const c1 = t.charCodeAt(a), c2 = t.charCodeAt(a + 1);
          bump(this.joined1, pairKey(c1, c2));
          if (a >= 1 && a + 2 < n) bump2(this.joined2, pairKey(t.charCodeAt(a - 1), c1), pairKey(c2, t.charCodeAt(a + 2)));
        }
        if (i + 1 < toks.length) {
          const u = toks[i + 1];
          bump(this.spaced1, pairKey(t.charCodeAt(n - 1), u.charCodeAt(0)));
          if (n >= 2 && u.length >= 2) bump2(this.spaced2, pairKey(t.charCodeAt(n - 2), t.charCodeAt(n - 1)), pairKey(u.charCodeAt(0), u.charCodeAt(1)));
        }
      }
    }
  }
  /** 문서 줄 안에서 홀로 선 어절로 나온 적 있나 */
  isWord(word) {
    return (this.words.get(word) ?? 0) > 0;
  }
  /** 꺾인 두 조각을 이어 붙인 꼴이 줄 안 한 어절로 나왔고, 두 조각이 줄 안에서 띄어 쓴 이웃 어절로는 나온 적 없나 */
  joinedWord(left, right) {
    return this.isWord(left + right) && !this.pairs.has(left + " " + right);
  }
  /** 두 글자+두 글자 증거만 — 한 글자 쌍으로 물러서지 않는다 (표 칸 조각처럼 줄 꺾임이 아닌 자리에 쓸 때) */
  evidence2(left, right) {
    const n = left.length;
    if (n < 2 || right.length < 2) return null;
    const k1 = pairKey(left.charCodeAt(n - 2), left.charCodeAt(n - 1)), k2 = pairKey(right.charCodeAt(0), right.charCodeAt(1));
    return decideCounts(this.joined2.get(k1)?.get(k2) ?? 0, this.spaced2.get(k1)?.get(k2) ?? 0);
  }
  /** 꺾인 자리 증거: "" 붙음 · " " 띄움 · null 모름 (두 글자 증거가 갈리거나 없으면 한 글자) */
  evidence(left, right) {
    const n = left.length;
    if (n >= 2 && right.length >= 2) {
      const k1 = pairKey(left.charCodeAt(n - 2), left.charCodeAt(n - 1)), k2 = pairKey(right.charCodeAt(0), right.charCodeAt(1));
      const v = decideCounts(this.joined2.get(k1)?.get(k2) ?? 0, this.spaced2.get(k1)?.get(k2) ?? 0);
      if (v !== null) return v;
    }
    if (n && right.length) {
      const k = pairKey(left.charCodeAt(n - 1), right.charCodeAt(0));
      return decideCounts(this.joined1.get(k) ?? 0, this.spaced1.get(k) ?? 0);
    }
    return null;
  }
};
var decideCounts = (joined, spaced) => joined && !spaced ? "" : spaced && !joined ? " " : null;
var hasBatchim = (c) => {
  const k = c.charCodeAt(0) - 44032;
  return k >= 0 && k < 11172 && k % 28 !== 0;
};
var CJK = /[\u3000-\u303F\u3040-\u30FF\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF\uFF00-\uFFEF]/;
var unspacedCjkBoundary = (prev, next) => CJK.test(prev.trimEnd().slice(-1)) && CJK.test(next.trimStart().charAt(0)) && !/[가-힣ㄱ-ㅎㅏ-ㅣ]/.test(prev + next);
var CLOSE_TAIL = /[’”」』)\]〉》>]+$/;
var TAIL = "[.,)\u300D\u300F\u2019\u201D]*";
var PARTICLE = new RegExp(`^(?:\uB2E4\\.|\uC758|\uC5D0|\uC5D0\uC11C|\uC5D0\uB294|\uC5D0\uAC8C|\uC5D0\uB3C4|\uC5D0\uC11C\uB294|\uAE4C\uC9C0|\uBD80\uD130|\uCC98\uB7FC|\uB9C8\uB2E4|\uB9CC|\uB3C4|\uB4E4|\uB4E4\uC774|\uB4E4\uC758|\uB4E4\uC740|\uB4E4\uC744|\uB4E4\uC5D0\uAC8C|\uC11C\uB294|\uC11C\uB3C4|\uB77C\uACE0|\uB77C\uBA70|\uC740|\uB294|\uC744|\uB97C|\uC73C\uB85C|\uB85C|\uC73C\uB85C\uC11C|\uB85C\uC11C|\uC73C\uB85C\uC368|\uB85C\uC368)${TAIL}$`);
var PARTICLE_AFTER_CONS = new RegExp(`^(?:\uC774|\uACFC|\uC774\uB2E4|\uC774\uBA70|\uC774\uACE0|\uC774\uB098|\uC774\uB77C\uB294|\uC774\uB77C\uACE0|\uC774\uB77C\uBA70|\uC778|\uC778\uB370|\uC778\uC9C0|\uC784|\uC774\uC5B4\uC57C|\uC774\uBBC0\uB85C|\uC774\uC9C0\uB9CC|\uC774\uBA74\uC11C)${TAIL}$`);
var PARTICLE_AFTER_VOWEL = new RegExp(`^(?:\uAC00|\uC640|\uB77C\uB294)${TAIL}$`);
var ENDING = new RegExp(`^(?:\uC5B4\uC57C|\uC544\uC57C|\uC5EC\uC57C|\uBBC0\uB85C|\uC73C\uBBC0\uB85C|\uC9C0\uB9CC|\uBA74\uC11C|\uC73C\uBA74\uC11C|\uC73C\uBA70|\uAC70\uB098|\uB354\uB77C\uB3C4|\uB4E0\uC9C0|\uC5C8\uB2E4|\uC558\uB2E4|\uC600\uB2E4|\uC5C8\uC73C\uBA70|\uC558\uC73C\uBA70|\uC600\uC73C\uBA70|\uC5C8\uACE0|\uC558\uACE0|\uC600\uACE0|\uACA0\uB2E4|\uACA0\uACE0|\uACA0\uC73C\uBA70|\uC2B5\uB2C8\uB2E4|\uB2C8\uB2E4|\uB2C8\uAE4C)${TAIL}$`);
var ADNOMINAL_HAN = new RegExp(`^\uD55C${TAIL}$`);
var SUFFIX_JEOK = new RegExp(`^\uC801(?:\uC778|\uC73C\uB85C|\uC774\uB2E4|\uC774\uBA70|\uC774\uACE0|\uC784|\uC778\uB370|\uC774\uB77C|\uC774\uC9C0\uB9CC|\uC73C\uB85C\uC11C)${TAIL}$`);
var SPLIT_PARTICLE = [["\uC5D0", new RegExp(`^\uC11C(?:\uB294|\uB3C4|\uC758|\uBD80\uD130|\uB9CC)?${TAIL}$`)], ["\uC774", new RegExp(`^\uB098${TAIL}$`)]];
var VERB_FORM = new RegExp(`^(?:\uD558\uB294|\uD558\uC5EC|\uD558\uACE0|\uD558\uBA70|\uD558\uC600\uB2E4|\uD558\uC600\uC73C\uBA70|\uD558\uC600\uACE0|\uD558\uC600\uB2E4\uACE0|\uD588\uB2E4|\uD588\uC73C\uBA70|\uD588\uACE0|\uD588\uB2E4\uACE0|\uD588\uB2E4\uBA70|\uD55C\uB2E4|\uD55C\uB2E4\uACE0|\uD55C\uB2E4\uBA70|\uD55C\uB2E4\uB294|\uD560|\uD568|\uD558\uACA0\uB2E4|\uD558\uACA0\uB2E4\uACE0|\uD558\uACA0\uC2B5\uB2C8\uB2E4|\uD558\uAE30\uB85C|\uD558\uBA74|\uD558\uBA74\uC11C|\uD558\uB3C4\uB85D|\uD574\uC57C|\uB418\uB294|\uB418\uC5B4|\uB41C|\uB41C\uB2E4|\uB41C\uB2E4\uACE0|\uB41C\uB2E4\uB294|\uB418\uC5C8\uB2E4|\uB418\uC5C8\uC73C\uBA70|\uB418\uC5C8\uACE0|\uB410\uB2E4|\uB410\uC73C\uBA70|\uB418\uBA70|\uB418\uACE0|\uB418\uBA74|\uB428|\uB3FC|\uD558\uAE30|\uD558\uAC8C|\uD558\uC9C0|\uD558\uAC70\uB098|\uD574\uC11C|\uD558\uB294\uB370|\uD568\uC73C\uB85C\uC368|\uD568\uC5D0|\uD568\uC744|\uD568\uC774|\uD558\uAE30\uC5D0|\uD558\uAE30\uB3C4|\uB418\uC9C0|\uB418\uAE30|\uB418\uB3C4\uB85D|\uB418\uAC70\uB098|\uB418\uBA74\uC11C)${TAIL}$`);
var AUX_BEFORE = /(?:야|록|로|게|도|히|자|를|을|면|서|고|며|라|려|까지)$/;
var BECOME = /^[되된됐됨돼]/;
var STANDALONE_SYLLABLE = /^(?:및|등|수|것|그|이|저|더|또|각|약|총|중|간|때|뿐|듯|채|전|후|내|외|한|두|세|네|몇|새|첫|온|본|곧|꼭|잘|못|안|좀|늘|다|왜|뭐|시|할|데|뒤|된)$/;
var DATE_DAY_END = /(?:^|\s)\d*월\s+\d*일$/;
var COUNTER = /^(?:명|일|월|년|개|원|건|회|차|호|조|항|층|톤|대|곳|시|분|초|배|위|점|주|종|억|만|천|%|퍼센트)/;
function endsAsWord(word) {
  const h = word.replace(CLOSE_TAIL, "");
  if (!/^[가-힣]{2,}$/.test(h)) return false;
  if (/(?:을|를|는|은|히|른|할|야|게|의)$/.test(h)) return true;
  const prev = h[h.length - 2];
  if (/(?:이|과)$/.test(h)) return hasBatchim(prev);
  if (/(?:가|와)$/.test(h)) return !hasBatchim(prev);
  return false;
}
function particleContinues(left, rightWord) {
  const right = rightWord.replace(/[”’"」』].+$/, "");
  const h = left.replace(CLOSE_TAIL, "");
  const last = h[h.length - 1];
  if (!last || !/[가-힣A-Za-z0-9]/.test(last)) return false;
  if (PARTICLE.test(right)) return true;
  if (!/[가-힣]/.test(last)) return false;
  if (SUFFIX_JEOK.test(right)) return true;
  if (ENDING.test(right)) return true;
  if (/^다[.;:!?]/.test(right)) return true;
  if (SPLIT_PARTICLE.some(([a, b]) => last === a && b.test(right))) return true;
  if (PARTICLE_AFTER_CONS.test(right)) return hasBatchim(last);
  if (PARTICLE_AFTER_VOWEL.test(right)) return !hasBatchim(last);
  if (ADNOMINAL_HAN.test(right)) return h.length >= 2 && !AUX_BEFORE.test(h) && !/(?:는|은|한|다|어|년)$/.test(h);
  return VERB_FORM.test(right) && !AUX_BEFORE.test(h) && !((last === "\uC774" || last === "\uAC00" && h.length >= 3) && BECOME.test(right));
}
var ITEM_HEAD = /^(?:[□■◆◇○●◎◦▪▫•※▶▷►❍❏❑✓✔➢➤☞]|[①-⑳]|[-–·∙ㆍ*](?=\s)|\(?\d{1,2}[.)](?!\d)|\(?[가-하][.)]|\([가-하\d]{1,2}\)|[ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩ]|제\d+[조항호장절])/;
function startsNewItem(prevText, nextText) {
  const t = nextText.replace(MARKUP, "").trimStart();
  return ITEM_HEAD.test(t) && !(/^다\./.test(t) && /[가-힣]$/.test(prevText.replace(MARKUP, "").trimEnd()));
}
function wrapJoiner(prevText, nextText, lex) {
  const prev = prevText.replace(MARKUP, "").trimEnd(), next = nextText.replace(MARKUP, "").trimStart();
  const a = prev[prev.length - 1], b = next[0];
  if (!a || !b || /[,;:!?]/.test(a) || DATE_DAY_END.test(prev) && b !== "(") return " ";
  if (unspacedCjkBoundary(prev, next)) return "";
  let s = prev.length;
  while (s > 0 && !/\s/.test(prev[s - 1])) s--;
  const left = prev.slice(s), right = next.match(/^\S+/)[0];
  if (particleContinues(left, right)) return "";
  if (endsAsWord(left)) return " ";
  if (/[A-Za-z]-$/.test(left) && /^[A-Za-z]/.test(right) && !/[가-힣]/.test(prev + next)) {
    return lex?.joinedWord(left, right.replace(/[.,;:!?)]*$/, "")) ? "" : " ";
  }
  if (/[·ㆍ‧-]/.test(a) && !/[·ㆍ‧…]{2}$/.test(prev) && /[가-힣A-Za-z0-9]/.test(b)) return "";
  if (/[A-Za-z]/.test(a) && /[A-Za-z]/.test(b) || /\d/.test(a) && /\d/.test(b)) return " ";
  const ev = lex?.evidence(left, right);
  if (ev != null) return ev;
  if (lex && /[가-힣A-Za-z0-9]$/.test(left) && /^[가-힣A-Za-z0-9]/.test(right) && lex.joinedWord(left, right.replace(/[.,)」』’”;:]+$/, ""))) return "";
  if (/\d$/.test(left) && COUNTER.test(right)) return "";
  if (lex && /^[가-힣]$/.test(left) && /^[가-힣]/.test(right) && !STANDALONE_SYLLABLE.test(left) && ([...right].length === 1 || !lex.isWord(left))) return "";
  const r1 = right.replace(/[.,)」』’”]+$/, "");
  if (lex && /[가-힣]$/.test(left) && /^[가-힣]$/.test(r1) && !STANDALONE_SYLLABLE.test(r1) && !lex.isWord(r1) && !lex.isWord(right)) return "";
  return " ";
}
var PARA_LAST_LINE = /* @__PURE__ */ new WeakMap();
var PARA_FIRST_LEFT = /* @__PURE__ */ new WeakMap();
var PAGE_REF_TAIL = /(?:\t|…|·{2}|\.{3})\s*\d{1,4}(?:\s*\/\s*\d{1,4})?\s*$/;
var PAGE_HEAD_MARK = /^(?:[\u0000-\u001f\ue000-\uf8ff\u25a0-\u25ff\u2750-\u275f<〈《〔\[]|ㅇ\s)/;
var PAGE_ITEM_HEAD = /^(?:\S{1,4}\t|\.\d{1,3}\s)/;
var SENTENCE_END = /[.?!。][”"’」』)]?$/;
var titleLike = (text) => {
  const t = text.replace(MARKUP, "").trim();
  return !t.includes("\n") && [...t].length <= 40 && !SENTENCE_END.test(t);
};
var PAGE_BREAK_JOINS = /* @__PURE__ */ new WeakMap();
function joinPageBreakWraps(blocks, lex) {
  const pageRight = /* @__PURE__ */ new Map();
  for (const b of blocks) {
    if (b.type !== "paragraph" || !b.bbox || !b.pageNumber) continue;
    pageRight.set(b.pageNumber, Math.max(pageRight.get(b.pageNumber) ?? -Infinity, b.bbox.x + b.bbox.width));
  }
  const pageLeft = /* @__PURE__ */ new Map();
  for (const b of blocks) {
    if (b.type !== "paragraph" || !b.bbox || !b.pageNumber) continue;
    pageLeft.set(b.pageNumber, Math.min(pageLeft.get(b.pageNumber) ?? Infinity, b.bbox.x));
  }
  for (let i = blocks.length - 1; i > 0; i--) {
    const a = blocks[i - 1], b = blocks[i];
    if (!a.pageNumber || b.pageNumber !== a.pageNumber + 1 || !a.text || !b.text) continue;
    if (a.type !== "paragraph" && a.type !== "list" || b.type !== "paragraph") continue;
    const last = a.bbox && PARA_LAST_LINE.get(a.bbox), fs = last ? last.fontSize : 0;
    if (!last || fs <= 0 || (pageRight.get(a.pageNumber) ?? Infinity) - last.right >= BODY_FULL_TOL * fs) continue;
    if (last.width < BODY_MIN_WIDTH_EM * fs || Math.abs((b.style?.fontSize ?? 0) - fs) > 0.15 * fs) continue;
    const bt = b.text.replace(MARKUP, "");
    if (startsNewItem(a.text, b.text) || PAGE_REF_TAIL.test(a.text) || PAGE_ITEM_HEAD.test(bt)) continue;
    if (PAGE_HEAD_MARK.test(bt) && !(/^[\u25a0-\u25ff]/.test(bt) && a.text.includes(bt[0]))) continue;
    const firstLeft = b.bbox && PARA_FIRST_LEFT.get(b.bbox);
    const indented = firstLeft === void 0 || firstLeft - (pageLeft.get(b.pageNumber) ?? firstLeft) >= 0.3 * fs;
    if (indented && SENTENCE_END.test(a.text.replace(MARKUP, "").trimEnd())) continue;
    if (Math.round(b.style?.fontSize ?? 0) !== Math.round(fs) && titleLike(b.text)) continue;
    if (/\t/.test(a.text.slice(a.text.lastIndexOf("\n") + 1).replace(/^\S{1,8}\t/, "")) && titleLike(bt.trim().split("\n")[0])) continue;
    const head = a.text, joiner = wrapJoiner(a.text, b.text, lex);
    a.text += joiner + b.text;
    const later = b.bbox && PAGE_BREAK_JOINS.get(b.bbox) || [];
    PAGE_BREAK_JOINS.set(a.bbox, [{ head, gap: joiner.length, tail: b }, ...later.map((c) => ({ ...c, head: head + joiner + c.head }))]);
    const bl = b.bbox && PARA_LAST_LINE.get(b.bbox);
    if (bl) PARA_LAST_LINE.set(a.bbox, bl);
    else PARA_LAST_LINE.delete(a.bbox);
    blocks.splice(i, 1);
  }
}
function splitPageBreakWraps(blocks) {
  return blocks.flatMap((b) => {
    const cuts = b.bbox && PAGE_BREAK_JOINS.get(b.bbox);
    const text = b.text;
    if (!cuts || !text) return [b];
    const out = [];
    let from = 0, cur = b;
    for (const c of cuts) {
      if (c.head.length < from || !text.startsWith(c.head)) break;
      out.push({ ...cur, text: text.slice(from, c.head.length) });
      from = c.head.length + c.gap;
      cur = c.tail;
    }
    if (!out.length) return [b];
    out.push({ ...cur, text: text.slice(from) });
    return out;
  });
}
var HANGING = /[，。、：；！？）」』】〕》〉．]\s*$/;
var MULTI_LEVEL_NUMBER = /^\d{1,2}(?:\.\d{1,3})+\.?\s/;
var BODY_FULL_TOL = 0.25;
var BODY_MIN_WIDTH_EM = 12;
var BODY_MAX_PITCH_EM = 2;
var BODY_PITCH_REL = 1.05;
var BODY_MAX_PITCH_ABS_EM = 3.5;
function bodyLineJoins(lines, lex) {
  lines = lines.map((l) => {
    const text = l.text.replace(MARKUP, "");
    return text === l.text ? l : { ...l, text };
  });
  let right = -Infinity;
  for (const l of lines) if (l.right > right) right = l.right;
  let inner = -Infinity;
  for (const l of lines) if (!HANGING.test(l.text) && l.right > inner) inner = l.right;
  const full = (l) => right - l.right < BODY_FULL_TOL * l.fontSize || right - inner <= 1.2 * l.fontSize && inner - l.right < BODY_FULL_TOL * l.fontSize;
  const nextWordNoRoom = (a, b) => {
    const w = b.text.trim().match(/^\S+/)?.[0];
    const n = [...b.text.trim()].length;
    if (!w || n === 0) return false;
    const em = (b.right - b.left) / n;
    const advance = unspacedCjkBoundary(a.text, b.text) ? 1 : [...w].length + 1;
    return right - a.right < advance * em;
  };
  const candidates = lines.filter((l, i) => full(l) || i + 1 < lines.length && nextWordNoRoom(l, lines[i + 1]));
  const ragged = candidates.filter(full).length * 2 < candidates.length;
  const pitch = (k) => lines[k].y - lines[k + 1].y;
  const sameSize = (k) => Math.abs(lines[k + 1].fontSize - lines[k].fontSize) <= 0.15 * lines[k].fontSize;
  let p1 = Infinity, p2 = Infinity, i1 = -1;
  for (let k = 0; k + 1 < lines.length; k++) {
    const p = pitch(k);
    if (p <= 0 || !sameSize(k) || Math.min(lines[k].right - lines[k].left, lines[k + 1].right - lines[k + 1].left) < 3 * lines[k].fontSize) continue;
    if (p < p1) {
      p2 = p1;
      p1 = p;
      i1 = k;
    } else if (p < p2) p2 = p;
  }
  const out = [];
  for (let i = 0; i + 1 < lines.length; i++) {
    const a = lines[i], b = lines[i + 1];
    const fs = a.fontSize;
    const others = i === i1 ? p2 : p1;
    const maxPitch = Number.isFinite(others) ? Math.min(BODY_MAX_PITCH_ABS_EM * fs, Math.max(BODY_MAX_PITCH_EM * fs, others * BODY_PITCH_REL)) : BODY_MAX_PITCH_EM * fs;
    const wordWrap = ragged && !full(a) && nextWordNoRoom(a, b) && !MULTI_LEVEL_NUMBER.test(b.text.trimStart());
    const wraps = fs > 0 && (full(a) || wordWrap) && a.right - a.left >= BODY_MIN_WIDTH_EM * fs && a.y - b.y > 0 && a.y - b.y < maxPitch && Math.abs(b.fontSize - fs) <= 0.15 * fs && !startsNewItem(a.text, b.text);
    out.push(!wraps ? "\n" : wordWrap ? unspacedCjkBoundary(a.text, b.text) ? "" : " " : wrapJoiner(a.text, b.text, lex));
  }
  return out;
}
var CELL_PAD_MAX = 6;
function cellLineWraps(box, contentLeft, prevRight, fontSize, nextFirstCharW) {
  const pad = Math.min(CELL_PAD_MAX, Math.max(0, contentLeft - box.x1));
  return fontSize > 0 && prevRight + nextFirstCharW - (box.x2 - pad) > 0.5 * fontSize;
}
function cellLineFills(box, contentLeft, cellRight, lineRight, fontSize) {
  const pad = Math.min(CELL_PAD_MAX, Math.max(0, contentLeft - box.x1));
  return fontSize > 0 && cellRight - lineRight < BODY_FULL_TOL * fontSize && lineRight - contentLeft >= 0.8 * (box.x2 - box.x1 - 2 * pad);
}
var REGION_LABELS = /* @__PURE__ */ new Set(["\uC11C\uC6B8", "\uBD80\uC0B0", "\uB300\uAD6C", "\uC778\uCC9C", "\uAD11\uC8FC", "\uB300\uC804", "\uC6B8\uC0B0", "\uC138\uC885", "\uACBD\uAE30", "\uAC15\uC6D0", "\uCDA9\uBD81", "\uCDA9\uB0A8", "\uC804\uBD81", "\uC804\uB0A8", "\uACBD\uBD81", "\uACBD\uB0A8", "\uC81C\uC8FC", "\uC804\uAD6D"]);
var CELL_PADDING = 2;
function cleanCellText(text) {
  const stripped = text.replace(/^[\s]*[-–—]\s*\d+\s*[-–—][\s]*$/gm, "").trim();
  return stripped.split("\n").map((line) => collapseEvenSpacing(line)).join("\n");
}
var SPACE_GAP_RATIO = 0.17;
function spaceGapThreshold(fontSize) {
  return Math.max(fontSize * SPACE_GAP_RATIO, 1);
}
function mapTextToCells(items, cells) {
  const result = /* @__PURE__ */ new Map();
  for (const cell of cells) {
    result.set(cell, []);
  }
  const candidates = items.length * cells.length >= 5e3 ? cellBandLookup(cells) : () => cells;
  for (const item of items) {
    const pad = CELL_PADDING;
    let bestCell = null;
    let bestScore = 0;
    for (const cell of candidates(item.y - pad, item.y + (item.h || item.fontSize) + pad)) {
      const ix1 = Math.max(item.x, cell.bbox.x1 - pad);
      const ix2 = Math.min(item.x + item.w, cell.bbox.x2 + pad);
      const iy1 = Math.max(item.y, cell.bbox.y1 - pad);
      const iy2 = Math.min(item.y + (item.h || item.fontSize), cell.bbox.y2 + pad);
      if (ix1 >= ix2 || iy1 >= iy2) continue;
      const intersectArea = (ix2 - ix1) * (iy2 - iy1);
      const itemArea = Math.max(item.w, 1) * Math.max(item.h || item.fontSize, 1);
      const score = intersectArea / itemArea;
      if (score > bestScore) {
        bestScore = score;
        bestCell = cell;
      }
    }
    if (bestCell && bestScore > 0.3) {
      result.get(bestCell).push(item);
    }
  }
  keepWordsInOneCell(result);
  return result;
}
function cellBandLookup(cells) {
  const sorted = cells.map((cell, index) => ({ cell, index })).sort((a, b) => a.cell.bbox.y1 - b.cell.bbox.y1);
  const build = (start, end) => {
    let lo = Infinity, hi = -Infinity;
    for (let i = start; i < end; i++) {
      lo = Math.min(lo, sorted[i].cell.bbox.y1);
      hi = Math.max(hi, sorted[i].cell.bbox.y2);
    }
    const band = { start, end, lo, hi };
    if (end - start > 8) {
      const mid = start + end >> 1;
      band.left = build(start, mid);
      band.right = build(mid, end);
    }
    return band;
  };
  const root = build(0, sorted.length);
  return (lo, hi) => {
    const found = [];
    const visit = (band) => {
      if (band.hi <= lo || band.lo >= hi) return;
      if (band.left && band.right) {
        visit(band.left);
        visit(band.right);
      } else for (let i = band.start; i < band.end; i++) {
        const entry = sorted[i];
        if (entry.cell.bbox.y2 > lo && entry.cell.bbox.y1 < hi) found.push(entry);
      }
    };
    visit(root);
    return found.sort((a, b) => a.index - b.index).map((entry) => entry.cell);
  };
}
function keepWordsInOneCell(result) {
  const owner = /* @__PURE__ */ new Map();
  for (const [cell, arr] of result) for (const it of arr) owner.set(it, cell);
  if (result.size < 2 || owner.size < 2) return;
  const all = [...owner.keys()].sort((a, b) => b.y - a.y || a.x - b.x);
  for (let i = 0; i < all.length; ) {
    let j = i + 1;
    while (j < all.length && Math.abs(all[j].y - all[i].y) <= 1) j++;
    const line = all.slice(i, j).sort((a, b) => a.x - b.x);
    for (let k = 0; k < line.length; ) {
      let e = k + 1;
      while (e < line.length && !line[e].hasSpaceBefore && line[e].x - (line[e - 1].x + line[e - 1].w) <= spaceGapThreshold((line[e].fontSize + line[e - 1].fontSize) / 2)) e++;
      const word = line.slice(k, e);
      const width = /* @__PURE__ */ new Map();
      for (const it of word) {
        const c = owner.get(it);
        width.set(c, (width.get(c) ?? 0) + it.w);
      }
      const crosses = word.some((it) => {
        const b = owner.get(it).bbox;
        return it.x < b.x1 - 1 || it.x + it.w > b.x2 + 1;
      });
      if (width.size > 1 && crosses) {
        const target = [...width].sort((a, b) => b[1] - a[1])[0][0];
        for (const it of word) {
          const c = owner.get(it);
          if (c === target) continue;
          result.set(c, result.get(c).filter((x) => x !== it));
          result.get(target).push(it);
          owner.set(it, target);
        }
      }
      k = e;
    }
    i = j;
  }
}
function cellTextToString(items, wrap) {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0].text;
  const sorted = [...items].sort((a, b) => b.y - a.y || a.x - b.x);
  const lines = [];
  let curLine = [sorted[0]];
  let curY = sorted[0].y;
  for (let i = 1; i < sorted.length; i++) {
    const tol = Math.max(3, Math.min(sorted[i].fontSize, curLine[0].fontSize) * 0.6);
    if (Math.abs(sorted[i].y - curY) <= tol) {
      curLine.push(sorted[i]);
    } else {
      lines.push(curLine);
      curLine = [sorted[i]];
      curY = sorted[i].y;
    }
  }
  lines.push(curLine);
  const merged = mergeSuperscriptRows(lines).map((line) => sortLineByX(line));
  const textLines = merged.map((s) => {
    if (s.length === 1) return s[0].text;
    if (s.length === 2 && /^[가-힣]$/.test(s[0].text) && /^[가-힣]$/.test(s[1].text) && !!wrap?.lex && (wrap.lex.isWord(s[0].text + s[1].text) || wrap.lex.evidence(s[0].text, s[1].text) === "" || REGION_LABELS.has(s[0].text + s[1].text)) && s[1].x - (s[0].x + s[0].w) >= Math.max(s[0].fontSize, s[1].fontSize) * 1.5 && s[1].x + s[1].w - s[0].x >= wrap.box.x2 - wrap.box.x1 - Math.max(s[0].fontSize, s[1].fontSize) * 2) return s[0].text + s[1].text;
    const evenSpaced = detectEvenSpacedItems(s, true);
    let result = s[0].text;
    for (let j = 1; j < s.length; j++) {
      if (evenSpaced[j]) {
        result += s[j].text;
        continue;
      }
      const gap = s[j].x - (s[j - 1].x + s[j - 1].w);
      const avgFs = (s[j].fontSize + s[j - 1].fontSize) / 2;
      if (isCjkLatinAutospace(s[j - 1].text, s[j].text, gap, avgFs)) {
        result += s[j].text;
      } else if (s[j].hasSpaceBefore && gap >= avgFs * 0.05) {
        result += " " + s[j].text;
      } else if (gap > spaceGapThreshold(avgFs)) {
        result += " " + s[j].text;
      } else {
        result += s[j].text;
      }
    }
    return result;
  });
  const scripted = (s) => tagScripts(s, merged);
  if (!wrap) return scripted(mergeCellTextLines(textLines));
  let contentLeft = Infinity;
  for (const it of items) if (it.x < contentLeft) contentLeft = it.x;
  const lineEnds = merged.map((s) => {
    let right = -Infinity;
    for (const it of s) if (it.x + it.w > right) right = it.x + it.w;
    const first = s[0];
    const visible = first.text.replace(/<\/?u>|~~/g, "");
    return { right, fontSize: first.fontSize, firstCharW: first.w / Math.max(1, [...visible].length) };
  });
  let cellRight = -Infinity;
  for (const e of lineEnds) if (e.right > cellRight) cellRight = e.right;
  const wraps = lineEnds.slice(0, -1).map((a, i) => cellLineWraps(wrap.box, contentLeft, a.right, a.fontSize, lineEnds[i + 1].firstCharW) || lineEnds.length >= 3 && !textLines[i + 1].startsWith("(") && cellLineFills(wrap.box, contentLeft, cellRight, a.right, a.fontSize));
  return scripted(mergeCellTextLines(textLines, { wraps, lex: wrap.lex }));
}
function mergeSuperscriptRows(lines) {
  if (lines.length <= 1) return lines;
  const band = (line) => {
    let bottom = Infinity, top = -Infinity;
    for (const i of line) {
      const h = i.h > 0 ? i.h : i.fontSize;
      if (i.y < bottom) bottom = i.y;
      if (i.y + h > top) top = i.y + h;
    }
    return { bottom, top, height: top - bottom };
  };
  const isFrag = (line) => {
    if (line.length > 8) return false;
    let total = 0;
    for (const i of line) total += i.text.trim().length;
    return total > 0 && total <= 10;
  };
  const result = [lines[0]];
  for (let i = 1; i < lines.length; i++) {
    const prev = result[result.length - 1];
    const curr = lines[i];
    const a = band(prev);
    const b = band(curr);
    const overlap2 = Math.min(a.top, b.top) - Math.max(a.bottom, b.bottom);
    const prevIsFrag = isFrag(prev) && a.height <= b.height * 0.8 && overlap2 >= a.height * 0.5;
    const currIsFrag = isFrag(curr) && b.height <= a.height * 0.8 && overlap2 >= b.height * 0.5;
    if (prevIsFrag || currIsFrag) {
      result[result.length - 1] = [...prev, ...curr];
    } else {
      result.push(curr);
    }
  }
  return result;
}
function detectEvenSpacedItems(items, cellLine = false) {
  const result = new Array(items.length).fill(false);
  if (items.length < 3) return result;
  const visible = items.map((it) => it.text.replace(/<\/?u>|~~/g, ""));
  if (cellLine && visible.every((text) => /^[가-힣]$/.test(text)) && items.slice(1).every((it) => !it.hasSpaceBefore || it.syntheticSpace) && items.slice(1).every((it, k) => it.x - (items[k].x + items[k].w) >= it.fontSize * 0.1)) {
    markEvenRun(items, visible, result, 0, items.length);
    if (result.some(Boolean)) return result;
  }
  let runStart = -1;
  for (let i = 0; i < items.length; i++) {
    const isShortKorean = /^[가-힣]{1}$/.test(visible[i]) || /^[\d]{1}$/.test(visible[i]);
    if (isShortKorean && runStart >= 0 && items[i].hasSpaceBefore) {
      if (i - runStart >= 3) markEvenRun(items, visible, result, runStart, i);
      runStart = i;
      continue;
    }
    if (isShortKorean && runStart >= 0 && i > 0) {
      const gap = items[i].x - (items[i - 1].x + items[i - 1].w);
      const maxRunGap = Math.max(items[i].fontSize * 3, 30);
      if (gap > maxRunGap) {
        if (i - runStart >= 3) markEvenRun(items, visible, result, runStart, i);
        runStart = i;
        continue;
      }
    }
    if (isShortKorean) {
      if (runStart < 0) runStart = i;
    } else {
      if (runStart >= 0 && i - runStart >= 3) {
        markEvenRun(items, visible, result, runStart, i);
      }
      runStart = -1;
    }
  }
  if (runStart >= 0 && items.length - runStart >= 3) {
    markEvenRun(items, visible, result, runStart, items.length);
  }
  return result;
}
function markEvenRun(items, visible, result, start, end) {
  let dateOnly = true;
  for (let i = start; i < end; i++) if (!/^[년월일시분초]$/.test(visible[i])) {
    dateOnly = false;
    break;
  }
  if (dateOnly) return;
  const gaps = [];
  for (let i = start + 1; i < end; i++) {
    gaps.push(items[i].x - (items[i - 1].x + items[i - 1].w));
  }
  const posGaps = gaps.filter((g) => g > 0);
  if (posGaps.length < 2) return;
  let minGap = Infinity, maxGap = -Infinity;
  for (const g of posGaps) {
    if (g < minGap) minGap = g;
    if (g > maxGap) maxGap = g;
  }
  const avgFs = items[start].fontSize;
  if (minGap >= avgFs * 0.1 && maxGap <= avgFs * 3 && maxGap / Math.max(minGap, 0.1) <= 3) {
    for (let i = start + 1; i < end; i++) {
      result[i] = true;
    }
  }
}
function mergeCellTextLines(textLines, wrap) {
  if (textLines.length <= 1) return textLines[0] || "";
  const merged = [textLines[0]];
  for (let i = 1; i < textLines.length; i++) {
    const prev = merged[merged.length - 1];
    const curr = textLines[i];
    if (wrap ? wrap.wraps[i - 1] && !startsNewItem(prev, curr) && wrapJoiner(prev, curr, wrap.lex) === "" : /[가-힣]$/.test(prev) && /^[가-힣]+$/.test(curr) && curr.length <= 8 && !curr.includes(" ")) {
      merged[merged.length - 1] = prev + curr;
    } else if (curr.trim().length <= 3 && /^[)\]%}]/.test(curr.trim())) {
      merged[merged.length - 1] = prev + curr.trim();
    } else if (!wrap && /[,(]$/.test(prev.trim()) && curr.trim().length <= 15) {
      merged[merged.length - 1] = prev + curr.trim();
    } else if (/[\d,]$/.test(prev) && /^[\d,]+[)\]]?$/.test(curr.trim()) && curr.trim().length <= 10 && !(/\d,\d{3}$/.test(prev) && /^\d/.test(curr.trim())) && !(/(?:^|[^\d,])\d{1,3}$/.test(prev) && /^(\d{1,3}(,\d{3})+|\d{1,3})$/.test(curr.trim()) && !wrap?.wraps[i - 1]) && !(/(?:^|\s)\d{1,7}$/.test(prev) && /^\d{1,7}$/.test(curr.trim()) && !wrap?.wraps[i - 1])) {
      merged[merged.length - 1] = prev + curr.trim();
    } else {
      merged.push(curr);
    }
  }
  return merged.join("\n");
}
function latinSoftWrap(prev, curr) {
  const a = prev.trim(), b = curr.trim();
  if (!a || !b || /[가-힣]/.test(a + b) || !/[A-Za-z]{2}/.test(a) || !/[A-Za-z]/.test(b) && !/^\(.*\)$/.test(b)) return false;
  if (/^(?:[•●○◦▪▫■□◆◇➢➤►▶✓✔\-–—*·]|\(?\d{1,2}[.)]\s|\(?[a-z][.)]\s|\([ivx]{1,4}\)\s)/.test(b)) return false;
  return !startsNewItem(a, b);
}
var MAX_UNDERSEGMENTED_ROWS = 5;
var MIN_UNDERSEGMENTED_COLUMNS = 3;
var MIN_UNDERSEGMENTED_TEXT_LINES = 8;
var MIN_ROW_BAND_MISMATCH = 2;
var MIN_ROW_BAND_EPSILON = 3;
var ROW_BAND_EPSILON_RATIO = 0.6;
function itemCenterY(item) {
  return item.y + (item.h > 0 ? item.h : item.fontSize) / 2;
}
function itemHeight(item) {
  return item.h > 0 ? item.h : item.fontSize;
}
function findColumnIndex(item, colXs) {
  const cx = item.x + item.w / 2;
  for (let c = 0; c < colXs.length - 1; c++) {
    if (cx >= colXs[c] && cx <= colXs[c + 1]) return c;
  }
  let best = 0;
  let bestDist = Infinity;
  for (let c = 0; c < colXs.length - 1; c++) {
    const center = (colXs[c] + colXs[c + 1]) / 2;
    const d = Math.abs(cx - center);
    if (d < bestDist) {
      bestDist = d;
      best = c;
    }
  }
  return best;
}
function groupItemsToVisualLines(items) {
  if (items.length === 0) return [];
  const sorted = [...items].sort((a, b) => b.y - a.y || a.x - b.x);
  const lines = [];
  let cur = [sorted[0]];
  let curY = sorted[0].y;
  for (let i = 1; i < sorted.length; i++) {
    const tol = Math.max(3, Math.min(sorted[i].fontSize, cur[0].fontSize) * 0.6);
    if (Math.abs(sorted[i].y - curY) <= tol) {
      cur.push(sorted[i]);
    } else {
      lines.push(cur);
      cur = [sorted[i]];
      curY = sorted[i].y;
    }
  }
  lines.push(cur);
  return lines;
}
function normalizeUndersegmentedTable(originalCells, colXs, items, rowYs) {
  const numRows = originalCells.length;
  const numCols = colXs.length - 1;
  if (numRows > MAX_UNDERSEGMENTED_ROWS || numCols < MIN_UNDERSEGMENTED_COLUMNS) return null;
  if (items.length === 0) return null;
  if (numRows >= 3) {
    if (rowYs?.length !== numRows + 1) return null;
    const rebuilt2 = [];
    let expanded = 0;
    for (let r = 0; r < numRows; r++) {
      const row = originalCells[r].map((cell) => cell.text);
      if (r === 0 || numRows === 3 && r === 1) {
        rebuilt2.push(row);
        continue;
      }
      const rowItems = items.filter((item) => itemCenterY(item) <= rowYs[r] + 1 && itemCenterY(item) >= rowYs[r + 1] - 1);
      const body = normalizeUndersegmentedTable([originalCells[r]], colXs, rowItems);
      if (body) {
        rebuilt2.push(...body);
        expanded++;
      } else rebuilt2.push(row);
    }
    return expanded ? rebuilt2 : null;
  }
  const itemsByCol = Array.from({ length: numCols }, () => []);
  for (const item of items) {
    if (!item.text.trim()) continue;
    itemsByCol[findColumnIndex(item, colXs)].push(item);
  }
  let denseColumns = 0;
  for (const colItems of itemsByCol) {
    if (groupItemsToVisualLines(colItems).length >= MIN_UNDERSEGMENTED_TEXT_LINES) denseColumns++;
  }
  if (denseColumns < 2) return null;
  const allLines = groupItemsToVisualLines(items.filter((i) => i.text.trim()));
  const bands = [];
  for (const line of allLines) {
    let cy = 0, h = 0;
    for (const it of line) {
      cy += itemCenterY(it);
      h += itemHeight(it);
    }
    cy /= line.length;
    h /= line.length;
    const top = cy + h / 2;
    const bottom = cy - h / 2;
    let matched = null;
    for (const band of bands) {
      const epsilon = Math.max(MIN_ROW_BAND_EPSILON, Math.min(band.avgHeight, h) * ROW_BAND_EPSILON_RATIO);
      if (Math.abs(band.centerY - cy) <= epsilon || bottom <= band.topY && top >= band.bottomY) {
        matched = band;
        break;
      }
    }
    if (!matched) {
      matched = { centerY: 0, avgHeight: 0, topY: -Infinity, bottomY: Infinity, lineCount: 0, itemsByCol: Array.from({ length: numCols }, () => []) };
      bands.push(matched);
    }
    matched.centerY = (matched.centerY * matched.lineCount + cy) / (matched.lineCount + 1);
    matched.avgHeight = (matched.avgHeight * matched.lineCount + h) / (matched.lineCount + 1);
    matched.topY = Math.max(matched.topY, top);
    matched.bottomY = Math.min(matched.bottomY, bottom);
    matched.lineCount++;
    for (const it of line) {
      matched.itemsByCol[findColumnIndex(it, colXs)].push(it);
    }
  }
  if (bands.length < numRows + MIN_ROW_BAND_MISMATCH) return null;
  bands.sort((a, b) => b.centerY - a.centerY);
  const rebuilt = bands.map(
    (band) => band.itemsByCol.map((colItems) => colItems.length > 0 ? cellTextToString(colItems) : "")
  );
  const countNonEmptyRows = (cells) => cells.filter((row) => row.some((c) => (typeof c === "string" ? c : c.text).trim() !== "")).length;
  const countNonEmptyCols = (cells, cols) => {
    let n = 0;
    for (let c = 0; c < cols; c++) {
      if (cells.some((row) => row[c] != null && (typeof row[c] === "string" ? row[c] : row[c].text).trim() !== "")) n++;
    }
    return n;
  };
  if (countNonEmptyRows(rebuilt) <= countNonEmptyRows(originalCells)) return null;
  const origBody = numRows > 1 ? originalCells.slice(1) : originalCells;
  if (countNonEmptyCols(rebuilt, numCols) < countNonEmptyCols(origBody, numCols)) return null;
  return rebuilt;
}
function sortLineByX(items) {
  items.sort((a, b) => a.x - b.x);
  for (let i = 1; i < items.length; i++) {
    for (let j = i; j > 0; j--) {
      const a = items[j - 1], b = items[j];
      if (b.x - a.x > 1 || a.seq === void 0 || b.seq === void 0 || b.seq >= a.seq) break;
      items[j - 1] = b;
      items[j] = a;
    }
  }
  return items;
}
function isCjkLatinAutospace(prevText, nextText, gap, fontSize) {
  if (!(gap < fontSize * 0.3)) return false;
  const a = prevText.slice(-1), b = nextText[0] ?? "";
  const cjk = /[\u3040-\u30ff\u3400-\u9fff\uf900-\ufaff]/, latin = /[A-Za-z0-9]/;
  return cjk.test(a) && latin.test(b) || latin.test(a) && cjk.test(b);
}
function filterHiddenText(items, pageWidth, pageHeight, originX = 0, originY = 0) {
  let hiddenCount = 0;
  const visible = [];
  for (const item of items) {
    if (item.isHidden) {
      hiddenCount++;
      continue;
    }
    const margin = Math.max(pageWidth, pageHeight) * 0.1;
    if (item.x < originX - margin || item.x > originX + pageWidth + margin || item.y < originY - margin || item.y > originY + pageHeight + margin) {
      hiddenCount++;
      continue;
    }
    visible.push(item);
  }
  return { visible, hiddenCount };
}
function collapseEvenSpacing(text, whole = true) {
  if (whole) {
    const tokens = text.split(" ");
    const visible = tokens.map((t) => t.replace(/<\/?u>|~~/g, ""));
    const singleCharCount = visible.filter((t) => t.length === 1).length;
    if (tokens.length >= 3 && singleCharCount / tokens.length >= 0.7 && !isDateUnitBlank(visible)) return tokens.join("");
  }
  return text.replace(
    /(?<![^\s>])[가-힣](?: [가-힣\d]){2,}(?![^\s<])/g,
    (match, offset) => {
      const before = text.slice(0, offset).replace(/(?:<\/?u>|~~)+$/, "");
      const after = text.slice(offset + match.length).replace(/^(?:<\/?u>|~~)+/, "");
      if (/\S$/.test(before) || /^\S/.test(after)) return match;
      return isDateUnitBlank(match.split(" ")) ? match : match.replace(/ /g, "");
    }
  );
}
function isDateUnitBlank(tokens) {
  return tokens.every((t) => t.length !== 1 || !/[가-힣]/.test(t) || /[년월일시분초]/.test(t));
}
function computeBBox(items, pageNum) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const i of items) {
    if (i.x < minX) minX = i.x;
    if (i.y < minY) minY = i.y;
    if (i.x + i.w > maxX) maxX = i.x + i.w;
    const effectiveH = i.h > 0 ? i.h : i.fontSize;
    if (i.y + effectiveH > maxY) maxY = i.y + effectiveH;
  }
  return { page: pageNum, x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}
function dominantStyle(items) {
  if (items.length === 0) return void 0;
  const freq = /* @__PURE__ */ new Map();
  let maxCount = 0, dominantSize = 0;
  for (const i of items) {
    if (i.fontSize <= 0) continue;
    const count = (freq.get(i.fontSize) || 0) + Math.max(1, i.text.match(/[\p{L}\p{N}]/gu)?.length ?? 0);
    freq.set(i.fontSize, count);
    if (count > maxCount) {
      maxCount = count;
      dominantSize = i.fontSize;
    }
  }
  if (dominantSize === 0) return void 0;
  const fontName = items.find((i) => i.fontSize === dominantSize)?.fontName || void 0;
  return fontName ? { fontSize: dominantSize, fontName } : { fontSize: dominantSize };
}
function normalizeItems(rawItems) {
  const items = [];
  const spacePositions = [];
  let seq = 0;
  for (const i of rawItems) {
    seq++;
    if (typeof i.str !== "string") continue;
    const x = Math.round(i.transform[4]);
    const y = Math.round(i.transform[5]);
    if (!i.str.trim()) {
      spacePositions.push({ x, y, synthetic: i.synthetic });
      continue;
    }
    const scaleX = Math.hypot(i.transform[0], i.transform[1]);
    const scaleY = Math.hypot(i.transform[2], i.transform[3]);
    const fontSize = Math.round(Math.max(scaleY, scaleX));
    let w = Math.round(i.width);
    const h = Math.round(i.height);
    if (/[^\u0000]\u0000+$/.test(i.str)) {
      w = Math.max(1, Math.round(i.width - Math.round(Math.max(Math.hypot(i.transform[2], i.transform[3]), Math.hypot(i.transform[0], i.transform[1]))) * 0.3));
      spacePositions.push({ x: x + w, y });
    }
    const isHidden = fontSize === 0 || i.width === 0 && i.str.trim().length > 0;
    let text = i.str.trim().replace(/[\u2F00-\u2FD5]/g, (c) => c.normalize("NFKC"));
    if (/^[\d\s\-().·,☎]+$/.test(text) && /\d/.test(text) && / /.test(text)) {
      text = text.replace(/ /g, "");
    }
    if (fontSize >= 14 && /^[A-Z0-9?!&'’](?: [A-Z0-9?!&'’]){2,}$/.test(text)) text = text.replace(/ /g, "");
    const split = splitEvenSpacedItem(text, x, w, fontSize);
    if (split) {
      split.forEach((s, k) => {
        items.push({ text: s.text, x: s.x, y, w: s.w, h, fontSize, fontName: i.fontName || "", isHidden, seq: seq + k / 1e3 });
      });
    } else {
      const rotated = Math.abs(i.transform[1]) > Math.abs(i.transform[0]) * 4;
      const rw = rotated ? Math.max(1, fontSize) : w;
      const rx = rotated && i.transform[1] > 0 ? x - rw : x;
      items.push({ text, x: rx, y, w: rw, h, fontSize, fontName: i.fontName || "", isHidden, seq, ...rotated ? { rotated: Math.max(1, w) } : {} });
    }
  }
  const sorted = items.sort((a, b) => b.y - a.y || a.x - b.x);
  const deduped = [];
  for (let i = 0; i < sorted.length; i++) {
    let isDup = false;
    for (let j = deduped.length - 1; j >= 0; j--) {
      const prev = deduped[j];
      if (prev.y - sorted[i].y > 3) break;
      const xTol = Math.min(3, Math.max(0.5, sorted[i].w * 0.5));
      if (Math.abs(prev.y - sorted[i].y) <= 3 && prev.text === sorted[i].text && Math.abs(prev.x - sorted[i].x) <= xTol) {
        isDup = true;
        break;
      }
    }
    if (!isDup) deduped.push(sorted[i]);
  }
  splitOverlaidRuns(deduped);
  if (spacePositions.length > 0) {
    for (const sp of spacePositions) {
      let nearest = null;
      for (const item of deduped) {
        if (Math.abs(sp.y - item.y) > 3) continue;
        const dist = item.x - sp.x;
        if (dist >= -1 && dist <= 20 && (!nearest || item.x < nearest.x)) {
          nearest = item;
        }
      }
      if (nearest) {
        nearest.syntheticSpace = (nearest.hasSpaceBefore ? nearest.syntheticSpace === true : true) && sp.synthetic === true;
        nearest.hasSpaceBefore = true;
      }
    }
  }
  return deduped;
}
var WORD_SPACE_EM = 0.3;
var OVERLAY_DUP_EM = 0.5;
var OVERLAY_FIT_EM = 0.6;
function glyphUnits(s) {
  let u = 0;
  for (const ch of s) u += (ch.codePointAt(0) ?? 0) >= 8592 ? 1 : 0.5;
  return u;
}
function splitOverlaidRuns(items) {
  let replaced = null;
  for (let ci = 0; ci < items.length; ci++) {
    const c = items[ci];
    if (c.w <= 0 || !/\S\s+\S/.test(c.text)) continue;
    const overlays = [];
    for (let j = ci - 1; j >= 0 && items[j].y - c.y <= 1; j--) if (isInside(items[j], c)) overlays.push(items[j]);
    for (let j = ci + 1; j < items.length && c.y - items[j].y <= 1; j++) if (isInside(items[j], c)) overlays.push(items[j]);
    if (overlays.length === 0) continue;
    const pieces = splitAroundOverlays(c, overlays);
    if (pieces) (replaced ??= /* @__PURE__ */ new Map()).set(c, pieces);
  }
  if (!replaced) return;
  const out = [];
  for (const it of items) {
    const p = replaced.get(it);
    if (p) out.push(...p);
    else out.push(it);
  }
  items.length = 0;
  for (const item of out.sort((a, b) => b.y - a.y || a.x - b.x)) items.push(item);
}
function isInside(o, c) {
  return o.x >= c.x + 1 && o.x + o.w <= c.x + c.w + 1 && o.w < c.w;
}
function splitAroundOverlays(c, overlays) {
  const words = c.text.split(/\s+/);
  const fs = c.fontSize > 0 ? c.fontSize : c.h > 0 ? c.h : 10;
  const ws = WORD_SPACE_EM * fs;
  const totalU = words.reduce((s, w) => s + glyphUnits(w), 0);
  if (totalU <= 0) return null;
  const a0 = (c.w - (words.length - 1) * ws) / totalU;
  const ov = overlays.filter((o) => {
    for (let at = c.text.indexOf(o.text); at >= 0; at = c.text.indexOf(o.text, at + 1)) {
      const prefix = c.text.slice(0, at);
      const est = c.x + glyphUnits(prefix.replace(/\s+/g, "")) * a0 + (prefix.match(/\s+/g)?.length ?? 0) * ws;
      if (Math.abs(est - o.x) <= OVERLAY_DUP_EM * fs) return false;
    }
    return true;
  }).sort((p2, q) => p2.x - q.x);
  if (ov.length === 0) return null;
  const holes = Math.min(ov.length, words.length - 1);
  let ovW = 0;
  for (const o of ov) ovW += o.w;
  const a = (c.w - ovW - (words.length - 1 - holes) * ws) / totalU;
  if (!(a > 0)) return null;
  const starts = [], ends = [], holeAfter = [];
  let p = c.x;
  let k = 0;
  let assigned = 0;
  for (let i = 0; i < words.length; i++) {
    starts.push(p);
    p += glyphUnits(words[i]) * a;
    ends.push(p);
    if (i === words.length - 1) break;
    while (k < ov.length && ov[k].x < p - a * 0.6) k++;
    const half = glyphUnits(words[i + 1]) * a / 2;
    let hole = false;
    while (k < ov.length && ov[k].x < p + half) {
      hole = true;
      p = Math.max(p, ov[k].x + ov[k].w);
      k++;
    }
    holeAfter.push(hole);
    if (hole) assigned++;
    else p += ws;
  }
  if (assigned === 0 || Math.abs(p - (c.x + c.w)) > Math.max(3, OVERLAY_FIT_EM * fs)) return null;
  const pieces = [];
  for (let s = 0; s < words.length; ) {
    let e = s;
    while (e < words.length - 1 && !holeAfter[e]) e++;
    pieces.push({
      ...c,
      text: words.slice(s, e + 1).join(" "),
      x: Math.round(starts[s]),
      w: Math.max(1, Math.round(ends[e] - starts[s])),
      hasSpaceBefore: s === 0 ? c.hasSpaceBefore : false,
      seq: c.seq === void 0 ? void 0 : c.seq + pieces.length / 1e4
    });
    s = e + 1;
  }
  return pieces;
}
function splitEvenSpacedItem(text, itemX, itemW, fontSize) {
  if (!/^[가-힣\d](?: [가-힣\d]){2,}$/.test(text)) return null;
  const chars = text.split(" ");
  if (chars.length < 3) return null;
  const charW = itemW / chars.length;
  if (charW > fontSize * 2) return null;
  return chars.map((ch, idx) => ({
    text: ch,
    x: Math.round(itemX + idx * charW),
    w: Math.round(charW * 0.8)
    // 실제 글자 폭은 간격보다 좁음
  }));
}
function groupByY(items) {
  if (items.length === 0) return [];
  const lines = [];
  let curY = items[0].y;
  let curLine = [items[0]];
  for (let i = 1; i < items.length; i++) {
    if (Math.abs(items[i].y - curY) > 3) {
      lines.push(curLine);
      curLine = [];
      curY = items[i].y;
    }
    curLine.push(items[i]);
  }
  if (curLine.length > 0) lines.push(curLine);
  return lines;
}
function mergeSuperscriptLines(lines) {
  if (lines.length <= 1) return lines;
  const band = (line) => {
    let bottom = Infinity, top = -Infinity;
    for (const i of line) {
      const h = i.h > 0 ? i.h : i.fontSize;
      if (i.y < bottom) bottom = i.y;
      if (i.y + h > top) top = i.y + h;
    }
    return { bottom, top, height: top - bottom };
  };
  const isFrag = (line) => {
    if (line.length > 8) return false;
    let total = 0;
    for (const i of line) total += i.text.trim().length;
    return total > 0 && total <= 10;
  };
  const isMarkers = (line, host) => line.length > 1 && line.length <= 16 && line.every((i) => {
    if (i.text.trim().length > 3 || !i.text.trim()) return false;
    return host.some((h) => {
      const g = i.x - (h.x + h.w);
      return g <= h.fontSize * 0.35 && g >= -h.fontSize * 0.1;
    });
  });
  const result = [lines[0]];
  for (let i = 1; i < lines.length; i++) {
    const prev = result[result.length - 1];
    const curr = lines[i];
    const a = band(prev);
    const b = band(curr);
    const overlap2 = Math.min(a.top, b.top) - Math.max(a.bottom, b.bottom);
    const prevIsFrag = (isFrag(prev) || isMarkers(prev, curr)) && a.height <= b.height * 0.8 && overlap2 >= a.height * 0.5;
    const currIsFrag = (isFrag(curr) || isMarkers(curr, prev)) && b.height <= a.height * 0.8 && overlap2 >= b.height * 0.5;
    if (prevIsFrag || currIsFrag) {
      result[result.length - 1] = [...prev, ...curr];
    } else {
      result.push(curr);
    }
  }
  return result;
}
function mergeLineSimple(items) {
  if (items.length <= 1) return items[0]?.text || "";
  const sorted = sortLineByX([...items]);
  const isEvenSpaced = detectEvenSpacedItems(sorted);
  let result = sorted[0].text;
  for (let i = 1; i < sorted.length; i++) {
    const gap = sorted[i].x - (sorted[i - 1].x + sorted[i - 1].w);
    const avgFs = (sorted[i].fontSize + sorted[i - 1].fontSize) / 2;
    const tabThreshold = Math.max(avgFs * 2, 30);
    if (gap > tabThreshold) {
      result += "	";
      result += sorted[i].text;
      continue;
    }
    if (isEvenSpaced[i]) {
      result += sorted[i].text;
      continue;
    }
    if (isCjkLatinAutospace(sorted[i - 1].text, sorted[i].text, gap, avgFs)) {
      result += sorted[i].text;
      continue;
    }
    if (sorted[i].hasSpaceBefore && gap >= avgFs * 0.05) {
      result += " ";
      result += sorted[i].text;
      continue;
    }
    if (/[□■○●▶◆◇ㅇ]$/.test(sorted[i - 1].text) && /^[가-힣]/.test(sorted[i].text) && gap > 1) {
      result += " ";
      result += sorted[i].text;
      continue;
    }
    if (gap > spaceGapThreshold(avgFs)) result += " ";
    result += sorted[i].text;
  }
  return result;
}
function attachDropCaps(lines) {
  const result = lines.map((line) => [...line]);
  const sizes = result.flat().map((item) => item.fontSize).filter((size) => size > 0).sort((a, b) => a - b);
  const bodySize = sizes[Math.floor(sizes.length / 2)] ?? 0;
  if (!bodySize) return result;
  for (let source = 0; source < result.length; source++) {
    const cap = result[source].find((item) => /^[A-Z]$/.test(item.text) && item.fontSize >= bodySize * 2.5 && item.h >= bodySize * 2.5);
    if (!cap) continue;
    const target = result.findIndex((line, index) => index < source && line.some((item) => item !== cap && /^[a-z]/.test(item.text) && item.x >= cap.x + cap.w && item.x - (cap.x + cap.w) <= bodySize && item.y > cap.y && item.y < cap.y + cap.h));
    if (target < 0) continue;
    result[source].splice(result[source].indexOf(cap), 1);
    result[target].push(cap);
  }
  return result.filter((line) => line.length > 0);
}
function splitSidebarTitleRegion(items) {
  if (items.length < 30) return null;
  const sizes = items.map((item) => item.fontSize).filter((size) => size > 0).sort((a, b) => a - b);
  const bodySize = sizes[Math.floor(sizes.length / 2)];
  const minX = Math.min(...items.map((item) => item.x));
  const maxX = Math.max(...items.map((item) => item.x + item.w));
  const minY = Math.min(...items.map((item) => item.y));
  const maxY = Math.max(...items.map((item) => item.y));
  const spanX = maxX - minX;
  const spanY = maxY - minY;
  if (spanX < 300 || spanY < 300) return null;
  const titles = items.filter((item) => item.fontSize >= bodySize * 2.2 && item.x < minX + spanX * 0.4 && item.y > minY + spanY * 0.55 && item.text.trim().length >= 2);
  if (titles.length < 2 || titles.length > 4) return null;
  const titleLeft = Math.min(...titles.map((item) => item.x));
  const titleRight = Math.max(...titles.map((item) => item.x + item.w));
  const titleTop = Math.max(...titles.map((item) => item.y));
  if (Math.max(...titles.map((item) => Math.abs(item.x - titleLeft))) > bodySize * 2 || titleRight > minX + spanX * 0.55) return null;
  const prose = items.filter((item) => item.x >= titleRight + 20 && item.fontSize < bodySize * 2.2 && item.y <= titleTop + bodySize && item.y >= minY + spanY * 0.08);
  if (prose.length < 20 || prose.reduce((n, item) => n + item.text.length, 0) < 500) return null;
  const proseLeft = Math.min(...prose.map((item) => item.x));
  const bodyBottom = Math.min(...prose.map((item) => item.y));
  const bodyTop = Math.max(...prose.map((item) => item.y));
  if (bodyTop < titleTop - bodySize * 3 || bodyBottom > minY + spanY * 0.4) return null;
  const titleSet = new Set(titles);
  const upper = [], sidebar = [], body = [], footer = [];
  for (const item of items) {
    if (titleSet.has(item)) sidebar.push(item);
    else if (item.y > titleTop + bodySize * 3) upper.push(item);
    else if (item.y < bodyBottom - bodySize * 3) footer.push(item);
    else if (item.x >= proseLeft - bodySize) body.push(item);
    else return null;
  }
  return [upper, sidebar, body, footer];
}
function splitTrailingColumnRegion(items) {
  if (items.length < 16) return null;
  const lines = groupByY(items);
  if (lines.length < 9) return null;
  const ys = lines.map((line) => line.reduce((sum, item) => sum + item.y, 0) / line.length);
  const gaps = ys.slice(0, -1).map((y, index) => y - ys[index + 1]);
  const regular = gaps.filter((gap) => gap > 2 && gap < 24).sort((a, b) => a - b);
  if (regular.length < 4) return null;
  const leading = regular[Math.floor(regular.length / 2)];
  let start = -1;
  for (let i = 0; i < gaps.length; i++) {
    if (gaps[i] > Math.max(22, leading * 1.8) && lines.length - i - 1 >= 5) start = i + 1;
  }
  if (start < 2) return null;
  const upper = lines.slice(0, start).flat();
  const lowerLines = lines.slice(start);
  const lower = lowerLines.flat();
  const fontSizes = lower.map((item) => item.fontSize).filter((size) => size > 0).sort((a, b) => a - b);
  const bodySize = fontSizes[Math.floor(fontSizes.length / 2)] ?? 0;
  const minX = Math.min(...lower.map((item) => item.x));
  const maxX = Math.max(...lower.map((item) => item.x + item.w));
  if (maxX - minX < 300) return null;
  let best = null;
  const step = Math.max(2, (maxX - minX) * 0.3 / 400);
  for (let x = minX + (maxX - minX) * 0.35; x <= minX + (maxX - minX) * 0.65; x += step) {
    let paired = 0, crossed = 0, leftRows = 0, rightRows = 0;
    let leftChars = 0, rightChars = 0;
    for (const line of lowerLines) {
      const left2 = line.filter((item) => item.x + item.w <= x);
      const right2 = line.filter((item) => item.x >= x);
      if (line.length !== left2.length + right2.length) {
        crossed++;
        continue;
      }
      if (left2.length) leftRows++;
      if (right2.length) rightRows++;
      if (!left2.length || !right2.length) continue;
      const gap = Math.min(...right2.map((item) => item.x)) - Math.max(...left2.map((item) => item.x + item.w));
      const lChars = left2.reduce((n, item) => n + item.text.length, 0);
      const rChars = right2.reduce((n, item) => n + item.text.length, 0);
      if (gap < Math.max(10, bodySize * 1.25) || lChars < 28 || rChars < 28) continue;
      paired++;
      leftChars += lChars;
      rightChars += rChars;
    }
    if (paired < 4 || leftRows < 4 || rightRows < 4 || crossed > 1) continue;
    const balance = Math.min(leftChars, rightChars) / Math.max(leftChars, rightChars);
    if (balance < 0.55) continue;
    if (!best || paired > best.paired || paired === best.paired && balance > best.balance) best = { x, paired, balance };
  }
  if (!best) return null;
  const left = lower.filter((item) => item.x + item.w <= best.x);
  const right = lower.filter((item) => item.x >= best.x);
  if (upper.length + left.length + right.length !== items.length) return null;
  return [upper, left, right];
}
function panelBlocks(items, panel, pageNum) {
  const lines = groupByY([...items].sort((a, b) => b.y - a.y || a.x - b.x));
  const faceOf = (line) => dominantStyle(line)?.fontName ?? "";
  const runs = [];
  for (const line of lines) {
    const last = runs[runs.length - 1];
    if (last && faceOf(last[last.length - 1]) === faceOf(line)) last.push(line);
    else runs.push([line]);
  }
  if (runs.length < 2) return [panel];
  return runs.map((run, k) => {
    const text = run.map((line) => mergeLineSimple(line).trim()).filter(Boolean).join(" ");
    const title = k + 1 < runs.length && run.length <= 2 && text.length <= 60 && new RegExp("\\p{L}", "u").test(text) && !/[.!?:;,]$/.test(text);
    const all = run.flat();
    return title ? { type: "heading", level: 3, text, pageNumber: pageNum, bbox: computeBBox(all, pageNum), style: dominantStyle(all) } : { type: "paragraph", text, pageNumber: pageNum, bbox: computeBBox(all, pageNum), style: dominantStyle(all) };
  });
}
var MAX_XYCUT_DEPTH = 50;
var XYCUT_MIN_GAP = 5;
var CROSS_LAYOUT_BETA = 2;
var CROSS_OVERLAP_RATIO = 0.1;
var CROSS_MIN_OVERLAPS = 2;
var CROSS_MAX_MASK_RATIO = 0.2;
var NARROW_ELEMENT_WIDTH_RATIO = 0.1;
var PROSE_GUTTER_MIN_GAP = 6;
var XY_WRAP_BANDS = /* @__PURE__ */ new WeakMap();
var XY_WRAP_ITEMS = /* @__PURE__ */ new WeakMap();
var leaf = (items, wrapped) => {
  wrapped = validWrapBands(items, wrapped);
  const source = wrapped.length ? [...items] : [];
  for (const item of items) {
    if (wrapped.length) {
      XY_WRAP_BANDS.set(item, wrapped);
      XY_WRAP_ITEMS.set(item, source);
    } else {
      XY_WRAP_BANDS.delete(item);
      XY_WRAP_ITEMS.delete(item);
    }
  }
  return [items];
};
function xyCutOrder(items, gapThreshold, depth = 0, wrapped) {
  if (items.length === 0) return [];
  const newRegion = wrapped === void 0;
  wrapped ??= inheritedWrapBands(items);
  if (items.length <= 2 || depth >= MAX_XYCUT_DEPTH) return leaf(items, wrapped);
  if (depth === 0 && items.length >= 3) {
    const cross = identifyCrossLayoutItems(items);
    if (cross.size > 0 && cross.size <= items.length * CROSS_MAX_MASK_RATIO) {
      const rest = items.filter((i) => !cross.has(i));
      if (rest.length > 0) {
        const groups = xyCutOrder(rest, gapThreshold, 1);
        return mergeCrossLayoutGroups(groups, [...cross]);
      }
    }
  }
  const minGap = Math.max(XYCUT_MIN_GAP, gapThreshold);
  const sortedY = [...items].sort((a, b) => b.y - a.y);
  let hCut = findHorizontalCut(sortedY, wrapped);
  if (newRegion && hCut.gap >= minGap) {
    wrapped = wrappedLineBands(items, wrapped);
    hCut = findHorizontalCut(sortedY, wrapped);
  }
  const vCut = findVerticalCutWithOutlierFilter(items, minGap);
  const hValid = hCut.gap >= minGap;
  const vValid = (vCut.gap >= minGap || vCut.gap >= PROSE_GUTTER_MIN_GAP && isProseGutter(items, vCut.position)) && !splitsSpacedLabel(items, vCut.position);
  let useHorizontal;
  if (hValid && vValid) useHorizontal = vCut.gap <= hCut.gap * 1.5 || staggeredSides(items, vCut.position);
  else if (hValid) useHorizontal = true;
  else if (vValid) useHorizontal = false;
  else return splitEdgeSpannedColumns(items, gapThreshold, depth) ?? leaf(items, wrapped);
  if (useHorizontal) {
    const upper = items.filter((i) => i.y > hCut.position);
    const lower = items.filter((i) => i.y <= hCut.position);
    if (upper.length > 0 && lower.length > 0 && upper.length < items.length) {
      return [...xyCutOrder(upper, gapThreshold, depth + 1, wrapped), ...xyCutOrder(lower, gapThreshold, depth + 1, wrapped)];
    }
  } else {
    const left = items.filter((i) => i.x + i.w / 2 < vCut.position);
    const right = items.filter((i) => i.x + i.w / 2 >= vCut.position);
    if (left.length > 0 && right.length > 0 && left.length < items.length) {
      return [...xyCutOrder(left, gapThreshold, depth + 1), ...xyCutOrder(right, gapThreshold, depth + 1)];
    }
  }
  return leaf(items, wrapped);
}
function splitsSpacedLabel(items, cutX) {
  const lone = (i) => /^[가-힣]$/.test(i.text.trim());
  const sameRow = (a, b) => Math.min(a.y, b.y) > Math.max(a.y - a.h, b.y - b.h);
  const left = items.filter((i) => i.x + i.w / 2 < cutX);
  const right = items.filter((i) => i.x + i.w / 2 >= cutX);
  let spaced = 0;
  for (const r of right) {
    if (right.some((o) => o !== r && o.x < r.x && sameRow(o, r))) continue;
    const row = left.filter((l2) => sameRow(l2, r));
    if (row.length === 0) continue;
    const l = row.reduce((a, b) => b.x + b.w > a.x + a.w ? b : a);
    if (!lone(l) || !lone(r)) return false;
    spaced++;
  }
  return spaced > 0;
}
function staggeredSides(items, cutX) {
  const left = items.filter((i) => i.x + i.w / 2 < cutX);
  const right = items.filter((i) => i.x + i.w / 2 >= cutX);
  if (left.length * right.length > 2e5) return false;
  const shareRow = (a, b) => Math.min(a.y, b.y) > Math.max(a.y - a.h, b.y - b.h);
  if (left.some((a) => right.some((b) => shareRow(a, b)))) return false;
  const sides = [...items].sort((a, b) => b.y - a.y).map((i) => i.x + i.w / 2 < cutX);
  let switches = 0;
  for (let k = 1; k < sides.length; k++) if (sides[k] !== sides[k - 1]) switches++;
  return switches >= 3;
}
function identifyCrossLayoutItems(items) {
  const cross = /* @__PURE__ */ new Set();
  if (items.length < 3) return cross;
  let maxWidth = 0;
  for (const i of items) {
    if (i.w > maxWidth) maxWidth = i.w;
  }
  const threshold = CROSS_LAYOUT_BETA * maxWidth;
  for (const item of items) {
    if (item.w < threshold) continue;
    let overlaps = 0;
    for (const other of items) {
      if (other === item) continue;
      const left = Math.max(item.x, other.x);
      const right = Math.min(item.x + item.w, other.x + other.w);
      const overlapW = right - left;
      if (overlapW <= 0) continue;
      const smaller = Math.min(item.w, other.w);
      if (smaller > 0 && overlapW / smaller >= CROSS_OVERLAP_RATIO) {
        overlaps++;
        if (overlaps >= CROSS_MIN_OVERLAPS) break;
      }
    }
    if (overlaps >= CROSS_MIN_OVERLAPS) cross.add(item);
  }
  return cross;
}
function mergeCrossLayoutGroups(groups, cross) {
  if (cross.length === 0) return groups;
  const sortedCross = [...cross].sort((a, b) => b.y + b.h - (a.y + a.h) || a.x - b.x);
  const groupTop = (g) => {
    let top = -Infinity;
    for (const i of g) {
      const t = i.y + i.h;
      if (t > top) top = t;
    }
    return top;
  };
  const result = [];
  let gi = 0, ci = 0;
  while (gi < groups.length || ci < sortedCross.length) {
    if (ci >= sortedCross.length) {
      result.push(groups[gi++]);
      continue;
    }
    if (gi >= groups.length) {
      result.push([sortedCross[ci++]]);
      continue;
    }
    const crossTop = sortedCross[ci].y + sortedCross[ci].h;
    if (crossTop >= groupTop(groups[gi])) result.push([sortedCross[ci++]]);
    else result.push(groups[gi++]);
  }
  return result;
}
function validWrapBands(items, bands) {
  if (!bands.length) return [];
  const present = new Set(items);
  return bands.filter((b) => b.sources.every(({ item: a, state: s }) => present.has(a) && a.text === s.text && a.x === s.x && a.y === s.y && a.w === s.w && a.h === s.h && a.fontSize === s.fontSize && a.fontName === s.fontName && a.isHidden === s.isHidden && a.hasSpaceBefore === s.hasSpaceBefore && a.syntheticSpace === s.syntheticSpace && a.strike === s.strike && a.underline === s.underline && a.seq === s.seq && a.rotated === s.rotated));
}
function inheritedWrapBands(items) {
  const source = XY_WRAP_ITEMS.get(items[0]);
  const present = source?.length === items.length ? new Set(items) : null;
  const sameLeaf = present && source.every((item) => present.has(item));
  return sameLeaf ? validWrapBands(items, XY_WRAP_BANDS.get(items[0]) ?? []) : [];
}
function tocRecordBoundaries(rows) {
  const out = /* @__PURE__ */ new Set();
  if (rows.length < 2) return out;
  const records = rows.map((row, index) => {
    const visible = row.filter((i) => i.text.trim()).sort((a, b) => a.x - b.x);
    let start = visible.length - 1;
    if (start < 1 || !/^\d+$/.test(visible[start].text.trim())) return null;
    for (; start > 0; start--) {
      const a = visible[start - 1], b = visible[start];
      if (!/^\d+$/.test(a.text.trim()) || b.x - (a.x + a.w) > 0.5 * b.fontSize) break;
    }
    const nums = visible.slice(start), label = visible.slice(0, start).filter((i) => !/^[·.⋯…]{4,}$/.test(i.text.trim()));
    const fs = nums[0].fontSize;
    if (!/^\d{1,4}$/.test(nums.map((i) => i.text.trim()).join("")) || fs <= 0 || !label.some((i) => /[\p{L}]/u.test(i.text)) || nums[0].x - Math.max(...label.map((i) => i.x + i.w)) < Math.max(2 * fs, 30)) return null;
    return { right: Math.max(...nums.map((i) => i.x + i.w)), fs, index };
  }).filter((record) => record !== null).sort((a, b) => a.right - b.right);
  for (let i = 0; i + 1 < records.length; i++) {
    const a = records[i], b = records[i + 1];
    if (Math.abs(a.right - b.right) <= 0.5 * Math.min(a.fs, b.fs) && Math.abs(a.fs - b.fs) <= 0.15 * Math.min(a.fs, b.fs)) {
      if (a.index + 1 < rows.length) out.add(a.index);
      if (b.index + 1 < rows.length) out.add(b.index);
    }
  }
  return out;
}
function wrappedLineBands(items, inherited) {
  const rows = groupByY(items);
  const records = tocRecordBoundaries(rows);
  const lines = rows.map((row) => {
    const box = computeBBox(row, 0);
    return {
      text: mergeLineSimple(row).replace(/<\/?u>|~~/g, ""),
      left: box.x,
      right: box.x + box.width,
      y: row.reduce((n, i) => n + i.y, 0) / row.length,
      fontSize: dominantStyle(row)?.fontSize ?? 0,
      sources: row.map((item) => ({ item, state: { ...item } }))
    };
  });
  const joins = bodyLineJoins(lines);
  const fresh = lines.slice(0, -1).flatMap((line, i) => joins[i] === "\n" || records.has(i) || line.text.trim() === lines[i + 1].text.trim() ? [] : [{ top: line.y, bottom: lines[i + 1].y, sources: [...line.sources, ...lines[i + 1].sources] }]);
  const freshKeys = new Set(fresh.map((b) => `${b.top}:${b.bottom}`));
  return [...inherited.filter((b) => !freshKeys.has(`${b.top}:${b.bottom}`)), ...fresh].sort((a, b) => b.top - a.top);
}
function findHorizontalCut(sorted, wrapped) {
  if (sorted.length < 2) return { position: 0, gap: 0 };
  let largestGap = 0;
  let position = 0;
  let wrapIndex = 0;
  for (let i = 1; i < sorted.length; i++) {
    const prevBottom = sorted[i - 1].y - sorted[i - 1].h;
    const currTop = sorted[i].y;
    const gap = prevBottom - currTop;
    if (gap <= 0) continue;
    const at = (prevBottom + currTop) / 2;
    while (wrapIndex < wrapped.length && at <= wrapped[wrapIndex].bottom) wrapIndex++;
    const band = wrapped[wrapIndex];
    if (gap > largestGap && !(band && at < band.top && at > band.bottom)) {
      largestGap = gap;
      position = at;
    }
  }
  return { position, gap: largestGap };
}
function findVerticalCutWithOutlierFilter(items, minGap) {
  const edgeCut = findVerticalCut(items);
  if (edgeCut.gap >= minGap) return edgeCut;
  if (items.length >= 3) {
    let minX = Infinity, maxX = -Infinity;
    for (const i of items) {
      if (i.x < minX) minX = i.x;
      const r = i.x + i.w;
      if (r > maxX) maxX = r;
    }
    const narrowThreshold = (maxX - minX) * NARROW_ELEMENT_WIDTH_RATIO;
    const filtered = items.filter((i) => i.w >= narrowThreshold);
    if (filtered.length >= 2 && filtered.length < items.length && filtered.length >= items.length * 0.7) {
      const filteredCut = findVerticalCut(filtered);
      const sameRow = (a, b) => Math.abs(a.y - b.y) <= Math.max(a.fontSize, b.fontSize) * 0.5;
      const inLine = items.some((r) => r.w < narrowThreshold && r.x < filteredCut.position && r.x + r.w > filteredCut.position && filtered.some((o) => sameRow(o, r) && o.x + o.w <= r.x + 1) && filtered.some((o) => sameRow(o, r) && o.x >= r.x + r.w - 1));
      if (filteredCut.gap > edgeCut.gap && filteredCut.gap >= minGap && !inLine) {
        return filteredCut;
      }
    }
  }
  return edgeCut;
}
function findVerticalCut(items) {
  if (items.length < 2) return { position: 0, gap: 0 };
  const sorted = [...items].sort((a, b) => a.x - b.x || a.x + a.w - (b.x + b.w));
  let largestGap = 0;
  let position = 0;
  let prevRight = null;
  for (const it of sorted) {
    const left = it.x;
    const right = it.x + it.w;
    if (prevRight !== null && left > prevRight) {
      const gap = left - prevRight;
      if (gap > largestGap) {
        largestGap = gap;
        position = (prevRight + left) / 2;
      }
    }
    prevRight = prevRight === null ? right : Math.max(prevRight, right);
  }
  return { position, gap: largestGap };
}
function isProseGutter(items, x) {
  const sideLines = (side) => {
    const lines = [];
    for (const item of [...side].sort((a, b) => b.y - a.y)) {
      const line = lines.find((l) => Math.abs(l.y - item.y) <= 2);
      if (line) {
        line.chars += item.text.length;
        line.left = Math.min(line.left, item.x);
        line.right = Math.max(line.right, item.x + item.w);
      } else lines.push({ y: item.y, chars: item.text.length, left: item.x, right: item.x + item.w });
    }
    return lines;
  };
  const left = sideLines(items.filter((i) => i.x + i.w / 2 < x));
  const right = sideLines(items.filter((i) => i.x + i.w / 2 >= x));
  if (left.length < 4 || right.length < 4) return false;
  const prose = (lines) => {
    const width = Math.max(...lines.map((l) => l.right)) - Math.min(...lines.map((l) => l.left));
    const full = lines.filter((l) => l.chars >= 25 && l.right - l.left >= width * 0.6).length;
    return full >= lines.length * 0.6;
  };
  if (!prose(left) || !prose(right)) return false;
  const span = (lines) => [Math.min(...lines.map((l) => l.y)), Math.max(...lines.map((l) => l.y))];
  const [l0, l1] = span(left), [r0, r1] = span(right);
  return Math.min(l1, r1) - Math.max(l0, r0) >= Math.min(l1 - l0, r1 - r0) * 0.5;
}
function splitEdgeSpannedColumns(items, gapThreshold, depth) {
  let minX = Infinity, maxX = -Infinity;
  for (const i of items) {
    minX = Math.min(minX, i.x);
    maxX = Math.max(maxX, i.x + i.w);
  }
  const narrow = items.filter((i) => i.w < (maxX - minX) * 0.5);
  if (narrow.length === items.length || narrow.length < 8) return null;
  const cut = findVerticalCut(narrow);
  if (cut.gap < PROSE_GUTTER_MIN_GAP || !isProseGutter(narrow, cut.position)) return null;
  const crossing = items.filter((i) => i.x < cut.position && i.x + i.w > cut.position);
  const rest = items.filter((i) => !crossing.includes(i));
  const restTop = Math.max(...rest.map((i) => i.y)), restBottom = Math.min(...rest.map((i) => i.y));
  const above = crossing.filter((i) => i.y > restTop), below = crossing.filter((i) => i.y < restBottom);
  if (above.length + below.length !== crossing.length) return null;
  const left = rest.filter((i) => i.x + i.w / 2 < cut.position), right = rest.filter((i) => i.x + i.w / 2 >= cut.position);
  return [
    ...above.length ? [above] : [],
    ...xyCutOrder(left, gapThreshold, depth + 1),
    ...xyCutOrder(right, gapThreshold, depth + 1),
    ...below.length ? [below] : []
  ];
}
var FACE_CHARS = /* @__PURE__ */ new WeakMap();
function hasNumberedStyledTitle(lines) {
  if (lines.length < 4) return false;
  const [title, subtitle, body] = lines;
  const face = (line) => line.every((i) => i.fontName === line[0].fontName) ? line[0].fontName : null;
  const a = face(title), b = face(subtitle), c = face(body);
  if (!a || !b || !c || a === b || b === c || a === c || !/^\d+(?:\.\d+)*\.\s+/.test(mergeLineSimple(title)) || mergeLineSimple(title).length + mergeLineSimple(subtitle).length > 140 || Math.abs(title[0].x - subtitle[0].x) > 30 || title[0].y - subtitle[0].y > 30 || subtitle[0].y - body[0].y > 30) return false;
  return true;
}
function pushLineParagraphs(out, yLines, pageNum, lex) {
  const lines = attachDropCaps(yLines).map((items) => ({ items, text: mergeLineSimple(items) })).filter((l) => l.text.trim());
  const geo = lines.map((l) => {
    const b = computeBBox(l.items, pageNum);
    return { text: l.text, left: b.x, right: b.x + b.width, y: l.items.reduce((s, i) => s + i.y, 0) / l.items.length, fontSize: dominantStyle(l.items)?.fontSize ?? 0 };
  });
  const joins = bodyLineJoins(geo, lex);
  const first = lines[0]?.items[0];
  const bands = first ? XY_WRAP_BANDS.get(first) ?? [] : [];
  const hasBand = (top, bottom) => {
    let lo = 0, hi = bands.length;
    while (lo < hi) {
      const mid = lo + hi >>> 1;
      if (bands[mid].top > top + 3) lo = mid + 1;
      else hi = mid;
    }
    for (; lo < bands.length && bands[lo].top >= top - 3; lo++) {
      if (Math.abs(bands[lo].bottom - bottom) <= 3) return true;
    }
    return false;
  };
  for (let i = 0; i + 1 < geo.length; i++) {
    if (joins[i] === "\n" && Math.abs(geo[i + 1].fontSize - geo[i].fontSize) <= 0.15 * geo[i].fontSize && !startsNewItem(geo[i].text, geo[i + 1].text) && hasBand(geo[i].y, geo[i + 1].y)) {
      joins[i] = wrapJoiner(geo[i].text, geo[i + 1].text, lex);
    }
  }
  for (const i of tocRecordBoundaries(lines.map((line) => line.items))) joins[i] = "\n";
  for (let i = 0; i + 1 < geo.length; i++) {
    if (/^\d{1,2}$/.test(geo[i].text.trim()) && geo[i].fontSize >= geo[i + 1].fontSize * 1.2) joins[i] = "\n";
  }
  if (hasNumberedStyledTitle(lines.map((line) => line.items))) {
    joins[0] = "\n";
    joins[1] = "\n";
  }
  for (let i = 0; i < lines.length; ) {
    const first2 = i;
    let text = lines[i].text;
    const items = [...lines[i].items];
    const srcLines = [lines[i].items];
    for (; i + 1 < lines.length && joins[i] !== "\n"; i++) {
      text += joins[i] + lines[i + 1].text;
      items.push(...lines[i + 1].items);
      srcLines.push(lines[i + 1].items);
    }
    text = tagScripts(text, srcLines.map((l) => sortLineByX([...l])));
    const block = { type: "paragraph", text, pageNumber: pageNum, bbox: computeBBox(items, pageNum), style: dominantStyle(items) };
    const faces = /* @__PURE__ */ new Map();
    for (const it of items) faces.set(it.fontName, (faces.get(it.fontName) ?? 0) + it.text.length);
    FACE_CHARS.set(block, faces);
    PARA_LAST_LINE.set(block.bbox, { right: geo[i].right, width: geo[i].right - geo[i].left, fontSize: geo[i].fontSize });
    PARA_FIRST_LEFT.set(block.bbox, geo[first2].left);
    out.push(block);
    i++;
  }
}
function computeMedianFontSizeFromFreq(freq) {
  if (freq.size === 0) return 0;
  let total = 0;
  for (const count of freq.values()) total += count;
  const sorted = [...freq.entries()].sort((a, b) => a[0] - b[0]);
  const mid = Math.floor(total / 2);
  let cumulative = 0;
  for (const [size, count] of sorted) {
    cumulative += count;
    if (cumulative > mid) return size;
  }
  return sorted[sorted.length - 1][0];
}
function detectHeadings(blocks, medianFontSize) {
  for (let bi = 0; bi < blocks.length; bi++) {
    const block = blocks[bi];
    if (block.type !== "paragraph" || !block.text || !block.style?.fontSize) continue;
    const text = block.text.trim();
    if (text.length === 0 || text.length > 200) continue;
    if (/^\d+$/.test(text) && !isChapterNumber(block, blocks[bi + 1], medianFontSize)) continue;
    const ratio = block.style.fontSize / medianFontSize;
    let level = 0;
    if (ratio >= HEADING_RATIO_H1) level = 1;
    else if (ratio >= HEADING_RATIO_H2) level = 2;
    else if (ratio >= HEADING_RATIO_H3) level = 3;
    if (level > 0) {
      block.type = "heading";
      block.level = level;
      block.text = collapseEvenSpacing(text, false);
    }
  }
}
function isChapterNumber(block, next, medianFontSize) {
  const size = block.style?.fontSize ?? 0;
  const nextSize = next?.style?.fontSize ?? 0;
  const text = next?.text?.trim() ?? "";
  const a = block.bbox, b = next?.bbox;
  return /^\d{1,2}$/.test(block.text?.trim() ?? "") && size >= medianFontSize * 2.5 && !!next && (next.type === "paragraph" || next.type === "heading") && next.pageNumber === block.pageNumber && nextSize >= medianFontSize * HEADING_RATIO_H1 && text.length > 0 && text.length <= 80 && !/^[\d\s.]+$/.test(text) && !!a && !!b && a.y > b.y && a.y - (b.y + b.height) <= size * 2;
}
function mergeStackedHeadingLines(blocks, medianFontSize) {
  for (let i = 0; i < blocks.length - 1; ) {
    const a = blocks[i], b = blocks[i + 1];
    const ab = a.bbox, bb = b.bbox;
    const af = a.style?.fontSize ?? 0, bf = b.style?.fontSize ?? 0;
    const gap = ab && bb ? ab.y - (bb.y + bb.height) : Infinity;
    const centered = ab && bb && a.style?.fontName === b.style?.fontName && Math.abs(ab.x + ab.width / 2 - (bb.x + bb.width / 2)) <= Math.max(5, af * 0.5);
    const sameAnchor = ab && bb && Math.abs(ab.x - bb.x) <= 5;
    const wrapped = sameAnchor && a.style?.fontName === b.style?.fontName && af === bf && ab.width >= bb.width * 0.95 && (a.text?.trim().split(/\s+/).length ?? 0) >= 3;
    const displayStack = centered && gap <= Math.min(af, bf) * 0.3 && Math.max(af, bf) <= Math.min(af, bf) * 1.45;
    if (a.type !== "heading" || b.type !== "heading" || !a.text || !b.text || /^\d+$/.test(a.text.trim()) || !ab || !bb || ab.page !== bb.page || !(sameAnchor && af >= medianFontSize * 2 && bf >= medianFontSize * 2) && !wrapped && !(centered && af >= medianFontSize * 1.25 && bf >= medianFontSize * 1.25) || Math.abs(af - bf) > Math.max(af, bf) * 0.15 && !displayStack || gap < -2 || gap > Math.max(af, bf) * 0.45 || a.text.length > (centered ? 120 : 50) || b.text.length > (centered ? 120 : 50)) {
      i++;
      continue;
    }
    a.text = `${a.text.trim()} ${b.text.trim()}`;
    a.bbox = {
      ...ab,
      x: Math.min(ab.x, bb.x),
      y: Math.min(ab.y, bb.y),
      width: Math.max(ab.x + ab.width, bb.x + bb.width) - Math.min(ab.x, bb.x),
      height: Math.max(ab.y + ab.height, bb.y + bb.height) - Math.min(ab.y, bb.y)
    };
    blocks.splice(i + 1, 1);
  }
}
function detectTypographyHeadings(blocks) {
  const byPage = /* @__PURE__ */ new Map();
  for (const block of blocks) {
    if (!block.pageNumber) continue;
    const page = byPage.get(block.pageNumber) ?? [];
    page.push(block);
    byPage.set(block.pageNumber, page);
  }
  for (const page of byPage.values()) {
    if (page.some((block) => block.type === "heading")) continue;
    const faceWeight = /* @__PURE__ */ new Map();
    for (const block of page) {
      if (block.type !== "paragraph" || !block.text || !block.style?.fontName) continue;
      const faces = FACE_CHARS.get(block);
      if (faces) for (const [face, n] of faces) faceWeight.set(face, (faceWeight.get(face) ?? 0) + n);
      else faceWeight.set(block.style.fontName, (faceWeight.get(block.style.fontName) ?? 0) + block.text.length);
    }
    const bodyFace = [...faceWeight].sort((a, b) => b[1] - a[1])[0]?.[0];
    if (!bodyFace || (faceWeight.get(bodyFace) ?? 0) < 250) continue;
    const sizeWeight = /* @__PURE__ */ new Map();
    for (const block of page) {
      if (block.type !== "paragraph" || !block.style?.fontSize) continue;
      const faces = FACE_CHARS.get(block);
      const chars = faces ? faces.get(bodyFace) ?? 0 : block.style.fontName === bodyFace ? block.text?.length ?? 0 : 0;
      if (chars) sizeWeight.set(block.style.fontSize, (sizeWeight.get(block.style.fontSize) ?? 0) + chars);
    }
    const bodySize = [...sizeWeight].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 0;
    for (let i = 0; i < page.length; i++) {
      const block = page[i];
      const { text, bbox, style } = block;
      if (block.type !== "paragraph" || !text || !bbox || !style?.fontName || !style.fontSize) continue;
      const title = text.trim();
      const numbered = /^\d+(?:\.\d+)*\.?\s+[A-Z가-힣]/.test(title);
      const faces = FACE_CHARS.get(block);
      const total = faces ? [...faces.values()].reduce((a, b) => a + b, 0) : 0;
      const bodyShare = faces && total ? (faces.get(bodyFace) ?? 0) / total : 0;
      if (style.fontName === bodyFace || bodyShare > 0.4 || style.fontSize < bodySize * 0.95 || title.length < 3 || title.length > 120 || /^\d+$/.test(title) || /^(?:table|figure|fig\.?|표|그림)\s*\d/i.test(title) || /^(?:doi:|https?:|[•●○▪▫])/i.test(title) || /^(?:over|under)\s+\d+$/i.test(title) || /^[\d\s.,:%+\-–]+$/.test(title) || bbox.height > style.fontSize * (numbered ? 2.4 : 1.6) || title.includes("\n")) continue;
      const centerX = bbox.x + bbox.width / 2;
      const nearby = page.filter((other) => other !== block && other.bbox && other.type !== "image" && other.type !== "separator" && other.bbox.x < centerX && centerX < other.bbox.x + other.bbox.width);
      const above = nearby.filter((other) => other.bbox.y >= bbox.y + bbox.height).sort((a, b) => a.bbox.y - b.bbox.y)[0];
      const below = nearby.filter((other) => other.bbox.y + other.bbox.height <= bbox.y).sort((a, b) => b.bbox.y - a.bbox.y)[0];
      const gapAbove = above ? above.bbox.y - bbox.y - bbox.height : Infinity;
      const gapBelow = below ? bbox.y - below.bbox.y - below.bbox.height : Infinity;
      if (Math.max(gapAbove, gapBelow) < style.fontSize * (numbered ? 0.7 : 1.2)) continue;
      block.type = "heading";
      block.level = 2;
    }
  }
}
function detectDocumentStyleHeadings(blocks) {
  const byPage = /* @__PURE__ */ new Map();
  for (const block of blocks) {
    if (!block.pageNumber) continue;
    const page = byPage.get(block.pageNumber) ?? [];
    page.push(block);
    byPage.set(block.pageNumber, page);
  }
  for (const page of byPage.values()) {
    const faceChars = /* @__PURE__ */ new Map();
    for (const block of page) {
      if (block.type !== "paragraph" || !block.text || !block.style?.fontName) continue;
      faceChars.set(block.style.fontName, (faceChars.get(block.style.fontName) ?? 0) + block.text.length);
    }
    const bodyFace = [...faceChars].sort((a, b) => b[1] - a[1])[0]?.[0];
    if (!bodyFace || (faceChars.get(bodyFace) ?? 0) < 100) continue;
    const labels = page.filter((b) => b.type === "paragraph" && b.text && b.bbox && b.style?.fontName && b.style.fontName !== bodyFace && b.text.trim().length >= 3 && b.text.trim().length <= 40);
    for (const label of labels) {
      const peers = labels.filter((b) => b.style?.fontName === label.style?.fontName && Math.abs(b.bbox.y - label.bbox.y) <= 3 && Math.abs(b.bbox.x - label.bbox.x) >= 60);
      if (peers.length < 2) continue;
      const value = page.find((b) => b.type === "paragraph" && b.bbox && b.style?.fontName !== label.style?.fontName && b.bbox.x >= label.bbox.x - 5 && b.bbox.x <= label.bbox.x + 20 && b.bbox.y < label.bbox.y && label.bbox.y - (b.bbox.y + b.bbox.height) <= 60);
      if (value) {
        label.type = "heading";
        label.level = 2;
      }
    }
    const first = page.find((b) => b.type !== "image" && b.type !== "separator");
    const second = page[page.indexOf(first) + 1];
    const third = page[page.indexOf(first) + 2];
    if (!first || !second || !third || first.type !== "list" && first.type !== "paragraph" || second.type !== "paragraph" || !first.text || !second.text || !first.bbox || !second.bbox || !first.style?.fontName || !second.style?.fontName || !/^\d+(?:\.\d+)*\.\s+/.test(first.text.trim()) || first.style.fontName === bodyFace || second.style.fontName === bodyFace || first.text.length + second.text.length > 140 || Math.abs(first.bbox.x - second.bbox.x) > 30 || first.bbox.y - (second.bbox.y + second.bbox.height) > (first.style.fontSize ?? 0) * 1.5 || third.style?.fontName !== bodyFace) continue;
    first.type = "heading";
    first.level = 1;
    first.text = `${first.text.trim()} ${second.text.trim()}`;
    first.bbox = {
      ...first.bbox,
      x: Math.min(first.bbox.x, second.bbox.x),
      y: Math.min(first.bbox.y, second.bbox.y),
      width: Math.max(first.bbox.x + first.bbox.width, second.bbox.x + second.bbox.width) - Math.min(first.bbox.x, second.bbox.x),
      height: Math.max(first.bbox.y + first.bbox.height, second.bbox.y + second.bbox.height) - Math.min(first.bbox.y, second.bbox.y)
    };
    blocks.splice(blocks.indexOf(second), 1);
  }
}
function detectSiblingStyleHeadings(blocks) {
  const byPage = /* @__PURE__ */ new Map();
  for (const block of blocks) {
    const page = byPage.get(block.pageNumber ?? 0) ?? [];
    page.push(block);
    byPage.set(block.pageNumber ?? 0, page);
  }
  for (const page of byPage.values()) {
    const bodyChars = /* @__PURE__ */ new Map();
    for (const block of page) {
      if (block.type !== "paragraph" || !block.text || !block.style?.fontName) continue;
      const face = block.style.fontName;
      bodyChars.set(face, (bodyChars.get(face) ?? 0) + block.text.length);
    }
    const bodyFace = [...bodyChars].sort((a, b) => b[1] - a[1])[0]?.[0];
    const anchors = page.filter((b) => b.type === "heading" && b.text && b.style?.fontName && b.style.fontName !== bodyFace);
    for (const anchor of anchors) {
      const numbered = /^([A-Z])\.\d+\s+/.exec(anchor.text.trim());
      const lettered = /^([A-Z])\s+/.exec(anchor.text.trim());
      const peers = anchors.filter((b) => b.style?.fontName === anchor.style?.fontName && Math.abs((b.style?.fontSize ?? 0) - (anchor.style?.fontSize ?? 0)) < 0.5);
      if (peers.length < 2 && !numbered && !lettered) continue;
      const candidates = page.filter((b) => b.type === "paragraph" && b.text && b.bbox && b.style?.fontName === anchor.style?.fontName && Math.abs((b.style?.fontSize ?? 0) - (anchor.style?.fontSize ?? 0)) < 0.5 && b.text.trim().length >= 3 && b.text.trim().length <= 80 && b.bbox.height <= (b.style?.fontSize ?? 0) * 1.6 && /^[A-Z]/.test(b.text.trim()) && !/[.!?:;,]$/.test(b.text.trim()) && !/^(?:Table|Figure|Fig\.?|Appendix)\s+\d/i.test(b.text.trim()));
      const siblings = candidates.filter((b) => numbered ? new RegExp(`^${numbered[1]}\\.\\d+\\s+`).test(b.text.trim()) : lettered ? /^[A-Z]\s+/.test(b.text.trim()) && Math.abs(anchor.bbox.x - b.bbox.x) < 8 : peers.some((h) => h.bbox && Math.abs(h.bbox.x - b.bbox.x) < 8));
      if (siblings.length < (numbered || lettered ? 1 : 2)) continue;
      for (const sibling of siblings) {
        sibling.type = "heading";
        sibling.level = anchor.level ?? 2;
      }
    }
  }
}
function detectRepeatedPageLabels(blocks) {
  const byPage = /* @__PURE__ */ new Map();
  for (const block of blocks) {
    const page = byPage.get(block.pageNumber ?? 0) ?? [];
    page.push(block);
    byPage.set(block.pageNumber ?? 0, page);
  }
  for (const page of byPage.values()) {
    const bodyChars = /* @__PURE__ */ new Map();
    for (const b of page) if (b.type === "paragraph" && b.text && b.style?.fontName) {
      const faces = FACE_CHARS.get(b);
      if (faces) for (const [face, n] of faces) bodyChars.set(face, (bodyChars.get(face) ?? 0) + n);
      else bodyChars.set(b.style.fontName, (bodyChars.get(b.style.fontName) ?? 0) + b.text.length);
    }
    const bodyFace = [...bodyChars].sort((a, b) => b[1] - a[1])[0]?.[0];
    const candidates = page.filter((b) => b.type === "paragraph" && b.text && b.bbox && b.style?.fontName && b.style.fontName !== bodyFace && b.bbox.height <= (b.style.fontSize ?? 0) * 1.6 && b.text.trim().length >= 5 && b.text.trim().length <= 80);
    const groups = /* @__PURE__ */ new Map();
    for (const b of candidates) {
      const key = `${b.style.fontName}:${b.style.fontSize}`;
      const group = groups.get(key) ?? [];
      group.push(b);
      groups.set(key, group);
    }
    for (const group of groups.values()) {
      const colons = group.filter((b) => /^[A-Z][^:]{2,60}:$/.test(b.text.trim()));
      const numbered = group.filter((b) => /^0?[1-9]\d?\s*[-–]\s+[A-Z]/.test(b.text.trim()));
      if (colons.length >= 2) for (const b of colons) {
        b.type = "heading";
        b.level = 2;
      }
      if (numbered.length >= 4) for (const b of numbered) {
        b.type = "heading";
        b.level = 2;
      }
      for (const b of colons) if (b.text.trim() === "Procedure:") {
        b.type = "heading";
        b.level = 2;
      }
    }
  }
}
function detectPageLeadHeadings(blocks) {
  const byPage = /* @__PURE__ */ new Map();
  for (const b of blocks) {
    const page = byPage.get(b.pageNumber ?? 0) ?? [];
    page.push(b);
    byPage.set(b.pageNumber ?? 0, page);
  }
  for (const page of byPage.values()) {
    const content = page.filter((b) => b.type !== "image" && b.type !== "separator" && !(b.type === "paragraph" && !b.style));
    const [first, second, third] = content;
    if (!first?.bbox || !first.text || !first.style?.fontSize || !second) continue;
    const firstText = first.text.trim();
    const captionLike = /^(?:Figure|Fig\.?|Table|표|그림)\s*\d/i;
    const hasImage = page.some((b) => b.type === "image");
    const firstIsTitle = first.type === "paragraph" && firstText.length >= 5 && firstText.length <= 80 && first.bbox.height <= first.style.fontSize * 1.6 && (/^(?:CONTENTS|Table of Contents)$/i.test(firstText) || hasImage && /^[A-Z]/.test(firstText) && !captionLike.test(firstText) && second.type === "paragraph" && /^[A-Z]/.test(second.text?.trim() ?? "") && (second.text?.length ?? 0) >= 100 && second.bbox && first.bbox.y - (second.bbox.y + second.bbox.height) >= first.style.fontSize);
    const firstAboveProse = first.type === "paragraph" && firstText.length >= 5 && firstText.length <= 80 && first.bbox.height <= first.style.fontSize * 2 && second.type === "paragraph" && second.bbox && second.bbox.height >= first.style.fontSize * 4 && Math.abs(first.bbox.x - second.bbox.x) <= first.style.fontSize * 2 && first.bbox.y - (second.bbox.y + second.bbox.height) >= first.style.fontSize * 2 && !captionLike.test(firstText) && !/^(?:doi:|https?:|www\.)/i.test(firstText);
    const firstIsSection = first.type === "list" && /^\d+\.\s+[A-Z][A-Z\s]{12,}$/.test(firstText) && second.type === "paragraph" && (second.text?.length ?? 0) >= 100;
    if (firstIsTitle || firstAboveProse || firstIsSection) {
      first.type = "heading";
      first.level = 1;
    }
    if (first.type !== "heading" || captionLike.test(firstText) || second.type !== "paragraph" || !second.text || !second.bbox || !second.style?.fontName || !second.style.fontSize || !third?.text || !third.bbox || second.text.trim().length < 5 || second.text.trim().length > 80 || captionLike.test(second.text.trim()) || /^(?:doi:|https?:)/i.test(second.text.trim()) || second.bbox.height > second.style.fontSize * 1.6 || Math.abs(second.bbox.x - third.bbox.x) > 30) continue;
    const distinctFace = third.style?.fontName !== second.style.fontName;
    const namedContents = /^Table of Contents$/i.test(second.text.trim());
    if (distinctFace && third.text.length >= 60 || namedContents) {
      second.type = "heading";
      second.level = 1;
    }
  }
}
function refineDocumentStyleHeadings(blocks) {
  const faceChars = /* @__PURE__ */ new Map();
  for (const block of blocks) {
    if (block.type !== "paragraph" || !block.text || !block.style?.fontName) continue;
    faceChars.set(block.style.fontName, (faceChars.get(block.style.fontName) ?? 0) + block.text.length);
  }
  const [bodyFace, bodyChars] = [...faceChars].sort((a, b) => b[1] - a[1])[0] ?? [];
  if (!bodyFace || !bodyChars || bodyChars < 300) return;
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const text = block.text?.trim() ?? "";
    if (block.type === "heading" && /(?:https?:\/\/|www\.|^arxiv:|^doi:)/i.test(text)) {
      block.type = "paragraph";
      block.level = void 0;
      continue;
    }
    const box = block.bbox, style = block.style;
    if (block.type !== "paragraph" || !box || !style?.fontName || !style.fontSize || style.fontName === bodyFace || (faceChars.get(style.fontName) ?? 0) > bodyChars * 0.25 || text.length < 3 || text.length > 70 || text.includes("\n") || box.height > style.fontSize * 1.6 || /^(?:table|figure|fig\.?|source|doi:|arxiv:|https?:|www\.|[•●○▪▫⮚*∗†])/i.test(text) || /(?:https?:\/\/|www\.|@|[=¼≪þ])/i.test(text) || /^definition\s+\d+[.:]?\s+.*\b(?:is|are|means)\b/i.test(text) || /^[\d\s.,:%+\-–]+$/.test(text)) continue;
    const previous = blocks[i - 1], next = blocks[i + 1];
    const pb = previous?.bbox, nb = next?.bbox;
    if (!pb || !nb || previous.pageNumber !== block.pageNumber || next.pageNumber !== block.pageNumber || previous.type !== "paragraph" && previous.type !== "heading" || next.type !== "paragraph" || next.style?.fontName !== bodyFace || !next.text || next.text.length < 40 || style.fontSize < (next.style.fontSize ?? 0) * 0.95 || pb.y - (box.y + box.height) < style.fontSize * 0.5 || box.y - (nb.y + nb.height) < 0 || box.y - (nb.y + nb.height) > style.fontSize * 2 || box.x + box.width / 2 < nb.x - 10 || box.x + box.width / 2 > nb.x + nb.width + 10) continue;
    block.type = "heading";
    block.level = 2;
  }
}
function shouldDemoteTable(table) {
  const allCells = table.cells.flatMap((row) => row.map((c) => c.text.trim())).filter(Boolean);
  const allText = allCells.join(" ");
  if (table.rows >= 2 && table.cols >= 2 && table.cells[0].every((c) => {
    const t = c.text.trim();
    return t.length > 0 && t.length <= 12 && !/[□■◆○●▶ㅇ<>]/.test(t);
  }) && table.cells.slice(1).some((row) => row.some((c) => c.text.trim() !== ""))) return false;
  if (table.rows <= 3 && table.cols <= 3 && allText.length <= 200) {
    const totalCells2 = table.rows * table.cols;
    const emptyCells2 = totalCells2 - allCells.length;
    if (emptyCells2 >= totalCells2 * 0.3) return true;
    if (/[□■◆○●▶ㅇ]/.test(allText)) return true;
    if (/<[^>]+>/.test(allText)) return true;
  }
  if (allText.length > 200) return false;
  if (/[□■◆○●▶]/.test(allText) && table.rows <= 3) return true;
  const totalCells = table.rows * table.cols;
  const emptyCells = totalCells - allCells.length;
  if (table.rows <= 2 && emptyCells > totalCells * 0.5) return true;
  if (table.rows === 1 && !/\d{2,}/.test(allText)) return true;
  return false;
}
function demoteTableToText(table) {
  const lines = [];
  for (let r = 0; r < table.rows; r++) {
    const cells = table.cells[r].map((c) => c.text.trim()).filter(Boolean);
    if (cells.length === 0) continue;
    if (table.cols === 2 && cells.length === 2) {
      lines.push(`${cells[0]} : ${cells[1]}`);
    } else {
      lines.push(cells.join(" "));
    }
  }
  return lines.join("\n");
}
function detectMarkerHeadings(blocks) {
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    if (block.type !== "paragraph" || !block.text) continue;
    const text = block.text.trim();
    if (text.length < 50 && /^[□■◆◇▶]\s*[가-힣]/.test(text)) {
      block.type = "heading";
      block.level = 4;
      continue;
    }
    if (/^[가-힣]{2,6}$/.test(text) && block.style?.fontSize) {
      const prev = blocks[i - 1];
      const next = blocks[i + 1];
      const prevIsStructural = !prev || prev.type === "table" || prev.type === "heading" || prev.type === "separator";
      const nextIsStructural = !next || next.type === "table" || next.type === "heading" || next.type === "paragraph" && next.text && /^[□■◆○●]/.test(next.text.trim());
      if (prevIsStructural || nextIsStructural) {
        block.type = "heading";
        block.level = 3;
      }
    }
  }
}
var TABLE_CAPTION_RE = /^[<\[(【〈]?\s*(표|그림|도표|Table|Figure|Fig\.?)\s*[\d①-⑮][\d.\-]*\s*[\])】〉>]?[.:]?\s*/i;
var CAPTION_MAX_LENGTH = 100;
var CAPTION_MAX_GAP = 30;
function detectTableCaptions(blocks) {
  const isCaptionCandidate = (b, table) => {
    if (!b || b.type !== "paragraph" || !b.text) return false;
    if (b.pageNumber !== table.pageNumber) return false;
    const text = b.text.trim();
    if (!text || text.length > CAPTION_MAX_LENGTH || text.includes("\n")) return false;
    if (!TABLE_CAPTION_RE.test(text)) return false;
    if (b.bbox && table.bbox) {
      const capTop = b.bbox.y + b.bbox.height;
      const capBottom = b.bbox.y;
      const tblTop = table.bbox.y + table.bbox.height;
      const tblBottom = table.bbox.y;
      const gap = capBottom >= tblTop ? capBottom - tblTop : tblBottom - capTop;
      if (gap > CAPTION_MAX_GAP) return false;
      const overlap2 = Math.min(b.bbox.x + b.bbox.width, table.bbox.x + table.bbox.width) - Math.max(b.bbox.x, table.bbox.x);
      if (overlap2 < Math.min(b.bbox.width, table.bbox.width) * 0.3) return false;
    }
    return true;
  };
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    if (block.type !== "table" || !block.table || block.table.caption) continue;
    if (isCaptionCandidate(blocks[i - 1], block)) {
      block.table.caption = blocks[i - 1].text.trim();
      blocks.splice(i - 1, 1);
      i--;
    } else if (isCaptionCandidate(blocks[i + 1], block) && blocks[i + 2]?.type !== "table") {
      block.table.caption = blocks[i + 1].text.trim();
      blocks.splice(i + 1, 1);
    }
  }
}
var KOREAN_LIST_SEQ = "\uAC00\uB098\uB2E4\uB77C\uB9C8\uBC14\uC0AC\uC544\uC790\uCC28\uCE74\uD0C0\uD30C\uD558";
function parseListLabel(text) {
  let m = text.match(/^(\d{1,2})\.(?!\d)\s+/);
  if (m) return { family: "arabicDot", ord: parseInt(m[1], 10) };
  m = text.match(/^([가-하])\.\s+/);
  if (m) {
    const idx = KOREAN_LIST_SEQ.indexOf(m[1]);
    if (idx >= 0) return { family: "korDot", ord: idx + 1 };
  }
  m = text.match(/^(\d{1,2})\)\s*/);
  if (m) return { family: "arabicParen", ord: parseInt(m[1], 10) };
  m = text.match(/^([가-하])\)\s*/);
  if (m) {
    const idx = KOREAN_LIST_SEQ.indexOf(m[1]);
    if (idx >= 0) return { family: "korParen", ord: idx + 1 };
  }
  m = text.match(/^([①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮])\s*/);
  if (m) return { family: "circled", ord: m[1].charCodeAt(0) - 9312 + 1 };
  return null;
}
var ATTACHMENT_RE = /^붙\s*임\s*(\d+[.:]?)?\s/;
function detectKoreanListBlocks(blocks) {
  const labeled = [];
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    if (b.type !== "paragraph" && b.type !== "list" || !b.text) continue;
    const label = parseListLabel(b.text.trim());
    if (label) labeled.push({ idx: i, label });
  }
  const validated = /* @__PURE__ */ new Set();
  const byFamily = /* @__PURE__ */ new Map();
  for (const l of labeled) {
    const arr = byFamily.get(l.label.family) || [];
    arr.push(l);
    byFamily.set(l.label.family, arr);
  }
  for (const arr of byFamily.values()) {
    let chain = [];
    for (const item of arr) {
      const prev = chain[chain.length - 1];
      if (prev && item.label.ord === prev.label.ord + 1 && item.idx - prev.idx <= 20) {
        chain.push(item);
      } else {
        if (chain.length >= 2) for (const c of chain) validated.add(c.idx);
        chain = [item];
      }
    }
    if (chain.length >= 2) for (const c of chain) validated.add(c.idx);
  }
  let familyStack = [];
  let lastTopLevelList = null;
  let prevListIdx = -2;
  const toRemove = /* @__PURE__ */ new Set();
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    if (b.type === "table" || b.type === "heading" || b.type === "separator") {
      familyStack = [];
      lastTopLevelList = null;
      continue;
    }
    if (b.type !== "paragraph" && b.type !== "list" || !b.text) continue;
    const text = b.text.trim();
    if (b.type === "paragraph" && ATTACHMENT_RE.test(text)) {
      blocks[i] = { ...b, type: "list", listType: "unordered" };
      continue;
    }
    if (!validated.has(i)) continue;
    const label = parseListLabel(text);
    let depth = familyStack.indexOf(label.family);
    if (depth < 0) {
      familyStack.push(label.family);
      depth = familyStack.length - 1;
    } else {
      familyStack = familyStack.slice(0, depth + 1);
    }
    const listType = label.family === "arabicDot" ? "ordered" : "unordered";
    const listBlock = { ...b, type: "list", listType };
    if (depth === 0) {
      blocks[i] = listBlock;
      lastTopLevelList = listBlock;
    } else if (lastTopLevelList && i === prevListIdx + 1) {
      if (!lastTopLevelList.children) lastTopLevelList.children = [];
      lastTopLevelList.children.push(listBlock);
      toRemove.add(i);
    } else {
      blocks[i] = listBlock;
      lastTopLevelList = listBlock;
    }
    prevListIdx = i;
  }
  if (toRemove.size > 0) {
    const sorted = [...toRemove].sort((a, b) => b - a);
    for (const idx of sorted) blocks.splice(idx, 1);
  }
}
function detectListBlocks(blocks) {
  const result = [];
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    if (block.type === "paragraph" && block.text) {
      const text = block.text.trim();
      if (/^\d+\.\s/.test(text)) {
        result.push({ ...block, type: "list", listType: "ordered", text: block.text });
        continue;
      }
      if (/^[○●·※▶▷◆◇\-]\s/.test(text)) {
        result.push({ ...block, type: "list", listType: "unordered", text: block.text });
        continue;
      }
    }
    result.push(block);
  }
  return result;
}
var KOREAN_TABLE_HEADER_RE = /^\(?(구분|항목|종류|분류|유형|대상|내용|기간|금액|비율|방법|절차|요건|조건|근거|목적|범위|기준)\)?[:\s]/;
var KV_FALSE_POSITIVE_RE = /\d{1,2}:\d{2}|:\/\/|\d+:\d+/;
function detectSpecialKoreanTables(blocks) {
  const result = [];
  let kvLines = [];
  const flushKvTable = () => {
    if (kvLines.length < 2) {
      for (const kv of kvLines) result.push(kv.block);
      kvLines = [];
      return;
    }
    const cells = kvLines.map((kv) => {
      if (kv.value) {
        return [
          { text: kv.key, colSpan: 1, rowSpan: 1 },
          { text: kv.value, colSpan: 1, rowSpan: 1 }
        ];
      }
      return [
        { text: kv.key, colSpan: 2, rowSpan: 1 },
        { text: "", colSpan: 1, rowSpan: 1 }
      ];
    });
    const irTable = {
      rows: cells.length,
      cols: 2,
      cells,
      hasHeader: true
    };
    const firstBlock = kvLines[0].block;
    result.push({
      type: "table",
      table: irTable,
      pageNumber: firstBlock.pageNumber,
      bbox: firstBlock.bbox
    });
    kvLines = [];
  };
  for (const block of blocks) {
    if (block.type !== "paragraph" || !block.text) {
      flushKvTable();
      result.push(block);
      continue;
    }
    const text = block.text.trim();
    if (KOREAN_TABLE_HEADER_RE.test(text)) {
      const colonIdx = text.indexOf(":");
      if (colonIdx >= 0) {
        kvLines.push({
          key: text.slice(0, colonIdx).trim(),
          value: text.slice(colonIdx + 1).trim(),
          block
        });
      } else {
        const spaceIdx = text.search(/\s/);
        if (spaceIdx > 0) {
          kvLines.push({
            key: text.slice(0, spaceIdx).trim(),
            value: text.slice(spaceIdx + 1).trim(),
            block
          });
        } else {
          kvLines.push({ key: text, value: "", block });
        }
      }
      continue;
    }
    if (kvLines.length > 0 && text.includes(":")) {
      if (!KV_FALSE_POSITIVE_RE.test(text) && !text.includes("(") && !text.includes(")")) {
        const colonIdx = text.indexOf(":");
        const key = text.slice(0, colonIdx).trim();
        if (/^[가-힣]+$/.test(key) && key.length >= 2 && key.length <= 8) {
          kvLines.push({
            key,
            value: text.slice(colonIdx + 1).trim(),
            block
          });
          continue;
        }
      }
    }
    flushKvTable();
    result.push(block);
  }
  flushKvTable();
  return result;
}
function removeHeaderFooterBlocks(blocks, pageHeights, warnings, notes, tables = false, context = []) {
  if (context.length && !tables) {
    const removed = removeHeaderFooterBlocks([...blocks, ...context], pageHeights, [], notes).filter((index) => index < blocks.length);
    if (removed.length) warnings.push({ message: `${removed.length}\uAC1C \uBA38\uB9AC\uAE00/\uBC14\uB2E5\uAE00 \uC694\uC18C \uC81C\uAC70\uB428`, code: "HIDDEN_TEXT_FILTERED" });
    return removed;
  }
  const ZONE_RATIO = 0.12;
  const MIN_REPEAT2 = 3;
  const topEntries = [];
  const bottomEntries = [];
  for (let bi = 0; bi < blocks.length; bi++) {
    const b = blocks[bi];
    const text = !tables ? b.text?.trim() : b.type === "table" && b.table ? b.table.cells.flat().map((c) => c.text.trim()).filter(Boolean).join(" | ") : void 0;
    if (!b.bbox || !b.pageNumber || !text) continue;
    const ph = pageHeights.get(b.bbox.page) || pageHeights.get(b.pageNumber);
    if (!ph) continue;
    const blockTop = ph - (b.bbox.y + b.bbox.height);
    const blockBottom = ph - b.bbox.y;
    const entry = { blockIdx: bi, page: b.pageNumber, text };
    const boxMid = b.type === "table" && b.bbox.height <= ph * 0.05 ? (blockTop + blockBottom) / 2 : void 0;
    if ((boxMid ?? blockBottom) <= ph * ZONE_RATIO) topEntries.push(entry);
    else if ((boxMid ?? blockTop) >= ph * (1 - ZONE_RATIO)) bottomEntries.push(entry);
  }
  const removeSet = /* @__PURE__ */ new Set();
  for (const entries of [topEntries, bottomEntries]) {
    if (entries.length === 0) continue;
    const patternCount = /* @__PURE__ */ new Map();
    const patternPages = /* @__PURE__ */ new Map();
    const patternNumbers = /* @__PURE__ */ new Map();
    for (const e of entries) {
      const norm = e.text.replace(/\d+/g, "#");
      patternCount.set(norm, (patternCount.get(norm) || 0) + 1);
      const nums = patternNumbers.get(norm) || /* @__PURE__ */ new Set();
      nums.add((e.text.match(/\d+/g) ?? []).join(","));
      patternNumbers.set(norm, nums);
      const pages = patternPages.get(norm) || /* @__PURE__ */ new Set();
      pages.add(e.page);
      patternPages.set(norm, pages);
    }
    const repeatedPatterns = /* @__PURE__ */ new Set();
    for (const [p, count] of patternCount) {
      const pages = [...patternPages.get(p) ?? []];
      const span = pages.length ? Math.max(...pages) - Math.min(...pages) + 1 : 0;
      const pageNumbered = !tables && (patternNumbers.get(p)?.size ?? 0) > 1;
      if (count >= MIN_REPEAT2 && pages.length >= MIN_REPEAT2 && (pages.length >= span * 0.4 || pageNumbered)) {
        repeatedPatterns.add(p);
      }
    }
    for (const e of entries) {
      const norm = e.text.replace(/\d+/g, "#");
      if (!repeatedPatterns.has(norm)) continue;
      const noteMark = e.text.match(/^\d{1,3}\)/)?.[0];
      if (noteMark && notes?.get(e.page)?.marks.some((m) => m.mark === noteMark)) continue;
      const cand = blocks[e.blockIdx];
      const cb = cand.bbox;
      const tableNote = /^(?:주\s*(?:\d+\s*[).:]|[:：])|(?:자료|출처)\s*[:：])/.test(e.text.replace(/ \| /g, " ")) && blocks.some((o) => {
        if (o.type !== "table" || !o.bbox || o.bbox.page !== cb.page) return false;
        const gap = o.bbox.y - (cb.y + cb.height);
        return gap >= 0 && gap <= cb.height && cb.x >= o.bbox.x && cb.x + cb.width <= o.bbox.x + o.bbox.width;
      });
      if (tableNote) continue;
      let sharesLine = false;
      for (let bi = 0; bi < blocks.length; bi++) {
        if (bi === e.blockIdx) continue;
        const o = blocks[bi];
        if (!o.bbox || o.bbox.page !== cb.page) continue;
        const oNorm = o.text?.trim().replace(/\d+/g, "#");
        if (oNorm && repeatedPatterns.has(oNorm)) continue;
        const overlap2 = Math.min(cb.y + cb.height, o.bbox.y + o.bbox.height) - Math.max(cb.y, o.bbox.y);
        if (overlap2 >= cb.height * 0.5) {
          sharesLine = true;
          break;
        }
      }
      if (!sharesLine) removeSet.add(e.blockIdx);
    }
  }
  if (removeSet.size > 0) {
    warnings.push({ message: `${removeSet.size}\uAC1C \uBA38\uB9AC\uAE00/\uBC14\uB2E5\uAE00 \uC694\uC18C \uC81C\uAC70\uB428`, code: "HIDDEN_TEXT_FILTERED" });
  }
  return [...removeSet].sort((a, b) => a - b);
}
var CLIP_TABLES = /* @__PURE__ */ new WeakSet();
var FRAME_TITLE_BLOCKS = /* @__PURE__ */ new WeakMap();
var TABLE_COLXS = /* @__PURE__ */ new WeakMap();
var TABLE_ROWYS = /* @__PURE__ */ new WeakMap();
var TABLE_TAIL = /* @__PURE__ */ new WeakMap();
var PART_COLXS = /* @__PURE__ */ new WeakMap();
var EMPTY_PARTS = /* @__PURE__ */ new WeakSet();
var IMAGE_CELLS = /* @__PURE__ */ new WeakSet();
var FILLER_CELLS = /* @__PURE__ */ new WeakSet();
var CONT_PARTS = /* @__PURE__ */ new WeakMap();
var CELL_LINES = /* @__PURE__ */ new WeakMap();
function recordCellLines(cell, items) {
  const lines = [];
  for (const it of [...items].sort((a, b) => b.y - a.y)) {
    const fs = it.fontSize || it.h;
    const last = lines[lines.length - 1];
    if (last && Math.abs(last.y - it.y) <= Math.max(3, Math.min(fs, last.h) * 0.6)) {
      last.l = Math.min(last.l, it.x);
      last.r = Math.max(last.r, it.x + it.w);
      last.h = Math.max(last.h, fs);
    } else lines.push({ y: it.y, l: it.x, r: it.x + it.w, h: fs });
  }
  CELL_LINES.set(cell, lines);
}
var ROW_RULES = /* @__PURE__ */ new WeakMap();
function ruleCover(hs, y, x1, x2) {
  const segs = hs.filter((l) => Math.abs(l.y1 - y) <= 1.5 && l.x2 > x1 && l.x1 < x2).map((l) => [Math.max(l.x1, x1), Math.min(l.x2, x2)]).sort((a, b) => a[0] - b[0]);
  let len = 0, end = x1;
  for (const [a, b] of segs) if (b > end) {
    len += b - Math.max(a, end);
    end = b;
  }
  return x2 > x1 ? len / (x2 - x1) : 0;
}
function recordRowRules(table, cells, bbox, hs) {
  const real = cells.filter((c) => !c.filler);
  const edge = (y, pick) => {
    let w = 0, covered = 0;
    for (const c of real) if (Math.abs(pick(c) - y) <= 1) {
      w += c.bbox.x2 - c.bbox.x1;
      covered += ruleCover(hs, y, c.bbox.x1, c.bbox.x2) * (c.bbox.x2 - c.bbox.x1);
    }
    return w > 0 && covered >= 0.9 * w;
  };
  let innerRuled = 0, innerOpen = 0;
  for (const c of real) {
    if (Math.abs(c.bbox.y1 - bbox.y1) <= 1) continue;
    if (ruleCover(hs, c.bbox.y1, c.bbox.x1 + 0.5, c.bbox.x2 - 0.5) >= 0.9) innerRuled++;
    else innerOpen++;
  }
  ROW_RULES.set(table, { top: edge(bbox.y2, (c) => c.bbox.y2), bottom: edge(bbox.y1, (c) => c.bbox.y1), innerRuled, innerOpen });
}
function markImageCell(cell) {
  IMAGE_CELLS.add(cell);
}
var emptyCell = (cell) => !cell || !cell.text?.trim() && !cell.blocks?.length && !IMAGE_CELLS.has(cell);
function trimTable(table) {
  let cols = table.cols;
  while (cols > 0 && table.cells.every((row) => emptyCell(row[cols - 1]))) cols--;
  if (cols === table.cols || cols === 0) return;
  table.cells = table.cells.map((row) => row.slice(0, cols));
  for (const row of table.cells) {
    for (let c = 0; c < row.length; c++) {
      if (c + row[c].colSpan > cols) row[c].colSpan = cols - c;
    }
  }
  table.cols = cols;
}
function trimTrailingEmptyTableCols(blocks) {
  for (const b of blocks) {
    if (b.type !== "table" || !b.table) continue;
    for (const row of b.table.cells) for (const cell of row) if (cell.blocks?.length) trimTrailingEmptyTableCols(cell.blocks);
    trimTable(b.table);
  }
}
function mergeSliverColumns(grid, colXs, maxWidth) {
  let merged = 0;
  for (let c = colXs.length - 2; c >= 0; c--) {
    const cols = colXs.length - 1;
    if (cols <= 1 || colXs[c + 1] - colXs[c] >= maxWidth) continue;
    const owner = grid.map((row) => row.map(() => null));
    const anchorCol = /* @__PURE__ */ new Map();
    for (let r = 0; r < grid.length; r++) for (let k = 0; k < cols; k++) {
      const cell = grid[r][k];
      if (!cell || owner[r][k]) continue;
      anchorCol.set(cell, k);
      for (let dr = 0; dr < cell.rowSpan && r + dr < grid.length; dr++)
        for (let dc = 0; dc < cell.colSpan && k + dc < cols; dc++) owner[r + dr][k + dc] = cell;
    }
    const ok = owner.every((row) => {
      const o = row[c];
      return !!o && (o.colSpan > 1 || !o.text.trim() && !o.blocks?.length);
    });
    if (!ok) continue;
    const spanning = /* @__PURE__ */ new Set();
    for (const row of owner) if (row[c].colSpan > 1) spanning.add(row[c]);
    for (const cell of spanning) cell.colSpan--;
    for (let r = 0; r < grid.length; r++) {
      if (grid[r][c] === owner[r][c] && spanning.has(grid[r][c])) grid[r][c + 1] = grid[r][c];
      grid[r].splice(c, 1);
    }
    colXs.splice(c + 1, 1);
    merged++;
  }
  return merged;
}
var multiply = (m, t) => [
  m[0] * t[0] + m[2] * t[1],
  m[1] * t[0] + m[3] * t[1],
  m[0] * t[2] + m[2] * t[3],
  m[1] * t[2] + m[3] * t[3],
  m[0] * t[4] + m[2] * t[5] + m[4],
  m[1] * t[4] + m[3] * t[5] + m[5]
];
function hollowCircle(image) {
  if (!image?.data || image.width < 16 || image.width > 128 || image.height < 16 || image.height > 128 || Math.abs(image.width - image.height) > Math.min(image.width, image.height) * 0.1) return false;
  const stride = image.kind === ImageKind.RGB_24BPP ? 3 : image.kind === ImageKind.RGBA_32BPP ? 4 : 0;
  const { width, height, data } = image;
  if (!stride || data.length < width * height * stride) return false;
  const dark = [];
  let white = 0;
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const i = (y * width + x) * stride;
    if (stride === 4 && data[i + 3] < 240) return false;
    const min = Math.min(data[i], data[i + 1], data[i + 2]), max = Math.max(data[i], data[i + 1], data[i + 2]);
    if (max - min > 15) return false;
    if (min >= 235) white++;
    if (max < 180) dark.push({ x, y });
  }
  if (white < width * height * 0.65 || dark.length < width * height * 0.025 || dark.length > width * height * 0.3) return false;
  const x0 = Math.min(...dark.map((p) => p.x)), x1 = Math.max(...dark.map((p) => p.x));
  const y0 = Math.min(...dark.map((p) => p.y)), y1 = Math.max(...dark.map((p) => p.y));
  const w = x1 - x0 + 1, h = y1 - y0 + 1, radius = (w + h) / 4;
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  if (Math.abs(w - h) > Math.min(w, h) * 0.15 || w < width * 0.4 || w > width * 0.85 || h < height * 0.4 || h > height * 0.85 || x0 < width * 0.04 || y0 < height * 0.04 || x1 >= width * 0.96 || y1 >= height * 0.96 || Math.abs(cx - width / 2) > width * 0.15 || Math.abs(cy - height / 2) > height * 0.15) return false;
  const sectors = /* @__PURE__ */ new Set();
  for (const point of dark) {
    const r = Math.hypot(point.x - cx, point.y - cy) / radius;
    if (r < 0.65 || r > 1.15) return false;
    sectors.add(Math.floor((Math.atan2(point.y - cy, point.x - cx) + Math.PI) / (Math.PI * 2) * 8) % 8);
  }
  return sectors.size === 8;
}
async function resolveImagePixels(page, id) {
  const objects = id.startsWith("g_") ? page.commonObjs : page.objs;
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(null), 5e3);
    try {
      objects.get(id, (value) => {
        clearTimeout(timer);
        resolve(value ?? null);
      });
    } catch {
      clearTimeout(timer);
      resolve(null);
    }
  });
}
function smallVisibleImagePaints(fnArray, argsArray) {
  const paints = [];
  let ctm = [1, 0, 0, 1, 0, 0];
  let alpha = 1, clip = null, unknownClip = false;
  const stack = [];
  let pathRect, pendingClip = false;
  const intersectClip = (box) => {
    clip = clip ? {
      x1: Math.max(clip.x1, box.x1),
      y1: Math.max(clip.y1, box.y1),
      x2: Math.min(clip.x2, box.x2),
      y2: Math.min(clip.y2, box.y2)
    } : box;
  };
  const rectangle = (x, y, w, h) => extractImageRegions(
    [OPS3.transform, OPS3.transform, OPS3.paintImageXObject],
    [ctm, [w, 0, 0, h, x, y], ["bounds"]]
  )[0];
  for (let i = 0; i < fnArray.length; i++) {
    const op = fnArray[i], args = argsArray[i];
    if (op === OPS3.save || op === OPS3.paintFormXObjectBegin) {
      stack.push({ ctm, alpha, clip, unknownClip });
      const matrix = op === OPS3.paintFormXObjectBegin ? args?.[0] : void 0;
      if (Array.isArray(matrix) && matrix.length >= 6) ctm = multiply(ctm, matrix);
      const bounds = op === OPS3.paintFormXObjectBegin ? args?.[1] : void 0;
      if (Array.isArray(bounds) && bounds.length === 4) {
        const box = rectangle(bounds[0], bounds[1], bounds[2] - bounds[0], bounds[3] - bounds[1]);
        if (box && ctm[1] === 0 && ctm[2] === 0) intersectClip(box);
        else unknownClip = true;
      }
    } else if (op === OPS3.restore || op === OPS3.paintFormXObjectEnd) {
      const state = stack.pop();
      ctm = state?.ctm ?? [1, 0, 0, 1, 0, 0];
      alpha = state?.alpha ?? 1;
      clip = state?.clip ?? null;
      unknownClip = state?.unknownClip ?? false;
    } else if (op === OPS3.setGState) {
      for (const [key, value] of args?.[0] ?? []) {
        if (key === "ca") alpha = typeof value === "number" ? value : 0;
      }
    } else if (op === OPS3.constructPath) {
      const [operations, coordinates] = args;
      pathRect = pathRect === void 0 && operations?.length === 1 && operations[0] === OPS3.rectangle && coordinates?.length >= 4 && ctm[1] === 0 && ctm[2] === 0 ? rectangle(coordinates[0], coordinates[1], coordinates[2], coordinates[3]) : null;
    } else if (op === OPS3.clip || op === OPS3.eoClip) pendingClip = true;
    else if ([
      OPS3.endPath,
      OPS3.stroke,
      OPS3.closeStroke,
      OPS3.fill,
      OPS3.eoFill,
      OPS3.fillStroke,
      OPS3.eoFillStroke,
      OPS3.closeFillStroke,
      OPS3.closeEOFillStroke
    ].includes(op)) {
      if (pendingClip) {
        if (pathRect) intersectClip(pathRect);
        else unknownClip = true;
      }
      pendingClip = false;
      pathRect = void 0;
    } else if (op === OPS3.transform && Array.isArray(args) && args.length >= 6) ctm = multiply(ctm, args);
    else if (op === OPS3.paintImageXObject && typeof args?.[0] === "string") {
      if (typeof args[1] !== "number" || typeof args[2] !== "number" || args[1] < 16 || args[1] > 128 || args[2] < 16 || args[2] > 128) continue;
      const box = extractImageRegions([OPS3.transform, OPS3.paintImageXObject], [ctm, args])[0];
      if (!box || ctm[1] !== 0 || ctm[2] !== 0 || alpha < 0.99 || unknownClip || clip && (box.x1 + (box.x2 - box.x1) * 0.03 < clip.x1 || box.y1 + (box.y2 - box.y1) * 0.03 < clip.y1 || box.x2 - (box.x2 - box.x1) * 0.03 > clip.x2 || box.y2 - (box.y2 - box.y1) * 0.03 > clip.y2)) continue;
      const width = box.x2 - box.x1, height = box.y2 - box.y1;
      if (width < 3 || width > 24 || height < 3 || height > 24 || width / height < 0.5 || width / height > 2) continue;
      paints.push({ id: args[0], box, mirrored: ctm[0] < 0 });
    }
  }
  return paints;
}
async function restoreImageBullets(items, page, fnArray, argsArray, shapes = /* @__PURE__ */ new Map()) {
  const candidates = [];
  for (const { id, box } of smallVisibleImagePaints(fnArray, argsArray)) {
    const width = box.x2 - box.x1, height = box.y2 - box.y1;
    if (Math.abs(width - height) > Math.min(width, height) * 0.1) continue;
    const line = items.filter((item) => !item.isHidden && item.fontSize > 0 && item.x >= box.x2 && item.x - box.x2 <= item.fontSize * 0.7 && Math.abs(item.y + item.h / 2 - (box.y1 + box.y2) / 2) <= item.fontSize * 0.4 && height >= item.fontSize * 0.5 && height <= item.fontSize * 1.2).sort((a, b) => a.x - b.x)[0];
    if (!line || /^[○●•◦□■∙]/.test(line.text.trim()) || !new RegExp("\\p{L}", "u").test(line.text)) continue;
    const row = items.filter((item) => Math.abs(item.y - line.y) <= 2 && item.x >= line.x);
    if (row.reduce((n, item) => n + (item.text.match(new RegExp("\\p{L}", "gu"))?.length ?? 0), 0) < 12 || items.some((item) => item !== line && Math.abs(item.y - line.y) <= 2 && item.x < line.x)) continue;
    candidates.push({ id, x: box.x1, width, line });
  }
  let restored = 0;
  const used = /* @__PURE__ */ new Set();
  for (const candidate of candidates) {
    const same = candidates.filter((other) => other.id === candidate.id && other.line !== candidate.line && Math.abs(other.line.x - candidate.line.x) <= 1 && Math.abs(other.x - candidate.x) <= 1 && Math.abs(other.width - candidate.width) <= 1 && other.line.fontSize === candidate.line.fontSize && Math.abs(other.line.y - candidate.line.y) >= candidate.line.fontSize * 2);
    const numbered = items.filter((item) => !item.isHidden && /^[①-⑮]\s*/.test(item.text.trim()) && item.fontName === candidate.line.fontName && item.fontSize === candidate.line.fontSize && Math.abs(item.x - candidate.x) <= 1 && (item.text.match(new RegExp("\\p{L}", "gu"))?.length ?? 0) >= 12).sort((a, b) => b.y - a.y);
    const numberedList = numbered.some((item, index) => index > 0 && item.text.trim().charCodeAt(0) === numbered[index - 1].text.trim().charCodeAt(0) + 1);
    if (!same.length && !numberedList || used.has(candidate.line)) continue;
    if (!shapes.has(candidate.id)) shapes.set(candidate.id, hollowCircle(await resolveImagePixels(page, candidate.id)));
    if (!shapes.get(candidate.id)) continue;
    used.add(candidate.line);
    items.push({ ...candidate.line, text: "\u25CB", x: candidate.x, w: candidate.width, strike: false, underline: false, hasSpaceBefore: false, syntheticSpace: false });
    restored++;
  }
  return restored;
}
var contains2 = (outer, inner, tolerance = 1) => inner.x1 >= outer.x1 - tolerance && inner.x2 <= outer.x2 + tolerance && inner.y1 >= outer.y1 - tolerance && inner.y2 <= outer.y2 + tolerance;
function closed(grid, hs, vs) {
  const b = grid.bbox;
  return [b.y1, b.y2].every((y) => hs.some((h) => Math.abs(h.y1 - y) <= 1 && h.x1 <= b.x1 + 1 && h.x2 >= b.x2 - 1)) && [b.x1, b.x2].every((x) => vs.some((v) => Math.abs(v.x1 - x) <= 1 && v.y1 <= b.y1 + 1 && v.y2 >= b.y2 - 1));
}
function groupFlowBoxUnits(blocks, grids, hs, vs, images) {
  const candidates = grids.filter((g) => g.bbox.y2 - g.bbox.y1 >= 30 && closed(g, hs, vs) && !grids.some((other) => other !== g && contains2(other.bbox, g.bbox, 0) && (other.bbox.x2 - other.bbox.x1) * (other.bbox.y2 - other.bbox.y1) > (g.bbox.x2 - g.bbox.x1) * (g.bbox.y2 - g.bbox.y1) + 1));
  const bands = [], visited = /* @__PURE__ */ new Set();
  for (const first of candidates) {
    if (visited.has(first)) continue;
    const row = candidates.filter((g) => Math.abs(g.bbox.y1 - first.bbox.y1) <= 1 && Math.abs(g.bbox.y2 - first.bbox.y2) <= 1).sort((a, b) => a.bbox.x1 - b.bbox.x1);
    row.forEach((g) => visited.add(g));
    if (row.length < 4 || row.filter((g) => g.rowYs.length === 2 && g.colXs.length === 2).length < 3) continue;
    const connectors = [];
    for (let i = 1; i < row.length; i++) {
      const left = row[i - 1].bbox, right = row[i].bbox, gap = right.x1 - left.x2;
      if (gap < 4 || gap > Math.min(left.x2 - left.x1, right.x2 - right.x1) * 0.6) break;
      const centerX = (left.x2 + right.x1) / 2, centerY = (left.y1 + left.y2) / 2;
      const connector = images.find((p) => {
        const w = p.x2 - p.x1, h = p.y2 - p.y1;
        return p.x1 >= left.x2 && p.x2 <= right.x1 && w >= gap * 0.4 && w <= gap * 0.9 && h >= 3 && h <= (left.y2 - left.y1) * 0.2 && w / h >= 0.8 && w / h <= 1.6 && Math.abs((p.x1 + p.x2) / 2 - centerX) <= gap * 0.15 && Math.abs((p.y1 + p.y2) / 2 - centerY) <= (left.y2 - left.y1) * 0.1;
      });
      if (!connector) break;
      connectors.push(connector);
    }
    if (connectors.length !== row.length - 1 || connectors.some((p) => Math.abs(p.x2 - p.x1 - (connectors[0].x2 - connectors[0].x1)) > (connectors[0].x2 - connectors[0].x1) * 0.2 || Math.abs(p.y2 - p.y1 - (connectors[0].y2 - connectors[0].y1)) > (connectors[0].y2 - connectors[0].y1) * 0.2)) continue;
    bands.push(row);
  }
  const members = /* @__PURE__ */ new Map();
  for (const band of bands) {
    const columns = band.map((g) => blocks.filter((b) => b.bbox && contains2(g.bbox, {
      x1: b.bbox.x,
      y1: b.bbox.y,
      x2: b.bbox.x + b.bbox.width,
      y2: b.bbox.y + b.bbox.height
    })).sort((a, b) => b.bbox.y + b.bbox.height - a.bbox.y - a.bbox.height || a.bbox.x - b.bbox.x));
    if (columns.some((column) => !column.length)) continue;
    const unit = columns.flat();
    for (const block of unit) members.set(block, unit);
  }
  const units = [], emitted = /* @__PURE__ */ new Set();
  for (const block of blocks) {
    const unit = members.get(block);
    if (!unit) units.push([block]);
    else if (!emitted.has(unit)) {
      units.push(unit);
      emitted.add(unit);
    }
  }
  return units;
}
function arrowDirection(image) {
  if (!image?.data || image.width < 16 || image.width > 128 || image.height < 16 || image.height > 128) return 0;
  const { width, height, data } = image;
  const stride = image.kind === ImageKind2.RGB_24BPP ? 3 : image.kind === ImageKind2.RGBA_32BPP ? 4 : 0;
  if (!stride || data.length < width * height * stride) return 0;
  const ink = [];
  let white = 0;
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const offset = (y * width + x) * stride;
    if (stride === 4 && data[offset + 3] < 240) return 0;
    const min = Math.min(data[offset], data[offset + 1], data[offset + 2]);
    if (min >= 235) white++;
    if (min < 230) ink.push({ x, y });
  }
  if (white < width * height * 0.55 || !ink.length) return 0;
  const x0 = Math.min(...ink.map((p) => p.x)), x1 = Math.max(...ink.map((p) => p.x));
  const y0 = Math.min(...ink.map((p) => p.y)), y1 = Math.max(...ink.map((p) => p.y));
  const w = x1 - x0 + 1, h = y1 - y0 + 1, centerY = (y0 + y1) / 2;
  if (w < width * 0.5 || h < height * 0.5 || x0 < width * 0.04 || y0 < height * 0.04 || x1 >= width * 0.96 || y1 >= height * 0.96) return 0;
  const pointsRight = (mirror) => {
    const points = ink.map((p) => ({ x: mirror ? x0 + x1 - p.x : p.x, y: p.y }));
    const tail = points.filter((p) => p.x <= x0 + w * 0.25), tip = points.filter((p) => p.x >= x1 - w * 0.1);
    if (!tail.length || !tip.length) return false;
    const span = (points2) => Math.max(...points2.map((p) => p.y)) - Math.min(...points2.map((p) => p.y)) + 1;
    if (span(tail) > h * 0.4 || span(tip) > h * 0.45 || Math.abs((Math.max(...tail.map((p) => p.y)) + Math.min(...tail.map((p) => p.y))) / 2 - centerY) > h * 0.1 || Math.abs((Math.max(...tip.map((p) => p.y)) + Math.min(...tip.map((p) => p.y))) / 2 - centerY) > h * 0.1) return false;
    let head = 0;
    for (let x = Math.ceil(x0 + w * 0.45); x <= x0 + w * 0.75; x++) {
      const column = points.filter((p) => p.x === x);
      if (column.length) head = Math.max(head, span(column));
    }
    const middle = new Set(points.filter((p) => Math.abs(p.y - centerY) <= 1).map((p) => p.x));
    return head >= h * 0.8 && middle.size >= w * 0.9;
  };
  return pointsRight(false) ? 1 : pointsRight(true) ? -1 : 0;
}
async function detectRightArrowRegions(page, fnArray, argsArray, directions = /* @__PURE__ */ new Map()) {
  const regions = [];
  const paints = smallVisibleImagePaints(fnArray, argsArray);
  for (const paint of paints) {
    const row = paints.filter((other) => other.id === paint.id && Math.abs(other.box.y1 - paint.box.y1) <= 1 && Math.abs(other.box.y2 - paint.box.y2) <= 1 && Math.abs(other.box.x2 - other.box.x1 - (paint.box.x2 - paint.box.x1)) <= 1);
    const positions = new Set(row.map((other) => Math.round(other.box.x1)));
    if (positions.size < 3) continue;
    if (!directions.has(paint.id)) directions.set(paint.id, arrowDirection(await resolveImagePixels(page, paint.id)));
    const direction = directions.get(paint.id) ?? 0;
    if (direction && (paint.mirrored ? -direction : direction) === 1) regions.push(paint.box);
  }
  return regions;
}
var BAND = 0.12;
var MAX_CHARS = 10;
var MIN_REPEAT = 3;
var RUN_GAP = 5;
var TAB_CELL_CHARS = 24;
var TAB_MIN_HEIGHT = 0.3;
var SIDE_TAB_TABLES = /* @__PURE__ */ new WeakSet();
function isSideTabTable(box, table, others, pageWidth, pageHeight) {
  if (table.cols !== 1 || box.x2 - box.x1 > pageWidth * BAND || box.y2 - box.y1 < pageHeight * TAB_MIN_HEIGHT) return false;
  const side = box.x1 >= pageWidth * (1 - BAND) ? "R" : box.x2 <= pageWidth * BAND ? "L" : null;
  if (!side) return false;
  const texts = table.cells.flat().map((c) => c.text.replace(/\s+/g, ""));
  if (!texts.some(Boolean) || texts.some((t) => [...t].length > TAB_CELL_CHARS)) return false;
  const overlap2 = others.filter((it) => it.y >= box.y1 && it.y <= box.y2);
  return overlap2.length > 0 && overlap2.every((it) => side === "R" ? it.x + it.w <= box.x1 + 1 : it.x >= box.x2 - 1);
}
function removeSideTabs(blocks, pageWidths) {
  const edges = /* @__PURE__ */ new Map();
  for (const b of blocks) {
    if (!b.bbox || b.pageNumber === void 0 || [...b.text?.trim() ?? ""].length <= MAX_CHARS) continue;
    const e = edges.get(b.pageNumber) ?? { lefts: [], rights: [] };
    e.lefts.push(b.bbox.x);
    e.rights.push(b.bbox.x + b.bbox.width);
    edges.set(b.pageNumber, e);
  }
  const q = (xs, p) => {
    const v = [...xs].sort((a, b) => a - b);
    return v[Math.min(v.length - 1, Math.floor(p * v.length))];
  };
  const body = /* @__PURE__ */ new Map();
  for (const [page, e] of edges) body.set(page, { left: q(e.lefts, 0.2), right: q(e.rights, 0.8) });
  const all = [...body.values()];
  const fallback = all.length ? { left: q(all.map((e) => e.left), 0.5), right: q(all.map((e) => e.right), 0.5) } : void 0;
  const key = (b) => {
    const w = b.pageNumber !== void 0 ? pageWidths.get(b.pageNumber) : void 0;
    const text = b.text?.trim();
    const area = (b.pageNumber !== void 0 ? body.get(b.pageNumber) : void 0) ?? fallback;
    if (b.type === "table") {
      if (!w || !b.bbox || !b.table || !SIDE_TAB_TABLES.has(b.table)) return null;
      return `${b.bbox.x >= w * (1 - BAND) ? "R" : "L"}${Math.round(b.bbox.x / 8)}`;
    }
    if (!w || !area || !b.bbox || !text || [...text].length > MAX_CHARS) return null;
    const side = b.bbox.x + b.bbox.width <= Math.min(w * BAND, area.left - 1) ? "L" : b.bbox.x >= Math.max(w * (1 - BAND), area.right + 1) ? "R" : null;
    return side && `${side}\0${text.replace(/\s+/g, "")}`;
  };
  const pages = /* @__PURE__ */ new Map();
  for (const b of blocks) {
    const k = key(b);
    if (k) pages.set(k, (pages.get(k) ?? /* @__PURE__ */ new Set()).add(b.pageNumber));
  }
  const running = /* @__PURE__ */ new Set();
  for (const [k, ps] of pages) {
    const list = [...ps].sort((a, b) => a - b);
    const steps = list.slice(1).map((p, i) => p - list[i]).sort((a, b) => a - b);
    const gap = Math.max(RUN_GAP, (steps[steps.length >> 1] ?? 1) * 3);
    let run = [];
    const flush = () => {
      if (run.length >= MIN_REPEAT && run.length >= (run[run.length - 1] - run[0] + 1) * 0.4) for (const p of run) running.add(`${p}\0${k}`);
      run = [];
    };
    for (const p of list) {
      if (run.length && p - run[run.length - 1] > gap) flush();
      run.push(p);
    }
    flush();
  }
  return running.size ? blocks.filter((b) => {
    const k = key(b);
    return !k || !running.has(`${b.pageNumber}\0${k}`);
  }) : blocks;
}
var TOC_BLOCKS = /* @__PURE__ */ new WeakSet();
var PAGE_LABEL = /^(?:\d{1,4}|[ivxlc]{1,7})$/i;
function romanValue(label) {
  const digits = { i: 1, v: 5, x: 10, l: 50, c: 100 };
  let total = 0;
  const chars = label.toLowerCase();
  for (let i = 0; i < chars.length; i++) {
    const value = digits[chars[i]], next = digits[chars[i + 1]] ?? 0;
    total += value < next ? -value : value;
  }
  return total;
}
function isTableOfContents(table) {
  if (table.rows < 3 || table.cols < 2) return false;
  const labels = [];
  let entries = 0;
  for (const row of table.cells) {
    const texts = row.map((cell) => cell.text.trim());
    const last = texts[texts.length - 1];
    if (!last) continue;
    if (!PAGE_LABEL.test(last)) return false;
    if (new RegExp("\\p{L}", "u").test(texts.slice(0, -1).join(""))) entries++;
    labels.push(last);
  }
  if (labels.length < 3 || entries < labels.length * 0.8) return false;
  let previous;
  for (const label of labels) {
    const roman = !/^\d/.test(label);
    const value = roman ? romanValue(label) : Number(label);
    if (previous && previous.roman === roman && value < previous.value) return false;
    if (previous && previous.roman && !roman) previous = void 0;
    previous = { roman, value };
  }
  return true;
}
function isProseTable(table) {
  let total = 0, long = 0, rows = 0, longRows = 0;
  for (const row of table.cells) {
    const lengths = row.map((cell) => cell.text.replace(/\s+/g, " ").trim().length);
    if (lengths.some(Boolean)) rows++;
    if (lengths.some((length) => length >= 80)) longRows++;
    for (const length of lengths) {
      total += length;
      if (length >= 80) long += length;
    }
  }
  if (!(long > 0 && long >= total * 0.5 && longRows >= rows * 0.4)) return false;
  for (let c = 0; c < table.cols; c++) {
    const filled = table.cells.map((row) => row[c]).filter((cell) => cell && cell.colSpan < table.cols && cell.text.trim()).map((cell) => cell.text.trim());
    if (filled.length >= 3 && filled.length >= rows * 0.6 && filled.every((text) => text.length <= 30 && (text.match(new RegExp("\\p{L}", "gu"))?.length ?? 0) >= 2)) return false;
  }
  return true;
}
function tocBlock(table, pageNum, bbox, style) {
  const text = table.cells.map((row) => row.map((cell) => cell.text.replace(/\s+/g, " ").trim()).filter(Boolean).join(" ")).filter(Boolean).join("\n");
  const block = { type: "paragraph", text, pageNumber: pageNum, bbox, ...style ? { style } : {} };
  TOC_BLOCKS.add(block);
  return block;
}
var NUMERIC_CELL = /^[\s\d.,%()+\-–−$€£¥]*\d[\s\d.,%()+\-–−$€£¥]*$/;
function hasValueAxis(values) {
  for (let start = 0; start + 3 < values.length; start++) {
    const step = values[start] - values[start + 1];
    if (step <= 0) continue;
    let run = 2;
    while (start + run < values.length && Math.abs(values[start + run - 1] - values[start + run] - step) <= step * 1e-6) run++;
    if (run >= 4) return true;
  }
  return false;
}
function isChartTable(table) {
  const texts = table.cells.flat().map((cell) => cell.text.trim()).filter(Boolean);
  if (table.rows < 3 || texts.length === 0) return false;
  const numeric = texts.filter((text) => NUMERIC_CELL.test(text)).length;
  if (numeric < texts.length * 0.5) return false;
  for (let c = 0; c < table.cols; c++) {
    const ticks = table.cells.flatMap((row) => (row[c]?.text ?? "").split(/\s+/)).filter((token) => /^-?[\d,]+(?:\.\d+)?%?$/.test(token)).map((token) => Number(token.replace(/[,%]/g, "")));
    if (hasValueAxis(ticks)) return true;
  }
  const values = texts.filter((text) => text.split(/\s+/).every((token) => /^[-−–]?[\d,]*\.?\d+%?$/.test(token))).length;
  const cells = table.rows * table.cols;
  return cells - texts.length >= cells * 0.55 && values >= texts.length * 0.8;
}
function isFormulaTable(table) {
  const texts = table.cells.flat().map((cell) => cell.text.trim()).filter(Boolean);
  if (texts.length < 3 || table.rows > 8 || !texts.some((text) => /=/.test(text))) return false;
  const math = texts.filter((text) => /^[a-z]{1,2}$/.test(text) || /[=∂∑∫∣Γ∇√∞]/.test(text)).length;
  return math >= texts.length * 0.6;
}
function isExamLayoutTable(table) {
  const texts = table.cells.flat().map((cell) => cell.text.trim()).filter(Boolean);
  if (texts.length < 3 || !texts.some((text) => /[①-⑤]|문\d+）/.test(text))) return false;
  const layout = texts.filter((text) => /\$|[①-⑤]|문\d+）/.test(text) || !/[\p{L}\p{N}]/u.test(text)).length;
  return layout >= texts.length * 0.6;
}
var Y_TOL = 3;
var COL_CLUSTER_TOL = 15;
var MIN_ROWS = 3;
var MIN_COLS = 2;
var MIN_GAP_FACTOR = 2;
var MIN_GAP_ABSOLUTE = 20;
var MIN_COL_FILL_RATIO = 0.4;
function detectClusterTables(items, pageNum, rejected) {
  const tab = sideTabGlyphs(items);
  if (tab.size) items = items.filter((i) => !tab.has(i));
  if (items.length < MIN_ROWS * MIN_COLS) return [];
  const { merged, originMap } = mergeEvenSpacedClusters(items);
  const rows = mergeOverlappingRows(groupByBaseline(merged));
  if (rows.length < MIN_ROWS) {
    const compact = detectCompactStatisticalTables(rows, pageNum);
    for (const table of compact) expandUsedItems(table.usedItems, originMap);
    return compact;
  }
  const results = [];
  const headerResult = detectHeaderRow(rows);
  if (headerResult) {
    const { columns, headerIdx } = headerResult;
    const headerRow = rows[headerIdx];
    const headerItems = [...headerRow.items].sort((a, b) => a.x - b.x);
    const headerAndBelow = rows.slice(headerIdx);
    const mergedRows = mergeMultiLineRows(headerAndBelow, columns);
    const tableRegions = findTableRegionsByHeader(mergedRows, columns, headerItems);
    for (const region of tableRegions) {
      const table = buildClusterTable(region.rows, columns, pageNum);
      if (table) {
        expandUsedItems(table.usedItems, originMap);
        results.push(table);
      }
    }
  }
  if (results.length === 0) {
    const suspiciousRows = rows.filter((row) => hasSuspiciousGaps(row));
    if (suspiciousRows.length >= MIN_ROWS) {
      const columns = extractColumnClusters(suspiciousRows);
      if (columns.length >= MIN_COLS) {
        const tableRegions = findTableRegions(rows, columns);
        for (const region of tableRegions) {
          const own = extractColumnClusters(region.rows.filter((row) => hasSuspiciousGaps(row)));
          const ownTable = own.length >= MIN_COLS && own.length < columns.length ? buildClusterTable(mergeMultiLineRows(region.rows, own), own, pageNum) : null;
          const table = ownTable && ownTable.table.cells.every((row, r) => row.every((cell) => (r === 0 || cell.colSpan >= ownTable.table.cols || cell.text.trim().length <= 30) && !new RegExp("\\p{Co}", "u").test(cell.text))) ? ownTable : buildClusterTable(mergeMultiLineRows(region.rows, columns), columns, pageNum);
          if (table) {
            expandUsedItems(table.usedItems, originMap);
            results.push(table);
          }
        }
      }
    }
  }
  if (results.length === 0) results.push(...detectAlignedTwoColumnTables(rows, pageNum));
  if (results.length === 0) results.push(...detectSparseTwoColumnTables(rows, pageNum));
  {
    const taken = new Set(results.flatMap((r) => [...r.usedItems]));
    const rest = results.length === 0 ? rows : rows.filter((row) => !row.items.some((i) => taken.has(i)));
    for (const table of detectCompactStatisticalTables(rest, pageNum)) {
      expandUsedItems(table.usedItems, originMap);
      results.push(table);
    }
  }
  return results.filter((r) => {
    const prose = isTwoColumnProse(r) || isProseTable(r.table);
    if (prose && rejected) rejected.prose++;
    return !prose;
  });
}
var SIDE_TAB_MIN = 6;
var SIDE_TAB_CAP_GROUPS = /* @__PURE__ */ new WeakMap();
function sideTabGlyphs(items) {
  const found = /* @__PURE__ */ new Set();
  const singles = items.filter((i) => i.fontSize > 0 && [...i.text.trim()].length === 1);
  if (singles.length < SIDE_TAB_MIN) return found;
  const cols = [];
  for (const it of [...singles].sort((a, b) => a.x - b.x)) {
    const c = cols.find((col) => Math.abs(col[0].x - it.x) <= Math.max(1.5, it.fontSize * 0.25));
    if (c) c.push(it);
    else cols.push([it]);
  }
  const cands = [];
  for (const col of cols) {
    if (col.length < 2) continue;
    if (col.filter((g) => /[\p{L}\p{N}]/u.test(g.text)).length < col.length * 0.8) continue;
    col.sort((a, b) => b.y - a.y);
    const fs = [...col.map((i) => i.fontSize)].sort((a, b) => a - b)[col.length >> 1];
    if (col.slice(1).some((it, k) => col[k].y - it.y > fs * 3)) continue;
    cands.push({ col, fs });
  }
  const bands = [];
  for (const c of cands.sort((a, b) => a.col[0].x - b.col[0].x)) {
    const last = bands[bands.length - 1];
    if (last) {
      const lastRight = Math.max(...last.col.map((i) => i.x + i.w));
      const gap = Math.min(...c.col.map((i) => i.x)) - lastRight;
      const lTop = Math.max(...last.col.map((i) => i.y)), lBot = Math.min(...last.col.map((i) => i.y));
      const cTop = c.col[0].y, cBot = c.col[c.col.length - 1].y;
      if (gap <= Math.max(last.fs, c.fs) * 1.5 && Math.min(lTop, cTop) >= Math.max(lBot, cBot)) {
        last.col.push(...c.col);
        last.fs = Math.max(last.fs, c.fs);
        last.anchored ||= c.col.length >= SIDE_TAB_MIN;
        continue;
      }
    }
    bands.push({ col: [...c.col], fs: c.fs, anchored: c.col.length >= SIDE_TAB_MIN });
  }
  for (const { col, fs, anchored } of bands) {
    if (!anchored) continue;
    col.sort((a, b) => b.y - a.y);
    const members = new Set(col);
    const top = col[0].y + fs, bottom = col[col.length - 1].y - fs;
    const others = items.filter((i) => !members.has(i) && i.text.trim() && i.y <= top && i.y >= bottom);
    if (!others.length) continue;
    const left = Math.min(...col.map((i) => i.x)), right = Math.max(...col.map((i) => i.x + i.w));
    const rest = items.filter((i) => !members.has(i) && i.text.trim());
    const cap = (i) => i.y > top && i.y - top <= fs * 3 && i.w <= fs * 3 && i.fontSize <= fs * 3 && [...i.text.trim()].length <= 3 && Math.abs(i.x + i.w / 2 - (left + right) / 2) <= fs * 0.5;
    const bodyRest = rest.filter((i) => !cap(i));
    const outside = bodyRest.every((i) => i.x >= right + fs) || bodyRest.every((i) => i.x + i.w <= left - fs);
    if (!outside) continue;
    const alone = col.filter((g) => !others.some((i) => Math.abs(i.y - g.y) <= Y_TOL)).length;
    if (alone < col.length * 0.4) continue;
    const legacyOutside = rest.every((i) => i.x >= right + fs) || rest.every((i) => i.x + i.w <= left - fs);
    const head = !legacyOutside ? rest.find(cap) : void 0;
    for (const g of col) {
      found.add(g);
      if (head) {
        const caps = SIDE_TAB_CAP_GROUPS.get(found) ?? /* @__PURE__ */ new Map();
        caps.set(g, head);
        SIDE_TAB_CAP_GROUPS.set(found, caps);
      }
    }
  }
  return found;
}
function detectCompactStatisticalTables(rows, pageNum) {
  const found = [];
  const parts = /* @__PURE__ */ new Map();
  const cellsOf = (row) => {
    const out = [];
    for (const it of [...row.items].sort((a, b) => a.x - b.x)) {
      const last = out[out.length - 1];
      if (last && it.x - (last.x + last.w) <= Math.max(0.5, it.fontSize * 0.05) && !it.hasSpaceBefore) {
        const joined = { ...last, text: last.text + it.text, w: it.x + it.w - last.x };
        parts.set(joined, [...parts.get(last) ?? [last], it]);
        out[out.length - 1] = joined;
      } else out.push(it);
    }
    return out;
  };
  for (let r = 0; r < rows.length - 1; r++) {
    const header = cellsOf(rows[r]);
    const values = cellsOf(rows[r + 1]);
    if (header.length < 4 || header.length > 12 || values.length !== header.length || /^\d+[.)]$/.test(header[0].text.trim()) && /^\d+[.)]$/.test(values[0].text.trim()) || header.some((c) => !c.text.trim() || c.text.length > 32) || values.some((c) => !c.text.trim() || c.text.length > 16) || rows[r].y - rows[r + 1].y > Math.max(25, header[0].fontSize * 3)) continue;
    const numeric = values.filter((c) => /\d/.test(c.text) && !new RegExp("\\p{L}", "u").test(c.text)).length >= Math.ceil(values.length / 2);
    const styledHeader = header.every((c) => c.fontName === header[0].fontName) && values.every((c) => c.fontName === values[0].fontName) && header[0].fontName !== values[0].fontName && values.every((c, i) => Math.abs(c.x - header[i].x) <= 2);
    if (!numeric && !styledHeader) continue;
    let aligned = true;
    for (let c = 0; c < header.length; c++) {
      const gap = c + 1 < header.length ? header[c + 1].x - header[c].x : Infinity;
      if (gap < Math.max(4, header[c].fontSize * 0.4) || Math.abs(values[c].x - header[c].x) > Math.max(14, gap * 0.3)) {
        aligned = false;
        break;
      }
    }
    if (!aligned) continue;
    const all = [...header, ...values];
    const minX = Math.min(...all.map((c) => c.x)), minY = Math.min(...all.map((c) => c.y));
    const maxX = Math.max(...all.map((c) => c.x + c.w));
    const maxY = Math.max(...all.map((c) => c.y + (c.h || c.fontSize)));
    found.push({
      table: { rows: 2, cols: header.length, hasHeader: true, cells: [header, values].map((row) => row.map((c) => ({ text: c.text, colSpan: 1, rowSpan: 1 }))) },
      bbox: { page: pageNum, x: minX, y: minY, width: maxX - minX, height: maxY - minY },
      usedItems: new Set(all.flatMap((c) => parts.get(c) ?? [c]))
    });
    r++;
  }
  return found;
}
function detectAlignedTwoColumnTables(rows, pageNum) {
  const found = [];
  let i = 0;
  while (i < rows.length - 2) {
    const first = [...rows[i].items].sort((a, b) => a.x - b.x);
    if (first.length !== 2 || first.some((c) => !c.text.trim() || c.text.length > 48) || first[1].x - first[0].x < 45 || first[1].x - first[0].x > 260 || /[.!?]$/.test(first[0].text)) {
      i++;
      continue;
    }
    const body = [];
    let j = i;
    for (; j < rows.length; j++) {
      const cells2 = [...rows[j].items].sort((a, b) => a.x - b.x);
      const previous = body.at(-1);
      if (cells2.length !== 2 || cells2.some((c) => !c.text.trim() || c.text.length > 48) || Math.abs(cells2[0].x - first[0].x) > 5 || Math.abs(cells2[1].x - first[1].x) > 5 || previous && previous.y - rows[j].y > Math.max(24, first[0].fontSize * 2.8)) break;
      body.push(rows[j]);
    }
    if (body.length < 3) {
      i++;
      continue;
    }
    const top = rows[i - 1];
    const title = top?.items.length === 1 && Math.abs(top.items[0].x - first[0].x) <= 5 && top.items[0].text.length <= 65 && top.y - first[0].y <= Math.max(24, first[0].fontSize * 2.8) ? top : void 0;
    const tableRows = title ? [title, ...body] : body;
    const cells = tableRows.map((row, idx) => {
      if (title && idx === 0) return [{ text: row.items[0].text, colSpan: 2, rowSpan: 1 }, { text: "", colSpan: 1, rowSpan: 1 }];
      const [left, right] = [...row.items].sort((a, b) => a.x - b.x);
      return [{ text: left.text, colSpan: 1, rowSpan: 1 }, { text: right.text, colSpan: 1, rowSpan: 1 }];
    });
    const usedItems = new Set(tableRows.flatMap((row) => row.items));
    const all = [...usedItems];
    const minX = Math.min(...all.map((c) => c.x)), minY = Math.min(...all.map((c) => c.y));
    const maxX = Math.max(...all.map((c) => c.x + c.w));
    const maxY = Math.max(...all.map((c) => c.y + (c.h || c.fontSize)));
    found.push({
      table: { rows: cells.length, cols: 2, cells, hasHeader: Boolean(title) },
      bbox: { page: pageNum, x: minX, y: minY, width: maxX - minX, height: maxY - minY },
      usedItems
    });
    i = j;
  }
  return found;
}
function detectSparseTwoColumnTables(rows, pageNum) {
  const found = [];
  for (let i = 0; i < rows.length - 3; i++) {
    const header = [...rows[i].items].sort((a, b) => a.x - b.x);
    if (header.length !== 2 || header.some((c) => !/[A-Za-z가-힣]/.test(c.text) || c.text.length > 80) || header[1].x - (header[0].x + header[0].w) < 5 || /[.!?]$/.test(header[0].text)) continue;
    const data = [];
    for (let j = i + 1; j < rows.length; j++) {
      const row = rows[j];
      const cell = row.items[0];
      if (row.items.length !== 1 || cell.text.length > 20 || !cell.text.trim() || Math.abs(cell.x - header[0].x) > 4 || rows[j - 1].y - row.y > Math.max(24, cell.fontSize * 2.8)) break;
      data.push(row);
    }
    if (data.length < 3) continue;
    const tableRows = [rows[i], ...data];
    const cells = [header.map((c) => ({ text: c.text, colSpan: 1, rowSpan: 1 }))];
    for (const row of data) cells.push([{ text: row.items[0].text, colSpan: 1, rowSpan: 1 }, { text: "", colSpan: 1, rowSpan: 1 }]);
    const usedItems = new Set(tableRows.flatMap((row) => row.items));
    const all = [...usedItems];
    const minX = Math.min(...all.map((c) => c.x)), minY = Math.min(...all.map((c) => c.y));
    const maxX = Math.max(...all.map((c) => c.x + c.w));
    const maxY = Math.max(...all.map((c) => c.y + (c.h || c.fontSize)));
    found.push({
      table: { rows: cells.length, cols: 2, cells, hasHeader: true },
      bbox: { page: pageNum, x: minX, y: minY, width: maxX - minX, height: maxY - minY },
      usedItems
    });
    i += data.length;
  }
  return found;
}
function isTwoColumnProse(r) {
  const t = r.table;
  if (t.rows < 8) return false;
  const dense = [];
  for (let c = 0; c < t.cols; c++) {
    const filled = t.cells.filter((row) => row[c]?.text.trim()).length;
    if (filled / t.rows >= 0.3) dense.push(c);
  }
  if (dense.length !== 2) return false;
  for (const c of dense) {
    const lens = t.cells.map((row) => row[c]?.text.replace(/\s+/g, "").length ?? 0).filter((n) => n > 0);
    const avg = lens.reduce((s, v) => s + v, 0) / (lens.length || 1);
    if (avg < 12) return false;
  }
  return findTwoColumnProseCutX([...r.usedItems]) !== null;
}
function findTwoColumnProseCutX(items) {
  const lines = groupByBaseline(items);
  if (lines.length < 8) return null;
  let minX = Infinity;
  let maxX = -Infinity;
  for (const i of items) {
    if (i.x < minX) minX = i.x;
    if (i.x + i.w > maxX) maxX = i.x + i.w;
  }
  if (!Number.isFinite(maxX - minX)) return null;
  if (maxX - minX < 100) return null;
  const lo = minX + (maxX - minX) * 0.3;
  const hi = minX + (maxX - minX) * 0.7;
  const step = Math.max(2, (hi - lo) / 400);
  let cutX = 0;
  let bestCover = Infinity;
  for (let x = lo; x <= hi; x += step) {
    let cover = 0;
    for (const line of lines) {
      if (line.items.some((i) => i.x < x && i.x + i.w > x)) cover++;
    }
    if (cover < bestCover) {
      bestCover = cover;
      cutX = x;
    }
  }
  if (bestCover / lines.length > 0.15) return null;
  const left = [];
  const right = [];
  let twoSide = 0;
  for (const line of lines) {
    const L = [], R = [];
    for (const i of line.items) {
      if (i.x + i.w <= cutX) L.push(i);
      else if (i.x >= cutX) R.push(i);
    }
    if (L.length && R.length) {
      twoSide++;
      left.push(...L);
      right.push(...R);
    }
  }
  if (twoSide / lines.length < 0.55) return null;
  if (left.length < 5 || right.length < 5) return null;
  const allText = items.map((i) => i.text).join("").replace(/\s+/g, "");
  const digits = (allText.match(/[\d,.%△—-]/g) || []).length;
  if (allText.length === 0 || digits / allText.length > 0.15) return null;
  const stats = [left, right].map((side) => {
    let sMinX = Infinity;
    let sMaxR = -Infinity;
    let fsSum = 0;
    const rowEnds = /* @__PURE__ */ new Map();
    const rowLens = /* @__PURE__ */ new Map();
    const rowFirst = /* @__PURE__ */ new Map();
    for (const i of side) {
      if (i.x < sMinX) sMinX = i.x;
      const rgt = i.x + i.w;
      if (rgt > sMaxR) sMaxR = rgt;
      fsSum += i.fontSize;
      const key = Math.round(i.y / 4);
      rowEnds.set(key, Math.max(rowEnds.get(key) ?? -Infinity, rgt));
      rowLens.set(key, (rowLens.get(key) ?? 0) + i.text.replace(/\s+/g, "").length);
      const f = rowFirst.get(key);
      if (!f || i.x < f.x) rowFirst.set(key, i);
    }
    const ends = [...rowEnds.values()].sort((a, b) => a - b);
    const p85 = ends[Math.floor(ends.length * 0.85)] ?? sMaxR;
    const fs = fsSum / side.length;
    const justified = ends.filter((e) => Math.abs(e - p85) <= fs).length / ends.length;
    const lens = [...rowLens.values()];
    const avgLen = lens.reduce((s, v) => s + v, 0) / (lens.length || 1);
    const markers = [...rowFirst.values()].filter((i) => /^[•▪◦‣∙·\-–—□■◇◆▶※*]/.test(i.text)).length;
    return { width: sMaxR - sMinX, justified, avgLen, markerRatio: markers / (rowFirst.size || 1) };
  });
  if (stats.some((s) => s.avgLen < 12)) return null;
  if (stats.some((s) => s.markerRatio > 0.1)) return null;
  const widthSym = Math.min(stats[0].width, stats[1].width) / Math.max(stats[0].width, stats[1].width);
  if (widthSym < 0.6) return null;
  if (Math.min(stats[0].justified, stats[1].justified) < 0.55) return null;
  return cutX;
}
function mergeEvenSpacedClusters(items) {
  const originMap = /* @__PURE__ */ new Map();
  const rows = groupByBaseline(items);
  const merged = [];
  for (const row of rows) {
    const sorted = [...row.items].sort((a, b) => a.x - b.x);
    let i = 0;
    while (i < sorted.length) {
      if (/^[가-힣\d]$/.test(sorted[i].text)) {
        let runEnd = i + 1;
        while (runEnd < sorted.length && /^[가-힣\d]$/.test(sorted[runEnd].text)) {
          if (sorted[runEnd].hasSpaceBefore) break;
          const gap = sorted[runEnd].x - (sorted[runEnd - 1].x + sorted[runEnd - 1].w);
          const fs = sorted[runEnd].fontSize;
          if (gap < fs * 0.1 || gap > fs * 3) break;
          runEnd++;
        }
        if (runEnd - i >= 3) {
          const gaps = [];
          for (let g = i + 1; g < runEnd; g++) {
            gaps.push(sorted[g].x - (sorted[g - 1].x + sorted[g - 1].w));
          }
          let minG = Infinity, maxG = -Infinity;
          for (const g of gaps) {
            if (g < minG) minG = g;
            if (g > maxG) maxG = g;
          }
          if (minG > 0 && maxG / minG <= 3) {
            const run = sorted.slice(i, runEnd);
            const text = run.map((r) => r.text).join("");
            const first = run[0], last = run[runEnd - i - 1];
            const item = {
              text,
              x: first.x,
              y: first.y,
              w: last.x + last.w - first.x,
              h: first.h,
              fontSize: first.fontSize,
              fontName: first.fontName
            };
            originMap.set(item, run);
            merged.push(item);
            i = runEnd;
            continue;
          }
        }
      }
      merged.push(sorted[i]);
      i++;
    }
  }
  return { merged, originMap };
}
function expandUsedItems(usedItems, originMap) {
  const toAdd = [];
  for (const item of usedItems) {
    const origins = originMap.get(item);
    if (origins) for (const o of origins) toAdd.push(o);
  }
  for (const a of toAdd) usedItems.add(a);
}
function detectHeaderRow(rows) {
  const allItems = rows.flatMap((r) => r.items);
  if (allItems.length === 0) return null;
  let allMinX = Infinity, allMaxX = -Infinity;
  for (const i of allItems) {
    if (i.x < allMinX) allMinX = i.x;
    const r = i.x + i.w;
    if (r > allMaxX) allMaxX = r;
  }
  const pageSpan = allMaxX - allMinX;
  if (pageSpan <= 0) return null;
  for (let ri = 0; ri < rows.length; ri++) {
    const row = rows[ri];
    if (row.items.length < MIN_COLS || row.items.length > 6) continue;
    if (row.items.some((i) => i.text.length > 8)) continue;
    if (!row.items.some((i) => /[가-힣]/.test(i.text))) continue;
    if (row.items.some((i) => /^[□■○●·※▶▷◆◇\-]/.test(i.text))) continue;
    const sorted = [...row.items].sort((a, b) => a.x - b.x);
    const xSpan = sorted[sorted.length - 1].x + sorted[sorted.length - 1].w - sorted[0].x;
    if (xSpan / pageSpan < 0.4) continue;
    const avgFs = sorted.reduce((s, i) => s + i.fontSize, 0) / sorted.length;
    let hasLargeGap = false;
    for (let i = 1; i < sorted.length; i++) {
      const gap = sorted[i].x - (sorted[i - 1].x + sorted[i - 1].w);
      if (gap >= avgFs * 2.5) {
        hasLargeGap = true;
        break;
      }
    }
    if (!hasLargeGap) continue;
    const columns = sorted.map((item) => ({ x: item.x, count: 0 }));
    let matchCount = 0;
    for (let j = ri + 1; j < rows.length && matchCount < MIN_ROWS + 2; j++) {
      const matched = countMatchedColumnsRange(rows[j], columns, sorted);
      if (matched >= MIN_COLS) matchCount++;
    }
    if (matchCount < MIN_ROWS) continue;
    return { columns, headerIdx: ri };
  }
  return null;
}
function mergeOverlappingRows(rows) {
  if (rows.length <= 1) return rows;
  const result = [rows[0]];
  for (let i = 1; i < rows.length; i++) {
    const prev = result[result.length - 1];
    const curr = rows[i];
    const a = rowBand(prev);
    const b = rowBand(curr);
    const overlap2 = Math.min(a.top, b.top) - Math.max(a.bottom, b.bottom);
    const prevIsFrag = isFragmentRow(prev) && a.height <= b.height * 0.8 && overlap2 >= a.height * 0.5;
    const currIsFrag = isFragmentRow(curr) && b.height <= a.height * 0.8 && overlap2 >= b.height * 0.5;
    if (prevIsFrag || currIsFrag) {
      const baseY = prevIsFrag ? curr.y : prev.y;
      result[result.length - 1] = { y: baseY, items: [...prev.items, ...curr.items] };
    } else {
      result.push(curr);
    }
  }
  return result;
}
function isFragmentRow(row) {
  return row.items.length <= 3 && row.items.every((i) => i.text.length <= 8);
}
function rowBand(row) {
  let bottom = Infinity, top = -Infinity;
  for (const i of row.items) {
    const h = i.h > 0 ? i.h : i.fontSize;
    if (i.y < bottom) bottom = i.y;
    if (i.y + h > top) top = i.y + h;
  }
  return { bottom, top, height: top - bottom };
}
function mergeMultiLineRows(rows, columns) {
  if (rows.length <= 1) return rows;
  const result = [rows[0]];
  const allFontSizes = rows.flatMap((r) => r.items).map((i) => i.fontSize);
  const avgFontSize = allFontSizes.length > 0 ? allFontSizes.reduce((s, v) => s + v, 0) / allFontSizes.length : 12;
  for (let i = 1; i < rows.length; i++) {
    const prev = result[result.length - 1];
    const curr = rows[i];
    const yGap = Math.abs(prev.y - curr.y);
    const matchedCols = countMatchedColumns(curr, columns);
    if (yGap < avgFontSize * 1.8 && curr.items.length <= 2 && (matchedCols < MIN_COLS || curr.items.length === 1)) {
      result[result.length - 1] = {
        y: prev.y,
        items: [...prev.items, ...curr.items]
      };
    } else {
      result.push(curr);
    }
  }
  return result;
}
function groupByBaseline(items) {
  if (items.length === 0) return [];
  const sorted = [...items].sort((a, b) => b.y - a.y || a.x - b.x);
  const rows = [];
  let curItems = [sorted[0]];
  let curY = sorted[0].y;
  for (let i = 1; i < sorted.length; i++) {
    if (Math.abs(sorted[i].y - curY) <= Y_TOL) {
      curItems.push(sorted[i]);
    } else {
      rows.push({ y: curY, items: curItems });
      curItems = [sorted[i]];
      curY = sorted[i].y;
    }
  }
  if (curItems.length > 0) rows.push({ y: curY, items: curItems });
  return rows;
}
function hasSuspiciousGaps(row) {
  if (row.items.length < 2) return false;
  const sorted = [...row.items].sort((a, b) => a.x - b.x);
  if (sorted.length === 2 && sorted[1].text.length > 20) return false;
  const avgFontSize = sorted.reduce((s, i) => s + i.fontSize, 0) / sorted.length;
  const minGap = Math.max(avgFontSize * MIN_GAP_FACTOR, MIN_GAP_ABSOLUTE);
  for (let i = 1; i < sorted.length; i++) {
    const gap = sorted[i].x - (sorted[i - 1].x + sorted[i - 1].w);
    if (gap >= minGap) return true;
  }
  return false;
}
function extractColumnClusters(rows) {
  const allX = [];
  for (const row of rows) {
    for (const item of row.items) allX.push(item.x);
  }
  if (allX.length === 0) return [];
  allX.sort((a, b) => a - b);
  const clusters = [];
  let clusterStart = 0;
  for (let i = 1; i <= allX.length; i++) {
    if (i === allX.length || allX[i] - allX[i - 1] > COL_CLUSTER_TOL) {
      const slice = allX.slice(clusterStart, i);
      const avg = Math.round(slice.reduce((s, v) => s + v, 0) / slice.length);
      clusters.push({ x: avg, count: slice.length });
      clusterStart = i;
    }
  }
  const minCount = Math.max(2, Math.floor(rows.length * MIN_COL_FILL_RATIO));
  return clusters.filter((c) => c.count >= minCount).sort((a, b) => a.x - b.x);
}
function findTableRegionsByHeader(allRows, columns, headerItems) {
  const regions = [];
  let currentRegion = [];
  let missStreak = 0;
  for (const row of allRows) {
    const matchedCols = countMatchedColumnsRange(row, columns, headerItems);
    if (matchedCols >= MIN_COLS) {
      currentRegion.push(row);
      missStreak = 0;
    } else if (currentRegion.length > 0 && (row.items.length <= 2 || missStreak === 0) && !isProseLine(row, columns)) {
      currentRegion.push(row);
      missStreak++;
    } else {
      while (currentRegion.length > 0) {
        const last = currentRegion[currentRegion.length - 1];
        if (countMatchedColumnsRange(last, columns, headerItems) >= MIN_COLS) break;
        currentRegion.pop();
      }
      if (currentRegion.length >= MIN_ROWS) {
        regions.push({ rows: [...currentRegion] });
      }
      currentRegion = [];
      missStreak = 0;
    }
  }
  while (currentRegion.length > 0) {
    const last = currentRegion[currentRegion.length - 1];
    if (countMatchedColumnsRange(last, columns, headerItems) >= MIN_COLS) break;
    currentRegion.pop();
  }
  if (currentRegion.length >= MIN_ROWS) {
    regions.push({ rows: currentRegion });
  }
  return regions;
}
function isProseLine(row, columns) {
  const text = row.items.map((item) => item.text).join(" ").trim();
  if (text.length < 40) return false;
  const words = text.split(/\s+/);
  const sentence = /[.!?:]$|다\.?$/.test(text) || words.filter((word) => /^[a-z]/.test(word)).length >= words.length * 0.5;
  if (!sentence) return false;
  const left = Math.min(...row.items.map((item) => item.x));
  const right = Math.max(...row.items.map((item) => item.x + item.w));
  return columns.filter((col) => col.x > left + COL_CLUSTER_TOL && col.x < right - COL_CLUSTER_TOL).length >= 2;
}
function findTableRegions(allRows, columns) {
  const regions = [];
  let currentRegion = [];
  for (const row of allRows) {
    const matchedCols = countMatchedColumns(row, columns);
    if (matchedCols >= MIN_COLS) {
      currentRegion.push(row);
    } else if (row.items.length === 1 && !isProseLine(row, columns)) {
      if (currentRegion.length > 0) {
        currentRegion.push(row);
      }
    } else {
      if (currentRegion.length >= MIN_ROWS) {
        regions.push({ rows: [...currentRegion] });
      }
      currentRegion = [];
    }
  }
  if (currentRegion.length >= MIN_ROWS) {
    regions.push({ rows: currentRegion });
  }
  return regions;
}
function countMatchedColumns(row, columns) {
  const matched = /* @__PURE__ */ new Set();
  for (const item of row.items) {
    for (let ci = 0; ci < columns.length; ci++) {
      if (Math.abs(item.x - columns[ci].x) <= COL_CLUSTER_TOL * 2) {
        matched.add(ci);
        break;
      }
    }
  }
  return matched.size;
}
function countMatchedColumnsRange(row, columns, headerItems) {
  const boundaries = [];
  for (let ci = 0; ci < headerItems.length; ci++) {
    const left = ci === 0 ? 0 : (headerItems[ci - 1].x + headerItems[ci - 1].w + headerItems[ci].x) / 2;
    const right = ci === headerItems.length - 1 ? Infinity : (headerItems[ci].x + headerItems[ci].w + headerItems[ci + 1].x) / 2;
    boundaries.push({ left, right });
  }
  const matched = /* @__PURE__ */ new Set();
  for (const item of row.items) {
    for (let ci = 0; ci < boundaries.length; ci++) {
      if (item.x >= boundaries[ci].left && item.x < boundaries[ci].right) {
        matched.add(ci);
        break;
      }
    }
  }
  return matched.size;
}
function assignRowItems(items, columns, numCols, headerFace) {
  if (items.length === 0) return [];
  const sorted = [...items].sort((a, b) => a.x - b.x);
  const runs = [];
  for (const it of sorted) {
    const last = runs[runs.length - 1];
    const prev = last?.[last.length - 1];
    if (prev && it.x - (prev.x + prev.w) <= Math.max(0.5, it.fontSize * 0.05) && !it.hasSpaceBefore) last.push(it);
    else runs.push([it]);
  }
  const tight = runs.slice(1).some((run, k) => run[0].x - Math.max(...runs[k].map((i) => i.x + i.w)) < 12);
  const shortRuns = runs.every((run) => run.reduce((n, i) => n + i.text.length, 0) <= 30);
  if (headerFace && sorted.every((i) => i.fontName === headerFace) && runs.length >= 2 && tight && shortRuns) {
    const anchor = runs.map((run) => columns.findIndex((c) => Math.abs(c.x - run[0].x) <= 2));
    if (anchor.every((ci) => ci >= 0) && new Set(anchor).size === runs.length) return runs.map((run, k) => ({ col: anchor[k], items: run }));
  }
  const colCenters = columns.map((c) => c.x);
  const gaps = [];
  for (let i = 1; i < sorted.length; i++) {
    gaps.push({ idx: i, size: sorted[i].x - (sorted[i - 1].x + sorted[i - 1].w) });
  }
  const gapSizes = gaps.map((g) => g.size).sort((a, b) => a - b);
  const medianGap = gapSizes.length > 0 ? gapSizes[Math.floor(gapSizes.length / 2)] : 0;
  const gapThreshold = sorted.length <= numCols + 1 ? 12 : Math.max(medianGap * 2.5, 12);
  const significantGaps = gaps.filter((g) => g.size >= gapThreshold).sort((a, b) => b.size - a.size).slice(0, numCols - 1).sort((a, b) => a.idx - b.idx);
  const groups = [];
  let start = 0;
  for (const gap of significantGaps) {
    groups.push(sorted.slice(start, gap.idx));
    start = gap.idx;
  }
  groups.push(sorted.slice(start));
  const result = [];
  const usedCols = /* @__PURE__ */ new Set();
  const groupCenters = groups.map((g) => {
    let minX = Infinity, maxX = -Infinity;
    for (const i of g) {
      if (i.x < minX) minX = i.x;
      const r = i.x + i.w;
      if (r > maxX) maxX = r;
    }
    return (minX + maxX) / 2;
  });
  const assignments = [];
  for (let gi = 0; gi < groups.length; gi++) {
    for (let ci = 0; ci < numCols; ci++) {
      assignments.push({ gi, ci, dist: Math.abs(groupCenters[gi] - colCenters[ci]) });
    }
  }
  assignments.sort((a, b) => a.dist - b.dist);
  const assignedGroups = /* @__PURE__ */ new Set();
  for (const { gi, ci } of assignments) {
    if (assignedGroups.has(gi) || usedCols.has(ci)) continue;
    result.push({ col: ci, items: groups[gi] });
    assignedGroups.add(gi);
    usedCols.add(ci);
  }
  for (let gi = 0; gi < groups.length; gi++) {
    if (assignedGroups.has(gi)) continue;
    let bestCol = 0, bestDist = Infinity;
    for (let ci = 0; ci < numCols; ci++) {
      const d = Math.abs(groupCenters[gi] - colCenters[ci]);
      if (d < bestDist) {
        bestDist = d;
        bestCol = ci;
      }
    }
    result.push({ col: bestCol, items: groups[gi] });
  }
  return result;
}
function buildClusterTable(rows, columns, pageNum) {
  const numCols = columns.length;
  const numRows = rows.length;
  if (numRows < MIN_ROWS || numCols < MIN_COLS) return null;
  const cells = Array.from(
    { length: numRows },
    () => Array.from({ length: numCols }, () => ({ text: "", colSpan: 1, rowSpan: 1 }))
  );
  const usedItems = /* @__PURE__ */ new Set();
  const headFaces = new Set(rows[0]?.items.map((i) => i.fontName));
  const headerFace = headFaces.size === 1 && rows.slice(1).every((row) => row.items.every((i) => !headFaces.has(i.fontName))) ? [...headFaces][0] : void 0;
  for (let r = 0; r < numRows; r++) {
    const row = rows[r];
    if (row.items.length === 1 && numCols > 1) {
      cells[r][0] = { text: row.items[0].text, colSpan: numCols, rowSpan: 1 };
      usedItems.add(row.items[0]);
      continue;
    }
    const assignments = assignRowItems(row.items, columns, numCols, r === 0 ? headerFace : void 0);
    for (const { col, items } of assignments) {
      const text = joinCellItems(items);
      const existing = cells[r][col].text;
      cells[r][col].text = existing ? existing + " " + text : text;
      for (const item of items) usedItems.add(item);
    }
  }
  let emptyRows = 0;
  for (const row of cells) {
    if (row.every((c) => c.text === "")) emptyRows++;
  }
  if (emptyRows > numRows * 0.5) return null;
  for (let c = 0; c < numCols; c++) {
    const hasValue = cells.some((row) => row[c].text !== "");
    if (!hasValue) return null;
  }
  for (let r = numRows - 1; r >= 1; r--) {
    const nonEmptyCols = cells[r].filter((c) => c.text.trim()).length;
    if (nonEmptyCols !== 1) continue;
    if (cells[r][0].text.trim() !== "") continue;
    const contentText = cells[r].find((c) => c.text.trim())?.text.trim() || "";
    if (/^[○●▶\-·]/.test(contentText)) continue;
    for (let pr = r - 1; pr >= 0; pr--) {
      if (cells[pr].some((c) => c.text.trim())) {
        if (cells[pr][0].colSpan > 1) break;
        for (let c = 0; c < numCols; c++) {
          const prev = cells[pr][c].text.trim();
          const curr = cells[r][c].text.trim();
          if (curr) cells[pr][c].text = prev ? prev + " " + curr : curr;
        }
        for (let c = 0; c < numCols; c++) cells[r][c].text = "";
        break;
      }
    }
  }
  for (let r = 0; r < cells.length - 1; r++) {
    const row = cells[r];
    const hasCol0 = row[0].text.trim() !== "";
    const hasColLast = numCols > 1 && row[numCols - 1].text.trim() !== "";
    const midEmpty = row.slice(1, numCols - 1).every((c) => c.text.trim() === "");
    if (hasCol0 && hasColLast && midEmpty) {
      const next = cells[r + 1];
      if (next[0].text.trim() === "" && next.some((c) => c.text.trim())) {
        for (let c = 1; c < numCols; c++) {
          const curr = next[c].text.trim();
          if (curr) row[c].text = row[c].text.trim() ? row[c].text.trim() + " " + curr : curr;
        }
        for (let c = 0; c < numCols; c++) next[c].text = "";
      }
    }
  }
  const filteredCells = cells.filter((row) => row.some((c) => c.text.trim()));
  const finalRowCount = filteredCells.length;
  if (finalRowCount < MIN_ROWS) return null;
  const irTable = {
    rows: finalRowCount,
    cols: numCols,
    cells: filteredCells,
    hasHeader: finalRowCount > 1
  };
  const allItems = rows.flatMap((r) => r.items);
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const i of allItems) {
    if (i.x < minX) minX = i.x;
    if (i.y < minY) minY = i.y;
    if (i.x + i.w > maxX) maxX = i.x + i.w;
    const h = i.h > 0 ? i.h : i.fontSize;
    if (i.y + h > maxY) maxY = i.y + h;
  }
  return {
    table: irTable,
    bbox: { page: pageNum, x: minX, y: minY, width: maxX - minX, height: maxY - minY },
    usedItems
  };
}
function joinCellItems(items) {
  const hOf = (i) => i.h > 0 ? i.h : i.fontSize;
  const lines = [];
  for (const it of [...items].sort((a, b) => b.y - a.y || a.x - b.x)) {
    const bottom = it.y, top = it.y + hOf(it);
    const line = lines.find((l) => Math.min(l.top, top) - Math.max(l.bottom, bottom) >= Math.min(l.top - l.bottom, top - bottom) * 0.5);
    if (line) {
      line.items.push(it);
      line.bottom = Math.min(line.bottom, bottom);
      line.top = Math.max(line.top, top);
    } else lines.push({ bottom, top, items: [it] });
  }
  return lines.sort((a, b) => b.top - a.top).map(({ items: line }) => {
    line.sort((a, b) => a.x - b.x);
    let s = line[0].text;
    for (let i = 1; i < line.length; i++) {
      const gap = line[i].x - (line[i - 1].x + line[i - 1].w);
      const fs = (line[i].fontSize + line[i - 1].fontSize) / 2;
      s += (!isCjkLatinAutospace(line[i - 1].text, line[i].text, gap, fs) && (line[i].hasSpaceBefore && gap >= fs * 0.05 || gap > spaceGapThreshold(fs)) ? " " : "") + line[i].text;
    }
    return s;
  }).join(" ");
}
function findRuledColumnDivider(regions, horizontals, verticals, pageWidth, pageHeight) {
  const candidates = [];
  for (const v of verticals) {
    const x = v.x1;
    if (x < pageWidth * 0.35 || x > pageWidth * 0.65 || v.y2 - v.y1 < pageHeight * 0.65) continue;
    const body = regions.filter((r) => r.w >= pageWidth * 0.15 && r.h >= 12 && r.y >= v.y1 && r.y + r.h <= v.y2);
    const left = body.filter((r) => r.x + r.w <= x - 5);
    const right = body.filter((r) => r.x >= x + 5);
    if (left.length < 2 || right.length < 2) continue;
    const bounds = (rs) => ({ bottom: Math.min(...rs.map((r) => r.y)), top: Math.max(...rs.map((r) => r.y + r.h)) });
    const a = bounds(left), b = bounds(right);
    const lo = Math.min(a.bottom, b.bottom), hi = Math.max(a.top, b.top);
    if (Math.min(a.top, b.top) - Math.max(a.bottom, b.bottom) < (hi - lo) * 0.6) continue;
    if (regions.some((r) => r.x < x && r.x + r.w > x && r.y < hi && r.y + r.h > lo)) continue;
    if (horizontals.some((h) => h.y1 > lo + 2 && h.y1 < hi - 2 && h.x1 < x - 5 && h.x2 > x + 5)) continue;
    if (!candidates.some((c) => Math.abs(c - x) < 3)) candidates.push(x);
  }
  return candidates.length === 1 ? candidates[0] : null;
}
var GUTTER_SCAN_LO = 0.3;
var GUTTER_SCAN_HI = 0.7;
var GUTTER_MAX_SAMPLES = 400;
var WIDE_RECT_RATIO = 0.55;
var GUTTER_MAX_COVER_RATIO = 0.06;
var SIDE_MIN_COUNT = 5;
var SIDE_MIN_HEIGHT_RATIO = 0.3;
var SIDE_MIN_VSPAN_RATIO = 0.45;
var SIDE_MIN_WIDTH_SYMMETRY = 0.5;
var MIN_CONTENT_SPAN = 300;
var TEXT_RECT_MAX_H = 20;
var ROW_Y_TOL = 2;
var SIDE_MIN_TEXT_ROWS = 12;
var CROSS_ROW_TINY_GAP = 12;
var MAX_TINY_GAP_ROWS = 1;
var MAX_BOTH_SIDE_ROW_RATIO = 0.65;
var BLOCK_DOMINANT_TEXT_RECTS = 10;
function detectColumnGutter(rects) {
  if (rects.length < 8) return null;
  let minX = Infinity;
  let maxX = -Infinity;
  for (const r of rects) {
    if (r.x < minX) minX = r.x;
    if (r.x + r.w > maxX) maxX = r.x + r.w;
  }
  const span = maxX - minX;
  if (!Number.isFinite(span) || span < MIN_CONTENT_SPAN) return null;
  const narrow = rects.filter((r) => r.w < span * WIDE_RECT_RATIO && r.w > 0 && r.h > 0);
  if (narrow.length < SIDE_MIN_COUNT * 2) return null;
  let totalH = 0;
  for (const r of narrow) totalH += r.h;
  if (totalH <= 0) return null;
  const lo = minX + span * GUTTER_SCAN_LO;
  const hi = minX + span * GUTTER_SCAN_HI;
  const step = Math.max(2, (hi - lo) / GUTTER_MAX_SAMPLES);
  let gutterX = 0;
  let bestCover = Infinity;
  for (let x = lo; x <= hi; x += step) {
    let cover = 0;
    for (const r of narrow) {
      if (r.x < x && r.x + r.w > x) cover += r.h;
    }
    if (cover < bestCover) {
      bestCover = cover;
      gutterX = x;
    }
  }
  if (bestCover > totalH * GUTTER_MAX_COVER_RATIO) return null;
  const left = [];
  const right = [];
  for (const r of narrow) {
    if (r.x + r.w <= gutterX) left.push(r);
    else if (r.x >= gutterX) right.push(r);
  }
  if (left.length < SIDE_MIN_COUNT || right.length < SIDE_MIN_COUNT) return null;
  const sideStats = (side) => {
    let sMinX = Infinity, sMaxR = -Infinity, sMinY = Infinity, sMaxT = -Infinity, hSum = 0;
    for (const r of side) {
      if (r.x < sMinX) sMinX = r.x;
      if (r.x + r.w > sMaxR) sMaxR = r.x + r.w;
      if (r.y < sMinY) sMinY = r.y;
      if (r.y + r.h > sMaxT) sMaxT = r.y + r.h;
      hSum += r.h;
    }
    return { width: sMaxR - sMinX, vspan: sMaxT - sMinY, minY: sMinY, maxT: sMaxT, hSum };
  };
  const L = sideStats(left);
  const R = sideStats(right);
  if (Math.min(L.hSum, R.hSum) / Math.max(L.hSum, R.hSum) < SIDE_MIN_HEIGHT_RATIO) return null;
  const unionVspan = Math.max(L.maxT, R.maxT) - Math.min(L.minY, R.minY);
  if (unionVspan <= 0) return null;
  if (L.vspan / unionVspan < SIDE_MIN_VSPAN_RATIO) return null;
  if (R.vspan / unionVspan < SIDE_MIN_VSPAN_RATIO) return null;
  if (Math.min(L.width, R.width) / Math.max(L.width, R.width) < SIDE_MIN_WIDTH_SYMMETRY) return null;
  const textRects = (side) => side.filter((r) => r.h <= TEXT_RECT_MAX_H);
  const lText = textRects(left);
  const rText = textRects(right);
  if (lText.length + rText.length >= BLOCK_DOMINANT_TEXT_RECTS) {
    const rows = /* @__PURE__ */ new Map();
    const rowKey = (y) => Math.round(y / ROW_Y_TOL);
    for (const r of lText) {
      const k = rowKey(r.y);
      const e = rows.get(k) ?? { lEnd: -Infinity, rStart: Infinity };
      if (r.x + r.w > e.lEnd) e.lEnd = r.x + r.w;
      rows.set(k, e);
    }
    const lRowCount = rows.size;
    for (const r of rText) {
      const k = rowKey(r.y);
      const e = rows.get(k) ?? { lEnd: -Infinity, rStart: Infinity };
      if (r.x < e.rStart) e.rStart = r.x;
      rows.set(k, e);
    }
    let rRowCount = 0;
    let bothRows = 0;
    let tinyGapRows = 0;
    for (const e of rows.values()) {
      if (e.rStart < Infinity) rRowCount++;
      if (e.lEnd > -Infinity && e.rStart < Infinity) {
        bothRows++;
        if (e.rStart - e.lEnd < CROSS_ROW_TINY_GAP) tinyGapRows++;
      }
    }
    if (lRowCount < SIDE_MIN_TEXT_ROWS || rRowCount < SIDE_MIN_TEXT_ROWS) return null;
    if (tinyGapRows > MAX_TINY_GAP_ROWS) return null;
    if (bothRows / Math.min(lRowCount, rRowCount) > MAX_BOTH_SIDE_ROW_RATIO) return null;
  }
  return gutterX;
}
function detectPersistentColumnGutter(rects) {
  if (rects.length < 24) return null;
  let minY = Infinity, maxY = -Infinity;
  for (const r of rects) {
    if (r.y < minY) minY = r.y;
    if (r.y > maxY) maxY = r.y;
  }
  const span = maxY - minY;
  if (!Number.isFinite(span) || span < 200) return null;
  const upper80 = detectColumnGutter(rects.filter((r) => r.y >= minY + span * 0.2));
  const upper60 = upper80 === null ? null : detectColumnGutter(rects.filter((r) => r.y >= minY + span * 0.4));
  if (upper80 !== null && upper60 !== null && Math.abs(upper80 - upper60) <= 10) return (upper80 + upper60) / 2;
  const lower80 = detectColumnGutter(rects.filter((r) => r.y <= maxY - span * 0.2));
  if (lower80 === null) return null;
  const lower60 = detectColumnGutter(rects.filter((r) => r.y <= maxY - span * 0.4));
  return lower60 !== null && Math.abs(lower80 - lower60) <= 10 ? (lower80 + lower60) / 2 : null;
}
function orderByGutter(units, rectOf, gutterX) {
  const left = [];
  const right = [];
  const cross = [];
  for (const u of units) {
    const r = rectOf(u);
    const top = r.y + r.h;
    if (r.x < gutterX && r.x + r.w > gutterX) cross.push({ u, top });
    else if (r.x + r.w <= gutterX) left.push({ u, top });
    else right.push({ u, top });
  }
  const byTopDesc = (a, b) => b.top - a.top;
  cross.sort(byTopDesc);
  left.sort(byTopDesc);
  right.sort(byTopDesc);
  const bandOf = (top) => {
    let k = 0;
    while (k < cross.length && cross[k].top > top) k++;
    return k;
  };
  const ordered = [];
  for (let k = 0; k <= cross.length; k++) {
    for (const t of left) {
      if (bandOf(t.top) === k) ordered.push(t.u);
    }
    for (const t of right) {
      if (bandOf(t.top) === k) ordered.push(t.u);
    }
    if (k < cross.length) ordered.push(cross[k].u);
  }
  return ordered;
}
function detectPanelGutters(rects) {
  if (rects.length < 9) return null;
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const r of rects) {
    if (r.x < minX) minX = r.x;
    if (r.x + r.w > maxX) maxX = r.x + r.w;
  }
  const span = maxX - minX;
  if (!Number.isFinite(span) || span < MIN_CONTENT_SPAN) return null;
  const wideLine = (r) => {
    const same = rects.filter((o) => Math.abs(o.y - r.y) <= 3).sort((a, b) => a.x - b.x);
    let start = same[0].x, end = same[0].x + same[0].w;
    for (const o of same.slice(1)) {
      if (o.x - end > Math.max(o.h, r.h) * 2) {
        if (r.x >= start && r.x + r.w <= end) break;
        start = o.x;
      }
      end = Math.max(end, o.x + o.w);
    }
    return r.x >= start && r.x + r.w <= end + 1 && end - start >= span * 0.5;
  };
  const narrow = rects.filter((r) => r.w < span * WIDE_RECT_RATIO && r.w > 0 && r.h > 0 && !wideLine(r));
  for (const r of narrow) {
    if (r.y < minY) minY = r.y;
    if (r.y + r.h > maxY) maxY = r.y + r.h;
  }
  const gutters = [];
  let runStart = null;
  const step = Math.max(2, span * 0.7 / 400);
  for (let x = minX + span * 0.15; x <= maxX - span * 0.15; x += step) {
    const empty = !narrow.some((r) => r.x < x && r.x + r.w > x);
    if (empty && runStart === null) runStart = x;
    if (!empty && runStart !== null) {
      if (x - runStart >= 8) gutters.push((runStart + x) / 2);
      runStart = null;
    }
  }
  if (gutters.length < 2) return null;
  const bounds = [-Infinity, ...gutters, Infinity];
  for (let c = 0; c + 1 < bounds.length; c++) {
    const col = narrow.filter((r) => r.x >= bounds[c] && r.x + r.w <= bounds[c + 1]);
    if (col.length < 3) return null;
    const top = Math.max(...col.map((r) => r.y + r.h)), bottom = Math.min(...col.map((r) => r.y));
    if (top - bottom < (maxY - minY) * 0.3) return null;
  }
  return gutters;
}
function orderByPanels(units, rectOf, gutters) {
  const colOf = (r) => {
    for (let c = 0; c <= gutters.length; c++) {
      const lo = c === 0 ? -Infinity : gutters[c - 1], hi = c === gutters.length ? Infinity : gutters[c];
      if (r.x >= lo - 1 && r.x + r.w <= hi + 1) return c;
    }
    return -1;
  };
  const tagged = units.map((u) => {
    const r = rectOf(u);
    return { u, top: r.y + r.h, col: colOf(r) };
  });
  const cross = tagged.filter((t) => t.col < 0).sort((a, b) => b.top - a.top);
  const bandOf = (top) => {
    let k = 0;
    while (k < cross.length && cross[k].top > top) k++;
    return k;
  };
  const ordered = [];
  for (let k = 0; k <= cross.length; k++) {
    for (let c = 0; c <= gutters.length; c++) {
      for (const t of tagged.filter((t2) => t2.col === c && bandOf(t2.top) === k).sort((a, b) => b.top - a.top)) ordered.push(t.u);
    }
    if (k < cross.length) ordered.push(cross[k].u);
  }
  return ordered;
}
function splitImagePanels(items, figures) {
  if (figures.length === 0) return null;
  const rects = items.map((i) => ({ x: i.x, y: i.y, w: i.w, h: i.h > 0 ? i.h : i.fontSize }));
  const cuts = detectPanelGutters([...rects, ...figures]);
  if (!cuts || cuts.length !== 2 || items.some((i) => cuts.some((x) => i.x < x && i.x + i.w > x))) return null;
  const groups = [
    items.filter((i) => i.x + i.w <= cuts[0]),
    items.filter((i) => i.x >= cuts[0] && i.x + i.w <= cuts[1]),
    items.filter((i) => i.x >= cuts[1])
  ];
  const rows = groupByY(items);
  const sharedRows = rows.filter((row) => new Set(row.map((i) => i.x >= cuts[1] ? 2 : i.x >= cuts[0] ? 1 : 0)).size === 3).length;
  if (sharedRows / Math.min(...groups.map((group) => groupByY(group).length)) > 0.65) return null;
  for (const row of rows) {
    const ordered = [...row].sort((a, b) => a.x - b.x);
    let start = ordered[0].x, end = start + ordered[0].w, height = ordered[0].h || ordered[0].fontSize;
    for (const i of ordered.slice(1)) {
      const h = i.h || i.fontSize;
      if (i.x - end > Math.max(height, h) * 2) start = i.x;
      end = Math.max(end, i.x + i.w);
      height = h;
      if (cuts.some((x) => start < x && end > x)) return null;
    }
  }
  return groups;
}
var FILL_EDGE_GAP = 6;
var FILL_MAX_THICKNESS = 2;
function fillBlanks(items, horizontals, verticals = []) {
  const widened = /* @__PURE__ */ new Map();
  const used = /* @__PURE__ */ new Set();
  for (const h of horizontals) {
    if (h.lineWidth > FILL_MAX_THICKNESS || Math.abs(h.y1 - h.y2) > 1) continue;
    const x1 = Math.min(h.x1, h.x2), x2 = Math.max(h.x1, h.x2);
    const row = items.filter((i) => i.y >= h.y1 && i.y - h.y1 <= Math.max(3, i.fontSize * 0.5));
    const left = row.find((i) => i.x + i.w <= x1 + 1 && x1 - (i.x + i.w) <= FILL_EDGE_GAP);
    const right = row.find((i) => i.x >= x2 - 1 && i.x - x2 <= FILL_EDGE_GAP);
    if (!left || !right || widened.has(left) || row.some((i) => i.x < x2 && i.x + i.w > x1) || x2 - x1 < 2 * left.fontSize) continue;
    if (verticals.some((v) => (Math.abs(v.x1 - x1) <= 3 || Math.abs(v.x1 - x2) <= 3) && Math.min(v.y1, v.y2) - 3 <= h.y1 && Math.max(v.y1, v.y2) + 3 >= h.y1)) continue;
    widened.set(left, { ...left, text: left.text.trimEnd() + " ", w: x2 - left.x });
    used.add(h);
  }
  if (!used.size) return { items, horizontals };
  return { items: items.map((i) => widened.get(i) ?? i), horizontals: horizontals.filter((h) => !used.has(h)) };
}
function isProseSpread(items) {
  if (items.length < 3) return false;
  const sorted = [...items].sort((a, b) => a.x - b.x);
  const gaps = [];
  for (let i = 1; i < sorted.length; i++) {
    gaps.push(sorted[i].x - (sorted[i - 1].x + sorted[i - 1].w));
  }
  const maxGap = safeMax(gaps);
  const avgLen = items.reduce((s, i) => s + i.text.length, 0) / items.length;
  if (items.length >= 4 && maxGap < 40 && avgLen < 5) return true;
  const minGap = safeMin(gaps);
  return minGap > 0 && maxGap - minGap <= Math.max(2, maxGap * 0.15) && items.filter((i) => new RegExp("^\\P{L}*\\p{Ll}", "u").test(i.text)).length * 2 >= items.length;
}
function detectColumns(yLines) {
  const allItems = yLines.flat();
  if (allItems.length === 0) return null;
  const pageWidth = safeMax(allItems.map((i) => i.x + i.w)) - safeMin(allItems.map((i) => i.x));
  if (pageWidth < 100) return null;
  let bigoLineIdx = -1;
  for (let i = 0; i < yLines.length; i++) {
    if (yLines[i].length <= 2 && yLines[i].some((item) => item.text === "\uBE44\uACE0")) {
      bigoLineIdx = i;
      break;
    }
  }
  const tableYLines = bigoLineIdx >= 0 ? yLines.slice(0, bigoLineIdx) : yLines;
  const CLUSTER_TOL = 22;
  const xClusters = [];
  for (const line of tableYLines) {
    if (isProseSpread(line)) continue;
    const byX = [...line].sort((a, b) => a.x - b.x);
    for (let k = 0; k < byX.length; k++) {
      const item = byX[k];
      if (k > 0 && item.x - (byX[k - 1].x + byX[k - 1].w) < Math.max(item.fontSize, byX[k - 1].fontSize)) continue;
      let found = false;
      for (const c of xClusters) {
        if (Math.abs(item.x - c.center) <= CLUSTER_TOL) {
          c.center = Math.round((c.center * c.count + item.x) / (c.count + 1));
          c.minX = Math.min(c.minX, item.x);
          c.count++;
          found = true;
          break;
        }
      }
      if (!found) {
        xClusters.push({ center: item.x, count: 1, minX: item.x });
      }
    }
  }
  const peaks = xClusters.filter((c) => c.count >= 3).sort((a, b) => a.minX - b.minX);
  if (peaks.length < 3) return null;
  const MERGE_TOL = 40;
  const merged = [peaks[0]];
  for (let i = 1; i < peaks.length; i++) {
    const prev = merged[merged.length - 1];
    if (peaks[i].minX - prev.minX < MERGE_TOL) {
      if (peaks[i].count > prev.count) {
        prev.center = peaks[i].center;
      }
      prev.count += peaks[i].count;
      prev.minX = Math.min(prev.minX, peaks[i].minX);
    } else {
      merged.push({ ...peaks[i] });
    }
  }
  const rawColumns = merged.filter((c) => c.count >= 3).map((c) => c.minX);
  if (rawColumns.length < 3) return null;
  const MIN_DETECT_COL_WIDTH = 30;
  const columns = [rawColumns[0]];
  for (let i = 1; i < rawColumns.length; i++) {
    if (rawColumns[i] - columns[columns.length - 1] < MIN_DETECT_COL_WIDTH) continue;
    columns.push(rawColumns[i]);
  }
  if (columns.length < 3) return null;
  const shortMultiColumnRows = tableYLines.filter((line) => {
    if (mergeLineSimple(line).length > 80 || isProseSpread(line)) return false;
    const used = new Set(line.map((item) => findColumn(item.x, columns)));
    return used.size >= 3;
  }).length;
  return shortMultiColumnRows >= 2 ? columns : null;
}
function findColumn(x, columns) {
  for (let i = columns.length - 1; i >= 0; i--) {
    if (x >= columns[i] - 10) return i;
  }
  return 0;
}
function extractWithColumns(yLines, columns) {
  const result = [];
  const colMin = columns[0];
  const colMax = columns[columns.length - 1];
  let bigoIdx = -1;
  for (let i = 0; i < yLines.length; i++) {
    if (yLines[i].length <= 2 && yLines[i].some((item) => item.text === "\uBE44\uACE0")) {
      bigoIdx = i;
      break;
    }
  }
  let tableStart = -1;
  for (let i = 0; i < (bigoIdx >= 0 ? bigoIdx : yLines.length); i++) {
    const usedCols = new Set(yLines[i].map((item) => findColumn(item.x, columns)));
    if (usedCols.size >= 3) {
      tableStart = i;
      break;
    }
  }
  const tableEnd = bigoIdx >= 0 ? bigoIdx : yLines.length;
  for (let i = 0; i < (tableStart >= 0 ? tableStart : tableEnd); i++) {
    result.push(mergeLineSimple(yLines[i]));
  }
  if (tableStart >= 0) {
    const tableLines = yLines.slice(tableStart, tableEnd);
    const gridLines = [];
    for (const line of tableLines) {
      const inRange = line.some(
        (item) => item.x >= colMin - 20 && item.x <= colMax + 200
      );
      if (inRange && !isProseSpread(line)) {
        gridLines.push(line);
      } else {
        if (gridLines.length > 0) {
          result.push(buildGridTable(gridLines.splice(0), columns));
        }
        result.push(mergeLineSimple(line));
      }
    }
    if (gridLines.length > 0) {
      result.push(buildGridTable(gridLines, columns));
    }
  }
  if (bigoIdx >= 0) {
    result.push("");
    for (let i = bigoIdx; i < yLines.length; i++) {
      result.push(mergeLineSimple(yLines[i]));
    }
  }
  return result.join("\n");
}
function buildGridTable(lines, columns) {
  const numCols = columns.length;
  const yRows = lines.map((items) => {
    const byCol = Array.from({ length: numCols }, () => []);
    for (const item of items) byCol[findColumn(item.x, columns)].push(item);
    return byCol.map((cell) => mergeLineSimple(cell));
  });
  const dataColStart = Math.max(2, Math.floor(numCols / 2));
  const merged = [];
  for (const row of yRows) {
    if (row.every((c) => c === "")) continue;
    if (merged.length === 0) {
      merged.push([...row]);
      continue;
    }
    const prev = merged[merged.length - 1];
    const filledCols = row.map((c, i) => c ? i : -1).filter((i) => i >= 0);
    const filledCount = filledCols.length;
    let isNewRow = false;
    if (row[0] && row[0].length >= 3) {
      isNewRow = true;
    }
    if (!isNewRow && numCols > 1 && row[1]) {
      isNewRow = true;
    }
    if (!isNewRow) {
      const hasData = row.slice(dataColStart).some((c) => c !== "");
      const prevHasData = prev.slice(dataColStart).some((c) => c !== "");
      if (hasData && prevHasData) {
        isNewRow = true;
      }
    }
    if (isNewRow && filledCount === 1 && row[0] && row[0].length <= 2) {
      isNewRow = false;
    }
    if (isNewRow) {
      merged.push([...row]);
    } else {
      for (let c = 0; c < numCols; c++) {
        if (row[c]) {
          prev[c] = prev[c] ? prev[c] + " " + row[c] : row[c];
        }
      }
    }
  }
  if (merged.length < 2) {
    return merged.map((r) => r.filter((c) => c).join(" ")).join("\n");
  }
  let headerEnd = 0;
  for (let r = 0; r < merged.length; r++) {
    const hasDataValues = merged[r].slice(dataColStart).some((c) => c && /\d/.test(c));
    if (hasDataValues) break;
    headerEnd = r + 1;
  }
  if (headerEnd > 1) {
    const headerRow = Array(numCols).fill("");
    for (let r = 0; r < headerEnd; r++) {
      for (let c = 0; c < numCols; c++) {
        if (merged[r][c]) {
          headerRow[c] = headerRow[c] ? headerRow[c] + " " + merged[r][c] : merged[r][c];
        }
      }
    }
    merged.splice(0, headerEnd, headerRow);
  }
  for (const row of merged) {
    for (let c = 0; c < row.length; c++) {
      if (row[c]) row[c] = collapseEvenSpacing(row[c]);
    }
  }
  const totalCells = merged.length * numCols;
  const filledCells = merged.reduce((s, row) => s + row.filter((c) => c).length, 0);
  if (filledCells < totalCells * 0.35 || merged.length < 2 || merged.length <= 3 && numCols >= 7) {
    return merged.map((r) => r.filter((c) => c).join("	")).join("\n");
  }
  const escCell = (c) => c.replace(/\t/g, " ").replace(/\|/g, "\\|");
  const md = [];
  md.push("| " + merged[0].map(escCell).join(" | ") + " |");
  md.push("| " + merged[0].map(() => "---").join(" | ") + " |");
  for (let r = 1; r < merged.length; r++) {
    md.push("| " + merged[r].map(escCell).join(" | ") + " |");
  }
  return md.join("\n");
}
var UNDER_MAX_THICKNESS = 2;
var UNDER_BELOW_EM = 0.72;
var UNDER_BELOW_MIN_PT = 3;
var UNDER_ABOVE_PT = 1;
var UNDER_MIN_OVERLAP_RATIO = 0.6;
var UNDER_OWNER_PAD_EM = 0.75;
var UNDER_OWNER_PAD_MIN_PT = 4;
var UNDER_MIN_COVERAGE = 0.6;
var UNDER_GRID_EPS = 2;
var UNDER_COLUMN_GAP_EM = 2;
var UNDER_REPEATED_SPAN_LEVELS = 3;
var UNDER_SPAN_OVERLAP_RATIO = 0.8;
var UNDER_BOX_PAIR_MIN_EM = 0.5;
var UNDER_BOX_PAIR_MAX_EM = 2.2;
var UNDER_BOX_PAIR_OVERLAP = 0.8;
function markUnderlineItems(items, horizontals, verticals, nonRules) {
  const underlines = [];
  if (nonRules?.size) horizontals = horizontals.filter((line) => !nonRules.has(line));
  if (items.length === 0 || horizontals.length === 0) return underlines;
  const tightOwners = /* @__PURE__ */ new Map();
  const tightlyOwned = (line) => {
    const cached = tightOwners.get(line);
    if (cached !== void 0) return cached;
    const owners = items.filter((item) => {
      const below = item.y - line.y1;
      return item.w > 0 && item.text.trim() && below >= 0.5 && below <= 3 && Math.min(line.x2, item.x + item.w) > Math.max(line.x1, item.x);
    }).sort((a, b) => a.x - b.x);
    let owned = owners.length > 0 && (Math.abs(owners[0].x - line.x1) <= UNDER_GRID_EPS || owners.length === 1 && line.x1 > owners[0].x && line.x1 - owners[0].x <= Math.max(owners[0].h, owners[0].fontSize, 1) * 3) && Math.abs(owners[owners.length - 1].x + owners[owners.length - 1].w - line.x2) <= UNDER_GRID_EPS;
    for (let i = 1; owned && i < owners.length; i++) {
      const em = Math.max(owners[i].h, owners[i].fontSize, 1);
      if (owners[i].x - (owners[i - 1].x + owners[i - 1].w) > em * UNDER_COLUMN_GAP_EM) owned = false;
    }
    tightOwners.set(line, owned);
    return owned;
  };
  const paragraphUnderline = (line) => {
    if (!tightlyOwned(line)) return false;
    const width = line.x2 - line.x1;
    const ys = [];
    for (const other of horizontals) {
      const overlap2 = Math.min(line.x2, other.x2) - Math.max(line.x1, other.x1);
      if (other.lineWidth > UNDER_MAX_THICKNESS || overlap2 / Math.max(width, other.x2 - other.x1) < UNDER_SPAN_OVERLAP_RATIO || !tightlyOwned(other)) continue;
      if (!ys.some((y) => Math.abs(y - other.y1) < UNDER_GRID_EPS)) ys.push(other.y1);
      if (ys.length >= UNDER_REPEATED_SPAN_LEVELS) return true;
    }
    return false;
  };
  for (const line of horizontals) {
    if (line.lineWidth > UNDER_MAX_THICKNESS) continue;
    const enclosed = insideTallCell(line, verticals, 0);
    const repeated = isRepeatedSpanRule(line, horizontals);
    const textSeries = repeated && paragraphUnderline(line);
    if (!enclosed && (touchesVertical(line, verticals) || repeated && !textSeries)) continue;
    const matches = [];
    for (const item of items) {
      const h = item.h > 0 ? item.h : item.fontSize;
      if (h <= 0 || item.w <= 0 || !item.text.trim()) continue;
      const below = Math.max(h * UNDER_BELOW_EM, UNDER_BELOW_MIN_PT);
      if (line.y1 < item.y - below || line.y1 > item.y + UNDER_ABOVE_PT) continue;
      const overlap2 = Math.min(line.x2, item.x + item.w) - Math.max(line.x1, item.x);
      if (overlap2 / item.w < UNDER_MIN_OVERLAP_RATIO) continue;
      matches.push(item);
    }
    if (matches.length === 0) continue;
    let x1 = Infinity, x2 = -Infinity, maxH = 0, covered = 0;
    for (const m of matches) {
      x1 = Math.min(x1, m.x);
      x2 = Math.max(x2, m.x + m.w);
      maxH = Math.max(maxH, m.h > 0 ? m.h : m.fontSize);
      covered += m.w;
    }
    const inset = enclosed && insideTallCell(line, verticals, maxH);
    if (enclosed && !inset && (touchesVertical(line, verticals) || repeated && !textSeries)) continue;
    const pad = Math.max(maxH * UNDER_OWNER_PAD_EM, UNDER_OWNER_PAD_MIN_PT);
    if (line.x1 < x1 - pad || line.x2 > x2 + pad) continue;
    if (covered < (line.x2 - line.x1) * UNDER_MIN_COVERAGE) continue;
    if (hasBoxTopPair(line, maxH, horizontals, inset || textSeries || tightlyOwned(line) ? items : void 0)) continue;
    matches.sort((a, b) => a.x - b.x);
    let hole = false;
    for (let i = 1; i < matches.length; i++) {
      if (matches[i].x - (matches[i - 1].x + matches[i - 1].w) > maxH * UNDER_COLUMN_GAP_EM) {
        hole = true;
        break;
      }
    }
    if (hole) continue;
    for (const m of matches) m.underline = true;
    underlines.push(line);
  }
  return underlines;
}
function insideTallCell(line, verticals, em) {
  let left = false, right = false;
  for (const v of verticals) {
    const lo = Math.min(v.y1, v.y2), hi = Math.max(v.y1, v.y2);
    if (lo > line.y1 || hi < line.y1) continue;
    if (v.x1 >= line.x1 - 0.5 && v.x1 <= line.x2 + 0.5) return false;
    if (hi - lo <= em * UNDER_BOX_PAIR_MAX_EM) continue;
    if (v.x1 < line.x1 - 0.5) left = true;
    if (v.x1 > line.x2 + 0.5) right = true;
  }
  return left && right;
}
function touchesVertical(line, verticals) {
  for (const v of verticals) {
    if (v.x1 < line.x1 - UNDER_GRID_EPS || v.x1 > line.x2 + UNDER_GRID_EPS) continue;
    const lo = Math.min(v.y1, v.y2), hi = Math.max(v.y1, v.y2);
    if (hi - lo <= UNDER_GRID_EPS) continue;
    if (lo <= line.y1 + UNDER_GRID_EPS && hi >= line.y1 - UNDER_GRID_EPS) return true;
  }
  return false;
}
function hasBoxTopPair(line, maxH, horizontals, cellItems) {
  const w = line.x2 - line.x1;
  if (w <= 0) return false;
  for (const o of horizontals) {
    if (o === line) continue;
    const dy = o.y1 - line.y1;
    if (dy < maxH * UNDER_BOX_PAIR_MIN_EM || dy > maxH * UNDER_BOX_PAIR_MAX_EM) continue;
    const ow = o.x2 - o.x1;
    if (ow <= 0) continue;
    const overlap2 = Math.min(line.x2, o.x2) - Math.max(line.x1, o.x1);
    if (overlap2 / Math.max(w, ow) < UNDER_BOX_PAIR_OVERLAP) continue;
    const covered = cellItems?.reduce((sum, item) => {
      const below = item.y - o.y1;
      if (below < 0.5 || below > 3 || !item.text.trim()) return sum;
      return sum + Math.max(0, Math.min(o.x2, item.x + item.w) - Math.max(o.x1, item.x));
    }, 0) ?? 0;
    if (covered < ow * UNDER_MIN_COVERAGE) return true;
  }
  return false;
}
function isRepeatedSpanRule(line, horizontals) {
  const w = line.x2 - line.x1;
  if (w <= 0) return false;
  const ys = [];
  for (const o of horizontals) {
    const ow = o.x2 - o.x1;
    if (ow <= 0) continue;
    const overlap2 = Math.min(line.x2, o.x2) - Math.max(line.x1, o.x1);
    if (overlap2 / Math.max(w, ow) < UNDER_SPAN_OVERLAP_RATIO) continue;
    if (!ys.some((y) => Math.abs(y - o.y1) < 2)) ys.push(o.y1);
  }
  return ys.length >= UNDER_REPEATED_SPAN_LEVELS;
}
function wrapUnderlineRuns(items) {
  const marked = items.filter((i) => i.underline);
  if (marked.length === 0) return;
  const lines = /* @__PURE__ */ new Map();
  for (const item of marked) {
    const key = Math.round(item.y / 3);
    const arr = lines.get(key) || [];
    arr.push(item);
    lines.set(key, arr);
  }
  for (const arr of lines.values()) {
    arr.sort((a, b) => a.x - b.x);
    let runStart = 0;
    for (let i = 1; i <= arr.length; i++) {
      const prev = arr[i - 1];
      const em = Math.max(prev.h > 0 ? prev.h : prev.fontSize, 1);
      const gap = i < arr.length ? arr[i].x - (prev.x + prev.w) : Infinity;
      if (gap > em) {
        arr[runStart].text = "<u>" + arr[runStart].text;
        prev.text = prev.text + "</u>";
        runStart = i;
      }
    }
  }
}
var MAX_GAP_K = 2.2;
var EDGE_TOL = 3;
function headerLineAbove(free, colXs, top) {
  const x1 = colXs[0], x2 = colXs[colXs.length - 1];
  const above = free.filter((it) => it.y > top && it.text.trim());
  if (above.length === 0) return null;
  const baseY = Math.min(...above.map((it) => it.y));
  const line = above.filter((it) => Math.abs(it.y - baseY) <= Math.max(2, it.fontSize * 0.3));
  const fs = Math.max(...line.map((it) => it.fontSize));
  if (baseY - top > fs * MAX_GAP_K) return null;
  const text = [...line].sort((a, b) => a.x - b.x).map((it) => it.text).join(" ").trim();
  if (/^(?:Table|Figure|Fig\.|Chart|Exhibit|Diagram|Source|Note|<?표|<?그림)\s*[\dIVX]/i.test(text)) return null;
  if (line.some((it) => it.seq === void 0 || it.x < x1 - EDGE_TOL || it.x + it.w > x2 + EDGE_TOL)) return null;
  if (above.some((it) => !line.includes(it) && Math.abs(it.y - baseY) <= fs * 0.5)) return null;
  const cols = colXs.slice(1).map(() => []);
  for (const it of line) {
    const first = colXs.findIndex((x, k) => k < colXs.length - 1 && it.x + 1 >= x && it.x + 1 < colXs[k + 1]);
    const last = colXs.findIndex((x, k) => k < colXs.length - 1 && it.x + it.w - 1 > x && it.x + it.w - 1 <= colXs[k + 1]);
    if (first < 0 || first !== last) return null;
    cols[first].push(it);
  }
  if (cols.filter((c) => c.length > 0).length < Math.max(2, Math.ceil((colXs.length - 1) / 2))) return null;
  return cols;
}
var CLIP_CELL_EDGES = /* @__PURE__ */ new WeakMap();
var NO_EDGES = Object.freeze({ t: false, b: false, l: false, r: false });
var EDGE_NEAR2 = 1.6;
var EDGE_COVER = 0.6;
var EDGE_SLACK = 3;
var DASH_GAP = 3;
var TIP_MAX = 1.5;
function rules(lines, dir) {
  const sorted = [...lines].sort((a, b) => dir === "h" ? a.y1 - b.y1 : a.x1 - b.x1);
  return { dir, pos: sorted.map((l) => dir === "h" ? l.y1 : l.x1), lines: sorted };
}
function seen(r, at, a1, a2, near = EDGE_NEAR2) {
  const len = a2 - a1;
  if (len <= 0) return false;
  const covered = coverage(r, at, a1, a2, near);
  return covered >= len * EDGE_COVER && len - covered <= EDGE_SLACK;
}
function coverage(r, at, a1, a2, near) {
  let i = 0, j = r.pos.length;
  while (i < j) {
    const m = i + j >> 1;
    if (r.pos[m] < at - near) i = m + 1;
    else j = m;
  }
  const spans = [];
  for (; i < r.pos.length && r.pos[i] <= at + near; i++) {
    const l = r.lines[i];
    const l1 = r.dir === "h" ? Math.min(l.x1, l.x2) : Math.min(l.y1, l.y2), l2 = r.dir === "h" ? Math.max(l.x1, l.x2) : Math.max(l.y1, l.y2);
    const lo = Math.max(a1, l1), hi = Math.min(a2, l2);
    if (hi <= lo || l1 < a1 !== l2 > a2 && hi - lo < TIP_MAX) continue;
    spans.push([lo, hi]);
  }
  if (!spans.length) return 0;
  spans.sort((p, q) => p[0] - q[0]);
  let covered = 0, s = spans[0][0], e = spans[0][1];
  for (const [lo, hi] of spans.slice(1)) {
    if (lo <= e + DASH_GAP) e = Math.max(e, hi);
    else {
      covered += e - s;
      s = lo;
      e = hi;
    }
  }
  return covered + e - s;
}
function edgesOf(box, h, v, hNear = EDGE_NEAR2) {
  return {
    t: seen(h, box.y2, box.x1, box.x2, hNear),
    b: seen(h, box.y1, box.x1, box.x2, hNear),
    l: seen(v, box.x1, box.y1, box.y2),
    r: seen(v, box.x2, box.y1, box.y2)
  };
}
function recordClipCellEdges(grids, horizontals, verticals, nonRules) {
  if (!grids.some((g) => g.cells)) return;
  const h = rules(nonRules?.size ? horizontals.filter((l) => !nonRules.has(l)) : horizontals, "h");
  const v = rules(nonRules?.size ? verticals.filter((l) => !nonRules.has(l)) : verticals, "v");
  for (const g of grids) for (const c of g.cells ?? []) {
    const near = c.filler ? Math.min(EDGE_NEAR2, (c.bbox.y2 - c.bbox.y1) / 3) : EDGE_NEAR2;
    CLIP_CELL_EDGES.set(c, edgesOf(c.bbox, h, v, near));
  }
}
function takeClipCellEdges(from, to) {
  const e = CLIP_CELL_EDGES.get(from);
  if (e) CELL_EDGES.set(to, e);
}
function joinCellEdges(a, b) {
  const u = CELL_EDGES.get(a), d = CELL_EDGES.get(b);
  if (!u || !d) return;
  CELL_EDGES.set(a, { t: u.t, b: d.b, l: u.l || d.l, r: u.r || d.r });
}
var UNIT = /^\s*\(\s*단위\s*[:：]/;
function rebuildUnitLine(items, grid) {
  const nearby = items.filter((item) => item.y >= grid.bbox.y2 && item.y - grid.bbox.y2 <= 18 && item.x >= grid.bbox.x1 - 3 && item.x + item.w <= grid.bbox.x2 + 3);
  for (const y of [...new Set(nearby.map((item) => Math.round(item.y)))].sort((a, b) => a - b)) {
    const line = nearby.filter((item) => Math.abs(item.y - y) <= 1).sort((a, b) => a.x - b.x);
    if (UNIT.test(line.map((item) => item.text).join(""))) return line;
  }
  return [];
}
function prependUnitRow(cells, cols, line, usedItems) {
  const text = cleanCellText(line.map((item) => item.text).join(""));
  cells.unshift(Array.from({ length: cols }, (_, c) => ({ text: c === 0 ? text : "", colSpan: c === 0 ? cols : 1, rowSpan: 1 })));
  for (const cell of cells[0]) CELL_EDGES.set(cell, NO_EDGES);
  for (const item of line) usedItems.add(item);
}
function attachUnitRow(items, grid, cells, cols, usedItems) {
  const all = cells.flat();
  if (all.filter((c) => c.text.trim()).length * 2 < all.length || UNIT.test(cells[0]?.[0]?.text ?? "")) return false;
  const above = items.filter((it) => !usedItems.has(it) && it.y >= grid.bbox.y2 && it.y - grid.bbox.y2 <= 8 && it.x >= grid.bbox.x1 - 3 && it.x + it.w <= grid.bbox.x2 + 3);
  let nearest = Infinity;
  for (const it of above) nearest = Math.min(nearest, it.y);
  const line = above.filter((it) => Math.abs(it.y - nearest) <= 1).sort((a, b) => a.x - b.x);
  const text = line.map((it) => it.text).join("");
  const inset = line.length ? grid.bbox.x2 - (line[line.length - 1].x + line[line.length - 1].w) : 0;
  if (!line.length || !UNIT.test(text) || inset < 4.6 || inset > 5.6) return false;
  prependUnitRow(cells, cols, line, usedItems);
  return true;
}
function isPageFrameGrid(grid, cells, pageWidth, pageHeight, items = []) {
  const b = grid.bbox;
  if (grid.cells || b.x2 - b.x1 < pageWidth * 0.85 || b.y2 - b.y1 < pageHeight * 0.75) return false;
  const pageArea = pageWidth * pageHeight;
  const area = (c) => (c.bbox.x2 - c.bbox.x1) * (c.bbox.y2 - c.bbox.y1);
  const big = cells.filter((c) => area(c) >= pageArea * 0.15);
  if (big.reduce((s, c) => s + area(c), 0) < pageArea * 0.5) return false;
  const inner = grid.colXs.slice(1, -1);
  const inBig = items.filter((it) => big.some((c) => {
    const cx = it.x + it.w / 2, cy = it.y + it.h / 2;
    return cx > c.bbox.x1 && cx < c.bbox.x2 && cy > c.bbox.y1 && cy < c.bbox.y2;
  }));
  const crossing = inBig.filter((it) => inner.some((x) => x > it.x + 1 && x < it.x + it.w - 1)).length;
  return inner.length === 0 || crossing >= 1 && crossing >= inBig.length * 0.01;
}
function closeShadedTableEdges(clipGrids, horizontals, verticals, fillRects) {
  const near = (a, b) => Math.abs(a - b) <= 1.5;
  let hs = horizontals, vs = verticals;
  const restored = [];
  for (const grid of clipGrids) {
    if (grid.clipParent || grid.rowYs.length !== 2 || grid.colXs.length < 3 || !grid.cells?.length || grid.cells.some((c) => c.filler || c.rowSpan !== 1 || c.colSpan !== 1)) continue;
    const { x1, x2, y1: mid, y2: top } = grid.bbox;
    if (!grid.cells.every((c) => fillRects.some((f) => near(f.x1, c.bbox.x1) && near(f.x2, c.bbox.x2) && near(f.y1, c.bbox.y1) && near(f.y2, c.bbox.y2)))) continue;
    const topRule = hs.find((h) => near(h.y1, top) && near(h.x1, x1) && near(h.x2, x2));
    if (!topRule) continue;
    const dividers = grid.colXs.slice(1, -1).map((x) => vs.find((v) => near(v.x1, x) && near(v.y2, top) && v.y1 <= mid - 6));
    if (dividers.some((v) => !v)) continue;
    const bottom = dividers[0].y1;
    if (!dividers.every((v) => near(v.y1, bottom))) continue;
    const bottomRule = hs.find((h) => near(h.y1, bottom) && near(h.x1, x1) && near(h.x2, x2));
    if (!bottomRule) continue;
    const missing = [x1, x2].filter((x) => !vs.some((v) => near(v.x1, x) && v.y1 <= bottom + 1.5 && v.y2 >= top - 1.5));
    if (!missing.length) continue;
    restored.push({ x1, x2, y1: bottom, y2: top });
    vs = vs.concat(missing.map((x) => ({ x1: x, x2: x, y1: bottom, y2: top, lineWidth: topRule.lineWidth })));
    if (!hs.some((h) => near(h.y1, mid) && near(h.x1, x1) && near(h.x2, x2))) {
      hs = hs.concat({ x1, x2, y1: mid, y2: mid, lineWidth: topRule.lineWidth });
    }
  }
  return { horizontals: hs, verticals: vs, restored };
}
function nestRestoredShadedGrids(grids, restored, horizontals, verticals) {
  const near = (a, b) => Math.abs(a - b) <= 1.5;
  if (restored.length === 0) return;
  const nested = /* @__PURE__ */ new Set();
  for (const grid of grids) {
    const b = grid.bbox;
    if (!restored.some((r) => near(r.x1, b.x1) && near(r.x2, b.x2) && near(r.y1, b.y1) && near(r.y2, b.y2))) continue;
    if (grids.some((g) => g !== grid && b.x1 - g.bbox.x1 >= 0.8 && g.bbox.x2 - b.x2 >= 0.8 && b.y1 - g.bbox.y1 >= 0.8 && g.bbox.y2 - b.y2 >= 0.8)) {
      grid.lineNested = true;
      nested.add(grid);
    }
  }
  for (const frame of grids) {
    const b = frame.bbox;
    if (frame.lineNested || ![...nested].some((g) => g.bbox.x1 > b.x1 && g.bbox.x2 < b.x2 && g.bbox.y1 > b.y1 && g.bbox.y2 < b.y2)) continue;
    const fullH = horizontals.filter((h) => near(h.x1, b.x1) && near(h.x2, b.x2) && h.y1 >= b.y1 - 1.5 && h.y1 <= b.y2 + 1.5);
    if (!fullH.some((h) => near(h.y1, b.y1)) || !fullH.some((h) => near(h.y1, b.y2)) || fullH.some((h) => h.y1 > b.y1 + 1.5 && h.y1 < b.y2 - 1.5)) continue;
    const fullV = verticals.filter((v) => v.y1 <= b.y1 + 1.5 && v.y2 >= b.y2 - 1.5 && v.x1 >= b.x1 - 1.5 && v.x1 <= b.x2 + 1.5);
    if (!fullV.some((v) => near(v.x1, b.x1)) || !fullV.some((v) => near(v.x1, b.x2)) || fullV.some((v) => v.x1 > b.x1 + 1.5 && v.x1 < b.x2 - 1.5)) continue;
    frame.colXs = [b.x1, b.x2];
    frame.rowYs = [b.y2, b.y1];
  }
}
var ALIGN_TOL = 3;
var MIN_RULES = 3;
var V_CHAIN_GAP = 1.5;
var V_X_TOL = 1.5;
var TOUCH_TOL = 2;
var MIN_REACH = 8;
var END_TOL = 1.5;
var MIN_REACHING = 2;
var INSET = 15;
function chainVerticals2(verticals) {
  const sorted = [...verticals].sort((a, b) => a.x1 - b.x1 || a.y1 - b.y1);
  const out = [];
  for (const v of sorted) {
    const prev = [...out].reverse().find((o) => Math.abs(o.x1 - v.x1) <= V_X_TOL && v.y1 - o.y2 <= V_CHAIN_GAP && v.y2 >= o.y1);
    if (prev) {
      if (v.y2 > prev.y2) prev.y2 = v.y2;
      if (v.y1 < prev.y1) prev.y1 = v.y1;
    } else out.push({ ...v });
  }
  return out;
}
function commonEnd(ends) {
  let best = null, bestN = 0;
  for (const e of ends) {
    const n = ends.filter((o) => Math.abs(o - e) <= END_TOL).length;
    if (n > bestN || n === bestN && best !== null && Math.abs(e) > Math.abs(best)) {
      best = e;
      bestN = n;
    }
  }
  return bestN >= MIN_REACHING ? best : null;
}
function splitBodies(g, chained) {
  if (g.length < MIN_RULES * 2) return [g];
  const x1 = Math.min(...g.map((r) => r.x1)), x2 = Math.max(...g.map((r) => r.x2));
  const sorted = [...g].sort((a, b) => b.y1 - a.y1);
  const parts = [[sorted[0]]];
  for (let i = 1; i < sorted.length; i++) {
    const upper = sorted[i - 1].y1, lower = sorted[i].y1;
    const joined = chained.some((v) => v.x1 >= x1 - ALIGN_TOL && v.x1 <= x2 + ALIGN_TOL && v.y2 >= upper - TOUCH_TOL && v.y1 <= lower + TOUCH_TOL);
    if (joined) parts[parts.length - 1].push(sorted[i]);
    else parts.push([sorted[i]]);
  }
  return parts.filter((p) => p.length >= MIN_RULES).length >= 2 ? parts : [g];
}
function closeOpenTableEnds(horizontals, verticals, textLayer = false) {
  if (horizontals.length < MIN_RULES || verticals.length < MIN_REACHING) return horizontals;
  const groups = [];
  for (const rule of chainCollinearRules(horizontals)) {
    const g = groups.find((gr) => Math.abs(gr[0].x1 - rule.x1) <= ALIGN_TOL && Math.abs(gr[0].x2 - rule.x2) <= ALIGN_TOL);
    if (g) g.push(rule);
    else groups.push([rule]);
  }
  const chained = chainVerticals2(verticals);
  const added = [];
  for (const g of groups.flatMap((gr) => splitBodies(gr, chained))) {
    if (g.length < MIN_RULES) continue;
    const x1 = Math.min(...g.map((r) => r.x1)), x2 = Math.max(...g.map((r) => r.x2));
    const yLo = Math.min(...g.map((r) => r.y1)), yHi = Math.max(...g.map((r) => r.y1));
    const interior = chained.filter((v) => v.x1 > x1 + INSET && v.x1 < x2 - INSET && v.y1 <= yHi + TOUCH_TOL && v.y2 >= yLo - TOUCH_TOL);
    const top = commonEnd(interior.filter((v) => v.y1 <= yHi + TOUCH_TOL && v.y2 >= yHi + MIN_REACH).map((v) => v.y2));
    const below = interior.filter((v) => v.y2 >= yLo - TOUCH_TOL && v.y1 <= yLo - MIN_REACH);
    let bottom = commonEnd(below.map((v) => v.y1));
    if (bottom === null && textLayer && below.length >= MIN_REACHING && below.length === interior.filter((v) => v.y2 >= yLo - TOUCH_TOL && v.y1 <= yLo + TOUCH_TOL).length) bottom = Math.max(...below.map((v) => v.y1));
    for (const y of [top, bottom]) {
      if (y === null) continue;
      if (horizontals.some((h) => Math.abs(h.y1 - y) <= TOUCH_TOL && h.x1 <= x1 + INSET && h.x2 >= x2 - INSET)) continue;
      added.push({ x1, y1: y, x2, y2: y, lineWidth: 0.5 });
    }
  }
  return added.length ? [...horizontals, ...added] : horizontals;
}
var MAX_BOX_H = 48;
var EDGE_TOL2 = 2;
var FIRST_GAP_K = 2.5;
var PITCH_BREAK_K = 1.8;
var WRAP_K = 0.75;
var MIN_ROWS2 = 2;
function columnOf(it, colXs) {
  for (let c = 0; c + 1 < colXs.length; c++) {
    if (it.x >= colXs[c] - EDGE_TOL2 && it.x + it.w <= colXs[c + 1] + EDGE_TOL2) return c;
  }
  return -1;
}
function extendHeaderBoxRows(horizontals, verticals, items) {
  const boxes = buildTableGrids(horizontals, verticals).filter((g) => g.rowYs.length === 2 && g.colXs.length >= 3 && g.bbox.y2 - g.bbox.y1 <= MAX_BOX_H);
  if (boxes.length === 0) return { horizontals, verticals };
  const addH = [], addV = [];
  const lines = groupByY([...items].sort((a, b) => b.y - a.y || a.x - b.x));
  for (const box of boxes) {
    const { x1, x2, y1: boxBottom } = box.bbox;
    const below = lines.filter((l) => l[0].y + l[0].h < boxBottom + EDGE_TOL2);
    const rows = [];
    let prevY = boxBottom, pitch = 0;
    for (const line of below) {
      const y = line[0].y, h = Math.max(...line.map((it) => it.h || it.fontSize));
      const gap = prevY - y;
      if (rows.length === 0 ? boxBottom - (y + h) > h * FIRST_GAP_K : gap > (pitch || gap) * PITCH_BREAK_K) break;
      if (line.some((it) => it.x + it.w < x1 - EDGE_TOL2 || it.x > x2 + EDGE_TOL2 || columnOf(it, box.colXs) < 0)) break;
      if (horizontals.some((hl) => hl.y1 < prevY - EDGE_TOL2 && hl.y1 > y + h && hl.x1 < x2 && hl.x2 > x1)) break;
      if (rows.length > 0 && pitch > 0 && gap < pitch * WRAP_K) rows[rows.length - 1].push(line);
      else {
        if (rows.length === 1) pitch = gap;
        rows.push([line]);
      }
      prevY = y;
    }
    if (rows.length < MIN_ROWS2 || !rows.some((r) => r.flat().length >= 2)) continue;
    const top = (r) => Math.max(...r.flat().map((it) => it.y + (it.h || it.fontSize)));
    const bottom = (r) => Math.min(...r.flat().map((it) => it.y));
    const cuts = [];
    for (let i = 0; i + 1 < rows.length; i++) cuts.push((bottom(rows[i]) + top(rows[i + 1])) / 2);
    const tableBottom = bottom(rows[rows.length - 1]) - Math.max(2, (pitch - (top(rows[0]) - bottom(rows[0]))) / 2);
    cuts.push(tableBottom);
    for (const y of cuts) addH.push({ x1, y1: y, x2, y2: y, lineWidth: 0.5 });
    for (const x of box.colXs) addV.push({ x1: x, y1: tableBottom, x2: x, y2: boxBottom, lineWidth: 0.5 });
  }
  if (addH.length === 0) return { horizontals, verticals };
  return { horizontals: [...horizontals, ...addH], verticals: [...verticals, ...addV] };
}
var ALIGN_TOL2 = 3;
var EDGE_TOL3 = 2;
var MIN_WIDTH = 120;
var COL_GAP_K = 0.8;
var MIN_FILLED_ROWS = 0.6;
var WRAP_K2 = 0.7;
function projectColumns(items, minGap) {
  const spans = items.map((it) => [it.x, it.x + it.w]).sort((a, b) => a[0] - b[0]);
  const out = [];
  for (const s of spans) {
    const last = out[out.length - 1];
    if (last && s[0] - last[1] < minGap) last[1] = Math.max(last[1], s[1]);
    else out.push([s[0], s[1]]);
  }
  return out;
}
function median(values) {
  if (values.length === 0) return 0;
  const s = [...values].sort((a, b) => a - b);
  return s[s.length >> 1];
}
function flatHeader(lines) {
  const body = lines.slice(1).flat();
  const fs = median(body.map((it) => it.fontSize).filter((s) => s > 0)) || 10;
  const cols = projectColumns(body, fs * COL_GAP_K);
  const head = projectColumns(lines[0], fs * COL_GAP_K);
  return cols.length >= 2 && head.length === cols.length && head.every((h) => cols.filter((c) => Math.min(c[1], h[1]) - Math.max(c[0], h[0]) > 0).length === 1);
}
function headerLineCount(lines) {
  if (lines.some((l) => l.some((it) => it.seq === void 0))) return flatHeader(lines) ? 1 : 0;
  const pitch = median(lines.slice(1).map((l, i) => lines[i][0].y - l[0].y));
  let n = 1;
  while (n < lines.length && lines[n - 1][0].y - lines[n][0].y < pitch * WRAP_K2) n++;
  if (lines.length - n < 3) return 0;
  const head = lines.slice(0, n).flat(), body = lines.slice(n).flat();
  const fs = median(body.map((it) => it.fontSize).filter((s) => s > 0)) || 10;
  const cols = projectColumns(body, fs * COL_GAP_K);
  const heads = projectColumns(head, fs * COL_GAP_K);
  const hit = heads.map((h) => cols.flatMap((c, k) => Math.min(c[1], h[1]) - Math.max(c[0], h[0]) > 0 ? [k] : []));
  return cols.length >= 2 && heads.length >= 2 && hit.every((k) => k.length === 1) && new Set(hit.map((k) => k[0])).size === heads.length ? n : 0;
}
function buildRow(rowItems, bounds, colSpans) {
  const cols = bounds.length + 1;
  const colOf = (x) => bounds.filter((b) => x > b).length;
  const cells = Array.from({ length: cols }, () => []);
  const span = new Array(cols).fill(1);
  for (const it of rowItems) {
    let first = colOf(it.x + EDGE_TOL3), last = colOf(it.x + it.w - EDGE_TOL3);
    if (last > first && colSpans) {
      const covered = colSpans.map((c, k) => Math.min(c[1], it.x + it.w) - Math.max(c[0], it.x) > 0 ? k : -1).filter((k) => k >= 0);
      if (covered.length <= 1) {
        const cx = it.x + it.w / 2;
        first = last = covered[0] ?? colSpans.reduce((best, c, k) => Math.abs((c[0] + c[1]) / 2 - cx) < Math.abs((colSpans[best][0] + colSpans[best][1]) / 2 - cx) ? k : best, 0);
      } else {
        first = covered[0];
        last = covered[covered.length - 1];
      }
    }
    cells[first].push(it);
    if (last > first) span[first] = Math.max(span[first], last - first + 1);
  }
  const row = [];
  for (let c = 0; c < cols; ) {
    const n = Math.min(span[c], cols - c);
    const items = cells.slice(c, c + n).flat();
    row.push({ text: cellTextToString(items.map((it) => ({ ...it }))), colSpan: n, rowSpan: 1 });
    for (let k = 1; k < n; k++) row.push({ text: "", colSpan: 1, rowSpan: 1 });
    c += n;
  }
  return row;
}
function detectRuledBandTables(horizontals, verticals, items, pageNum) {
  if (horizontals.length < 2) return [];
  const groups = [];
  for (const rule of chainCollinearRules(horizontals)) {
    if (rule.x2 - rule.x1 < MIN_WIDTH) continue;
    const g = groups.find((gr) => Math.abs(gr[0].x1 - rule.x1) <= ALIGN_TOL2 && Math.abs(gr[0].x2 - rule.x2) <= ALIGN_TOL2);
    if (g) g.push(rule);
    else groups.push([rule]);
  }
  const lines = groupByY([...items].sort((a, b) => b.y - a.y || a.x - b.x));
  const found = [];
  const emit = (bands, x1, x2) => {
    const top = bands[0].top, bottom = bands[bands.length - 1].bottom;
    if (verticals.some((v) => v.y1 < top && v.y2 > bottom && (v.x1 > x1 + EDGE_TOL3 && v.x1 < x2 - EDGE_TOL3 || Math.abs(v.x1 - x1) <= ALIGN_TOL2 + EDGE_TOL3 && Math.min(v.y2, top) - Math.max(v.y1, bottom) > (top - bottom) * 0.5 || Math.abs(v.x1 - x2) <= ALIGN_TOL2 + EDGE_TOL3 && Math.min(v.y2, top) - Math.max(v.y1, bottom) > (top - bottom) * 0.5))) return;
    const body = bands.slice(1).flatMap((b) => b.lines);
    const fs = median(body.flat().map((it) => it.fontSize).filter((s) => s > 0)) || 10;
    const cols = projectColumns(body.flat(), fs * COL_GAP_K);
    if (cols.length < 2) return;
    const bounds = cols.slice(1).map((c, i) => (cols[i][1] + c[0]) / 2);
    const rows = [buildRow(bands[0].lines.flat(), bounds, cols)];
    for (const band of bands.slice(1)) {
      const pitch = median(band.lines.slice(1).map((l, i) => band.lines[i][0].y - l[0].y)) || Infinity;
      const bandRows = [];
      band.lines.forEach((l, i) => {
        if (i > 0 && band.lines[i - 1][0].y - l[0].y < pitch * WRAP_K2) bandRows[bandRows.length - 1].push(...l);
        else bandRows.push([...l]);
      });
      for (const r of bandRows) rows.push(buildRow(r, bounds));
    }
    const table = { rows: rows.length, cols: bounds.length + 1, cells: rows, hasHeader: true };
    const bodyRows = rows.slice(1);
    if (bodyRows.filter((r) => r.filter((c) => c.text.trim()).length >= 2).length < bodyRows.length * MIN_FILLED_ROWS) return;
    if (isTableOfContents(table)) return;
    const used = bands.flatMap((b) => b.lines.flat());
    found.push({
      block: { type: "table", table, pageNumber: pageNum, bbox: { page: pageNum, x: x1, y: bottom, width: x2 - x1, height: top - bottom } },
      items: used
    });
  };
  for (const g of groups) {
    if (g.length < 2) continue;
    const rules2 = [...g].sort((a, b) => b.y1 - a.y1);
    const x1 = Math.min(...rules2.map((r) => r.x1)), x2 = Math.max(...rules2.map((r) => r.x2));
    let run = [];
    const flush = () => {
      if (run.length >= 2) emit(run, x1, x2);
      else if (g.length === 2 && run.length === 1 && run[0].lines.length >= 4) {
        const [band] = run, n = headerLineCount(band.lines);
        if (n > 0) {
          const cut = (band.lines[n - 1][0].y + band.lines[n][0].y + Math.max(...band.lines[n].map((it) => it.h || it.fontSize))) / 2;
          emit([{ top: band.top, bottom: cut, lines: band.lines.slice(0, n) }, { top: cut, bottom: band.bottom, lines: band.lines.slice(n) }], x1, x2);
        }
      }
      run = [];
    };
    let title = null;
    for (let i = 0; i + 1 < rules2.length; i++) {
      const top = rules2[i].y1, bottom = rules2[i + 1].y1;
      const band = lines.filter((l) => l[0].y < top && l[0].y > bottom);
      const inside = !band.some((l) => l.some((it) => it.x < x1 - EDGE_TOL3 || it.x + it.w > x2 + EDGE_TOL3));
      const fs = median(band.flat().map((it) => it.fontSize).filter((s) => s > 0)) || 10;
      if (band.length > 0 && inside && projectColumns(band.flat(), fs * COL_GAP_K).length >= 2) {
        if (run.length === 0 && title) run.push(title);
        run.push({ top, bottom, lines: band });
        title = null;
      } else {
        flush();
        title = band.length > 0 && band.length <= 2 && inside ? { top, bottom, lines: band } : null;
      }
    }
    flush();
  }
  return found;
}
var EDGE_TOL4 = 2;
var TOP_TOL = 3;
var MIN_COLS2 = 3;
var MIN_ROWS3 = 3;
function detectTextBoxTables(boxes, items, pageNum) {
  const text = items.filter((it) => it.seq !== void 0 && it.text.trim());
  const inBox = (b, it) => {
    const cx = it.x + it.w / 2, cy = it.y + (it.h || it.fontSize) / 2;
    return cx >= b.x1 && cx <= b.x2 && cy >= b.y1 && cy <= b.y2;
  };
  const filled = boxes.filter((b) => text.some((it) => inBox(b, it)));
  const cols = [];
  for (const b of filled) {
    const c = cols.find((g) => Math.abs(g[0].x1 - b.x1) <= EDGE_TOL4 && Math.abs(g[0].x2 - b.x2) <= EDGE_TOL4);
    if (c) c.push(b);
    else cols.push([b]);
  }
  const tableCols = cols.filter((g) => g.length >= MIN_ROWS3).sort((a, b) => a[0].x1 - b[0].x1);
  if (tableCols.length < MIN_COLS2) return [];
  for (let i = 1; i < tableCols.length; i++) if (tableCols[i][0].x1 < tableCols[i - 1][0].x2 - EDGE_TOL4) return [];
  const tops = tableCols.flatMap((g, c) => g.map((b) => ({ top: b.y2, bottom: b.y1, c }))).sort((a, b) => b.top - a.top);
  const rows = [];
  for (const t of tops) {
    const last = rows[rows.length - 1];
    if (last && last.top - t.top <= TOP_TOL && !last.cols.has(t.c)) {
      last.cols.add(t.c);
      last.bottom = Math.min(last.bottom, t.bottom);
    } else rows.push({ top: t.top, bottom: t.bottom, cols: /* @__PURE__ */ new Set([t.c]) });
  }
  const anchored = rows.filter((r) => r.cols.size >= 2);
  if (anchored.length < MIN_ROWS3 || anchored.length < rows.length * 0.8) return [];
  const x1 = tableCols[0][0].x1, x2 = tableCols[tableCols.length - 1][0].x2;
  const top = anchored[0].top, bottom = anchored[anchored.length - 1].bottom;
  const used = text.filter((it) => {
    const cx = it.x + it.w / 2, itTop = it.y + (it.h || it.fontSize);
    return cx >= x1 - EDGE_TOL4 && cx <= x2 + EDGE_TOL4 && itTop <= top + TOP_TOL && it.y >= bottom - TOP_TOL;
  });
  if (used.length === 0) return [];
  const colOf = (it) => {
    let c = 0;
    for (let k = 1; k < tableCols.length; k++) if (it.x >= tableCols[k][0].x1 - EDGE_TOL4) c = k;
    return c;
  };
  const rowOf = (it) => {
    const itTop = it.y + (it.h || it.fontSize);
    let r = 0;
    for (let k = 1; k < anchored.length; k++) if (itTop <= anchored[k].top + TOP_TOL) r = k;
    return r;
  };
  const grid = anchored.map(() => tableCols.map(() => []));
  for (const it of used) grid[rowOf(it)][colOf(it)].push(it);
  const cells = grid.map((row) => row.map((its) => ({ text: cellTextToString(its.map((it) => ({ ...it }))), colSpan: 1, rowSpan: 1 })));
  return [{
    block: {
      type: "table",
      table: { rows: cells.length, cols: tableCols.length, cells, hasHeader: true },
      pageNumber: pageNum,
      bbox: { page: pageNum, x: x1, y: bottom, width: x2 - x1, height: top - bottom }
    },
    items: used
  }];
}
var FRAME_READING_UNITS = /* @__PURE__ */ new WeakMap();
var FRAME_SOURCE_BOUNDS = /* @__PURE__ */ new WeakMap();
function recordFrameReadingUnit(blocks, bbox) {
  for (const block of blocks) FRAME_SOURCE_BOUNDS.set(block, bbox);
  if (blocks.length < 2) return;
  const unit = { blocks, bbox };
  for (const block of blocks) FRAME_READING_UNITS.set(block, unit);
}
function frameLayoutBoxes(blocks) {
  const boxes = [], seen2 = /* @__PURE__ */ new Set();
  for (const block of blocks) {
    const frame = FRAME_SOURCE_BOUNDS.get(block);
    if (frame) {
      if (!seen2.has(frame)) {
        boxes.push(frame);
        seen2.add(frame);
      }
    } else if (block.bbox) boxes.push(block.bbox);
  }
  return boxes;
}
function takeFrameSpanningText(items, cutX, pageNum, lex) {
  let minX = Infinity, maxR = -Infinity;
  for (const item of items) {
    minX = Math.min(minX, item.x);
    maxR = Math.max(maxR, item.x + item.w);
  }
  const span = maxR - minX;
  const rows = groupByY([...items].sort((a, b) => b.y - a.y || a.x - b.x)).map((line) => {
    const runs = [];
    for (const item of [...line].sort((a, b) => a.x - b.x)) {
      const run = runs[runs.length - 1], prev = run?.[run.length - 1];
      if (prev && item.x - (prev.x + prev.w) <= Math.max(prev.fontSize, item.fontSize) * 0.6) run.push(item);
      else runs.push([item]);
    }
    return runs;
  });
  const taken = /* @__PURE__ */ new Set(), blocks = [];
  for (let r = 0; r < rows.length; r++) for (const run of rows[r]) {
    if (taken.has(run[0]) || run[0].x >= cutX || Math.max(...run.map((i) => i.x + i.w)) <= cutX) continue;
    const lines = [run], fs = Math.max(...run.map((i) => i.fontSize));
    const left = run[0].x, right = Math.max(...run.map((i) => i.x + i.w));
    if (right - left < span * 0.75) continue;
    let prevY = run[0].y;
    for (let next = r + 1; next < rows.length && rows[next].length === 1; next++) {
      const tail = rows[next][0], y = tail[0].y;
      if (taken.has(tail[0]) || prevY - y > fs * 1.8 || tail[0].x < left - 1 || tail[0].x > left + fs * 2 || tail.some((i) => Math.abs(i.fontSize - fs) > fs * 0.15) || Math.max(...tail.map((i) => i.x + i.w)) > right + 1) break;
      lines.push(tail);
      prevY = y;
    }
    for (const line of lines) for (const item of line) taken.add(item);
    pushLineParagraphs(blocks, mergeSuperscriptLines(lines), pageNum, lex);
  }
  let keep = 0;
  for (const item of items) if (!taken.has(item)) items[keep++] = item;
  items.length = keep;
  return blocks;
}
function frameColumnTextBands(items, spanning, cutX) {
  const tops = spanning.filter((b) => b.bbox).map((b) => b.bbox.y + b.bbox.height).sort((a, b) => b - a);
  const bands = /* @__PURE__ */ new Map();
  for (const item of items) {
    let band = 0;
    while (band < tops.length && tops[band] > item.y + item.h) band++;
    const sides = bands.get(band) ?? [[], [], []];
    sides[item.x + item.w <= cutX ? 0 : item.x >= cutX ? 2 : 1].push(item);
    bands.set(band, sides);
  }
  return [...bands].sort((a, b) => a[0] - b[0]).flatMap(([, sides]) => sides.filter((side) => side.length));
}
function groupFrameParagraphUnits(units, frames) {
  const source = /* @__PURE__ */ new Map();
  for (const unit of units) for (const block of unit) source.set(block, unit);
  const members = /* @__PURE__ */ new Map(), emitted = /* @__PURE__ */ new Set();
  for (const frame of frames) {
    if (frame.length < 2 || frame.some((block) => block.type !== "paragraph" || source.get(block)?.length !== 1)) continue;
    for (const block of frame) members.set(block, frame);
  }
  const out = [];
  for (const unit of units) {
    const frame = unit.length === 1 ? members.get(unit[0]) : void 0;
    if (!frame) out.push(unit);
    else if (!emitted.has(frame)) {
      out.push(frame);
      emitted.add(frame);
    }
  }
  for (const unit of out) {
    if (unit.length < 2 || FRAME_READING_UNITS.get(unit[0])?.blocks === unit) continue;
    const bs = unit.map((b) => b.bbox).filter((b) => !!b);
    if (bs.length !== unit.length) continue;
    const x = Math.min(...bs.map((b) => b.x)), y = Math.min(...bs.map((b) => b.y));
    recordFrameReadingUnit(unit, {
      page: bs[0].page,
      x,
      y,
      width: Math.max(...bs.map((b) => b.x + b.width)) - x,
      height: Math.max(...bs.map((b) => b.y + b.height)) - y
    });
  }
  return out;
}
function recordFrameTitle(table, source, pageNum) {
  if (!CLIP_TABLES.has(table) || table.rows !== 1 || table.cols !== 3 || source.length < 2) return;
  const cells = table.cells[0];
  if (cells.length !== 3 || cells.some((c) => c.colSpan !== 1 || c.rowSpan !== 1 || c.blocks?.length || c.text.includes("\n"))) return;
  const [label, spacer, title] = cells;
  if (!/^(?:붙임|별첨|첨부|부록)\s*\d{1,3}$/.test(label.text.trim()) || spacer.text.trim() || !title.text.trim()) return;
  if (cells.some((c) => {
    const e = CELL_EDGES.get(c);
    return !e || e.t || e.b || e.l || e.r;
  })) return;
  const xs = TABLE_COLXS.get(table), style = dominantStyle(source), fs = style?.fontSize ?? 0;
  if (!xs || xs.length !== 4 || fs <= 0) return;
  const width = xs[3] - xs[0], gap = xs[2] - xs[1];
  if (width < fs * 12 || gap <= 0 || gap > fs * 1.5 || xs[1] - xs[0] > width * 0.25 || xs[3] - xs[2] < width * 0.6) return;
  if (source.some((i) => i.fontName !== source[0].fontName || Math.abs(i.fontSize - fs) > fs * 0.15)) return;
  if (groupByY([...source].sort((a, b) => b.y - a.y)).length !== 1) return;
  FRAME_TITLE_BLOCKS.set(table, {
    type: "paragraph",
    text: `${label.text.trim()} ${title.text.trim()}`,
    pageNumber: pageNum,
    bbox: computeBBox(source, pageNum),
    style
  });
}
var FRAME_RECT_TOL = 1.5;
function takePendingNested(pending, cellBox, clipCell) {
  const out = [];
  for (let i = pending.length - 1; i >= 0; i--) {
    const p = pending[i].parent;
    if (pending[i].contained ? p.x1 >= cellBox.x1 - FRAME_RECT_TOL && p.x2 <= cellBox.x2 + FRAME_RECT_TOL && p.y1 >= cellBox.y1 - FRAME_RECT_TOL && p.y2 <= cellBox.y2 + FRAME_RECT_TOL : clipCell && Math.abs(p.x1 - cellBox.x1) <= FRAME_RECT_TOL && Math.abs(p.x2 - cellBox.x2) <= FRAME_RECT_TOL && Math.abs(p.y1 - cellBox.y1) <= FRAME_RECT_TOL && Math.abs(p.y2 - cellBox.y2) <= FRAME_RECT_TOL) {
      out.push(pending[i].block);
      pending.splice(i, 1);
    }
  }
  return out;
}
function buildFrameCellBlocks(cellItems, nested, pageNum, lex) {
  const tables = [...nested].sort((a, b) => b.bbox.y + b.bbox.height - (a.bbox.y + a.bbox.height));
  const blocks = [];
  let rest = [...cellItems];
  const pushParagraphs = (items) => {
    if (items.length === 0) return;
    const source = items.map((it) => ({ ...it, isHidden: false })).sort((a, b) => b.y - a.y || a.x - b.x);
    const paragraphs = [];
    pushLineParagraphs(paragraphs, mergeSuperscriptLines(groupByY(source)), pageNum, lex);
    for (const block of paragraphs) {
      block.text = cleanCellText(block.text ?? "");
      if (block.text) blocks.push(block);
    }
  };
  for (const tb of tables) {
    const bottom = tb.bbox.y;
    pushParagraphs(rest.filter((it) => it.y >= bottom));
    rest = rest.filter((it) => it.y < bottom);
    blocks.push(tb);
  }
  pushParagraphs(rest);
  const text = blocks.map((b) => b.type === "table" && b.table ? b.table.cells.flat().map((c) => c.text).filter(Boolean).join("\n") : b.text ?? "").filter(Boolean).join("\n");
  return { blocks, text };
}
function extendNestedShadedHeaders(clipGrids, lineGrids, horizontals, verticals, fills) {
  const near = (a, b) => Math.abs(a - b) <= 1.5;
  const contains3 = (a, b) => b.x1 >= a.x1 - 1.5 && b.x2 <= a.x2 + 1.5 && b.y1 >= a.y1 - 1.5 && b.y2 <= a.y2 + 1.5;
  const extended = [];
  for (let i = 0; i < clipGrids.length; i++) {
    const c = clipGrids[i], parent = c.clipParent;
    if (!parent || c.rowYs.length !== 2 || c.colXs.length < 3 || !c.cells?.length || c.cells.some((cell) => cell.filler || cell.rowSpan !== 1 || cell.colSpan !== 1)) continue;
    if (!clipGrids.some((g) => g.rowYs.length === 2 && g.colXs.length === 2 && near(g.bbox.x1, parent.x1) && near(g.bbox.x2, parent.x2) && near(g.bbox.y1, parent.y1) && near(g.bbox.y2, parent.y2))) continue;
    if (!c.cells.every((cell) => fills.some((f) => near(f.x1, cell.bbox.x1) && near(f.x2, cell.bbox.x2) && near(f.y1, cell.bbox.y1) && near(f.y2, cell.bbox.y2)))) continue;
    const host = lineGrids.find((l) => l.rowYs.length > 2 && l.colXs.length === c.colXs.length && c.colXs.every((x, k) => near(x, l.colXs[k])) && c.rowYs.every((y, k) => near(y, l.rowYs[k])) && contains3(parent, l.bbox) && l.rowYs.every((y) => horizontals.some((h) => near(h.y1, y) && near(h.x1, l.bbox.x1) && near(h.x2, l.bbox.x2))) && l.colXs.every((x) => verticals.some((v) => near(v.x1, x) && v.y1 <= l.bbox.y1 + 1.5 && v.y2 >= l.bbox.y2 - 1.5)) && !clipGrids.some((o) => o !== c && !contains3(o.bbox, l.bbox) && Math.min(o.bbox.x2, l.bbox.x2) > Math.max(o.bbox.x1, l.bbox.x1) && Math.min(o.bbox.y2, l.bbox.y2) > Math.max(o.bbox.y1, l.bbox.y1)));
    if (!host) continue;
    const grid = { ...host, clipParent: parent, cells: extractCells(host, horizontals, verticals) };
    clipGrids[i] = grid;
    extended.push(grid);
  }
  return extended;
}
function attachSideTabBlocks(tab, body, pageNum) {
  const ordered = [...tab].sort((a, b) => b.y - a.y);
  const caps = SIDE_TAB_CAP_GROUPS.get(tab);
  const block = (items) => ({
    type: "paragraph",
    text: mergeLineSimple(items).trim(),
    pageNumber: pageNum,
    bbox: computeBBox(items, pageNum),
    style: dominantStyle(items)
  });
  const prefix = ordered.filter((g) => !caps?.has(g)).map((g) => ({
    type: "paragraph",
    text: g.text.trim(),
    pageNumber: pageNum,
    bbox: computeBBox([g], pageNum),
    style: dominantStyle([g])
  }));
  const groups = /* @__PURE__ */ new Map();
  for (const g of ordered) {
    const cap = caps?.get(g);
    if (cap) groups.set(cap, [...groups.get(cap) ?? [], g]);
  }
  for (const [cap, glyphs] of groups) {
    const blocks = groupByY(glyphs).map(block);
    const anchor = body.reduce((best, b, i) => {
      const box = b.bbox;
      if (b.type === "image" || b.type === "separator" || !box || !b.text && !b.table || box.x > cap.x + 1 || box.x + box.width < cap.x + cap.w - 1 || box.y > cap.y + 1 || box.y + box.height < cap.y + cap.fontSize - 1) return best;
      return best < 0 || box.width * box.height < body[best].bbox.width * body[best].bbox.height ? i : best;
    }, -1);
    body.splice(anchor >= 0 ? anchor + 1 : body.length, 0, ...blocks);
  }
  return [...prefix, ...body];
}
function splitTwoColumnProse(items, cutX) {
  const left = [];
  const right = [];
  const cross = [];
  for (const i of items) {
    if (i.x + i.w <= cutX) left.push(i);
    else if (i.x >= cutX) right.push(i);
    else cross.push(i);
  }
  if (cross.length === 0) return columnPair(left, right);
  cross.sort((a, b) => b.y - a.y);
  const crossLines = [];
  for (const c of cross) {
    const last = crossLines[crossLines.length - 1];
    if (last && Math.abs(last[0].y - c.y) <= 3) last.push(c);
    else crossLines.push([c]);
  }
  const scriptOf = (i, cl) => {
    const fs = cl[0].fontSize, dy = i.y - cl[0].y;
    if (i.fontSize > fs * 0.85 || dy > fs * 0.6 || dy < -fs * 0.35) return false;
    return cl.some((c) => c !== i && c.fontSize > fs * 0.85 && i.x - (c.x + c.w) <= fs * 0.35 && i.x - (c.x + c.w) >= -fs * 0.1);
  };
  const bandItem = (arr, fits) => arr.filter((i) => {
    for (const cl of crossLines) {
      if (fits(i, cl)) {
        cl.push(i);
        return false;
      }
    }
    return true;
  });
  const sameY = (i, cl) => Math.abs(cl[0].y - i.y) <= 3;
  const leftRest = bandItem(bandItem(left, sameY), scriptOf);
  const rightRest = bandItem(bandItem(right, sameY), scriptOf);
  const boundYs = crossLines.map((cl) => cl[0].y);
  const bandOf = (y) => {
    let k = 0;
    while (k < boundYs.length && y < boundYs[k]) k++;
    return k;
  };
  const groups = [];
  for (let k = 0; k <= crossLines.length; k++) {
    const L = leftRest.filter((i) => bandOf(i.y) === k);
    const R = rightRest.filter((i) => bandOf(i.y) === k);
    groups.push(...columnPair(L, R));
    if (k < crossLines.length) groups.push(crossLines[k].sort((a, b) => b.y - a.y || a.x - b.x));
  }
  return groups;
}
var NOTE_START = /^\s*(?:\d{1,3}\s|[*†‡§¹²³⁴⁵⁶⁷⁸⁹])/;
function medianOf(values) {
  const s = values.filter((v) => v > 0).sort((a, b) => a - b);
  return s.length ? s[s.length >> 1] : 0;
}
function columnPair(left, right) {
  if (left.length === 0 || right.length === 0) return [left, right].filter((g) => g.length > 0);
  const byLine = (side) => groupByY([...side].sort((a, b) => b.y - a.y || a.x - b.x));
  let L = byLine(left), R = byLine(right);
  const out = [];
  const pitch = (lines) => medianOf(lines.slice(1).map((l, i) => lines[i][0].y - l[0].y));
  const fs = medianOf([...left, ...right].map((i) => i.fontSize)) || 10;
  const headFs = (line) => Math.max(fs, ...line.map((i) => i.fontSize));
  if (L.length > 1 && R.length > 1 && Math.abs(L[0][0].y - R[0][0].y) <= 2 && L[0][0].y - L[1][0].y >= headFs(L[0]) * 2 && R[0][0].y - R[1][0].y >= headFs(R[0]) * 2) {
    out.push([...L[0], ...R[0]]);
    L = L.slice(1);
    R = R.slice(1);
  }
  const lift = (A, B) => {
    if (A.length < 2 || B.length === 0) return 0;
    let n = 0;
    while (n < A.length && A[n][0].y > B[0][0].y + 2) n++;
    if (n === 0 || n >= A.length || n > 6 || n * 2 >= A.length) return 0;
    return A[n - 1][0].y - A[n][0].y >= Math.max(pitch(A.slice(n)) * 1.8, fs * 2) ? n : 0;
  };
  const nR = lift(R, L), nL = nR ? 0 : lift(L, R);
  if (nR) {
    out.push(R.slice(0, nR).flat());
    R = R.slice(nR);
  }
  if (nL) {
    out.push(L.slice(0, nL).flat());
    L = L.slice(nL);
  }
  const notes = (lines) => {
    const sizes = lines.map((l) => Math.max(...l.map((i) => i.fontSize)));
    const body = Math.max(0, ...sizes.filter((s) => sizes.filter((o) => Math.abs(o - s) < 0.5).length >= lines.length * 0.25));
    let n = 0;
    while (n < lines.length && Math.max(...lines[lines.length - 1 - n].map((i) => i.fontSize)) <= body * 0.9) n++;
    if (n === 0 || lines.length - n < 3) return 0;
    const tail = lines.slice(lines.length - n);
    return tail.some((l) => NOTE_START.test(mergeLineSimple(l))) ? n : 0;
  };
  const kL = notes(L), kR = notes(R);
  if (kL === 0 && kR === 0) return [...out, L.flat(), R.flat()].filter((g) => g.length > 0);
  return [
    ...out,
    L.slice(0, L.length - kL).flat(),
    R.slice(0, R.length - kR).flat(),
    L.slice(L.length - kL).flat(),
    R.slice(R.length - kR).flat()
  ].filter((g) => g.length > 0);
}
function topTableBand(items) {
  const lines = groupByY(items);
  if (lines.length < 12) return null;
  for (let n = 4; n < Math.min(lines.length - 5, 16); n++) {
    const upper = lines.slice(0, n);
    if (upper.filter((line) => line.length >= 3).length < 3) continue;
    const gap = upper[n - 1][0].y - lines[n][0].y;
    const sizes = upper.flat().map((i) => i.fontSize).filter((size) => size > 0).sort((a, b) => a - b);
    if (gap < Math.max(18, (sizes[Math.floor(sizes.length / 2)] ?? 10) * 1.8)) continue;
    const top = upper.flat();
    const candidate = detectClusterTables(top.map((i) => ({
      text: i.text,
      x: i.x,
      y: i.y,
      w: i.w,
      h: i.h,
      fontSize: i.fontSize,
      fontName: i.fontName,
      hasSpaceBefore: i.hasSpaceBefore,
      syntheticSpace: i.syntheticSpace
    })), 1);
    if (!candidate.some((t) => t.table.cols >= 3 && t.table.rows >= 3 && t.usedItems.size >= top.length * 0.75)) continue;
    return { top, rest: lines.slice(n).flat() };
  }
  return null;
}
function tieredHeaderTable(items, pageNum) {
  const lines = groupByY(items).map((line) => [...line].sort((a, b) => a.x - b.x));
  if (lines.length < 5) return null;
  const cols = lines[3].length;
  if (cols < 5 || (cols - 1) % 2 !== 0 || lines[0].length !== 1 || lines[1].length !== 3 || lines[2].length !== cols - 1 || !lines.slice(3).every((line) => line.length === cols) || Math.abs(lines[1][0].x - lines[3][0].x) > 30) return null;
  const splitX = (lines[1][1].x + lines[1][2].x) / 2;
  const half = (cols - 1) / 2;
  if (lines[2].slice(0, half).some((i) => i.x >= splitX) || lines[2].slice(half).some((i) => i.x < splitX)) return null;
  const cell = (text, colSpan = 1, rowSpan = 1, isHeader = false) => ({ text, colSpan, rowSpan, ...isHeader ? { isHeader: true } : {} });
  const empty = () => cell("");
  const grid = [
    [cell(lines[1][0].text, 1, 3, true), cell(lines[0][0].text, cols - 1, 1, true), ...Array.from({ length: cols - 2 }, empty)],
    [
      empty(),
      cell(lines[1][1].text, half, 1, true),
      ...Array.from({ length: half - 1 }, empty),
      cell(lines[1][2].text, half, 1, true),
      ...Array.from({ length: half - 1 }, empty)
    ],
    [empty(), ...lines[2].map((i) => cell(i.text, 1, 1, true))],
    ...lines.slice(3).map((line) => line.map((i) => cell(i.text)))
  ];
  return {
    type: "table",
    pageNumber: pageNum,
    bbox: computeBBox(items, pageNum),
    table: { rows: grid.length, cols, cells: grid, hasHeader: true }
  };
}
function stackedTableBands(items) {
  const lines = groupByY(items);
  if (lines.length < 16) return null;
  const dense = lines.map((line) => line.length >= 6 && Math.max(...line.map((i) => i.x + i.w)) - Math.min(...line.map((i) => i.x)) >= 300);
  const runs = [];
  for (let i = 0; i < dense.length; ) {
    if (!dense[i]) {
      i++;
      continue;
    }
    const start = i;
    while (i < dense.length && dense[i]) i++;
    if (i - start >= 2) runs.push({ start, end: i });
  }
  if (runs.length < 2 || runs[0].start > 2) return null;
  const caption = (start, end) => lines.slice(start, end).some((line) => /^Table\s+\d+\s*[:.]/i.test(mergeLineSimple(line).trim()));
  while (runs.length > 0 && !caption(runs[runs.length - 1].end, lines.length)) runs.pop();
  if (runs.length < 2) return null;
  if (runs.some((run, i) => !caption(run.end, runs[i + 1]?.start ?? lines.length))) return null;
  const tables = runs.map((run) => lines.slice(run.start, run.end).flat());
  const between = runs.slice(0, -1).map((run, i) => lines.slice(run.end, runs[i + 1].start).flat());
  const tail = lines.slice(runs[runs.length - 1].end);
  let bodyStart = tail.length;
  for (let i = 1; i < Math.min(tail.length, 10); i++) {
    if (tail[i - 1][0].y - tail[i][0].y >= 24) {
      bodyStart = i;
      break;
    }
  }
  return { tables, between, caption: tail.slice(0, bodyStart).flat(), body: tail.slice(bodyStart).flat() };
}
function threeColumnCards(items) {
  const lines = groupByY(items);
  if (lines.length < 5) return null;
  for (let n = 1; n < lines.length - 2; n++) {
    const labels = [...lines[n]].sort((a, b) => a.x - b.x);
    if (labels.length !== 3 || labels.some((i) => i.text.trim().length < 3 || i.text.length > 40)) continue;
    if (labels[1].x - (labels[0].x + labels[0].w) < 70 || labels[2].x - (labels[1].x + labels[1].w) < 70) continue;
    if (!labels.every((i) => i.fontName === labels[0].fontName && Math.abs(i.fontSize - labels[0].fontSize) < 1)) continue;
    if (lines[n - 1][0].y - labels[0].y < labels[0].fontSize * 2) continue;
    const below = lines.slice(n + 1);
    const firstContent = below[0];
    if (labels[0].y - firstContent[0].y < labels[0].fontSize * 2) continue;
    const boundaries = [
      (labels[0].x + labels[0].w + labels[1].x) / 2,
      (labels[1].x + labels[1].w + labels[2].x) / 2
    ];
    if (!boundaries.every((x, i) => x > labels[i].x + labels[i].w && x < labels[i + 1].x)) continue;
    let end = below.length;
    for (let j = 1; j < below.length; j++) {
      if (below[j - 1][0].y - below[j][0].y > labels[0].fontSize * 5) {
        end = j;
        break;
      }
    }
    const region = [labels, ...below.slice(0, end)].flat();
    const cards = [0, 1, 2].map((c) => region.filter((i) => c === 0 ? i.x < boundaries[0] : c === 1 ? i.x >= boundaries[0] && i.x < boundaries[1] : i.x >= boundaries[1]));
    if (cards.some((c) => c.length < 2 || !c.some((i) => i.y < labels[0].y))) continue;
    const upper = lines.slice(0, n).flat();
    const lower = below.slice(end).flat();
    return [upper, ...cards, lower].filter((g) => g.length > 0);
  }
  return null;
}
function threeColumnInfographic(items) {
  const lines = groupByY(items);
  if (lines.length < 12) return null;
  for (let n = 4; n < lines.length - 6; n++) {
    if (lines[n - 1][0].y - lines[n][0].y < 35) continue;
    const lower = lines.slice(n);
    const counts = /* @__PURE__ */ new Map();
    for (const item of lower.flat()) {
      if (item.text.trim().length < 12) continue;
      const x = Math.round(item.x / 5) * 5;
      counts.set(x, (counts.get(x) ?? 0) + 1);
    }
    const anchors = [...counts].filter(([, count]) => count >= 2).map(([x]) => x).sort((a, b) => a - b);
    if (anchors.length !== 3 || anchors[1] - anchors[0] < 120 || anchors[2] - anchors[1] < 120) continue;
    const cuts = [(anchors[0] + anchors[1]) / 2, (anchors[1] + anchors[2]) / 2];
    let footerStart = lower.length;
    for (let j = 1; j < lower.length; j++) {
      if (lower[j - 1][0].y - lower[j][0].y >= 70) {
        footerStart = j;
        break;
      }
    }
    const region = lower.slice(0, footerStart).flat();
    const cards = [
      region.filter((i) => i.x < cuts[0]),
      region.filter((i) => i.x >= cuts[0] && i.x < cuts[1]),
      region.filter((i) => i.x >= cuts[1])
    ];
    if (cards.some((card) => card.length < 4 || !card.some((i) => i.text.length >= 50))) continue;
    return [lines.slice(0, n).flat(), ...cards, lower.slice(footerStart).flat()].filter((group) => group.length > 0);
  }
  return null;
}
function figureColumnBands(items, figures) {
  const lines = groupByY([...items].sort((a, b) => b.y - a.y || a.x - b.x));
  if (lines.length < 10) return null;
  const minX = Math.min(...items.map((i) => i.x)), maxX = Math.max(...items.map((i) => i.x + i.w));
  const span = maxX - minX;
  if (span < 200) return null;
  const full = (line) => {
    const s = [...line].sort((a, b) => a.x - b.x);
    const fs = Math.max(...s.map((i) => i.fontSize));
    if (s[s.length - 1].x + s[s.length - 1].w - s[0].x < span * 0.75) return false;
    const sizeOf = (part) => {
      const by = /* @__PURE__ */ new Map();
      for (const it of part) by.set(it.fontSize, (by.get(it.fontSize) ?? 0) + it.text.length);
      return [...by].sort((a, b) => b[1] - a[1])[0][0];
    };
    if (s.slice(1).some((it, k) => it.x - (s[k].x + s[k].w) >= fs * 0.6 && Math.abs(sizeOf(s.slice(0, k + 1)) - sizeOf(s.slice(k + 1))) >= 0.5)) return false;
    return s.slice(1).every((it, k) => it.x - (s[k].x + s[k].w) < fs * 2);
  };
  const segs = [];
  for (const line of lines) {
    const f = full(line), last = segs[segs.length - 1];
    if (last && last.full === f) last.lines.push(line);
    else segs.push({ full: f, lines: [line] });
  }
  let split = false;
  const out = [];
  for (const seg of segs) {
    const flat = seg.lines.flat();
    if (seg.full || seg.lines.length < 3) {
      out.push(flat);
      continue;
    }
    const top = Math.max(...flat.map((i) => i.y + (i.h || i.fontSize))), bottom = Math.min(...flat.map((i) => i.y));
    const rects = [
      ...flat.map((i) => ({ x: i.x, y: i.y, w: i.w, h: i.h || i.fontSize })),
      ...figures.filter((f) => f.y < top && f.y + f.h > bottom)
    ];
    let best = null, run = null;
    const step = Math.max(2, span * 0.4 / 400);
    for (let x = minX + span * 0.3; x <= minX + span * 0.7; x += step) {
      const empty = !rects.some((r) => r.x < x && r.x + r.w > x);
      if (empty && run === null) run = x;
      if ((!empty || x + step > minX + span * 0.7) && run !== null) {
        if (x - run >= 8 && (!best || x - run > best.w)) best = { x: (run + x) / 2, w: x - run };
        run = null;
      }
    }
    if (!best) {
      out.push(flat);
      continue;
    }
    const left = flat.filter((i) => i.x + i.w <= best.x), right = flat.filter((i) => i.x >= best.x);
    const gapped = (side) => groupByY([...side].sort((a, b) => b.y - a.y || a.x - b.x)).some((l) => {
      const s = [...l].sort((a, b) => a.x - b.x);
      return s.slice(1).some((it, k) => it.x - (s[k].x + s[k].w) >= Math.max(it.fontSize, s[k].fontSize) * 2);
    });
    if (left.length === 0 || right.length === 0 || gapped(left) || gapped(right)) {
      out.push(flat);
      continue;
    }
    split = true;
    const low = (side, other) => {
      const floor = Math.min(...other.map((i) => i.y)) - Math.max(...other.map((i) => i.fontSize));
      return side.filter((i) => i.y < floor);
    };
    const tail = [...low(left, right), ...low(right, left)];
    out.push(left.filter((i) => !tail.includes(i)), right.filter((i) => !tail.includes(i)), tail);
  }
  return split ? out.filter((g) => g.length > 0) : null;
}
function extractPageBlocksWithLines(items, pageNum, opList, pageWidth, pageHeight, extraLines, detectTables = true, carry, lexicon, verifiedRightArrows = []) {
  if (items.length === 0) {
    if (carry) carry.clip = void 0;
    return [];
  }
  const tab = sideTabGlyphs(items);
  if (tab.size) {
    const body = extractPageBlocksWithLines(items.filter((i) => !tab.has(i)), pageNum, opList, pageWidth, pageHeight, extraLines, detectTables, carry, lexicon, verifiedRightArrows);
    return attachSideTabBlocks(tab, body, pageNum);
  }
  const lex = lexicon ?? new WrapLexicon();
  for (const line of streamLines(items)) lex.addLine(mergeLineSimple(line));
  const extracted = extractLines(opList.fnArray, opList.argsArray);
  let { horizontals, verticals } = extracted;
  const rawRules = extracted.horizontals.concat(extracted.shortH);
  const filled = fillBlanks(items, horizontals, verticals);
  items = filled.items;
  horizontals = filled.horizontals;
  const prevPage = carry?.page === pageNum - 1 ? carry.clip : void 0;
  const clipResult = detectTables ? buildClipCellGrids(extracted.clipRects, horizontals, verticals, pageWidth, pageHeight, items.map((it) => ({ x: it.x + it.w / 2, y: it.y + it.h / 2 })), extracted.fillRects, prevPage) : { grids: [], containers: [], page: void 0 };
  if (carry) {
    carry.page = pageNum;
    carry.clip = clipResult.page;
  }
  const clipGrids = clipResult.grids;
  recordClipCellEdges(clipGrids, horizontals.concat(extracted.shortH), verticals.concat(extracted.shortV), extracted.nonRules);
  if (clipGrids.length === 0) {
    horizontals = chainShortSegments(horizontals, extracted.shortH, "h");
    verticals = chainShortSegments(verticals, extracted.shortV, "v");
  }
  if (extraLines) {
    horizontals = horizontals.concat(extraLines.horizontals);
    verticals = verticals.concat(extraLines.verticals);
  }
  ;
  ({ horizontals, verticals } = filterPageBorderLines(horizontals, verticals, pageWidth, pageHeight));
  ({ horizontals, verticals } = preprocessLines(horizontals, verticals, extracted.nonRules));
  markStrikethroughItems(items, horizontals);
  wrapStrikethroughRuns(items);
  const underlines = new Set(markUnderlineItems(items, horizontals, verticals, extracted.nonRules));
  if (underlines.size) horizontals = horizontals.filter((l) => !underlines.has(l));
  wrapUnderlineRuns(items);
  horizontals = closeOpenTableEnds(horizontals, verticals, items.every((it) => it.seq !== void 0));
  verticals = closeOpenTableEdges(horizontals, verticals);
  verticals = bridgeSplitColumnVerticals(horizontals, verticals);
  if (detectTables && clipGrids.length === 0) verticals = bridgeSkippedRowVerticals(horizontals, verticals, items);
  if (detectTables && clipGrids.length === 0) ({ horizontals, verticals } = extendHeaderBoxRows(horizontals, verticals, items));
  const shadedEdges = detectTables ? closeShadedTableEdges(clipGrids, horizontals, verticals, extracted.fillRects) : void 0;
  if (shadedEdges) ({ horizontals, verticals } = shadedEdges);
  const lineGrids = detectTables ? buildTableGrids(horizontals, verticals) : [];
  if (shadedEdges) nestRestoredShadedGrids(lineGrids, shadedEdges.restored, horizontals, verticals);
  const tableClipGrids = dropHeadBandClipGrids(dropInsetClipGrids(dropShadingClipGrids(clipGrids, lineGrids, extracted.fillRects, verticals), lineGrids), lineGrids);
  recordClipCellEdges(
    extendNestedShadedHeaders(tableClipGrids, lineGrids, horizontals, verticals, extracted.fillRects),
    extracted.horizontals.concat(extracted.shortH),
    extracted.verticals.concat(extracted.shortV),
    extracted.nonRules
  );
  const grids = [...tableClipGrids, ...dropGridsInside(lineGrids, tableClipGrids, clipResult.containers)];
  const figures = () => extractImageRegions(opList.fnArray, opList.argsArray, true).filter((r) => r.x2 - r.x1 >= 40 && r.y2 - r.y1 >= 40).map((r) => ({ x: r.x1, y: r.y1, w: r.x2 - r.x1, h: r.y2 - r.y1 }));
  if (grids.length === 1 && grids[0].rowYs.length === 2 && grids[0].colXs.length === 2 && grids[0].bbox.x2 - grids[0].bbox.x1 > pageWidth * 1.2 && grids[0].bbox.y2 - grids[0].bbox.y1 > pageHeight * 1.2) {
    return extractPageBlocksFallback(items, pageNum, true, detectTables, lex, figures());
  }
  const ruled = detectTables && clipGrids.length === 0 ? detectRuledBandTables(horizontals, verticals, items, pageNum) : [];
  if (detectTables && clipGrids.length === 0 && ruled.length === 0 && lineGrids.length === 0) ruled.push(...detectTextBoxTables(extracted.hiddenBoxes, items, pageNum));
  if (ruled.length > 0) {
    const imageRegions = extractImageRegions(opList.fnArray, opList.argsArray).filter((r) => r.x2 - r.x1 >= 8 && r.y2 - r.y1 >= 8);
    return extractBlocksWithGrids(items, pageNum, pageWidth, pageHeight, grids, horizontals, verticals, imageRegions, lex, ruled, rawRules, verifiedRightArrows);
  }
  if (detectTables && stackedTableBands(items)) {
    return extractPageBlocksFallback(items, pageNum, true, detectTables, lex, figures());
  }
  const sidebar = splitSidebarTitleRegion(items);
  if (sidebar && grids.every((grid) => grid.rowYs.length === 2 && grid.colXs.length === 2 && !items.some((item) => item.x + item.w / 2 >= grid.bbox.x1 && item.x + item.w / 2 <= grid.bbox.x2 && item.y + item.h / 2 >= grid.bbox.y1 && item.y + item.h / 2 <= grid.bbox.y2))) {
    return sidebar.flatMap((region, index) => extractPageBlocksFallback(region, pageNum, false, index === 2 ? false : detectTables, lex));
  }
  if (grids.length > 0) {
    const imageRegions = extractImageRegions(opList.fnArray, opList.argsArray).filter((r) => r.x2 - r.x1 >= 8 && r.y2 - r.y1 >= 8);
    return extractBlocksWithGrids(items, pageNum, pageWidth, pageHeight, grids, horizontals, verticals, imageRegions, lex, [], rawRules, verifiedRightArrows);
  }
  return extractPageBlocksFallback(items, pageNum, true, detectTables, lex, figures());
}
var STRIKE_MAX_THICKNESS = 2;
var STRIKE_MAX_THICKNESS_RATIO = 0.25;
var STRIKE_CENTER_TOLERANCE = 0.25;
var STRIKE_MIN_OVERLAP_RATIO = 0.8;
var STRIKE_MAX_LINE_TO_TEXT_RATIO = 1.5;
function markStrikethroughItems(items, horizontals) {
  if (items.length === 0 || horizontals.length === 0) return;
  for (const line of horizontals) {
    if (line.lineWidth > STRIKE_MAX_THICKNESS) continue;
    const matches = [];
    for (const item of items) {
      if (item.fontName === "ocr") continue;
      const h = item.h > 0 ? item.h : item.fontSize;
      if (h <= 0 || item.w <= 0) continue;
      if (line.lineWidth > h * STRIKE_MAX_THICKNESS_RATIO) continue;
      const centerY = item.y + h * 0.4;
      if (Math.abs(line.y1 - centerY) > h * STRIKE_CENTER_TOLERANCE) continue;
      const overlap2 = Math.min(line.x2, item.x + item.w) - Math.max(line.x1, item.x);
      if (overlap2 / item.w < STRIKE_MIN_OVERLAP_RATIO) continue;
      matches.push(item);
    }
    if (matches.length === 0) continue;
    let totalW = 0;
    for (const m of matches) totalW += m.w;
    if (totalW <= 0 || (line.x2 - line.x1) / totalW > STRIKE_MAX_LINE_TO_TEXT_RATIO) continue;
    for (const m of matches) m.strike = true;
  }
}
function wrapStrikethroughRuns(items) {
  const struck = items.filter((i) => i.strike);
  if (struck.length === 0) return;
  const lines = /* @__PURE__ */ new Map();
  for (const item of struck) {
    const key = Math.round(item.y / 3);
    const arr = lines.get(key) || [];
    arr.push(item);
    lines.set(key, arr);
  }
  for (const arr of lines.values()) {
    arr.sort((a, b) => a.x - b.x);
    arr[0].text = "~~" + arr[0].text;
    arr[arr.length - 1].text = arr[arr.length - 1].text + "~~";
  }
}
var PROSEBOX_FULLWIDTH_MIN = 0.6;
var PROSEBOX_LONG_CELL_CHARS = 80;
var PROSEBOX_LONG_CELL_MIN = 3;
var PROSEBOX_LONG_CELL_RATIO = 0.4;
var PROSEBOX_X_TOL = 8;
function verticalCoverageAt(verticals, x, yMin, yMax) {
  const tol = PROSEBOX_X_TOL;
  const spans = [];
  for (const v of verticals) {
    if (Math.abs(v.x1 - x) > tol) continue;
    const lo = Math.max(v.y1, yMin), hi = Math.min(v.y2, yMax);
    if (hi > lo) spans.push([lo, hi]);
  }
  if (spans.length === 0) return 0;
  spans.sort((a, b) => a[0] - b[0]);
  let total = 0, s = spans[0][0], e = spans[0][1];
  for (let i = 1; i < spans.length; i++) {
    if (spans[i][0] <= e) {
      if (spans[i][1] > e) e = spans[i][1];
    } else {
      total += e - s;
      s = spans[i][0];
      e = spans[i][1];
    }
  }
  return total + (e - s);
}
function isProseBoxGrid(grid, verticals, table) {
  const numCols = grid.colXs.length - 1;
  if (numCols < 2 || grid.rowYs.length < 3) return false;
  const gyMax = grid.rowYs[0], gyMin = grid.rowYs[grid.rowYs.length - 1];
  const span = gyMax - gyMin;
  if (span <= 0) return false;
  const interior = grid.colXs.slice(1, -1);
  let fullWidthHeight = 0;
  for (let r = 0; r < grid.rowYs.length - 1; r++) {
    const top = grid.rowYs[r], bot = grid.rowYs[r + 1];
    const h = top - bot;
    if (h <= 0) continue;
    const hasDivider = interior.some((cx) => verticalCoverageAt(verticals, cx, bot, top) >= h * 0.5);
    if (!hasDivider) fullWidthHeight += h;
  }
  if (fullWidthHeight < span * PROSEBOX_FULLWIDTH_MIN) return false;
  const texts = table.cells.flat().map((c) => c.text.trim()).filter(Boolean);
  const longCells = texts.filter((s) => s.length > PROSEBOX_LONG_CELL_CHARS).length;
  if (longCells < PROSEBOX_LONG_CELL_MIN || longCells < texts.length * PROSEBOX_LONG_CELL_RATIO) return false;
  return true;
}
function isSparseProseGrid(table) {
  if (table.rows < 4) return false;
  const texts = table.cells.flat().map((c) => c.text.trim());
  const filled = texts.filter(Boolean);
  if (filled.length === 0 || filled.length > texts.length * 0.25) return false;
  const chars = filled.reduce((n, t) => n + t.length, 0);
  const prose = filled.filter((t) => t.length >= 60 && /[.!?。]/.test(t)).reduce((n, t) => n + t.length, 0);
  return prose >= chars * 0.6;
}
function extractBlocksWithGrids(items, pageNum, pageWidth, pageHeight, grids, horizontals, verticals, imageRegions = [], lex, ruled = [], rawRules = horizontals, verifiedRightArrows = []) {
  const ocrPage = items.length > 0 && items.every((i) => i.fontName === "ocr");
  const blocks = [];
  const frameParagraphUnits = [];
  const usedItems = /* @__PURE__ */ new Set();
  for (const r of ruled) {
    for (const it of r.items) usedItems.add(it);
    blocks.push(r.block);
  }
  const proseSidebars = /* @__PURE__ */ new Set();
  const pendingNested = [];
  const gridArea = (g) => (g.bbox.x2 - g.bbox.x1) * (g.bbox.y2 - g.bbox.y1);
  const sortedGrids = [...grids].sort((a, b) => (b.cells ? 1 : 0) - (a.cells ? 1 : 0) || (a.cells && b.cells ? gridArea(a) - gridArea(b) : 0) || (b.lineNested ? 1 : 0) - (a.lineNested ? 1 : 0) || (a.lineNested && b.lineNested ? gridArea(a) - gridArea(b) : 0) || b.bbox.y2 - a.bbox.y2);
  for (const grid of sortedGrids) {
    const numGridRows = grid.rowYs.length - 1;
    const numGridCols = grid.colXs.length - 1;
    const gridW = grid.bbox.x2 - grid.bbox.x1;
    const holdsNested = !grid.cells && pendingNested.some((p) => p.contained && p.parent.x1 >= grid.bbox.x1 - FRAME_RECT_TOL && p.parent.x2 <= grid.bbox.x2 + FRAME_RECT_TOL && p.parent.y1 >= grid.bbox.y1 - FRAME_RECT_TOL && p.parent.y2 <= grid.bbox.y2 + FRAME_RECT_TOL);
    if (!grid.cells && !holdsNested && numGridRows === 1 && numGridCols >= 2) continue;
    if (!grid.cells && !holdsNested && numGridCols === 1 && numGridRows >= 2 && (numGridRows < 5 || gridW > pageWidth * 0.7)) continue;
    if (!holdsNested && isPageFrameGrid(grid, extractCells(grid, horizontals, verticals), pageWidth, pageHeight, items)) continue;
    const tableItems = [];
    const pad = 3;
    for (const item of items) {
      if (usedItems.has(item)) continue;
      if (item.y < grid.bbox.y1 - pad || item.y > grid.bbox.y2 + pad) continue;
      if (item.x < grid.bbox.x1 - pad || item.x + item.w > grid.bbox.x2 + pad) continue;
      if (gridW < 120 && item.x + item.w > grid.bbox.x2 - 2) continue;
      tableItems.push(item);
      usedItems.add(item);
    }
    const cells = grid.cells ?? extractCells(grid, horizontals, verticals);
    if (cells.length === 0) continue;
    const textItems = tableItems.map((i) => ({
      text: i.text,
      x: i.x,
      y: i.y,
      w: i.w,
      h: i.h,
      fontSize: i.fontSize,
      fontName: i.fontName,
      hasSpaceBefore: i.hasSpaceBefore,
      syntheticSpace: i.syntheticSpace,
      seq: i.seq
    }));
    const cellTextMap = mapTextToCells(textItems, cells);
    const assignedItems = /* @__PURE__ */ new Set();
    for (const arr of cellTextMap.values()) for (const it of arr) assignedItems.add(it);
    const numRows = grid.rowYs.length - 1;
    const numCols = grid.colXs.length - 1;
    const irGrid = Array.from(
      { length: numRows },
      () => Array.from({ length: numCols }, () => ({ text: "", colSpan: 1, rowSpan: 1 }))
    );
    let nestedAttached = false;
    for (const cell of cells) {
      const cellItems = cellTextMap.get(cell) || [];
      const nested = pendingNested.length ? takePendingNested(pendingNested, cell.bbox, !!grid.cells) : [];
      if (nested.length > 0) {
        nestedAttached = true;
        const built = buildFrameCellBlocks(cellItems, nested, pageNum, lex);
        irGrid[cell.row][cell.col] = { text: built.text, colSpan: cell.colSpan, rowSpan: cell.rowSpan, blocks: built.blocks };
        if (cellItems.length) recordCellLines(irGrid[cell.row][cell.col], cellItems);
        takeClipCellEdges(cell, irGrid[cell.row][cell.col]);
        continue;
      }
      irGrid[cell.row][cell.col] = {
        text: cleanCellText(cellTextToString(cellItems, { box: cell.bbox, lex })),
        colSpan: cell.colSpan,
        rowSpan: cell.rowSpan
      };
      if (numRows === 1 && numCols === 1 && cellItems.length) {
        irGrid[cell.row][cell.col].blocks = buildFrameCellBlocks(cellItems, [], pageNum, lex).blocks;
      }
      const b = cell.bbox;
      const isBackdrop = (r) => r.x1 <= b.x1 + 1 && r.x2 >= b.x2 - 1 && r.y1 <= b.y1 + 1 && r.y2 >= b.y2 - 1;
      if (imageRegions.some((r) => {
        const cx = (r.x1 + r.x2) / 2, cy = (r.y1 + r.y2) / 2;
        return cx > b.x1 && cx < b.x2 && cy > b.y1 && cy < b.y2 && !isBackdrop(r);
      })) {
        markImageCell(irGrid[cell.row][cell.col]);
      }
      if (cell.filler && !cellItems.length) FILLER_CELLS.add(irGrid[cell.row][cell.col]);
      if (cellItems.length) recordCellLines(irGrid[cell.row][cell.col], cellItems);
      takeClipCellEdges(cell, irGrid[cell.row][cell.col]);
    }
    let finalGrid = irGrid;
    let finalRows = numRows;
    let rebuiltUsed = false;
    const unitLine = !grid.cells && numRows >= 3 && numRows <= 5 && numCols >= 3 ? rebuildUnitLine(items, grid) : [];
    if (!grid.cells && numRows <= 5 && numCols >= 3 && !nestedAttached && (numRows <= 2 || unitLine.length > 0)) {
      const rebuilt = normalizeUndersegmentedTable(irGrid, grid.colXs, textItems, grid.rowYs);
      if (rebuilt) {
        rebuiltUsed = true;
        finalGrid = rebuilt.map((row) => row.map((rawText) => ({ text: cleanCellText(rawText), colSpan: 1, rowSpan: 1 })));
        finalRows = finalGrid.length;
      }
    }
    if (!rebuiltUsed) {
      for (let ti = 0; ti < textItems.length; ti++) {
        if (!assignedItems.has(textItems[ti])) usedItems.delete(tableItems[ti]);
      }
    }
    if (unitLine.length > 0 && rebuiltUsed && !/^\s*\(\s*단위\s*[:：]/.test(finalGrid[0]?.[0]?.text ?? "")) {
      prependUnitRow(finalGrid, numCols, unitLine, usedItems);
      finalRows++;
    }
    if (!rebuiltUsed && attachUnitRow(items, grid, finalGrid, numCols, usedItems)) finalRows++;
    let semanticOneColumn = false;
    if (!grid.cells && !nestedAttached && numCols === 1 && numGridRows >= 2) {
      const populatedRows = finalGrid.filter((row) => row[0]?.text.trim());
      if (populatedRows.length >= 4) {
        const fontSizes = tableItems.map((item) => item.fontSize).filter((size) => size > 0).sort((a, b) => a - b);
        const medianFont = fontSizes[Math.floor(fontSizes.length / 2)] ?? 0;
        const meanRowHeight = (grid.bbox.y2 - grid.bbox.y1) / populatedRows.length;
        semanticOneColumn = meanRowHeight <= Math.max(30, medianFont * 2.5);
      }
      if (!semanticOneColumn) {
        for (const it of tableItems) usedItems.delete(it);
        continue;
      }
      finalGrid = populatedRows;
      finalRows = finalGrid.length;
    }
    if (!grid.cells && !rebuiltUsed && numCols >= 2) {
      const head = headerLineAbove(items.filter((it) => !usedItems.has(it)), grid.colXs, grid.bbox.y2);
      if (head) {
        finalGrid.unshift(head.map((col) => ({ text: cleanCellText(cellTextToString(col.map((i) => ({
          text: i.text,
          x: i.x,
          y: i.y,
          w: i.w,
          h: i.h,
          fontSize: i.fontSize,
          fontName: i.fontName,
          hasSpaceBefore: i.hasSpaceBefore,
          syntheticSpace: i.syntheticSpace,
          seq: i.seq
        })))), colSpan: 1, rowSpan: 1 })));
        finalRows++;
        for (const col of head) for (const it of col) usedItems.add(it);
      }
    }
    let outCols = numCols;
    if (!grid.cells && !rebuiltUsed && numCols >= 3) {
      const colXs = [...grid.colXs];
      const fs = tableItems.map((item) => item.fontSize).filter((size) => size > 0).sort((a, b) => a - b);
      outCols -= mergeSliverColumns(finalGrid, colXs, (fs[fs.length >> 1] ?? 10) * 0.5);
      if (outCols !== numCols) grid.colXs = colXs;
    }
    const irTable = {
      rows: finalRows,
      cols: outCols,
      cells: finalGrid,
      hasHeader: finalRows > 1,
      ...semanticOneColumn ? { renderAsTable: true } : {}
    };
    if (grid.cells) {
      CLIP_TABLES.add(irTable);
      recordRowRules(irTable, grid.cells, grid.bbox, rawRules);
    }
    TABLE_COLXS.set(irTable, grid.colXs);
    if (grid.cells) recordFrameTitle(irTable, tableItems, pageNum);
    if (grid.cells && finalRows === numRows) TABLE_ROWYS.set(irTable, grid.rowYs);
    if (grid.continues) CONT_PARTS.set(irTable, grid.continues);
    const hasContent = finalGrid.some((row) => row.some((cell) => cell.text.trim() !== ""));
    const emptyPart = !hasContent && !!grid.cells && !grid.clipParent && !nestedAttached;
    if (!hasContent && !emptyPart) continue;
    if (emptyPart) EMPTY_PARTS.add(irTable);
    const ownItems = numCols === 1 ? new Set(tableItems) : null;
    if (ownItems && isSideTabTable(grid.bbox, irTable, items.filter((it) => !ownItems.has(it)), pageWidth, pageHeight)) {
      SIDE_TAB_TABLES.add(irTable);
      blocks.push({ type: "table", table: irTable, pageNumber: pageNum, bbox: { page: pageNum, x: grid.bbox.x1, y: grid.bbox.y1, width: gridW, height: grid.bbox.y2 - grid.bbox.y1 } });
      continue;
    }
    if (grid.clipParent) {
      const nb = { page: pageNum, x: grid.bbox.x1, y: grid.bbox.y1, width: grid.bbox.x2 - grid.bbox.x1, height: grid.bbox.y2 - grid.bbox.y1 };
      pendingNested.push({ parent: grid.clipParent, block: { type: "table", table: irTable, pageNumber: pageNum, bbox: nb } });
      continue;
    }
    if (!grid.cells && !nestedAttached && (isProseBoxGrid(grid, verticals, irTable) || ocrPage && isSparseProseGrid(irTable))) {
      for (const it of tableItems) usedItems.delete(it);
      continue;
    }
    if (!grid.cells && !nestedAttached && isChartTable(irTable)) {
      blocks.push(chartBlock(tableItems, pageNum, { page: pageNum, x: grid.bbox.x1, y: grid.bbox.y1, width: gridW, height: grid.bbox.y2 - grid.bbox.y1 }));
      continue;
    }
    const tableBbox = {
      page: pageNum,
      x: grid.bbox.x1,
      y: grid.bbox.y1,
      width: grid.bbox.x2 - grid.bbox.x1,
      height: grid.bbox.y2 - grid.bbox.y1
    };
    if (numRows === 1 && numCols === 1 && gridW < pageWidth * 0.35) {
      const prose = finalGrid[0]?.[0]?.text ?? "";
      const besideLines = (side) => new Set(side.map((it) => Math.round(it.y / 3))).size;
      const rightLines = items.filter((it) => it.x >= grid.bbox.x2 + 3 && it.y >= grid.bbox.y1 && it.y <= grid.bbox.y2);
      const leftLines = items.filter((it) => it.x + it.w <= grid.bbox.x1 - 3 && it.y >= grid.bbox.y1 && it.y <= grid.bbox.y2);
      if (prose.length >= 200 && prose.split("\n").length >= 8 && (besideLines(rightLines) >= 8 || besideLines(leftLines) >= 8) || gridW < pageWidth * 0.25 && besideLines(leftLines) >= 8 && besideLines(rightLines) === 0) {
        const sidebar = {
          type: "paragraph",
          text: prose,
          pageNumber: pageNum,
          bbox: tableBbox,
          style: dominantStyle(tableItems)
        };
        blocks.push(sidebar);
        proseSidebars.add(sidebar);
        SIDEBAR_ITEMS.set(sidebar, tableItems);
        continue;
      }
    }
    if (!grid.cells && !nestedAttached && shouldDemoteTable(irTable)) {
      const paragraphs = numRows === 1 && numCols === 1 ? irTable.cells[0]?.[0]?.blocks : void 0;
      if (paragraphs?.length) {
        blocks.push(...paragraphs);
        frameParagraphUnits.push(paragraphs);
        recordFrameReadingUnit(paragraphs, tableBbox);
        continue;
      }
      const demoted = demoteTableToText(irTable);
      if (demoted) {
        const text = numGridRows === 1 ? "\n" + demoted + "\n" : demoted;
        blocks.push({ type: "paragraph", text, pageNumber: pageNum, bbox: tableBbox, style: dominantStyle(tableItems) });
      }
      continue;
    }
    if (grid.lineNested) {
      pendingNested.push({ parent: grid.bbox, block: { type: "table", table: irTable, pageNumber: pageNum, bbox: tableBbox }, contained: true });
      continue;
    }
    blocks.push({ type: "table", table: irTable, pageNumber: pageNum, bbox: tableBbox });
  }
  for (const p of pendingNested) blocks.push(p.block);
  let remaining = items.filter((i) => !usedItems.has(i));
  const groupSizes = [];
  let finalTextBlocks = [];
  let gutterX = null;
  let panels = null;
  if (remaining.length > 0) {
    remaining.sort((a, b) => b.y - a.y || a.x - b.x);
    const clusterItems = remaining.map((i) => ({
      text: i.text,
      x: i.x,
      y: i.y,
      w: i.w,
      h: i.h,
      fontSize: i.fontSize,
      fontName: i.fontName,
      hasSpaceBefore: i.hasSpaceBefore,
      syntheticSpace: i.syntheticSpace
    }));
    const proseColumns = findTwoColumnProseCutX(clusterItems) !== null || detectPersistentColumnGutter(remaining.map((i) => ({ x: i.x, y: i.y, w: i.w, h: i.h > 0 ? i.h : i.fontSize }))) !== null;
    const clusterResults = (proseColumns ? [] : detectClusterTables(clusterItems, pageNum)).filter((cr) => {
      const b = cr.bbox;
      return !blocks.some((x) => x.type === "paragraph" && x.bbox && (x.text?.match(new RegExp("\\p{L}", "gu"))?.length ?? 0) >= 10 && Math.min(x.bbox.x + x.bbox.width, b.x + b.width) - Math.max(x.bbox.x, b.x) >= 0.8 * b.width && x.bbox.y >= b.y - 2 && x.bbox.y + x.bbox.height <= b.y + b.height + 2);
    });
    if (clusterResults.length > 0) {
      const ciToIdx = /* @__PURE__ */ new Map();
      for (let ci = 0; ci < clusterItems.length; ci++) ciToIdx.set(clusterItems[ci], ci);
      const usedClusterIndices = /* @__PURE__ */ new Set();
      for (const cr of clusterResults) {
        for (const ci of cr.usedItems) {
          const idx = ciToIdx.get(ci);
          if (idx !== void 0) usedClusterIndices.add(idx);
        }
        blocks.push(clusterTableBlock(cr, remaining.filter((_, idx) => cr.usedItems.has(clusterItems[idx])), pageNum, horizontals));
      }
      remaining = remaining.filter((_, idx) => !usedClusterIndices.has(idx));
    }
  }
  {
    const rects = remaining.map((i) => ({ x: i.x, y: i.y, w: i.w, h: i.h > 0 ? i.h : i.fontSize }));
    for (const b of frameLayoutBoxes(blocks.filter((b2) => !(b2.table && EMPTY_PARTS.has(b2.table))))) rects.push({ x: b.x, y: b.y, w: b.width, h: b.height });
    gutterX = detectColumnGutter(rects) ?? findRuledColumnDivider(
      blocks.filter((b) => b.type === "table" && b.bbox && b.table && !EMPTY_PARTS.has(b.table)).map((b) => ({ x: b.bbox.x, y: b.bbox.y, w: b.bbox.width, h: b.bbox.height })),
      horizontals,
      verticals,
      pageWidth,
      pageHeight
    );
    if (gutterX === null) panels = detectPanelGutters(rects);
  }
  if (remaining.length > 0) {
    if (gutterX !== null) {
      const gx = gutterX;
      const spanning = detectListBlocks(takeFrameSpanningText(remaining, gx, pageNum, lex));
      for (const block of spanning) {
        finalTextBlocks.push(block);
        groupSizes.push(1);
      }
      const allY = remaining.map((i) => i.y);
      const pageH = safeMax(allY) - safeMin(allY);
      const gapThreshold = Math.max(15, pageH * 0.03);
      const sides = frameColumnTextBands(remaining, spanning, gx);
      const textBlocks = [];
      for (const side of sides) {
        if (side.length === 0) continue;
        for (const group of xyCutOrder(side, gapThreshold)) {
          if (group.length === 0) continue;
          const groupBlocks = extractPageBlocksFallback(group, pageNum, false, true, lex);
          for (const b of groupBlocks) textBlocks.push(b);
          groupSizes.push(groupBlocks.length);
        }
      }
      finalTextBlocks.push(...detectListBlocks(textBlocks));
    } else {
      const allY = remaining.map((i) => i.y);
      const pageH = safeMax(allY) - safeMin(allY);
      const groups = xyCutOrder(remaining, Math.max(15, pageH * 0.03));
      const textBlocks = [];
      for (const group of groups) {
        if (group.length === 0) continue;
        const besideProsePanel = [...proseSidebars].some((sidebar) => sidebar.bbox && group.every((item) => item.x >= sidebar.bbox.x + sidebar.bbox.width + 3) && new Set(group.filter((item) => item.y >= sidebar.bbox.y && item.y <= sidebar.bbox.y + sidebar.bbox.height).map((item) => Math.round(item.y / 3))).size >= 8);
        const groupBlocks = extractPageBlocksFallback(group, pageNum, false, !besideProsePanel, lex);
        for (const b of groupBlocks) textBlocks.push(b);
        groupSizes.push(groupBlocks.length);
      }
      finalTextBlocks = detectListBlocks(textBlocks);
    }
  }
  const units = groupFrameParagraphUnits(groupFlowBoxUnits(blocks, grids, horizontals, verticals, verifiedRightArrows), frameParagraphUnits);
  let off = 0;
  for (const size of groupSizes) {
    const unit = finalTextBlocks.slice(off, off + size);
    off += size;
    if (unit.length > 0) units.push(unit);
  }
  const unitTopY = (u) => {
    let top = 0;
    for (const b of u) {
      if (b.bbox && b.bbox.y + b.bbox.height > top) top = b.bbox.y + b.bbox.height;
    }
    return top;
  };
  if (panels && units.length > 1) {
    const unitBox = (u) => {
      const bs = u.filter((b) => b.bbox).map((b) => b.bbox);
      if (!bs.length) return { x: -1e6, y: 0, w: 2e6, h: 0 };
      const x = Math.min(...bs.map((b) => b.x)), y = Math.min(...bs.map((b) => b.y));
      return { x, y, w: Math.max(...bs.map((b) => b.x + b.width)) - x, h: Math.max(...bs.map((b) => b.y + b.height)) - y };
    };
    const ordered2 = [];
    for (const u of orderByPanels(units, unitBox, panels)) for (const b of u) ordered2.push(b);
    return mergeAdjacentTableBlocks(ordered2);
  }
  if (gutterX !== null && units.length > 1) {
    const gx = gutterX;
    const unitRect = (u) => {
      let minX = Infinity, minY = Infinity, maxR = -Infinity, maxT = -Infinity;
      for (const b of u) {
        if (!b.bbox) continue;
        if (b.bbox.x < minX) minX = b.bbox.x;
        if (b.bbox.y < minY) minY = b.bbox.y;
        if (b.bbox.x + b.bbox.width > maxR) maxR = b.bbox.x + b.bbox.width;
        if (b.bbox.y + b.bbox.height > maxT) maxT = b.bbox.y + b.bbox.height;
      }
      if (!Number.isFinite(minX)) return { x: gx - 1, y: 0, w: 2, h: 0 };
      return { x: minX, y: minY, w: maxR - minX, h: maxT - minY };
    };
    const ordered2 = [];
    for (const u of orderByGutter(units, unitRect, gx)) for (const b of u) ordered2.push(b);
    return mergeAdjacentTableBlocks(ordered2);
  }
  if (pageWidth > pageHeight * 1.2 && units.length > 1) {
    const mid = pageWidth / 2;
    const sideOf = (unit) => {
      let left2 = false, right2 = false;
      for (const block of unit) {
        if (!block.bbox) return 0;
        if (block.bbox.x + block.bbox.width <= mid) left2 = true;
        else if (block.bbox.x >= mid) right2 = true;
        else return 0;
      }
      return left2 && !right2 ? -1 : right2 && !left2 ? 1 : 0;
    };
    const left = units.filter((u) => sideOf(u) === -1);
    const right = units.filter((u) => sideOf(u) === 1);
    if (left.length >= 2 && right.length >= 2 && left.length + right.length === units.length && left.some((u) => u.some((b) => b.type === "table")) && right.some((u) => u.some((b) => b.type === "table"))) {
      const flatten = (side) => side.sort((a, b) => unitTopY(b) - unitTopY(a)).flat();
      return [...mergeAdjacentTableBlocks(flatten(left)), ...mergeAdjacentTableBlocks(flatten(right))];
    }
  }
  units.sort((a, b) => unitTopY(b) - unitTopY(a));
  for (const sidebar of proseSidebars) {
    const box = sidebar.bbox;
    const sidebarIndex = units.findIndex((unit) => unit.includes(sidebar));
    const peerIndex = units.findIndex((unit) => unit.some((b) => b.type === "paragraph" && b.text && b.text.length >= 200 && b.bbox && b.bbox.x >= box.x + box.width + 3 && Math.max(0, Math.min(box.y + box.height, b.bbox.y + b.bbox.height) - Math.max(box.y, b.bbox.y)) >= Math.min(box.height, b.bbox.height) * 0.6));
    if (sidebarIndex > peerIndex && peerIndex >= 0) {
      const [unit] = units.splice(sidebarIndex, 1);
      units.splice(peerIndex, 0, unit);
      continue;
    }
    let lastLeft = -1;
    units.forEach((unit, index) => {
      if (isProseBesidePanel(unit, box)) lastLeft = index;
    });
    const current = units.findIndex((unit) => unit.includes(sidebar));
    if (lastLeft > current) {
      const [unit] = units.splice(current, 1);
      units.splice(lastLeft, 0, unit);
    }
  }
  const ordered = [];
  for (const u of units) for (const b of u) {
    const panel = SIDEBAR_ITEMS.get(b);
    if (panel) ordered.push(...panelBlocks(panel, b, pageNum));
    else ordered.push(b);
  }
  return mergeAdjacentTableBlocks(ordered);
}
function isProseBesidePanel(unit, box) {
  const beside = (b) => !!b.bbox && b.bbox.x + b.bbox.width <= box.x - 3 && b.bbox.y + b.bbox.height >= box.y && b.bbox.y <= box.y + box.height;
  return unit.some(beside) && unit.every((b) => beside(b) || !!b.bbox && b.bbox.y < box.y);
}
var SIDEBAR_ITEMS = /* @__PURE__ */ new WeakMap();
function clusterTableBlock(cr, source, pageNum, horizontals = []) {
  const b = cr.bbox;
  const ruled = horizontals.filter((h) => h.y1 > b.y && h.y1 < b.y + b.height && Math.min(h.x2, b.x + b.width) - Math.max(h.x1, b.x) >= b.width * 0.6).length >= 3;
  if (!ruled && isTableOfContents(cr.table)) return tocBlock(cr.table, pageNum, cr.bbox, dominantStyle(source));
  if (isChartTable(cr.table)) return chartBlock(source, pageNum, cr.bbox);
  if (isFormulaTable(cr.table)) return chartBlock(source, pageNum, cr.bbox);
  if (isExamLayoutTable(cr.table)) return { ...chartBlock(source, pageNum, cr.bbox), text: groupByY(source).map((line) => mergeLineSimple(line).trim()).filter(Boolean).join("\n") };
  return { type: "table", table: cr.table, pageNumber: pageNum, bbox: cr.bbox };
}
function chartBlock(source, pageNum, bbox) {
  const text = groupByY(source).map((line) => mergeLineSimple(line).replace(/\s+/g, " ").trim()).filter(Boolean).join(" ");
  return { type: "paragraph", text, pageNumber: pageNum, bbox, style: dominantStyle(source) };
}
var STACKED_ROWS = /* @__PURE__ */ new WeakSet();
function isStackedClipRow(upper, ub, lower, lb) {
  if (!CLIP_TABLES.has(upper) || !CLIP_TABLES.has(lower) || upper.cols < 2 || upper.cols !== lower.cols || lower.rows !== 1 || !STACKED_ROWS.has(upper) && upper.rows !== 1 || CONT_PARTS.has(upper) || CONT_PARTS.has(lower) || EMPTY_PARTS.has(upper) || EMPTY_PARTS.has(lower) || ub.page !== lb.page) return false;
  const ux = TABLE_COLXS.get(upper), lx = TABLE_COLXS.get(lower);
  if (!ux || !lx || ux.length !== lx.length || ux.some((x, i) => Math.abs(x - lx[i]) > 1)) return false;
  const gap = ub.y - (lb.y + lb.height);
  return gap >= -1 && gap <= Math.min(12, Math.min(ub.height, lb.height) * 0.5);
}
function mergeAdjacentTableBlocks(blocks) {
  if (blocks.length <= 1) return blocks;
  const result = [blocks[0]];
  for (let i = 1; i < blocks.length; i++) {
    const prev = result[result.length - 1];
    const curr = blocks[i];
    const clipRows = prev.type === "table" && curr.type === "table" && prev.table && curr.table && prev.bbox && curr.bbox && isStackedClipRow(prev.table, prev.bbox, curr.table, curr.bbox);
    if (clipRows) {
      const merged = {
        rows: prev.table.rows + curr.table.rows,
        cols: prev.table.cols,
        cells: [...prev.table.cells, ...curr.table.cells],
        hasHeader: prev.table.hasHeader
      };
      CLIP_TABLES.add(merged);
      STACKED_ROWS.add(merged);
      TABLE_COLXS.set(merged, TABLE_COLXS.get(prev.table));
      const pb = prev.bbox, cb = curr.bbox;
      result[result.length - 1] = {
        ...prev,
        table: merged,
        bbox: { ...pb, y: cb.y, height: pb.y + pb.height - cb.y }
      };
    } else if (prev.type === "table" && curr.type === "table" && prev.table && curr.table && prev.table.cols === curr.table.cols && prev.table.renderAsTable === curr.table.renderAsTable && !CLIP_TABLES.has(prev.table) && !CLIP_TABLES.has(curr.table) && !separateRepeatedHeadings(prev, curr)) {
      const merged = {
        rows: prev.table.rows + curr.table.rows,
        cols: prev.table.cols,
        cells: [...prev.table.cells, ...curr.table.cells],
        hasHeader: prev.table.hasHeader,
        ...prev.table.renderAsTable ? { renderAsTable: true } : {}
      };
      result[result.length - 1] = { ...prev, table: merged };
    } else {
      result.push(curr);
    }
  }
  return result;
}
function separateRepeatedHeadings(upper, lower) {
  const u = upper.table, d = lower.table, ub = upper.bbox, db = lower.bbox;
  if (!ub || !db || ub.page !== db.page || u.rows < 2 || d.rows < 2 || !u.hasHeader || !d.hasHeader || ub.y - (db.y + db.height) <= 1 || Math.abs(ub.x - db.x) > 1 || Math.abs(ub.width - db.width) > 1) return false;
  const a = u.cells[0], b = d.cells[0], norm = (text) => text.replace(/<\/?u>|~~|\s+/g, "");
  return a.filter((cell) => norm(cell.text)).length >= 2 && a.length === b.length && a.every((cell, c) => cell.colSpan === b[c].colSpan && cell.rowSpan === b[c].rowSpan && norm(cell.text) === norm(b[c].text));
}
function streamLines(items) {
  if (items.some((i) => i.seq === void 0)) return groupByY([...items].sort((a, b) => b.y - a.y || a.x - b.x));
  const lines = [];
  let cur = [];
  for (const it of [...items].sort((a, b) => a.seq - b.seq)) {
    const last = cur[cur.length - 1];
    if (last && (Math.abs(it.y - last.y) > 3 || it.x < last.x - 1 || it.x - (last.x + last.w) > Math.max(2 * it.fontSize, 30))) {
      lines.push(cur);
      cur = [];
    }
    cur.push(it);
  }
  if (cur.length) lines.push(cur);
  return lines;
}
function columnTextToBlocks(text, pageNum, bbox, style) {
  const lines = text.split("\n");
  const blocks = [];
  const prose = [];
  const flushProse = () => {
    const content = prose.join("\n").trim();
    if (content) blocks.push({ type: "paragraph", text: content, pageNumber: pageNum, bbox, style });
    prose.length = 0;
  };
  const cells = (line) => line.trim().slice(1, -1).split(/(?<!\\)\|/).map((c) => c.trim().replace(/\\\|/g, "|"));
  const tableLine = (line) => /^\|.*\|\s*$/.test(line.trim());
  for (let i = 0; i < lines.length; ) {
    if (tableLine(lines[i]) && i + 2 < lines.length && tableLine(lines[i + 1]) && cells(lines[i + 1]).every((c) => /^:?-{3,}:?$/.test(c))) {
      let end = i + 2;
      while (end < lines.length && tableLine(lines[end])) end++;
      const rows = [cells(lines[i]), ...lines.slice(i + 2, end).map(cells)];
      const cols = rows[0].length;
      const values = rows.slice(1).flat().filter(Boolean);
      const numeric = values.filter((value) => value.length <= 24 && /\d/.test(value)).length;
      if (cols >= 3 && rows.length >= 3 && rows.every((row) => row.length === cols) && rows[0].every((value) => value.length <= 80) && numeric >= 3 && numeric / values.length >= 0.25) {
        flushProse();
        blocks.push({ type: "table", pageNumber: pageNum, bbox, table: {
          rows: rows.length,
          cols,
          hasHeader: true,
          cells: rows.map((row) => row.map((value) => ({ text: value, rowSpan: 1, colSpan: 1 })))
        } });
        i = end;
        continue;
      }
    }
    if (tableLine(lines[i])) {
      const cellTexts = cells(lines[i]);
      if (!cellTexts.every((c) => /^:?-{3,}:?$/.test(c))) prose.push(cellTexts.filter(Boolean).join(" "));
    } else prose.push(lines[i]);
    i++;
  }
  flushProse();
  return blocks;
}
function persistentGutter(textRects) {
  const cut = detectPersistentColumnGutter(textRects);
  if (cut === null) return null;
  const whole = detectColumnGutter(textRects);
  return whole !== null && Math.abs(whole - cut) > 10 ? whole : cut;
}
function extractPageBlocksFallback(items, pageNum, fullPage = false, detectTables = true, lex, figures = []) {
  if (items.length === 0) return [];
  if (fullPage && detectTables) {
    const bands = stackedTableBands(items);
    if (bands) {
      const blocks2 = [];
      for (let i = 0; i < bands.tables.length; i++) {
        blocks2.push(...extractPageBlocksFallback(bands.tables[i], pageNum, false, true, lex));
        if (i < bands.between.length) blocks2.push(...extractPageBlocksFallback(bands.between[i], pageNum, false, false, lex));
      }
      blocks2.push(...extractPageBlocksFallback(bands.caption, pageNum, false, false, lex));
      blocks2.push(...extractPageBlocksFallback(bands.body, pageNum, true, true, lex));
      return blocks2;
    }
  }
  if (fullPage) {
    const infographic = threeColumnInfographic(items);
    if (infographic) return infographic.flatMap((group) => extractPageBlocksFallback(group, pageNum, false, detectTables, lex));
    const cards = threeColumnCards(items);
    if (cards) return cards.flatMap((group) => extractPageBlocksFallback(group, pageNum, false, detectTables, lex));
  }
  const blocks = [];
  const clusterItems = items.map((i) => ({
    text: i.text,
    x: i.x,
    y: i.y,
    w: i.w,
    h: i.h,
    fontSize: i.fontSize,
    fontName: i.fontName,
    hasSpaceBefore: i.hasSpaceBefore,
    syntheticSpace: i.syntheticSpace
  }));
  const textRects = items.map((i) => ({ x: i.x, y: i.y, w: i.w, h: i.h > 0 ? i.h : i.fontSize }));
  const imagePanels = fullPage ? splitImagePanels(items, figures) : null;
  if (imagePanels) return imagePanels.flatMap((group) => extractPageBlocksFallback(group, pageNum, false, detectTables, lex));
  const earlyProseCut = fullPage && detectTables ? findTwoColumnProseCutX(clusterItems) ?? persistentGutter(textRects) ?? (figures.length > 0 ? detectColumnGutter([...textRects, ...figures]) : null) : null;
  if (earlyProseCut !== null) {
    const band = topTableBand(items);
    if (band) {
      const tiered = tieredHeaderTable(band.top, pageNum);
      return [
        ...tiered ? [tiered] : extractPageBlocksFallback(band.top, pageNum, false, detectTables, lex),
        ...extractPageBlocksFallback(band.rest, pageNum, true, detectTables, lex)
      ];
    }
    return splitTwoColumnProse(items, earlyProseCut).flatMap((group) => extractPageBlocksFallback(group, pageNum, false, detectTables, lex));
  }
  if (fullPage && detectTables && figures.length > 0) {
    const bands = figureColumnBands(items, figures);
    if (bands) return bands.flatMap((group) => extractPageBlocksFallback(group, pageNum, false, detectTables, lex));
  }
  if (fullPage && detectTables) {
    const sidebar = splitSidebarTitleRegion(items);
    if (sidebar) return sidebar.flatMap((region, index) => extractPageBlocksFallback(region, pageNum, false, index === 2 ? false : detectTables, lex));
    const regions = splitTrailingColumnRegion(items);
    if (regions) return regions.flatMap((region) => extractPageBlocksFallback(region, pageNum, false, detectTables, lex));
  }
  const rejected = { prose: 0 };
  const clusterResults = detectTables ? detectClusterTables(clusterItems, pageNum, rejected) : [];
  if (clusterResults.length > 0) {
    const ciToIdx = /* @__PURE__ */ new Map();
    for (let ci = 0; ci < clusterItems.length; ci++) ciToIdx.set(clusterItems[ci], ci);
    const usedIndices = /* @__PURE__ */ new Set();
    for (const cr of clusterResults) {
      for (const ci of cr.usedItems) {
        const idx = ciToIdx.get(ci);
        if (idx !== void 0) usedIndices.add(idx);
      }
      blocks.push(clusterTableBlock(cr, items.filter((_, idx) => cr.usedItems.has(clusterItems[idx])), pageNum));
    }
    const remaining = items.filter((_, idx) => !usedIndices.has(idx));
    if (remaining.length > 0) pushLineParagraphs(blocks, mergeSuperscriptLines(groupByY(remaining)), pageNum, lex);
    blocks.sort((a, b) => {
      const ay = a.bbox ? a.bbox.y + a.bbox.height : 0;
      const by = b.bbox ? b.bbox.y + b.bbox.height : 0;
      return by - ay;
    });
  } else {
    let proseCutX = fullPage ? findTwoColumnProseCutX(items) : null;
    if (proseCutX === null && fullPage) {
      proseCutX = detectColumnGutter(items.map((i) => ({ x: i.x, y: i.y, w: i.w, h: i.h > 0 ? i.h : i.fontSize })));
    }
    const allYLines = mergeSuperscriptLines(groupByY(items));
    const columns = proseCutX !== null || !detectTables || rejected.prose > 0 ? null : detectColumns(allYLines);
    if (columns && columns.length >= 3) {
      const tableText = extractWithColumns(allYLines, columns);
      const bbox = computeBBox(items, pageNum);
      blocks.push(...columnTextToBlocks(tableText, pageNum, bbox, dominantStyle(items)));
    } else {
      const allY = items.map((i) => i.y);
      const pageHeight = safeMax(allY) - safeMin(allY);
      const gapThreshold = Math.max(15, pageHeight * 0.03);
      const orderedGroups = proseCutX !== null ? splitTwoColumnProse(items, proseCutX) : xyCutOrder(items, gapThreshold);
      for (const group of orderedGroups) {
        if (group.length === 0) continue;
        const yLines = mergeSuperscriptLines(groupByY(group));
        const groupColumns = detectTables ? detectColumns(yLines) : null;
        if (groupColumns && groupColumns.length >= 3) {
          const tableText = extractWithColumns(yLines, groupColumns);
          const bbox = computeBBox(group, pageNum);
          blocks.push(...columnTextToBlocks(tableText, pageNum, bbox, dominantStyle(group)));
        } else {
          pushLineParagraphs(blocks, yLines, pageNum, lex);
        }
      }
    }
  }
  return detectTables ? detectSpecialKoreanTables(blocks) : blocks;
}

export {
  OCR_DET_MODEL,
  OCR_REC_MODEL,
  OCR_REC_DICT,
  getOcrModelsDir,
  ensureOcrModels,
  ocrModelsCached,
  parseCharacterDict,
  extractLines,
  extractImageRegions,
  WrapLexicon,
  startsNewItem,
  wrapJoiner,
  joinPageBreakWraps,
  splitPageBreakWraps,
  latinSoftWrap,
  filterHiddenText,
  collapseEvenSpacing,
  computeBBox,
  dominantStyle,
  normalizeItems,
  groupByY,
  mergeLineSimple,
  computeMedianFontSizeFromFreq,
  detectHeadings,
  mergeStackedHeadingLines,
  detectTypographyHeadings,
  detectDocumentStyleHeadings,
  detectSiblingStyleHeadings,
  detectRepeatedPageLabels,
  detectPageLeadHeadings,
  refineDocumentStyleHeadings,
  detectMarkerHeadings,
  detectTableCaptions,
  detectKoreanListBlocks,
  removeHeaderFooterBlocks,
  CLIP_TABLES,
  FRAME_TITLE_BLOCKS,
  TABLE_COLXS,
  TABLE_ROWYS,
  TABLE_TAIL,
  PART_COLXS,
  EMPTY_PARTS,
  IMAGE_CELLS,
  FILLER_CELLS,
  CONT_PARTS,
  CELL_LINES,
  ROW_RULES,
  trimTrailingEmptyTableCols,
  restoreImageBullets,
  detectRightArrowRegions,
  removeSideTabs,
  TOC_BLOCKS,
  NO_EDGES,
  joinCellEdges,
  FRAME_READING_UNITS,
  recordFrameReadingUnit,
  extractPageBlocksWithLines
};
