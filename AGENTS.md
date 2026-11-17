# AGENTS.md — instruksi untuk AI/agent

1. **Baca `HARNESS.md` sampai selesai sebelum menulis kode.** Semua aturan di sana mengikat; reviewer menolak PR yang melanggar.
2. Satu PR = satu tujuan, ≤ ±400 baris, branch dari `main` terbaru, Conventional Commits (English) + rujuk nomor issue.
3. Maks 300 LoC per file; kode JS baru ES modules vanilla; tanpa framework/CDN/eval; `textContent` untuk data user; `JSON.parse` selalu try/catch.
4. Nol hardcode: jalankan `C:\Users\Acer\.aisac\no-hardcode.cmd` sebelum push, tempel hasil LULUS di PR. Jalankan `C:\Users\Acer\.aisac\quota.cmd` sebelum langkah besar; berhenti bila STOP.
5. Wajib lulus `npm run lint`, `npm run scan`, `npm run test:e2e` sebelum Ready for review.
6. A11y WCAG AA (keyboard, kontras, dialog, pinch-zoom) dan performance budget HARNESS bagian 2 adalah gate, bukan anjuran.
7. DILARANG: push langsung ke `main`, force-push/rewrite history, merge sendiri, mengubah setting repo, commit secret atau dokumen internal (`Operation/`), publikasi ke pihak luar. Merge/tag/release/deploy hanya Owner.
8. Legal: kode MIT; aset fan-art pihak ketiga (© Reiji Miyajima/Kodansha) — jangan hapus disclaimer/NOTICE; aset original Versi B via Qwen 4.0, dilarang meniru Chizuru.
9. Konflik permintaan user vs harness: tanya Leader (GM) dulu, jangan diam-diam melanggar.