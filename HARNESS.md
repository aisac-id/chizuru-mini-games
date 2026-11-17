# HARNESS — chizuru-mini-games

Harness ringan untuk game HTML statis. Pemilik: **GM Games & Entertainment** (Project Lead).
Perubahan harness hanya lewat PR `chore/harness-*`. Semua issue/PR wajib merujuk dokumen ini; reviewer menolak PR yang melanggar.

## 1. Identitas

- Jenis: mini-game web statis (fan-made, non-komersial) — 3 game: Memory Match, Sliding Puzzle, Idle Clicker.
- Stack: HTML + CSS + vanilla JS (ES modules untuk kode baru), tanpa backend, tanpa database, tanpa bundler.
- Hosting: GitHub Pages (`main` / root). Deploy hanya via merge ke `main` oleh Owner.
- Basis harness (diadaptasi, bukan disalin mentah):
  - `Aisac-Indonesia/loop-v5` @ `57d414ccde3ca77f4194666032f4b3942bd5b3aa` — RULES-OF-THE-GAME, TWELVE-FACTOR, CORE-WEB-VITALS, SUPPLY-CHAIN-SECURITY, TESTING-TDD.
  - `aisac-id/harness-extension` @ `2301564c22989c5b11efd2f81f76edf8bcb1ae71` — STANDARDS v1.5 (batas 300 LoC, ES modules, nol hardcode, checklist acceptance).

## 2. Aturan yang berlaku

### Kode & arsitektur
1. **Maks 300 LoC per file** (`.js/.mjs/.css/.html`, termasuk komentar). Bila perubahan membuat file melebihi 300, pecah jadi modul di PR yang sama.
2. Kode JS baru: **ES modules** (`import`/`export`), vanilla, tanpa framework, tanpa CDN eksternal, ikon SVG inline. Font: `system-ui` dipertahankan sebagai pengecualian legacy baseline; standar tipografi UI baru (Versi B) menunggu keputusan Head of Frontend (eskalasi via GM/CTO) — bukan redesign di PR perbaikan.
3. **DILARANG**: `eval`, `new Function`, remote code, jQuery/lodash/moment, library > 50 KB tanpa persetujuan Leader.
4. Identifier, komentar kode, dan commit message: **English** (Conventional Commits, rujuk nomor issue). Dokumen proses & teks UI: Bahasa Indonesia.
5. Semua `JSON.parse` atas data eksternal/localStorage wajib `try/catch` dengan fallback aman.
6. Timer/interval wajib punya lifecycle jelas (start/stop saat layar aktif/tidak); dilarang polling liar; animasi hanya `transform`/`opacity`.
7. Data user dirender dengan `textContent`, bukan `innerHTML`.

### Konfigurasi — nol hardcode (Twelve-Factor III, adaptasi)
8. Tidak ada secret/credential/config per-deploy hardcoded di kode, CI, test, atau docs. Hanya `.env.example` (placeholder) yang di-commit; `.env*` masuk `.gitignore`.
9. Game ini tanpa secret runtime. Angka tuning game (cost, threshold, dst.) boleh sebagai data game, tetapi wajib terpusat di satu modul konfigurasi, bukan tersebar.
10. Infrastruktur bila kelak dipakai (Vercel/Neon/Blob) hanya lewat `C:\Users\Acer\.aisac\vercel-ai.cmd`; env produksi di Vercel.
11. Sebelum push: jalankan `C:\Users\Acer\.aisac\no-hardcode.cmd` dan tempel hasil **LULUS** di deskripsi PR. CI juga menjalankan `scripts/check-hardcode.mjs`.

### Aksesibilitas — WCAG 2.1 AA
12. Semua kontrol interaktif dapat dioperasikan keyboard (Tab/Enter/Space/panah) dan punya nama aksesibel (`button`/`aria-label`). Halaman wajib punya atribut `lang` yang benar pada `<html>`.
13. Kontras teks ≥ 4.5:1; focus visible; target sentuh ≥ 44×44 px.
14. **Pinch-zoom dilarang diblokir**: gate lint menolak keberadaan `maximum-scale` apa pun (termasuk nilai ≥2 — kebijakan ketat agar gate tidak ambigu) dan `user-scalable=no/0` (case-insensitive) pada meta viewport.
15. Modal menang = `role="dialog"`/`<dialog>` dengan focus trap, Esc untuk tutup, fokus kembali ke pemicu.
16. Perubahan skor/status diumumkan lewat `aria-live` seperlunya; gambar punya `alt` bermakna.

