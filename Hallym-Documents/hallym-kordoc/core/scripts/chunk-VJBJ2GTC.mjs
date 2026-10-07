import {createRequire as __coreCreateRequire} from "node:module"; const require=__coreCreateRequire(import.meta.url); import {extensionUrl as __extensionUrl,extensionPath as __extensionPath} from "./extensions.mjs";
import {
  blocksToMarkdown
} from "./chunk-HW7SKSEC.mjs";

// node_modules/kordoc/dist/chunk-VDEENOPW.js
import { deflateSync } from "zlib";
function blocksToPages(blocks, render = blocksToMarkdown) {
  const firstNumbered = blocks.find((b) => typeof b.pageNumber === "number")?.pageNumber;
  if (firstNumbered === void 0) return void 0;
  const byPage = /* @__PURE__ */ new Map();
  let current = firstNumbered;
  for (const block of blocks) {
    if (typeof block.pageNumber === "number") current = block.pageNumber;
    const bucket = byPage.get(current);
    if (bucket) bucket.push(block);
    else byPage.set(current, [block]);
  }
  const numbers = [...byPage.keys()];
  const min = Math.min(...numbers);
  const max = Math.max(...numbers);
  const pages = [];
  for (let pageNumber = min; pageNumber <= max; pageNumber++) {
    const pageBlocks = byPage.get(pageNumber);
    pages.push({ pageNumber, markdown: pageBlocks ? render(pageBlocks) : "" });
  }
  return pages;
}
var CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 3988292384 ^ c >>> 1 : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
})();
function crc32(bytes) {
  let c = 4294967295;
  for (let i = 0; i < bytes.length; i++) {
    c = CRC_TABLE[(c ^ bytes[i]) & 255] ^ c >>> 8;
  }
  return (c ^ 4294967295) >>> 0;
}
var BI_RGB = 0;
var MAX_DIM = 32767;
var MAX_PIXELS = 36e6;
function bmpToPng(bmp) {
  if (bmp.length < 54) return null;
  if (bmp[0] !== 66 || bmp[1] !== 77) return null;
  const dv = new DataView(bmp.buffer, bmp.byteOffset, bmp.byteLength);
  const dataOffset = dv.getUint32(10, true);
  const headerSize = dv.getUint32(14, true);
  if (headerSize < 40) return null;
  const width = dv.getInt32(18, true);
  const rawHeight = dv.getInt32(22, true);
  const bitCount = dv.getUint16(28, true);
  const compression = dv.getUint32(30, true);
  if (compression !== BI_RGB) return null;
  if (bitCount !== 24 && bitCount !== 32) return null;
  if (width <= 0 || rawHeight === 0) return null;
  if (width > MAX_DIM || Math.abs(rawHeight) > MAX_DIM) return null;
  const topDown = rawHeight < 0;
  const height = Math.abs(rawHeight);
  if (width * height > MAX_PIXELS) return null;
  const bytesPerPixel = bitCount >> 3;
  const rowStride = width * bytesPerPixel + 3 & ~3;
  if (dataOffset + rowStride * height > bmp.length) return null;
  const rgba = new Uint8Array(width * height * 4);
  let anyAlpha = 0;
  for (let y = 0; y < height; y++) {
    const srcRow = topDown ? y : height - 1 - y;
    let src = dataOffset + srcRow * rowStride;
    let dst = y * width * 4;
    for (let x = 0; x < width; x++) {
      rgba[dst] = bmp[src + 2];
      rgba[dst + 1] = bmp[src + 1];
      rgba[dst + 2] = bmp[src];
      const a = bitCount === 32 ? bmp[src + 3] : 255;
      rgba[dst + 3] = a;
      anyAlpha |= a;
      src += bytesPerPixel;
      dst += 4;
    }
  }
  if (bitCount === 32 && anyAlpha === 0) {
    for (let i = 3; i < rgba.length; i += 4) rgba[i] = 255;
  }
  return encodePng(width, height, rgba);
}
var PNG_SIGNATURE = Uint8Array.of(137, 80, 78, 71, 13, 10, 26, 10);
function chunk(type, data) {
  const body = new Uint8Array(4 + data.length);
  body[0] = type.charCodeAt(0);
  body[1] = type.charCodeAt(1);
  body[2] = type.charCodeAt(2);
  body[3] = type.charCodeAt(3);
  body.set(data, 4);
  const out = new Uint8Array(8 + data.length + 4);
  const dv = new DataView(out.buffer);
  dv.setUint32(0, data.length, false);
  out.set(body, 4);
  dv.setUint32(8 + data.length, crc32(body), false);
  return out;
}
function encodePng(width, height, rgba) {
  const ihdr = new Uint8Array(13);
  const iv = new DataView(ihdr.buffer);
  iv.setUint32(0, width, false);
  iv.setUint32(4, height, false);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const stride = width * 4;
  const raw = new Uint8Array((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    const rowStart = y * (stride + 1);
    raw[rowStart] = 0;
    raw.set(rgba.subarray(y * stride, y * stride + stride), rowStart + 1);
  }
  const idat = deflateSync(raw);
  const ihdrChunk = chunk("IHDR", ihdr);
  const idatChunk = chunk("IDAT", idat);
  const iendChunk = chunk("IEND", new Uint8Array(0));
  const out = new Uint8Array(PNG_SIGNATURE.length + ihdrChunk.length + idatChunk.length + iendChunk.length);
  let o = 0;
  out.set(PNG_SIGNATURE, o);
  o += PNG_SIGNATURE.length;
  out.set(ihdrChunk, o);
  o += ihdrChunk.length;
  out.set(idatChunk, o);
  o += idatChunk.length;
  out.set(iendChunk, o);
  return out;
}
function inlineImagesIntoMarkdown(markdown, images, opts) {
  const compress = opts?.compress !== false;
  const uris = /* @__PURE__ */ new Map();
  for (const img of images) {
    let bytes = img.data;
    let mime = img.mimeType;
    if (compress && mime === "image/bmp") {
      const png = bmpToPng(img.data);
      if (png) {
        bytes = png;
        mime = "image/png";
      }
    }
    uris.set(img.filename, `data:${mime};base64,${Buffer.from(bytes).toString("base64")}`);
  }
  if (uris.size === 0) return markdown;
  let out = markdown.replace(/!\[image\]\((?:images\/)?([^()\s]+)\)/g, (m, name) => {
    const uri = uris.get(name);
    return uri !== void 0 ? `![image](${uri})` : m;
  });
  out = out.replace(/(<img\b[^>]*\bsrc=")(?:images\/)?([^"]*)(")/g, (m, pre, name, post) => {
    const uri = uris.get(name);
    return uri !== void 0 ? `${pre}${uri}${post}` : m;
  });
  return out;
}

export {
  blocksToPages,
  encodePng,
  inlineImagesIntoMarkdown
};
