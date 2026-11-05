import { test as base, expect, Page } from '@playwright/test'

import { LoginPage } from '../pages/login.page'
import { Navbar } from '../pages/components/navbar'
import { DashPage } from '../pages/dash.page';
import { RegisterPage } from '../pages/register.page';
import { Toast } from '../pages/components/toast';

const creatApp = (page: Page) => ({
  loginPage: new LoginPage(page),
  navbar: new Navbar(page),
  dashPage: new DashPage(page),
  registerPage: new RegisterPage(page),
  toast: new Toast(page)
})

type App = ReturnType<typeof creatApp>

export const test = base.extend<{ app: App }>({
  app: async ({ page }, use) => {
    await use(creatApp(page))
  }
})

export { expect }