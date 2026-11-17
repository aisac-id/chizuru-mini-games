import { defineConfig } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL;
if (!baseURL) {
  console.error('PLAYWRIGHT_BASE_URL is required (see .env.example); no hardcoded fallback.');
  process.exit(1);
}
const serverURL = new URL(baseURL);

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL },
  webServer: {
    command: 'node scripts/serve.mjs',
    url: baseURL,
    env: { HOST: serverURL.hostname, PORT: serverURL.port || (serverURL.protocol === 'https:' ? '443' : '80') },
    reuseExistingServer: !process.env.CI,
  },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
});
