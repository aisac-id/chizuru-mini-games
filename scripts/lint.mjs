// Lightweight lint: enforce HARNESS.md size limit and forbidden patterns.
import { readdir, readFile } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { pathToFileURL } from 'node:url';

const SKIP_DIRS = new Set(['.git', 'node_modules', 'Operation', 'playwright-report', 'test-results']);
const EXTS = new Set(['.js', '.mjs', '.css', '.html']);
const MAX_LOC = 300;
const FORBIDDEN = [
  { re: /\beval\s*\(/, why: 'eval is forbidden (HARNESS #3)' },
  { re: /new\s+Function\s*\(/, why: 'new Function is forbidden (HARNESS #3)' },
];

export function blocksPinchZoom(html) {
  // Scan EVERY meta tag; parse attributes with or without quotes and spaces around '='.
  const metaRe = /<meta\b[^>]*>/gi;
  let m;
  while ((m = metaRe.exec(html)) !== null) {
    const attrs = {};
    const attrRe = /([a-zA-Z-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/g;
    let a;
    while ((a = attrRe.exec(m[0])) !== null) {
      attrs[a[1].toLowerCase()] = a[2] ?? a[3] ?? a[4] ?? '';
    }
    if ((attrs.name || '').toLowerCase() !== 'viewport') continue;
    const content = attrs.content || '';
    // HARNESS #14 (strict): any maximum-scale declaration or user-scalable=no/0 is rejected.
    if (/maximum-scale\s*=/i.test(content)) return true;
    if (/user-scalable\s*=\s*(no|0)\b/i.test(content)) return true;
  }
  return false;
}

export function countLines(text) {
  if (!text) return 0;
  return text.split('\n').length - (text.endsWith('\n') ? 1 : 0);
}

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) yield* walk(join(dir, entry.name));
    } else if (EXTS.has(extname(entry.name))) {
      yield join(dir, entry.name);
    }
  }
}

async function main() {
  const failures = [];
  for await (const file of walk(process.cwd())) {
    const text = await readFile(file, 'utf8');
    const lines = countLines(text);
    if (lines > MAX_LOC) failures.push(`${file}: ${lines} LoC > ${MAX_LOC} (HARNESS #1)`);
    for (const { re, why } of FORBIDDEN) {
      if (re.test(text)) failures.push(`${file}: ${why}`);
    }
    if (extname(file) === '.html') {
      if (blocksPinchZoom(text)) failures.push(`${file}: viewport blocks pinch-zoom (HARNESS #14)`);
      if (/<html(?![^>]*\blang=)/i.test(text)) failures.push(`${file}: <html> missing lang attribute (HARNESS #12)`);
    }
  }
  if (failures.length) {
    console.error('LINT: GAGAL\n' + failures.join('\n'));
    process.exit(1);
  }
  console.log('LINT: LULUS (size limit + forbidden patterns + viewport zoom + html lang)');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
