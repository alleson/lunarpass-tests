import { Page, Locator } from '@playwright/test';

export class DashPage {
  readonly page: Page;
  readonly addButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addButton = page.getByRole('link', { name: 'Nova missão' });
  }
}