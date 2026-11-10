import { Page, Locator, expect } from '@playwright/test';
import { formatDate } from '../../helpers';
import { Mission } from '../../types';

export class RegisterPage {
    readonly page: Page;
    readonly title: Locator;
    readonly alert: Locator;

    constructor(page: Page) {
        this.page = page;
        this.title = page.getByRole('heading', { name: 'Programar missão' });
        this.alert = page.getByRole('alert');
    }

    async submit(mission: Mission) {
        await this.page.getByRole('textbox', { name: 'ID da missão' }).fill(mission.id);
        await this.page.getByRole('textbox', { name: 'Foguete' }).fill(mission.rocket);
        await this.page.getByLabel('Base lunar').selectOption(mission.baseId);
        await this.page.getByRole('textbox', { name: 'Data de partida' }).fill(mission.departureDate);
        await expect(this.page.getByTestId('mission-form-return-date')).toContainText(formatDate(mission.returnDate));
        await this.page.getByRole('spinbutton', { name: 'Preço por passagem (USD)' }).fill(mission.price.toString());

        await this.page.getByRole('button', { name: 'Salvar missão' }).click();
    }
}