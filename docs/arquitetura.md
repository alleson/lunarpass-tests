# Arquitetura e Estrutura de Testes — LunarPass

**Projeto:** LunarPass Test Automation  
**Stack Tecnológica:** Playwright, TypeScript, Kysely, PostgreSQL (Supabase)  
**Objetivo:** Estabelecer o padrão arquitetural, organização de pastas e boas práticas para automação de testes ponta a ponta (E2E) modularizada.

---

## 1. Visão Geral e Princípios Arquiteturais

A arquitetura de testes do **LunarPass** foi projetada para suportar múltiplos módulos (`mission-control`, `storefront`) de forma isolada, garantindo manutenibilidade, confiabilidade, velocidade e baixo acoplamento entre a camada de negócio e os seletores visuais da interface.

### Pilares Arquiteturais

1. **Fixtures First & Dependency Injection (DI):**  
   Eliminação de instanciações manuais de classes (`new LoginPage(page)`) diretamente nos testes. O runner do Playwright é estendido para injetar um fixture centralizado (`app`), agrupado por módulo (`app.mission`, `app.store`), fornecendo acesso tipado e sob demanda a todas as páginas e componentes.

2. **Page Component Object Model (PCOM) Modular:**  
   As páginas e componentes pertencem aos seus respectivos módulos (`pages/mission-control/`, `pages/storefront/`). Apenas componentes efetivamente compartilhados entre dois ou mais módulos residem em `pages/shared/` (como `Toast`).

3. **Data Management Híbrido (Database Direct Seeding):**  
   Controle de pré-condições e massa de dados diretamente no banco de dados via **Kysely**, aplicando operações atômicas de limpeza e inserção (`cleanMission`, `cleanAndInsertMission`). Isso reduz o tempo de preparação de cenários e evita testes lentos baseados em navegação desnecessária de UI.

4. **Locators Semânticos e Resilientes (A11y-driven):**  
   Adoção de localizadores orientados à acessibilidade (`getByRole`, `getByLabel`, `getByPlaceholder`). Evita-se o uso de classes CSS transitórias e caminhos relacionais de XPath (como `/..`), reduzindo a fragilidade dos testes perante alterações de design.

5. **Isolamento e Paralelismo Total:**  
   Cada teste é concebido como uma unidade atômica e independente. Cada teste deve utilizar IDs de missão exclusivos para viabilizar execução multi-worker paralela sem condições de corrida (*race conditions*).

---

## 2. Estrutura de Diretórios do Projeto

Organização do repositório baseada em separação modular de responsabilidades:

```plaintext
lunarpass-tests/
├── docs/                         # Documentações técnicas e guias do projeto
│   ├── aderencia.md              # Análise de aderência de seletores e acessibilidade
│   ├── arquitetura.md            # Este documento de arquitetura
│   ├── storefront.md             # Regras de negócio e especificações funcionais
│   └── prompts/                  # Prompts e instruções de automação
├── pages/                        # Abstração de telas (Page Objects)
│   ├── mission-control/          # Páginas e componentes exclusivos do Mission Control
│   │   ├── dash.page.ts          # Painel de controle e listagem de missões
│   │   ├── login.page.ts         # Formulário de autenticação
│   │   ├── navbar.ts             # Barra de navegação do Mission Control
│   │   └── register.page.ts      # Formulário de cadastro de missões
│   ├── shared/                   # Componentes compartilhados entre múltiplos módulos
│   │   └── toast.ts              # Feedback flutuante e notificações do sistema
│   └── storefront/               # Páginas e componentes exclusivos do Storefront
│       └── home.page.ts          # Vitrine pública e landing page
├── support/                      # Utilitários, conexões de dados e fixtures
│   ├── db.ts                     # Conexão com banco via Kysely e queries de apoio agrupadas
│   ├── helpers.ts                # Funções utilitárias puras (datas, formatações)
│   ├── index.ts                  # Extensão do runner do Playwright e fixture { app } agrupada
│   └── types.ts                  # Tipagem e interfaces do modelo de domínio
├── tests/                        # Especificações de teste (*.spec.ts) por módulo
│   ├── mission-control/          # Testes do módulo Mission Control
│   │   ├── login.spec.ts         # Validações de fluxos de autenticação
│   │   └── register.spec.ts      # Validações de cadastro e integridade de missões
│   └── storefront/               # Testes do módulo Storefront
│       └── home.spec.ts          # Validações da vitrine pública de missões
├── package.json                  # Dependências, scripts e metadados do projeto
├── playwright.config.ts          # Configuração mestre com projects por módulo
└── yarn.lock                     # Lockfile do gerenciador de pacotes
```

