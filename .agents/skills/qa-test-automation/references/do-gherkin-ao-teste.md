# Da Especificação Gherkin ao Teste Playwright no Lunar Pass

O Gherkin declarativo expressa comportamentos e regras de negócio sem citar elementos técnicos de tela (sem tags HTML, IDs ou seletores). A skill traduz cada declaração em código Playwright que respeita rigorosamente a arquitetura do Lunar Pass.

---

## 1. Mapeamento de Conceitos

| Elemento Gherkin | Tradução no Lunar Pass | Como Implementar |
|---|---|---|
| **Funcionalidade** | Arquivo `*.spec.ts` na pasta do módulo | Ex.: `playwright/e2e/storefront/search.spec.ts` para busca de missões |
| **Contexto** | `test.beforeEach` no spec | Setup inicial comum a todos os cenários (ex.: navegar para a home ou autenticar no Mission Control) |
| **Dado** | Bloco `// Arrange` no teste | Pré-condição de dados via **Kysely** (`cleanAndInsertMission` em `playwright/support/db.ts`). Setup via UI apenas quando o próprio teste valida essa navegação |
| **Quando** | Bloco `// Act` no teste | Ações do usuário invocando métodos de Page Objects via fixture `{ app }` (`app.store.*`, `app.mission.*`) |
| **Então** / **E** | Bloco `// Assert` no teste | Asserções do Playwright (`expect(...)`) sobre locators de Page Objects ou componentes compartilhados (`app.toast`) |
| **Esquema do Cenário** | Testes parametrizados | Array com os dados de `Exemplos:` iterado gerando um `test(...)` independente por linha |

---

## 2. Nomenclatura dos Testes

- No Lunar Pass, adote títulos em português que reflitam fielmente o cenário especificado:
  - O nome exato do cenário: `test('Buscar missões filtrando por uma base específica', ...)`
  - Ou o formato comportamental contextualizado: `test('deve buscar missões filtrando por uma base específica', ...)`
- Para **Esquema do Cenário**, identifique a variante testada no título:
  ```typescript
  const examples = [
    { tamanhoNome: 3, tamanhoPassaporte: 5, resultado: 'Sucesso', motivo: 'Mínimos válidos' },
    { tamanhoNome: 120, tamanhoPassaporte: 30, resultado: 'Sucesso', motivo: 'Máximos válidos' },
    { tamanhoNome: 2, tamanhoPassaporte: 15, resultado: 'Erro', motivo: 'Nome abaixo do mínimo' },
  ]

  for (const item of examples) {
    test(`validar passageiro: nome ${item.tamanhoNome} e passaporte ${item.tamanhoPassaporte} (${item.motivo})`, async ({ app }) => {
      // ...
    })
  }
  ```

---

## 3. Gestão de Lacunas e Ambiguidades

| Situação no Requisito | O que Fazer |
|---|---|
| **Regra a investigar (ex.: P1-P4 de `docs/storefront.md`)** | Não assuma decisões técnicas sem confirmação. Registre a dúvida no resumo e automatize apenas os cenários com regras explícitas. |
| **Mensagem de tela não detalhada no Gherkin** | Utilize o texto real identificado na descoberta de tela com o Playwright MCP e anote no resumo: *"Texto observado na UI, não detalhado no Gherkin"*. |
| **Ação impedida por estado da tela (ex.: botão desabilitado)** | Não force a ação. Valide o estado restritivo: `await expect(botao).toBeDisabled()`. |
| **A tela se comporta diferente do Então** | Mantenha a asserção original. Não mude o teste para passar: relate o possível defeito da aplicação. |
