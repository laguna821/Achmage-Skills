import {createRequire as __coreCreateRequire} from "node:module"; const require=__coreCreateRequire(import.meta.url); import {extensionUrl as __extensionUrl,extensionPath as __extensionPath} from "./extensions.mjs";
import {
  MAX_OCR_PIXELS,
  deskewPage,
  detectRulingLines,
  getOcrEngine,
  ocrItemsToBlocks,
  rulingToPdfLines
} from "./chunk-ACW76YWF.mjs";
import "./chunk-AN7BM5RT.mjs";
import {
  ensureOcrModels
} from "./chunk-4KEIBFBR.mjs";
import "./chunk-IF2FUB7X.mjs";
import "./chunk-HW7SKSEC.mjs";
import {
  KordocError,
  OPTIONAL_DEP_INSTALL_HINT
} from "./chunk-PZTNOUTU.mjs";
import "./chunk-3T6O35FL.mjs";

// node_modules/kordoc/dist/image-ocr-VH54SDZ7.js
var IMAGE_SCALE = 3;
function imageScale(width, height, densityDpi) {
  if (densityDpi && densityDpi >= 100 && densityDpi <= 1200) return densityDpi / 72;
  const long = Math.max(width, height), short = Math.min(width, height);
  if (short > 0) {
    const r = long / short;
    if (Math.abs(r / Math.SQRT2 - 1) <= 0.02) return long / 842;
    if (Math.abs(r / (11 / 8.5) - 1) <= 0.02) return long / 792;
  }
  return IMAGE_SCALE;
}
async function parseImageDocument(buffer, options) {
  const warnings = [];
  if (typeof options?.ocr === "function") {
    const text = await options.ocr(new Uint8Array(buffer), 1, detectImageMime(buffer));
    if (!text.trim()) {
      warnings.push({ page: 1, message: "OCR \uACB0\uACFC \uC5C6\uC74C", code: "OCR_FAILED" });
      return { blocks: [], warnings };
    }
    return { blocks: [{ type: "paragraph", text: text.trim(), pageNumber: 1 }], warnings };
  }
  const { data: decoded, width, height, density, shrink } = await decodeToRgba(buffer);
  if (shrink < 1) warnings.push({ page: 1, code: "PARTIAL_PARSE", message: "OCR \uB798\uC2A4\uD130 \uD53D\uC140 \uC0C1\uD55C\uC73C\uB85C \uC774\uBBF8\uC9C0 \uD574\uC0C1\uB3C4\uB97C \uCD95\uC18C\uD588\uC2B5\uB2C8\uB2E4 (\uC791\uC740 \uAE00\uC790 \uC778\uC2DD \uACB0\uC190 \uAC00\uB2A5)" });
  const scale = imageScale(width / shrink, height / shrink, density) * shrink;
  const { rgba: data } = deskewPage(decoded, width, height);
  await ensureOcrModels((p) => {
    if (p.phase === "download" && p.downloaded === 0) {
      process.stderr.write(`[kordoc-ocr] ${p.spec.name} \uB2E4\uC6B4\uB85C\uB4DC \uC911 (~${p.spec.sizeMb}MB)...
`);
    }
  });
  const engine = await getOcrEngine();
  const stats = { droppedLowConf: 0 };
  const items = await engine.recognizePage(data, width, height, stats);
  if (stats.droppedLowConf > 0) {
    warnings.push({
      page: 1,
      message: `\uC800\uC2E0\uB8B0 OCR \uB77C\uC778 ${stats.droppedLowConf}\uAC1C \uD3D0\uAE30 (\uC778\uC2DD \uACB0\uC190 \uAC00\uB2A5)`,
      code: "OCR_LOW_CONF"
    });
  }
  if (stats.truncatedBoxes) {
    warnings.push({ page: 1, message: `OCR \uAC80\uCD9C \uC0C1\uC790\uAC00 \uB108\uBB34 \uB9CE\uC544 ${stats.truncatedBoxes}\uAC1C\uB294 \uC778\uC2DD\uD558\uC9C0 \uC54A\uC74C (\uC77C\uBD80 \uAE00 \uACB0\uC190)`, code: "PARTIAL_PARSE" });
  }
  if (items.length === 0) {
    warnings.push({ page: 1, message: "\uC774\uBBF8\uC9C0\uC5D0\uC11C \uD14D\uC2A4\uD2B8\uB97C \uC778\uC2DD\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4", code: "OCR_FAILED" });
    return { blocks: [], warnings };
  }
  const pdfW = width / scale;
  const pdfH = height / scale;
  const ruling = detectRulingLines(data, width, height, scale);
  const extraLines = rulingToPdfLines(ruling, scale, pdfH);
  return { blocks: ocrItemsToBlocks(items, 1, pdfW, pdfH, scale, extraLines, options?.tables !== false), warnings };
}
async function decodeToRgba(buffer) {
  let sharp;
  try {
    const mod = await import(__extensionUrl("sharp"));
    sharp = typeof mod === "function" ? mod : mod.default ?? mod;
  } catch (e) {
    throw new KordocError(
      `\uC774\uBBF8\uC9C0 \uD30C\uC2F1\uC5D0\uB294 optional dependency 'sharp' \uAC00 \uD544\uC694\uD569\uB2C8\uB2E4. \`npm install sharp\` \uD6C4 \uB2E4\uC2DC \uC2E4\uD589\uD558\uC138\uC694.${OPTIONAL_DEP_INSTALL_HINT} \uC6D0\uC778: ${e.message}`
    );
  }
  const input = Buffer.from(buffer);
  const meta = await sharp(input).metadata().catch(() => ({}));
  const [w0, h0] = (meta.orientation ?? 1) >= 5 ? [meta.height ?? 0, meta.width ?? 0] : [meta.width ?? 0, meta.height ?? 0];
  const shrink = w0 * h0 > MAX_OCR_PIXELS ? Math.sqrt(MAX_OCR_PIXELS / (w0 * h0)) : 1;
  let chain = sharp(input).rotate();
  if (shrink < 1) chain = chain.resize(Math.max(1, Math.floor(w0 * shrink)), Math.max(1, Math.floor(h0 * shrink)), { fit: "fill" });
  const { data, info } = await chain.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return {
    data: new Uint8Array(data.buffer, data.byteOffset, data.byteLength),
    width: info.width,
    height: info.height,
    density: meta.density,
    shrink: w0 ? info.width / w0 : 1
  };
}
function detectImageMime(buffer) {
  const b = new Uint8Array(buffer, 0, Math.min(12, buffer.byteLength));
  if (b[0] === 255 && b[1] === 216) return "image/jpeg";
  if (b[0] === 82 && b[1] === 73) return "image/webp";
  return "image/png";
}
export {
  decodeToRgba,
  imageScale,
  parseImageDocument
};