---

## 3. Detalhamento das Camadas

### 3.1. Camada de Fixtures e Injeção de Dependências (`support/index.ts`)

A inicialização e o ciclo de vida dos Page Objects são gerenciados através da extensão do objeto `test` nativo do Playwright, com os objetos agrupados pelo módulo de negócio:

```typescript
import { test as base, expect, Page } from '@playwright/test'

import { LoginPage } from '../pages/mission-control/login.page'
import { DashPage } from '../pages/mission-control/dash.page'
import { RegisterPage } from '../pages/mission-control/register.page'
import { Navbar } from '../pages/mission-control/navbar'

import { HomePage } from '../pages/storefront/home.page'

import { Toast } from '../pages/shared/toast'

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
```

**Benefícios:**
- Os testes importam `test` e `expect` diretamente de `../../support`.
- O parâmetro `{ app }` disponibiliza namespaces limpos (`app.mission.*`, `app.store.*`, `app.toast`) com auto-complete no TypeScript.

---

### 3.2. Camada de Abstração de Interface (PCOM) (`pages/`)

* **Páginas por Módulo:** Encapsulam as rotas pertencentes a cada módulo funcional (`pages/mission-control/` e `pages/storefront/`).
* **Componentes Compartilhados:** Componentes residem em `pages/shared/` **apenas** quando mais de um módulo consome o elemento (ex.: `toast.ts`). Componentes específicos (ex.: `navbar.ts` do Mission Control) pertencem à pasta do seu próprio módulo.

#### Diretriz de Seletores (Selector Strategy)

1. **`page.getByRole()`**: Primeira escolha para botões, links, títulos, diálogos e alertas.
2. **`page.getByLabel()`**: Preferencial para inputs associados a rótulos.
3. **`page.getByPlaceholder()`**: Usado para campos de entrada de texto com dicas descritivas.
4. **`page.getByTestId()`**: Utilizado quando a semântica de acessibilidade não for suficiente.
5. **Seletores a Evitar**: XPath absoluto, subidas no DOM (`/..`) e dependência exclusiva de classes de estilização (CSS).

---

### 3.3. Camada de Suporte e Banco de Dados (`support/db.ts`)

O acesso direto ao banco PostgreSQL é feito utilizando **Kysely** com **pg Pool**, com funções agrupadas tematicamente:
- **`// ---- missions ----`**: Funções de ciclo de vida e CRUD de missões (`cleanMission`, `cleanAndInsertMission`, `insertMission`, `deleteMission`).
- **`// ---- reservations ----`**: Operações de reservas (`deleteReservation`).
- **`// ---- tickets ----`**: Operações de bilhetes (`deleteTicket`).

---

### 3.4. Camada de Especificação de Testes (`tests/`)

Os cenários são implementados seguindo a estrutura **Arrange-Act-Assert (AAA)** dentro das pastas dos seus módulos.

> [!IMPORTANT]
> **Nota de Isolamento de Dados:**
> 1. Cada cenário deve utilizar **IDs de missão exclusivos** (ex.: `LP-0128A`, `LP-3001A`) para evitar colisões entre testes paralelos do Mission Control e do Storefront.
> 2. No **Storefront**, sempre validar missões específicas semeadas pelo próprio teste, **nunca asserções baseadas em contagem total de missões ou posição fixa na lista**, pois a vitrine pública reflete dados compartilhados.

