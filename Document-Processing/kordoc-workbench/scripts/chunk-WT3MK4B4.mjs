import {createRequire as __coreCreateRequire} from "node:module"; const require=__coreCreateRequire(import.meta.url); import {extensionUrl as __extensionUrl,extensionPath as __extensionPath} from "./extensions.mjs";

// node_modules/kordoc/dist/chunk-V4BH5SRQ.js
function parsePageRange(spec, maxPages) {
  const result = /* @__PURE__ */ new Set();
  if (maxPages <= 0) return result;
  if (Array.isArray(spec)) {
    for (const n of spec) {
      const page = Math.round(n);
      if (page >= 1 && page <= maxPages) result.add(page);
    }
    return result;
  }
  if (typeof spec !== "string" || spec.trim() === "") return result;
  const parts = spec.split(",");
  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const rangeMatch = trimmed.match(/^(\d+)\s*-\s*(\d+)$/);
    if (rangeMatch) {
      const start = Math.max(1, parseInt(rangeMatch[1], 10));
      const end = Math.min(maxPages, parseInt(rangeMatch[2], 10));
      for (let i = start; i <= end; i++) result.add(i);
    } else {
      const page = parseInt(trimmed, 10);
      if (!isNaN(page) && page >= 1 && page <= maxPages) result.add(page);
    }
  }
  return result;
}
function hasRequestedPagesAfter(spec, maxParsed, total) {
  if (total <= 0 || total <= maxParsed) return false;
  const beyond = (page) => page >= 1 && page <= total && page > maxParsed;
  if (Array.isArray(spec)) return spec.some((n) => beyond(Math.round(n)));
  if (typeof spec !== "string" || spec.trim() === "") return false;
  for (const part of spec.split(",")) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const rangeMatch = trimmed.match(/^(\d+)\s*-\s*(\d+)$/);
    if (rangeMatch) {
      const start = Math.max(1, parseInt(rangeMatch[1], 10), Math.floor(maxParsed) + 1);
      const end = Math.min(total, parseInt(rangeMatch[2], 10));
      if (start <= end) return true;
    } else if (beyond(parseInt(trimmed, 10))) return true;
  }
  return false;
}

export {
  parsePageRange,
  hasRequestedPagesAfter
};
