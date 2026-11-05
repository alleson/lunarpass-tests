# Tarefa: reorganizar a suíte de testes do LunarPass em módulos (mission-control e storefront)

## Contexto
Este repositório é a automação E2E do LunarPass (Playwright + TypeScript, banco PostgreSQL via Kysely).
Hoje existem testes do módulo **mission-control**. Vamos começar a testar o módulo **storefront**, e a estrutura precisa suportar os dois sem virar bagunça.
O arquivo `docs/arquitetura.md` descreve a arquitetura atual. Leia-o primeiro. Não é necessário ler os outros arquivos de `docs/`.

## Regras gerais (valem para todos os passos)
- Trabalhe direto na branch `main`. NÃO crie branch. Sou a única pessoa no projeto.
- Solução SIMPLES. Proibido: Proxy, BasePage/classe base, registro dinâmico de páginas, novas camadas de abstração, novas dependências.
- A fixture `app` continua toda em UM arquivo: `support/index.ts`.
- NÃO execute os testes e NÃO rode `tsc`. Eu mesmo valido depois. O único comando de verificação permitido é `npx playwright test --list`, que apenas lista os testes sem executá-los.
- NÃO altere lógica de teste, locators, asserções, nomes de testes nem dados esperados. Esta tarefa é só de organização, exceto onde o passo disser o contrário.
- NÃO mexa em: credenciais/connection string do banco, criação de `.env`, `storageState`, data factories, `db.destroy()`, tags (`@smoke`/`@regression`). Esses itens estão fora do escopo.
- Use `git mv` ao mover arquivos (preserva histórico). Se o projeto não for um repositório git, use `mv`.
- Faça um commit por passo, com mensagem clara. NÃO faça push.
- Se um comando falhar ou algo não bater com o descrito aqui, PARE, explique o problema e não improvise.
- O arquivo `users.ts` já foi removido de propósito. Confirme apenas que nenhum arquivo o importa.

## Passo 0 — Reconhecimento
1. Leia `docs/arquitetura.md`.
2. Liste a árvore real do projeto (sem `node_modules`). Anote onde realmente está `support/` (raiz ou `tests/support/`) e se existe `pages/home.page.ts` ou algo equivalente para o `home.spec.ts`. A estrutura real manda: onde este prompt diferir do repositório, adapte e registre no relatório final.
3. Rode `npx playwright test --list` e guarde o NÚMERO total de testes listados (será usado para conferência depois).

## Passo 1 — Mover arquivos para pastas por módulo
Estrutura alvo (camadas atuais mantidas, só com subpasta por módulo):

```plaintext
pages/
├── shared/
│   └── toast.ts
├── mission-control/
│   ├── navbar.ts
│   ├── login.page.ts
│   ├── dash.page.ts
│   └── register.page.ts
└── storefront/
    └── (home.page.ts, ver regra abaixo)
support/            (permanece onde está hoje)
tests/
├── mission-control/
│   ├── login.spec.ts
│   └── register.spec.ts
└── storefront/
    └── home.spec.ts
```

Regras:
- `pages/components/navbar.ts` vai para `pages/mission-control/navbar.ts` (é específico do mission-control). `toast.ts` vai para `pages/shared/`.
- Remova a pasta `pages/components/` se ficar vazia.
- Se o `home.spec.ts` já usa um page object, mova-o para `pages/storefront/` com o nome `home.page.ts`. Se o `home.spec.ts` usa locators direto no teste, crie `pages/storefront/home.page.ts` extraindo esses locators e ações EXATAMENTE como estão (mesmos seletores, mesmo comportamento) e use essa classe no teste.
- Corrija TODOS os imports quebrados (os caminhos relativos mudam por causa da pasta extra).
- Ao final do passo: `npx playwright test --list` deve listar o MESMO número de testes do passo 0. Se não, pare e reporte.

## Passo 2 — Agrupar a fixture `app` por módulo
Em `support/index.ts`, mantenha o `createApp` simples, agrupando por módulo:

```typescript
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
```

- Ajuste os imports do arquivo para os novos caminhos.
- Atualize TODOS os testes para o novo formato: `app.loginPage` → `app.mission.loginPage`, `app.dashPage` → `app.mission.dashPage`, `app.registerPage` → `app.mission.registerPage`, `app.navbar` → `app.mission.navbar`, homepage → `app.store.homePage`. `app.toast` continua igual.
- Todos os testes devem continuar importando `test` e `expect` de `support`.
- Verifique: `--list` com o mesmo número de testes do passo 0.

