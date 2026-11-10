# Resumo da Automação — Lunar Pass

## 1. Identificação do Cenário
- **Módulo:** `[mission-control | storefront | <novo-modulo>]`
- **Funcionalidade:** `[Nome da Funcionalidade]`
- **Cenário:** `[Nome do Cenário Gherkin]`
- **Arquivo de Teste:** `playwright/e2e/<modulo>/<nome>.spec.ts`

---

## 2. Arquitetura e Arquivos Envolvidos
- **Page Objects / Componentes:**
  - `[Caminho do Page Object]` (Criado / Estendido)
- **Fixture Atualizada:**
  - `playwright/support/index.ts` (registrado em `app.<modulo>.<pageObject>`)
- **Massa de Dados e Banco:**
  - `playwright/support/db.ts` (funções utilizadas / adicionadas)
  - **ID da Missão Exclusivo:** `[Ex.: LP-0128A]`
  - **Estratégia de Limpeza:** `cleanMission` no `beforeEach` e `afterEach`

---

## 3. Seletores e Aderência Técnica
- **Estratégia de Locators Adotada:**
  - `[Listar os principais seletores semânticos utilizados, ex.: getByRole, getByLabel, data-mission-code]`
- **Textos Observados na Tela:**
  - `[Registrar caso algum texto esperado tenha sido calibrado diretamente da UI por ausência de detalhe no Gherkin]`
- **Sugestões de Testabilidade:**
  - `[Indicar caso algum elemento tenha demandado data-testid por ausência de semântica de acessibilidade]`

---

## 4. Resultado da Execução
- **Status:** `[Passou | Não Executado | Falhou (Possível Defeito do Produto)]`
- **Comando Utilizado:**
  ```bash
  npx playwright test playwright/e2e/<modulo>/<nome>.spec.ts --project=<modulo>
  ```
- **Conferência de Estabilidade:**
  ```bash
  npx playwright test playwright/e2e/<modulo>/<nome>.spec.ts --repeat-each=5 --workers=1
  ```
- **Detalhes da Falha / Bloqueio (se aplicável):**
  - *Comportamento Esperado:* `[...]`
  - *Comportamento Observado:* `[...]`
  - *Classificação da Causa:* `[Defeito do Produto | Ambiente | etc.]`
