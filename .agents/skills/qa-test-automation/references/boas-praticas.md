# Boas Práticas para Specs de Teste no Lunar Pass

Os arquivos de especificação de teste (`*.spec.ts`) validam os cenários de negócio ponta a ponta (E2E) no Lunar Pass.

---

## 1. Estrutura e Localização dos Specs

- **Localização:** Os testes residem exclusivamente dentro da pasta do módulo correspondente em `playwright/e2e/<modulo>/`:
  - `playwright/e2e/mission-control/`
  - `playwright/e2e/storefront/`
  - `playwright/e2e/<novo-modulo>/`
- **Imports Padrão:** Sempre importe `test` e `expect` estendidos a partir de `support`:
  ```typescript
  import { test, expect } from '../../support'
  ```
- **Consumo de Páginas:** Utilize a fixture `{ app }` injetada pelo Playwright. Nunca importe ou instancie classes de páginas manualmente.
  ```typescript
  test('deve buscar missões filtrando pela base Alpha', async ({ app }) => {
    // app.store.missionsPage...
  })
  ```
  Se precisar de métodos nativos da página (ex.: `expect(page).toHaveTitle(...)`), receba `{ page, app }`.

---

## 2. Estrutura Arrange, Act, Assert (AAA)

Estruture cada teste em três blocos claramente demarcados:

```typescript
test('deve cadastrar uma nova missão com sucesso', async ({ app }) => {
  // Arrange
  const mission: Mission = {
    id: 'LP-0128A',
    rocket: 'Starship',
    baseId: 'aurora',
    departureDate: '2028-01-20',
    returnDate: '2028-01-27',
    price: 1000.00
  }
  await cleanMission(mission)

  // Act
  await app.mission.dashPage.addButton.click()
  await expect(app.mission.registerPage.title).toBeVisible()
  await app.mission.registerPage.submit(mission)

  // Assert
  await expect(app.toast.message).toContainText('A nova missão foi adicionada ao catálogo')
})
```

- **Contexto em `test.beforeEach`:** Ações comuns a todos os testes do arquivo (ex.: autenticar ou navegar até a tela inicial).
- **Limpeza em `test.afterEach`:** Sempre que o teste semear dados no banco de dados via Kysely, garanta a limpeza com `cleanMission` para não deixar resíduos em caso de falha.

---

## 3. Isolamento e Regra de Ouro do Storefront

> [!WARNING]
> **Atenção para o Ambiente Compartilhado no Storefront:**
> 1. Cada teste deve ter seu próprio **ID de missão exclusivo** (ex.: `LP-0128A`, `LP-3001A`), nunca repetido entre arquivos ou cenários.
> 2. O catálogo do Storefront é público e reflete dados compartilhados entre múltiplos testes que rodam em paralelo.
> 3. **NUNCA** valide listas por contagem total (`expect(locator).toHaveCount(X)`) nem por posição fixa (`.first()`, `.nth(0)`).
> 4. Valide a existência e as propriedades **exclusivamente da missão semeada pelo teste**, localizando-a pelo seu código funcional ou nome específico.

---

## 4. Asserções

- Utilize asserções que aguardam assincronamente a estabilização do estado:
  `toBeVisible()`, `toHaveText()`, `toContainText()`, `toHaveURL()`, `toBeDisabled()`.
- Uma asserção para cada **Então** e cada **E** definido no cenário Gherkin. Não adicione asserções redundantes ou inventadas.
- Valores esperados exatos: compare textos e números exatamente como são apresentados na tela para o usuário.
- Para cenários negativos que impedem avanços ou ações, valide o estado visível que comprova o bloqueio (ex.: mensagem de alerta em foco, botão desabilitado ou permanência na mesma rota).

---

## 5. Esperas e Sincronização

- **Proibição absoluta de `waitForTimeout`:** Nunca utilize esperas fixas em milissegundos.
- O Playwright possui auto-waiting inteligente para ações e asserções. Se uma transição demorar (ex.: processamento de simulação de pagamento), aguarde pela mudança de visibilidade do elemento de destino ou alerta.

---

## 6. Nomenclatura e Idiomas

- **Títulos de teste:** Em português do Brasil, refletindo com clareza o cenário de negócio especificado (ex.: `'deve buscar missões filtrando por uma base específica'` ou o nome do cenário Gherkin).
- **Em Esquema do Cenário:** Um `test()` por linha de exemplos, parametrizado com a descrição do caso:
  ```typescript
  test(`validar passageiro com nome de ${tamanho} caracteres`, async ({ app }) => { ... })
  ```
- **Código em inglês:** Variáveis, funções, nomes de arquivos e métodos de Page Objects em inglês (`mission`, `bookingPage`, `seatNumber`). Textos de tela e mensagens em português, exatamente como na aplicação.
