import {createRequire as __coreCreateRequire} from "node:module"; const require=__coreCreateRequire(import.meta.url); import {extensionUrl as __extensionUrl,extensionPath as __extensionPath} from "./extensions.mjs";
import {
  disableOrtTelemetry
} from "./chunk-AN7BM5RT.mjs";
import {
  ALL_FORMULA_MODELS,
  MFD_MODEL,
  MFR_DECODER_MODEL,
  MFR_ENCODER_MODEL,
  MFR_TOKENIZER,
  ensureFormulaModels,
  ensureSingleModel,
  getFormulaModelStatus,
  getFormulaModelsDir
} from "./chunk-IF2FUB7X.mjs";
import "./chunk-PZTNOUTU.mjs";
import "./chunk-3T6O35FL.mjs";

// node_modules/kordoc/dist/formula-DAMFHLQO.js
import { join } from "path";
var TRAILING_WHITESPACE_CMDS = [
  "\\,",
  "\\:",
  "\\;",
  "\\!",
  "\\ ",
  "\\quad",
  "\\qquad",
  "\\enspace",
  "\\thinspace"
];
function postProcessLatex(latex) {
  let s = stripTrailingWhitespace(latex);
  s = collapseSpaces(s);
  for (let i = 0; i < 10; i++) {
    const next = stripEmptyGroups(s);
    if (next === s) break;
    s = next;
  }
  s = fixLatexSpacing(s);
  s = normalizeFormulaSpacing(s);
  s = s.trim();
  if (isTrivialFormula(s)) return "";
  return s;
}
function stripTrailingWhitespace(s) {
  let t = s;
  for (; ; ) {
    const trimmed = t.replace(/[\s]+$/, "");
    let changed = false;
    for (const p of TRAILING_WHITESPACE_CMDS) {
      if (trimmed.endsWith(p)) {
        t = trimmed.slice(0, trimmed.length - p.length);
        changed = true;
        break;
      }
    }
    if (!changed) return trimmed;
  }
}
function collapseSpaces(s) {
  let out = "";
  let prevSpace = false;
  for (const c of s) {
    if (/\s/.test(c)) {
      if (!prevSpace) {
        out += " ";
        prevSpace = true;
      }
    } else {
      out += c;
      prevSpace = false;
    }
  }
  return out;
}
function stripEmptyGroups(s) {
  let out = "";
  let i = 0;
  const bytes = s;
  while (i < bytes.length) {
    const ch = bytes[i];
    if (ch === "{") {
      let j = i + 1;
      while (j < bytes.length && /\s/.test(bytes[j])) j++;
      if (j < bytes.length && bytes[j] === "}") {
        while (out.endsWith(" ") || out.endsWith("	")) {
          out = out.slice(0, -1);
        }
        if (out.endsWith("^") || out.endsWith("_")) {
          out = out.slice(0, -1);
        } else {
          let k = out.length;
          while (k > 0 && /[A-Za-z]/.test(out[k - 1])) k--;
          if (k > 0 && out[k - 1] === "\\" && k < out.length) {
            out = out.slice(0, k - 1);
          }
        }
        i = j + 1;
        continue;
      }
    }
    out += ch;
    i++;
  }
  return out;
}
var KNOWN_LATEX_CMDS = /* @__PURE__ */ new Set([
  // 연산자
  "cdot",
  "cdots",
  "ldots",
  "dots",
  "vdots",
  "ddots",
  "times",
  "div",
  "pm",
  "mp",
  "ast",
  "star",
  "circ",
  "bullet",
  "oplus",
  "ominus",
  "otimes",
  "odot",
  // 관계
  "approx",
  "equiv",
  "neq",
  "ne",
  "sim",
  "simeq",
  "cong",
  "leq",
  "geq",
  "le",
  "ge",
  "ll",
  "gg",
  "prec",
  "succ",
  "preceq",
  "succeq",
  "propto",
  "parallel",
  "perp",
  // 집합/논리
  "in",
  "notin",
  "ni",
  "subset",
  "supset",
  "subseteq",
  "supseteq",
  "cap",
  "cup",
  "bigcap",
  "bigcup",
  "emptyset",
  "varnothing",
  "forall",
  "exists",
  "nexists",
  "neg",
  "lnot",
  "land",
  "lor",
  "vee",
  "wedge",
  // 그리스 소문자
  "alpha",
  "beta",
  "gamma",
  "delta",
  "epsilon",
  "varepsilon",
  "zeta",
  "eta",
  "theta",
  "vartheta",
  "iota",
  "kappa",
  "lambda",
  "mu",
  "nu",
  "xi",
  "omicron",
  "pi",
  "varpi",
  "rho",
  "varrho",
  "sigma",
  "varsigma",
  "tau",
  "upsilon",
  "phi",
  "varphi",
  "chi",
  "psi",
  "omega",
  // 그리스 대문자
  "Gamma",
  "Delta",
  "Theta",
  "Lambda",
  "Xi",
  "Pi",
  "Sigma",
  "Upsilon",
  "Phi",
  "Psi",
  "Omega",
  // 화살표
  "to",
  "gets",
  "mapsto",
  "rightarrow",
  "leftarrow",
  "leftrightarrow",
  "Rightarrow",
  "Leftarrow",
  "Leftrightarrow",
  "uparrow",
  "downarrow",
  "longrightarrow",
  "longleftarrow",
  "longmapsto",
  // 큰 연산자
  "sum",
  "prod",
  "coprod",
  "int",
  "iint",
  "iiint",
  "oint",
  "bigoplus",
  "bigotimes",
  // 함수명
  "sin",
  "cos",
  "tan",
  "sec",
  "csc",
  "cot",
  "arcsin",
  "arccos",
  "arctan",
  "sinh",
  "cosh",
  "tanh",
  "log",
  "ln",
  "lg",
  "exp",
  "lim",
  "liminf",
  "limsup",
  "sup",
  "inf",
  "max",
  "min",
  "arg",
  "det",
  "dim",
  "gcd",
  "deg",
  "hom",
  "ker",
  "mod",
  // 특수 기호/수식
  "infty",
  "partial",
  "nabla",
  "prime",
  "aleph",
  "ell",
  "hbar",
  "Re",
  "Im",
  "top",
  "bot",
  "angle",
  "vdash",
  "dashv",
  // 기타
  "left",
  "right",
  "big",
  "Big",
  "bigg",
  "Bigg"
]);
function fixLatexSpacing(s) {
  let out = "";
  let i = 0;
  while (i < s.length) {
    if (s[i] === "\\" && i + 1 < s.length && /[A-Za-z]/.test(s[i + 1])) {
      let j = i + 1;
      while (j < s.length && /[A-Za-z]/.test(s[j])) j++;
      const full = s.slice(i + 1, j);
      const nextChar = j < s.length ? s[j] : "";
      if (nextChar === "{") {
        out += "\\" + full;
        i = j;
        continue;
      }
      let splitAt = full.length;
      if (!KNOWN_LATEX_CMDS.has(full) && full.length >= 3) {
        for (let len = full.length - 1; len >= 2; len--) {
          if (KNOWN_LATEX_CMDS.has(full.slice(0, len))) {
            splitAt = len;
            break;
          }
        }
      }
      out += "\\" + full.slice(0, splitAt);
      if (splitAt < full.length) {
        out += " " + full.slice(splitAt);
      }
      i = j;
    } else {
      out += s[i];
      i++;
    }
  }
  return out;
}
function isTrivialFormula(s) {
  const t = s.trim();
  if (t.length === 0) return true;
  const stripped = t.replace(/[\s{}]/g, "");
  if (stripped.length <= 2) return true;
  if (/^\\[A-Za-z]+$/.test(t)) return true;
  if (/^\\(?:mathrm|textrm|text|operatorname|mathit|mathbf|mathcal|mathsf|mathtt)\{[A-Za-z]{1,6}\}$/.test(
    t
  ))
    return true;
  const tokens = tokenizeLatex(t);
  if (tokens.length >= 3) {
    const freq = /* @__PURE__ */ new Map();
    for (const tok of tokens) freq.set(tok, (freq.get(tok) ?? 0) + 1);
    let maxCount = 0;
    for (const c of freq.values()) if (c > maxCount) maxCount = c;
    if (maxCount >= 3 && maxCount / tokens.length >= 0.5) return true;
  }
  if (tokens.length >= 2 && tokens.length <= 4) {
    const hasOpOrNum = tokens.some(
      (tok) => /^[=+\-/*<>]$/.test(tok) || /^[0-9]$/.test(tok)
    );
    if (!hasOpOrNum) return true;
  }
  if (hasHighRepetition(t)) return true;
  if (t.includes("\\square")) return true;
  if (/^[-+]?\d+\.?\d*$/.test(t.replace(/[\s{}\\]/g, ""))) return true;
  if (/(\([^()]{2,15}\))\s*\1/.test(t)) return true;
  if (/(\{(?:[^{}]|\{[^{}]*\})+\})\s*\1/.test(t)) return true;
  const argMatch = t.match(/^[A-Za-z\\][A-Za-z]*\(([^()]+)\)$/);
  if (argMatch) {
    const args = argMatch[1].split(",").map((a) => a.trim());
    if (args.length >= 2) {
      const freq = /* @__PURE__ */ new Map();
      for (const a of args) if (a) freq.set(a, (freq.get(a) ?? 0) + 1);
      for (const [, c] of freq) {
        if (c >= 2 && c / args.length >= 0.5) return true;
      }
    }
  }
  if (/\\frac\{([^{}]+)\}\{\1\}/.test(t)) return true;
  if (/(\\[A-Za-z]+|\b[A-Za-z])\s*\/\s*\1\b/.test(t)) return true;
  if (/\\begin\{(?:matrix|pmatrix|bmatrix|vmatrix)\}/.test(t)) {
    const cdotsCount = (t.match(/\\cdots/g) ?? []).length;
    if (cdotsCount >= 2) return true;
  }
  if (tokens.length <= 12) {
    const mathrmCount = (t.match(/\\mathrm\{/g) ?? []).length;
    if (mathrmCount >= 2) {
      const hasRealMath = /[=+\-*/<>^]/.test(t) && /\d/.test(t);
      if (!hasRealMath) return true;
    }
  }
  if (/^[a-zA-Z]{2,3}_\{\\mathrm\{[a-zA-Z]{3,}\}\}$/.test(t)) return true;
  if (/^\\mathrm\{[a-z]{2,}\}[-+][-+]?(?:\\[a-zA-Z]+|[a-zA-Z0-9])$/.test(t)) return true;
  if (/\\(?:mathsf|mathtt|texttt)\{/.test(t)) return true;
  if (/\\begin\{aligned\}/.test(t) && !t.includes("=")) return true;
  if (/\\begin\{matrix\}/.test(t) && (t.match(/\\downarrow/g) ?? []).length >= 2) return true;
  return false;
}
function hasHighRepetition(s) {
  if (s.length < 15) return false;
  for (let len = 5; len <= 15; len++) {
    if (len * 3 > s.length) break;
    const seen = /* @__PURE__ */ new Map();
    for (let i = 0; i <= s.length - len; i++) {
      const sub = s.slice(i, i + len);
      if (!/[a-zA-Z]/.test(sub)) continue;
      seen.set(sub, (seen.get(sub) ?? 0) + 1);
    }
    for (const [, count] of seen) {
      if (count < 3) continue;
      if (count * len / s.length >= 0.6) return true;
    }
  }
  return false;
}
function tokenizeLatex(s) {
  const result = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (c === "\\") {
      let j = i + 1;
      while (j < s.length && /[A-Za-z]/.test(s[j])) j++;
      if (j === i + 1 && j < s.length) j++;
      result.push(s.slice(i, j));
      i = j;
    } else if (/\s/.test(c)) {
      i++;
    } else {
      result.push(c);
      i++;
    }
  }
  return result;
}
function normalizeFormulaSpacing(s) {
  const tokens = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (c === "\\") {
      let j = i + 1;
      while (j < s.length && /[A-Za-z]/.test(s[j])) j++;
      if (j === i + 1 && j < s.length) j++;
      tokens.push(s.slice(i, j));
      i = j;
    } else if (/\s/.test(c)) {
      tokens.push(" ");
      i++;
    } else {
      tokens.push(c);
      i++;
    }
  }
  const out = [];
  for (let k = 0; k < tokens.length; k++) {
    if (tokens[k] !== " ") {
      out.push(tokens[k]);
      continue;
    }
    let prev = "";
    for (let p = k - 1; p >= 0; p--) {
      if (tokens[p] !== " ") {
        prev = tokens[p];
        break;
      }
    }
    let next = "";
    for (let q = k + 1; q < tokens.length; q++) {
      if (tokens[q] !== " ") {
        next = tokens[q];
        break;
      }
    }
    const prevIsCmd = /^\\[A-Za-z]+$/.test(prev);
    const nextIsAlpha = /^[A-Za-z]$/.test(next);
    if (prevIsCmd && nextIsAlpha) {
      if (out.length === 0 || out[out.length - 1] !== " ") {
        out.push(" ");
      }
    }
  }
  while (out.length > 0 && out[0] === " ") out.shift();
  while (out.length > 0 && out[out.length - 1] === " ") out.pop();
  return out.join("");
}
var MFD_IMG_SIZE = 768;
var MFD_NUM_CLASSES = 2;
var MFD_CHANNELS = 4 + MFD_NUM_CLASSES;
var MFD_CONF_INLINE = 0.3;
var MFD_CONF_DISPLAY = 0.4;
var MFD_IOU_THRESHOLD = 0.45;
var MFD_MIN_AREA = 80;
var PAD_VALUE = 114 / 255;
async function detectFormulaRegions(session, frame, ort) {
  const { scale, padX, padY, tensor } = letterbox(frame, MFD_IMG_SIZE);
  const input = new ort.Tensor("float32", tensor, [1, 3, MFD_IMG_SIZE, MFD_IMG_SIZE]);
  const feeds = { images: input };
  const outputs = await session.run(feeds);
  const firstKey = Object.keys(outputs)[0];
  const out = outputs[firstKey];
  if (!out || out.type !== "float32") {
    throw new Error("MFD \uCD9C\uB825 \uC5C6\uC74C \uB610\uB294 dtype \uBD88\uC77C\uCE58");
  }
  const outDims = out.dims;
  if (outDims.length !== 3) {
    throw new Error(`MFD \uCD9C\uB825 \uCC28\uC6D0 \uC608\uC0C1 3, \uC2E4\uC81C ${outDims.length}: [${outDims.join(",")}]`);
  }
  const channels = outDims[1];
  const anchors = outDims[2];
  if (channels !== MFD_CHANNELS) {
    throw new Error(`MFD \uCC44\uB110 \uC218 \uC608\uC0C1 ${MFD_CHANNELS}, \uC2E4\uC81C ${channels}`);
  }
  if (anchors <= 0) return [];
  const data = out.data;
  const candidates = [];
  for (let a = 0; a < anchors; a++) {
    const cx = data[a];
    const cy = data[anchors + a];
    const w = data[2 * anchors + a];
    const h = data[3 * anchors + a];
    let bestCls = 0;
    let bestScore = 0;
    for (let c = 0; c < MFD_NUM_CLASSES; c++) {
      const s = data[(4 + c) * anchors + a];
      if (s > bestScore) {
        bestScore = s;
        bestCls = c;
      }
    }
    const threshold = bestCls === 1 ? MFD_CONF_DISPLAY : MFD_CONF_INLINE;
    if (bestScore < threshold) continue;
    let x1 = (cx - w / 2 - padX) / scale;
    let y1 = (cy - h / 2 - padY) / scale;
    let x2 = (cx + w / 2 - padX) / scale;
    let y2 = (cy + h / 2 - padY) / scale;
    x1 = clamp(x1, 0, frame.width - 1);
    y1 = clamp(y1, 0, frame.height - 1);
    x2 = clamp(x2, 0, frame.width - 1);
    y2 = clamp(y2, 0, frame.height - 1);
    if (x2 - x1 < 2 || y2 - y1 < 2) continue;
    if ((x2 - x1) * (y2 - y1) < MFD_MIN_AREA) continue;
    candidates.push({
      x1,
      y1,
      x2,
      y2,
      kind: bestCls === 1 ? "display" : "inline",
      score: bestScore
    });
  }
  const kept = [];
  for (const kind of ["inline", "display"]) {
    const subset = candidates.filter((c) => c.kind === kind);
    kept.push(...nms(subset, MFD_IOU_THRESHOLD));
  }
  kept.sort((a, b) => a.y1 - b.y1 || a.x1 - b.x1);
  return kept.map((d) => ({
    bbox: { x1: d.x1, y1: d.y1, x2: d.x2, y2: d.y2 },
    kind: d.kind,
    score: d.score
  }));
}
function letterbox(frame, target) {
  const w = frame.width;
  const h = frame.height;
  const scale = Math.min(target / w, target / h);
  const newW = Math.max(1, Math.round(w * scale));
  const newH = Math.max(1, Math.round(h * scale));
  const padX = (target - newW) / 2;
  const padY = (target - newH) / 2;
  const offX = Math.floor(padX);
  const offY = Math.floor(padY);
  const ts = target;
  const tensor = new Float32Array(3 * ts * ts);
  tensor.fill(PAD_VALUE);
  const src = frame.data;
  const srcW = frame.width;
  const srcH = frame.height;
  for (let y = 0; y < newH; y++) {
    const sy = Math.min(srcH - 1, Math.floor((y + 0.5) / newH * srcH));
    for (let x = 0; x < newW; x++) {
      const sx = Math.min(srcW - 1, Math.floor((x + 0.5) / newW * srcW));
      const srcIdx = (sy * srcW + sx) * 4;
      const r = src[srcIdx];
      const g = src[srcIdx + 1];
      const b = src[srcIdx + 2];
      const tx = x + offX;
      const ty = y + offY;
      const idx = ty * ts + tx;
      tensor[idx] = r / 255;
      tensor[ts * ts + idx] = g / 255;
      tensor[2 * ts * ts + idx] = b / 255;
    }
  }
  return { scale, padX, padY, tensor };
}
function nms(cands, iouThreshold) {
  const sorted = [...cands].sort((a, b) => b.score - a.score);
  const kept = [];
  for (const cand of sorted) {
    let keep = true;
    for (const k of kept) {
      if (iou(cand, k) > iouThreshold) {
        keep = false;
        break;
      }
    }
    if (keep) kept.push(cand);
  }
  return kept;
}
function iou(a, b) {
  const x1 = Math.max(a.x1, b.x1);
  const y1 = Math.max(a.y1, b.y1);
  const x2 = Math.min(a.x2, b.x2);
  const y2 = Math.min(a.y2, b.y2);
  const interW = Math.max(0, x2 - x1);
  const interH = Math.max(0, y2 - y1);
  const inter = interW * interH;
  const areaA = Math.max(0, a.x2 - a.x1) * Math.max(0, a.y2 - a.y1);
  const areaB = Math.max(0, b.x2 - b.x1) * Math.max(0, b.y2 - b.y1);
  const union = areaA + areaB - inter;
  return union <= 0 ? 0 : inter / union;
}
function clamp(v, lo, hi) {
  if (v < lo) return lo;
  if (v > hi) return hi;
  return v;
}
var MFR_IMG_SIZE = 384;
var MFR_ENC_HIDDEN = 384;
var MFR_MAX_NEW_TOKENS = 256;
var MFR_EOS_ID = 2;
var MFR_PAD_ID = 0;
async function recognizeFormula(deps, crop) {
  const tensor = deitPreprocess(crop, MFR_IMG_SIZE);
  const { ort, encoder, decoder, tokenizer } = deps;
  const pixelInput = new ort.Tensor("float32", tensor, [1, 3, MFR_IMG_SIZE, MFR_IMG_SIZE]);
  const encOut = await encoder.run({ pixel_values: pixelInput });
  const encKey = Object.keys(encOut).find((k) => k.includes("hidden")) ?? Object.keys(encOut)[0];
  const encTensor = encOut[encKey];
  if (!encTensor || encTensor.type !== "float32") {
    throw new Error("MFR encoder \uCD9C\uB825 \uC5C6\uC74C");
  }
  const encDims = encTensor.dims;
  if (encDims.length !== 3) {
    throw new Error(`MFR encoder \uCC28\uC6D0 \uC608\uC0C1 3, \uC2E4\uC81C ${encDims.length}`);
  }
  const encSeq = encDims[1];
  const encHidden = encDims[2];
  if (encHidden !== MFR_ENC_HIDDEN) {
    throw new Error(`MFR encoder hidden \uC608\uC0C1 ${MFR_ENC_HIDDEN}, \uC2E4\uC81C ${encHidden}`);
  }
  const encData = encTensor.data;
  const tokens = [MFR_EOS_ID];
  for (let step = 0; step < MFR_MAX_NEW_TOKENS; step++) {
    const seqLen = tokens.length;
    const idsArr = BigInt64Array.from(tokens.map((t) => BigInt(t)));
    const idsTensor = new ort.Tensor("int64", idsArr, [1, seqLen]);
    const hidCopy = new Float32Array(encData);
    const hidTensor = new ort.Tensor("float32", hidCopy, [1, encSeq, encHidden]);
    const decOut = await decoder.run({
      input_ids: idsTensor,
      encoder_hidden_states: hidTensor
    });
    const logitKey = Object.keys(decOut).find((k) => k.includes("logit")) ?? Object.keys(decOut)[0];
    const logitsTensor = decOut[logitKey];
    if (!logitsTensor || logitsTensor.type !== "float32") {
      throw new Error("MFR decoder logits \uC5C6\uC74C");
    }
    const dims = logitsTensor.dims;
    if (dims.length !== 3) {
      throw new Error(`MFR decoder \uCC28\uC6D0 \uC608\uC0C1 3, \uC2E4\uC81C ${dims.length}`);
    }
    const decSeq = dims[1];
    const vocab = dims[2];
    const logitsData = logitsTensor.data;
    const lastOffset = (decSeq - 1) * vocab;
    let bestId = 0;
    let bestVal = -Infinity;
    for (let v = 0; v < vocab; v++) {
      const val = logitsData[lastOffset + v];
      if (val > bestVal) {
        bestVal = val;
        bestId = v;
      }
    }
    tokens.push(bestId);
    if (bestId === MFR_EOS_ID) break;
  }
  const body = [];
  for (let i = 1; i < tokens.length; i++) {
    const t = tokens[i];
    if (t === MFR_EOS_ID) break;
    if (t === MFR_PAD_ID) continue;
    if (t < 0) continue;
    body.push(t);
  }
  const raw = tokenizer.decode(body, { skip_special_tokens: true });
  return postProcessLatex(raw);
}
function deitPreprocess(crop, target) {
  const ts = target;
  const out = new Float32Array(3 * ts * ts);
  const { data: src, width: srcW, height: srcH } = crop;
  for (let y = 0; y < ts; y++) {
    const sy = Math.min(srcH - 1, Math.max(0, Math.floor((y + 0.5) / ts * srcH)));
    for (let x = 0; x < ts; x++) {
      const sx = Math.min(srcW - 1, Math.max(0, Math.floor((x + 0.5) / ts * srcW)));
      const srcIdx = (sy * srcW + sx) * 4;
      const r = src[srcIdx];
      const g = src[srcIdx + 1];
      const b = src[srcIdx + 2];
      const idx = y * ts + x;
      out[idx] = r / 127.5 - 1;
      out[ts * ts + idx] = g / 127.5 - 1;
      out[2 * ts * ts + idx] = b / 127.5 - 1;
    }
  }
  return out;
}
var RENDER_SCALE = 2;
var FormulaPipeline = class _FormulaPipeline {
  mfd;
  encoder;
  decoder;
  tokenizer;
  ort;
  sharp;
  pdfium;
  opts;
  constructor(parts) {
    this.mfd = parts.mfd;
    this.encoder = parts.encoder;
    this.decoder = parts.decoder;
    this.tokenizer = parts.tokenizer;
    this.ort = parts.ort;
    this.sharp = parts.sharp;
    this.pdfium = parts.pdfium;
    this.opts = parts.opts;
  }
  /**
   * 수식 OCR 엔진 초기화. 모델 파일이 로컬에 없으면 즉시 실패 — 호출자가
   * `ensureFormulaModels()` 를 먼저 돌려야 한다.
   */
  static async create(options) {
    disableOrtTelemetry();
    const opts = {
      scale: options?.scale ?? RENDER_SCALE,
      maxRegionsPerPage: options?.maxRegionsPerPage ?? 50,
      pageTimeoutMs: options?.pageTimeoutMs ?? 6e4
    };
    const [ortMod, sharpModRaw, hfMod, pdfiumMod] = await Promise.all([
      tryImport(
        "onnxruntime-node",
        () => import(__extensionUrl("onnxruntime-node"))
      ),
      tryImport(
        "sharp",
        () => import(__extensionUrl("sharp"))
      ),
      tryImport(
        "@huggingface/transformers",
        () => import(__extensionUrl("@huggingface/transformers"))
      ),
      tryImport(
        "@hyzyla/pdfium",
        () => import(__extensionUrl("@hyzyla/pdfium"))
      )
    ]);
    const sharpAny = sharpModRaw;
    const sharpMod = typeof sharpAny === "function" ? sharpAny : sharpAny.default ?? sharpAny;
    const modelsDir = getFormulaModelsDir();
    const mfdPath = join(modelsDir, MFD_MODEL.filename);
    const encPath = join(modelsDir, MFR_ENCODER_MODEL.filename);
    const decPath = join(modelsDir, MFR_DECODER_MODEL.filename);
    const tokPath = join(modelsDir, MFR_TOKENIZER.filename);
    const sessionOpts = {
      graphOptimizationLevel: "all",
      executionProviders: ["cpu"]
    };
    const [mfd, encoder, decoder] = await Promise.all([
      ortMod.InferenceSession.create(mfdPath, sessionOpts),
      ortMod.InferenceSession.create(encPath, sessionOpts),
      ortMod.InferenceSession.create(decPath, sessionOpts)
    ]);
    const { readFile } = await import("fs/promises");
    const tokenizerJson = JSON.parse(await readFile(tokPath, "utf-8"));
    const PretrainedCtor = hfMod.PreTrainedTokenizer;
    const tokenizer = new PretrainedCtor(tokenizerJson, {});
    const pdfium = await pdfiumMod.PDFiumLibrary.init();
    return new _FormulaPipeline({
      mfd,
      encoder,
      decoder,
      tokenizer,
      ort: ortMod,
      sharp: sharpMod,
      pdfium,
      opts
    });
  }
  /** 리소스 해제 — 더 이상 사용하지 않을 때 호출. ONNX 세션은 onnxruntime-node 1.14+ release() 로 (구버전은 GC — ocr/engine.ts destroy 와 같은 방식) */
  async destroy() {
    for (const s of [this.mfd, this.encoder, this.decoder]) {
      const rel = s.release;
      if (typeof rel === "function") {
        try {
          await rel.call(s);
        } catch {
        }
      }
    }
    try {
      this.pdfium.destroy();
    } catch {
    }
  }
  /**
   * PDF 버퍼를 열어 페이지별 수식 영역을 인식한다.
   * 실패한 페이지는 skip (에러 전파 없음 — 로그만).
   *
   * @param pageFilter null 이면 전체 페이지. Set 이면 1-based 페이지 번호 일치만.
   */
  async runOnBuffer(buffer, pageFilter = null, onPageProgress) {
    const view = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
    const doc = await this.pdfium.loadDocument(view);
    try {
      const pages = [];
      const count = doc.getPageCount();
      const pageNos = pageFilter ? [...pageFilter].filter((p) => p >= 1 && p <= count).sort((a, b) => a - b) : Array.from({ length: count }, (_, i) => i + 1);
      for (const pageNo of pageNos) {
        const page = doc.getPage(pageNo - 1);
        onPageProgress?.(pageNo, count);
        try {
          const result = await withTimeout(
            this.processPage(pageNo, page),
            this.opts.pageTimeoutMs,
            `formula page ${pageNo} timed out after ${this.opts.pageTimeoutMs}ms`
          );
          if (result) pages.push(result);
        } catch (e) {
          process.stderr.write(
            `[kordoc-formula] page ${pageNo} skipped: ${e.message}
`
          );
        }
      }
      return pages;
    } finally {
      doc.destroy();
    }
  }
  async processPage(pageNumber, page) {
    const { originalWidth: pdfWidth, originalHeight: pdfHeight } = page.getOriginalSize();
    const sharpCtor = this.sharp;
    const rendered = await page.render({
      scale: this.opts.scale,
      render: async ({ data, width, height }) => {
        return data;
      }
    });
    const { data: bgra, width: rw, height: rh } = rendered;
    const rgba = bgraToRgba(bgra);
    const pageFrame = { width: rw, height: rh, data: rgba };
    const regions0 = await detectFormulaRegions(this.mfd, pageFrame, this.ort);
    if (regions0.length === 0) {
      return { pageNumber, renderedWidth: rw, renderedHeight: rh, pdfWidth, pdfHeight, regions: [] };
    }
    const capped = regions0.slice(0, this.opts.maxRegionsPerPage);
    const regions = [];
    for (const r of capped) {
      const x1 = Math.floor(Math.max(0, r.bbox.x1));
      const y1 = Math.floor(Math.max(0, r.bbox.y1));
      const x2 = Math.ceil(Math.min(rw, r.bbox.x2));
      const y2 = Math.ceil(Math.min(rh, r.bbox.y2));
      const cw = x2 - x1;
      const ch = y2 - y1;
      if (cw < 4 || ch < 4) continue;
      const cropRgba = await sharpCtor(rgba, {
        raw: { width: rw, height: rh, channels: 4 }
      }).extract({ left: x1, top: y1, width: cw, height: ch }).raw().toBuffer();
      const cropFrame = { width: cw, height: ch, data: new Uint8Array(cropRgba) };
      let latex = "";
      try {
        latex = await recognizeFormula(
          {
            encoder: this.encoder,
            decoder: this.decoder,
            tokenizer: this.tokenizer,
            ort: this.ort
          },
          cropFrame
        );
      } catch (e) {
        process.stderr.write(
          `[kordoc-formula] recognize failed at page ${pageNumber} ${JSON.stringify(r.bbox)}: ${e.message}
`
        );
        latex = "";
      }
      regions.push({ ...r, latex });
    }
    return {
      pageNumber,
      renderedWidth: rw,
      renderedHeight: rh,
      pdfWidth,
      pdfHeight,
      regions
    };
  }
};
async function tryImport(name, loader) {
  try {
    return await loader();
  } catch (e) {
    throw new Error(
      `\uC218\uC2DD OCR \uC744 \uC0AC\uC6A9\uD558\uB824\uBA74 optional dependency '${name}' \uC774 \uD544\uC694\uD569\uB2C8\uB2E4. \`npm install ${name}\` \uD6C4 \uB2E4\uC2DC \uC2E4\uD589\uD558\uC138\uC694. \uC6D0\uC778: ${e.message}`
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
  ALL_FORMULA_MODELS,
  FormulaPipeline,
  MFD_MODEL,
  MFR_DECODER_MODEL,
  MFR_ENCODER_MODEL,
  MFR_TOKENIZER,
  ensureFormulaModels,
  ensureSingleModel,
  getFormulaModelStatus,
  getFormulaModelsDir,
  postProcessLatex
};
