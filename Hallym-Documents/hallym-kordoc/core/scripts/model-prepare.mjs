var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// ../../../../../../Desktop/hanmark-1.2.0/kordoc-main (1)/kordoc-main/src/utils.ts
var KordocError;
var init_utils = __esm({
  "../../../../../../Desktop/hanmark-1.2.0/kordoc-main (1)/kordoc-main/src/utils.ts"() {
    "use strict";
    KordocError = class extends Error {
      constructor(message) {
        super(message);
        this.name = "KordocError";
      }
    };
  }
});

// ../../../../../../Desktop/hanmark-1.2.0/kordoc-main (1)/kordoc-main/src/shared/offline.ts
function envFlag(name) {
  const v = process.env[name];
  return !!v && TRUTHY.has(v.trim().toLowerCase());
}
function isOfflineMode() {
  return envFlag("KORDOC_OFFLINE");
}
function assertNetworkAllowed(what, hint) {
  if (!isOfflineMode()) return;
  throw new KordocError(
    `\uD3D0\uC1C4\uB9DD \uBAA8\uB4DC(KORDOC_OFFLINE)\uC5D0\uC11C \uCC28\uB2E8\uB428: ${what}` + (hint ? ` \u2014 ${hint}` : "")
  );
}
var TRUTHY;
var init_offline = __esm({
  "../../../../../../Desktop/hanmark-1.2.0/kordoc-main (1)/kordoc-main/src/shared/offline.ts"() {
    "use strict";
    init_utils();
    TRUTHY = /* @__PURE__ */ new Set(["1", "true", "yes", "on"]);
  }
});

// ../../../../../../Desktop/hanmark-1.2.0/kordoc-main (1)/kordoc-main/src/pdf/formula/model-partials.ts
import { createHash, randomUUID } from "node:crypto";
import { readFileSync, readlinkSync } from "node:fs";
import { readdir, unlink } from "node:fs/promises";
import { hostname } from "node:os";
import { basename, dirname, join } from "node:path";
function ownerScope() {
  if (scope) return scope;
  let namespace = "";
  if (process.platform === "linux") {
    try {
      const boot = readFileSync("/proc/sys/kernel/random/boot_id", "utf8").trim();
      if (!boot) throw new Error("Kernel boot identity unavailable");
      namespace = `${boot}:${readlinkSync("/proc/self/ns/pid")}`;
    } catch {
      namespace = randomUUID();
    }
  }
  scope = createHash("sha256").update(`${process.platform}\0${hostname()}\0${namespace}`).digest("hex").slice(0, 32);
  return scope;
}
function modelDownloadPartialPath(localPath) {
  return `${localPath}.kordoc-${ownerScope()}-${process.pid}-${randomUUID()}.part`;
}
async function cleanupModelDownloadPartials(localPath) {
  const dir = dirname(localPath);
  const prefix = `${basename(localPath)}.kordoc-${ownerScope()}-`;
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.startsWith(prefix)) continue;
    const match = /^([1-9]\d*)-([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\.part$/.exec(entry.name.slice(prefix.length));
    if (!match) continue;
    const pid = Number(match[1]);
    if (!Number.isSafeInteger(pid) || pid > 2147483647) continue;
    try {
      process.kill(pid, 0);
      continue;
    } catch (err) {
      if (err.code !== "ESRCH") continue;
    }
    try {
      await unlink(join(dir, entry.name));
    } catch {
    }
  }
}
var scope;
var init_model_partials = __esm({
  "../../../../../../Desktop/hanmark-1.2.0/kordoc-main (1)/kordoc-main/src/pdf/formula/model-partials.ts"() {
    "use strict";
  }
});

