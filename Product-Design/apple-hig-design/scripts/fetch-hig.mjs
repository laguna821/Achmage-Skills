#!/usr/bin/env node
// Build a local copy of Apple's Human Interface Guidelines for checking exact wording.
// Downloads the public HIG data from developer.apple.com (or reads a saved copy with --from), then writes
//   corpus/<slug>.md  full text of every page, images and videos as their descriptions
//   rules.jsonl       every rule and context entry, with the same IDs the skill cites
// The output is Apple's content: keep it on your machine and do not redistribute or commit it.
// Usage: node scripts/fetch-hig.mjs [--out <dir>] [--from <raw-json-dir>] [--concurrency 8]
// The rendering and segmentation code below is shared with the skill's build pipeline so rule IDs match exactly.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SKILL_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(name); return i >= 0 && args[i + 1] ? args[i + 1] : def; };
if (args.includes('--help') || args.includes('-h')) {
  console.log('Usage: node scripts/fetch-hig.mjs [--out <dir>] [--from <raw-json-dir>] [--concurrency 8]\n  --out          output folder (default: <skill>/.hig-local)\n  --from         build from a saved folder with _navigation-index.json and en/<slug>.json instead of downloading\n  --concurrency  parallel downloads (default 8)');
  process.exit(0);
}
const OUT = path.resolve(opt('--out', path.join(SKILL_DIR, '.hig-local')));
const FROM = opt('--from', null);
const CONC = Math.max(1, Number(opt('--concurrency', 8)));
const DATA = 'https://developer.apple.com/tutorials/data';
const COLLECTED = new Date().toISOString().slice(0, 10);
const SITE = 'https://developer.apple.com';
const HIG_URL = SITE + '/design/human-interface-guidelines/';
const PLATFORMS = ['iOS', 'iPadOS', 'macOS', 'tvOS', 'visionOS', 'watchOS'];
const PLATFORM_KEYS = { ios: 'iOS', ipados: 'iPadOS', macos: 'macOS', tvos: 'tvOS', visionos: 'visionOS', watchos: 'watchOS' };
const FOCUS = {
  'designing-for-ios': 'iOS', 'designing-for-ipados': 'iPadOS', 'designing-for-macos': 'macOS',
  'designing-for-tvos': 'tvOS', 'designing-for-visionos': 'visionOS', 'designing-for-watchos': 'watchOS',
  'designing-for-games': 'games', 'designing-for-iphone-duo': 'iPhone Duo',
};
const VERDICT = { 'checkmark.png': '[Correct]', 'crossout.png': '[Incorrect]' };
const INLINE_SYMBOL = { 'table-availability-checkmark.png': '✓' };

const slugOf = p => p.split('/').filter(Boolean).pop().toLowerCase();
const kebab = s => s.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const pad2 = n => String(n).padStart(2, '0');

const write = async (rel, data) => {
  const fp = path.join(OUT, ...rel.split('/'));
  await fs.mkdir(path.dirname(fp), { recursive: true });
  await fs.writeFile(fp, data, 'utf8');
};
const yq = s => JSON.stringify(String(s ?? ''));
async function getJson(url) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const r = await fetch(url);
      if (r.ok) return await r.json();
      if (r.status === 404) return null;
    } catch (e) { if (attempt === 2) throw e; }
    await new Promise(res => setTimeout(res, 600 * (attempt + 1)));
  }
  return null;
}

// ---------------- navigation ----------------
let nav;
try {
  nav = FROM ? JSON.parse(await fs.readFile(path.join(FROM, '_navigation-index.json'), 'utf8')) : await getJson(DATA + '/index/design--human-interface-guidelines');
} catch (e) {
  console.error('Could not load the HIG index. Downloading needs internet access to developer.apple.com (or use --from <saved folder>). ' + e.message);
  process.exit(1);
}
if (!nav) { console.error('The HIG index was not found.'); process.exit(1); }