---

## 4. Configuração de Execução e Projects (`playwright.config.ts`)

A suíte organiza os módulos em `projects` independentes no Playwright:

```typescript
export default defineConfig({
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'mission-control',
      testDir: './tests/mission-control',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:3000',
      },
    },
    {
      name: 'storefront',
      testDir: './tests/storefront',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:3000', // TODO: confirmar baseURL do storefront
      },
    },
  ],
});
```

### Comandos de Execução

- **Executar todos os testes:**
  ```bash
  npx playwright test
  ```
- **Executar apenas o módulo Mission Control:**
  ```bash
  npx playwright test --project=mission-control
  ```
- **Executar apenas o módulo Storefront:**
  ```bash
  npx playwright test --project=storefront
  ```
- **Listar testes por projeto sem executar:**
  ```bash
  npx playwright test --list --project=mission-control
  npx playwright test --list --project=storefront
  ```

---

## 5. Como Adicionar um Novo Módulo

Para criar um novo módulo no projeto (por exemplo, `checkout` ou `account`), siga o roteiro:

1. **Criar a estrutura de páginas:**  
   Crie a pasta `pages/<modulo>/` e implemente os Page Objects específicos da funcionalidade.  
   *Regra de Componentes:* Um componente só deve ir para `pages/shared/` se for comprovadamente reutilizado por mais de um módulo; caso contrário, deve ficar dentro de `pages/<modulo>/`.

2. **Registrar no App Fixture:**  
   Em `support/index.ts`, importe os Page Objects criados e adicione um novo grupo no objeto `createApp`:
   ```typescript
   const createApp = (page: Page) => ({
     mission: { ... },
     store: { ... },
     novoModulo: {
       minhaPage: new MinhaPage(page),
     },
     toast: new Toast(page),
   })
   ```

3. **Criar a estrutura de testes:**  
   Crie a pasta `tests/<modulo>/` e adicione seus arquivos de especificação `*.spec.ts`, importando `{ test, expect }` de `../../support` e consumindo `app.novoModulo.minhaPage`.

4. **Configurar o Project no Playwright:**  
   Em `playwright.config.ts`, adicione a nova entrada em `projects`:
   ```typescript
   {
     name: 'novo-modulo',
     testDir: './tests/novo-modulo',
     use: {
       ...devices['Desktop Chrome'],
       baseURL: 'http://localhost:3000',
     },
   }
   ```

---

## 6. Recomendações e Próximos Passos de Evolução

> [!NOTE]
> **Aviso de Priorização:** As recomendações descritas abaixo representam oportunidades de evolução técnica e melhorias mapeadas para a maturidade do projeto, porém **não serão priorizadas neste momento**. O foco atual permanece na expansão da cobertura e estabilização dos cenários existentes.

1. **Gestão de Variáveis de Ambiente (`.env`):**  
   Extrair a string de conexão com o banco de dados e URLs base para arquivos `.env`, evitando credenciais codificadas diretamente em arquivos do repositório.

2. **Reaproveitamento de Sessão de Autenticação (`storageState`):**  
   Implementar um mecanismo de *setup* de autenticação global para persistir o estado do login (cookies/localStorage) em arquivo JSON, permitindo que os testes que exigem autenticação iniciem já autenticados sem refazer o login pela UI a cada teste.

3. **Fábrica de Dados Dedicada (Data Factories):**  
   Estruturar geradores de dados com `@faker-js/faker` encapsulados em módulos de *factory*, padronizando a geração de identificadores de missão (`LP-0000`), datas válidas e valores monetários.

4. **Tratamento de Fechamento de Pool no Teardown:**  
   Adicionar um hook de encerramento (`db.destroy()`) no encerramento da suíte para garantir liberação imediata das conexões do pool do PostgreSQL.
