// Minimal static file server for local e2e tests. No dependencies.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, isAbsolute, join, normalize, relative, resolve } from 'node:path';

const ROOT = resolve(process.cwd());
const HOST = process.env.HOST;
const PORT = Number(process.env.PORT);
if (!HOST || !PORT) {
  console.error('HOST and PORT are required (see .env.example); refusing to start with hardcoded defaults.');
  process.exit(1);
}
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.md': 'text/plain; charset=utf-8',
};

createServer(async (req, res) => {
  try {
    const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
    const rel = normalize(urlPath === '/' ? 'index.html' : urlPath.slice(1));
    // Defense-in-depth: never serve dotfiles (.env) or internal Operation/ docs.
    if (rel.split(/[\\/]/).some((seg) => seg.startsWith('.') || seg === 'Operation')) {
      res.writeHead(403).end('Forbidden');
      return;
    }
    const file = resolve(join(ROOT, rel));
    const relToRoot = relative(ROOT, file);
    if (relToRoot.startsWith('..') || isAbsolute(relToRoot)) {
      res.writeHead(403).end('Forbidden');
      return;
    }
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': TYPES[extname(file)] || 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404).end('Not found');
  }
}).listen(PORT, HOST, () => {
  console.log('Serving ' + ROOT + ' on ' + HOST + ':' + PORT);
});
