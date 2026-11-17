// Anti-hardcode scan: fail on secret-like patterns in committed text files.
import { readdir, readFile } from 'node:fs/promises';
import { join, extname } from 'node:path';

const SKIP_DIRS = new Set(['.git', 'node_modules', 'Operation', 'playwright-report', 'test-results', 'promo', 'assets']);
const SKIP_FILES = new Set(['package-lock.json', 'check-hardcode.mjs']);
const EXTS = new Set(['.js', '.mjs', '.css', '.html', '.json', '.yml', '.yaml', '.md', '.txt', '.example', '.env']);
const PATTERNS = [
  { re: /-----BEGIN [A-Z ]*PRIVATE KEY-----/, why: 'private key material' },
  { re: /\bghp_[A-Za-z0-9]{20,}|\bgithub_pat_[A-Za-z0-9_]{20,}/, why: 'GitHub token' },
  { re: /\bsk-[A-Za-z0-9_-]{20,}/, why: 'API key (sk-...)' },
  { re: /\bAKIA[0-9A-Z]{16}\b/, why: 'AWS access key' },
  { re: /\bxox[baprs]-[A-Za-z0-9-]{10,}/, why: 'Slack token' },
  { re: /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/, why: 'JWT-like token' },
  { re: /(password|passwd|secret|api[_-]?key|token)\s*[:=]\s*['"][^'"\s]{8,}['"]/i, why: 'hardcoded credential assignment' },
  { re: /\b(postgres|postgresql|mysql|mongodb(\+srv)?):\/\/[^/\s'"]*:[^@\s'"]+@/, why: 'credential-bearing connection string' },
];

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) yield* walk(join(dir, entry.name));
    } else if (!SKIP_FILES.has(entry.name) && (EXTS.has(extname(entry.name)) || entry.name.startsWith('.env'))) {
      yield join(dir, entry.name);
    }
  }
}

const failures = [];
for await (const file of walk(process.cwd())) {
  const text = await readFile(file, 'utf8');
  for (const { re, why } of PATTERNS) {
    if (re.test(text)) failures.push(`${file}: ${why}`);
  }
}

if (failures.length) {
  console.error('NO-HARDCODE: GAGAL\n' + failures.join('\n'));
  process.exit(1);
}
console.log('NO-HARDCODE: LULUS (secret pattern scan)');