// ---------------- page meta ----------------
const rootNode = nav.interfaceLanguages.swift[0];
const meta = new Map();
let order = 0;
const addMeta = (node, o) => meta.set(slugOf(node.path), { slug: slugOf(node.path), title: node.title, order: order++, ...o });
addMeta(rootNode, { kind: 'root', section: null, sectionDir: '00-root', group: null });
rootNode.children.forEach((sec, i) => {
  const sectionDir = `${pad2(i + 1)}-${slugOf(sec.path)}`;
  addMeta(sec, { kind: 'section', section: sec.title, sectionDir, group: null });
  (sec.children || []).forEach(c => {
    if (c.children && c.children.length) {
      addMeta(c, { kind: 'group', section: sec.title, sectionDir, group: c.title });
      c.children.forEach(a => addMeta(a, { kind: 'article', section: sec.title, sectionDir, group: c.title }));
    } else addMeta(c, { kind: 'article', section: sec.title, sectionDir, group: null });
  });
});


// ---------------- pages ----------------
const en = new Map();
const slugs = [...meta.keys()];
const failed = [];
async function loadPage(slug) {
  if (FROM) { try { return JSON.parse(await fs.readFile(path.join(FROM, 'en', slug + '.json'), 'utf8')); } catch { return null; } }
  const p = slug === 'human-interface-guidelines' ? '/design/human-interface-guidelines' : '/design/human-interface-guidelines/' + slug;
  return getJson(DATA + p + '.json');
}
for (let i = 0; i < slugs.length; i += CONC) {
  const batch = slugs.slice(i, i + CONC);
  const res = await Promise.all(batch.map(s => loadPage(s).catch(() => null)));
  batch.forEach((s, k) => { if (res[k]) en.set(s, res[k]); else failed.push(s); });
  process.stdout.write('\rpages ' + en.size + '/' + slugs.length);
}
console.log('');
if (failed.length) console.log('missing pages: ' + failed.join(', '));
for (const s of failed) meta.delete(s);

