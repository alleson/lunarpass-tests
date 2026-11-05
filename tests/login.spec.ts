import { test, expect } from '../support';

test.beforeEach(async ({ app }) => {
    // Arrange
    await app.loginPage.go();

});

test('deve autenticar no controle de missões', async ({ app }) => {

    // Act
    await app.loginPage.login('buzz@lunarpass.dev', 'pwd123');

    // Assert
    await expect(app.navbar.logout).toBeVisible();
})

test('não deve autenticar com senha incorreta', async ({ app }) => {

    // Act
    await app.loginPage.login('buzz@lunarpass.dev', 'abc123');

    // Assert
    await expect(app.loginPage.alert).toHaveText('E-mail ou senha inválidos.');
})

test('não deve autenticar com e-mail incorreto', async ({ app }) => {

    // Act
    await app.loginPage.login('teste@lunarpass.dev', 'pwd123');

    // Assert
    await expect(app.loginPage.alert).toHaveText('E-mail ou senha inválidos.');
});

test('não deve autenticar quando a senha não é informada', async ({ app }) => {

    // Act
    await app.loginPage.login('teste@lunarpass.dev', '');

    // Assert
    await expect(app.loginPage.alert).toHaveText('Informe a senha');
})

test('não deve autenticar quando o e-mail não é informado', async ({ app }) => {

    // Arrange
    await app.loginPage.go();

    // Act
    await app.loginPage.login('', 'pwd123');

    // Assert
    await expect(app.loginPage.alert).toHaveText('Informe um e-mail válido');
})

test('não deve autenticar quando o e-mail e senha não são informados', async ({ app }) => {

    // Arrange
    await app.loginPage.go();

    // Act
    await app.loginPage.login('', '');

    // Assert
    await expect(app.loginPage.alert).toHaveText('Informe um e-mail válido');
})

