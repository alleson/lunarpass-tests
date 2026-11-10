import { test, expect } from '../../support';
import { faker } from '@faker-js/faker';

import { Mission } from '../../support/types';

import { cleanMission, cleanAndInsertMission } from '../../support/db';



test.beforeEach(async ({ app }) => {
    // Arrange
    await app.mission.loginPage.go();
    await app.mission.loginPage.login('buzz@lunarpass.dev', 'pwd123');
    await expect(app.mission.navbar.logout).toBeVisible();

});

test('deve cadastrar uma nova missão', async ({ app }) => {
    const mission: Mission = {
        id: 'LP-0128A',
        rocket: 'Starship',
        baseId: 'aurora',
        departureDate: '2028-01-20',
        returnDate: '2028-01-27',
        price: 1000.00
    };

    await cleanMission(mission);

    await app.mission.dashPage.addButton.click();
    await expect(app.mission.registerPage.title).toBeVisible();
    await app.mission.registerPage.submit(mission);

    await expect(app.toast.message).toContainText('A nova missão foi adicionada ao catálogo e já está disponível para reservas.');
});

test('não deve cadastrar uma nova missão com ID de missão inválido', async ({ app }) => {
    const mission: Mission = {
        id: faker.string.alphanumeric({ length: { min: 5, max: 5 }, casing: 'upper' }),
        rocket: 'Starship',
        baseId: 'aurora',
        departureDate: '2028-01-20',
        returnDate: '2028-01-27',
        price: 1000.00,
    };

    await app.mission.dashPage.addButton.click();
    await expect(app.mission.registerPage.title).toBeVisible();
    await app.mission.registerPage.submit(mission);

    await expect(app.mission.registerPage.alert).toHaveText('Use o formato LP-0000');
});

test('não deve cadastrar uma nova missão com ID de missão duplicado', async ({ app }) => {
    // Arrange
    const mission: Mission = {
        id: 'LP-3001A',
        rocket: 'Starship',
        baseId: 'orion',
        departureDate: '2030-01-20',
        returnDate: '2030-01-27',
        price: 2000.00,
    };

    await cleanAndInsertMission(mission);

    // Act
    await app.mission.dashPage.addButton.click();
    await expect(app.mission.registerPage.title).toBeVisible();
    await app.mission.registerPage.submit(mission);

    // Assert
    await expect(app.mission.registerPage.alert).toHaveText('Já existe uma missão com este ID.');
});