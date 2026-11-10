import { test as base, expect, Page } from '@playwright/test'

import { LoginPage } from './pages/mission-control/login.page'
import { DashPage } from './pages/mission-control/dash.page'
import { RegisterPage } from './pages/mission-control/register.page'
import { Navbar } from './pages/mission-control/navbar'

import { HomePage } from './pages/storefront/home.page'

import { Toast } from './pages/shared/toast'

const createApp = (page: Page) => ({
  mission: {
    loginPage: new LoginPage(page),
    dashPage: new DashPage(page),
    registerPage: new RegisterPage(page),
    navbar: new Navbar(page),
  },
  store: {
    homePage: new HomePage(page),
  },
  toast: new Toast(page),
})

type App = ReturnType<typeof createApp>

export const test = base.extend<{ app: App }>({
  app: async ({ page }, use) => {
    await use(createApp(page))
  },
})

export { expect }