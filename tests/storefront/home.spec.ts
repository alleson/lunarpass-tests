import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/storefront/home.page';

test('deve validar o titulo na aba do navegador', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.go();

  await expect(page).toHaveTitle(/Lunar Pass/);
});

test('deve validar o slogan na página inicial', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.go();

  await expect(homePage.slogan).toBeVisible();
});

