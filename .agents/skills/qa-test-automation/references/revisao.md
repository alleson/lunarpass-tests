# Checklist de Revisão da Automação — Lunar Pass

Antes de finalizar qualquer entrega de automação no Lunar Pass, passe rigorosamente por cada item deste checklist. Corrija imediatamente os desvios encontrados.

---

## 1. Fidelidade ao Cenário de Negócio

- [ ] O teste automatiza fielmente o cenário especificado em Gherkin.
- [ ] Existe asserção para cada **Então** e cada **E**, sem asserções a mais nem a menos.
- [ ] Nenhum passo, dado ou regra de negócio foi inventado.
- [ ] Informações e regras em aberto (como itens a investigar de `docs/storefront.md`) foram registradas como dúvidas, sem suposições técnicas.
- [ ] Textos observados na tela e não detalhados na especificação estão listados no resumo final.

---

## 2. Arquitetura PCOM e Injeção de Dependências

- [ ] Os Page Objects e componentes foram criados na pasta do respectivo módulo (`playwright/support/pages/<modulo>/`).
- [ ] A pasta `playwright/support/pages/shared/` contém **apenas** componentes utilizados por mais de um módulo (ex.: `toast.ts`).
- [ ] Novos Page Objects foram devidamente importados e registrados no objeto `createApp` em `playwright/support/index.ts` sob o módulo correspondente.
- [ ] O spec não contém nenhuma instanciação manual de classe (`new PageObject(page)`). O acesso é 100% via fixture `{ app }` (`app.mission.*`, `app.store.*`, `app.toast`).
- [ ] O spec importa `{ test, expect }` exclusivamente de `../../support` (ou caminho relativo ao módulo).
- [ ] Os Page Objects novos não contêm chamadas de `expect` (as validações pertencem à camada de teste).
- [ ] Não foram criadas classes base (`BasePage`), Proxies ou camadas adicionais de abstração.

---

## 3. Gestão e Isolamento de Massa de Dados

- [ ] O teste utiliza **ID de missão exclusivo** no formato padrão (`LP-XXXX`), que não se repete em nenhum outro spec.
- [ ] A preparação de estado de missões/reservas foi realizada via Kysely através de `playwright/support/db.ts`.
- [ ] O teste garante limpeza do estado criado no `beforeEach` e no `afterEach` (`cleanMission`).
- [ ] Novas funções adicionadas a `playwright/support/db.ts` respeitam os comentários temáticos de seção (`// ---- missions ----`, etc.) e têm seus tipos registrados em `types.ts`.
- [ ] **Storefront:** Nenhuma asserção de listagem pública depende de contagem total (`toHaveCount`) ou índice posicional (`first()`). A validação é feita especificamente sobre a missão semeada pelo teste.
- [ ] As credenciais e a connection string do banco em `db.ts` permaneceram intactas.

---

## 4. Estratégia de Seletores e Esperas

- [ ] Os seletores seguem a ordem prioritária de acessibilidade: `getByRole` → `getByLabel` → `getByPlaceholder` → `getByTestId` / atributos de domínio estáveis (`data-mission-code`, links com `href`).
- [ ] Não há seletores com subida no DOM (`/..`), caminhos frágeis de XPath ou seletores baseados em classes CSS do Tailwind.
- [ ] Não há nenhuma chamada a `page.waitForTimeout()`. As esperas ocorrem por auto-waiting e asserções visíveis do Playwright.

---

## 5. Execução e Estabilidade

- [ ] O teste foi executado e validado com o runner do Playwright no project correspondente:
  - `--project=mission-control` ou `--project=storefront`
- [ ] O teste foi executado em série (`--repeat-each=5 --workers=1`) para comprovar estabilidade sem flakiness.
- [ ] O código está limpo, sem `test.only`, `test.skip` ou asserções comentadas.
- [ ] Se a aplicação apresentou falha de produto consistente com o cenário, ela foi devidamente reportada como defeito em vez de ajustar a asserção para passar.
- [ ] Se o ambiente local esteve inacessível, o teste foi entregue com status "não executado" e o motivo foi explicitado.
