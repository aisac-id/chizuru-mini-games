// Lightweight lint: enforce HARNESS.md size limit and forbidden patterns.
import { readdir, readFile } from 'node:fs/promises';
import { join, extname } from 'node:path';

const SKIP_DIRS = new Set(['.git', 'node_modules', 'Operation', 'playwright-report', 'test-results', 'promo', 'assets']);
const EXTS = new Set(['.js', '.mjs', '.css', '.html']);
const MAX_LOC = 300;
const FORBIDDEN = [
  { re: /\beval\s*\(/, why: 'eval is forbidden (HARNESS #3)' },
  { re: /new\s+Function\s*\(/, why: 'new Function is forbidden (HARNESS #3)' },
  { re: /maximum-scale\s*=\s*1|user-scalable\s*=\s*no/, why: 'pinch-zoom must not be blocked (HARNESS #14)' },
];

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) yield* walk(join(dir, entry.name));
    } else if (EXTS.has(extname(entry.name))) {
      yield join(dir, entry.name);
    }
  }
}

const failures = [];
for await (const file of walk(process.cwd())) {
  const text = await readFile(file, 'utf8');
  const lines = text.split('\n').length;
  if (lines > MAX_LOC) failures.push(`${file}: ${lines} LoC > ${MAX_LOC} (HARNESS #1)`);
  for (const { re, why } of FORBIDDEN) {
    if (re.test(text)) failures.push(`${file}: ${why}`);
  }
  if (extname(file) === '.html' && /<html(?![^>]*\blang=)/i.test(text)) {
    failures.push(`${file}: <html> missing lang attribute (HARNESS #12)`);
  }
}

if (failures.length) {
  console.error('LINT: GAGAL\n' + failures.join('\n'));
  process.exit(1);
}
console.log('LINT: LULUS (size limit + forbidden patterns + html lang)');