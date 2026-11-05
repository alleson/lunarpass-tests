import { test, expect } from '../../support';

test('deve validar o titulo na aba do navegador', async ({ page, app }) => {
  await app.store.homePage.go();

  await expect(page).toHaveTitle(/Lunar Pass/);
});

test('deve validar o slogan na página inicial', async ({ app }) => {
  await app.store.homePage.go();

  await expect(app.store.homePage.slogan).toBeVisible();
});
