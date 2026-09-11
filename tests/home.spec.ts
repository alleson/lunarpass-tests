import { test, expect } from '@playwright/test';

test('deve validar o titulo na aba do navegador', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  
  await expect(page).toHaveTitle(/Lunar Pass/);
});

test('deve validar o slogan na página inicial', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  
  const slogan = await page.getByRole('heading', { name: 'Sua viagem para a Lua começa aqui.' });
  await expect(slogan).toBeVisible();
});

