#!/usr/bin/env node
import {createRequire as __coreCreateRequire} from "node:module"; const require=__coreCreateRequire(import.meta.url); import {extensionUrl as __extensionUrl,extensionPath as __extensionPath} from "./extensions.mjs";
import {
  ENGINE,
  adaptTables,
  analyzeTemplate,
  applyDocumentStyleToHwpx,
  artifact,
  blocksToChunks,
  cleanJson,
  compare,
  extractClickHereFields,
  extractFormFields,
  extractFormSchema,
  extractRenderedRegions,
  extractTables,
  fail,
  fillFormFields,
  fillHwpx,
  fillWithUniqueGuard,
  gongmunStyleFromDocument,
  inputBytes,
  lintGongmunText,
  lintMuncheText,
  loadPack,
  markdownToHwpx,
  normalizeGongmunPreset,
  parse,
  patchHwp,
  patchHwpx,
  placeSealHwpx,
  readBuiltinTemplate,
  redactMarkdown,
  renderDocument,
  require_lib,
  resolveBuiltinTemplate,
  sha256,
  takeWarnings,
  toArray,
  validateHwpx,
  warn
} from "./chunk-NVQKGGHQ.mjs";
import "./chunk-VJBJ2GTC.mjs";
import "./chunk-WT3MK4B4.mjs";
import {
  blocksToMarkdown
} from "./chunk-HW7SKSEC.mjs";
import {
  VERSION
} from "./chunk-PZTNOUTU.mjs";
import {
  __toESM
} from "./chunk-3T6O35FL.mjs";

// skill/kordoc-workbench/scripts/run.mjs
import { readFile, mkdir, realpath } from "node:fs/promises";
import { resolve, basename, extname } from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";
import { AsyncLocalStorage } from "node:async_hooks";

