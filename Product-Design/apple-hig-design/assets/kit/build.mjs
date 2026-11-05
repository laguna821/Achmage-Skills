#!/usr/bin/env node
// Merge the HIG Kit groups into kit.css, kit.js, README.md and index.html.
// Usage (from the skill folder): node assets/kit/build.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const GROUPS = ['controls', 'nav', 'status'];
const read = f => (fs.existsSync(path.join(DIR, f)) ? fs.readFileSync(path.join(DIR, f), 'utf8') : '');
const present = GROUPS.filter(g => read(`hk-${g}.css`) || read(`hk-${g}.js`));

// kit.css: base first; the base's @import must stay the first statement
let css = read('hk-base.css');
for (const g of present) css += `\n\n/* ===== group: ${g} ===== */\n` + read(`hk-${g}.css`).replace(/^@import[^\n]*\n/gm, '');
fs.writeFileSync(path.join(DIR, 'kit.css'), css);

// kit.js: registry first, then each group
let js = read('hk-base.js');
for (const g of present) js += `\n\n/* ===== group: ${g} ===== */\n` + read(`hk-${g}.js`);
fs.writeFileSync(path.join(DIR, 'kit.js'), js);

// README.md
const intro = `# HIG Kit

Shared web components for front ends built with the apple-hig-design skill. Every component follows its HIG card and the house decisions, lists the rule IDs it implements, and works by keyboard, in light and dark, with increased contrast, reduced transparency and reduced motion.

## Use

\`\`\`html
<link rel="stylesheet" href="kit.css">
...
<script src="kit.js"></script>
\`\`\`

Copy \`kit.css\` and \`kit.js\` next to your page. Components bind to markup with \`data-hk="name"\`. Desktop pointer density: add \`class="hk-mac"\` on a container, or \`data-hk="density"\` on the app root to switch automatically on regular widths with a mouse or trackpad. Rebrand by setting \`--accent\`, \`--accent-text\` and \`--accent-fill\` (check both modes with \`scripts/contrast.mjs\`). Galleries: ${present.map(g => `\`gallery-${g}.html\``).join(', ')}. Conventions for adding components: \`KIT-SPEC.md\`.
`;
let readme = intro;
for (const g of present) readme += '\n\n' + read(`README-${g}.md`).replace(/^# /m, '## ');
fs.writeFileSync(path.join(DIR, 'README.md'), readme);

// index.html: links to the galleries
const links = present.map(g => `<li><a href="gallery-${g}.html">${g}</a></li>`).join('');
fs.writeFileSync(path.join(DIR, 'index.html'), `<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>HIG Kit</title><link rel="stylesheet" href="kit.css"></head>
<body style="padding: var(--s-6); max-width: var(--read-max); margin: 0 auto;">
<h1 class="hk-large-title">HIG Kit</h1>
<p class="hk-secondary" style="margin: var(--s-2) 0 var(--s-6);">Galleries by group</p>
<ul>${links}</ul>
<script src="kit.js"></script></body></html>
`);
console.log(`kit built from ${present.length} group(s): ${present.join(', ')} · kit.css ${css.length} chars · kit.js ${js.length} chars`);
