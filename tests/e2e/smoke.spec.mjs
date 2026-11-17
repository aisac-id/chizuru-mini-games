import { test, expect } from '@playwright/test';

test('hub loads with three game buttons and no page errors', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await expect(page.locator('#scr-hub')).toBeVisible();
  await expect(page.locator('.hub button')).toHaveCount(3);
  expect(errors).toEqual([]);
});

test('memory match renders a 16-card deck', async ({ page }) => {
  await page.goto('/');
  await page.locator('.hub button').nth(0).click();
  await expect(page.locator('#scr-mem')).toBeVisible();
  await expect(page.locator('#mem .mcard')).toHaveCount(16);
});

test('sliding puzzle renders a 3x3 board', async ({ page }) => {
  await page.goto('/');
  await page.locator('.hub button').nth(1).click();
  await expect(page.locator('#scr-puz')).toBeVisible();
  await expect(page.locator('#puz .ptile')).toHaveCount(9);
});

test('idle clicker tap increases miles', async ({ page }) => {
  await page.goto('/');
  await page.locator('.hub button').nth(2).click();
  await expect(page.locator('#scr-clk')).toBeVisible();
  await expect(page.locator('#clk-miles')).toHaveText('0 miles');
  await page.locator('.tap').click();
  await expect(page.locator('#clk-miles')).toHaveText('1 miles');
});