// skill/kordoc-workbench/scripts/vendor/hwpxPostProcess.mjs
var import_jszip = __toESM(require_lib(), 1);
var t = (key, vars) => key + (vars ? " " + JSON.stringify(vars) : "");
var HWPX_FIXED_ENTRY_DATE = new Date(Date.UTC(1980, 0, 1, 0, 0, 0));
var FOOTNOTE_ELEMENT = /<hp:footNote\s[^>]*>[\s\S]*?<\/hp:footNote>/g;
var FOOTNOTE_NUMBER = /^<hp:footNote\s[^>]*\bnumber="(\d+)"/;
var FIRST_NOTE_PARAGRAPH = /(<hp:subList\b[^>]*>\s*<hp:p\b[^>]*>)/;
var FIRST_RUN_CHAR_PR = /<hp:run\s[^>]*\bcharPrIDRef="(\d+)"/;
function addFootnoteAutoNumbers(sectionXml) {
  let added = 0;
  const xml = sectionXml.replace(FOOTNOTE_ELEMENT, (note) => {
    if (/<hp:autoNum\b[^>]*\bnumType="FOOTNOTE"/.test(note)) return note;
    const number = note.match(FOOTNOTE_NUMBER)?.[1];
    const paragraph = note.match(FIRST_NOTE_PARAGRAPH);
    if (!number || !paragraph || paragraph.index === void 0) return note;
    const afterParagraph = note.slice(paragraph.index + paragraph[0].length);
    const charPr = afterParagraph.match(FIRST_RUN_CHAR_PR)?.[1] ?? "0";
    const autoNum = `<hp:run charPrIDRef="${charPr}"><hp:ctrl><hp:autoNum num="${number}" numType="FOOTNOTE"><hp:autoNumFormat type="DIGIT" userChar="" prefixChar="" suffixChar=")" supscript="0"/></hp:autoNum></hp:ctrl><hp:t> </hp:t></hp:run>`;
    added += 1;
    const insertAt = paragraph.index + paragraph[0].length;
    return note.slice(0, insertAt) + autoNum + note.slice(insertAt);
  });
  return { xml, added };
}
function repeatTableHeaderRows(sectionXml) {
  let changed = 0;
  let output = "";
  let cursor = 0;
  const openTag = /<hp:tbl\s[^>]*>/g;
  for (const match of sectionXml.matchAll(openTag)) {
    const start = match.index ?? 0;
    if (start < cursor) continue;
    const tag = match[0];
    if (!/\brepeatHeader="0"/.test(tag)) continue;
    const bodyStart = start + tag.length;
    const firstRowEnd = sectionXml.indexOf("</hp:tr>", bodyStart);
    const nestedTable = sectionXml.indexOf("<hp:tbl", bodyStart);
    const firstRow = sectionXml.slice(
      bodyStart,
      firstRowEnd === -1 ? bodyStart : nestedTable !== -1 && nestedTable < firstRowEnd ? nestedTable : firstRowEnd
    );
    if (!/<hp:tc\s[^>]*\bheader="1"/.test(firstRow)) continue;
    output += sectionXml.slice(cursor, start) + tag.replace('repeatHeader="0"', 'repeatHeader="1"');
    cursor = bodyStart;
    changed += 1;
  }
  output += sectionXml.slice(cursor);
  return { xml: output, changed };
}
var SECTION_ENTRY = /^Contents\/section\d+\.xml$/;
async function finalizeHwpxPackage(input, options = {}) {
  const source = await import_jszip.default.loadAsync(input);
  const output = new import_jszip.default();
  let footnoteNumbersAdded = 0;
  let headerRowsRepeated = 0;
  const mimetype = source.file("mimetype");
  if (!mimetype) throw new Error(t("hwpx.packageMissingMimetype"));
  output.file("mimetype", await mimetype.async("uint8array"), {
    compression: "STORE",
    date: HWPX_FIXED_ENTRY_DATE,
    createFolders: false
  });
  const entries = [];
  source.forEach((name, entry) => {
    if (name !== "mimetype") entries.push({ name, dir: entry.dir });
  });
  for (const { name, dir } of entries) {
    if (dir) {
      output.file(name, null, { dir: true, date: HWPX_FIXED_ENTRY_DATE });
      continue;
    }
    const entry = source.file(name);
    if (!entry) continue;
    if (SECTION_ENTRY.test(name) && (options.footnoteAutoNumbers || options.repeatHeaderRows)) {
      let xml = await entry.async("text");
      if (options.footnoteAutoNumbers) {
        const numbered = addFootnoteAutoNumbers(xml);
        xml = numbered.xml;
        footnoteNumbersAdded += numbered.added;
      }
      if (options.repeatHeaderRows) {
        const repeated = repeatTableHeaderRows(xml);
        xml = repeated.xml;
        headerRowsRepeated += repeated.changed;
      }
      output.file(name, xml, { date: HWPX_FIXED_ENTRY_DATE, createFolders: false });
    } else {
      output.file(name, await entry.async("uint8array"), { date: HWPX_FIXED_ENTRY_DATE, createFolders: false });
    }
  }
  const data = await output.generateAsync({ type: "arraybuffer" });
  return { data, footnoteNumbersAdded, headerRowsRepeated };
}

