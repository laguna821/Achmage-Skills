import {createRequire as __coreCreateRequire} from "node:module"; const require=__coreCreateRequire(import.meta.url); import {extensionUrl as __extensionUrl,extensionPath as __extensionPath} from "./extensions.mjs";
import {
  CELL_LINES,
  CLIP_TABLES,
  CONT_PARTS,
  EMPTY_PARTS,
  FILLER_CELLS,
  FRAME_READING_UNITS,
  FRAME_TITLE_BLOCKS,
  IMAGE_CELLS,
  NO_EDGES,
  PART_COLXS,
  ROW_RULES,
  TABLE_COLXS,
  TABLE_ROWYS,
  TABLE_TAIL,
  TOC_BLOCKS,
  WrapLexicon,
  collapseEvenSpacing,
  computeBBox,
  computeMedianFontSizeFromFreq,
  detectDocumentStyleHeadings,
  detectHeadings,
  detectKoreanListBlocks,
  detectMarkerHeadings,
  detectPageLeadHeadings,
  detectRepeatedPageLabels,
  detectRightArrowRegions,
  detectSiblingStyleHeadings,
  detectTableCaptions,
  detectTypographyHeadings,
  dominantStyle,
  extractImageRegions,
  extractLines,
  extractPageBlocksWithLines,
  filterHiddenText,
  groupByY,
  joinCellEdges,
  joinPageBreakWraps,
  latinSoftWrap,
  mergeLineSimple,
  mergeStackedHeadingLines,
  normalizeItems,
  ocrModelsCached,
  recordFrameReadingUnit,
  refineDocumentStyleHeadings,
  removeHeaderFooterBlocks,
  removeSideTabs,
  restoreImageBullets,
  splitPageBreakWraps,
  startsNewItem,
  trimTrailingEmptyTableCols,
  wrapJoiner
} from "./chunk-4KEIBFBR.mjs";
import "./chunk-IF2FUB7X.mjs";
import {
  blocksToPages,
  encodePng
} from "./chunk-VJBJ2GTC.mjs";
import {
  hasRequestedPagesAfter,
  parsePageRange
} from "./chunk-WT3MK4B4.mjs";
import {
  CELL_EDGES,
  CONTENT_CELLS,
  WINGDINGS,
  blocksToMarkdown,
  escapeLiteralDollar,
  escapeLiteralTags,
  stripScriptTags,
  unframeLayoutTables
} from "./chunk-HW7SKSEC.mjs";
import {
  KordocError,
  sanitizeHref
} from "./chunk-PZTNOUTU.mjs";
import "./chunk-3T6O35FL.mjs";

