import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { Navbar } from '../pages/components/navbar';
import { DashPage } from '../pages/dash.page';
import { LoginPage } from '../pages/login.page';
import { RegisterPage } from '../pages/register.page';
import { Toast } from '../pages/components/toast';
import { cleanMission, cleanAndInsertMission } from '../support/db';

let loginPage: LoginPage;
let navbar: Navbar;
let dashPage: DashPage;
let registerPage: RegisterPage;
let toast: Toast;

test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    navbar = new Navbar(page);
    dashPage = new DashPage(page);
    registerPage = new RegisterPage(page);
    toast = new Toast(page);

    // Arrange
    await loginPage.go();
    await loginPage.login('buzz@lunarpass.dev', 'pwd123');
    await expect(navbar.logout).toBeVisible();

});

test('deve cadastrar uma nova missão', async ({ page }) => {
    const mission = {
        id: 'LP-0128A',
        rocket: 'Starship',
        baseId: 'aurora',
        departureDate: '2028-01-20',
        returnDate: '2028-01-27',
        price: 1000.00
    };

    await cleanMission(mission);

    await dashPage.addButton.click();
    await expect(registerPage.title).toBeVisible();
    await registerPage.submit(mission);

    await expect(toast.message).toContainText('A nova missão foi adicionada ao catálogo e já está disponível para reservas.');
});

test('não deve cadastrar uma nova missão com ID de missão inválido', async ({ page }) => {
    const mission = {
        id: faker.string.alphanumeric({ length: { min: 5, max: 5 }, casing: 'upper' }),
        rocket: 'Starship',
        baseId: 'aurora',
        departureDate: '2028-01-20',
        returnDate: '2028-01-27',
        price: 1000.00,
    };

    await dashPage.addButton.click();
    await expect(registerPage.title).toBeVisible();
    await registerPage.submit(mission);

    await expect(registerPage.alert).toHaveText('Use o formato LP-0000');
});

test('não deve cadastrar uma nova missão com ID de missão duplicado', async ({ page }) => {
    // Arrange
    const mission = {
        id: 'LP-3001A',
        rocket: 'Starship',
        baseId: 'orion',
        departureDate: '2030-01-20',
        returnDate: '2030-01-27',
        price: 2000.00,
    };

    await cleanAndInsertMission(mission);

    // Act
    await dashPage.addButton.click();
    await expect(registerPage.title).toBeVisible();
    await registerPage.submit(mission);

    // Assert
    await expect(registerPage.alert).toHaveText('Já existe uma missão com este ID.');
});