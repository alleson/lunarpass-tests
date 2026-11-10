# Exemplo: Busca de Missões por Base Lunar no Storefront

Exemplo completo de ponta a ponta no Lunar Pass, traduzindo um cenário da especificação funcional (`docs/storefront.md`) em código automatizado com Playwright e TypeScript.

---

## 1. O Cenário em Gherkin Declarativo

```gherkin
Funcionalidade: Busca de Missões

Contexto:
Dado que o catálogo de missões da Lunar Pass está disponível

Cenário: Buscar missões filtrando por uma base específica
Dado que existe uma missão programada para a Base Lunar Alpha
Quando eu aplico o filtro pela Base Lunar Alpha
Então a lista exibe a missão com destino à Base Lunar Alpha
E o resumo indica os filtros ativos para a Base Lunar Alpha
```

---

## 2. Leitura e Mapeamento do Cenário

| Parte | Tradução para o Lunar Pass | Como Implementar |
|---|---|---|
| **Contexto** | Navegação inicial até a página de missões | `await app.store.missionsPage.go()` no `test.beforeEach` |
| **Dado** | Missão exclusiva para a base Alpha semeada no banco | `cleanAndInsertMission(mission)` via Kysely em `playwright/support/db.ts` |
| **Quando** | Seleção do filtro de base lunar na interface | `await app.store.missionsPage.filterByBase('Alpha')` |
| **Então** | Validação da missão específica do teste na lista | `await expect(app.store.missionsPage.missionCard(mission.id)).toBeVisible()` |
| **E** | Validação do filtro ativo no resumo | `await expect(app.store.missionsPage.activeFilterTag).toHaveText('Base Lunar Alpha')` |

---

## 3. Descoberta de Tela com Playwright MCP

Percorrendo a aplicação em `http://localhost:3000/missions` com o Playwright MCP e consultando `docs/aderencia.md`:
- O filtro de base lunar utiliza checkbox associado ao nome acessível da base: `page.getByRole('checkbox', { name: 'Alpha' })`.
- O botão de aplicar refinamento é um botão semântico: `page.getByRole('button', { name: 'Refinar' })`.
- O card de cada missão possui atributo de domínio estável com o código da missão: `page.locator('[data-mission-code="LP-0127A"]')`.
- O resumo de filtros ativos possui um identificador estável: `page.getByTestId('active-filters')`.

---

## 4. O Page Object (`playwright/support/pages/storefront/missions.page.ts`)

```typescript
import { Page, Locator } from '@playwright/test'

export class MissionsPage {
  readonly page: Page
  readonly refineButton: Locator
  readonly activeFilterTag: Locator

  constructor(page: Page) {
    this.page = page
    this.refineButton = page.getByRole('button', { name: 'Refinar' })
    this.activeFilterTag = page.getByTestId('active-filters')
  }

  async go() {
    await this.page.goto('/missions')
  }

  async filterByBase(baseName: string) {
    await this.page.getByRole('checkbox', { name: baseName }).check()
    await this.refineButton.click()
  }

  missionCard(missionCode: string): Locator {
    return this.page.locator(`[data-mission-code="${missionCode}"]`)
  }
}
```

---

## 5. Registro na Fixture Central (`playwright/support/index.ts`)

O novo Page Object é registrado dentro do grupo `store` da função `createApp`:

```typescript
import { test as base, expect, Page } from '@playwright/test'

// Pages Mission Control
import { LoginPage } from './pages/mission-control/login.page'
import { DashPage } from './pages/mission-control/dash.page'
import { RegisterPage } from './pages/mission-control/register.page'
import { Navbar } from './pages/mission-control/navbar'

// Pages Storefront
import { HomePage } from './pages/storefront/home.page'
import { MissionsPage } from './pages/storefront/missions.page' // [IMPORTADO]

// Shared
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
    missionsPage: new MissionsPage(page), // [DISPONIBILIZADO]
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
```

---

## 6. O Spec de Teste (`playwright/e2e/storefront/search.spec.ts`)

```typescript
import { test, expect } from '../../support'
import { Mission } from '../../support/types'
import { cleanMission, cleanAndInsertMission } from '../../support/db'

const mission: Mission = {
  id: 'LP-0127A',
  rocket: 'Starship',
  baseId: 'alpha',
  departureDate: '2028-05-10',
  returnDate: '2028-05-17',
  price: 1500.00,
}

test.beforeEach(async ({ app }) => {
  // Setup da massa de dados no banco Kysely
  await cleanAndInsertMission(mission)

  // Contexto: navegação inicial
  await app.store.missionsPage.go()
})

test.afterEach(async () => {
  // Limpeza garantida após o teste
  await cleanMission(mission)
})

test('deve buscar missões filtrando por uma base específica', async ({ app }) => {
  // Act
  await app.store.missionsPage.filterByBase('Alpha')

  // Assert
  await expect(app.store.missionsPage.missionCard(mission.id)).toBeVisible()
  await expect(app.store.missionsPage.activeFilterTag).toHaveText('Base Lunar Alpha')
})
```

---

## 7. O Que Observar Neste Exemplo

1. **Injeção de Dependências:** O teste importa `test` e `expect` de `../../support` e consome `app.store.missionsPage`. Nenhuma instanciação manual foi feita.
2. **Isolamento de Dados:** A missão utiliza ID exclusivo (`LP-0127A`), é semeada via `cleanAndInsertMission` e limpa no `test.afterEach`.
3. **Regra de Ouro do Storefront:** O teste não faz asserção de contagem total da lista (`toHaveCount`), pois o catálogo é compartilhado. Ele busca diretamente a missão do teste com `missionCard(mission.id)`.
4. **Padrão Semântico:** Seletores via `getByRole` e atributo funcional `data-mission-code`, sem XPath nem classes CSS.
5. **Page Object Limpo:** A classe `MissionsPage` não contém chamadas a `expect`; todas as asserções estão no bloco `Assert` do spec.
