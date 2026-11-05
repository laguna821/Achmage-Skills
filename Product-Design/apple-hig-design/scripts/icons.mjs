#!/usr/bin/env node
// icons.mjs - normalize, check, preview and fetch SVG icons for the Apple-style icon spec
// (skill/apple-hig-design/references/icons.md). Node 18+, no dependencies.
// SVGs are handled with regex/string parsing, so it targets simple icon files, not arbitrary SVG.

import fs from 'node:fs';
import path from 'node:path';

const LUCIDE_VERSION = '1.67.0';
const PRETENDARD_CSS =
  'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css';

// Rule 2: Pretendard weight -> stroke width on the 24 px grid
const WEIGHT_TO_STROKE = { 300: '1.5', 400: '1.75', 500: '2', 600: '2.25', 700: '2.5' };

const HELP = `icons.mjs - SVG icon tool for the Apple-style icon spec (Lucide base, 24 px grid)

Usage: node icons.mjs <command> [args]

Commands:
  normalize <file.svg|folder> --out <folder> [--weight 300|400|500|600|700]
      Rewrite stroke icons to the spec: viewBox "0 0 24 24", root stroke="currentColor"
      fill="none", round linecap/linejoin, stroke-width from the weight table
      (300=1.5, 400=1.75, 500=2, 600=2.25, 700=2.5; default 400). Removes root
      width/height/class and XML comments (a "@license" comment is kept).
      Icons not on a 24 grid or drawn as filled outlines are NOT changed; they are
      reported as not normalizable (exit code 0 unless nothing could be processed).

  check <file.svg|folder>
      Report spec violations per file (viewBox, round caps/joins, hard-coded colors,
      filled outlines, stroke widths that differ across the set). Exit code 1 if any.

  sheet <folder> --out <file.html> [--weights 400,600] [--sizes 16,20,24]
      Write a self-contained HTML contact sheet (inline SVG, Pretendard Variable from
      jsDelivr) with each icon at each size and weight, on light and dark backgrounds.

  fetch <lucide-name ...> --out <folder>
      Download icons from unpkg.com/lucide-static@${LUCIDE_VERSION}/icons/<name>.svg
      (needs internet).

  --help, -h   Show this help.
`;

// ---------- small helpers ----------

// Split argv into positional args and --flag value pairs
function parseArgs(argv) {
  const pos = [];
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const next = argv[i + 1];
      if (next === undefined || next.startsWith('--')) flags[a.slice(2)] = true;
      else { flags[a.slice(2)] = next; i++; }
    } else pos.push(a);
  }
  return { pos, flags };
}

function die(msg, code = 2) {
  console.error(msg);
  process.exit(code);
}

// A file path or a folder (non-recursive) -> list of .svg paths
function listSvgs(input) {
  if (!fs.existsSync(input)) die(`Not found: ${input}`);
  if (fs.statSync(input).isDirectory()) {
    return fs.readdirSync(input).filter((f) => f.toLowerCase().endsWith('.svg')).sort()
      .map((f) => path.join(input, f));
  }
  return [input];
}

const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// ---------- SVG parsing ----------

// Parse one icon: license comment, root attributes (ordered), inner markup
function parseSvg(text) {
  const rootMatch = /<svg\b([^>]*)>/s.exec(text);
  if (!rootMatch) return null;
  const closeIdx = text.lastIndexOf('</svg>');
  if (closeIdx < 0) return null;
  const attrs = [];
  const attrRe = /([\w:.-]+)\s*=\s*("([^"]*)"|'([^']*)')/g;
  let m;
  while ((m = attrRe.exec(rootMatch[1]))) attrs.push([m[1], m[3] ?? m[4]]);
  const comments = text.match(/<!--[\s\S]*?-->/g) || [];
  const license = comments.find((c) => /@license/.test(c)) || null;
  const inner = text.slice(rootMatch.index + rootMatch[0].length, closeIdx);
  return { attrs, license, inner, get: (n) => attrs.find(([k]) => k === n)?.[1] };
}

const stripComments = (s) => s.replace(/<!--[\s\S]*?-->/g, '');

// viewBox is exactly 0 0 24 24
function isGrid24(vb) {
  if (!vb) return false;
  const n = vb.trim().split(/[\s,]+/).map(Number);
  return n.length === 4 && n[0] === 0 && n[1] === 0 && n[2] === 24 && n[3] === 24;
}