// node_modules/kordoc/dist/parser-Z6PHB54O.js
import { createHash } from "crypto";
const { OPS, ImageKind } = await import(__extensionUrl("pdfjs-dist/legacy/build/pdf.mjs"));
const { OPS:OPS2 } = await import(__extensionUrl("pdfjs-dist/legacy/build/pdf.mjs"));
const { OPS:OPS3, normalizeUnicode } = await import(__extensionUrl("pdfjs-dist/legacy/build/pdf.mjs"));
const { OPS:OPS4, normalizeUnicode:normalizeUnicode2 } = await import(__extensionUrl("pdfjs-dist/legacy/build/pdf.mjs"));
const { OPS:OPS5, normalizeUnicode:normalizeUnicode3 } = await import(__extensionUrl("pdfjs-dist/legacy/build/pdf.mjs"));
const pdfjsWorker = await import(__extensionUrl("pdfjs-dist/legacy/build/pdf.worker.mjs"));
const { getDocument, GlobalWorkerOptions, OPS:OPS6 } = await import(__extensionUrl("pdfjs-dist/legacy/build/pdf.mjs"));
import { createRequire } from "module";
import { dirname, join } from "path";
function mergeOcrImageRegions(blocks, page, regions, ocrBlocks) {
  let added = 0;
  for (const region of regions) {
    const candidates = ocrBlocks.filter((block) => {
      const b = block.bbox;
      if (!b || b.page !== page || block.type !== "table" && block.type !== "paragraph") return false;
      const overlapW = Math.max(0, Math.min(b.x + b.width, region.x2) - Math.max(b.x, region.x1));
      const overlapH = Math.max(0, Math.min(b.y + b.height, region.y2) - Math.max(b.y, region.y1));
      return overlapW * overlapH >= b.width * b.height * 0.8;
    });
    const labels = candidates.filter((b) => b.type === "paragraph" && b.bbox.height <= 24 && (b.text?.match(/[\p{L}\p{N}]/gu)?.length ?? 0) >= 2);
    const axisFragments = rotatedAxisFragments(candidates);
    const accepted = candidates.filter((b) => {
      if (b.type === "paragraph") return (b.text?.match(/[\p{L}\p{N}]/gu)?.length ?? 0) >= 2 || !axisFragments.has(b) && supportedDiagramLabel(b, labels, region);
      const t = b.table;
      if (b.type !== "table" || !t) return false;
      if (t.rows === 1 && t.cols === 1) {
        const text = t.cells[0]?.[0]?.text ?? "";
        return (text.match(/\n/g)?.length ?? 0) >= 5 && (text.match(/\d/g)?.length ?? 0) >= text.length * 0.25;
      }
      const headerLabels = t.cells[0]?.filter((c) => c.text.replace(/[^A-Za-z가-힣]/g, "").length >= 2).length ?? 0;
      return t.rows >= 2 && t.cols >= 2 && headerLabels >= t.cols * 0.75 && t.cells.slice(1).some((row) => row.filter((c) => c.text.trim()).length >= 2);
    });
    const selected = candidates.flatMap((b) => accepted.includes(b) ? [b] : b.type === "table" && b.table ? rowParagraphs(b).filter((p) => /[\p{L}\p{N}]{2}/u.test(p.text ?? "")) : []);
    const hasOriginal = (block) => blocks.some((existing) => {
      const b = block.bbox;
      if (existing.pageNumber !== page || !existing.bbox || existing.type === "image") return false;
      const e = existing.bbox;
      const x = Math.max(0, Math.min(e.x + e.width, b.x + b.width) - Math.max(e.x, b.x));
      const y = Math.max(0, Math.min(e.y + e.height, b.y + b.height) - Math.max(e.y, b.y));
      return x * y > b.width * b.height * 0.2;
    });
    const selectedSet = new Set(selected), seen = /* @__PURE__ */ new Set();
    for (const block of selected) {
      if (seen.has(block)) continue;
      const frame = FRAME_READING_UNITS.get(block);
      const source = frame?.blocks.every((member) => selectedSet.has(member)) ? frame.blocks : [block];
      source.forEach((member) => seen.add(member));
      const available = source.filter((member) => !hasOriginal(member));
      const units = frame && available.length === source.length && source === frame.blocks ? [{ blocks: available, bbox: frame.bbox, atomic: true }] : available.map((member) => ({ blocks: [member], bbox: member.bbox, atomic: false }));
      for (const unit of units) {
        const b = unit.bbox;
        const index = blocks.findIndex((existing) => {
          const e = FRAME_READING_UNITS.get(existing)?.bbox ?? existing.bbox;
          if (existing.pageNumber !== page || !e) return false;
          const beside = e.y < region.y2 && e.y + e.height > region.y1 && e.x >= region.x2 - 1;
          return e.y < b.y || beside;
        });
        const placed = unit.blocks.map((member) => member.type === "paragraph" ? { ...member, style: void 0 } : member);
        if (unit.atomic) recordFrameReadingUnit(placed, unit.bbox);
        blocks.splice(index < 0 ? blocks.length : index, 0, ...placed);
        added += placed.length;
      }
    }
  }
  return added;
}
function supportedDiagramLabel(block, labels, region) {
  const b = block.bbox, text = block.text?.trim() ?? "";
  if (!b || !/^[\p{L}\p{N}]$/u.test(text) || b.height < 4 || b.width < 1 || b.width > b.height * 2 || b.x < region.x1 || b.y < region.y1 || b.x + b.width > region.x2 || b.y + b.height > region.y2 || b.width * b.height > (region.x2 - region.x1) * (region.y2 - region.y1) * 5e-3 || labels.length < 3 || !labels.some((l) => new RegExp("\\p{L}{3}", "u").test(l.text ?? "")) || labels.filter((l) => !new RegExp("\\p{L}", "u").test(l.text ?? "") && (l.text?.match(new RegExp("\\p{N}", "gu"))?.length ?? 0) >= 2).length < 2) return false;
  let above = false, below = false;
  for (const label of labels) {
    const a = label.bbox, em = Math.max(b.height, a.height);
    if (b.x + b.width < a.x - em * 2 || b.x > a.x + a.width + em * 2) continue;
    const upperGap = a.y - (b.y + b.height), lowerGap = b.y - (a.y + a.height);
    if (upperGap >= 0 && upperGap <= em * 4) above = true;
    if (lowerGap >= 0 && lowerGap <= em * 4) below = true;
  }
  return above && below;
}
function rotatedAxisFragments(candidates) {
  const paragraphs = candidates.filter((b) => b.type === "paragraph" && b.bbox.height <= 24);
  const axes = [];
  for (const block of paragraphs) {
    const b = block.bbox, text = block.text?.trim() ?? "";
    if (!/^[\d\s.,%+−-]+$/u.test(text) || !/\d/u.test(text) || b.width > b.height * 6) continue;
    const axis = axes.find((a) => Math.abs(a[0].bbox.x + a[0].bbox.width - b.x - b.width) <= Math.max(a[0].bbox.height, b.height) * 0.5);
    if (axis) axis.push(block);
    else axes.push([block]);
  }
  const fragments = /* @__PURE__ */ new Set();
  const aligned = (a, b) => {
    const x = a.bbox, y = b.bbox, tolerance = Math.max(x.height, y.height) * 0.5;
    return Math.abs(x.x - y.x) <= tolerance || Math.abs(x.x + x.width - y.x - y.width) <= tolerance;
  };
  for (const axis of axes) {
    if (axis.length < 3) continue;
    const bottom = Math.min(...axis.map((a) => a.bbox.y)), top = Math.max(...axis.map((a) => a.bbox.y + a.bbox.height));
    const em = Math.max(...axis.map((a) => a.bbox.height)), right = axis[0].bbox.x + axis[0].bbox.width;
    if (top - bottom < em * 6) continue;
    const left = paragraphs.filter((block) => {
      const b = block.bbox, text = block.text?.trim() ?? "";
      return new RegExp("\\p{Script=Latin}", "u").test(text) && (text.match(/[\p{L}\p{N}]/gu)?.length ?? 0) <= 3 && b.width <= b.height * 3 && b.x + b.width >= right - em * 6 && b.x + b.width <= right - Math.max(em, b.height) && b.y >= bottom && b.y + b.height <= top;
    });
    const stack = left.filter((a) => left.some((b) => {
      if (a === b || !aligned(a, b)) return false;
      const x = a.bbox, y = b.bbox, gap = Math.max(x.y, y.y) - Math.min(x.y + x.height, y.y + y.height);
      return gap >= -Math.min(x.height, y.height) * 0.5 && gap <= Math.max(x.height, y.height);
    }));
    if (stack.length < 2) continue;
    for (const block of paragraphs) {
      const b = block.bbox;
      if (b.y >= bottom && b.y + b.height <= top && b.x + b.width >= right - em * 6 && b.x + b.width <= right - Math.max(em, b.height) && /^[\p{L}\p{N}]$/u.test(block.text?.trim() ?? "") && stack.some((s) => aligned(s, block))) fragments.add(block);
    }
  }
  return fragments;
}
function rowParagraphs(block) {
  const t = block.table, b = block.bbox;
  const h = b.height / t.rows;
  return t.cells.map((row, r) => ({
    type: "paragraph",
    pageNumber: block.pageNumber,
    text: row.map((c) => c.text.trim()).filter(Boolean).join(" "),
    bbox: { ...b, y: b.y + h * (t.rows - 1 - r), height: h }
  }));
}
var IMAGE_RESOLVE_TIMEOUT_MS = 5e3;
function resolveImgData(page, objId) {
  const store = objId.startsWith("g_") ? page.commonObjs : page.objs;
  return new Promise((resolve) => {
    let done = false;
    const timer = setTimeout(() => {
      if (!done) {
        done = true;
        resolve(null);
      }
    }, IMAGE_RESOLVE_TIMEOUT_MS);
    try {
      store.get(objId, (data) => {
        if (!done) {
          done = true;
          clearTimeout(timer);
          resolve(data ?? null);
        }
      });
    } catch {
      if (!done) {
        done = true;
        clearTimeout(timer);
        resolve(null);
      }
    }
  });
}
var MIN_DIM = 8;
var MAX_PIXELS = 36e6;
var MAX_IMAGES_PER_DOC = 200;
var MAX_TOTAL_IMAGE_BYTES = 128 * 1024 * 1024;
function createPdfImageState() {
  return { imageIndex: 0, totalBytes: 0, seen: /* @__PURE__ */ new Map(), globalKeys: /* @__PURE__ */ new Map(), capWarned: false };
}
function contentHash(data) {
  return createHash("sha1").update(data).digest("hex");
}
var NO_BYTES = new Uint8Array(0);
function toRgba(img, convert = true) {
  const { width: w, height: h, kind, data } = img;
  if (!data || !w || !h) return null;
  if (kind === ImageKind.RGBA_32BPP) {
    if (data.length < w * h * 4) return null;
    if (!convert) return NO_BYTES;
    const rgba = new Uint8Array(w * h * 4);
    rgba.set(data.subarray(0, w * h * 4));
    return rgba;
  }
  if (kind === ImageKind.RGB_24BPP) {
    if (data.length < w * h * 3) return null;
    if (!convert) return NO_BYTES;
    const rgba = new Uint8Array(w * h * 4);
    for (let i = 0, s = 0, d = 0; i < w * h; i++, s += 3, d += 4) {
      rgba[d] = data[s];
      rgba[d + 1] = data[s + 1];
      rgba[d + 2] = data[s + 2];
      rgba[d + 3] = 255;
    }
    return rgba;
  }
  if (kind === ImageKind.GRAYSCALE_1BPP) {
    const stride = w + 7 >> 3;
    if (data.length < stride * h) return null;
    if (!convert) return NO_BYTES;
    const rgba = new Uint8Array(w * h * 4);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const bit = data[y * stride + (x >> 3)] >> 7 - (x & 7) & 1;
        const v = bit ? 255 : 0;
        const d = (y * w + x) * 4;
        rgba[d] = v;
        rgba[d + 1] = v;
        rgba[d + 2] = v;
        rgba[d + 3] = 255;
      }
    }
    return rgba;
  }
  return null;
}
async function extractPageImages(page, fnArray, argsArray, pageNumber, state, warnings, withBytes = true) {
  const blocks = [];
  const images = [];
  const pageSeenIds = /* @__PURE__ */ new Set();
  for (let i = 0; i < fnArray.length; i++) {
    const op = fnArray[i];
    let imgData = null;
    let dedupeId = null;
    if (op === OPS.paintImageXObject || op === OPS.paintImageXObjectRepeat) {
      const objId = argsArray[i]?.[0];
      if (typeof objId !== "string" || pageSeenIds.has(objId)) continue;
      pageSeenIds.add(objId);
      dedupeId = objId;
    } else if (op !== OPS.paintInlineImageXObject) {
      continue;
    }
    if (state.imageIndex >= MAX_IMAGES_PER_DOC || state.totalBytes >= MAX_TOTAL_IMAGE_BYTES) {
      if (!state.capWarned) {
        state.capWarned = true;
        warnings.push({ page: pageNumber, message: `\uC774\uBBF8\uC9C0 \uCD94\uCD9C \uC0C1\uD55C \uB3C4\uB2EC (${MAX_IMAGES_PER_DOC}\uAC1C/128MB) \u2014 \uC774\uD6C4 \uC774\uBBF8\uC9C0 \uC0DD\uB7B5`, code: "SKIPPED_IMAGE" });
      }
      continue;
    }
    if (dedupeId) {
      imgData = await resolveImgData(page, dedupeId);
    } else {
      imgData = argsArray[i]?.[0];
    }
    if (!imgData?.data || !imgData.width || !imgData.height) continue;
    const { width: w, height: h } = imgData;
    if (w < MIN_DIM || h < MIN_DIM) continue;
    if (w * h > MAX_PIXELS) {
      warnings.push({ page: pageNumber, message: `\uC774\uBBF8\uC9C0 \uD06C\uAE30 \uCD08\uACFC\uB85C \uCD94\uCD9C \uC0DD\uB7B5 (${w}\xD7${h})`, code: "SKIPPED_IMAGE" });
      continue;
    }
    const globalId = dedupeId?.startsWith("g_") ? dedupeId : void 0;
    let hash = globalId ? state.globalKeys.get(globalId) : void 0;
    if (hash === void 0) {
      hash = `${w}x${h}k${imgData.kind ?? "?"}h${contentHash(imgData.data)}${dedupeId ? "" : "inline"}`;
      if (globalId) state.globalKeys.set(globalId, hash);
    }
    if (state.seen.has(hash)) continue;
    const rgba = toRgba(imgData, withBytes);
    if (!rgba) continue;
    state.imageIndex++;
    const filename = `image_${String(state.imageIndex).padStart(3, "0")}.png`;
    state.seen.set(hash, filename);
    if (withBytes) {
      const png = encodePng(w, h, rgba);
      state.totalBytes += png.length;
      images.push({ filename, data: png, mimeType: "image/png" });
    }
    blocks.push({ type: "image", text: filename, pageNumber });
  }
  return { blocks, images };
}
function injectPageImageBlocks(blocks, pageImages) {
  if (pageImages.size === 0) return;
  const lastIndexForPage = /* @__PURE__ */ new Map();
  for (let i = 0; i < blocks.length; i++) {
    const p = blocks[i].pageNumber;
    if (p !== void 0) lastIndexForPage.set(p, i);
  }
  const pageAtIndex = /* @__PURE__ */ new Map();
  for (const [p, last] of lastIndexForPage) pageAtIndex.set(last, p);
  const result = [];
  const injected = /* @__PURE__ */ new Set();
  for (let i = 0; i < blocks.length; i++) {
    result.push(blocks[i]);
    const p = pageAtIndex.get(i);
    if (p !== void 0 && pageImages.has(p)) {
      result.push(...pageImages.get(p));
      injected.add(p);
    }
  }
  for (const p of [...pageImages.keys()].sort((a, b) => a - b)) {
    if (injected.has(p)) continue;
    let at = result.length;
    for (let i = 0; i < result.length; i++) {
      const bp = result[i].pageNumber;
      if (bp !== void 0 && bp > p) {
        at = i;
        break;
      }
    }
    result.splice(at, 0, ...pageImages.get(p));
  }
  blocks.length = 0;
  for (const b of result) blocks.push(b);
}
var RARE_JONG = /* @__PURE__ */ new Set([3, 5, 6, 9, 10, 11, 12, 13, 14, 15, 18, 24, 25, 26]);
var MOJIBAKE_MIN_HANGUL = 30;
var MOJIBAKE_MAX_NOBATCHIM = 0.15;
var MOJIBAKE_MIN_RAREBATCHIM = 0.25;
var VECTOR_TEXT_MIN_GLYPHS = 40;
var VECTOR_TEXT_MIN_SHARE = 0.25;
function computePageQuality(page, text, vectorGlyphs = 0) {
  let total = 0;
  let hangul = 0;
  let hangulNoBatchim = 0;
  let hangulRareBatchim = 0;
  let control = 0;
  let replacement = 0;
  let pua = 0;
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    if (code === 32 || code === 9 || code === 10 || code === 13) continue;
    total++;
    if (code < 32 || code === 127 || code >= 128 && code <= 159) {
      control++;
      continue;
    }
    if (code === 65533) {
      replacement++;
      continue;
    }
    if (code >= 44032 && code <= 55203) {
      hangul++;
      const jong = (code - 44032) % 28;
      if (jong === 0) hangulNoBatchim++;
      else if (RARE_JONG.has(jong)) hangulRareBatchim++;
      continue;
    }
    if (code >= 57344 && code <= 63743 || code >= 56192 && code <= 56319) {
      pua++;
      continue;
    }
  }
  const denom = total || 1;
  const puaRatio = pua / denom;
  const controlCharRatio = control / denom;
  const replacementCharRatio = replacement / denom;
  const hangulNoBatchimRatio = hangul > 0 ? hangulNoBatchim / hangul : 0;
  const hangulRareBatchimRatio = hangul > 0 ? hangulRareBatchim / hangul : 0;
  const garbledHangul = hangul >= MOJIBAKE_MIN_HANGUL && hangulNoBatchimRatio < MOJIBAKE_MAX_NOBATCHIM && hangulRareBatchimRatio >= MOJIBAKE_MIN_RAREBATCHIM;
  let needsOcr = false;
  let ocrReason;
  if (vectorGlyphs >= VECTOR_TEXT_MIN_GLYPHS && vectorGlyphs >= (vectorGlyphs + total) * VECTOR_TEXT_MIN_SHARE) {
    needsOcr = true;
    ocrReason = "vector_text";
  } else if (total < LOW_TEXT_THRESHOLD) {
    needsOcr = true;
    ocrReason = "low_text";
  } else if (puaRatio >= HIGH_PUA_THRESHOLD) {
    needsOcr = true;
    ocrReason = "high_pua";
  } else if (controlCharRatio >= HIGH_CONTROL_THRESHOLD) {
    needsOcr = true;
    ocrReason = "high_control";
  } else if (replacementCharRatio >= HIGH_REPLACEMENT_THRESHOLD) {
    needsOcr = true;
    ocrReason = "high_replacement";
  } else if (garbledHangul) {
    needsOcr = true;
    ocrReason = "garbled_hangul";
  }
  return {
    page,
    textChars: total,
    hangulRatio: hangul / denom,
    controlCharRatio,
    replacementCharRatio,
    puaRatio,
    hangulNoBatchimRatio,
    hangulRareBatchimRatio,
    needsOcr,
    ocrReason
  };
}
var LOW_TEXT_THRESHOLD = 20;
var HIGH_PUA_THRESHOLD = 0.2;
var HIGH_CONTROL_THRESHOLD = 0.05;
var HIGH_REPLACEMENT_THRESHOLD = 0.05;
var DOC_NEEDS_OCR_PAGE_RATIO = 0.3;
function stripControlChars(text) {
  return text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F\x80-\x9F]/g, "");
}
function summarizeDocumentQuality(pages) {
  if (pages.length === 0) {
    return {
      totalPages: 0,
      totalTextChars: 0,
      avgHangulRatio: 0,
      avgControlCharRatio: 0,
      avgReplacementCharRatio: 0,
      avgPuaRatio: 0,
      lowTextPageCount: 0,
      highPuaPageCount: 0,
      needsOcr: false,
      ocrCandidatePages: []
    };
  }
  let textChars = 0;
  let hangul = 0;
  let control = 0;
  let replacement = 0;
  let pua = 0;
  let lowText = 0;
  let highPua = 0;
  const ocrCandidatePages = [];
  for (const p of pages) {
    textChars += p.textChars;
    hangul += p.hangulRatio;
    control += p.controlCharRatio;
    replacement += p.replacementCharRatio;
    pua += p.puaRatio;
    if (p.textChars < LOW_TEXT_THRESHOLD) lowText++;
    if (p.puaRatio >= HIGH_PUA_THRESHOLD) highPua++;
    if (p.needsOcr && !p.ocrApplied) ocrCandidatePages.push(p.page);
  }
  const n = pages.length;
  return {
    totalPages: n,
    totalTextChars: textChars,
    avgHangulRatio: hangul / n,
    avgControlCharRatio: control / n,
    avgReplacementCharRatio: replacement / n,
    avgPuaRatio: pua / n,
    lowTextPageCount: lowText,
    highPuaPageCount: highPua,
    needsOcr: ocrCandidatePages.length / n >= DOC_NEEDS_OCR_PAGE_RATIO,
    ocrCandidatePages
  };
}
var GLYPH_MIN_H = 3;
var GLYPH_MAX_H = 40;
var GLYPH_MAX_ASPECT = 2;
var GLYPH_MIN_SEGS = 8;
var GLYPH_MIN_SUBS = 2;
var RUN_GAP_EM = 1.5;
var RUN_MIN = 3;
var RUN_ALIGN_EM = 0.05;
var RUN_MAX_OVERLAP = 0.2;
var RUN_MIN_COLOR = 0.9;
var RUN_MIN_SHAPES = 0.5;
var mul = (m, t) => [
  m[0] * t[0] + m[2] * t[1],
  m[1] * t[0] + m[3] * t[1],
  m[0] * t[2] + m[2] * t[3],
  m[1] * t[2] + m[3] * t[3],
  m[0] * t[4] + m[2] * t[5] + m[4],
  m[1] * t[4] + m[3] * t[5] + m[5]
];
function collectGlyphPaths(fnArray, argsArray) {
  const out = [];
  let ctm = [1, 0, 0, 1, 0, 0];
  let color = 0;
  const stack = [];
  let x1 = Infinity, y1 = Infinity, x2 = -Infinity, y2 = -Infinity;
  let segs = 0, subs = 0, rects = 0;
  let ops = [];
  const add = (x, y) => {
    const tx = ctm[0] * x + ctm[2] * y + ctm[4], ty = ctm[1] * x + ctm[3] * y + ctm[5];
    if (tx < x1) x1 = tx;
    if (tx > x2) x2 = tx;
    if (ty < y1) y1 = ty;
    if (ty > y2) y2 = ty;
  };
  const reset = () => {
    x1 = Infinity;
    y1 = Infinity;
    x2 = -Infinity;
    y2 = -Infinity;
    segs = 0;
    subs = 0;
    rects = 0;
    ops = [];
  };
  for (let i = 0; i < fnArray.length; i++) {
    const op = fnArray[i];
    const args = argsArray[i];
    switch (op) {
      case OPS2.save:
        stack.push([ctm, color]);
        break;
      case OPS2.restore:
        [ctm, color] = stack.pop() ?? [[1, 0, 0, 1, 0, 0], 0];
        break;
      case OPS2.transform:
        ctm = mul(ctm, args);
        break;
      case OPS2.paintFormXObjectBegin: {
        stack.push([ctm, color]);
        const m = args[0];
        if (Array.isArray(m) && m.length >= 6) ctm = mul(ctm, m);
        break;
      }
      case OPS2.paintFormXObjectEnd:
        [ctm, color] = stack.pop() ?? [[1, 0, 0, 1, 0, 0], 0];
        break;
      case OPS2.setFillRGBColor: {
        const c = args;
        color = c[0] << 16 | c[1] << 8 | c[2];
        break;
      }
      case OPS2.constructPath: {
        const [subOps, coords] = args;
        if (!Array.isArray(subOps) || !Array.isArray(coords)) break;
        ops.push(i);
        let ci = 0;
        for (const s of subOps) {
          if (s === OPS2.moveTo) {
            add(coords[ci], coords[ci + 1]);
            ci += 2;
            subs++;
          } else if (s === OPS2.lineTo) {
            add(coords[ci], coords[ci + 1]);
            ci += 2;
            segs++;
          } else if (s === OPS2.curveTo) {
            add(coords[ci], coords[ci + 1]);
            add(coords[ci + 2], coords[ci + 3]);
            add(coords[ci + 4], coords[ci + 5]);
            ci += 6;
            segs++;
          } else if (s === OPS2.curveTo2 || s === OPS2.curveTo3) {
            add(coords[ci], coords[ci + 1]);
            add(coords[ci + 2], coords[ci + 3]);
            ci += 4;
            segs++;
          } else if (s === OPS2.rectangle) {
            const rx = coords[ci], ry = coords[ci + 1], rw = coords[ci + 2], rh = coords[ci + 3];
            add(rx, ry);
            add(rx + rw, ry + rh);
            add(rx, ry + rh);
            add(rx + rw, ry);
            ci += 4;
            rects++;
            subs++;
            segs += 4;
          }
        }
        break;
      }
      case OPS2.fill:
      case OPS2.eoFill:
      case OPS2.fillStroke:
      case OPS2.eoFillStroke:
      case OPS2.closeFillStroke:
      case OPS2.closeEOFillStroke: {
        const w = x2 - x1, h = y2 - y1;
        if (segs > rects * 4 && h >= GLYPH_MIN_H && h <= GLYPH_MAX_H && w <= h * GLYPH_MAX_ASPECT && segs >= GLYPH_MIN_SEGS && subs >= GLYPH_MIN_SUBS) {
          out.push({ x1, y1, x2, y2, segs, subs, color, ops: [...ops, i] });
        }
        reset();
        break;
      }
      case OPS2.stroke:
      case OPS2.closeStroke:
      case OPS2.endPath:
        reset();
        break;
    }
  }
  return out;
}
function coveredByText(b, texts) {
  const cx = (b.x1 + b.x2) / 2, cy = (b.y1 + b.y2) / 2;
  for (const t of texts) {
    if (cx >= t.x - 1 && cx <= t.x + t.w + 1 && cy >= t.y - t.h * 0.3 - 1 && cy <= t.y + t.h + 1 && t.text.trim()) return true;
  }
  return false;
}
var median = (a) => {
  const s = a.slice().sort((x, y) => x - y);
  return s[s.length >> 1];
};
var spread = (a) => {
  const c = median(a);
  return median(a.map((v) => Math.abs(v - c)));
};
function isTextRun(m, em) {
  if (m.length < RUN_MIN) return false;
  if (Math.min(spread(m.map((b) => b.y2)), spread(m.map((b) => b.y1))) > em * RUN_ALIGN_EM) return false;
  let overlaps = 0;
  for (let i = 1; i < m.length; i++) if (m[i].x1 < m[i - 1].x2 - em * 0.1) overlaps++;
  if (overlaps > (m.length - 1) * RUN_MAX_OVERLAP) return false;
  const colors = /* @__PURE__ */ new Map();
  for (const b of m) colors.set(b.color, (colors.get(b.color) ?? 0) + 1);
  if (Math.max(...colors.values()) < m.length * RUN_MIN_COLOR) return false;
  const shapes = new Set(m.map((b) => `${Math.round((b.x2 - b.x1) * 2)}:${Math.round((b.y2 - b.y1) * 2)}:${b.segs}`));
  return shapes.size >= m.length * RUN_MIN_SHAPES;
}
function scanVectorGlyphs(fnArray, argsArray, texts) {
  const paths = collectGlyphPaths(fnArray, argsArray);
  if (paths.length < RUN_MIN) return { glyphs: 0, paths };
  const free = paths.filter((b) => !coveredByText(b, texts));
  const sorted = free.slice().sort((a, b) => a.y1 + a.y2 - (b.y1 + b.y2));
  let glyphs = 0;
  let row = [];
  let rowCy = 0, rowH = 0;
  const flushRow = () => {
    if (row.length < RUN_MIN) return;
    row.sort((a, b) => a.x1 - b.x1);
    const em = median(row.map((b) => b.y2 - b.y1));
    let start = 0, maxX = row[0].x2;
    for (let i = 1; i <= row.length; i++) {
      if (i < row.length && row[i].x1 - maxX <= em * RUN_GAP_EM) {
        if (row[i].x2 > maxX) maxX = row[i].x2;
        continue;
      }
      const run = row.slice(start, i);
      if (isTextRun(run, em)) glyphs += run.length;
      if (i < row.length) {
        start = i;
        maxX = row[i].x2;
      }
    }
  };
  for (const b of sorted) {
    const cy = (b.y1 + b.y2) / 2, h = b.y2 - b.y1;
    if (row.length && Math.abs(cy - rowCy) <= Math.max(h, rowH) * 0.5) {
      row.push(b);
      continue;
    }
    flushRow();
    row = [b];
    rowCy = cy;
    rowH = h;
  }
  flushRow();
  return { glyphs, paths };
}
function ocrVectorOps(opList, paths) {
  const drop = /* @__PURE__ */ new Set();
  for (const p of paths) for (const i of p.ops) drop.add(i);
  const fnArray = [];
  const argsArray = [];
  for (let i = 0; i < opList.fnArray.length; i++) {
    const op = opList.fnArray[i];
    if (drop.has(i) || op === OPS2.clip || op === OPS2.eoClip) continue;
    fnArray.push(op);
    argsArray.push(opList.argsArray[i]);
  }
  return { fnArray, argsArray };
}
var CONTACT_HEAD = /^(?:담당\s*부서|<[^<>]+>)$/;
var CONTACT_ROLE = /^(?:책임자|담당자)$/;
var PERSON = /^(.+?)\s+([가-힣]{2,4})\s+(\([^()]*\d[^()]*\)|\S+@\S+)$/;
function splitContactTables(blocks) {
  for (const b of blocks) {
    const t = b.type === "table" ? b.table : void 0;
    if (!t || t.cols !== 4 || t.rows < 2) continue;
    const rows = t.cells;
    if (!CONTACT_HEAD.test(rows[0][0].text.replace(/\s+/g, " ").trim())) continue;
    const people = rows.map((r) => PERSON.exec(r[3].text.replace(/\s+/g, " ").trim()));
    if (people.some((p) => !p) || rows.some((r) => !CONTACT_ROLE.test(r[2].text.replace(/\s+/g, "")) || r[2].rowSpan !== 1 || r[3].rowSpan !== 1)) continue;
    const lead = [];
    let ok = true;
    for (const c of [0, 1]) {
      const top = rows[0][c];
      if (top.rowSpan === 1) {
        lead.push(rows.map((r) => r[c].text));
        continue;
      }
      const lines = top.text.split("\n").map((s) => s.trim()).filter(Boolean);
      if (top.rowSpan !== t.rows || lines.length > t.rows) {
        ok = false;
        break;
      }
      lead.push(rows.map((_, r) => lines[r] ?? ""));
    }
    if (!ok) continue;
    const one = (text) => ({ text, colSpan: 1, rowSpan: 1 });
    t.cells = rows.map((r, i) => [one(lead[0][i]), one(lead[1][i]), one(r[2].text), one(people[i][1]), one(people[i][2]), one(people[i][3])]);
    t.cols = 6;
  }
}
var flowText = (text) => text.replace(/<\/?u>|~~/g, "");
var PART_COL_TOL = 1;
var PART_COL_SNAP = 0.3;
function anchorsOf(table) {
  const out = [];
  const covered = /* @__PURE__ */ new Set();
  for (let r = 0; r < table.rows; r++) {
    for (let c = 0; c < table.cols; c++) {
      if (covered.has(r * 1e5 + c)) continue;
      const cell = table.cells[r]?.[c];
      if (!cell) continue;
      out.push({ r, c, rs: cell.rowSpan, cs: cell.colSpan, cell });
      for (let dr = 0; dr < cell.rowSpan; dr++) {
        for (let dc = 0; dc < cell.colSpan; dc++) if (dr || dc) covered.add((r + dr) * 1e5 + (c + dc));
      }
    }
  }
  return out;
}
function unionCoords(a, b) {
  const drift = a.length === b.length && a.every((x, i) => Math.abs(x - b[i]) <= PART_COL_TOL);
  const tol = drift ? PART_COL_TOL : PART_COL_SNAP;
  const pairs = [];
  for (const v of b) for (const x of a) if (Math.abs(x - v) <= tol) pairs.push([Math.abs(x - v), v, x]);
  pairs.sort((p, q) => p[0] - q[0]);
  const map = /* @__PURE__ */ new Map(), taken = /* @__PURE__ */ new Set();
  for (const [, v, x] of pairs) if (!map.has(v) && !taken.has(x)) {
    map.set(v, x);
    taken.add(x);
  }
  const out = [...a];
  for (const v of b) if (!map.has(v)) {
    map.set(v, v);
    out.push(v);
  }
  return { U: out.sort((x, y) => x - y), map };
}
var indexOf = (coords, x) => {
  let best = -1, bestD = Infinity;
  for (let i = 0; i < coords.length; i++) {
    const d = Math.abs(coords[i] - x);
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  }
  return bestD <= PART_COL_TOL ? best : -1;
};
var rowText = (anchors, r) => anchors.filter((a) => a.r === r).map((a) => flowText(a.cell.text).replace(/\s+/g, "")).join("|");
var hasText = (t) => t.replace(/\|/g, "") !== "";
function joinSplitParts(prev, pcx, curr, ccx, dx = 0, prevBottom, lex) {
  if (pcx.length !== prev.cols + 1 || ccx.length !== curr.cols + 1) return null;
  const { U, map } = unionCoords(pcx, ccx);
  const cxU = ccx.map((v) => map.get(v) ?? v);
  const cols = U.length - 1;
  if (cols < 1) return null;
  const pa = anchorsOf(prev), ca = anchorsOf(curr);
  let skip = 0, head = 0;
  while (skip < Math.min(3, curr.rows - 1, prev.rows) && rowText(ca, skip) !== "" && rowText(ca, skip) === rowText(pa, skip)) skip++;
  for (let h = 1; h <= 2 && !skip; h++) {
    head = h;
    while (skip < Math.min(3, curr.rows - 1, prev.rows - h) && hasText(rowText(ca, skip)) && rowText(ca, skip) === rowText(pa, h + skip)) skip++;
  }
  const sameSpans = (u, d) => {
    if (u.length !== d.length || !u.length) return false;
    const shift = pcx[u[u.length - 1].c + u[u.length - 1].cs] - ccx[d[d.length - 1].c + d[d.length - 1].cs];
    return u.every((a, n) => Math.abs(pcx[a.c] - ccx[d[n].c] - shift) <= CONTINUATION_COL_TOL && Math.abs(pcx[a.c + a.cs] - ccx[d[n].c + d[n].cs] - shift) <= CONTINUATION_COL_TOL);
  };
  for (let k = 0; k < skip; k++) {
    if (sameSpans(pa.filter((a) => a.r === head + k), ca.filter((a) => a.r === k))) continue;
    if (hasText(rowText(ca, k))) return null;
    skip = k;
  }
  const rows = prev.rows + curr.rows - skip;
  const grid = Array.from({ length: rows }, () => Array.from({ length: cols }, () => ({ text: "", colSpan: 1, rowSpan: 1 })));
  const owner = Array.from({ length: rows }, () => new Array(cols).fill(null));
  let edged = false;
  const place = (a, x, rowOff, shift = 0) => {
    const c1 = indexOf(U, x[a.c]), c2 = indexOf(U, x[a.c + a.cs]);
    if (c1 < 0 || c2 <= c1) return false;
    const r = a.r + rowOff;
    const placed = { r, c: c1, rs: a.rs, cs: c2 - c1, cell: a.cell };
    for (let dr = 0; dr < a.rs; dr++) for (let dc = c1; dc < c2; dc++) {
      if (r + dr < rows) owner[r + dr][dc] = placed;
    }
    grid[r][c1] = { ...a.cell, colSpan: c2 - c1, rowSpan: a.rs };
    const lines = CELL_LINES.get(a.cell);
    if (lines) CELL_LINES.set(grid[r][c1], shift ? lines.map((l) => ({ ...l, l: l.l + shift, r: l.r + shift })) : lines);
    if (IMAGE_CELLS.has(a.cell)) IMAGE_CELLS.add(grid[r][c1]);
    const edges = CELL_EDGES.get(a.cell);
    if (edges) {
      CELL_EDGES.set(grid[r][c1], edges);
      edged = true;
    }
    return true;
  };
  for (const a of pa) if (!FILLER_CELLS.has(a.cell) && !place(a, pcx, 0)) return null;
  for (const a of ca) {
    if (a.r < skip || FILLER_CELLS.has(a.cell)) continue;
    if (!place(a, cxU, prev.rows - skip, dx)) return null;
  }
  const first = prev.rows;
  for (let c = 0; c < cols; c++) {
    const above = owner[first - 1]?.[c];
    if (!above) continue;
    let r = first;
    while (r < rows && owner[r][c] === null) r++;
    if (r === first) continue;
    const span = r - first;
    let ok = true;
    for (let dc = above.c; dc < above.c + above.cs && ok; dc++) {
      for (let rr = first; rr < first + span; rr++) if (owner[rr][dc] !== null) {
        ok = false;
        break;
      }
    }
    if (!ok) continue;
    const newRs = above.rs + span;
    grid[above.r][above.c].rowSpan = newRs;
    const grown = { ...above, rs: newRs };
    for (let rr = above.r; rr < above.r + newRs; rr++) for (let dc = above.c; dc < above.c + above.cs; dc++) owner[rr][dc] = grown;
  }
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) if (owner[r][c] === null) FILLER_CELLS.add(grid[r][c]);
  if (edged) {
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) if (owner[r][c] === null) CELL_EDGES.set(grid[r][c], NO_EDGES);
  }
  for (let c = 0; c < cols && U[c + 1] <= pcx[0] + PART_COL_TOL; c++) {
    let r = prev.rows;
    while (r < rows && owner[r][c] === null) r++;
    const through = { r: 0, c, rs: r, cs: 1, cell: grid[0][c] };
    for (let rr = 0; rr < r; rr++) owner[rr][c] = through;
  }
  const table = { rows, cols, cells: grid, hasHeader: prev.hasHeader, ...prev.caption ? { caption: prev.caption } : {} };
  const pr = ROW_RULES.get(prev), cr = ROW_RULES.get(curr);
  const shifted = dx !== 0;
  const cut = {
    open: !!pr && !!cr && !pr.bottom && !cr.top && pr.innerOpen + cr.innerOpen === 0 && pr.innerRuled + cr.innerRuled > 0,
    ruled: !!pr && !!cr && pr.bottom && cr.top,
    list: !shifted ? "any" : skip > 0 && ca.filter((a) => a.r < skip && a.cell.text.trim()).length < 2 ? "none" : "multi"
  };
  let split = rows > prev.rows && mergeSplitRow(table, owner, prev.rows, U, false, cut);
  if (rows > prev.rows && !split && prevBottom !== void 0 && mergeStraddlingCells(table, owner, prev.rows, prevBottom, lex, U)) split = mergeSplitRow(table, owner, prev.rows, U, true, { ...cut, open: false });
  if (pr && cr) {
    const cutRuled = pr.bottom || cr.top;
    ROW_RULES.set(table, { top: pr.top, bottom: cr.bottom, innerRuled: pr.innerRuled + cr.innerRuled + (!split && cutRuled ? 1 : 0), innerOpen: pr.innerOpen + cr.innerOpen + (!split && !cutRuled ? 1 : 0) });
  }
  return { table, colXs: U, split, header: ca.filter((a) => a.r < skip && a.cell.text.trim()).length >= 2 };
}
function mergeStraddlingCells(table, owner, first, prevBottom, lex, colXs) {
  const last = first - 1;
  const straddles = owner[first].some((o, c) => o !== null && o === owner[last][c]);
  let firstNew = table.cols;
  for (let c = 0; c < table.cols; c++) {
    const d = owner[first][c];
    if (d && d.r === first && d !== owner[last][c] && hasContent(table.cells[d.r][d.c])) {
      firstNew = c;
      break;
    }
  }
  let midWord = false;
  if (lex) for (let c = 0; c < table.cols && !midWord; ) {
    const u = owner[last][c], d = owner[first][c];
    if (!u) {
      c++;
      continue;
    }
    c = u.c + u.cs;
    if (!d || d === u || u.r + u.rs - 1 !== last || d.r !== first || d.c !== u.c || d.cs !== u.cs) continue;
    if (u.r !== last || d.rs < 2) continue;
    const tail = table.cells[u.r][u.c].text.trim().split(/\s+/).pop() ?? "", head = table.cells[first][d.c].text.trim().split(/\s+/)[0] ?? "";
    if (/^[가-힣]{2,}$/.test(tail) && /^[가-힣]{2,}/.test(head) && lex.evidence2(tail, head) === "") midWord = true;
  }
  const crossed = /* @__PURE__ */ new Set();
  const shape = (u, d) => `${u.r}:${u.rs}:${d.rs}`;
  if (straddles && colXs) for (let c = 0; c < table.cols; ) {
    const u = owner[last][c], d = owner[first][c];
    if (!u) {
      c++;
      continue;
    }
    c = u.c + u.cs;
    if (!d || d === u || u.r + u.rs - 1 !== last || d.r !== first || d.c !== u.c || d.cs !== u.cs || u.rs < 2) continue;
    const a = table.cells[u.r][u.c], b = table.cells[first][d.c];
    if (hasContent(a) && hasContent(b) && continuesAcross(a, b, colXs[u.c], colXs[u.c + u.cs])) crossed.add(shape(u, d));
  }
  let merged = false;
  for (let c = 0; c < table.cols; ) {
    const u = owner[last][c], d = owner[first][c];
    if (!u) {
      c++;
      continue;
    }
    c = u.c + u.cs;
    if (!d || d === u || u.r + u.rs - 1 !== last || d.r !== first || d.c !== u.c || d.cs !== u.cs) continue;
    const a = table.cells[u.r][u.c], b = table.cells[first][d.c];
    if (!crossed.has(shape(u, d)) && !(u.rs >= 2 && u.c + u.cs <= firstNew && hasContent(a) && !hasContent(b))) {
      if (!straddles && !midWord) continue;
      if (u.r >= last && d.rs < 2) continue;
      const U = CELL_LINES.get(a);
      if (!U?.length || !hasContent(b)) continue;
      if (!(straddles && filledToBottom(U, prevBottom) && clauseContinues(a, b))) {
        if (U.length > STRADDLE_MAX_LINES) continue;
        const lu = U[U.length - 1];
        if (!midWord && lu.y - prevBottom > (u.r >= last ? STRADDLE_BOTTOM_ONE_ROW : STRADDLE_BOTTOM) * (lu.h || 10)) continue;
      }
    }
    appendCell(a, b);
    a.rowSpan = first + d.rs - u.r;
    table.cells[first][d.c] = { text: "", colSpan: 1, rowSpan: 1 };
    const grown = { ...u, rs: a.rowSpan };
    for (let rr = u.r; rr < u.r + grown.rs; rr++) for (let dc = u.c; dc < u.c + u.cs; dc++) owner[rr][dc] = grown;
    merged = true;
  }
  return merged;
}
function filledToBottom(U, bottom) {
  if (U.length < 2) return false;
  const lu = U[U.length - 1];
  return lu.y - bottom < (U[0].y - lu.y) / (U.length - 1) + FILL_SLACK * (lu.h || 10);
}
var FULL_LINE_TOL = 1;
var FULL_LINE_MIN_FRAC = 0.5;
var FULL_LINE_EDGE_MIN = 12;
var SINGLE_LINE_WORD_GAP = 3.5;
var SHORT_LINE_GAP = 1.5;
var STRADDLE_MAX_LINES = 3;
var STRADDLE_BOTTOM = 1.2;
var STRADDLE_BOTTOM_ONE_ROW = 0.55;
var FILL_SLACK = 0.5;
var CARRIED_MIN_COL_W = 4;
var LABEL_ROOM = 1.5;
var HANGING_MIN = 0.5;
var HANGING_TOL = 1;
var KO_ITEMS = "\uAC00\uB098\uB2E4\uB77C\uB9C8\uBC14\uC0AC\uC544\uC790\uCC28\uCE74\uD0C0\uD30C\uD558\uAC70\uB108\uB354\uB7EC\uBA38\uBC84\uC11C\uC5B4\uC800\uCC98\uCEE4\uD130\uD37C\uD5C8\uACE0\uB178\uB3C4\uB85C\uBAA8\uBCF4\uC18C\uC624\uC870\uCD08\uCF54\uD1A0\uD3EC\uD638\uAD6C\uB204\uB450\uB8E8\uBB34\uBD80\uC218\uC6B0\uC8FC\uCD94\uCFE0\uD22C\uD478\uD6C4";
var ITEM_MARK = /^\s*(?:([가-힣])\.|(\d{1,3})[.)]|\(([가-힣\d]{1,3})\))(?=\s)/;
function nextItemHead(prev, next) {
  const a = ITEM_MARK.exec(prev), b = ITEM_MARK.exec(next);
  if (!a || !b) return false;
  const succ = (x, y) => /^\d+$/.test(x) ? /^\d+$/.test(y) && Number(y) === Number(x) + 1 : KO_ITEMS.indexOf(x) >= 0 && KO_ITEMS.indexOf(y) === KO_ITEMS.indexOf(x) + 1;
  if (a[1] && b[1]) return succ(a[1], b[1]);
  if (a[2] && b[2]) return succ(a[2], b[2]) && prev.trimStart()[a[2].length] === next.trimStart()[b[2].length];
  if (a[3] && b[3]) return succ(a[3], b[3]);
  return false;
}
function continuesAcross(u, d, x1, x2) {
  const U = CELL_LINES.get(u), D = CELL_LINES.get(d);
  if (!U?.length || !D?.length) return false;
  const last = U[U.length - 1];
  const fs = last.h || 10;
  let minL = Infinity, maxR = -Infinity;
  for (const l of U) {
    minL = Math.min(minL, l.l);
    maxR = Math.max(maxR, l.r);
  }
  for (const l of D) {
    minL = Math.min(minL, l.l);
    maxR = Math.max(maxR, l.r);
  }
  maxR = Math.max(maxR, x2 - (minL - x1));
  if (maxR - last.r > FULL_LINE_TOL * fs) return false;
  if (U.length === 1 && x2 - last.r > Math.max(FULL_LINE_EDGE_MIN, SINGLE_LINE_WORD_GAP * fs)) return false;
  const indented = last.l - minL >= HANGING_MIN * fs;
  if (last.r - last.l < FULL_LINE_MIN_FRAC * (indented ? x2 - last.l : x2 - x1)) return false;
  const newItem = startsNewItem(u.text, d.text);
  const all = D.length ? U.concat(D) : U;
  const leftAligned = (l) => maxR - l.r > SHORT_LINE_GAP * fs && (l.l - minL <= fs || !newItem && all.some((o) => o !== l && Math.abs(o.l - l.l) <= HANGING_TOL && Math.abs(o.r - l.r) >= HANGING_MIN * fs));
  const hanging = U.length >= 2 && U.every((l) => maxR - l.r <= FULL_LINE_TOL * fs) && indented && Math.abs(D[0].l - last.l) <= HANGING_TOL;
  const hangingHead = !indented && D.length >= 2 && D[0].l - last.l >= HANGING_MIN * fs && maxR - D[0].r <= FULL_LINE_TOL * fs && D.every((l) => Math.abs(l.l - D[0].l) <= HANGING_TOL);
  const d0 = D[0];
  const hangStart = U.length === 1 && !newItem && d0.l - last.l >= HANGING_MIN * fs && D.every((l) => l.l >= d0.l - HANGING_TOL) && (Math.abs(d0.r - last.r) <= HANGING_TOL && d0.r - d0.l >= FULL_LINE_MIN_FRAC * (x2 - x1) || last.r - d0.r > SHORT_LINE_GAP * fs && Math.abs(d0.l + d0.r - last.l - last.r) / 2 >= HANGING_MIN * fs);
  return U.some(leftAligned) || D.some(leftAligned) || hanging || hangingHead || hangStart;
}
var OUTLINE_HEAD = /^[□■]\s*\S/;
var OUTLINE_ITEM = /^[ㅇ○◦\-‐–·․‧※*]\s*\S/;
function outlineContinues(u, d) {
  const U = flowText(u.text).split("\n").map((l) => l.trim()).filter(Boolean);
  const D = flowText(d.text).split("\n").map((l) => l.trim()).filter(Boolean);
  return U.length >= 2 && D.length >= 1 && U.some((l) => OUTLINE_HEAD.test(l)) && OUTLINE_ITEM.test(D[0]);
}
function lineEnded(c, x1, x2, next) {
  const L = CELL_LINES.get(c);
  if (!L || L.length !== 1) return false;
  const l = L[0], h = l.h || 10;
  const d0 = next ? CELL_LINES.get(next)?.[0] : void 0;
  if (d0 && d0.l - l.l >= HANGING_MIN * h) return false;
  return x2 - l.r - (l.l - x1) >= Math.max(LABEL_ROOM, firstWordUnits(next?.text ?? "")) * h;
}
function firstWordUnits(text) {
  const word = flowText(text).trim().replace(/^([(\[「『<〈])\s+/, "$1").split(/\s+/)[0] ?? "";
  let units = 0;
  for (const ch of word) units += /[가-힣\u3400-\u9fff]/.test(ch) ? 1 : 0.55;
  return units;
}
function appendCell(a, b) {
  if (a.blocks?.length || b.blocks?.length) {
    const asBlocks = (c) => c.blocks?.length ? c.blocks : c.text.split("\n").map((l) => l.trim()).filter(Boolean).map((text) => ({ type: "paragraph", text }));
    a.blocks = [...asBlocks(a), ...asBlocks(b)];
  }
  if (b.text.trim()) a.text = a.text.trim() ? a.text + "\n" + b.text : b.text;
  joinCellEdges(a, b);
}
var hasContent = (cell) => !!cell.text.trim() || !!cell.blocks?.length || IMAGE_CELLS.has(cell);
var CLAUSE_OPEN_ENDING = /(?:하는|되는|하고|하며|하여|되어|되고|되며|이며|으며|어야|아야|여야)$/;
var batchim = (ch) => {
  const k = ch.charCodeAt(0) - 44032;
  return k >= 0 && k < 11172 && k % 28 !== 0;
};
function clauseContinues(u, d) {
  const tail = flowText(u.text).trim().split(/\s+/).pop() ?? "", head = flowText(d.text).trim();
  if (!/^[가-힣]{2,}$/.test(tail) || !/^[가-힣]/.test(head) || startsNewItem(u.text, head)) return false;
  const last = tail[tail.length - 1], before = tail[tail.length - 2];
  return last === "\uC744" && batchim(before) || last === "\uB97C" && !batchim(before) || CLAUSE_OPEN_ENDING.test(tail);
}
function wordOverflows(u, d, x1, x2) {
  const U = CELL_LINES.get(u);
  if (!U?.length || startsNewItem(u.text, d.text)) return false;
  const last = U[U.length - 1], units = firstWordUnits(d.text);
  return units > 0 && last.r - last.l + units * (last.h || 10) > x2 - x1;
}
var KO_ORDER = "\uAC00\uB098\uB2E4\uB77C\uB9C8\uBC14\uC0AC\uC544\uC790\uCC28\uCE74\uD0C0\uD30C\uD558";
function itemMark(line) {
  line = flowText(line).trim();
  let m = /^(\d{1,2})([.)])(?!\d)/.exec(line);
  if (m) return { style: "1" + m[2], n: +m[1] };
  if (m = /^\((\d{1,2})\)/.exec(line)) return { style: "(1)", n: +m[1] };
  if ((m = /^([가-하])([.)])/.exec(line)) && KO_ORDER.includes(m[1])) return { style: "\uAC00" + m[2], n: KO_ORDER.indexOf(m[1]) };
  if ((m = /^\(([가-하])\)/.exec(line)) && KO_ORDER.includes(m[1])) return { style: "(\uAC00)", n: KO_ORDER.indexOf(m[1]) };
  if (m = /^[①-⑳]/.exec(line)) return { style: "\u2460", n: m[0].charCodeAt(0) };
  if (m = /^([A-Z])\.\s/.exec(line)) return { style: "A.", n: m[1].charCodeAt(0) };
  return null;
}
function listContinues(u, d, multi = false) {
  const head = itemMark(d.text.trim());
  if (!head) return false;
  const marks = u.text.split("\n").map((l) => itemMark(l.trim()));
  let last = -1, count = 0;
  marks.forEach((m, i) => {
    if (m?.style === head.style) {
      last = i;
      count++;
    }
  });
  return last >= 0 && marks[last].n + 1 === head.n && (count >= 2 || !multi && last > 0);
}
function outlineOnly(pairs, cell) {
  const filled = pairs.filter(([, d]) => hasContent(d.cell));
  return filled.length === 1 && outlineContinues(cell(filled[0][0]), cell(filled[0][1]));
}
var NO_CUT = { open: false, ruled: false, list: "any" };
function mergeSplitRow(table, owner, first, colXs, textOnly = false, cut = NO_CUT) {
  const last = first - 1;
  const pairs = [];
  let carried = false;
  for (let c = 0; c < table.cols; ) {
    const a = owner[last][c], b = owner[first][c];
    if (!a && !b) {
      if (colXs[c + 1] - colXs[c] >= CARRIED_MIN_COL_W) carried = true;
      c++;
      continue;
    }
    if (!a || !b) return false;
    if (a !== b) {
      if (a.c !== b.c || a.cs !== b.cs || a.r + a.rs - 1 !== last || b.r !== first) return false;
      if (b.rs > 1 && (a.rs > 1 || !hasContent(a.cell))) return false;
      pairs.push([a, b]);
    } else if (a.r === last && a.rs === 2) carried = true;
    c = a.c + a.cs;
  }
  const newCell = pairs.some(([u, d]) => !hasContent(u.cell) && hasContent(d.cell));
  const cell = (a) => table.cells[a.r][a.c];
  const contentPairs = pairs.filter(([u, d]) => hasContent(u.cell) && hasContent(d.cell));
  const carriedSplit = !textOnly && carried && !newCell && (contentPairs.length <= 1 || contentPairs.every(([, d]) => d.rs > 1) || !cut.ruled && contentPairs.some(([u, d]) => wordOverflows(cell(u), cell(d), colXs[u.c], colXs[u.c + u.cs])));
  if (!carriedSplit) {
    const norm = (c) => flowText(c.text).replace(/\s+/g, "");
    if (pairs.some(([u, d]) => hasContent(d.cell) && norm(cell(d)) !== norm(cell(u)) && lineEnded(cell(u), colXs[u.c], colXs[u.c + u.cs], cell(d)))) return false;
    const oneLine = (c) => CELL_LINES.get(c)?.length === 1;
    if (pairs.some(([u, d]) => nextItemHead(cell(u).text, cell(d).text)) && pairs.some(([u, d]) => hasContent(u.cell) && hasContent(d.cell) && oneLine(cell(u)) && oneLine(cell(d)) && norm(cell(u)) !== norm(cell(d)))) return false;
    const flows = ([u, d]) => continuesAcross(cell(u), cell(d), colXs[u.c], colXs[u.c + u.cs]) || clauseContinues(cell(u), cell(d));
    if (!(cut.open && !newCell)) {
      if (pairs.some((p) => p[1].rs > 1 && !flows(p))) return false;
      const one = pairs.filter(([, d]) => d.rs === 1);
      if (!outlineOnly(pairs, cell) && !one.some(flows) && (cut.list === "none" || !one.some(([u, d]) => listContinues(cell(u), cell(d), cut.list === "multi")))) return false;
    }
  }
  for (const [u, d] of pairs) {
    appendCell(table.cells[u.r][u.c], table.cells[d.r][d.c]);
    if (d.rs > 1) table.cells[u.r][u.c].rowSpan = u.rs + d.rs;
  }
  for (let r = 0; r < first; r++) for (let c = 0; c < table.cols; c++) {
    const o = owner[r][c];
    if (o && o.r === r && o.c === c && r + table.cells[r][c].rowSpan > first) table.cells[r][c].rowSpan--;
  }
  table.cells.splice(first, 1);
  table.rows--;
  return true;
}
var NEIGHBOR_TABLE_EPSILON = 0.2;
function besideOwn(b, p, c) {
  if (!b.bbox) return false;
  if (b.type === "table") return leftColumnOf(b, p);
  const t = (b.pageNumber === p.pageNumber ? p : c).bbox;
  const bx1 = b.bbox.x, bx2 = b.bbox.x + b.bbox.width;
  return bx2 <= t.x + 1 || bx1 >= t.x + t.width - 1;
}
var PAGE_NUMBER_TEXT = /^[-–—]?\s*\d{1,4}\s*[-–—]?$/;
function pageNumberBetween(b, p, c, pageHeights) {
  if (b.type !== "paragraph" || !b.bbox || !PAGE_NUMBER_TEXT.test(b.text?.trim() ?? "")) return false;
  const h = b.pageNumber ? pageHeights?.get(b.pageNumber) : void 0;
  if (!h) return false;
  if (b.pageNumber === p.pageNumber) return b.bbox.y + b.bbox.height <= Math.min(p.bbox.y, h * PAGE_EDGE_BAND) + 1;
  if (b.pageNumber === c.pageNumber) return b.bbox.y >= Math.max(c.bbox.y + c.bbox.height, h * (1 - PAGE_EDGE_BAND)) - 1;
  return false;
}
function leftColumnOf(b, t) {
  return !!b.bbox && b.pageNumber === t.pageNumber && b.bbox.x + b.bbox.width <= t.bbox.x + 1;
}
function placeJoined(blocks, i, j, table) {
  const prev = blocks[i];
  blocks[i] = { ...prev, table };
  blocks.splice(j, 1);
  let k = j - 1;
  while (k > i && !leftColumnOf(blocks[k], prev)) k--;
  if (k > i) blocks.splice(k, 0, blocks.splice(i, 1)[0]);
}
function insideTable(b, t) {
  if (!b.bbox || b.pageNumber !== t.pageNumber) return false;
  const o = t.bbox;
  return b.bbox.x >= o.x - 1 && b.bbox.x + b.bbox.width <= o.x + o.width + 1 && b.bbox.y >= o.y - 1 && b.bbox.y + b.bbox.height <= o.y + o.height + 1;
}
function startsWithUnitRow(table) {
  return /^\s*\(\s*단위\s*[:：]/.test(table.cells[0]?.[0]?.text ?? "") && table.cells[0]?.slice(1).every((c) => !c.text.trim());
}
function sameHeadShape(a, b) {
  if (!a || !b || a.length !== b.length) return false;
  let tall = false;
  for (let c = 0; c < a.length; c++) {
    if (a[c].colSpan !== b[c].colSpan || a[c].rowSpan !== b[c].rowSpan) return false;
    if (a[c].rowSpan >= 2 && a[c].text.trim() && b[c].text.trim()) tall = true;
  }
  return tall;
}
function mergeCrossPageTables(blocks, pageHeights, lex) {
  mergeColumnFlow(blocks, pageHeights, lex);
  for (let i = blocks.length - 2; i >= 0; i--) {
    const tail = tailOf(blocks[i]);
    if (tail.type !== "table" || !tail.table || !tail.bbox || !tail.pageNumber) continue;
    let j = i + 1;
    const skip = (b) => b.type !== "table" || [blocks[i], tail].some((t) => insideTable(b, t) || leftColumnOf(b, t));
    while (j < blocks.length && skip(blocks[j]) && (blocks[j].pageNumber ?? 0) <= tail.pageNumber + 1) j++;
    const curr = blocks[j];
    const prev = tail !== blocks[i] && curr?.pageNumber === tail.pageNumber ? blocks[i] : tail;
    if (!prev.table || !prev.bbox || !prev.pageNumber) continue;
    if (!curr || curr.type !== "table" || !curr.table || !curr.bbox || curr.pageNumber !== prev.pageNumber + 1) continue;
    if (startsWithUnitRow(prev.table) && startsWithUnitRow(curr.table)) continue;
    const joined = j === i + 1 || blocks.slice(i + 1, j).every((b) => besideOwn(b, prev, curr) || insideTable(b, prev) || pageNumberBetween(b, prev, curr, pageHeights)) ? looksContinued(prev, curr, pageHeights) && !restartsTable(blocks, i, curr.table, pageHeights) ? joinClipParts(prev, curr, pageHeights, lex) ?? false : null : null;
    if (joined) {
      placeJoined(blocks, i, j, joined);
      continue;
    }
    if (EMPTY_PARTS.has(curr.table)) {
      blocks.splice(j, 1);
      i++;
      continue;
    }
    if (joined === null) continue;
    if (prev.table.cols !== curr.table.cols || prev.table.renderAsTable !== curr.table.renderAsTable || EMPTY_PARTS.has(prev.table)) continue;
    const width = Math.max(prev.bbox.width, curr.bbox.width, 1);
    const leftDiff = Math.abs(prev.bbox.x - curr.bbox.x);
    const rightDiff = Math.abs(prev.bbox.x + prev.bbox.width - (curr.bbox.x + curr.bbox.width));
    if (leftDiff > width * NEIGHBOR_TABLE_EPSILON || rightDiff > width * NEIGHBOR_TABLE_EPSILON) continue;
    const px = TABLE_COLXS.get(prev.table), cx = TABLE_COLXS.get(curr.table);
    if (px && cx && !shiftedSame(px, cx, !CLIP_TABLES.has(prev.table) && !CLIP_TABLES.has(curr.table))) continue;
    if (!rowTextsEqual(prev.table.cells[0], curr.table.cells[0]) && sameHeadShape(prev.table.cells[0], curr.table.cells[0])) continue;
    let currCells = curr.table.cells;
    const headRows = repeatedHeaderRows(prev.table, curr.table);
    if (headRows < 0) continue;
    if (headRows) currCells = currCells.slice(headRows);
    if (currCells.length) continueRowSpans(prev.table.cells, currCells);
    if (currCells.length === 0) {
      blocks.splice(j, 1);
      continue;
    }
    if (px && cx && !CLIP_TABLES.has(prev.table) && !CLIP_TABLES.has(curr.table) && currCells.length < curr.table.cells.length && curr.table.cells[0].filter((c) => c.text.trim()).length >= 2 && prev.table.cells.at(-1).concat(currCells[0]).every((c) => c.rowSpan === 1 && c.colSpan === 1 && CELL_LINES.has(c))) {
      const dx = px[0] - cx[0];
      const part = joinSplitParts(prev.table, px, curr.table, cx.map((x) => x + dx), dx, void 0, lex);
      if (part?.split && part.table.rows === prev.table.rows + currCells.length - 1) {
        const last = prev.table.rows - 1;
        for (let c = 0; c < part.table.cols; c++) {
          const U = CELL_LINES.get(prev.table.cells[last][c]), D = CELL_LINES.get(currCells[0][c]);
          CELL_LINES.set(part.table.cells[last][c], U.concat(D.map((l) => ({ ...l, l: l.l + dx, r: l.r + dx }))));
        }
        TABLE_COLXS.set(part.table, part.colXs);
        placeJoined(blocks, i, j, part.table);
        continue;
      }
    }
    const merged = {
      rows: prev.table.rows + currCells.length,
      cols: prev.table.cols,
      cells: [...prev.table.cells, ...currCells],
      hasHeader: prev.table.hasHeader,
      caption: prev.table.caption,
      ...prev.table.renderAsTable ? { renderAsTable: true } : {}
    };
    if (px ?? cx) TABLE_COLXS.set(merged, px ?? cx);
    if (CLIP_TABLES.has(prev.table) || CLIP_TABLES.has(curr.table)) CLIP_TABLES.add(merged);
    placeJoined(blocks, i, j, merged);
  }
  for (let i = blocks.length - 1; i >= 0; i--) {
    const t = blocks[i].table;
    if (blocks[i].type === "table" && t && EMPTY_PARTS.has(t)) blocks.splice(i, 1);
  }
}
function mergeColumnFlow(blocks, pageHeights, lex) {
  if (!pageHeights) return;
  for (let i = 0; i < blocks.length; i++) {
    const L = blocks[i];
    if (L.type !== "table" || !L.table || !L.bbox || !L.pageNumber || !CLIP_TABLES.has(L.table) || EMPTY_PARTS.has(L.table)) continue;
    const ph = pageHeights.get(L.pageNumber);
    if (!ph || L.bbox.y > ph * PAGE_EDGE_BAND) continue;
    let s0 = i, s1 = i;
    while (s0 > 0 && blocks[s0 - 1].pageNumber === L.pageNumber) s0--;
    while (s1 + 1 < blocks.length && blocks[s1 + 1].pageNumber === L.pageNumber) s1++;
    let k = -1;
    for (let q = s0; q <= s1; q++) {
      const R2 = blocks[q];
      if (q === i || R2.type !== "table" || !R2.table || !R2.bbox || !leftColumnOf(L, R2)) continue;
      const top2 = R2.bbox.y + R2.bbox.height;
      if (top2 < ph * (1 - PAGE_EDGE_BAND)) continue;
      if (k < 0 || top2 > blocks[k].bbox.y + blocks[k].bbox.height) k = q;
    }
    if (k < 0) continue;
    const R = blocks[k];
    if (Math.abs(R.bbox.width - L.bbox.width) > Math.max(R.bbox.width, L.bbox.width) * NEIGHBOR_TABLE_EPSILON) continue;
    if (!looksContinued(L, R) || restartsTable(blocks, i, R.table, pageHeights)) continue;
    const joined = joinClipParts(L, R, pageHeights, lex);
    if (!joined) continue;
    const top = L.bbox.y + L.bbox.height;
    const at = Math.min(i, k);
    blocks[at] = { ...L, table: joined, bbox: { ...L.bbox, y: R.bbox.y, height: Math.max(0, top - R.bbox.y) } };
    blocks.splice(Math.max(i, k), 1);
    i = at - 1;
  }
}
function joinClipParts(prev, curr, pageHeights, lex) {
  const pt = prev.table, ct = curr.table;
  if (!CLIP_TABLES.has(pt) || !CLIP_TABLES.has(ct)) return null;
  const px = TABLE_COLXS.get(pt), cx = TABLE_COLXS.get(ct);
  if (!px || !cx) return null;
  let xs = cx, shifted = false, dx = 0, foreign = false, within = false;
  if (!shiftedSame(px, cx, false)) {
    if (!pageHeights?.get(prev.pageNumber) || !pageHeights?.get(curr.pageNumber)) return null;
    dx = px[px.length - 1] - cx[cx.length - 1];
    within = Math.abs(dx) > CONTINUATION_COL_TOL && cx.length >= 3 && cx.every((x) => px.some((p) => Math.abs(p - x) <= CONTINUATION_COL_TOL));
    if (Math.abs(dx) > CONTINUATION_COL_TOL && !within) {
      xs = cx.map((x) => x + dx);
      shifted = true;
    } else dx = 0;
    if (!px.some((x) => Math.abs(x - xs[0]) <= CONTINUATION_COL_TOL) && !prevLacksLeftCols(prev, px, xs, pageHeights)) return null;
    const unrelated = (b) => {
      const inner = b.slice(1, -1).map((x) => x + dx);
      return inner.length > 0 && !inner.some((x) => px.some((p) => Math.abs(p - x) <= CONTINUATION_COL_TOL));
    };
    foreign = unrelated(cx) && unrelated(PART_COLXS.get(ct) ?? cx) && (headingRow(ct.cells[0] ?? []) || px.length > FOREIGN_FIRST_ROW_CELLS && anchorsOf(ct).filter((a) => a.r === 0).length >= FOREIGN_FIRST_ROW_CELLS);
  }
  const res = joinSplitParts(pt, px, ct, xs, dx, prev.bbox?.y, lex);
  if (!res || (shifted || foreign || within) && !res.split && !res.header) return null;
  TABLE_COLXS.set(res.table, res.colXs);
  const ys = TABLE_ROWYS.get(pt);
  if (ys) TABLE_ROWYS.set(res.table, ys);
  PART_COLXS.set(res.table, PART_COLXS.get(pt) ?? px);
  CLIP_TABLES.add(res.table);
  return res.table;
}
function prevLacksLeftCols(prev, px, xs, pageHeights) {
  const ph = pageHeights?.get(prev.pageNumber);
  if (!ph || prev.bbox.y + prev.bbox.height < ph * (1 - PAGE_EDGE_BAND)) return false;
  return xs[0] < px[0] && xs.slice(1, -1).some((x) => Math.abs(x - px[0]) <= CONTINUATION_COL_TOL);
}
function headingRow(row) {
  const heads = row.map((c) => flowText(c.text).replace(/\s+/g, "")).filter(Boolean);
  if (heads.length === 1) return heads[0].length <= 8 || /^[①-⑳❶-❿]/.test(heads[0]);
  return heads.length === 2 && /^(?:\d{1,2}|[ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩ]+|[①-⑳❶-❿])$/.test(heads[0]);
}
var ANNEX_HEAD_RE = /^\s*[<\[(【]?\s*(?:붙\s*임|참\s*고|별\s*첨|별\s*지|별\s*표|첨\s*부|부\s*록)(?:\s*\d|\s*$|\s*[>\])】])|^\s*■/;
function looksContinued(prev, curr, pageHeights) {
  const ph = pageHeights?.get(prev.pageNumber), ch = pageHeights?.get(curr.pageNumber);
  if (ph && ch && (prev.bbox.y > ph * PAGE_EDGE_BAND && !pushedLead(prev, curr) || curr.bbox.y + curr.bbox.height < ch * (1 - PAGE_EDGE_BAND))) return false;
  const firstRow = curr.table.cells[0] ?? [];
  const firstText = firstRow.find((c) => c.text.trim())?.text ?? "";
  if (!ANNEX_HEAD_RE.test(firstText)) return true;
  const filled = firstRow.map((c) => flowText(c.text).replace(/\s+/g, "")).filter(Boolean);
  return filled.length >= 2 && filled.every((t) => t === filled[0]);
}
function pushedLead(prev, curr) {
  if (!CLIP_TABLES.has(prev.table) || !CLIP_TABLES.has(curr.table)) return false;
  const lead = leadRows(curr.table);
  return lead.image && lead.height > prev.bbox.y;
}
function leadRows(t) {
  const ys = TABLE_ROWYS.get(t);
  if (!ys || ys.length < 2) return { height: 0, image: false };
  const anchors = anchorsOf(t);
  let end = 1, image = false;
  for (let r = 0; r < end; r++) {
    for (const a of anchors) {
      if (a.r !== r) continue;
      end = Math.max(end, r + a.rs);
      if (IMAGE_CELLS.has(a.cell)) image = true;
    }
  }
  return { height: ys[0] - ys[Math.min(end, ys.length - 1)], image };
}
function tailOf(b) {
  const t = b.table && TABLE_TAIL.get(b.table);
  return t && b.bbox ? { ...b, pageNumber: t.page, bbox: { ...b.bbox, page: t.page, y: t.y, height: t.height } } : b;
}
function firstRowSig(t) {
  const x = TABLE_COLXS.get(t);
  if (!x || x.length !== t.cols + 1) return null;
  return anchorsOf(t).filter((a) => a.r === 0).map((a) => ({ x1: x[a.c], x2: x[a.c + a.cs], t: flowText(a.cell.text).replace(/\s+/g, "") }));
}
function restartsTable(blocks, i, curr, pageHeights) {
  const cs = firstRowSig(curr);
  if (!cs) return false;
  const head = blocks[chainHead(blocks, i, pageHeights)].table;
  if (cs.length === 1 && restartsTitledForm(head, curr)) return true;
  if (cs.length < RESTART_MIN_ANCHORS) return false;
  if (CONTACT_HEAD.test(cs[0].t) && cs.some((c) => CONTACT_ROLE.test(c.t))) return false;
  const hs = firstRowSig(head);
  if (!hs || hs.length !== cs.length) return false;
  const dx = hs[hs.length - 1].x2 - cs[cs.length - 1].x2;
  if (!hs.every((h, n) => Math.abs(h.x1 - cs[n].x1 - dx) <= CONTINUATION_COL_TOL && Math.abs(h.x2 - cs[n].x2 - dx) <= CONTINUATION_COL_TOL)) return false;
  let same = 0, diff = 0;
  for (let n = 0; n < hs.length; n++) {
    if (!hs[n].t && !cs[n].t) continue;
    if (hs[n].t === cs[n].t) same++;
    else diff++;
  }
  return same >= 2 && diff >= 1;
}
function restartsTitledForm(head, curr) {
  if (head.rows < 2 || curr.rows < 2 || head.cols !== curr.cols) return false;
  const full = (t) => t.cells[0][0]?.colSpan === t.cols;
  if (!full(head) || !full(curr)) return false;
  const norm = (c) => flowText(c?.text ?? "").replace(/\s+/g, "");
  const ht = norm(head.cells[0][0]), ct = norm(curr.cells[0][0]);
  if (!ht || !ct || ht === ct) return false;
  const titleLike = (t) => t.length <= TITLE_ROW_MAX_CHARS && !/^[ㅇ○◦•·\-–※*□■▪☞]/.test(t);
  if (!titleLike(ht) || !titleLike(ct)) return false;
  const spans = (t) => anchorsOf(t).filter((a) => a.r === 1).map((a) => `${a.c}:${a.cs}`).join(",");
  const label = norm(head.cells[1][0]);
  return spans(head) === spans(curr) && label !== "" && label === norm(curr.cells[1][0]);
}
function chainHead(blocks, i, pageHeights) {
  let k = i;
  for (let steps = 0; steps < RESTART_LOOKBACK_PAGES; steps++) {
    const cur = blocks[k];
    let p = k - 1;
    while (p >= 0 && blocks[p].type !== "table" && (blocks[p].pageNumber ?? 0) >= (cur.pageNumber ?? 0) - 1) p--;
    if (p < 0 || blocks[p].type !== "table" || !blocks[p].table || !blocks[p].bbox) break;
    for (let q = p - 1; q >= 0 && blocks[q].pageNumber === blocks[p].pageNumber; q--) {
      if (blocks[q].type === "table" && blocks[q].bbox && insideTable(blocks[p], blocks[q])) {
        p = q;
        break;
      }
    }
    const pb = tailOf(blocks[p]);
    if (pb.pageNumber !== (cur.pageNumber ?? 0) - 1) break;
    if (!blocks.slice(p + 1, k).every((b) => besideOwn(b, pb, cur) || insideTable(b, pb) || pageNumberBetween(b, pb, cur, pageHeights))) break;
    if (!looksContinued(pb, cur, pageHeights)) break;
    const px = TABLE_COLXS.get(pb.table), cx = TABLE_COLXS.get(cur.table);
    if (!px || !cx) break;
    const dx = px[px.length - 1] - cx[cx.length - 1];
    if (!shiftedSame(px, cx) && !px.some((x) => Math.abs(x - (cx[0] + dx)) <= CONTINUATION_COL_TOL) && !prevLacksLeftCols(pb, px, cx, pageHeights)) break;
    k = p;
  }
  return k;
}
var ROW_CONTINUATIONS = /* @__PURE__ */ new WeakMap();
function continueRowSpans(prevCells, currCells) {
  const first = currCells[0];
  const last = prevCells.length;
  for (let c = 0; c < first.length; c++) {
    const cell = first[c];
    if (hasContent(cell) || (cell.rowSpan || 1) < 2) continue;
    let anchor;
    for (let r = last - 1; r >= 0 && !anchor; r--) {
      const a = prevCells[r]?.[c];
      if (a && r + (a.rowSpan || 1) === last && (a.colSpan || 1) === (cell.colSpan || 1) && (hasContent(a) || a.rowSpan >= 2)) anchor = a;
    }
    if (!anchor) continue;
    if (!hasContent(anchor)) {
      ROW_CONTINUATIONS.set(anchor, cell);
      continue;
    }
    for (let part = cell; part; ) {
      const next = ROW_CONTINUATIONS.get(part);
      anchor.rowSpan = (anchor.rowSpan || 1) + part.rowSpan;
      part.rowSpan = 1;
      part.colSpan = 1;
      ROW_CONTINUATIONS.delete(part);
      part = next;
    }
  }
}
function repeatedHeaderRows(prev, curr) {
  if (!rowTextsEqual(prev.cells[0], curr.cells[0])) return 0;
  const pa = anchorsOf(prev), ca = anchorsOf(curr);
  let depth = 1;
  for (let r = 0; r < depth && r < prev.rows; r++) {
    for (const a of pa) if (a.r === r) depth = Math.max(depth, r + a.rs);
  }
  if (depth >= curr.rows || depth > prev.rows) return -1;
  const p = pa.filter((a) => a.r < depth), d = ca.filter((a) => a.r < depth);
  const norm = (text) => flowText(text).replace(/\s+/g, "");
  return p.length === d.length && p.every((a, i) => a.r === d[i].r && a.c === d[i].c && a.rs === d[i].rs && a.cs === d[i].cs && norm(a.cell.text) === norm(d[i].cell.text)) ? depth : -1;
}
function rowTextsEqual(a, b) {
  if (a.length !== b.length) return false;
  const norm = (t) => flowText(t).replace(/\s+/g, "");
  for (let i = 0; i < a.length; i++) {
    if (norm(a[i].text) !== norm(b[i].text)) return false;
  }
  return a.some((c) => c.text.trim() !== "");
}
var CONTINUATION_COL_TOL = 2;
var FOREIGN_FIRST_ROW_CELLS = 3;
function shiftedSame(px, cx, allowShift = true) {
  if (px.length !== cx.length) return false;
  const dx = allowShift ? px[px.length - 1] - cx[cx.length - 1] : 0;
  return px.every((x, k) => Math.abs(x - cx[k] - dx) <= CONTINUATION_COL_TOL);
}
var PAGE_EDGE_BAND = 0.16;
var RESTART_MIN_ANCHORS = 3;
var TITLE_ROW_MAX_CHARS = 40;
var RESTART_LOOKBACK_PAGES = 5;
var COL_MATCH_TOL = 0.5;
var CONTINUED_TABLE_PAGE_BAND = 0.16;
function lastRowCell(t, x1, x2) {
  const xs = TABLE_COLXS.get(t);
  const covered = /* @__PURE__ */ new Set();
  for (let r = 0; r < t.rows; r++) {
    for (let c = 0; c < t.cols; c++) {
      if (covered.has(r * 1e5 + c)) continue;
      const cell = t.cells[r]?.[c];
      if (!cell) continue;
      for (let dr = 0; dr < cell.rowSpan; dr++) for (let dc = 0; dc < cell.colSpan; dc++) covered.add((r + dr) * 1e5 + c + dc);
      if (r + cell.rowSpan !== t.rows) continue;
      if (xs ? Math.abs(xs[c] - x1) <= COL_MATCH_TOL && Math.abs(xs[c + cell.colSpan] - x2) <= COL_MATCH_TOL : t.cols === 1) return cell;
    }
  }
  return void 0;
}
var cellBlocks = (cell, pageNumber) => cell.blocks ?? cell.text.split("\n").map((t) => t.trim()).filter(Boolean).map((text) => ({ type: "paragraph", text, pageNumber }));
function mergeContinuedCells(blocks, pageHeights) {
  for (let j = blocks.length - 1; j > 0; j--) {
    const part = blocks[j];
    const from = part.table ? CONT_PARTS.get(part.table) : void 0;
    if (!from || !part.table) continue;
    let i = j - 1;
    while (i >= 0 && blocks[i].type !== "table") i--;
    const prev = blocks[i];
    if (i < 0 || !prev.table || prev.pageNumber !== (part.pageNumber ?? 0) - 1) continue;
    const cell = lastRowCell(prev.table, from.x1, from.x2);
    const add = part.table.cells[0]?.[0];
    if (!cell || !add) continue;
    const at = cell.blocks || add.blocks ? cellBlocks(cell, prev.pageNumber).length : -1;
    if (cell.blocks || add.blocks) cell.blocks = [...cellBlocks(cell, prev.pageNumber), ...cellBlocks(add, part.pageNumber)];
    cell.text = [cell.text, add.text].filter((s) => s.trim()).join("\n");
    joinCellEdges(cell, add);
    const lines = CELL_LINES.get(add);
    if (lines?.length) CELL_LINES.set(cell, [...CELL_LINES.get(cell) ?? [], ...lines]);
    if (part.pageNumber && part.bbox) TABLE_TAIL.set(prev.table, TABLE_TAIL.get(part.table) ?? { page: part.pageNumber, y: part.bbox.y, height: part.bbox.height });
    if (cell.text.trim() || cell.blocks?.length) EMPTY_PARTS.delete(prev.table);
    blocks.splice(j, 1);
    if (cell.blocks && at > 0) {
      const nextAt = cell.blocks[at];
      fillNestedContinuation(cell.blocks, at);
      if (cell.blocks[at] === nextAt) unwrapContinuedTable(cell.blocks, at, pageHeights);
    }
    if (cell.blocks) mergeCrossPageTables(cell.blocks, pageHeights);
  }
}
function unwrapContinuedTable(blocks, at, pageHeights) {
  const prev = blocks[at - 1], frame = blocks[at];
  if (!prev?.table || !frame?.table || frame.table.rows !== 1 || frame.table.cols !== 1 || !CLIP_TABLES.has(frame.table)) return;
  const inner = frame.table.cells[0]?.[0]?.blocks;
  const next = inner?.[0];
  if (!inner || !next?.table || !prev.bbox || !next.bbox || !prev.pageNumber || next.pageNumber !== prev.pageNumber + 1 || !CLIP_TABLES.has(prev.table) || !CLIP_TABLES.has(next.table) || prev.table.cols !== next.table.cols) return;
  const px = TABLE_COLXS.get(prev.table), nx = TABLE_COLXS.get(next.table);
  if (!px || !nx || px.length !== nx.length || px.some((x, i) => Math.abs(x - nx[i]) > COL_MATCH_TOL)) return;
  const ph = pageHeights?.get(prev.pageNumber), nh = pageHeights?.get(next.pageNumber);
  if (!ph || !nh || prev.bbox.y > ph * CONTINUED_TABLE_PAGE_BAND || next.bbox.y + next.bbox.height < nh * (1 - CONTINUED_TABLE_PAGE_BAND)) return;
  blocks.splice(at, 1, ...inner);
}
function fillNestedContinuation(blocks, at) {
  const prev = blocks[at - 1], next = blocks[at];
  const t = prev?.table, u = next?.table;
  if (!t || !u || u.rows !== 1 || u.cols !== 1 || !CLIP_TABLES.has(t) || !CLIP_TABLES.has(u) || next.pageNumber !== (prev.pageNumber ?? 0) + 1) return;
  const xs = TABLE_COLXS.get(u);
  const cell = xs ? lastRowCell(t, xs[0], xs[xs.length - 1]) : void 0;
  const add = u.cells[0]?.[0];
  if (!cell || !add || cell.text.trim() || cell.blocks?.length) return;
  cell.text = add.text;
  if (add.blocks) cell.blocks = add.blocks;
  joinCellEdges(cell, add);
  blocks.splice(at, 1);
}
function selectionContextPages(selected, pageCount) {
  const out = /* @__PURE__ */ new Set();
  for (const page of selected) {
    for (let distance = 1; distance <= 4; distance++) {
      for (const neighbor of [page - distance, page + distance]) {
        if (neighbor < 1 || neighbor > pageCount || selected.has(neighbor)) continue;
        out.add(neighbor);
      }
    }
  }
  return [...out].sort((a, b) => a - b);
}
function marginContextBlocks(raw, page, view) {
  const [x1, y1, x2, y2] = view;
  const width = x2 - x1, height = y2 - y1;
  const items = filterHiddenText(normalizeItems(raw), width, height, x1, y1).visible;
  for (const item of items) {
    item.x -= x1;
    item.y -= y1;
  }
  return groupByY(items).flatMap((line) => {
    const bbox = computeBBox(line, page);
    if (bbox.y + bbox.height < height * 0.88 && bbox.y > height * 0.12) return [];
    return [{ type: "paragraph", text: mergeLineSimple(line), pageNumber: page, bbox, style: dominantStyle(line) }];
  });
}
var WINANSI_REVERSE = {
  8364: 128,
  8218: 130,
  402: 131,
  8222: 132,
  8230: 133,
  8224: 134,
  8225: 135,
  710: 136,
  8240: 137,
  352: 138,
  8249: 139,
  338: 140,
  381: 142,
  8216: 145,
  8217: 146,
  8220: 147,
  8221: 148,
  8226: 149,
  8211: 150,
  8212: 151,
  732: 152,
  8482: 153,
  353: 154,
  8250: 155,
  339: 156,
  382: 158,
  376: 159
};
function symbolFontTable(fontName) {
  if (!fontName) return void 0;
  if (/wingdings(?![\s-]*[23])/i.test(fontName)) return WINGDINGS;
  return void 0;
}
function remapSymbolText(text, table) {
  let out = "";
  for (const ch of text) {
    let code = ch.codePointAt(0);
    if (code >= 128 && WINANSI_REVERSE[code] !== void 0) code = WINANSI_REVERSE[code];
    if (code >= 33 && code <= 255) {
      const mapped = table[code - 33];
      out += mapped !== void 0 && mapped !== "" ? mapped : ch;
    } else {
      out += ch;
    }
  }
  return out;
}
function remapSymbolFontItems(items, resolveFontName) {
  const cache = /* @__PURE__ */ new Map();
  const marlett = /* @__PURE__ */ new Map();
  let changed = 0;
  let box = null;
  const drop = /* @__PURE__ */ new Set();
  for (const it of items) {
    if (!it.fontName || !it.text) continue;
    if (!marlett.has(it.fontName)) marlett.set(it.fontName, /marlett/i.test(resolveFontName(it.fontName) ?? ""));
    if (marlett.get(it.fontName)) {
      const t = it.text.trim();
      if (t === "g") {
        it.text = "\u2610";
        box = it;
        changed++;
      } else if (/^[c-f]$/.test(t)) {
        drop.add(it);
        changed++;
      } else if (t === "b" && box && Math.abs(box.x - it.x) <= 1 && Math.abs(box.y - it.y) <= 1) {
        box.text = "\u2611";
        drop.add(it);
        changed++;
      }
      continue;
    }
    let table = cache.get(it.fontName);
    if (!cache.has(it.fontName)) {
      table = symbolFontTable(resolveFontName(it.fontName));
      cache.set(it.fontName, table);
    }
    if (!table) continue;
    const mapped = remapSymbolText(it.text, table);
    if (mapped !== it.text) {
      it.text = mapped;
      changed++;
    }
  }
  if (drop.size) {
    for (let k = items.length - 1; k >= 0; k--) if (drop.has(items[k])) items.splice(k, 1);
  }
  return changed;
}
var EQ_FONT_RE = /^(?:Hy)?hwpEQ/i;
var BAR = 109;
var GREEK = ["alpha", "beta", "gamma", "delta", "epsilon", "zeta", "eta", "theta", "iota", "kappa", "lambda", "mu", "nu", "xi", "o", "pi", "rho", "sigma", "tau", "upsilon", "phi", "chi", "psi", "omega"];
var PLAIN = {
  "\u2192": "\\to ",
  "\u2264": "\\le ",
  "\u2265": "\\ge ",
  "\xD7": "\\times ",
  "\xB7": "\\cdot ",
  "\u22C5": "\\cdot ",
  "\u2219": "\\cdot ",
  "\u221E": "\\infty ",
  "\u2212": "-",
  "\u22EF": "\\cdots ",
  "\u2220": "\\angle ",
  "\u2234": "\\therefore ",
  "\u2235": "\\because ",
  "\u2229": "\\cap ",
  "\u222A": "\\cup ",
  "\u2260": "\\ne ",
  "\xB0": "^{\\circ}",
  "\u22A5": "\\perp ",
  "\u220F": "\\prod ",
  "\xB1": "\\pm ",
  "\u2209": "\\notin ",
  "\u2282": "\\subset ",
  "\u21D2": "\\Rightarrow "
};
var SYMBOLS = {
  68: "(",
  69: ")",
  70: "-",
  71: "=",
  72: "+",
  73: "[",
  74: "]",
  75: "\\{",
  76: "\\}",
  77: "|",
  79: ":",
  82: ",",
  83: ".",
  85: "<",
  86: ">",
  91: "\\int ",
  92: "\\sqrt",
  103: "\\sum "
};
function decodeEq(ch) {
  const cp = ch.codePointAt(0);
  if (cp < 57344 || cp > 57599) return PLAIN[ch] ?? ch;
  const c = cp - 57344;
  if (c <= 25) return String.fromCharCode(65 + c);
  if (c >= 52 && c <= 60) return String(c - 51);
  if (c === 61) return "0";
  if (c >= 229 && c <= 254) return String.fromCharCode(97 + c - 229);
  if (c >= 157 && c < 157 + GREEK.length) return `\\${GREEK[c - 157]} `;
  return SYMBOLS[c] ?? "";
}
var FUNC_RE = /^(lim|sin|cos|tan|log|ln|exp|max|min)$/;
function layout(toks) {
  let rest = toks.filter((t) => t.bar || t.text.trim());
  for (const rt of rest.filter((t) => t.text === "\\sqrt").sort((a, b) => b.x - a.x)) {
    const size = Math.max(rt.size, 1);
    const bar = rest.find((t) => t.bar && t.x >= rt.x && t.x <= rt.x + rt.w + 2 && Math.abs(t.y - rt.y) <= size * 1.5);
    if (!bar) continue;
    const inner = rest.filter((t) => !t.bar && t !== rt && t.x + t.w / 2 > bar.x && t.x + t.w / 2 < bar.x + bar.w && bar.y - t.y > 0 && bar.y - t.y <= size * 1.4);
    const tok = { text: `\\sqrt{${linear(inner)}}`, x: rt.x, w: bar.x + bar.w - rt.x, y: inner[0]?.y ?? rt.y, size: Math.max(rt.size, ...inner.map((t) => t.size)), bar: false };
    rest = [...rest.filter((t) => t !== rt && t !== bar && !inner.includes(t)), tok];
  }
  const bars = rest.filter((t) => t.bar).sort((a, b) => a.w - b.w);
  for (const bar of bars) {
    const inX = (t) => t !== bar && t.x + t.w / 2 >= bar.x - 1 && t.x + t.w / 2 <= bar.x + bar.w + 1;
    const num = rest.filter((t) => inX(t) && t.y > bar.y), den = rest.filter((t) => inX(t) && t.y < bar.y);
    if (!num.length || !den.length) continue;
    const fsize = Math.max(...num.map((t) => t.size), ...den.map((t) => t.size));
    const frac = { text: `\\frac{${linear(num)}}{${linear(den)}}`, x: bar.x, w: bar.w, y: Math.round(bar.y + fsize * 0.3), size: fsize, bar: false };
    rest = [...rest.filter((t) => t !== bar && !num.includes(t) && !den.includes(t)), frac];
  }
  return linear(rest.filter((t) => !t.bar));
}
function linear(toks) {
  const sorted = [...toks].sort((a, b) => a.x - b.x);
  if (!sorted.length) return "";
  const size = Math.max(...sorted.map((t) => t.size));
  const base = sorted.find((t) => t.size === size).y;
  let out = "", scr = "", kind = "";
  const flushScr = () => {
    if (scr) {
      out += `${kind}{${scr.trim()}}`;
      scr = "";
      kind = "";
    }
  };
  for (const t of sorted) {
    const small = t.size < size * 0.9;
    const k = small && t.y > base + size * 0.2 ? "^" : small && t.y < base - size * 0.1 || t.y < base - size * 0.3 ? "_" : "";
    if (k) {
      if (kind && kind !== k) flushScr();
      kind = k;
      scr += t.text;
      continue;
    }
    flushScr();
    out += FUNC_RE.test(t.text) ? `\\${t.text} ` : t.text;
  }
  flushScr();
  return out.replace(/\s+/g, " ").trim();
}
var isBarItem = (it) => it.text.length === 1 && it.text.codePointAt(0) === 57344 + BAR;
var sizeOf = (it) => isBarItem(it) ? 0 : it.fontSize;
function near(a, b) {
  const size = Math.max(sizeOf(a), sizeOf(b), 1);
  const gap = Math.max(a.x, b.x) - Math.min(a.x + a.w, b.x + b.w);
  const dy = Math.abs(a.y - b.y);
  if (gap <= size * 0.8 && dy <= size * 0.6) return true;
  for (const [bar, o] of [[a, b], [b, a]]) {
    if (!isBarItem(bar) || isBarItem(o)) continue;
    const cx = o.x + o.w / 2;
    if (cx > bar.x && cx < bar.x + bar.w && dy > 0 && dy <= size * 1.2) return true;
  }
  return false;
}
function wrapEquationRuns(items, faceName) {
  const eqIdx = [];
  items.forEach((it, i) => {
    if (it.text.trim() && EQ_FONT_RE.test(faceName(it.fontName) ?? "")) eqIdx.push(i);
  });
  if (!eqIdx.length) return 0;
  const parent = eqIdx.map((_, k) => k);
  const find = (k) => {
    while (parent[k] !== k) {
      parent[k] = parent[parent[k]];
      k = parent[k];
    }
    return k;
  };
  for (let a = 0; a < eqIdx.length; a++) {
    for (let b = a + 1; b < eqIdx.length; b++) {
      const A = items[eqIdx[a]], B = items[eqIdx[b]];
      if (A.y - B.y > Math.max(sizeOf(A), sizeOf(B), 12) * 3) break;
      if (near(A, B)) parent[find(a)] = find(b);
    }
  }
  const clusters = /* @__PURE__ */ new Map();
  eqIdx.forEach((idx, k) => {
    const r = find(k);
    const arr = clusters.get(r);
    if (arr) arr.push(idx);
    else clusters.set(r, [idx]);
  });
  const drop = /* @__PURE__ */ new Set();
  const added = [];
  for (const members of clusters.values()) {
    const cur = members.map((i) => items[i]);
    for (const i of members) drop.add(i);
    const toks = cur.map((it) => {
      const bar2 = isBarItem(it);
      const text = bar2 ? "" : FUNC_RE.test(it.text.trim()) ? it.text.trim() : [...it.text].map(decodeEq).join("");
      return { text, x: it.x, y: it.y, w: it.w, size: sizeOf(it), bar: bar2 };
    });
    const tex = layout(toks);
    if (!tex) continue;
    const size = Math.max(...cur.map(sizeOf));
    const mains = cur.filter((i) => !isBarItem(i) && i.fontSize === size);
    const ys = /* @__PURE__ */ new Map();
    for (const i of mains) ys.set(i.y, (ys.get(i.y) ?? 0) + 1);
    const top = [...ys].sort((p, q) => q[1] - p[1]);
    const bar = cur.find(isBarItem);
    const lineY = bar && top.length > 1 && top[0][1] === top[1][1] ? Math.round(bar.y + size * 0.3) : top[0]?.[0] ?? cur[0].y;
    const base = { ...mains[0] ?? cur[0], y: lineY, fontSize: size || cur[0].fontSize };
    const x1 = Math.min(...cur.map((i) => i.x)), x2 = Math.max(...cur.map((i) => i.x + i.w));
    added.push({ ...base, text: `$${tex}$`, x: x1, w: x2 - x1, hasSpaceBefore: true });
  }
  const kept = items.filter((_, i) => !drop.has(i));
  items.length = 0;
  items.push(...kept, ...added);
  items.sort((a, b) => b.y - a.y || a.x - b.x);
  return added.length;
}
var NAMED = {
  zero: "0",
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
  period: ".",
  comma: ",",
  colon: ":",
  semicolon: ";",
  hyphen: "-",
  endash: "\u2013",
  emdash: "\u2014",
  space: " ",
  parenleft: "(",
  parenright: ")",
  bracketleft: "[",
  bracketright: "]",
  slash: "/",
  ampersand: "&",
  quoteleft: "\u2018",
  quoteright: "\u2019",
  quotedblleft: "\u201C",
  quotedblright: "\u201D",
  quotesingle: "'",
  quotedbl: '"',
  bullet: "\u2022",
  openbullet: "\u25E6",
  whitebullet: "\u25E6",
  question: "?",
  exclam: "!",
  percent: "%",
  dollar: "$",
  numbersign: "#",
  asterisk: "*",
  plus: "+",
  equal: "="
};
function glyphNameText(name) {
  const dot = name.indexOf(".");
  const base = dot > 0 ? name.slice(0, dot) : name;
  const smallCaps = dot > 0 && /^(?:sc|smcp|c2sc)$/.test(name.slice(dot + 1));
  let out = "";
  for (const part of base.split("_")) {
    const uni = /^uni([0-9A-F]{4})$/.exec(part) ?? /^u([0-9A-F]{4,6})$/.exec(part);
    const code = uni ? parseInt(uni[1], 16) : void 0;
    if (code !== void 0 && (code > 1114111 || code >= 55296 && code <= 57343)) return void 0;
    const ch = /^[A-Za-z]$/.test(part) ? part : NAMED[part] ?? (code !== void 0 ? String.fromCodePoint(code) : void 0);
    if (ch === void 0) return void 0;
    out += ch;
  }
  return smallCaps ? out.toUpperCase() : out;
}
function remapControlGlyphs(items, differencesOf) {
  let changed = 0;
  for (const it of items) {
    if (!it.fontName || !/[\u0001-\u0008\u000B\u000C\u000E-\u001F]/.test(it.text)) continue;
    const diffs = differencesOf(it.fontName);
    if (!diffs) continue;
    let out = "";
    for (const ch of it.text) {
      const code = ch.charCodeAt(0);
      const name = code < 32 && code !== 9 && code !== 10 && code !== 13 ? diffs[code] : void 0;
      out += (name && glyphNameText(name)) ?? ch;
    }
    if (out !== it.text) {
      it.text = out;
      changed++;
    }
  }
  return changed;
}
var isSmallCapName = (name) => /^[^.]+\.(?:sc|smcp|c2sc)$/.test(name);
var isRestorableCode = (code) => code < 32 || code >= 128 && code <= 159;
var TEX_CM_SYMBOL_NAMES = {
  thorn: "+",
  onequarter: "=",
  eth: "(",
  Thorn: ")",
  onehalf: "[",
  C138: "]",
  C0: "\u2212",
  C1: "\xB7",
  C2: "\xD7",
  C6: "\xB1",
  C24: "\u223C"
};
var TEX_CM_ITALIC_CODES = { 58: ".", 61: "/" };
var texCmGlyph = (face, code, name) => !face ? void 0 : /TeXCMMathsSymbols/.test(face) ? name ? TEX_CM_SYMBOL_NAMES[name] : void 0 : /TeXCMMathsItalic/.test(face) ? TEX_CM_ITALIC_CODES[code] : void 0;
function restoreNamedGlyphs(items, fnArray, argsArray, differencesOf, faceOf = () => void 0) {
  const targets = /* @__PURE__ */ new Map();
  for (const it of items) {
    if (!it.fontName || targets.has(it.fontName)) continue;
    const diffs = differencesOf(it.fontName);
    if (/TeXCMMaths(?:Symbols|Italic)/.test(faceOf(it.fontName) ?? "")) {
      targets.set(it.fontName, diffs ?? []);
      continue;
    }
    let hit = false;
    if (diffs) for (let c = 0; c < diffs.length && !hit; c++) {
      const name = diffs[c];
      hit = !!name && (isSmallCapName(name) || isRestorableCode(c) && glyphNameText(name) !== void 0);
    }
    targets.set(it.fontName, hit ? diffs : null);
  }
  if (![...targets.values()].some(Boolean)) return 0;
  const streams = /* @__PURE__ */ new Map();
  const saved = [];
  let font = "";
  for (let i = 0; i < fnArray.length; i++) {
    const fn = fnArray[i];
    const args = argsArray[i];
    if (fn === OPS3.setFont) font = String(args[0]);
    else if (fn === OPS3.save || fn === OPS3.paintFormXObjectBegin) saved.push(font);
    else if (fn === OPS3.restore || fn === OPS3.paintFormXObjectEnd) font = saved.pop() ?? font;
    else if (fn === OPS3.showText && targets.get(font)) {
      let list = streams.get(font);
      if (!list) streams.set(font, list = []);
      for (const g2 of args[0]) if (g2 && typeof g2 === "object") list.push(g2);
    }
  }
  const failed = /* @__PURE__ */ new Set();
  const outs = /* @__PURE__ */ new Map();
  const cursor = /* @__PURE__ */ new Map();
  for (const it of items) {
    const fontName = it.fontName ?? "";
    const diffs = targets.get(fontName);
    if (!diffs || failed.has(fontName) || typeof it.str !== "string") continue;
    const glyphs = streams.get(fontName) ?? [];
    const done = outs.get(fontName) ?? [];
    outs.set(fontName, done);
    const s = it.str;
    let gi = cursor.get(fontName) ?? 0, k = 0, out = "";
    while (k < s.length) {
      const g2 = glyphs[gi];
      if (!g2) {
        if (/^\s*$/.test(s.slice(k))) {
          out += s.slice(k);
          break;
        }
        failed.add(fontName);
        break;
      }
      const code = g2.originalCharCode ?? -1;
      const name = diffs[code];
      const raw = g2.unicode ?? "";
      const exp = new RegExp("^\\p{Cf}$", "u").test(raw) ? "" : normalizeUnicode(raw);
      const tex = texCmGlyph(faceOf(fontName), code, name);
      if (tex !== void 0 && (exp === "" || s.startsWith(exp, k))) {
        out += tex;
        k += exp.length;
        gi++;
        continue;
      }
      const named = name && isRestorableCode(code) && (exp === "" || /^[\s\u0000-\u001f\u0080-\u009f\ufffd]$/.test(exp)) ? glyphNameText(name) : void 0;
      if (/^\s/.test(exp)) {
        if (s[k] === " ") {
          out += named ?? " ";
          k++;
        } else if (named) {
          const prev = k === 0 ? [...done].reverse().find((d) => d.out !== "") : void 0;
          if (prev) prev.out += named;
          else out += named;
        }
        gi++;
        continue;
      }
      if (exp === "") {
        out += named ?? "";
        gi++;
        continue;
      }
      if (s.startsWith(exp, k)) {
        out += named ?? (name && isSmallCapName(name) ? exp.toUpperCase() : exp);
        k += exp.length;
        gi++;
        continue;
      }
      if (s[k] === " ") {
        out += " ";
        k++;
        continue;
      }
      let j = gi + 1;
      while (j < glyphs.length && j <= gi + 8 && !s.startsWith(normalizeUnicode(glyphs[j].unicode ?? "") || "\0", k)) j++;
      if (j < glyphs.length && j <= gi + 8) {
        gi = j;
        continue;
      }
      failed.add(fontName);
      break;
    }
    cursor.set(fontName, gi);
    done.push({ item: it, out });
  }
  let changed = 0;
  for (const [fontName, done] of outs) {
    if (failed.has(fontName)) continue;
    for (const { item, out } of done) if (out !== item.str) {
      item.str = out;
      changed++;
    }
  }
  return changed;
}
var glyphText = (s) => normalizeUnicode2(s).replace(/\s+/g, "");
function occludedTextItems(items, fnArray, argsArray) {
  const covers = [];
  let drawn = "";
  let ctm = [1, 0, 0, 1, 0, 0];
  let alpha = 1, normalBlend = true;
  let clip = void 0;
  let path = [];
  let pathOk = true;
  const stack = [];
  const box = (x, y, w, h) => {
    const xs = [], ys = [];
    for (const [px, py] of [[x, y], [x + w, y], [x, y + h], [x + w, y + h]]) {
      xs.push(ctm[0] * px + ctm[2] * py + ctm[4]);
      ys.push(ctm[1] * px + ctm[3] * py + ctm[5]);
    }
    return { x1: Math.min(...xs), y1: Math.min(...ys), x2: Math.max(...xs), y2: Math.max(...ys) };
  };
  const meet = (a, b) => ({ x1: Math.max(a.x1, b.x1), y1: Math.max(a.y1, b.y1), x2: Math.min(a.x2, b.x2), y2: Math.min(a.y2, b.y2) });
  for (let i = 0; i < fnArray.length; i++) {
    const fn = fnArray[i];
    const args = argsArray[i];
    if (fn === OPS4.save || fn === OPS4.paintFormXObjectBegin) {
      stack.push({ ctm: ctm.slice(), alpha, normalBlend, clip });
      const m = fn === OPS4.paintFormXObjectBegin ? args[0] : null;
      if (Array.isArray(m) && m.length >= 6) ctm = mul2(ctm, m);
    } else if (fn === OPS4.restore || fn === OPS4.paintFormXObjectEnd) {
      const s = stack.pop();
      if (s) ({ ctm, alpha, normalBlend, clip } = s);
    } else if (fn === OPS4.transform) ctm = mul2(ctm, args);
    else if (fn === OPS4.setGState) {
      const entries = args[0];
      if (Array.isArray(entries)) for (const e of entries) {
        if (!Array.isArray(e)) continue;
        if (e[0] === "ca" && typeof e[1] === "number") alpha = e[1];
        else if (e[0] === "BM") normalBlend = e[1] === "source-over" || e[1] === "Normal";
        else if (e[0] === "SMask" && e[1]) normalBlend = false;
      }
    } else if (fn === OPS4.showText) {
      for (const g2 of args[0]) {
        if (g2 && typeof g2 === "object" && typeof g2.unicode === "string") drawn += glyphText(g2.unicode);
      }
    } else if (fn === OPS4.constructPath) {
      const sub = args[0];
      const coords = args[1];
      if (!Array.isArray(sub)) {
        pathOk = false;
        continue;
      }
      let ci = 0;
      for (const op of sub) {
        if (op === OPS4.rectangle) {
          path.push(box(coords[ci], coords[ci + 1], coords[ci + 2], coords[ci + 3]));
          ci += 4;
        } else {
          pathOk = false;
          ci += op === OPS4.curveTo ? 6 : op === OPS4.curveTo2 || op === OPS4.curveTo3 ? 4 : op === OPS4.closePath ? 0 : 2;
        }
      }
    } else if (fn === OPS4.clip || fn === OPS4.eoClip) {
      clip = clip === null || !pathOk || path.length !== 1 ? null : clip ? meet(clip, path[0]) : path[0];
    } else if (fn === OPS4.fill || fn === OPS4.eoFill || fn === OPS4.fillStroke || fn === OPS4.eoFillStroke || fn === OPS4.endPath || fn === OPS4.stroke || fn === OPS4.closeStroke || fn === OPS4.closeFillStroke || fn === OPS4.closeEOFillStroke) {
      const fills = fn !== OPS4.endPath && fn !== OPS4.stroke && fn !== OPS4.closeStroke;
      if (fills && pathOk && path.length === 1 && alpha >= 1 && normalBlend && clip !== null && drawn.length > 0) {
        const rect = clip ? meet(path[0], clip) : path[0];
        if (rect.x2 > rect.x1 && rect.y2 > rect.y1) covers.push({ at: drawn.length, rect });
      }
      path = [];
      pathOk = true;
    }
  }
  const hidden = /* @__PURE__ */ new Set();
  if (covers.length === 0) return hidden;
  let pos = 0;
  for (const it of items) {
    const t = glyphText(it.str ?? "");
    const start = pos;
    pos += t.length;
    if (!t) continue;
    if (drawn.slice(start, pos) !== t) break;
    const [a, b, , , e, f] = it.transform;
    const size = Math.hypot(a, b) || it.height;
    const r = { x1: e, y1: f, x2: e + it.width, y2: f + size };
    if (covers.some((c) => c.at >= pos && r.x1 >= c.rect.x1 - 1 && r.x2 <= c.rect.x2 + 1 && r.y1 >= c.rect.y1 - 1 && r.y2 <= c.rect.y2 + 1)) hidden.add(it);
  }
  return hidden;
}
function mul2(m, t) {
  return [
    m[0] * t[0] + m[2] * t[1],
    m[1] * t[0] + m[3] * t[1],
    m[0] * t[2] + m[2] * t[3],
    m[1] * t[2] + m[3] * t[3],
    m[0] * t[4] + m[2] * t[5] + m[4],
    m[1] * t[4] + m[3] * t[5] + m[5]
  ];
}
var CJK = /^[ㄱ-ㆎ가-힣一-鿿]$/;
var PUNCT = /^[、。，．,.·ㆍ!?]$/;
function joinVerticalColumns(items) {
  const singles = items.filter((i) => !i.rotated && CJK.test(i.text) && i.fontSize > 0);
  if (singles.length < 8) return items;
  const cols = [];
  for (const it of [...singles].sort((a, b) => a.x - b.x)) {
    const c = cols.find((col) => Math.abs(col.x - it.x) <= it.fontSize * 0.15);
    if (c) c.items.push(it);
    else cols.push({ x: it.x, items: [it] });
  }
  const columns = cols.filter((c) => {
    if (c.items.length < 4) return false;
    c.items.sort((a, b) => b.y - a.y);
    const fs = c.items[0].fontSize;
    for (let k = 1; k < c.items.length; k++) {
      const step = c.items[k - 1].y - c.items[k].y;
      if (step < fs * 0.8 || step > fs * 2) return false;
    }
    return true;
  }).sort((a, b) => b.x - a.x);
  if (columns.length < 2) return items;
  const groups = [];
  for (const col of columns) {
    const g2 = groups[groups.length - 1];
    const last = g2?.[g2.length - 1];
    const fs = col.items[0].fontSize;
    if (last && last.x - col.x >= fs * 1.2 && last.x - col.x <= fs * 4 && Math.abs(last.items[0].y - col.items[0].y) <= fs * 1.2) g2.push(col);
    else groups.push([col]);
  }
  const drop = /* @__PURE__ */ new Set();
  const add = [];
  for (const g2 of groups) {
    if (g2.length < 2) continue;
    const fs = g2[0].items[0].fontSize;
    const med = (v) => v.sort((a, b) => a - b)[v.length >> 1];
    const step = med(g2.flatMap((c) => c.items.slice(1).map((it, k) => c.items[k].y - it.y)));
    const colGap = med(g2.slice(1).map((c, k) => g2[k].x - c.x));
    if (step > colGap * 0.8 || step > fs * 1.15) continue;
    const gapped = g2.filter((c) => c.items.slice(1).some((it, k) => c.items[k].y - it.y > fs * 1.3)).length;
    if (gapped * 2 < g2.length) continue;
    const x1 = Math.min(...g2.map((c) => c.x)), x2 = Math.max(...g2.map((c) => c.x)) + fs;
    const top = Math.max(...g2.map((c) => c.items[0].y)) + fs * 0.2;
    const bottom = Math.min(...g2.map((c) => c.items[c.items.length - 1].y)) - fs * 0.2;
    const members = new Set(g2.flatMap((c) => c.items));
    const inside = items.filter((i) => !members.has(i) && i.x + i.w / 2 >= x1 - 1 && i.x + i.w / 2 <= x2 + 1 && i.y <= top && i.y >= bottom - fs);
    if (inside.some((i) => !PUNCT.test(i.text))) continue;
    const spread2 = fs * 2.2;
    const lineH = items.some((i) => !members.has(i) && !inside.includes(i) && i.x + i.w > x1 && i.x < x2 && i.y < bottom && i.y >= top - spread2 * g2.length) ? (top - bottom) / g2.length : spread2;
    for (const p of inside) {
      const col = [...g2].filter((c) => c.x <= p.x).sort((a, b) => b.x - a.x)[0];
      if (col) {
        col.items.push(p);
        members.add(p);
      }
    }
    g2.forEach((col, k) => {
      col.items.sort((a, b) => b.y - a.y);
      let text = "";
      for (let n = 0; n < col.items.length; n++) {
        const it = col.items[n];
        if (n > 0 && col.items[n - 1].y - it.y > fs * 1.3 && !PUNCT.test(it.text)) text += " ";
        text += it.text;
      }
      add.push({ ...col.items[0], text, x: x1, y: top - fs * 0.2 - k * lineH, w: [...text].length * fs * 0.5, h: fs });
    });
    for (const m of members) drop.add(m);
  }
  return drop.size ? [...items.filter((i) => !drop.has(i)), ...add] : items;
}
var TRACKED = /^(?:[^\s\u1100-\u11ff\u3130-\u318f\uac00-\ud7a3] ){3,}[^\s\u1100-\u11ff\u3130-\u318f\uac00-\ud7a3]$/;
function restoreTrackedSpacing(items, fnArray, argsArray) {
  if (!items.some((it) => TRACKED.test(it.str ?? ""))) return 0;
  const streams = /* @__PURE__ */ new Map();
  const saved = [];
  let font = "";
  for (let i = 0; i < fnArray.length; i++) {
    const fn = fnArray[i];
    const args = argsArray[i];
    if (fn === OPS5.setFont) font = String(args[0]);
    else if (fn === OPS5.save || fn === OPS5.paintFormXObjectBegin) saved.push(font);
    else if (fn === OPS5.restore || fn === OPS5.paintFormXObjectEnd) font = saved.pop() ?? font;
    else if (fn === OPS5.showText) {
      let list = streams.get(font);
      if (!list) streams.set(font, list = []);
      for (const g2 of args[0]) {
        if (g2 && typeof g2 === "object" && typeof g2.unicode === "string") list.push(normalizeUnicode3(g2.unicode));
      }
    }
  }
  const cursor = /* @__PURE__ */ new Map();
  const failed = /* @__PURE__ */ new Set();
  let changed = 0;
  for (const it of items) {
    const f = it.fontName ?? "";
    const glyphs = streams.get(f);
    if (!glyphs || failed.has(f) || typeof it.str !== "string") continue;
    const want = it.str.replace(/\s+/g, "");
    if (!want) continue;
    let gi = cursor.get(f) ?? 0;
    while (gi < glyphs.length && /^\s*$/.test(glyphs[gi])) gi++;
    let got = "", text = "";
    while (gi < glyphs.length && got.length < want.length) {
      const g2 = glyphs[gi++];
      text += g2;
      got += g2.replace(/\s+/g, "");
    }
    if (got !== want) {
      failed.add(f);
      continue;
    }
    cursor.set(f, gi);
    if (TRACKED.test(it.str)) {
      const rebuilt = text.replace(/\s+/g, " ").trim();
      if (rebuilt.split(" ").length < it.str.split(" ").length) {
        it.str = rebuilt;
        changed++;
      }
    }
  }
  return changed;
}
function markSyntheticSpaces(items, fnArray, argsArray) {
  if (!items.some((it) => typeof it.str === "string" && it.str.length > 0 && !it.str.trim())) return;
  const streams = /* @__PURE__ */ new Map();
  const saved = [];
  let font = "";
  for (let i = 0; i < fnArray.length; i++) {
    const fn = fnArray[i];
    const args = argsArray[i];
    if (fn === OPS5.setFont) font = String(args[0]);
    else if (fn === OPS5.save || fn === OPS5.paintFormXObjectBegin) saved.push(font);
    else if (fn === OPS5.restore || fn === OPS5.paintFormXObjectEnd) font = saved.pop() ?? font;
    else if (fn === OPS5.showText) {
      let list = streams.get(font);
      if (!list) streams.set(font, list = []);
      for (const g2 of args[0]) {
        if (g2 && typeof g2 === "object" && typeof g2.unicode === "string") list.push(normalizeUnicode3(g2.unicode));
      }
    }
  }
  const cursor = /* @__PURE__ */ new Map();
  const failed = /* @__PURE__ */ new Set();
  const marks = [];
  for (const it of items) {
    const f = it.fontName ?? "";
    const glyphs = streams.get(f);
    if (!glyphs || failed.has(f) || typeof it.str !== "string" || !it.str) continue;
    let gi = cursor.get(f) ?? 0;
    if (!it.str.trim()) {
      if (gi < glyphs.length && /^\s+$/.test(glyphs[gi])) {
        while (gi < glyphs.length && /^\s+$/.test(glyphs[gi])) gi++;
        cursor.set(f, gi);
      } else marks.push(it);
      continue;
    }
    const want = it.str.replace(/\s+/g, "");
    while (gi < glyphs.length && /^\s*$/.test(glyphs[gi])) gi++;
    let got = "";
    while (gi < glyphs.length && got.length < want.length) got += glyphs[gi++].replace(/\s+/g, "");
    if (got !== want) {
      failed.add(f);
      continue;
    }
    cursor.set(f, gi);
  }
  for (const it of marks) if (!failed.has(it.fontName ?? "")) it.synthetic = true;
}
var NOTE_MARK = /^\s*(문\d{1,5}[）)]|\d{1,5}\)|\(\d{1,5}\))/;
function isContentsReference(text, at) {
  if (/(?:^|\n)\s*\|?\s*(?:목\s*차|(?:table of )?contents\b)/i.test(text.slice(0, 120))) return true;
  const lineStart = text.lastIndexOf("\n", at - 1) + 1;
  const lineEnd = text.indexOf("\n", at);
  const line = text.slice(lineStart, lineEnd < 0 ? text.length : lineEnd);
  return /[·⋯.…]{5,}/.test(line);
}
function blockText(b) {
  if (b.table) return b.table.cells.flat().map((c) => c.text).join("\n");
  return b.text ?? "";
}
function relocateEndnotes(blocks) {
  const texts = blocks.map(blockText);
  const occurrences = (mark, end, cap) => {
    const out2 = [];
    for (let j = 0; j < end && out2.length < cap; j++) {
      for (let at = texts[j].indexOf(mark); at >= 0 && out2.length < cap; at = texts[j].indexOf(mark, at + mark.length)) {
        const notRef = isContentsReference(texts[j], at) || !mark.startsWith("\uBB38") && !texts[j].slice(0, at).trim();
        out2.push(notRef ? -1 : j);
      }
    }
    return out2;
  };
  const cands = [];
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    if (b.type !== "paragraph" && b.type !== "list" && b.type !== "heading") continue;
    const m = NOTE_MARK.exec(texts[i]);
    if (m) cands.push({ idx: i, mark: m[1], shape: m[1].replace(/\d+/g, "#") });
  }
  const heads = [];
  for (const c of cands) {
    const refs = occurrences(c.mark, c.idx, 2);
    if (refs.length === 1 && refs[0] >= 0) heads.push({ idx: c.idx, ref: refs[0], shape: c.shape });
  }
  const shapes = /* @__PURE__ */ new Map();
  for (const h of heads) shapes.set(h.shape, (shapes.get(h.shape) ?? 0) + 1);
  const main = [...shapes].sort((a, b) => b[1] - a[1])[0]?.[0];
  if (!main || !/#/.test(main)) return blocks;
  const lastRun = (hs) => {
    let run2 = [];
    for (const h of hs) {
      if (run2.length && (h.ref < run2[run2.length - 1].ref || h.ref >= run2[0].idx)) run2 = [];
      run2.push(h);
    }
    return run2;
  };
  const firstRun = lastRun(heads.filter((h) => h.shape === main));
  if (firstRun.length < 3) return blocks;
  const tailByMark = /* @__PURE__ */ new Map();
  for (const c of cands) if (c.idx >= firstRun[0].idx && c.shape === main) tailByMark.set(c.mark, [...tailByMark.get(c.mark) ?? [], c.idx]);
  const paired = [];
  for (const [mark, idxs] of tailByMark) {
    const refs = occurrences(mark, firstRun[0].idx, idxs.length + 1);
    if (refs.length === idxs.length && refs.every((r) => r >= 0)) idxs.forEach((idx, k) => paired.push({ idx, ref: refs[k], shape: main }));
  }
  const run = lastRun(paired.sort((a, b) => a.idx - b.idx));
  if (run.length < 3) return blocks;
  const nums = run.map((h) => Number(/\d+/.exec(texts[h.idx])[0]));
  if (nums[0] !== 1 || new Set(nums).size < Math.max(...nums) * 0.8) return blocks;
  const start = run[0].idx;
  const groups = run.map((h, k) => ({ ref: h.ref, blocks: blocks.slice(h.idx, k + 1 < run.length ? run[k + 1].idx : blocks.length) }));
  const byRef = /* @__PURE__ */ new Map();
  for (const g2 of groups) byRef.set(g2.ref, [...byRef.get(g2.ref) ?? [], ...g2.blocks]);
  const out = [];
  for (let i = 0; i < start; i++) {
    out.push(blocks[i]);
    const notes = byRef.get(i);
    if (notes) out.push(...notes);
  }
  return out;
}
var MIN_DOTS = 4;
var INLINE = /\s*·{4,}\s*(?=\d{1,4}\s*$)/;
var PAGE_NO = /^\d{1,4}$/;
var DOTS = /^·+$/;
function dropTabLeaderDots(items) {
  if (!items.some((it) => it.text.includes("\xB7"))) return items;
  const sameLine = (a, b) => Math.abs(a.y - b.y) <= Math.max(a.fontSize, b.fontSize) * 0.3;
  const pageNoAfter = (right, ref) => items.some((it) => PAGE_NO.test(it.text.trim()) && sameLine(it, ref) && it.x >= right - 2);
  const drop = /* @__PURE__ */ new Set();
  const edit = /* @__PURE__ */ new Map();
  for (const it of items) if (!DOTS.test(it.text.trim()) && it.text.includes("\xB7\xB7\xB7\xB7") && INLINE.test(it.text)) edit.set(it, { text: it.text.replace(INLINE, "	") });
  const byLine = /* @__PURE__ */ new Map();
  for (const d of items) if (DOTS.test(d.text.trim())) byLine.set(Math.round(d.y * 2), [...byLine.get(Math.round(d.y * 2)) ?? [], d]);
  for (const line of byLine.values()) {
    line.sort((a, b) => a.x - b.x);
    let run = [];
    const flush = () => {
      const last = run[run.length - 1];
      const dots = run.reduce((n, d) => n + d.text.trim().length, 0);
      if (dots >= MIN_DOTS && pageNoAfter(last.x + last.w, last)) {
        edit.set(run[0], { text: "	", right: last.x + last.w });
        for (const d of run.slice(1)) drop.add(d);
      }
      run = [];
    };
    for (const d of line) {
      const prev = run[run.length - 1];
      if (prev && !(d.x > prev.x && d.x - (prev.x + prev.w) <= Math.max(prev.fontSize, d.fontSize) * 0.7)) flush();
      run.push(d);
    }
    if (run.length) flush();
  }
  if (!drop.size && !edit.size) return items;
  return items.filter((it) => !drop.has(it)).map((it) => {
    const e = edit.get(it);
    return e ? { ...it, text: e.text, w: (e.right ?? it.x + it.w) - it.x } : it;
  });
}
function orderTwoUpPage(blocks, pageWidth, pageHeight) {
  if (pageWidth < pageHeight * 1.2 || blocks.length < 2) return blocks;
  const mid = pageWidth / 2, tol = pageWidth * 0.01;
  const left = [], right = [], rest = [];
  for (const b of blocks) {
    if (!b.bbox) return blocks;
    if (b.type === "paragraph" && /^[-–—－\s\d]+$/.test(b.text ?? "")) rest.push(b);
    else if (b.bbox.x + b.bbox.width <= mid + tol) left.push(b);
    else if (b.bbox.x >= mid - tol) right.push(b);
    else return blocks;
  }
  const span = (bs) => Math.max(...bs.map((b) => b.bbox.y + b.bbox.height)) - Math.min(...bs.map((b) => b.bbox.y));
  if (!left.length || !right.length || span(left) < pageHeight * 0.5 || span(right) < pageHeight * 0.5) return blocks;
  return [...left, ...right, ...rest];
}
var MARK = /^\d{1,3}\)$/;
function footnoteSeparators(horizontals, pageWidth, pageHeight) {
  return horizontals.filter((l) => l.x2 - l.x1 >= 30 && l.x2 - l.x1 <= pageWidth * 0.45 && l.y1 < pageHeight * 0.6).map((l) => l.y1);
}
function superscriptNoteMarks(items) {
  const out = [];
  for (const m of items) {
    if (!MARK.test(m.text)) continue;
    const glued = items.some((p) => p !== m && Math.abs(p.x + p.w - m.x) <= 1.5 && m.fontSize <= p.fontSize * 0.85 && m.y - p.y >= p.fontSize * 0.1 && m.y - p.y <= p.fontSize * 0.6 && /[\p{L}\p{N}.,)'"’”」』]$/u.test(p.text));
    if (glued && !out.some((o) => o.mark === m.text)) out.push({ mark: m.text, y: m.y });
  }
  return out;
}
function refAt(text, mark) {
  for (let at = text.indexOf(mark); at >= 0; at = text.indexOf(mark, at + 1)) if (at > 0 && !/\s/.test(text[at - 1])) return true;
  return false;
}
function inlineFootnotes(blocks, pages) {
  if (!pages.size) return blocks;
  const byPage = /* @__PURE__ */ new Map();
  for (const b of blocks) if (b.pageNumber !== void 0) byPage.set(b.pageNumber, [...byPage.get(b.pageNumber) ?? [], b]);
  const drop = /* @__PURE__ */ new Set();
  const isText = (b) => (b.type === "paragraph" || b.type === "list") && !!b.text;
  const top = (b) => b.bbox.y + b.bbox.height;
  for (const [page, { marks, seps }] of pages) {
    const pb = byPage.get(page);
    if (!pb || !seps.length) continue;
    const markOf = (b) => b.bbox ? marks.find((m) => {
      const t = b.text.trimStart();
      return t.startsWith(m.mark) && /^\s/.test(t.slice(m.mark.length)) && top(b) < m.y && seps.some((y) => y >= top(b));
    }) : void 0;
    let start = -1;
    for (let j = pb.length - 1; j >= 0 && isText(pb[j]); j--) if (markOf(pb[j])) start = j;
    if (start < 0) continue;
    if (!seps.some((y) => y >= top(pb[start]) && y - top(pb[start]) <= 20)) continue;
    const notes = [];
    let open = true;
    for (let j = start; j < pb.length; j++) {
      const b = pb[j], m = markOf(b);
      if (m) {
        notes.push({ text: b.text.trim(), blocks: [b], mark: m.mark });
        open = true;
        continue;
      }
      const prev = pb[j - 1], line = (b.style?.fontSize ?? b.bbox?.height ?? 10) * 1.5;
      if (open && b.bbox && prev.bbox && prev.bbox.y - top(b) <= line && !/^[-–—\s\d]+$/.test(b.text)) {
        notes[notes.length - 1].text += " " + b.text.trim();
        notes[notes.length - 1].blocks.push(b);
      } else open = false;
    }
    const body = pb.slice(0, start);
    for (const n of notes) {
      const host = body.find((b) => (b.type === "paragraph" || b.type === "list" || b.type === "heading") && !!b.text && refAt(b.text, n.mark));
      if (!host) continue;
      host.footnoteText = host.footnoteText ? `${host.footnoteText}; ${n.text}` : n.text;
      for (const b of n.blocks) drop.add(b);
    }
  }
  return drop.size ? blocks.filter((b) => !drop.has(b)) : blocks;
}
var PAGE_NUMBER = /^(?:\d{1,4}|[ivxlc]{1,7})$/i;
var CAPTION = /^(?:Table|Figure|Fig\.?)\s*\d+(?:\.\d+)*\s*[.:]/i;
var EQUATION_NUMBER = /\t\(\d{1,3}[a-z]?\)\s*$/;
var DISPLAY_MATH = /=|[√∑∏∫∂∇≤≥≈≠∈∀∃]/;
function isRunningHead(block, page, pageHeight) {
  const box = block.bbox, text = block.text?.trim();
  if (!box || !text || !pageHeight) return false;
  const top = box.y + box.height >= pageHeight * 0.9;
  const bottom = box.y <= pageHeight * 0.1;
  if (!top && !bottom) return false;
  const others = page.filter((o) => o !== block && o.bbox && o.type !== "image" && o.type !== "separator");
  if (top && others.some((o) => o.bbox.y + o.bbox.height > box.y + box.height)) return false;
  if (bottom && others.some((o) => o.bbox.y < box.y)) return false;
  if (bottom && box.height <= (block.style?.fontSize ?? 0) * 1.6) return true;
  if (!text.includes("	")) return false;
  const parts = text.split(/\t+/).map((part) => part.trim()).filter(Boolean);
  if (parts.length >= 2 && (PAGE_NUMBER.test(parts[0]) || PAGE_NUMBER.test(parts[parts.length - 1]))) return true;
  const left = Math.min(...page.filter((o) => o.bbox).map((o) => o.bbox.x));
  const right = Math.max(...page.filter((o) => o.bbox).map((o) => o.bbox.x + o.bbox.width));
  return right > left && box.width >= (right - left) * 0.6;
}
function unbalancedClose(text) {
  return (text.match(/\)/g)?.length ?? 0) > (text.match(/\(/g)?.length ?? 0);
}
function demoteNonHeadingRoles(blocks, pageHeights, faceNames) {
  const byPage = /* @__PURE__ */ new Map();
  for (const block of blocks) {
    const page = byPage.get(block.pageNumber ?? 0) ?? [];
    page.push(block);
    byPage.set(block.pageNumber ?? 0, page);
  }
  const bodyStyle = /* @__PURE__ */ new Map();
  const bodySizes = /* @__PURE__ */ new Map();
  for (const [pageNumber, page] of byPage) {
    const chars = /* @__PURE__ */ new Map();
    const sizes = /* @__PURE__ */ new Map();
    let proseChars = 0;
    for (const b of page) {
      if (b.type !== "paragraph" && b.type !== "heading" || !b.text || !b.style?.fontName || !b.style.fontSize) continue;
      const key2 = `${b.style.fontName}:${b.style.fontSize}`;
      chars.set(key2, (chars.get(key2) ?? 0) + b.text.length);
      if (b.type === "paragraph" && b.style.fontName === "ocr") {
        sizes.set(b.style.fontSize, (sizes.get(b.style.fontSize) ?? 0) + b.text.length);
        proseChars += b.text.length;
      }
    }
    const [key, count] = [...chars].sort((a, b) => b[1] - a[1])[0] ?? [];
    if (key && count >= 300) bodyStyle.set(pageNumber, key);
    if (proseChars >= 300) {
      let cumulative = 0;
      for (const [size, count2] of [...sizes].sort((a, b) => a[0] - b[0])) {
        cumulative += count2;
        if (cumulative > proseChars / 2) {
          bodySizes.set(pageNumber, size);
          break;
        }
      }
    }
  }
  const citedProse = /* @__PURE__ */ new Set();
  const numberedProse = /* @__PURE__ */ new Set();
  for (const page of byPage.values()) {
    const numbered = page.filter((b) => (b.type === "heading" || b.type === "paragraph") && /^[①-⑮]\s*/.test(b.text?.trim() ?? "") && b.bbox && b.style?.fontName && b.style.fontSize && !/Bold|Black|Heavy|Semibold/i.test(faceNames?.get(b.style.fontName) ?? ""));
    let chain = [];
    const finish = () => {
      if (chain.length < 3 || !chain.some((b) => (b.text?.length ?? 0) >= 40 && b.bbox.height >= b.style.fontSize * 2.4)) return;
      for (const b of chain) numberedProse.add(b);
      const first = chain[0], size = first.style.fontSize;
      for (const b of page) if (/^[○●•◦]\s/.test(b.text?.trim() ?? "") && b.style?.fontName === first.style?.fontName && b.style?.fontSize === size && b.bbox && Math.abs(b.bbox.x - first.bbox.x) <= size * 0.5 && (b.text?.length ?? 0) >= 15) numberedProse.add(b);
    };
    for (const b of numbered) {
      const prev = chain.at(-1), size = b.style.fontSize;
      if (!prev || b.text.trim().charCodeAt(0) !== prev.text.trim().charCodeAt(0) + 1 || b.style.fontName !== prev.style.fontName || size !== prev.style.fontSize || Math.abs(b.bbox.x - prev.bbox.x) > size * 0.5 || prev.bbox.y - (b.bbox.y + b.bbox.height) > size * 8) {
        finish();
        chain = [];
      }
      chain.push(b);
    }
    finish();
  }
  for (let i = 0; i + 1 < blocks.length; i++) {
    const prose = blocks[i], reference = blocks[i + 1];
    const a = prose.bbox, b = reference.bbox, size = prose.style?.fontSize ?? 0;
    const source = reference.text?.replace(/<[^>]+>/g, "").trim() ?? "";
    if (prose.type !== "heading" && prose.type !== "paragraph" && prose.type !== "list" || reference.type !== "heading" && reference.type !== "paragraph" || (prose.text?.length ?? 0) < 40 || !a || !b || size <= 0 || a.height < size * 2.4 || prose.pageNumber !== reference.pageNumber || prose.style?.fontName !== reference.style?.fontName || prose.style?.fontSize !== reference.style?.fontSize || Math.abs(a.x - b.x) > size && !(/^[○●•◦]\s/.test(prose.text ?? "") && b.x >= a.x && b.x - a.x <= size * 2) || a.y - (b.y + b.height) < 0 || a.y - (b.y + b.height) > size || !/^[（(].*(?:제\s*\d+\s*조|(?:Article|Section)\s+\d+).*[）)]$/i.test(source)) continue;
    citedProse.add(prose);
    citedProse.add(reference);
  }
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    if (block.type !== "heading" || !block.text) continue;
    const text = block.text.replace(/<[^>]+>/g, "").trim();
    const fsz = block.style?.fontSize ?? 0;
    const tocEntry = i > 0 && TOC_BLOCKS.has(blocks[i - 1]) && TOC_BLOCKS.has(blocks[i + 1]);
    const page = byPage.get(block.pageNumber ?? 0) ?? [];
    const proseStyle = block.style?.fontName && bodyStyle.get(block.pageNumber ?? 0) === `${block.style.fontName}:${block.style.fontSize}` && text.length > 60;
    const next = blocks[i + 1];
    const nb = next?.bbox, bb = block.bbox;
    const chapterNumber = !!nb && !!bb && fsz >= (next?.style?.fontSize ?? 0) * 1.2 && Math.abs(bb.x - nb.x) > fsz && Math.abs(bb.x + bb.width / 2 - (nb.x + nb.width / 2)) < nb.width * 0.1;
    if (/^\d+(?:\.\d+)*\.?$/.test(text) && next?.type === "heading" && next.text && next.pageNumber === block.pageNumber && !chapterNumber) {
      next.text = `${block.text.trim()} ${next.text.trim()}`;
      blocks.splice(i--, 1);
      continue;
    }
    if ((next?.type === "paragraph" || next?.type === "heading" && !CAPTION.test(text)) && next.pageNumber === block.pageNumber && next.text && next.bbox && block.bbox && next.style?.fontName === block.style?.fontName && next.style?.fontSize === block.style?.fontSize && fsz > 0 && /^[a-z]/.test(next.text.trim()) && next.text.trim().length <= 40 && !/[.:;!?]$/.test(next.text.trim()) && block.bbox.y - (next.bbox.y + next.bbox.height) < fsz * 1.2 && Math.abs(next.bbox.x - block.bbox.x) < fsz) {
      block.text = `${block.text.trim()} ${next.text.trim()}`;
      block.bbox = { ...block.bbox, y: next.bbox.y, height: block.bbox.y + block.bbox.height - next.bbox.y };
      blocks.splice(i + 1, 1);
    }
    const after = blocks[i + 2];
    if ((next?.type === "paragraph" || next?.type === "heading") && /^(?:&|\+|and|or)$/i.test(next.text?.trim() ?? "") && after?.type === "heading" && after.text && after.pageNumber === block.pageNumber && next.pageNumber === block.pageNumber && after.style?.fontSize === block.style?.fontSize) {
      block.text = `${block.text.trim()} ${next.text.trim()} ${after.text.trim()}`;
      blocks.splice(i + 1, 2);
    }
    const tiny = fsz > 0 && fsz < 7.5;
    const prev = blocks[i - 1];
    if (prev?.type === "paragraph" && prev.pageNumber === block.pageNumber && /^[a-z]{1,3}[.)]$/.test(prev.text?.trim() ?? "") && prev.bbox && block.bbox && Math.abs(prev.bbox.y - block.bbox.y) < 2 && prev.bbox.x + prev.bbox.width <= block.bbox.x) {
      prev.text = `${prev.text.trim()} ${block.text.trim()}`;
      prev.bbox = { ...prev.bbox, width: block.bbox.x + block.bbox.width - prev.bbox.x };
      blocks.splice(i--, 1);
      continue;
    }
    if (prev?.type === "paragraph" && prev.pageNumber === block.pageNumber && /^\d{1,2}(?:\.\d{1,2})*\.?$/.test(prev.text?.trim() ?? "") && prev.bbox && block.bbox && fsz > 0 && (Math.abs(prev.bbox.y - block.bbox.y) < 2 && prev.bbox.x + prev.bbox.width <= block.bbox.x && block.bbox.x - (prev.bbox.x + prev.bbox.width) < fsz * 3 || Math.abs(prev.bbox.x - block.bbox.x) < 2 && (prev.style?.fontSize ?? 0) >= fsz && prev.bbox.y - (block.bbox.y + block.bbox.height) < fsz * 1.5)) {
      block.text = `${prev.text.trim()} ${block.text.trim()}`;
      blocks.splice(i - 1, 1);
      i -= 2;
      continue;
    }
    const box = block.bbox, size = block.style?.fontSize ?? 0;
    const kicker = !!box && size > 0 && next?.type === "heading" && next.pageNumber === block.pageNumber && !!next.bbox && (block.style?.fontName !== "ocr" || size < (bodySizes.get(block.pageNumber ?? 0) ?? Infinity) * 2) && (next.style?.fontSize ?? 0) >= size * 1.3 && box.y - (next.bbox.y + next.bbox.height) <= size * 3 && Math.min(box.x + box.width, next.bbox.x + next.bbox.width) - Math.max(box.x, next.bbox.x) >= Math.min(box.width, next.bbox.width) * 0.5 && !page.some((o) => o !== block && o.bbox && o.bbox.y > box.y + box.height && o.type !== "image");
    const face = faceNames?.get(block.style?.fontName ?? "") ?? "";
    const [bodyFace, bodySize] = (bodyStyle.get(block.pageNumber ?? 0) ?? "").split(":");
    const byline = /Italic|Oblique/i.test(face) && !/Bold|Black|Heavy|Semibold/i.test(face) && !!bodyFace && size <= Number(bodySize) + 0.5 && blocks[i - 1]?.type === "heading" && blocks[i - 1].pageNumber === block.pageNumber;
    const ocrFragment = block.style?.fontName === "ocr" && (/^[.,;:…·•-]/.test(text) || text.includes("\u2026") || (text.match(new RegExp("\\p{L}", "gu"))?.length ?? 0) < 2 || text.split(/\s+/).length > 7);
    const crowdedOcr = block.style?.fontName === "ocr" && !!box && [prev, next].every((o) => o?.type === "paragraph" && o.pageNumber === block.pageNumber && o.style?.fontName === "ocr" && !!o.bbox && (o.text?.length ?? 0) >= 15 && Math.abs(o.bbox.x - box.x) <= size * 0.25 && Math.min(o.bbox.y + o.bbox.height, box.y + box.height) - Math.max(o.bbox.y, box.y) >= o.bbox.height * 0.2) && prev.bbox.y > box.y && next.bbox.y < box.y;
    if (numberedProse.has(block) || citedProse.has(block) || ocrFragment || crowdedOcr || tocEntry || proseStyle || kicker || byline || tiny || !new RegExp("\\p{L}", "u").test(text) && !chapterNumber || /^[a-z]/.test(text) || CAPTION.test(text) || EQUATION_NUMBER.test(block.text) || DISPLAY_MATH.test(text) || // 닫는 괄호가 여는 괄호보다 많으면 앞 줄에서 이어진 문장 조각이다 ("Fact-checking) and is used …") — "1)"·"가)" 앞머리 번호는 빼고 센다
    unbalancedClose(text.replace(/^\s*[\dA-Za-z가-힣ⅰ-ⅹ]{1,3}\)\s*/, "")) || isRunningHead(block, page, pageHeights.get(block.pageNumber ?? 0))) {
      block.type = "paragraph";
      block.level = void 0;
    }
  }
}
function normalizeAraea(text) {
  return text.replace(/(?<![\u1100-\u115F])\u119E/g, "\u318D");
}
var stripNoUnicodeGlyph = (text) => text.includes("\uF000") ? text.replace(/\uF000/g, "") : text;
var CHOSEONG_COMPAT = "\u3131\u3132\u3134\u3137\u3138\u3139\u3141\u3142\u3143\u3145\u3146\u3147\u3148\u3149\u314A\u314B\u314C\u314D\u314E";
var normalizeLoneChoseong = (text) => /[\u1100-\u1112]/.test(text) ? text.replace(/[\u1100-\u1112](?![\u1160-\u11A7\uD7B0-\uD7C6])/g, (c) => CHOSEONG_COMPAT[c.charCodeAt(0) - 4352]) : text;
var cleanChars = (text) => normalizeLoneChoseong(normalizeAraea(stripNoUnicodeGlyph(stripControlChars(text))));
function sanitizeBlockControlChars(blocks) {
  for (const b of blocks) {
    if (b.text) b.text = cleanChars(b.text);
    if (b.table) {
      for (const row of b.table.cells) {
        for (const cell of row) {
          if (cell.text) cell.text = cleanChars(cell.text);
          if (cell.blocks) sanitizeBlockControlChars(cell.blocks);
        }
      }
    }
    if (b.children) sanitizeBlockControlChars(b.children);
  }
}
var CAPTION_LABEL = /^(?:figure|fig\.|diagram|table|chart|graph|exhibit|box)\s*[\dIVX][\w.\-]*$/i;
function captionTableText(t) {
  if (!t || t.rows !== 1 || t.cols !== 2) return null;
  const [label, body] = t.cells[0];
  if (!label || !body || label.blocks?.length || body.blocks?.length || !CAPTION_LABEL.test(label.text.trim()) || !body.text.trim()) return null;
  return `${label.text.trim()} ${body.text.replace(/\s*\n\s*/g, " ").trim()}`;
}
function splitSingleCellTables(blocks) {
  const out = [];
  for (const b of blocks) {
    const t = b.type === "table" ? b.table : void 0;
    const title = t && FRAME_TITLE_BLOCKS.get(t);
    if (title) {
      out.push({ ...title, text: `${t.cells[0][0].text.trim()} ${t.cells[0][2].text.trim()}` });
      continue;
    }
    const only = t && t.rows === 1 && t.cols === 1 && t.cells[0]?.[0]?.blocks?.length === 1 ? t.cells[0][0].blocks[0] : void 0;
    const squash = (s) => s.replace(/\s/g, "");
    const inner = only && (!squash(t.cells[0][0].text) || only.type === "table" && squash(t.cells[0][0].text) === squash(only.table.cells.flat().map((c) => c.text).join(""))) ? only : void 0;
    const caption = captionTableText(t) ?? (inner?.type === "table" ? captionTableText(inner.table) : null);
    if (caption) {
      out.push({ type: "paragraph", text: caption, pageNumber: b.pageNumber, bbox: b.bbox });
      continue;
    }
    const cell = t && t.rows === 1 && t.cols === 1 ? t.cells[0]?.[0] : void 0;
    if (!cell) {
      out.push(b);
      continue;
    }
    const lines = (cell.text ?? "").split(/\n/).map((l) => l.trim()).filter(Boolean);
    if (t?.caption?.trim()) out.push({ type: "paragraph", text: t.caption.trim(), pageNumber: b.pageNumber, bbox: b.bbox });
    if (cell.blocks?.length) {
      out.push(...splitSingleCellTables(cell.blocks));
      continue;
    }
    for (const text of lines) out.push({ type: "paragraph", text, pageNumber: b.pageNumber, bbox: b.bbox });
  }
  return out;
}
function joinLatinCellWraps(blocks) {
  for (const b of blocks) {
    if (b.type !== "table" || !b.table) continue;
    for (const row of b.table.cells) for (const cell of row) {
      if (cell.text.includes("\n")) {
        const lines = cell.text.split("\n");
        const out = [lines[0]];
        for (const line of lines.slice(1)) {
          if (latinSoftWrap(out[out.length - 1], line)) out[out.length - 1] = out[out.length - 1].trimEnd() + " " + line.trim();
          else out.push(line);
        }
        cell.text = out.join("\n");
      }
      if (cell.blocks) joinLatinCellWraps(cell.blocks);
    }
  }
}
function cleanPdfText(text, opts) {
  let clean = normalizeAraea(stripControlChars(text));
  if (!opts?.keepLoneNumbers) {
    clean = clean.replace(/^\d{1,4}\n/, "").replace(/\n\d{1,4}\n/g, "\n").replace(/\n\d{1,4}$/, "");
  }
  if (!opts?.keepLoneNumbers) clean = clean.replace(/^#{1,6}\s*\d{1,4}\s*$/gm, "");
  return mergeKoreanLines(
    clean.replace(/^[\s]*[-–—]\s*[-–—]?\d+[-–—]?[\s]*[-–—]?[\s]*$/gm, "").replace(/^\s*\d+\s*\/\s*\d+\s*$/gm, "").replace(/\.(?: \.){3,}/g, (m) => ".".repeat(m.length + 1 >> 1))
  ).replace(/^(?!\| ---).*$/gm, (line) => {
    if (/^\s*\${1,2}.+\${1,2}\s*$/.test(line)) return line;
    if (line.startsWith("|")) {
      return line.replace(/(?:\\.|[^|\\])+/g, (cell) => cell.split("<br>").map((seg) => seg.replace(/\S(?:.*\S)?/, (t) => collapseEvenSpacing(t, false))).join("<br>"));
    }
    const mark = /^(?:#{1,6}|-) /.exec(line)?.[0] ?? "";
    return mark + collapseEvenSpacing(line.slice(mark.length), false);
  }).replace(/\\~\\~/g, "~~").replace(/~~~~/g, "").replace(/<u>\s*<\/u>/g, "").replace(/<(sup|sub)>\s*<\/\1>/g, "").replace(/\n{3,}/g, "\n\n").trim();
}
function startsWithMarker(line) {
  const t = line.trimStart();
  return /^[가-힣ㄱ-ㅎ][.)]/.test(t) || /^\d+[.)]/.test(t) || /^\([가-힣ㄱ-ㅎ\d]+\)/.test(t) || /^[○●※▶▷◆◇■□★☆\-·]\s/.test(t) || /^제\d+[조항호장절]/.test(t);
}
function isStandaloneHeader(line) {
  return /^제\d+[조항호장절](\([^)]*\))?(\s+\S+){0,7}$/.test(line.trim());
}
function mergeKoreanLines(text) {
  if (!text) return "";
  const lines = text.split("\n");
  if (lines.length <= 1) return text;
  const result = [lines[0]];
  for (let i = 1; i < lines.length; i++) {
    const prev = result[result.length - 1];
    const curr = lines[i];
    const currTrimmed = curr.trim();
    if (/^#{1,6}\s/.test(prev) || /^#{1,6}\s/.test(curr) || /^\|/.test(currTrimmed) || /^---/.test(currTrimmed)) {
      result.push(curr);
      continue;
    }
    if (/,$/.test(prev.trim()) && currTrimmed.length > 0) {
      result[result.length - 1] = prev + "\n" + curr;
      continue;
    }
    if (/^\(※/.test(currTrimmed)) {
      result[result.length - 1] = prev + " " + currTrimmed;
      continue;
    }
    if (/[가-힣·,\-]$/.test(prev) && /^[가-힣(]/.test(curr) && !startsWithMarker(curr) && !isStandaloneHeader(prev) && !startsWithMarker(prev)) {
      result[result.length - 1] = prev + wrapJoiner(prev, curr) + curr;
    } else {
      result.push(curr);
    }
  }
  return result.join("\n");
}
var LINK_Y_TOL = 2;
var LINK_MIN_OVERLAP_RATIO = 0.5;
function applyLinkAnnotations(items, annots) {
  if (items.length === 0 || annots.length === 0) return;
  const wrapped = /* @__PURE__ */ new Set();
  for (const a of annots) {
    if (a.subtype !== "Link" || !a.url || !a.rect || a.rect.length < 4) continue;
    const url = sanitizeHref(a.url);
    if (!url) continue;
    const x1 = Math.min(a.rect[0], a.rect[2]), x2 = Math.max(a.rect[0], a.rect[2]);
    const y1 = Math.min(a.rect[1], a.rect[3]), y2 = Math.max(a.rect[1], a.rect[3]);
    const matches = [];
    for (const item of items) {
      if (wrapped.has(item) || item.w <= 0 || !item.text.trim()) continue;
      if (item.y < y1 - LINK_Y_TOL || item.y > y2 + LINK_Y_TOL) continue;
      const overlap = Math.min(x2, item.x + item.w) - Math.max(x1, item.x);
      if (overlap / item.w < LINK_MIN_OVERLAP_RATIO) continue;
      matches.push(item);
    }
    if (matches.length === 0) continue;
    const lines = /* @__PURE__ */ new Map();
    for (const m of matches) {
      const key = Math.round(m.y / 3);
      const arr = lines.get(key) || [];
      arr.push(m);
      lines.set(key, arr);
    }
    for (const arr of lines.values()) {
      arr.sort((p, q) => p.x - q.x);
      arr[0].text = "[" + arr[0].text;
      arr[arr.length - 1].text = arr[arr.length - 1].text + `](${url})`;
      for (const m of arr) wrapped.add(m);
    }
  }
}
var MD_LINK = String.raw`(?<!!)\[([^\]\n]*)\]\(([^)\s]+)\)`;
function mergeLinkRuns(markdown) {
  let out = markdown.replace(new RegExp(String.raw`<u>(${MD_LINK})</u>`, "g"), "$1");
  const run = new RegExp(MD_LINK + String.raw`(\s+)` + String.raw`(?<!!)\[([^\]\n]*)\]\(\2\)`, "g");
  for (let prev = ""; prev !== out; ) {
    prev = out;
    out = out.replace(run, (_m, a, url, _gap, b) => `[${a} ${b}](${url})`);
  }
  return out;
}
async function applyFormulaOcr(buffer, blocks, pageFilter, effectivePageCount, warnings, _onProgress) {
  const formulaMod = await import("./formula-DAMFHLQO-LDM2NI7S.mjs");
  const { FormulaPipeline, ensureFormulaModels } = formulaMod;
  await ensureFormulaModels((p) => {
    if (p.phase === "download" && p.total) {
      const pct = Math.floor(p.downloaded / p.total * 100);
      process.stderr.write(`\r[kordoc-formula] ${p.spec.name} ${pct}% (${formatMb(p.downloaded)}/${formatMb(p.total)})`);
      if (p.downloaded >= p.total) process.stderr.write("\n");
    } else if (p.phase === "verify") {
      process.stderr.write(`[kordoc-formula] ${p.spec.name} SHA-256 \uAC80\uC99D \uC911...
`);
    } else if (p.phase === "done") {
      process.stderr.write(`[kordoc-formula] ${p.spec.name} \uC900\uBE44 \uC644\uB8CC
`);
    } else if (p.phase === "skip") {
    }
  });
  const pipeline = await FormulaPipeline.create();
  try {
    const effectiveFilter = pageFilter ?? new Set(Array.from({ length: effectivePageCount }, (_, i) => i + 1));
    const pagesResult = await pipeline.runOnBuffer(buffer, effectiveFilter);
    if (pagesResult.length === 0) return;
    let insertedCount = 0;
    let removedDupCount = 0;
    for (const page of pagesResult) {
      const pageNumber = page.pageNumber;
      const pdfHeight = page.pdfHeight;
      const scaleX = page.renderedWidth > 0 ? page.pdfWidth / page.renderedWidth : 0.5;
      const scaleY = page.renderedHeight > 0 ? page.pdfHeight / page.renderedHeight : 0.5;
      const candidates = [];
      for (const r of page.regions) {
        if (!r.latex || !r.latex.trim()) continue;
        const wrapped = r.kind === "display" ? `$$${r.latex}$$` : `$${r.latex}$`;
        const x1 = r.bbox.x1 * scaleX;
        const x2 = r.bbox.x2 * scaleX;
        const yTop = pdfHeight - r.bbox.y1 * scaleY;
        const yBottom = pdfHeight - r.bbox.y2 * scaleY;
        const centerY = (yTop + yBottom) / 2;
        const width = x2 - x1;
        const height = yTop - yBottom;
        candidates.push({
          block: {
            type: "paragraph",
            text: wrapped,
            pageNumber,
            bbox: { page: pageNumber, x: x1, y: yBottom, width, height }
          },
          pdfBbox: { x1, x2, yTop, yBottom },
          centerY
        });
      }
      if (candidates.length === 0) continue;
      const OVERLAP_THRESHOLD = 0.6;
      const indicesToRemove = /* @__PURE__ */ new Set();
      for (let i = 0; i < blocks.length; i++) {
        const b = blocks[i];
        if (b.pageNumber !== pageNumber) continue;
        if (b.type === "table") continue;
        if (!b.bbox || b.bbox.width <= 0 || b.bbox.height <= 0) continue;
        const blockArea = b.bbox.width * b.bbox.height;
        if (blockArea <= 0) continue;
        for (const c of candidates) {
          const ox1 = Math.max(b.bbox.x, c.pdfBbox.x1);
          const ox2 = Math.min(b.bbox.x + b.bbox.width, c.pdfBbox.x2);
          const oy1 = Math.max(b.bbox.y, c.pdfBbox.yBottom);
          const oy2 = Math.min(b.bbox.y + b.bbox.height, c.pdfBbox.yTop);
          const interArea = Math.max(0, ox2 - ox1) * Math.max(0, oy2 - oy1);
          if (interArea / blockArea >= OVERLAP_THRESHOLD) {
            indicesToRemove.add(i);
            break;
          }
        }
      }
      if (indicesToRemove.size > 0) {
        const sorted = [...indicesToRemove].sort((a, b) => b - a);
        for (const idx of sorted) blocks.splice(idx, 1);
        removedDupCount += indicesToRemove.size;
      }
      candidates.sort((a, b) => b.centerY - a.centerY);
      for (const c of candidates) {
        let insertIdx = -1;
        let pageFirstIdx = -1;
        let pageLastIdx = -1;
        for (let i = 0; i < blocks.length; i++) {
          const b = blocks[i];
          if (b.pageNumber !== pageNumber) continue;
          if (pageFirstIdx === -1) pageFirstIdx = i;
          pageLastIdx = i;
          if (!b.bbox) continue;
          const blockCenter = b.bbox.y + b.bbox.height / 2;
          if (blockCenter < c.centerY) {
            insertIdx = i;
            break;
          }
        }
        if (insertIdx !== -1) {
          blocks.splice(insertIdx, 0, c.block);
        } else if (pageLastIdx !== -1) {
          blocks.splice(pageLastIdx + 1, 0, c.block);
        } else {
          blocks.push(c.block);
        }
        insertedCount++;
      }
    }
    if (insertedCount > 0 || removedDupCount > 0) {
      process.stderr.write(
        `[kordoc-formula] ${insertedCount}\uAC1C \uC218\uC2DD \uC0BD\uC785, ${removedDupCount}\uAC1C \uC911\uBCF5 block \uC81C\uAC70 (${pagesResult.length}\uAC1C \uD398\uC774\uC9C0)
`
      );
    }
  } finally {
    await pipeline.destroy().catch(() => {
    });
  }
}
function formatMb(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
}
var g = globalThis;
if (typeof g.DOMMatrix === "undefined") {
  g.DOMMatrix = class DOMMatrix {
    m = [1, 0, 0, 1, 0, 0];
    constructor(init) {
      if (init) this.m = init;
    }
  };
}
if (typeof g.Path2D === "undefined") {
  g.Path2D = class Path2D {
  };
}
g.pdfjsWorker = pdfjsWorker;
function ocrImageRegions(regions, large, all) {
  if (all) return regions;
  const out = /* @__PURE__ */ new Map();
  for (const [p, rs] of regions) {
    const big = rs.filter((r) => large.has(r));
    if (big.length) out.set(p, big);
  }
  return out;
}
GlobalWorkerOptions.workerSrc = "";
var MAX_PAGES = 5e3;
var MAX_TOTAL_TEXT = 100 * 1024 * 1024;
var FONT_CACHE_LIMIT = 256;
var PDF_LOAD_TIMEOUT_MS = 3e4;
var pdfjsAssets = {};
try {
  const _require = createRequire(import.meta.url);
  const pkgDir = dirname(__extensionPath("pdfjs-dist/package.json"));
  pdfjsAssets.cMapUrl = join(pkgDir, "cmaps") + "/";
  pdfjsAssets.cMapPacked = true;
  pdfjsAssets.standardFontDataUrl = join(pkgDir, "standard_fonts") + "/";
} catch {
}
var HEADLESS_FONT_DOCUMENT = {
  createElement: () => ({ sheet: { cssRules: [], insertRule() {
  } }, remove() {
  } }),
  documentElement: { getElementsByTagName: () => [{ append() {
  } }] }
};
var PDFJS_DOCUMENT_OPTIONS = {
  useSystemFonts: true,
  // 글꼴 /Differences 글리프 이름 — ToUnicode 없는 옛 숫자·작은 대문자 복원(glyph-names.ts)
  fontExtraProperties: true,
  disableFontFace: false,
  ownerDocument: HEADLESS_FONT_DOCUMENT,
  isEvalSupported: false,
  verbosity: 0,
  // 오류만 — 경고("Warning: Indexing all PDF objects")를 console.log 로 stdout 에 찍어 MCP·CLI JSON 을 깼다
  ...pdfjsAssets
};
async function loadPdfWithTimeout(buffer) {
  const loadingTask = getDocument({
    // pdfjs transfers its input to the worker; retain the caller's buffer for reuse.
    data: new Uint8Array(buffer.slice(0)),
    ...PDFJS_DOCUMENT_OPTIONS
  });
  let timer;
  try {
    return await Promise.race([
      loadingTask.promise.catch((e) => {
        if (e instanceof Error && e.name === "PasswordException") throw new KordocError("\uC554\uD638\uB85C \uBCF4\uD638\uB41C PDF \uD30C\uC77C\uC785\uB2C8\uB2E4 (PDF \uC5F4\uAE30 \uC554\uD638\uB294 \uC9C0\uC6D0\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4)");
        throw e;
      }),
      new Promise((_, reject) => {
        timer = setTimeout(() => {
          loadingTask.destroy();
          reject(new KordocError("PDF \uB85C\uB529 \uD0C0\uC784\uC544\uC6C3 (30\uCD08 \uCD08\uACFC)"));
        }, PDF_LOAD_TIMEOUT_MS);
      })
    ]);
  } finally {
    if (timer !== void 0) clearTimeout(timer);
  }
}
async function parsePdfDocument(buffer, options) {
  const formulaBuffer = options?.formulaOcr ? buffer : null;
  const autoOcr = options?.ocr === void 0 && await ocrModelsCached();
  const ocrBuffer = options?.ocr || autoOcr ? buffer : null;
  const doc = await loadPdfWithTimeout(buffer);
  try {
    const pageCount = doc.numPages;
    if (pageCount === 0) throw new KordocError("PDF\uC5D0 \uD398\uC774\uC9C0\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.");
    const metadata = { pageCount, pageMode: "layout" };
    await extractPdfMetadata(doc, metadata);
    const blocks = [];
    const warnings = [];
    const pageQuality = [];
    let totalChars = 0;
    let totalTextBytes = 0;
    const effectivePageCount = Math.min(pageCount, MAX_PAGES);
    const pageFilter = options?.pages ? parsePageRange(options.pages, effectivePageCount) : null;
    if (pageCount > MAX_PAGES && (!options?.pages || hasRequestedPagesAfter(options.pages, MAX_PAGES, pageCount))) {
      warnings.push({ message: `${pageCount}\uCABD \uC911 \uC55E ${MAX_PAGES}\uCABD\uB9CC \uD30C\uC2F1\uD588\uC2B5\uB2C8\uB2E4 (\uCABD \uC218 \uC0C1\uD55C)`, code: "PARTIAL_PARSE" });
    }
    const totalTarget = pageFilter ? pageFilter.size : effectivePageCount;
    const fontSizeFreq = /* @__PURE__ */ new Map();
    const pageHeights = /* @__PURE__ */ new Map();
    const pageWidths = /* @__PURE__ */ new Map();
    const faceNames = /* @__PURE__ */ new Map();
    const pagesWithLargeImage = /* @__PURE__ */ new Set();
    const skippedImagePages = /* @__PURE__ */ new Map();
    const uncoveredImageRegions = /* @__PURE__ */ new Map();
    const largeImageRegions = /* @__PURE__ */ new Set();
    const imageState = createPdfImageState();
    const imageBulletShapes = /* @__PURE__ */ new Map();
    const imageArrowDirections = /* @__PURE__ */ new Map();
    const extractedImages = [];
    const pageImageBlocks = /* @__PURE__ */ new Map();
    const carry = {};
    const vectorPageOps = /* @__PURE__ */ new Map();
    const wrapLexicon = new WrapLexicon();
    const noteMarks = /* @__PURE__ */ new Map();
    const headerContext = [];
    if (pageFilter && options?.removeHeaderFooter !== false && pageFilter.size < effectivePageCount) {
      for (const number of selectionContextPages(pageFilter, effectivePageCount)) {
        let contextPage;
        try {
          contextPage = await doc.getPage(number);
          const content = await contextPage.getTextContent();
          pageHeights.set(number, contextPage.view[3] - contextPage.view[1]);
          headerContext.push(...marginContextBlocks(content.items, number, contextPage.view));
        } catch {
        } finally {
          contextPage?.cleanup();
        }
      }
    }
    let parsedPages = 0;
    const loadedFonts = /* @__PURE__ */ new Set();
    for (let i = 1; i <= effectivePageCount; i++) {
      if (pageFilter && !pageFilter.has(i)) continue;
      let loadedPage;
      try {
        const page = await doc.getPage(i);
        loadedPage = page;
        const tc = await page.getTextContent();
        const [viewX1, viewY1, viewX2, viewY2] = page.view;
        const pageW = viewX2 - viewX1, pageH = viewY2 - viewY1;
        pageHeights.set(i, pageH);
        pageWidths.set(i, pageW);
        const rawItems = tc.items;
        const rawOps = await page.getOperatorList();
        for (let k = 0; k < rawOps.fnArray.length; k++) if (rawOps.fnArray[k] === OPS6.setFont) loadedFonts.add(rawOps.argsArray[k][0]);
        const fontObj = (loadedName) => {
          try {
            return page.commonObjs.has(loadedName) ? page.commonObjs.get(loadedName) : void 0;
          } catch {
            return void 0;
          }
        };
        const differencesOf = (loadedName) => fontObj(loadedName)?.differences;
        restoreNamedGlyphs(rawItems, rawOps.fnArray, rawOps.argsArray, differencesOf, (n) => fontObj(n)?.name);
        restoreTrackedSpacing(rawItems, rawOps.fnArray, rawOps.argsArray);
        markSyntheticSpaces(rawItems, rawOps.fnArray, rawOps.argsArray);
        const occluded = occludedTextItems(rawItems, rawOps.fnArray, rawOps.argsArray);
        const items = normalizeItems(occluded.size ? rawItems.filter((it) => !occluded.has(it)) : rawItems);
        const filtered = filterHiddenText(items, pageW, pageH, viewX1, viewY1);
        const joined = joinVerticalColumns(filtered.visible);
        const visible = dropTabLeaderDots(joined);
        const hiddenCount = filtered.hiddenCount + occluded.size;
        if (hiddenCount > 0) {
          warnings.push({ page: i, message: `${hiddenCount}\uAC1C \uC228\uACA8\uC9C4 \uD14D\uC2A4\uD2B8 \uC694\uC18C \uD544\uD130\uB9C1\uB428`, code: "HIDDEN_TEXT_FILTERED" });
        }
        for (const item of joined) {
          if (item.fontSize > 0) fontSizeFreq.set(item.fontSize, (fontSizeFreq.get(item.fontSize) || 0) + 1);
        }
        try {
          const annots = await page.getAnnotations();
          applyLinkAnnotations(visible, annots);
        } catch {
        }
        const shifted = viewX1 !== 0 || viewY1 !== 0;
        if (shifted) for (const item of visible) {
          item.x -= viewX1;
          item.y -= viewY1;
        }
        const opList = shifted ? {
          fnArray: [OPS6.transform, ...rawOps.fnArray],
          argsArray: [[1, 0, 0, 1, -viewX1, -viewY1], ...rawOps.argsArray]
        } : rawOps;
        remapSymbolFontItems(visible, (loadedName) => fontObj(loadedName)?.name);
        remapControlGlyphs(visible, differencesOf);
        await restoreImageBullets(visible, page, opList.fnArray, opList.argsArray, imageBulletShapes);
        const faces = /* @__PURE__ */ new Map();
        for (const it of visible) {
          if (!it.fontName) continue;
          let face = faces.get(it.fontName);
          if (face === void 0) {
            const obj = fontObj(it.fontName);
            face = obj?.isType3Font && /^[A-Z]{6}\+./.test(obj.name ?? "") && obj.name.slice(7) || it.fontName;
            faces.set(it.fontName, face);
          }
          it.fontName = face;
          if (!faceNames.has(face)) faceNames.set(face, (fontObj(face)?.name ?? "").replace(/^[A-Z]{6}\+/, ""));
        }
        for (const it of visible) if (it.text.includes("$")) it.text = escapeLiteralDollar(it.text);
        for (const it of visible) if (it.text.includes("<")) it.text = escapeLiteralTags(it.text);
        wrapEquationRuns(visible, (face) => faceNames.get(face));
        const pageArea = pageW * pageH;
        if (pageArea > 0) {
          const imageRegions = extractImageRegions(opList.fnArray, opList.argsArray);
          let uncovered = 0;
          for (const r of imageRegions) {
            const area = (r.x2 - r.x1) * (r.y2 - r.y1);
            const headerLogo = area >= pageArea * 5e-3 && r.y1 >= pageH * 0.8;
            if (area < pageArea * 0.02 && !headerLogo) continue;
            const large = area >= pageArea * 0.05;
            if (large) pagesWithLargeImage.add(i);
            const hasText2 = visible.some((it) => {
              const cx = it.x + it.w / 2;
              const cy = it.y + (it.h || it.fontSize) / 2;
              return cx >= r.x1 && cx <= r.x2 && cy >= r.y1 && cy <= r.y2;
            });
            if (!hasText2) {
              if (large) uncovered++;
              if (page.rotate % 360 === 0 && viewX1 === 0 && viewY1 === 0) {
                const regions = uncoveredImageRegions.get(i) ?? [];
                regions.push(r);
                uncoveredImageRegions.set(i, regions);
                if (large) largeImageRegions.add(r);
              }
            }
          }
          if (uncovered > 0) skippedImagePages.set(i, uncovered);
        }
        const marks = superscriptNoteMarks(visible);
        if (marks.length) noteMarks.set(i, { marks, seps: footnoteSeparators(extractLines(opList.fnArray, opList.argsArray).horizontals, pageW, pageH) });
        const stamp = marginStamp(visible);
        const flow = stamp.length ? visible.filter((it) => !stamp.includes(it)) : visible;
        const rightArrows = options?.tables !== false ? await detectRightArrowRegions(page, opList.fnArray, opList.argsArray, imageArrowDirections) : [];
        const pageBlocks = orderTwoUpPage(extractPageBlocksWithLines(flow, i, opList, pageW, pageH, void 0, options?.tables !== false, carry, wrapLexicon, rightArrows), pageW, pageH);
        if (stamp.length) pageBlocks.unshift({ type: "paragraph", text: [...stamp].sort((a, b) => a.y - b.y).map((it) => it.text).join(" "), pageNumber: i });
        for (const b of pageBlocks) blocks.push(b);
        try {
          const { blocks: imgBlocks, images: pageImages } = await extractPageImages(page, opList.fnArray, opList.argsArray, i, imageState, warnings, options?.images !== false);
          if (imgBlocks.length > 0) pageImageBlocks.set(i, imgBlocks);
          extractedImages.push(...pageImages);
        } catch {
        }
        let pageText = "";
        for (const b of pageBlocks) {
          let t = b.text || "";
          if (b.type === "table" && b.table) {
            const cellText = b.table.cells.map((row) => row.map((c) => c.text).join(" ")).join("\n");
            t = t ? t + "\n" + cellText : cellText;
          }
          totalChars += t.replace(/\s/g, "").length;
          totalTextBytes += t.length * 2;
          pageText += pageText ? "\n" + t : t;
        }
        const vector = scanVectorGlyphs(opList.fnArray, opList.argsArray, visible);
        const quality = computePageQuality(i, pageText, vector.glyphs);
        pageQuality.push(quality);
        if (options?.ocr && quality.ocrReason === "vector_text" && page.rotate % 360 === 0 && page.view[0] === 0 && page.view[1] === 0) {
          vectorPageOps.set(i, ocrVectorOps(opList, vector.paths));
        }
        if (totalTextBytes > MAX_TOTAL_TEXT) throw new KordocError("\uD14D\uC2A4\uD2B8 \uCD94\uCD9C \uD06C\uAE30 \uCD08\uACFC");
        parsedPages++;
        options?.onProgress?.(parsedPages, totalTarget);
      } catch (pageErr) {
        if (pageErr instanceof KordocError) throw pageErr;
        warnings.push({ page: i, message: `\uD398\uC774\uC9C0 ${i} \uD30C\uC2F1 \uC2E4\uD328: ${pageErr instanceof Error ? pageErr.message : "\uC54C \uC218 \uC5C6\uB294 \uC624\uB958"}`, code: "PARTIAL_PARSE" });
      } finally {
        loadedPage?.cleanup();
      }
      if (loadedFonts.size > FONT_CACHE_LIMIT) {
        await doc.cleanup();
        loadedFonts.clear();
      }
    }
    const parsedPageCount = parsedPages || (pageFilter ? pageFilter.size : effectivePageCount);
    const isImageBased = pageFilter?.size !== 0 && totalChars / Math.max(parsedPageCount, 1) < 10;
    const ocrDone = /* @__PURE__ */ new Set();
    const ocrRegions = options?.ocr === true || autoOcr ? ocrImageRegions(uncoveredImageRegions, largeImageRegions, options?.ocr === true) : /* @__PURE__ */ new Map();
    if (ocrBuffer) {
      const inScope = (p) => !pageFilter || pageFilter.has(p);
      const targets = /* @__PURE__ */ new Set();
      if (options?.ocr === "force" || isImageBased) {
        for (let i = 1; i <= effectivePageCount; i++) if (inScope(i)) targets.add(i);
      } else {
        for (const pq of pageQuality) {
          if (!pq.needsOcr) continue;
          if (pq.ocrReason === "low_text" && !pagesWithLargeImage.has(pq.page)) continue;
          if (autoOcr && pq.ocrReason !== "low_text" && pq.ocrReason !== "vector_text") continue;
          targets.add(pq.page);
        }
        for (const p of ocrRegions.keys()) targets.add(p);
      }
      if (targets.size > 0) {
        try {
          const { runPdfOcr } = await import("./pdf-ocr-JI3K7JIN-FFRWHHTW.mjs");
          const mode = typeof options?.ocr === "function" ? options.ocr : "builtin";
          const regionPages = new Map([...ocrRegions].filter(([p]) => options?.ocr !== "force" && !isImageBased && !pageQuality.find((q) => q.page === p)?.needsOcr));
          const ocrPageBlocks = await runPdfOcr(ocrBuffer, targets, mode, warnings, options?.onProgress, options?.tables !== false, vectorPageOps, regionPages);
          for (const obs of ocrPageBlocks.values()) stripScriptTags({ blocks: obs });
          if (ocrPageBlocks.size > 0) {
            const replacePages = /* @__PURE__ */ new Set();
            for (const [p, obs] of ocrPageBlocks) {
              const needsOcr = pageQuality.find((q) => q.page === p)?.needsOcr;
              if (options?.ocr === "force" || isImageBased || needsOcr) {
                replacePages.add(p);
                ocrDone.add(p);
                continue;
              }
              const regions = ocrRegions.get(p);
              if (!regions || mergeOcrImageRegions(blocks, p, regions, obs) === 0) continue;
              ocrDone.add(p);
              if (pageImageBlocks.get(p)?.length === 1) pageImageBlocks.delete(p);
            }
            if (replacePages.size) {
              const merged = blocks.filter((b) => !(b.pageNumber && replacePages.has(b.pageNumber)));
              for (const [p, obs] of ocrPageBlocks) if (replacePages.has(p)) merged.push(...obs);
              merged.sort((a, b) => (a.pageNumber ?? 0) - (b.pageNumber ?? 0));
              blocks.length = 0;
              blocks.push(...merged);
            }
            for (const pq of pageQuality) if (ocrDone.has(pq.page)) pq.ocrApplied = true;
            warnings.push({
              message: `${ocrDone.size}\uAC1C \uD398\uC774\uC9C0\uC5D0 OCR \uC801\uC6A9 (${mode === "builtin" ? "\uB0B4\uC7A5 PP-OCRv5" : "\uC0AC\uC6A9\uC790 \uD504\uB85C\uBC14\uC774\uB354"})`,
              code: "OCR_APPLIED"
            });
          }
        } catch (e) {
          warnings.push({
            message: `OCR \uC2E4\uD589 \uBD88\uAC00: ${e instanceof Error ? e.message : String(e)}`,
            code: "OCR_FAILED"
          });
        }
      }
    }
    if (isImageBased && ocrDone.size === 0) {
      warnings.push({
        message: `\uC774\uBBF8\uC9C0 \uAE30\uBC18 PDF (${pageCount}\uD398\uC774\uC9C0, \uD14D\uC2A4\uD2B8 ${totalChars}\uC790) \u2014 \uD14D\uC2A4\uD2B8 \uB808\uC774\uC5B4\uAC00 \uC5C6\uC5B4 OCR\uC774 \uD544\uC694\uD569\uB2C8\uB2E4. ocr: true (CLI --ocr) \uB85C \uB2E4\uC2DC \uD30C\uC2F1\uD558\uBA74 \uC77D\uC2B5\uB2C8\uB2E4`,
        code: "NEEDS_OCR"
      });
    }
    if (!isImageBased) {
      const OCR_REASON_MESSAGES = {
        vector_text: "\uAE00\uC790\uB97C \uACE1\uC120(\uBCA1\uD130 \uACBD\uB85C)\uC73C\uB85C \uADF8\uB9B0 \uD398\uC774\uC9C0 (\uD14D\uC2A4\uD2B8\uCE35\uC5D0 \uAE00\uC790 \uC5C6\uC74C)",
        low_text: "\uD14D\uC2A4\uD2B8\uAC00 \uAC70\uC758 \uC5C6\uB294 \uD398\uC774\uC9C0 (\uC2A4\uCE94/\uC774\uBBF8\uC9C0 \uCD94\uC815)",
        high_pua: "\uAE00\uAF34 \uB9E4\uD551 \uC2E4\uD328 (PUA \uBE44\uC728 \uB192\uC74C) \u2014 \uCD94\uCD9C \uD14D\uC2A4\uD2B8 \uC2E0\uB8B0 \uBD88\uAC00",
        high_control: "\uC81C\uC5B4\uBB38\uC790 \uBE44\uC728 \uB192\uC74C \u2014 \uCD94\uCD9C \uD14D\uC2A4\uD2B8 \uC2E0\uB8B0 \uBD88\uAC00",
        high_replacement: "\uB300\uCCB4\uBB38\uC790(U+FFFD) \uBE44\uC728 \uB192\uC74C \u2014 \uCD94\uCD9C \uD14D\uC2A4\uD2B8 \uC2E0\uB8B0 \uBD88\uAC00",
        garbled_hangul: "\uAE00\uAF34 \uB9E4\uD551 \uC2E4\uD328 (\uD55C\uAE00 \uC790\uC18C \uBD84\uD3EC \uC774\uC0C1) \u2014 \uCD94\uCD9C \uD14D\uC2A4\uD2B8\uAC00 \uAE68\uC84C\uC744 \uC218 \uC788\uC74C"
      };
      for (const pq of pageQuality) {
        if (!pq.needsOcr || !pq.ocrReason || pq.ocrApplied) continue;
        if (pq.ocrReason === "low_text" && !pagesWithLargeImage.has(pq.page)) continue;
        warnings.push({ page: pq.page, message: `${OCR_REASON_MESSAGES[pq.ocrReason]} \u2014 OCR \uAC80\uD1A0 \uD544\uC694 (ocr: true / CLI --ocr \uB85C \uB2E4\uC2DC \uD30C\uC2F1)`, code: "NEEDS_OCR" });
      }
    }
    if (!isImageBased) {
      for (const [page, count] of [...skippedImagePages.entries()].sort((a, b) => a[0] - b[0])) {
        if (ocrDone.has(page)) continue;
        warnings.push({ page, message: `${count}\uAC1C \uC774\uBBF8\uC9C0 \uC601\uC5ED\uC5D0 \uCD94\uCD9C \uAC00\uB2A5\uD55C \uD14D\uC2A4\uD2B8 \uC5C6\uC74C (\uADF8\uB9BC/\uCC28\uD2B8/\uB3C4\uC7A5 \uB0B4\uC6A9 \uB204\uB77D \uAC00\uB2A5 \u2014 \uADF8\uB9BC \uC18D \uAE00\uC740 ocr: true / CLI --ocr \uB85C \uC77D\uC2B5\uB2C8\uB2E4)`, code: "SKIPPED_IMAGE" });
      }
    }
    if (options?.removeHeaderFooter !== false && (parsedPageCount >= 3 || headerContext.length)) {
      const removed = removeHeaderFooterBlocks(blocks, pageHeights, warnings, noteMarks, false, headerContext);
      for (let ri = removed.length - 1; ri >= 0; ri--) {
        blocks.splice(removed[ri], 1);
      }
      const kept = removeSideTabs(blocks, pageWidths);
      if (kept !== blocks) {
        blocks.length = 0;
        blocks.push(...kept);
      }
    }
    mergeContinuedCells(blocks, pageHeights);
    mergeCrossPageTables(blocks, pageHeights, wrapLexicon);
    if (options?.removeHeaderFooter !== false && parsedPageCount >= 3) {
      const boxes = removeHeaderFooterBlocks(blocks, pageHeights, warnings, noteMarks, true);
      for (let ri = boxes.length - 1; ri >= 0; ri--) blocks.splice(boxes[ri], 1);
    }
    splitContactTables(blocks);
    if (!options?.keepTrailingEmptyCols) trimTrailingEmptyTableCols(blocks);
    joinPageBreakWraps(blocks, wrapLexicon);
    injectPageImageBlocks(blocks, pageImageBlocks);
    if (options?.formulaOcr && formulaBuffer) {
      try {
        await applyFormulaOcr(formulaBuffer, blocks, pageFilter, effectivePageCount, warnings, options.onProgress);
      } catch (e) {
        warnings.push({
          message: `\uC218\uC2DD OCR \uC2E4\uD328: ${e instanceof Error ? e.message : String(e)}`,
          code: "PARTIAL_PARSE"
        });
      }
    }
    const medianFontSize = computeMedianFontSizeFromFreq(fontSizeFreq);
    if (medianFontSize > 0) {
      detectHeadings(blocks, medianFontSize);
    }
    detectDocumentStyleHeadings(blocks);
    detectTypographyHeadings(blocks);
    detectSiblingStyleHeadings(blocks);
    detectRepeatedPageLabels(blocks);
    detectPageLeadHeadings(blocks);
    mergeStackedHeadingLines(blocks, medianFontSize);
    refineDocumentStyleHeadings(blocks);
    detectMarkerHeadings(blocks);
    demoteNonHeadingRoles(blocks, pageHeights, faceNames);
    detectTableCaptions(blocks);
    detectKoreanListBlocks(blocks);
    const outline = blocks.filter((b) => b.type === "heading" && b.level && b.text).map((b) => ({ level: b.level, text: b.text, pageNumber: b.pageNumber }));
    sanitizeBlockControlChars(blocks);
    let outBlocks = splitSingleCellTables(blocks);
    if (options?.layoutTables !== "keep") {
      blocks.length = 0;
      for (const block of outBlocks) blocks.push(block);
    }
    outBlocks = inlineFootnotes(outBlocks, noteMarks);
    outBlocks = relocateEndnotes(outBlocks);
    if (options?.removeHeaderFooter !== false) outBlocks = outBlocks.filter((b) => {
      if (b.type !== "paragraph" || !/^\s*\d{1,4}\s*$/.test(b.text ?? "")) return true;
      const h = pageHeights.get(b.pageNumber ?? 0);
      if (!b.bbox || !h) return false;
      return b.bbox.y > h * 0.1 && b.bbox.y + b.bbox.height < h * 0.9;
    });
    joinLatinCellWraps(outBlocks);
    if (options?.layoutTables !== "keep") {
      const hancom = await isHancomPdf(doc);
      const shown = /* @__PURE__ */ new Map();
      const markContent = (bs) => {
        for (const b of bs ?? []) if (b.table) for (const row of b.table.cells) for (const c of row) {
          if (IMAGE_CELLS.has(c)) CONTENT_CELLS.add(c);
          markContent(c.blocks);
        }
      };
      const visual = (bs) => bs.flatMap((b) => {
        if (b.type !== "table") return [b];
        if (!hancom && b.table && CLIP_TABLES.has(b.table)) return [b];
        let v = shown.get(b);
        if (!v) {
          markContent([b]);
          shown.set(b, v = unframeLayoutTables([b], !!options?.keepTrailingEmptyCols));
        }
        return v;
      });
      outBlocks = visual(outBlocks);
      const kept = visual(blocks);
      blocks.length = 0;
      for (const b of kept) blocks.push(b);
    }
    const finishMarkdown = (bs) => mergeLinkRuns(cleanPdfText(blocksToMarkdown(bs), { keepLoneNumbers: true }));
    let markdown = finishMarkdown(outBlocks);
    return {
      markdown,
      pages: blocksToPages(splitPageBreakWraps(outBlocks), finishMarkdown),
      blocks,
      metadata,
      outline: outline.length > 0 ? outline : void 0,
      warnings: warnings.length > 0 ? warnings : void 0,
      isImageBased: isImageBased || void 0,
      pageQuality,
      qualitySummary: summarizeDocumentQuality(pageQuality),
      images: extractedImages.length > 0 ? extractedImages : void 0
    };
  } finally {
    await doc.destroy().catch(() => {
    });
  }
}
async function extractPdfMetadata(doc, metadata) {
  try {
    const result = await doc.getMetadata();
    if (!result?.info) return;
    const info = result.info;
    if (typeof info.Title === "string" && info.Title.trim()) metadata.title = info.Title.trim();
    if (typeof info.Author === "string" && info.Author.trim()) metadata.author = info.Author.trim();
    if (typeof info.Creator === "string" && info.Creator.trim()) metadata.creator = info.Creator.trim();
    if (typeof info.Subject === "string" && info.Subject.trim()) metadata.description = info.Subject.trim();
    if (typeof info.Keywords === "string" && info.Keywords.trim()) {
      metadata.keywords = info.Keywords.split(/[,;]/).map((k) => k.trim()).filter(Boolean);
    }
    if (typeof info.CreationDate === "string") metadata.createdAt = parsePdfDate(info.CreationDate);
    if (typeof info.ModDate === "string") metadata.modifiedAt = parsePdfDate(info.ModDate);
  } catch {
  }
}
async function isHancomPdf(doc) {
  try {
    const info = (await doc.getMetadata())?.info;
    return [info?.Producer, info?.Creator].some((v) => typeof v === "string" && /^\s*(?:hancom\b|hwp\b)/i.test(v));
  } catch {
    return false;
  }
}
function parsePdfDate(dateStr) {
  const m = dateStr.match(/D:(\d{4})(\d{2})?(\d{2})?(\d{2})?(\d{2})?(\d{2})?/);
  if (!m) return void 0;
  const [, year, month = "01", day = "01", hour = "00", min = "00", sec = "00"] = m;
  return `${year}-${month}-${day}T${hour}:${min}:${sec}`;
}
async function extractPdfMetadataOnly(buffer) {
  const doc = await loadPdfWithTimeout(buffer);
  try {
    const metadata = { pageCount: doc.numPages };
    await extractPdfMetadata(doc, metadata);
    return metadata;
  } finally {
    await doc.destroy().catch(() => {
    });
  }
}
function marginStamp(items) {
  const rotated = items.filter((it) => it.rotated);
  if (rotated.length === 0) return [];
  const flat = items.filter((it) => !it.rotated);
  if (flat.length < 20) return [];
  const outside = (it) => {
    const x1 = it.x - it.fontSize, x2 = it.x + it.w + it.fontSize;
    const beside = flat.filter((f) => f.y >= it.y && f.y <= it.y + it.rotated);
    return beside.length >= 5 && (beside.every((f) => f.x >= x2) || beside.every((f) => f.x + f.w <= x1));
  };
  return rotated.every(outside) ? rotated : [];
}
export {
  PDFJS_DOCUMENT_OPTIONS,
  cleanPdfText,
  detectKoreanListBlocks,
  detectTableCaptions,
  extractPdfMetadataOnly,
  mergeCrossPageTables,
  ocrImageRegions,
  parsePdfDocument,
  removeHeaderFooterBlocks
};
