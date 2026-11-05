#!/usr/bin/env node
// Serve a folder at http://127.0.0.1 so a browser can preview built pages.
// Many browser tools block file:// URLs; a local server avoids that. No caching, so reloads show edits.
// Usage: node scripts/preview.mjs [folder=.] [--port 4173]
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';

const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log('Usage: node scripts/preview.mjs [folder=.] [--port 4173]\n  Serves the folder at http://127.0.0.1:<port>/ with no caching. Folders without index.html get a file list. Stop with Ctrl+C.');
  process.exit(0);
}
const pi = args.indexOf('--port');
const PORT = pi >= 0 ? Number(args[pi + 1]) : 4173;
const ROOT = path.resolve(args.find((a, i) => !a.startsWith('--') && args[i - 1] !== '--port') || '.');
const TYPES = {
  '.html': 'text/html', '.htm': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.gif': 'image/gif', '.woff2': 'font/woff2', '.woff': 'font/woff', '.md': 'text/plain',
  '.txt': 'text/plain', '.mp4': 'video/mp4', '.pdf': 'application/pdf',
};
const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const textual = t => t.startsWith('text/') || t.endsWith('json') || t.endsWith('svg+xml');

async function send(res, fp) {
  const type = TYPES[path.extname(fp).toLowerCase()] || 'application/octet-stream';
  const body = await fs.readFile(fp);
  res.writeHead(200, { 'content-type': textual(type) ? type + '; charset=utf-8' : type, 'cache-control': 'no-store' });
  res.end(body);
}

const server = http.createServer(async (req, res) => {
  try {
    const urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const fp = path.join(ROOT, urlPath);
    if (fp !== ROOT && !fp.startsWith(ROOT + path.sep)) { res.writeHead(403); res.end('Forbidden'); return; }
    const st = await fs.stat(fp).catch(() => null);
    if (!st) { res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' }); res.end('Not found'); return; }
    if (!st.isDirectory()) { await send(res, fp); return; }
    if (!urlPath.endsWith('/')) { res.writeHead(301, { location: encodeURI(urlPath + '/') }); res.end(); return; }
    const index = path.join(fp, 'index.html');
    if (await fs.stat(index).catch(() => null)) { await send(res, index); return; }
    const items = (await fs.readdir(fp, { withFileTypes: true }))
      .sort((a, b) => (b.isDirectory() - a.isDirectory()) || a.name.localeCompare(b.name));
    const list = items.map(d => {
      const slash = d.isDirectory() ? '/' : '';
      return `<li><a href="${encodeURIComponent(d.name)}${slash}">${esc(d.name)}${slash}</a></li>`;
    }).join('');
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' });
    res.end(`<!doctype html><meta charset="utf-8"><title>${esc(urlPath)}</title><h1>${esc(urlPath)}</h1><ul>${urlPath !== '/' ? '<li><a href="../">../</a></li>' : ''}${list}</ul>`);
  } catch (e) {
    res.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' });
    res.end(String(e.message));
  }
});
server.on('error', e => {
  console.error(e.code === 'EADDRINUSE' ? `Port ${PORT} is in use. Try --port ${PORT + 1}.` : e.message);
  process.exit(1);
});
server.listen(PORT, '127.0.0.1', () => console.log(`Serving ${ROOT} at http://127.0.0.1:${PORT}/  (Ctrl+C to stop)`));