// Does the icon draw with strokes? (root stroke, or any child stroke other than "none")
function usesStroke(svg) {
  const rs = svg.get('stroke');
  if (rs && rs !== 'none') return true;
  return /\sstroke\s*=\s*["'](?!none["'])/.test(svg.inner);
}

// Filled outline: no stroking at all, shapes are filled instead (Phosphor, Material, ...)
function isFilledOutline(svg) {
  return !usesStroke(svg);
}

// Return a reason string if the icon cannot be safely normalized, else null
function notNormalizable(svg) {
  const vb = svg.get('viewBox');
  if (!isGrid24(vb)) {
    return `not on a 24 grid (viewBox="${vb ?? 'missing'}")`;
  }
  if (isFilledOutline(svg)) {
    return 'drawn with filled outlines (fill paths, no strokes), so stroke weight cannot be applied';
  }
  return null;
}

// ---------- normalize ----------

function normalizeSvg(svg, strokeWidth) {
  const drop = new Set(['width', 'height', 'class', 'viewBox', 'fill', 'stroke',
    'stroke-width', 'stroke-linecap', 'stroke-linejoin']);
  const kept = svg.attrs.filter(([k]) => !drop.has(k));
  if (!kept.some(([k]) => k === 'xmlns')) kept.unshift(['xmlns', 'http://www.w3.org/2000/svg']);
  const attrs = [
    ...kept,
    ['viewBox', '0 0 24 24'],
    ['fill', 'none'],
    ['stroke', 'currentColor'],
    ['stroke-width', strokeWidth],
    ['stroke-linecap', 'round'],
    ['stroke-linejoin', 'round'],
  ];
  // Re-indent the body, children keep their own explicit fills
  const body = stripComments(svg.inner).split('\n').map((l) => l.trim()).filter(Boolean)
    .map((l) => '  ' + l).join('\n');
  const head = svg.license ? svg.license + '\n' : '';
  return `${head}<svg\n${attrs.map(([k, v]) => `  ${k}="${v}"`).join('\n')}\n>\n${body}\n</svg>\n`;
}

function cmdNormalize(pos, flags) {
  if (!pos[0] || !flags.out || flags.out === true) die('Usage: normalize <file.svg|folder> --out <folder> [--weight N]');
  const weight = String(flags.weight ?? '400');
  const strokeWidth = WEIGHT_TO_STROKE[weight];
  if (!strokeWidth) die(`Invalid --weight ${weight}. Use one of: ${Object.keys(WEIGHT_TO_STROKE).join(', ')}`);
  const files = listSvgs(pos[0]);
  if (!files.length) die('No .svg files found.');
  fs.mkdirSync(flags.out, { recursive: true });
  let ok = 0, skipped = 0;
  for (const f of files) {
    const name = path.basename(f);
    const svg = parseSvg(fs.readFileSync(f, 'utf8'));
    if (!svg) { console.log(`SKIP  ${name}: not a parsable SVG`); skipped++; continue; }
    const reason = notNormalizable(svg);
    if (reason) { console.log(`SKIP  ${name}: not normalizable - ${reason}`); skipped++; continue; }
    fs.writeFileSync(path.join(flags.out, name), normalizeSvg(svg, strokeWidth));
    console.log(`OK    ${name} -> stroke-width ${strokeWidth}`);
    ok++;
  }
  console.log(`\nnormalized ${ok}, not normalizable ${skipped}, weight ${weight}`);
  process.exit(ok === 0 ? 1 : 0);
}

// ---------- check ----------

const OK_COLORS = new Set(['none', 'currentcolor', 'inherit', 'transparent']);

// Violations for one icon (set-wide stroke width comparison happens in cmdCheck)
function checkSvg(svg) {
  const v = [];
  const vb = svg.get('viewBox');
  if (!isGrid24(vb)) v.push(`viewBox is "${vb ?? 'missing'}", expected "0 0 24 24"`);
  if (isFilledOutline(svg)) v.push('filled outline (no strokes; shapes are filled paths)');
  if (usesStroke(svg)) {
    if (svg.get('stroke-linecap') !== 'round') v.push(`stroke-linecap is "${svg.get('stroke-linecap') ?? 'missing'}", expected "round"`);
    if (svg.get('stroke-linejoin') !== 'round') v.push(`stroke-linejoin is "${svg.get('stroke-linejoin') ?? 'missing'}", expected "round"`);
    if (svg.get('fill') !== 'none') v.push(`root fill is "${svg.get('fill') ?? 'missing'}", expected "none"`);
    if (svg.get('stroke') !== 'currentColor') v.push(`root stroke is "${svg.get('stroke') ?? 'missing'}", expected "currentColor"`);
  }
  // Hard-coded colors anywhere (root or children), including inline style
  const colors = new Set();
  const all = svg.attrs.map(([k, v2]) => `${k}="${v2}"`).join(' ') + ' ' + stripComments(svg.inner);
  for (const m of all.matchAll(/\b(?:fill|stroke|color)\s*[=:]\s*["']?\s*([^"';\s>]+)/g)) {
    const val = m[1];
    if (!OK_COLORS.has(val.toLowerCase()) && !val.startsWith('url(')) colors.add(val);
  }
  if (colors.size) v.push(`hard-coded colors instead of currentColor: ${[...colors].join(', ')}`);
  return v;
}

function cmdCheck(pos) {
  if (!pos[0]) die('Usage: check <file.svg|folder>');
  const files = listSvgs(pos[0]);
  if (!files.length) die('No .svg files found.');
  const results = new Map(); // name -> violations
  const widths = new Map();  // name -> root stroke-width
  for (const f of files) {
    const name = path.basename(f);
    const svg = parseSvg(fs.readFileSync(f, 'utf8'));
    if (!svg) { results.set(name, ['not a parsable SVG']); continue; }
    results.set(name, checkSvg(svg));
    const sw = svg.get('stroke-width');
    if (sw && usesStroke(svg)) widths.set(name, sw);
  }
  // Rule 1: one stroke width across the set
  const distinct = [...new Set(widths.values())];
  if (distinct.length > 1) {
    const counts = {};
    for (const w of widths.values()) counts[w] = (counts[w] || 0) + 1;
    const common = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0];
    for (const [name, w] of widths) {
      if (w !== common) results.get(name).push(`stroke-width ${w} differs from the set's most common value ${common}`);
    }
  }
  let bad = 0;
  for (const [name, v] of results) {
    if (v.length) { bad++; console.log(`FAIL  ${name}`); v.forEach((x) => console.log(`        - ${x}`)); }
    else console.log(`PASS  ${name}`);
  }
  console.log(`\n${results.size - bad} passed, ${bad} failed (${results.size} files)`);
  process.exit(bad ? 1 : 0);
}

// ---------- sheet ----------

// Set the root stroke-width (if the icon is stroke-based) and drop root width/height for CSS sizing
function prepareForSheet(text, strokeWidth) {
  const svg = parseSvg(text);
  if (!svg) return null;
  const rootRe = /<svg\b[^>]*>/s;
  let root = rootRe.exec(text)[0];
  root = root.replace(/\s(?:width|height|class)\s*=\s*("[^"]*"|'[^']*')/g, '');
  if (!notNormalizable(svg)) {
    root = /\sstroke-width\s*=/.test(root)
      ? root.replace(/(\sstroke-width\s*=\s*)("[^"]*"|'[^']*')/, `$1"${strokeWidth}"`)
      : root.replace(/>$/, ` stroke-width="${strokeWidth}">`);
  }
  const closeIdx = text.lastIndexOf('</svg>');
  const start = text.search(rootRe) + rootRe.exec(text)[0].length;
  const markup = root + stripComments(text.slice(start, closeIdx)) + '</svg>';
  return { markup, normalizable: !notNormalizable(svg), reason: notNormalizable(svg) };
}

function cmdSheet(pos, flags) {
  if (!pos[0] || !flags.out || flags.out === true) die('Usage: sheet <folder> --out <file.html> [--weights 400,600] [--sizes 16,20,24]');
  const weights = String(flags.weights ?? '400,600').split(',').map((s) => s.trim());
  const sizes = String(flags.sizes ?? '16,20,24').split(',').map((s) => Number(s.trim()));
  for (const w of weights) if (!WEIGHT_TO_STROKE[w]) die(`Invalid weight ${w}. Use: ${Object.keys(WEIGHT_TO_STROKE).join(', ')}`);
  if (sizes.some((s) => !(s > 0))) die('Invalid --sizes, expected positive numbers like 16,20,24');
  const files = listSvgs(pos[0]);
  if (!files.length) die('No .svg files found.');

  const cards = files.map((f) => {
    const name = path.basename(f);
    const text = fs.readFileSync(f, 'utf8');
    const rows = [];
    let note = '';
    for (const w of weights) {
      const p = prepareForSheet(text, WEIGHT_TO_STROKE[w]);
      if (!p) { note = 'unparsable SVG'; break; }
      if (!p.normalizable) note = `shown as-is, not normalizable: ${p.reason}`;
      for (const s of sizes) {
        rows.push(`<div class="row" style="font-size:${s}px;font-weight:${w}">` +
          `<span class="ico">${p.markup}</span><span class="txt">Pretendard ${w} / ${s}px, sw ${WEIGHT_TO_STROKE[w]}</span></div>`);
      }
    }
    return `<figure class="card"><figcaption>${escapeHtml(name)}</figcaption>` +
      `${note ? `<p class="note">${escapeHtml(note)}</p>` : ''}${rows.join('')}</figure>`;
  });

  const section = (theme, title) =>
    `<section class="${theme}"><h2>${title}</h2><div class="grid">${cards.join('\n')}</div></section>`;

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Icon contact sheet</title>
<link rel="stylesheet" href="${PRETENDARD_CSS}">
<style>
  * { box-sizing: border-box; }
  body { margin: 0; font-family: "Pretendard Variable", Pretendard, -apple-system, system-ui, sans-serif; }
  section { padding: 24px; }
  section.light { background: #ffffff; color: #1d1d1f; }
  section.dark { background: #1c1c1e; color: #f5f5f7; }
  h2 { font-size: 14px; font-weight: 600; margin: 0 0 16px; opacity: .6; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
  .card { margin: 0; padding: 12px 14px; border: 1px solid currentColor; border-color: color-mix(in srgb, currentColor 18%, transparent); border-radius: 12px; }
  figcaption { font-size: 12px; font-weight: 600; opacity: .7; margin-bottom: 8px; font-family: ui-monospace, Menlo, Consolas, monospace; }
  .note { font-size: 11px; margin: 0 0 8px; color: #ff9f0a; }
  .row { display: flex; align-items: center; gap: .5em; margin: 6px 0; line-height: 1.3; }
  .ico { display: inline-flex; flex: none; }
  .ico svg { width: 1em; height: 1em; display: block; }
  .txt { font-size: .75em; opacity: .85; white-space: nowrap; }
</style>
</head>
<body>
${section('light', 'Light')}
${section('dark', 'Dark')}
</body>
</html>
`;
  fs.mkdirSync(path.dirname(path.resolve(flags.out)), { recursive: true });
  fs.writeFileSync(flags.out, html);
  console.log(`wrote ${flags.out}: ${files.length} icons x ${weights.length} weights x ${sizes.length} sizes, light + dark`);
}

// ---------- fetch ----------

async function cmdFetch(pos, flags) {
  if (!pos.length || !flags.out || flags.out === true) die('Usage: fetch <lucide-name ...> --out <folder>');
  fs.mkdirSync(flags.out, { recursive: true });
  let failed = 0;
  for (const name of pos) {
    if (!/^[a-z0-9][a-z0-9-]*$/.test(name)) { console.error(`FAIL  ${name}: invalid icon name (use lowercase Lucide names like "trash-2")`); failed++; continue; }
    const url = `https://unpkg.com/lucide-static@${LUCIDE_VERSION}/icons/${name}.svg`;
    try {
      const res = await fetch(url);
      if (res.status === 404) { console.error(`FAIL  ${name}: not found in lucide-static@${LUCIDE_VERSION} (HTTP 404)`); failed++; continue; }
      if (!res.ok) { console.error(`FAIL  ${name}: HTTP ${res.status} from ${url}`); failed++; continue; }
      fs.writeFileSync(path.join(flags.out, `${name}.svg`), await res.text());
      console.log(`OK    ${name}.svg`);
    } catch (e) {
      const cause = e?.cause?.code || e?.cause?.message || e?.message;
      console.error(`FAIL  ${name}: network error (${cause}). fetch needs internet access to unpkg.com; check your connection and retry.`);
      failed++;
    }
  }
  process.exit(failed ? 1 : 0);
}

// ---------- main ----------

const [cmd, ...rest] = process.argv.slice(2);
const { pos, flags } = parseArgs(rest);
if (!cmd || cmd === '--help' || cmd === '-h' || cmd === 'help' || flags.help) {
  console.log(HELP);
} else if (cmd === 'normalize') cmdNormalize(pos, flags);
else if (cmd === 'check') cmdCheck(pos);
else if (cmd === 'sheet') cmdSheet(pos, flags);
else if (cmd === 'fetch') await cmdFetch(pos, flags);
else die(`Unknown command "${cmd}". Run with --help.`);