// ../../../../../../Desktop/hanmark-1.2.0/kordoc-main (1)/kordoc-main/src/pdf/formula/models.ts
var models_exports = {};
__export(models_exports, {
  ALL_FORMULA_MODELS: () => ALL_FORMULA_MODELS,
  MFD_MODEL: () => MFD_MODEL,
  MFR_DECODER_MODEL: () => MFR_DECODER_MODEL,
  MFR_ENCODER_MODEL: () => MFR_ENCODER_MODEL,
  MFR_TOKENIZER: () => MFR_TOKENIZER,
  ensureFormulaModels: () => ensureFormulaModels,
  ensureModelsIn: () => ensureModelsIn,
  ensureSingleModel: () => ensureSingleModel,
  getFormulaModelStatus: () => getFormulaModelStatus,
  getFormulaModelsDir: () => getFormulaModelsDir,
  getModelStatusIn: () => getModelStatusIn,
  getModelsDir: () => getModelsDir
});
import { createHash as createHash2 } from "crypto";
import { createReadStream } from "fs";
import { mkdir, stat, unlink as unlink2, rename } from "fs/promises";
import { createWriteStream } from "fs";
import { homedir } from "os";
import { join as join2, dirname as dirname2 } from "path";
import { pipeline } from "stream/promises";
import { Readable } from "stream";
function getModelsDir(subdir) {
  const override = process.env.KORDOC_MODEL_CACHE;
  if (override && override.trim()) {
    return join2(override, subdir);
  }
  return join2(homedir(), ".cache", "kordoc", "models", subdir);
}
function getFormulaModelsDir() {
  return getModelsDir("pix2text");
}
async function getModelStatusIn(dir, specs) {
  const result = [];
  for (const spec of specs) {
    const localPath = join2(dir, spec.filename);
    let exists = false;
    try {
      const s = await stat(localPath);
      exists = s.isFile() && s.size > 0;
    } catch {
      exists = false;
    }
    if (!exists) {
      result.push({ spec, localPath, exists: false, verified: false });
      continue;
    }
    try {
      const actual = await sha256OfFile(localPath);
      if (actual === spec.sha256) {
        result.push({ spec, localPath, exists: true, verified: true });
      } else {
        result.push({
          spec,
          localPath,
          exists: true,
          verified: false,
          invalidReason: `SHA256 mismatch: expected ${spec.sha256}, got ${actual}`
        });
      }
    } catch (e) {
      result.push({
        spec,
        localPath,
        exists: true,
        verified: false,
        invalidReason: `SHA compute failed: ${e.message}`
      });
    }
  }
  return result;
}
async function getFormulaModelStatus() {
  return getModelStatusIn(getFormulaModelsDir(), ALL_FORMULA_MODELS);
}
async function ensureModelsIn(dir, specs, onProgress) {
  await mkdir(dir, { recursive: true });
  for (const spec of specs) {
    const localPath = join2(dir, spec.filename);
    await cleanupModelDownloadPartials(localPath);
    if (await isExistingValid(localPath, spec.sha256)) {
      onProgress?.({
        spec,
        downloaded: 0,
        total: null,
        phase: "skip",
        message: "\uC774\uBBF8 \uC874\uC7AC + SHA \uC77C\uCE58"
      });
      continue;
    }
    await downloadToFile(spec, localPath, onProgress);
  }
}
async function ensureFormulaModels(onProgress) {
  return ensureModelsIn(getFormulaModelsDir(), ALL_FORMULA_MODELS, onProgress);
}
async function ensureSingleModel(spec, onProgress) {
  const dir = getFormulaModelsDir();
  await mkdir(dir, { recursive: true });
  const localPath = join2(dir, spec.filename);
  await cleanupModelDownloadPartials(localPath);
  if (await isExistingValid(localPath, spec.sha256)) {
    onProgress?.({ spec, downloaded: 0, total: null, phase: "skip" });
    return;
  }
  await downloadToFile(spec, localPath, onProgress);
}
async function isExistingValid(localPath, sha256Expected) {
  try {
    const s = await stat(localPath);
    if (!s.isFile() || s.size === 0) return false;
  } catch {
    return false;
  }
  try {
    const actual = await sha256OfFile(localPath);
    return actual === sha256Expected;
  } catch {
    return false;
  }
}
async function downloadToFile(spec, localPath, onProgress) {
  assertNetworkAllowed(
    `${spec.name} \uBAA8\uB378 \uB2E4\uC6B4\uB85C\uB4DC`,
    "\uC628\uB77C\uC778 PC\uC5D0\uC11C `kordoc models --export <\uB514\uB809\uD1A0\uB9AC>` \uB85C \uB0B4\uBCF4\uB0B8 \uB4A4 \uC774 PC\uC5D0\uC11C `kordoc models --import <\uB514\uB809\uD1A0\uB9AC>` \uD558\uAC70\uB098, KORDOC_MODEL_CACHE \uB85C \uBAA8\uB378 \uCE90\uC2DC \uACBD\uB85C\uB97C \uC9C0\uC815\uD558\uC138\uC694"
  );
  const partPath = modelDownloadPartialPath(localPath);
  await mkdir(dirname2(localPath), { recursive: true });
  try {
    const resp = await fetch(spec.url, {
      headers: {
        // HF CDN 은 UA 없으면 가끔 403 을 뱉는다
        "User-Agent": "kordoc-formula-ocr/1.0 (+https://github.com/chrisryugj/kordoc)"
      }
    });
    if (!resp.ok || !resp.body) {
      throw new Error(
        `${spec.name} \uB2E4\uC6B4\uB85C\uB4DC \uC2E4\uD328: HTTP ${resp.status} ${resp.statusText} (${spec.url})`
      );
    }
    const lenHeader = resp.headers.get("content-length");
    const total = lenHeader ? Number.parseInt(lenHeader, 10) : null;
    let downloaded = 0;
    const ws = createWriteStream(partPath);
    try {
      const reader = Readable.fromWeb(resp.body);
      reader.on("data", (chunk) => {
        downloaded += chunk.length;
        onProgress?.({
          spec,
          downloaded,
          total,
          phase: "download"
        });
      });
      await pipeline(reader, ws);
    } catch (e) {
      throw new Error(`${spec.name} \uC2A4\uD2B8\uB9AC\uBC0D \uC2E4\uD328: ${e.message}`);
    }
    onProgress?.({
      spec,
      downloaded,
      total,
      phase: "verify"
    });
    let actual;
    try {
      actual = await sha256OfFile(partPath);
    } catch (e) {
      throw new Error(`${spec.name} SHA \uACC4\uC0B0 \uC2E4\uD328: ${e.message}`);
    }
    if (actual !== spec.sha256) {
      throw new Error(
        `${spec.name} SHA256 mismatch: expected ${spec.sha256}, got ${actual} \u2014 \uBAA8\uB378 URL \uC774 \uC624\uC5FC\uB418\uC5C8\uAC70\uB098 \uC804\uC1A1 \uC911 \uC190\uC0C1\uB418\uC5C8\uC2B5\uB2C8\uB2E4.`
      );
    }
    await rename(partPath, localPath);
    onProgress?.({
      spec,
      downloaded,
      total,
      phase: "done"
    });
  } finally {
    try {
      await unlink2(partPath);
    } catch {
    }
  }
}
async function sha256OfFile(p) {
  const h = createHash2("sha256");
  const stream = createReadStream(p);
  await pipeline(stream, async function* (src) {
    for await (const chunk of src) {
      h.update(chunk);
    }
  });
  return h.digest("hex");
}
var MFD_MODEL, MFR_ENCODER_MODEL, MFR_DECODER_MODEL, MFR_TOKENIZER, ALL_FORMULA_MODELS;
var init_models = __esm({
  "../../../../../../Desktop/hanmark-1.2.0/kordoc-main (1)/kordoc-main/src/pdf/formula/models.ts"() {
    "use strict";
    init_offline();
    init_model_partials();
    MFD_MODEL = {
      name: "Pix2Text MFD",
      filename: "mfd.onnx",
      url: "https://huggingface.co/breezedeus/pix2text-mfd/resolve/main/mfd-v20240618.onnx",
      sha256: "51a8854743b17ae654729af8db82a630c1ccfa06debf4856c8b28055f87d02c1",
      sizeMb: 42
    };
    MFR_ENCODER_MODEL = {
      name: "Pix2Text MFR encoder",
      filename: "encoder_model.onnx",
      url: "https://huggingface.co/breezedeus/pix2text-mfr/resolve/main/encoder_model.onnx",
      sha256: "bd8d5c322792e9ec45793af5569e9748f82a3d728a9e00213dbfc56c1486f37d",
      sizeMb: 87
    };
    MFR_DECODER_MODEL = {
      name: "Pix2Text MFR decoder",
      filename: "decoder_model.onnx",
      url: "https://huggingface.co/breezedeus/pix2text-mfr/resolve/main/decoder_model.onnx",
      sha256: "fd0f92d7a012f3dae41e1ac79421aea0ea888b5a66cb3f9a004e424f82f3daed",
      sizeMb: 30
    };
    MFR_TOKENIZER = {
      name: "Pix2Text MFR tokenizer",
      filename: "tokenizer.json",
      url: "https://huggingface.co/breezedeus/pix2text-mfr/resolve/main/tokenizer.json",
      sha256: "3e2ab757277d22639bec28c9d7972e352d3d1dba223051fa674002dc5ab64df3",
      sizeMb: 1
    };
    ALL_FORMULA_MODELS = [
      MFD_MODEL,
      MFR_ENCODER_MODEL,
      MFR_DECODER_MODEL,
      MFR_TOKENIZER
    ];
  }
});