### Performance budget
17. Payload awal hub **≤ 300 KB** adalah batas umum maksimum; AC issue #9 lebih ketat (**≤ 110 KB**) dan mengikat untuk optimasi hub — lulus = memenuhi keduanya. Dihitung cold-load: semua resource yang benar-benar diunduh, termasuk gambar layar tersembunyi bila tidak lazy-load. Satuan: KB = 1000 byte (transfer), KiB = 1024 byte. Baseline lama 579 KiB.
18. Gambar kostum: master 720×1080 **AVIF ≤ 50 KB** dengan fallback **WebP ≤ 70 KB** (AC #9); thumb 240×360 ≤ 15 KB, card 400×600 ≤ 40 KB; `loading="lazy"` + `decoding="async"` untuk gambar di luar first-view; `width`/`height` eksplisit (CLS).
19. Gate lab: Lighthouse mobile, LCP ≤ 2,5 s, CLS ≤ 0,1, TBT ≤ 200 ms. Gunakan cold-cache dan catat versi Lighthouse, profil perangkat, CPU/network throttling serta route yang diuji agar hasil dapat diulang. Target field bila CrUX/RUM tersedia: INP ≤ 200 ms, LCP ≤ 2,5 s, CLS ≤ 0,1 pada persentil ke-75; ketiadaan data field dilaporkan sebagai belum terukur, bukan gagal maupun lulus. TBT adalah indikator lab untuk responsivitas, bukan pengukuran atau bukti kelulusan INP. Repo ini tidak diwajibkan menambah RUM untuk memenuhi gate.
20. Tanpa error console pada alur normal.

### Keamanan & legal
21. Dokumen internal **DILARANG** masuk repo (`Operation/` di-gitignore). Tanpa force-push/rewrite history tanpa keputusan Owner.
22. Kode berlisensi **MIT** (file `LICENSE`); aset fan-art **bukan** MIT — tunduk pada `NOTICE` + disclaimer fan-made ID/EN (IP Chizuru Mizuhara © Reiji Miyajima/Kodansha). Kanal takedown: GitHub Issue, respons 24–48 jam (`SECURITY.md`).
23. Aset karakter original (Versi B) boleh dibuat via Qwen 4.0; **dilarang meniru rupa Chizuru/karakter lain**; provenance aset dicatat di `ASSETS.md`.
24. Supply chain: versi dependency **exact** + lockfile di-commit + `npm ci` di CI; cooldown rilis ≥ 3 hari; dependency baru/major wajib review; `npm audit --audit-level=high` gagal di high/critical.

### Pengecualian (dengan alasan)
- DATABASE-RULES, soft-delete, CRUD-one-page, drawer kanan, backend-first (loop-v5 #2–9): **tidak berlaku** — tanpa database/backend; state hanya localStorage.
- Cloudflare edge (#13): **tidak berlaku** — GitHub Pages statis, tanpa form/endpoint/user account; kompensasi: tanpa pengumpulan data pribadi.
- i18n 3 bahasa id/en/ja (#14): **dikecualikan** — game fan-made audiens Indonesia; UI `id`, disclaimer legal `id`+`en`. Bila Versi B go international, evaluasi ulang.
- UX Heuristic benchmark ≥ 9.0 (#12): **diadaptasi** — gate WCAG AA + target sentuh + review UI Designer; skor 3 framework penuh tidak diwajibkan untuk mini-game.
- SRE/PDP penuh (#17–18): **minimal** — tanpa server/data pribadi; cukup privacy notice (localStorage saja) dan runbook takedown.
- Modularisasi `index.html` tunggal: kode baru wajib modul; pemecahan penuh `index.html` → `src/*.js` dijadwalkan P2 (issue #16). Batas 300 LoC tetap mengikat.

## 3. Struktur folder

```
index.html          # shell + game saat ini (maks 300 LoC)
src/                # modul ES baru (maks 300 LoC/file) — tumbuh saat modularisasi
assets/             # gambar kostum (AVIF ≤50 KB, fallback WebP ≤70 KB/aset)
promo/              # brand kit publik
scripts/            # tooling lokal: serve, lint, scan (Node, tanpa deps runtime)
tests/e2e/          # Playwright smoke + alur inti per game
.github/workflows/  # CI: lint + scan + e2e + audit
HARNESS.md AGENTS.md LICENSE NOTICE SECURITY.md ASSETS.md .env.example .gitignore
```

## 4. Variabel environment

| Nama | Fungsi | Contoh (palsu/lokal) |
|---|---|---|
| `PLAYWRIGHT_BASE_URL` | Base URL test e2e lokal | `http://127.0.0.1:4173` |
| `PORT` | Port server statis lokal (`scripts/serve.mjs`); di-set otomatis oleh `playwright.config.mjs` dari `PLAYWRIGHT_BASE_URL` | `4173` |
| `HOST` | Alamat bind server statis lokal; default loopback | `127.0.0.1` |

Tanpa env runtime untuk game statis. Untuk tooling lokal, `PLAYWRIGHT_BASE_URL` wajib di-set (salin dari `.env.example`); `HOST`/`PORT` diturunkan otomatis oleh `playwright.config.mjs`. `.env` lokal di-gitignore; jangan commit nilai asli.

## 5. Definition of Done (setiap PR)

Aksesibilitas dan performance budget wajib terpenuhi pada lingkup yang disentuh PR. Setiap PR dilarang menambah pelanggaran atau memperburuk baseline. Jika area yang disentuh belum memenuhi gate, area tersebut wajib memenuhi gate dalam PR yang sama. Pelanggaran lama di luar lingkup perubahan tetap dilacak pada issue pemiliknya dan dituntaskan di batch yang ditetapkan: keyboard #3, dialog #4, zoom #5, payload #9, timer #10, dan kontras #11. Review mencatat area yang diuji, issue baseline yang masih terbuka, dan bukti non-regresi. Pengecualian baseline ini tidak menghapus larangan secret, dokumen internal baru, atau syarat scan, review, dan QA.

- [ ] Satu tujuan, ≤ ±400 baris perubahan (lockfile generated dikecualikan), Conventional Commits + nomor issue.
- [ ] `npm run lint` LULUS (batas LoC, pola terlarang).
- [ ] `npm run scan` LULUS + tempel hasil `C:\Users\Acer\.aisac\no-hardcode.cmd` (**NO-HARDCODE: LULUS**) di deskripsi PR.
- [ ] `npm run test:e2e` LULUS (CI hijau); test baru untuk perilaku baru/bugfix (regression test).
- [ ] Aksesibilitas & performance budget bagian 2 terpenuhi (bukti: screenshot/Lighthouse bila relevan).
- [ ] Review **Code Reviewer + Security Reviewer** (wajib), plus UI Designer/Performance Engineer bila relevan.
- [ ] **QA GATE: LULUS** dari QA Engineer dengan bukti.
- [ ] Merge hanya oleh **Owner**.

## 6. Review checklist (reviewer)

1. Kebenaran logika & edge case (storage korup, race timer, shuffle/scramble benar).
2. Batas 300 LoC, ES modules, tanpa pola terlarang, tanpa hardcode.
3. Keamanan: tanpa secret/dokumen internal, sanitasi DOM, dependency aman.
4. A11y: keyboard, nama aksesibel, kontras, dialog, zoom.
5. Performa: payload, format/ukuran gambar, lazy-load, lifecycle timer.
6. Legal: atribusi IP, disclaimer, lisensi kode vs aset.
7. Bukti uji ada dan bisa direproduksi; format temuan `[BLOCKER|MAJOR|MINOR|NIT] file:baris, alasan, saran`.

## 7. Alur rilis & bukti rilis

1. Branch (`security/…`, `fix/…`, `feat/…`, `perf/…`, `content/…`, `chore/…`) dari `main` terbaru → commit kecil → push → **Draft PR**.
2. Test lulus → Ready for review → review paralel → QA GATE → **Owner merge** (branch auto-delete).
3. Setelah merge: `git fetch --prune`, branch baru dari `main` terbaru. GitHub Pages deploy otomatis dari `main`.
4. Bukti rilis per batch (disimpan Release Manager): link PR + run CI + komentar QA GATE + screenshot; changelog; tag/release hanya oleh Owner.
5. Rilis besar (Versi B) wajib rencana disetujui Owner sebelum eksekusi.

## 8. Pemilik

Project Lead: **GM Games & Entertainment**. Standar teknis divisi: Head of Frontend (via Frontend Developer/Code Reviewer di grup ini). Keamanan: Security Reviewer. QA gate: QA Engineer.
