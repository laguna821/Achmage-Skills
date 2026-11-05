#!/usr/bin/env node
// Search the HIG rule index (our own summaries plus tags) by keyword and filters.
// Usage: node scripts/find-rules.mjs [words...] [--page slug] [--principle p] [--lens l] [--stage s]
//          [--medium mobile|web|slides|cards] [--fit direct|transfer|any] [--platform iOS]
//          [--all] [--terms] [--limit 15] [--original] [--json]
// --original prints Apple's rule sentence too, from the local copy built by scripts/fetch-hig.mjs.
// --check <file or folder...> verifies every rule ID cited in backticks in the given files; a folder means
//   every .md file below it (exit code 1 if any is unknown).
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SKILL_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const INDEX_DIR = path.join(SKILL_DIR, 'references', 'rule-index');
const LOCAL_RULES = path.join(SKILL_DIR, '.hig-local', 'rules.jsonl');
const HIG = 'https://developer.apple.com/design/human-interface-guidelines/';
const MEDIA = ['mobile', 'web', 'slides', 'cards'];
const FIT = { d: 'direct', t: 'transfer', '-': 'none' };

const argv = process.argv.slice(2);
if (argv.includes('--help') || argv.includes('-h')) {
  console.log(`Search the HIG rule index.
  words...            keywords matched against the summary, ID and page (any word; use --all for every word)
  --page <slug>       one HIG page, for example alerts
  --principle <p>     purpose, agency, responsibility, familiarity, flexibility, simplicity, craft, delight
  --lens <l>          value, attention, flow, interaction, content, inclusion, trust, platform
  --stage <s>         define, structure, compose, express, interact, write, include, adapt
  --medium <m>        mobile, web, slides or cards; with --fit direct, transfer or any (default: direct or transfer)
  --platform <name>   only rules specific to iOS, iPadOS, macOS, tvOS, visionOS or watchOS
  --terms             include definition entries
  --limit <n>         number of results (default 15)
  --original          also print Apple's rule sentence from .hig-local (run scripts/fetch-hig.mjs first)
  --json              print JSON
  --check <path...>   verify the rule IDs cited in your documents before delivering them
                      (files, or folders: every .md file below them)`);
  process.exit(0);
}
const flags = new Set(['--all', '--terms', '--original', '--json']);
const opts = {};
const words = [];
const checkAt = argv.indexOf('--check');
const checkFiles = checkAt >= 0 ? argv.slice(checkAt + 1).filter(a => !a.startsWith('--')) : null;
for (let i = 0; i < (checkFiles ? 0 : argv.length); i++) {
  const a = argv[i];
  if (flags.has(a)) opts[a.slice(2)] = true;
  else if (a.startsWith('--')) { opts[a.slice(2)] = argv[i + 1]; i++; }
  else words.push(...a.toLowerCase().split(/\s+/).filter(Boolean));
}
const limit = Number(opts.limit || 15);

