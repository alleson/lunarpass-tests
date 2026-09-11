import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { Navbar } from '../pages/components/navbar';


let loginPage: LoginPage;
let navbar: Navbar;

test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    navbar = new Navbar(page);

    await loginPage.go();
    
});

test('deve autenticar no controle de missões', async ({ page }) => {

    // Act
    await loginPage.login('buzz@lunarpass.dev', 'pwd123');

    // Assert
    await expect(navbar.logout).toBeVisible();
})

test('não deve autenticar com senha incorreta', async ({ page }) => {

    // Act
    await loginPage.login('buzz@lunarpass.dev', 'abc123');

    // Assert
    await expect(loginPage.alert).toHaveText('E-mail ou senha inválidos.');
})

test('não deve autenticar com e-mail incorreto', async ({ page }) => {

    // Act
    await loginPage.login('teste@lunarpass.dev', 'pwd123');

    // Assert
    await expect(loginPage.alert).toHaveText('E-mail ou senha inválidos.');
});

test('não deve autenticar quando a senha não é informada', async ({ page }) => {

    // Act
    await loginPage.login('teste@lunarpass.dev', '');

    // Assert
    await expect(loginPage.alert).toHaveText('Informe a senha');
})

test('não deve autenticar quando o e-mail não é informado', async ({ page }) => {

    // Arrange
    const loginPage = new LoginPage(page);
    await loginPage.go();

    // Act
    await loginPage.login('', 'pwd123');

    // Assert
    await expect(loginPage.alert).toHaveText('Informe um e-mail válido');
})

test('não deve autenticar quando o e-mail e senha não são informados', async ({ page }) => {

    // Arrange
    const loginPage = new LoginPage(page);
    await loginPage.go();

    // Act
    await loginPage.login('', '');

    // Assert
    await expect(loginPage.alert).toHaveText('Informe um e-mail válido');
})