// ---------------- rendering ----------------
function higTarget(url) {
  const m = (url || '').match(/^(?:https?:\/\/developer\.apple\.com)?(?:\/(?:kr|cn|jp))?\/design\/human-interface-guidelines\/?([^#?]*?)\/?(?:#([^?]*))?$/i);
  if (!m) return null;
  const slug = m[1] ? m[1].split('/').pop().toLowerCase() : 'human-interface-guidelines';
  return meta.has(slug) ? { slug, anchor: m[2] || null } : null;
}
const makeCtx = (slug, j, mode) => ({ slug, refs: j.references || {}, mode, links: [] });
const plainOf = ctx => ({ ...ctx, mode: 'plain' });

function inline(nodes, ctx) { let s = ''; for (const n of nodes || []) s += inlineNode(n, ctx); return s; }
function inlineNode(n, ctx) {
  switch (n.type) {
    case 'text': return n.text;
    case 'emphasis': { const t = inline(n.inlineContent, ctx); return ctx.mode === 'plain' || !t.trim() ? t : `*${t}*`; }
    case 'strong': { const t = inline(n.inlineContent, ctx); return ctx.mode === 'plain' || !t.trim() ? t : `**${t}**`; }
    case 'codeVoice': return '`' + n.code + '`';
    case 'reference': {
      const r = ctx.refs[n.identifier];
      const title = n.overridingTitleInlineContent ? inline(n.overridingTitleInlineContent, plainOf(ctx)) : (n.overridingTitle || r?.title || '');
      if (!r) return title;
      const t = higTarget(r.url);
      if (t) ctx.links.push(t);
      const label = (r.kind === 'symbol' || r.role === 'symbol') && !n.overridingTitle ? '`' + title + '`' : title;
      if (ctx.mode === 'plain') return label;
      if (t) return `[${label}](${t.slug}.md${t.anchor ? '#' + t.anchor : ''})`;
      const href = (r.url || '').startsWith('/') ? SITE + r.url : r.url;
      return href ? `[${label}](${href})` : label;
    }
    case 'link': return ctx.mode === 'plain' ? (n.title || n.destination) : `[${n.title || n.destination}](${n.destination})`;
    case 'image': return imageText(n, ctx);
    case 'video': return videoText(n, ctx);
    default: return n.inlineContent ? inline(n.inlineContent, ctx) : (n.text || '');
  }
}
function imageText(n, ctx) {
  if (INLINE_SYMBOL[n.identifier]) return INLINE_SYMBOL[n.identifier];
  if (VERDICT[n.identifier]) return VERDICT[n.identifier];
  const r = ctx.refs[n.identifier];
  const alt = (r?.alt || '').replace(/\s+/g, ' ').trim();
  const cap = n.metadata?.abstract ? inline(n.metadata.abstract, plainOf(ctx)).trim() : '';
  return `[Image: ${alt || n.identifier}${cap ? ' | caption: ' + cap : ''}]`;
}
function videoText(n, ctx) {
  const r = ctx.refs[n.identifier];
  const alt = (r?.alt || '').replace(/\s+/g, ' ').trim();
  const cap = n.metadata?.abstract ? inline(n.metadata.abstract, plainOf(ctx)).trim() : '';
  return `[Video: ${alt || n.identifier}${cap ? ' | caption: ' + cap : ''}]`;
}
function blocks(bs, ctx) { return (bs || []).map(b => block(b, ctx)).filter(Boolean).join('\n\n'); }
function block(b, ctx) {
  switch (b.type) {
    case 'heading': return '#'.repeat(Math.min(b.level, 6)) + ' ' + b.text;
    case 'paragraph': case 'small': return inline(b.inlineContent, ctx);
    case 'aside': {
      const label = { note: 'NOTE', tip: 'TIP', important: 'IMPORTANT', warning: 'WARNING' }[b.style] || 'NOTE';
      const title = b.name && b.name.toLowerCase() !== (b.style || '').toLowerCase() ? ' ' + b.name : '';
      return `> [!${label}]${title}\n` + blocks(b.content, ctx).split('\n').map(l => (l ? '> ' + l : '>')).join('\n');
    }
    case 'unorderedList': case 'orderedList':
      return b.items.map((it, i) => {
        const mk = b.type === 'orderedList' ? `${(b.start || 1) + i}.` : '-';
        const lines = blocks(it.content, ctx).split('\n');
        return mk + ' ' + lines[0] + lines.slice(1).map(l => '\n' + (l ? ' '.repeat(mk.length + 1) + l : '')).join('');
      }).join('\n');
    case 'row':
      return b.columns.map(col => {
        let v = '';
        const rest = col.content.filter(x => {
          const id = x.type === 'paragraph' && x.inlineContent.length === 1 && x.inlineContent[0].type === 'image' ? x.inlineContent[0].identifier : null;
          if (id && VERDICT[id]) { v = VERDICT[id]; return false; }
          return true;
        });
        return (v ? v + ' ' : '') + blocks(rest, ctx);
      }).join('\n\n');
    case 'tabNavigator': return b.tabs.map(t => `**[${t.title}]**\n\n` + blocks(t.content, ctx)).join('\n\n');
    case 'table': return tableMd(b, ctx);
    case 'links':
      return b.items.map(id => {
        const r = ctx.refs[id];
        if (!r) return null;
        const t = higTarget(r.url);
        if (t) ctx.links.push(t);
        const abs = r.abstract && r.abstract.length ? ': ' + inline(r.abstract, plainOf(ctx)) : '';
        if (ctx.mode === 'plain') return `- ${r.title}${abs}`;
        const href = t ? `${t.slug}.md` : ((r.url || '').startsWith('/') ? SITE + r.url : r.url);
        return `- [${r.title}](${href})${abs}`;
      }).filter(Boolean).join('\n');
    case 'video': return videoText(b, ctx);
    case 'image': return imageText(b, ctx);
    case 'codeListing': return '```' + (b.syntax || '') + '\n' + (b.code || []).join('\n') + '\n```';
    case 'thematicBreak': return '---';
    case 'termList': return b.items.map(it => `**${inline(it.term.inlineContent, ctx)}**: ${blocks(it.definition.content, ctx)}`).join('\n\n');
    default: return b.content ? blocks(b.content, ctx) : (b.inlineContent ? inline(b.inlineContent, ctx) : '');
  }
}
function tableRows(t, ctx) {
  const rows = t.rows.map(r => r.map(cell => (cell || [])
    .map(x => (x.type === 'paragraph' || x.type === 'small') ? inline(x.inlineContent, ctx) : block(x, ctx))
    .join(' / ').replace(/\s*\n+\s*/g, ' ').trim()));
  for (const [k, v] of Object.entries(t.extendedData || {})) {
    const [r, c] = k.split('_').map(Number);
    if (v.rowspan > 1) for (let i = 1; i < v.rowspan; i++) if (rows[r + i]) rows[r + i][c] = rows[r][c];
    if (v.colspan > 1) for (let i = 1; i < v.colspan; i++) rows[r][c + i] = rows[r][c];
  }
  const n = Math.max(...rows.map(r => r.length));
  rows.forEach(r => { while (r.length < n) r.push(''); });
  return rows;
}
function tableMd(t, ctx) {
  const rows = tableRows(t, ctx).map(r => r.map(c => c.replace(/\|/g, '\\|')));
  const head = t.header === 'row' ? rows[0] : rows[0].map(() => ' ');
  const body = t.header === 'row' ? rows.slice(1) : rows;
  const f = r => '| ' + r.map(c => c || ' ').join(' | ') + ' |';
  return [f(head), '| ' + head.map(() => '---').join(' | ') + ' |', ...body.map(f)].join('\n');
}

// ---------------- segmentation: every top-level block belongs to exactly one entry ----------------
const entries = [];
const tables = [];
const availability = new Map(); // slug -> {specific:Set, noAdditional:Set, notSupported:Set, text}
let totalTopBlocks = 0, assignedBlocks = 0;

function platformsFromText(s) { return PLATFORMS.filter(p => new RegExp('\\b' + p + '\\b').test(s)); }

for (const [slug, j] of en) {
  const m = meta.get(slug);
  const content = (j.primaryContentSections || []).flatMap(s => s.content || []);
  const hs = [];
  const used = new Set();
  let cur = null, n = 0, tableN = 0;
  const avail = { specific: new Set(), noAdditional: new Set(), notSupported: new Set(), text: [] };
  availability.set(slug, avail);
  const platformCtx = () => {
    const i = hs.findIndex(h => h.anchor === 'Platform-considerations');
    if (i < 0) return null;
    const sub = hs[i + 1];
    if (!sub) return ['(availability)'];
    const found = platformsFromText(sub.text);
    return found.length ? found : [sub.text];
  };
  const uid = base => { let id = base, k = 2; while (used.has(id)) id = `${base}-${k++}`; used.add(id); return id; };
  const newEntry = (type, ruleText) => {
    const tail = type === 'rule' ? kebab(ruleText).split('-').slice(0, 6).join('-') : '_intro';
    const id = uid([slug, ...hs.map(h => h.anchor.toLowerCase()), tail].join('/'));
    const e = {
      id, type, page: slug, title: m.title, section: m.section, group: m.group,
      path: hs.map(h => h.text), anchor: hs.length ? hs[hs.length - 1].anchor : null,
      platforms: platformCtx(), focus: FOCUS[slug] || null, rule: type === 'rule' ? ruleText : null,
      order: n++, _blocks: [], _lead: null,
    };
    entries.push(e);
    return e;
  };
  const collectTables = (b, tab) => {
    if (b.type === 'table') {
      const ctx = makeCtx(slug, j, 'plain');
      const rows = tableRows(b, ctx);
      tables.push({ id: `${slug}/table-${++tableN}`, page: slug, title: m.title, path: hs.map(h => h.text), tab: tab || null, entry: cur ? cur.id : null, header: b.header === 'row' ? rows[0] : null, rows: b.header === 'row' ? rows.slice(1) : rows });
    }
    if (b.type === 'tabNavigator') b.tabs.forEach(t => (t.content || []).forEach(x => collectTables(x, [tab, t.title].filter(Boolean).join(' > '))));
    if (b.type === 'row') b.columns.forEach(c => (c.content || []).forEach(x => collectTables(x, tab)));
    if (b.type === 'aside') (b.content || []).forEach(x => collectTables(x, tab));
  };
  for (const b of content) {
    if (b.type === 'heading') {
      while (hs.length && hs[hs.length - 1].level >= b.level) hs.pop();
      hs.push({ level: b.level, text: b.text, anchor: b.anchor });
      cur = null;
      const pc = platformCtx();
      if (pc && pc[0] !== '(availability)') pc.filter(p => PLATFORMS.includes(p)).forEach(p => avail.specific.add(p));
      continue;
    }
    totalTopBlocks++;
    const first = b.type === 'paragraph' ? b.inlineContent?.[0] : null;
    if (first?.type === 'strong') {
      const ruleText = inline(first.inlineContent, makeCtx(slug, j, 'plain')).trim();
      if (ruleText) {
        cur = newEntry('rule', ruleText);
        cur._lead = b.inlineContent.slice(1);
        assignedBlocks++;
        continue;
      }
    }
    if (!cur) cur = newEntry('intro');
    cur._blocks.push(b);
    assignedBlocks++;
    collectTables(b, null);
    if (cur.platforms && cur.platforms[0] === '(availability)' && b.type === 'paragraph') {
      const txt = inline(b.inlineContent, makeCtx(slug, j, 'plain'));
      avail.text.push(txt);
      for (const sentence of txt.split(/(?<=\.)\s+/)) {
        if (/no additional considerations/i.test(sentence)) platformsFromText(sentence).forEach(p => avail.noAdditional.add(p));
        if (/not supported|isn’t supported|aren’t supported|isn't supported|aren't supported|not available|unavailable/i.test(sentence)) platformsFromText(sentence).forEach(p => avail.notSupported.add(p));
      }
    }
  }
}

// render entry texts + collect link edges
const edges = [];
for (const e of entries) {
  const j = en.get(e.page);
  const ctx = makeCtx(e.page, j, 'plain');
  const lead = e._lead ? inline(e._lead, ctx).trim() : '';
  const rest = blocks(e._blocks, ctx).trim();
  e.text = [lead, rest].filter(Boolean).join('\n\n');
  e.links = [...new Map(ctx.links.map(t => [t.slug + '#' + (t.anchor || ''), t])).values()].filter(t => t.slug !== e.page || t.anchor);
  for (const t of e.links) if (t.slug !== e.page) edges.push({ from: e.page, entry: e.id, to: t.slug, anchor: t.anchor });
  e.url = HIG_URL + e.page + (e.anchor ? '#' + e.anchor : '');
  delete e._blocks; delete e._lead;
}


// ---------------- outputs ----------------
await fs.mkdir(OUT, { recursive: true });
await write('rules.jsonl', entries.map(e => JSON.stringify({ id: e.id, type: e.type, page: e.page, title: e.title, section: e.section, group: e.group, path: e.path, platforms: e.platforms, rule: e.rule, text: e.text, url: e.url })).join('\n') + '\n');
// 7) text corpus (flat, one file per page; images as text)
for (const [slug, j] of en) {
  const m = meta.get(slug);
  const ctx = makeCtx(slug, j, 'md');
  const cm = j.metadata?.customMetadata || {};
  const plats = (cm['supported-platforms'] || '').split(',').map(s => PLATFORM_KEYS[s.trim()]).filter(Boolean);
  const head = ['---', `title: ${yq(j.metadata?.title || m.title)}`, `slug: ${slug}`, `source_url: ${HIG_URL}${slug}`, `section: ${yq(m.section || '')}`, ...(m.group ? [`group: ${yq(m.group)}`] : []), ...(plats.length ? [`platforms: [${plats.join(', ')}]`] : []), `collected: ${COLLECTED}`, '---', ''];
  const body = [`# ${j.metadata?.title || m.title}`, '', inline(j.abstract || [], ctx).trim(), '', ...(j.primaryContentSections || []).map(s => blocks(s.content, ctx))].join('\n');
  await write(`corpus/${slug}.md`, head.join('\n') + body.replace(/\n{3,}/g, '\n\n') + '\n');
}


await write('README.txt', 'Local copy of Apple Human Interface Guidelines, built ' + COLLECTED + ' from developer.apple.com for personal reference.\nContent (c) Apple Inc. Do not redistribute or commit this folder.\n');
console.log('wrote ' + en.size + ' pages and ' + entries.filter(e => e.type === 'rule').length + ' rules to ' + OUT);