// ../../../../../../Desktop/hanmark-1.2.0/kordoc-main (1)/kordoc-main/src/ocr/models.ts
var models_exports2 = {};
__export(models_exports2, {
  ALL_OCR_MODELS: () => ALL_OCR_MODELS,
  OCR_DET_MODEL: () => OCR_DET_MODEL,
  OCR_REC_DICT: () => OCR_REC_DICT,
  OCR_REC_MODEL: () => OCR_REC_MODEL,
  ensureOcrModels: () => ensureOcrModels,
  getOcrModelStatus: () => getOcrModelStatus,
  getOcrModelsDir: () => getOcrModelsDir,
  ocrModelPath: () => ocrModelPath,
  ocrModelsCached: () => ocrModelsCached,
  parseCharacterDict: () => parseCharacterDict
});
import { join as join3 } from "path";
import { stat as stat2 } from "fs/promises";
function getOcrModelsDir() {
  return getModelsDir("ppocr");
}
async function ensureOcrModels(onProgress) {
  return ensureModelsIn(getOcrModelsDir(), ALL_OCR_MODELS, onProgress);
}
async function getOcrModelStatus() {
  return getModelStatusIn(getOcrModelsDir(), ALL_OCR_MODELS);
}
async function ocrModelsCached() {
  const dir = getOcrModelsDir();
  for (const spec of ALL_OCR_MODELS) {
    try {
      if (!(await stat2(join3(dir, spec.filename))).size) return false;
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
function ocrModelPath(spec) {
  return join3(getOcrModelsDir(), spec.filename);
}
var OCR_DET_MODEL, OCR_REC_MODEL, OCR_REC_DICT, ALL_OCR_MODELS;
var init_models2 = __esm({
  "../../../../../../Desktop/hanmark-1.2.0/kordoc-main (1)/kordoc-main/src/ocr/models.ts"() {
    "use strict";
    init_models();
    OCR_DET_MODEL = {
      name: "PP-OCRv5 mobile det",
      filename: "det.onnx",
      url: "https://huggingface.co/PaddlePaddle/PP-OCRv5_mobile_det_onnx/resolve/main/inference.onnx",
      sha256: "a431985659dc921974177a95adcfbb90fd9e51989a5e04d70d0b75f597b6e61d",
      sizeMb: 5
    };
    OCR_REC_MODEL = {
      name: "PP-OCRv5 korean rec",
      filename: "rec_korean.onnx",
      url: "https://huggingface.co/PaddlePaddle/korean_PP-OCRv5_mobile_rec_onnx/resolve/main/inference.onnx",
      sha256: "92f0b7785e64fc9090106a241cf4c1eb97472824558272751b88a2a4476d3a08",
      sizeMb: 13
    };
    OCR_REC_DICT = {
      name: "PP-OCRv5 korean dict",
      filename: "rec_korean.yml",
      url: "https://huggingface.co/PaddlePaddle/korean_PP-OCRv5_mobile_rec_onnx/resolve/main/inference.yml",
      sha256: "f757fa1c40e99edcf27e9cce879b93eb2a51fa46f5ef39095689b8c37dd75998",
      sizeMb: 1
    };
    ALL_OCR_MODELS = [OCR_DET_MODEL, OCR_REC_MODEL, OCR_REC_DICT];
  }
});

// <stdin>
async function prepareModels(formula) {
  await (await Promise.resolve().then(() => (init_models2(), models_exports2))).ensureOcrModels();
  if (formula) await (await Promise.resolve().then(() => (init_models(), models_exports))).ensureFormulaModels();
}
export {
  prepareModels
};