// skill/kordoc-workbench/scripts/run.mjs
import { capabilities, prepare } from "./extensions.mjs";
process.env.ORT_DISABLE_TELEMETRY = "1";
var parseOptions = { layoutTables: "keep", keepTrailingEmptyCols: true };
var engineWarningScope = new AsyncLocalStorage();
var originalWarn = console.warn.bind(console);
console.warn = (...args) => {
  const ctx = engineWarningScope.getStore(), message = args.map(String).join(" ");
  if (ctx && message.startsWith("[kordoc] format profile:")) warn(ctx, "TABLE_PROFILE_UNAPPLIED", message, true);
  originalWarn(...args);
};
async function parse2(req, ctx, extra = {}) {
  const r = await parse(await ctx.read(req.input), { ...req.options, ...extra });
  if (!r.success) fail(r.code || "PARSE_ERROR", r.error, r);
  takeWarnings(ctx, r.warnings);
  return r;
}
async function hwpxArtifact(ctx, name, data) {
  const finalized = await finalizeHwpxPackage(toArray(Buffer.from(data)), { footnoteAutoNumbers: true, repeatHeaderRows: true });
  const v = await validateHwpx(finalized.data);
  if (!v.ok) fail("INVALID_HWPX", "Generated HWPX failed structural validation", v);
  ctx.data = { ...ctx.data, validation: v };
  return artifact(ctx, name, Buffer.from(finalized.data), "application/hwp+zip");
}
async function generation(req, ctx) {
  const pack = req.template ? await loadPack(req.template) : void 0;
  let markdown = req.markdown ?? (req.markdownFile ? await readFile(req.markdownFile, "utf8") : pack?.markdownSkeleton);
  if (typeof markdown !== "string" || !markdown.trim()) fail("EMPTY_INPUT", "Markdown required");
  const options = structuredClone(req.options || {});
  if (pack?.gongmun) options.gongmun = { ...gongmunStyleFromDocument(pack.documentStyle), ...pack.gongmun, ...options.gongmun };
  if (options.gongmun && options.gongmun.cover !== false && (["gaejosik", "ministry", "bangchim"].includes(normalizeGongmunPreset(options.gongmun.preset)) || options.gongmun.cover)) {
    const c = typeof options.gongmun.cover === "object" ? options.gongmun.cover : {};
    if (!c.date && !req.frozenDate) fail("FROZEN_DATE_REQUIRED", "Set frozenDate or gongmun.cover.date for deterministic cover");
    if (!c.date) c.date = req.frozenDate;
    options.gongmun.cover = c;
  }
  const images = {};
  for (const a of pack?.assets || []) images[a.name] = Buffer.from(a.base64, "base64");
  for (const [name, path] of Object.entries(req.images || {})) images[name] = await ctx.read(path);
  options.images = images;
  options.warnings = [];
  if (pack) options.profile = await adaptTables(pack, markdown, options, ctx);
  for (const m of markdown.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)) if (!m[1].startsWith("data:") && !images[m[1]]) fail("MISSING_ASSET", "Image missing: " + m[1]);
  let data = await engineWarningScope.run(ctx, () => markdownToHwpx(markdown, options));
  takeWarnings(ctx, options.warnings);
  if (pack?.documentStyle && !options.gongmun) data = (await applyDocumentStyleToHwpx(data, pack.documentStyle)).data;
  if (pack?.documentStyle?.roles?.quote?.character && /^\s*>/m.test(markdown)) warn(ctx, "QUOTE_STYLE_REVIEW_REQUIRED", "Quote character style may differ from the requested role in this engine/profile adapter; verify the rendered paragraph.", true);
  if (pack?.documentStyle && options.gongmun) warn(ctx, "OFFICIAL_STYLE_SUBSET", "Official document uses font/size/spacing/margin mapping; other extracted roles require visual review", true);
  ctx.data = { frozenMarkdownSha256: sha256(markdown), templateHash: pack?.contentHash, options: cleanJson({ ...options, images: Object.keys(images) }) };
  await hwpxArtifact(ctx, req.outputName || "document.hwpx", data);
  await artifact(ctx, "frozen.md", markdown, "text/markdown");
}
async function dispatch(req, ctx) {
  switch (req.mode) {
    case "capabilities":
      ctx.data = await capabilities();
      break;
    case "read":
    case "ocr": {
      const r = await parse2(req, ctx, req.mode === "ocr" ? { ocr: req.options?.ocr || "force", formulaOcr: req.options?.formulaOcr || false } : {});
      ctx.data = cleanJson({ ...r, chunks: req.chunks ? blocksToChunks(r.blocks, req.chunkOptions) : void 0 });
      await artifact(ctx, "document.md", r.markdown, "text/markdown");
      await artifact(ctx, "document.json", JSON.stringify(ctx.data, null, 2), "application/json");
      break;
    }
    case "generate":
    case "template-apply":
      await generation(req, ctx);
      break;
    case "template-analyze":
      await analyzeTemplate(req, ctx);
      break;
    case "template-register": {
      if (process.env.KORDOC_WEB === "1") fail("LOCAL_ADDON_ONLY", "HanMark registration runs only in local installations");
      const { queueTemplate } = await import("./hanmark-FAJO3LAV.mjs");
      ctx.data = await queueTemplate(req.template, req.options);
      if (ctx.data.status === "pending") warn(ctx, "HANMARK_PENDING", ctx.data.reason || "Awaiting receiver acknowledgment", true);
      if (ctx.data.status === "incompatible") fail("HANMARK_INCOMPATIBLE", ctx.data.reason);
      break;
    }
    case "form-analyze": {
      const r = await parse2(req, ctx, parseOptions);
      ctx.data = { fields: extractFormFields(r.blocks), schema: extractFormSchema(r.blocks), clickHere: r.fileType === "hwpx" ? await extractClickHereFields(toArray(await ctx.read(req.input))) : [] };
      await artifact(ctx, "fields.json", JSON.stringify(ctx.data, null, 2), "application/json");
      break;
    }
    case "fill": {
      if (!req.values || typeof req.values !== "object") fail("INVALID_REQUEST", "values required");
      const buf = req.builtin ? readBuiltinTemplate(resolveBuiltinTemplate(req.builtin) || fail("UNKNOWN_TEMPLATE", "Unknown built-in form")) : toArray(await ctx.read(req.input));
      const format = req.format || "hwpx-preserve";
      let result, output;
      if (format === "hwpx-preserve") {
        result = req.requireUnique ? await fillWithUniqueGuard(req.values, (v, blocked) => fillHwpx(buf, v, blocked)) : await fillHwpx(buf, req.values);
        output = result.buffer;
      } else {
        const parsed = await parse(Buffer.from(buf), parseOptions);
        if (!parsed.success) fail(parsed.code || "PARSE_ERROR", parsed.error);
        takeWarnings(ctx, parsed.warnings);
        result = req.requireUnique ? await fillWithUniqueGuard(req.values, (v, blocked) => fillFormFields(parsed.blocks, v, blocked)) : fillFormFields(parsed.blocks, req.values);
        output = blocksToMarkdown(result.blocks);
        if (format === "hwpx") output = await markdownToHwpx(output);
        else if (format !== "markdown") fail("INVALID_REQUEST", "Unknown fill format");
      }
      ctx.skipped.fields = [.../* @__PURE__ */ new Set([...result.unmatched || [], ...result.rejected || []])];
      takeWarnings(ctx, result.warnings);
      if (ctx.skipped.fields.length) ctx.partial = true;
      ctx.data = { filled: result.filled, unmatched: result.unmatched || [], rejected: result.rejected || [] };
      if (format === "markdown") await artifact(ctx, req.outputName || "filled.md", output, "text/markdown");
      else {
        const v = await validateHwpx(output);
        if (!v.ok) fail("INVALID_HWPX", "Filled document invalid", v);
        ctx.data.validation = v;
        await artifact(ctx, req.outputName || "filled.hwpx", Buffer.from(output), "application/hwp+zip");
      }
      break;
    }
    case "patch": {
      const buf = await ctx.read(req.input), r = await parse(buf, parseOptions);
      if (!r.success) fail(r.code || "PARSE_ERROR", r.error);
      const md = req.markdown ?? await readFile(req.markdownFile, "utf8");
      if (!["hwpx", "hwp"].includes(r.fileType)) fail("UNSUPPORTED_FORMAT", "Only HWP5/HWPX patch supported");
      const patched = await (r.fileType === "hwpx" ? patchHwpx : patchHwp)(buf, md, { verify: true });
      ctx.skipped.edits = patched.skipped || [];
      if (ctx.skipped.edits.length) ctx.partial = true;
      if (!patched.success || !patched.data) fail("PATCH_FAILED", patched.error || "Patch failed", cleanJson(patched));
      ctx.data = { applied: patched.applied, verification: patched.verification };
      if (patched.verification && ["modified", "added", "removed"].some((x) => patched.verification.summary?.[x] > 0)) ctx.partial = true;
      await artifact(ctx, req.outputName || "patched." + r.fileType, patched.data, r.fileType === "hwpx" ? "application/hwp+zip" : "application/x-hwp");
      break;
    }
    case "compare": {
      const a = await ctx.read(req.input), b = await ctx.read(req.other);
      const diff = await compare(toArray(a), toArray(b), req.options);
      ctx.data = diff;
      await artifact(ctx, "comparison.json", JSON.stringify(diff, null, 2), "application/json");
      const esc = (x) => String(x ?? "").replaceAll("|", "\\|").replaceAll("\n", "<br>");
      const rows = (diff.diffs || []).map((d) => "| " + [d.type, typeof d.before === "object" ? JSON.stringify(d.before) : d.before, typeof d.after === "object" ? JSON.stringify(d.after) : d.after].map(esc).join(" | ") + " |");
      await artifact(ctx, "comparison.md", ["| \uBCC0\uACBD | \uC774\uC804 | \uC774\uD6C4 |", "| --- | --- | --- |", ...rows].join("\n"), "text/markdown");
      break;
    }
    case "validate": {
      const v = await validateHwpx(await ctx.read(req.input));
      ctx.data = v;
      if (!v.ok) fail("INVALID_HWPX", "Invalid HWPX", v);
      break;
    }
    case "lint": {
      const text = req.markdown ?? (await parse2(req, ctx)).markdown;
      ctx.data = { gongmun: lintGongmunText(text), munche: lintMuncheText(text) };
      break;
    }
    case "render": {
      const r = await renderDocument(await ctx.read(req.input), { ...req.options, format: req.format || "svg", browserExecutablePath: process.env.PUPPETEER_EXECUTABLE_PATH });
      ctx.data = cleanJson(r.scene);
      takeWarnings(ctx, r.scene.warnings);
      for (const [i, a] of r.assets.entries()) await artifact(ctx, "preview-" + (a.page ?? i + 1) + "." + a.format, a.data, a.mimeType);
      break;
    }
    case "crop": {
      const list = await extractRenderedRegions(await ctx.read(req.input), req.options);
      ctx.data = [];
      for (const [i, a] of list.entries()) {
        const file = await artifact(ctx, "region-" + (i + 1) + "." + (a.mimeType.endsWith("jpeg") ? "jpg" : "png"), a.data, a.mimeType);
        ctx.data.push({ ...a, data: void 0, file });
      }
      break;
    }
    case "tables": {
      const list = await extractTables(await ctx.read(req.input), req.options);
      ctx.data = [];
      for (const [i, t2] of list.entries()) {
        takeWarnings(ctx, t2.warnings);
        const crops = [];
        for (const [j, c] of t2.crops.entries()) crops.push({ ...c, data: void 0, file: await artifact(ctx, "table-" + (i + 1) + "-" + (j + 1) + "." + (c.mimeType.endsWith("jpeg") ? "jpg" : "png"), c.data, c.mimeType) });
        ctx.data.push({ ...t2, crops });
      }
      await artifact(ctx, "tables.json", JSON.stringify(cleanJson(ctx.data), null, 2), "application/json");
      break;
    }
    case "redact": {
      const original = await ctx.read(req.input), r = await parse2(req, ctx, parseOptions);
      const masked = redactMarkdown(r.markdown, req.options);
      let output, ext;
      if (["hwpx", "hwp"].includes(r.fileType)) {
        const patch = await (r.fileType === "hwpx" ? patchHwpx : patchHwp)(original, masked.text, { verify: true });
        if (!patch.success || !patch.data) fail("REDACTION_FAILED", patch.error || "Patch failed");
        ctx.skipped.edits = patch.skipped;
        output = patch.data;
        ext = r.fileType;
        if (patch.skipped.length) ctx.partial = true;
        const checked = await parse(output, parseOptions);
        if (!checked.success) fail("REDACTION_VERIFY_FAILED", checked.error);
        const residual = redactMarkdown(checked.markdown, req.options).hits;
        if (residual.length) fail("PII_REMAINS", "Detected PII remains; masked output was not published", { residualCount: residual.length, skipped: patch.skipped });
      } else {
        output = masked.text;
        ext = "md";
      }
      ctx.data = { hits: masked.hits, residualTextHits: 0, imageCoverage: "not-inspected" };
      if (r.images?.length) warn(ctx, "IMAGE_PII_UNINSPECTED", "Text masking does not remove PII inside images", true);
      await artifact(ctx, req.outputName || "masked." + ext, output, ext === "md" ? "text/markdown" : "application/octet-stream");
      break;
    }
    case "seal": {
      const ops = [];
      for (const op of req.operations || []) ops.push({ ...op, image: await ctx.read(op.image) });
      if (!ops.length) fail("INVALID_REQUEST", "Seal operations required");
      const r = await placeSealHwpx(toArray(await ctx.read(req.input)), ops);
      ctx.data = { placed: r.placed };
      for (const p of r.placed) takeWarnings(ctx, p.warnings);
      const v = await validateHwpx(r.buffer);
      if (!v.ok) fail("INVALID_HWPX", "Sealed document invalid", v);
      await artifact(ctx, req.outputName || "sealed.hwpx", Buffer.from(r.buffer), "application/hwp+zip");
      break;
    }
    case "probe": {
      const checks = {};
      for (const name of ["sharp", "onnxruntime-node", "pdfjs-dist/legacy/build/pdf.mjs", "@hyzyla/pdfium", "@huggingface/transformers", "puppeteer-core"]) {
        try {
          const m = await import(name);
          checks[name] = { ok: true };
          if (name === "sharp") checks[name].version = m.default.versions.vips;
          if (name === "onnxruntime-node") checks[name].backends = m.listSupportedBackends?.();
        } catch (e) {
          checks[name] = { ok: false, error: e.message };
          ctx.partial = true;
        }
      }
      ctx.data = { platform: process.platform, arch: process.arch, node: process.version, checks, offline: process.env.KORDOC_OFFLINE, modelCache: process.env.KORDOC_MODEL_CACHE };
      break;
    }
    default:
      fail("UNKNOWN_MODE", "Unsupported mode: " + req.mode);
  }
}
async function execute(req) {
  const ctx = { outputDir: resolve(req?.outputDir || "outputs/" + randomUUID()), files: [], warnings: [], skipped: { edits: [], fields: [] }, partial: false, read: inputBytes, data: void 0 };
  const base = { schemaVersion: 1, jobId: req?.jobId || randomUUID(), engine: ENGINE };
  const priorOffline = process.env.KORDOC_OFFLINE;
  try {
    if (VERSION !== ENGINE.version) fail("ENGINE_VERSION_MISMATCH", "Expected " + ENGINE.version + ", got " + VERSION);
    if (!req || req.schemaVersion !== 1 || typeof req.mode !== "string") fail("INVALID_REQUEST", "schemaVersion:1 and mode required");
    if (req.mode !== "capabilities" && req.mode !== "probe") base.runtime = await prepare(req);
    if (req.mode !== "capabilities") process.env.KORDOC_OFFLINE = "1";
    await dispatch(req, ctx);
    return { ...base, status: ctx.partial ? "partial" : "success", success: !ctx.partial, files: ctx.files, warnings: ctx.warnings, skipped: ctx.skipped, data: cleanJson(ctx.data), failure: null };
  } catch (e) {
    return { ...base, status: "failed", success: false, files: ctx.files, warnings: ctx.warnings, skipped: ctx.skipped, failure: { code: e.code === "EEXIST" ? "OUTPUT_CONFLICT" : e.code === "ENOENT" ? "FILE_NOT_FOUND" : ["ERR_MODULE_NOT_FOUND", "MODULE_NOT_FOUND", "ERR_DLOPEN_FAILED"].includes(e.code) ? "MISSING_DEPENDENCY" : e.code || "EXECUTION_ERROR", message: e.message, details: cleanJson(e.details) }, data: cleanJson(ctx.data) };
  } finally {
    if (priorOffline === void 0) delete process.env.KORDOC_OFFLINE;
    else process.env.KORDOC_OFFLINE = priorOffline;
  }
}
async function runRequest(req) {
  if (req.mode === "batch") {
    if (!Array.isArray(req.jobs) || req.jobs.length > 100) fail("INVALID_BATCH", "batch.jobs must contain at most 100 jobs");
    const results = [];
    for (const [i, j] of req.jobs.entries()) results.push(await execute({ ...j, schemaVersion: 1, outputDir: j.outputDir || resolve(req.outputDir || "outputs", "job-" + (i + 1)) }));
    return { schemaVersion: 1, engine: ENGINE, status: results.every((r) => r.success) ? "success" : results.every((r) => r.status === "failed") ? "failed" : "partial", success: results.every((r) => r.success), results };
  }
  return execute(req);
}
if (process.argv[1] && await realpath(resolve(process.argv[1])).catch(() => null) === await realpath(fileURLToPath(import.meta.url))) {
  console.log = (...args) => console.error(...args);
  console.info = (...args) => console.error(...args);
  try {
    const text = process.argv[2] ? await readFile(process.argv[2], "utf8") : await new Promise((yes, no) => {
      let s = "";
      process.stdin.setEncoding("utf8");
      process.stdin.on("data", (x) => s += x);
      process.stdin.on("end", () => yes(s));
      process.stdin.on("error", no);
    });
    const result = await runRequest(JSON.parse(text));
    process.stdout.write(JSON.stringify(result, null, 2) + "\n");
    process.exitCode = result.status === "failed" ? 1 : result.status === "partial" ? 2 : 0;
  } catch (e) {
    process.stdout.write(JSON.stringify({ schemaVersion: 1, status: "failed", success: false, engine: ENGINE, files: [], warnings: [], skipped: { edits: [], fields: [] }, failure: { code: "INVALID_REQUEST", message: e.message } }) + "\n");
    process.exitCode = 1;
  }
}
export {
  execute,
  runRequest
};
