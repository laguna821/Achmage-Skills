#!/usr/bin/env node
// Traceability check for a whole-product run: are the screens and decisions defined in the planning
// documents carried into the specs and the built front end?
// Usage: node scripts/trace.mjs <project folder> [--json]
//   Definitions: markdown headings or table rows that start with S01... (screens) or D01... (decisions).
//   Specs: markdown that mentions S## or D## after the definitions.
//   Build: data-screen="S##" and data-decision="D##" in .html and .js files.
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
if (!args.length || args.includes('--help') || args.includes('-h')) {
  console.log('Usage: node scripts/trace.mjs <project folder> [--json]\n  Reports screens (S##) and decisions (D##): where each is defined, specified and built, and what is missing.');
  process.exit(args.length ? 0 : 1);
}
const ROOT = path.resolve(args.find(a => !a.startsWith('--')));
const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => {
  if (e.name.startsWith('.') || e.name === 'node_modules') return [];
  const p = path.join(d, e.name);
  return e.isDirectory() ? walk(p) : [p];
});
const files = walk(ROOT);
const rel = p => path.relative(ROOT, p).replace(/\\/g, '/');
const md = files.filter(f => f.endsWith('.md'));
const code = files.filter(f => /\.(html|js)$/.test(f) && !/kit\.js$|deck\.js$/.test(f));

const def = { S: new Map(), D: new Map() };     // id -> file where first defined
const mentions = { S: new Map(), D: new Map() }; // id -> set of md files mentioning it
for (const f of md) {
  const text = fs.readFileSync(f, 'utf8');
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^(?:#{2,4}\s+|\|\s*|-\s+\*\*)([SD])(\d{2})\b/);
    if (m) { const id = m[1] + m[2]; if (!def[m[1]].has(id)) def[m[1]].set(id, rel(f)); }
  }
  for (const m of text.matchAll(/\b([SD])(\d{2})\b/g)) {
    const id = m[1] + m[2];
    if (!mentions[m[1]].has(id)) mentions[m[1]].set(id, new Set());
    mentions[m[1]].get(id).add(rel(f));
  }
}
const built = { S: new Map(), D: new Map() };
for (const f of code) {
  const text = fs.readFileSync(f, 'utf8');
  for (const m of text.matchAll(/data-(screen|decision)\s*[=:]\s*["'`]?([SD])(\d{2})/g)) {
    const id = m[2] + m[3];
    const k = m[2];
    if (!built[k].has(id)) built[k].set(id, new Set());
    built[k].get(id).add(rel(f));
  }
  for (const m of text.matchAll(/dataset\.(screen|decision)\s*=\s*["'`]([SD])(\d{2})/g)) {
    const id = m[2] + m[3];
    if (!built[m[2]].has(id)) built[m[2]].set(id, new Set());
    built[m[2]].get(id).add(rel(f));
  }
}
const report = {};
for (const k of ['S', 'D']) {
  const ids = [...new Set([...def[k].keys(), ...built[k].keys()])].sort();
  report[k] = ids.map(id => ({
    id,
    defined: def[k].get(id) || null,
    docs: mentions[k].has(id) ? mentions[k].get(id).size : 0,
    built: built[k].has(id) ? [...built[k].get(id)] : [],
  }));
}
if (args.includes('--json')) { console.log(JSON.stringify(report, null, 1)); process.exit(0); }
const label = { S: 'Screens', D: 'Decisions' };
let problems = 0;
for (const k of ['S', 'D']) {
  const rows = report[k];
  const notBuilt = rows.filter(r => r.defined && !r.built.length);
  const undefinedBuilt = rows.filter(r => !r.defined && r.built.length);
  console.log(`\n${label[k]}: ${rows.filter(r => r.defined).length} defined, ${rows.filter(r => r.built.length).length} found in the build`);
  for (const r of rows) console.log(`  ${r.id}  ${r.defined ? 'defined in ' + r.defined : 'NOT DEFINED'} · ${r.docs} doc(s) · ${r.built.length ? 'built: ' + r.built.slice(0, 3).join(', ') : 'not in build'}`);
  if (notBuilt.length) console.log(`  missing in build: ${notBuilt.map(r => r.id).join(', ')}`);
  if (undefinedBuilt.length) console.log(`  in build but never defined: ${undefinedBuilt.map(r => r.id).join(', ')}`);
  problems += notBuilt.length + undefinedBuilt.length;
}
console.log(`\n${problems ? problems + ' gap(s)' : 'No gaps'} between documents and build.`);
process.exit(problems ? 1 : 0);