## Passo 3 — Projects por módulo no `playwright.config.ts`
- Crie dois `projects`: `mission-control` (`testDir: './tests/mission-control'`) e `storefront` (`testDir: './tests/storefront'`).
- Mantenha `baseURL` atual no mission-control. Para o storefront, use a MESMA baseURL atual e deixe um comentário `// TODO: confirmar baseURL do storefront`. Não invente URL.
- Preserve todas as opções atuais (`fullyParallel`, `trace`, `screenshot`, `reporter`, etc.). Só mova `testDir`/`baseURL` para dentro dos projects, conforme necessário.
- Verifique: `npx playwright test --list --project=mission-control` e `--project=storefront` listam os testes certos, e a soma bate com o número do passo 0.

## Passo 4 — Isolamento de dados (revisão e ajuste mínimo)
O storefront lista missões publicamente, então testes do mission-control rodando em paralelo podem interferir nele.
1. Procure nos testes IDs de missão fixos (ex.: `LP-0000`) repetidos em MAIS DE UM arquivo `.spec.ts`. Liste-os.
2. Para cada repetição: se o ID está numa constante usada de forma consistente no teste, troque por um ID exclusivo por arquivo/cenário (mantendo o formato `LP-0000`) e confirme que as asserções continuam coerentes. Se trocar for arriscado (o ID aparece em texto esperado fixo ou em dado de banco compartilhado), NÃO altere e registre no relatório.
3. No `home.spec.ts`, procure asserções baseadas em contagem total de missões ou posição na lista. NÃO altere; apenas liste no relatório com arquivo e linha.

## Passo 5 — Limpeza ao final dos testes que semeiam missões
- Nos specs que chamam `cleanAndInsertMission` (ou `cleanMission`) no `beforeEach`, adicione um `test.afterEach` que chame `cleanMission(mission)` para não deixar massa no banco quando o teste falha.
- Só faça isso onde a variável `mission` esteja acessível no escopo do `describe`. Onde não estiver, não force: registre no relatório.
- Não crie fixture nova para isso.

## Passo 6 — Organizar `support/db.ts` (somente comentários)
- NÃO divida o arquivo. Apenas agrupe as funções por assunto com comentários de seção (`// ---- missions ----`, `// ---- reservations ----`, `// ---- tickets ----`, conforme existir) e mova funções de lugar dentro do arquivo se necessário para ficarem juntas.
- Nenhuma mudança de comportamento ou assinatura.

## Passo 7 — Padronização de nome
- Procure no repositório (exceto `node_modules`) variações como `mission-controll`, `missionControll` e padronize para `mission-control` (pastas, config, docs, comentários). Não renomeie identificadores que mudariam comportamento sem checar os usos.

## Passo 8 — Atualizar a documentação (`docs/arquitetura.md`)
- Atualize a árvore de diretórios para a estrutura real final.
- Atualize o exemplo da fixture `app` (agrupada por módulo) na seção de fixtures.
- Documente os `projects` do Playwright e o comando `npx playwright test --project=<modulo>`.
- Adicione a seção **"Como adicionar um novo módulo"**: criar `pages/<modulo>/` e `tests/<modulo>/`, registrar o grupo no `createApp`, criar o `project` no config. Inclua a regra: componente só vai para `pages/shared/` quando mais de um módulo realmente o usar.
- Acrescente uma nota sobre isolamento de dados: cada teste usa ID de missão exclusivo e, no storefront, validar missões específicas semeadas, nunca contagem ou posição.
- A seção 5 (Recomendações e próximos passos) permanece como está.
- Não edite outros arquivos de `docs/`.

## Passo 9 — Conferência final (sem executar testes)
1. `npx playwright test --list`: mesmo número de testes do passo 0.
2. Confirme com `grep` que nenhum import aponta para caminhos antigos (`pages/components`, `users`).
3. `git status` limpo e commits por passo.

## Relatório final (obrigatório, curto)
1. Estrutura final de pastas (árvore).
2. Resultado do `--list` (nº de testes antes e depois).
3. Lista do que você NÃO conseguiu ou preferiu não alterar (passos 4 e 5) e por quê.
4. Pontos em que a estrutura real diferiu deste prompt e como você adaptou.
5. Pendências para decisão humana (ex.: baseURL do storefront).