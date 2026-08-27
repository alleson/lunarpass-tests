import { test, expect } from '@playwright/test';

test('Valida o Slogan da página inicial', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Lunar Pass/);
});

