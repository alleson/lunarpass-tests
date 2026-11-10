# Page Component Object Model (PCOM) no Lunar Pass

No Lunar Pass, a abstração da interface com o usuário segue o padrão **Page Component Object Model (PCOM) Modular**, garantindo baixo acoplamento, alta manutenibilidade e tipagem estrita no TypeScript.

---

## 1. Organização de Pastas por Módulo

Os Page Objects e componentes são organizados estritamente pelo módulo de negócio a que pertencem:

```plaintext
playwright/support/pages/
├── mission-control/         # Páginas e componentes do módulo Mission Control
│   ├── dash.page.ts         # Painel administrativo
│   ├── login.page.ts        # Autenticação
│   ├── navbar.ts            # Barra de navegação exclusiva do Mission Control
│   └── register.page.ts     # Cadastro de missões
├── storefront/              # Páginas e componentes da vitrine pública de viagens
│   ├── home.page.ts         # Página inicial
│   ├── missions.page.ts     # Listagem e busca de missões
│   └── booking.page.ts      # Escolha de assentos e reserva
└── shared/                  # Componentes COMPARTILHADOS por múltiplos módulos
    └── toast.ts             # Mensagens flutuantes de feedback do sistema
```

> [!IMPORTANT]
> **Regra dos Componentes Compartilhados:**
> Um componente reside em `playwright/support/pages/shared/` **apenas** quando for comprovadamente consumido por mais de um módulo (como o `toast.ts`).
> Componentes específicos de um módulo (como `navbar.ts`, que só existe no Mission Control) devem ficar obrigatoriamente dentro da pasta do módulo correspondente.

---

## 2. Injeção de Dependências e Registro na Fixture `app`

**Nunca** instancie classes de Page Objects diretamente nos testes com `new LoginPage(page)`.
Toda a disponibilização de páginas é feita via injeção de dependências estendendo a fixture `{ app }` em `playwright/support/index.ts`.

### Como Registrar um Novo Page Object ou Componente:

1. Importe a classe no arquivo `playwright/support/index.ts`.
2. Adicione a instância dentro do grupo funcional apropriado (`mission`, `store` ou novo módulo) na função `createApp`:

```typescript
// playwright/support/index.ts
import { test as base, expect, Page } from '@playwright/test'

import { LoginPage } from './pages/mission-control/login.page'
import { DashPage } from './pages/mission-control/dash.page'
import { RegisterPage } from './pages/mission-control/register.page'
import { Navbar } from './pages/mission-control/navbar'

import { HomePage } from './pages/storefront/home.page'
import { MissionsPage } from './pages/storefront/missions.page' // [NOVO]

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
    missionsPage: new MissionsPage(page), // [REGISTRADO]
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

3. Nos testes, o acesso é direto e tipado: `app.mission.*`, `app.store.*`, `app.toast`.

---

## 3. Regras para Construção de Page Objects

1. **Uma classe por arquivo:** nomeada em PascalCase (`<Entidade>Page` ou `<Componente>`), em arquivo `<entidade>.page.ts` ou `<componente>.ts`.
2. **Construtor recebendo `page: Page`:**
   ```typescript
   export class MissionsPage {
     readonly page: Page
     // locators como readonly
     constructor(page: Page) {
       this.page = page
     }
   }
   ```
3. **Locators como propriedades `readonly`:** inicializados no construtor utilizando a estratégia de seletores do Lunar Pass (ver `docs/aderencia.md` e `references/descoberta-de-tela.md`).
4. **Locators dinâmicos como métodos auxiliares:** quando um elemento depende de parâmetro (ex.: código de missão, assento), declare um método que retorna o `Locator`:
   ```typescript
   missionItem(missionCode: string): Locator {
     return this.page.locator(`[data-mission-code="${missionCode}"]`)
   }
   
   seatButton(seatNumber: string): Locator {
     return this.page.getByRole('button', { name: new RegExp(`Assento ${seatNumber}`) })
   }
   ```
5. **Ações como métodos declarativos:** métodos representam ações do usuário em inglês (`go()`, `search()`, `selectSeat()`), recebendo valores por parâmetro.
6. **Navegação com rotas relativas:** use caminhos relativos (`await this.page.goto('/missions')`), aproveitando a `baseURL` configurada no project do Playwright.
7. **Sem `expect` dentro do Page Object:** as validações de negócio pertencem exclusivamente aos testes (*Assert* no spec). Exceção controlada: asserções de preenchimento ou renderização reativa indispensáveis para sincronização de formulários da própria tela.
8. **Sem dados de teste hardcoded:** não inclua nomes de passageiros, credenciais ou valores financeiros dentro do Page Object.
9. **Simplicidade acima de tudo:** É **terminantemente proibido** criar `BasePage`, classes abstratas, proxies dinâmicos ou novas camadas de abstração. O projeto prioriza código direto, legível e padrão.
