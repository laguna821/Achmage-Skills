#!/usr/bin/env node
// Contrast ratio between a text color and its background, checked against the HIG minimum contrast
// table (references/tokens.md, "Minimum contrast") and the Dark Mode aim of 7:1 for custom colors.
// The HIG accepts recognized standards such as WCAG (accessibility/vision/strive-to-meet-color-contrast-minimum);
// this uses the WCAG 2 relative-luminance formula.
// Usage: node scripts/contrast.mjs <text> <background> [<text> <background> ...] [--json]
// Colors: #RGB, #RRGGBB, #RRGGBBAA (alpha is blended over the background), rgb(r, g, b) or rgb(r g b / a).
const argv = process.argv.slice(2);
const json = argv.includes('--json');
const cols = argv.filter(a => a !== '--json');
if (!cols.length || cols.length % 2 || argv.includes('--help') || argv.includes('-h')) {
  console.log(`Usage: node scripts/contrast.mjs <text> <background> [<text> <background> ...] [--json]
  Example: node scripts/contrast.mjs "#FFFFFF" "#0088FF" "#6C6C70" "#FFFFFF"
  Checks each pair against the HIG table: up to 17 pt needs 4.5:1; 18 pt and up, or bold at any size, needs 3:1.
  Also shows the 7:1 aim for custom colors (dark-mode/dark-mode-colors/aim-for-sufficient-color-contrast-in).`);
  process.exit(cols.length ? 1 : 0);
}
function parse(s) {
  s = String(s).trim();
  let m = s.match(/^#([0-9a-f]{3,8})$/i);
  if (m) {
    let h = m[1];
    if (h.length === 3 || h.length === 4) h = [...h].map(c => c + c).join('');
    if (h.length !== 6 && h.length !== 8) throw new Error('Bad color: ' + s);
    return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16), a: h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1 };
  }
  m = s.match(/^rgba?\(([^)]+)\)$/i);
  if (m) {
    const p = m[1].split(/[\s,\/]+/).filter(Boolean).map(v => v.endsWith('%') ? parseFloat(v) / 100 : Number(v));
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  }
  throw new Error('Bad color: ' + s);
}
const lin = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
const lum = c => 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);
const blend = (fg, bg) => ({ r: fg.r * fg.a + bg.r * (1 - fg.a), g: fg.g * fg.a + bg.g * (1 - fg.a), b: fg.b * fg.a + bg.b * (1 - fg.a), a: 1 });
const out = [];
for (let i = 0; i < cols.length; i += 2) {
  const bg = parse(cols[i + 1]);
  if (bg.a < 1) { console.error(`Background ${cols[i + 1]} is translucent; give the color it ends up as on screen.`); process.exit(1); }
  const fg0 = parse(cols[i]);
  const fg = fg0.a < 1 ? blend(fg0, bg) : fg0;
  const L1 = lum(fg), L2 = lum(bg);
  const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
  const r2 = Math.floor(ratio * 100) / 100;
  out.push({ text: cols[i], background: cols[i + 1], ratio: r2, upTo17pt: ratio >= 4.5, large18ptOrBold: ratio >= 3, aim7: ratio >= 7 });
}
if (json) { console.log(JSON.stringify(out, null, 1)); process.exit(0); }
const mark = ok => (ok ? 'pass' : 'FAIL');
for (const o of out) {
  console.log(`${o.text} on ${o.background}: ${o.ratio.toFixed(2)}:1`);
  console.log(`  text up to 17 pt (any weight) needs 4.5:1 ........ ${mark(o.upTo17pt)}`);
  console.log(`  text 18 pt and up, or bold at any size, needs 3:1 . ${mark(o.large18ptOrBold)}`);
  console.log(`  aim for custom colors, small text: 7:1 ............ ${o.aim7 ? 'met' : 'not met'}`);
}