// parse the rule index
const RULE = /^- `([^`]+)` (?:\[([^\]]+)\] )?\*\*Do:\*\* (.*?)(?: \*\*Why:\*\* (.*?))? · P (.+?) · L (.+?) · S (.+?) · M ([dt-]\/[dt-]\/[dt-]\/[dt-])$/;
const TERM = /^- `([^`]+)` \*\*Term: (.*?)\.\*\* (.*)$/;
const PAGE = /^## (.+) \(`([a-z0-9-]+)`\)$/;
const rows = [];
for (const f of (await fs.readdir(INDEX_DIR)).filter(x => x.endsWith('.md')).sort()) {
  let page = null, title = null;
  for (const line of (await fs.readFile(path.join(INDEX_DIR, f), 'utf8')).split(/\r?\n/)) {
    let m = line.match(PAGE);
    if (m) { title = m[1]; page = m[2]; continue; }
    m = line.match(RULE);
    if (m) {
      const media = Object.fromEntries(m[8].split('/').map((c, i) => [MEDIA[i], FIT[c]]));
      rows.push({ id: m[1], kind: 'guideline', page, title, platforms: m[2] ? m[2].split(', ') : null, do: m[3], why: m[4] || '', principles: m[5].split(', '), lenses: m[6].split(', '), stages: m[7].split(', '), media, url: HIG + page });
      continue;
    }
    m = line.match(TERM);
    if (m) rows.push({ id: m[1], kind: 'term', page, title, platforms: null, term: m[2], do: m[3], why: '', principles: [], lenses: [], stages: [], media: {}, url: HIG + page });
  }
}

// verify cited IDs
if (checkFiles) {
  if (!checkFiles.length) { console.error('Give one or more files or folders: --check answer.md specs/'); process.exit(1); }
  const known = new Set(rows.map(r => r.id));
  const pages = new Set(rows.map(r => r.page));
  const SKIP = new Set(['node_modules', '.git', '.hig-local']);
  const expand = async p => {
    const st = await fs.stat(p);
    if (!st.isDirectory()) return [p];
    const out = [];
    for (const e of (await fs.readdir(p, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))) {
      if (SKIP.has(e.name)) continue;
      const q = path.join(p, e.name);
      if (e.isDirectory()) out.push(...await expand(q));
      else if (e.name.endsWith('.md')) out.push(q);
    }
    return out;
  };
  const files = [];
  for (const p of checkFiles) files.push(...await expand(p));
  let total = 0, bad = 0;
  for (const f of files) {
    const text = await fs.readFile(f, 'utf8');
    const ids = [...new Set([...text.matchAll(/`([a-z0-9-]+(?:\/[a-z0-9-]+){1,7})`/g)].map(m => m[1]).filter(id => pages.has(id.split('/')[0])))];
    const unknown = ids.filter(id => !known.has(id));
    total += ids.length; bad += unknown.length;
    console.log(`${f}: ${ids.length} rule IDs, ${unknown.length} unknown`);
    for (const u of unknown) {
      const head = u.split('/').pop().split('-').slice(0, 2).join('-');
      const near = rows.filter(r => r.page === u.split('/')[0] && r.id.split('/').pop().startsWith(head)).slice(0, 2).map(r => r.id);
      console.log(`  unknown: ${u}${near.length ? '  (closest: ' + near.join(' or ') + ')' : ''}`);
    }
  }
  console.log(`\n${files.length} files, ${total} IDs checked, ${bad} unknown`);
  process.exit(bad ? 1 : 0);
}

// filter and rank
const fitOk = r => {
  if (!opts.medium) return true;
  const v = r.media[opts.medium];
  const want = opts.fit || 'any';
  return want === 'any' ? v === 'direct' || v === 'transfer' : v === want;
};
const hay = r => `${r.do} ${r.why} ${r.id} ${r.title} ${r.term || ''}`.toLowerCase();
// rarer words count more (inverse document frequency); an exact phrase match counts extra
const phrase = words.length > 1 ? words.join(' ') : '';
const df = {};
for (const w of words) df[w] = Math.max(1, rows.filter(r => hay(r).includes(w)).length);
const idf = w => Math.log(1 + rows.length / df[w]);
const results = rows
  .filter(r => opts.terms || r.kind === 'guideline' || (words.length && words.some(w => hay(r).includes(w))))
  .filter(r => !opts.page || r.page === opts.page)
  .filter(r => !opts.principle || r.principles.includes(opts.principle))
  .filter(r => !opts.lens || r.lenses.includes(opts.lens))
  .filter(r => !opts.stage || r.stages.includes(opts.stage))
  .filter(r => !opts.platform || (r.platforms || []).some(p => p.toLowerCase() === String(opts.platform).toLowerCase()))
  .filter(fitOk)
  .map(r => {
    const h = hay(r);
    const hits = words.filter(w => h.includes(w)).length;
    const wscore = words.reduce((s, w) => s + (h.includes(w) ? idf(w) : 0), 0);
    const bonus = words.filter(w => r.id.includes(w) || (r.title || '').toLowerCase().includes(w)).length * 0.5;
    const score = wscore + bonus + (phrase && h.includes(phrase) ? 2 : 0) - (r.kind === 'term' ? 0.5 : 0) + (r.principles[0] === opts.principle ? 1 : 0);
    return { r, hits, score };
  })
  .filter(x => !words.length || (opts.all ? x.hits === words.length : x.hits > 0))
  .sort((a, b) => b.score - a.score)
  .slice(0, limit)
  .map(x => x.r);

// optional: Apple's original sentence from the local copy
let originals = null;
if (opts.original) {
  try {
    originals = new Map((await fs.readFile(LOCAL_RULES, 'utf8')).split(/\r?\n/).filter(Boolean).map(l => { const o = JSON.parse(l); return [o.id, o.rule]; }));
  } catch { console.error('No local copy found. Run: node scripts/fetch-hig.mjs'); }
}

if (opts.json) {
  console.log(JSON.stringify(results.map(r => ({ ...r, ...(originals ? { original: originals.get(r.id) || null } : {}) })), null, 1));
} else {
  if (!results.length) console.log('No matching rules.');
  for (const r of results) {
    console.log(`${r.id}  (${r.title}${r.platforms ? ', ' + r.platforms.join(', ') : ''})`);
    if (r.kind === 'term') console.log(`  Term: ${r.term}. ${r.do}`);
    else {
      console.log(`  Do: ${r.do}`);
      if (r.why) console.log(`  Why: ${r.why}`);
      console.log(`  P ${r.principles.join(', ')} · L ${r.lenses.join(', ')} · S ${r.stages.join(', ')} · M ${MEDIA.map(m => `${m}:${r.media[m]}`).join(' ')}`);
    }
    if (originals && originals.get(r.id)) console.log(`  HIG: ${originals.get(r.id)}`);
    console.log(`  ${r.url}`);
  }
  console.log(`\n${results.length} shown · ${rows.length} entries in the index`);
}
