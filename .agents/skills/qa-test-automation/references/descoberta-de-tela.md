# Descoberta de Tela com Playwright MCP no Lunar Pass

Antes de criar ou estender Page Objects no Lunar Pass, utilize as ferramentas do **Playwright MCP** para inspecionar a interface real da aplicação e mapear elementos semânticos e identificadores estáveis.

---

## 1. Ambiente Local e Rotas da Aplicação

- **URL Base:** `http://localhost:3000`
- **Módulo Mission Control:**
  - Login: `/mission-control/login`
  - Credenciais de teste: `buzz@lunarpass.dev` / `pwd123`
  - Dashboard: `/mission-control/`
  - Cadastro de Missão: `/mission-control/register`
- **Módulo Storefront:**
  - Vitrine / Home: `/`
  - Busca de Missões: `/missions`
  - Reserva e Assentos: `/booking/:missionId`
  - Bases lunares: `Alpha`, `Orion`, `Aurora`, `Selene`
  - Assentos da cabine: `A1`, `A2`, `B1`, `B2`

---

## 2. Procedimento de Descoberta

1. **Acessar a URL:** Abra o navegador na rota inicial necessária pelo Playwright MCP. Se a aplicação não responder em `localhost:3000`, não invente elementos: declare o impedimento de ambiente e interrompa a descoberta.
2. **Obter o Snapshot de Acessibilidade:** Utilize o snapshot para visualizar a árvore semântica do DOM com papéis (`role`), nomes acessíveis (`name`), descrições e estados (`disabled`, `checked`, etc.).
3. **Mapear Ações e Respostas:** Execute as ações do cenário (preenchimento, clique, seleção) e observe a transição da UI, mensagens de erro (`alert`), toasts e renderização de listas.
4. **Fechar a Aba:** **Obrigatório.** Encerre a aba aberta no Playwright MCP imediatamente após finalizar o mapeamento dos elementos.

---

## 3. Estratégia de Seletores (Conforme `docs/aderencia.md`)

Priorize os seletores rigorosamente na seguinte ordem:

| Prioridade | Locator | Aplicação no Lunar Pass | Exemplo |
|---|---|---|---|
| **1** | `getByRole(papel, { name })` | Botões, links, títulos, diálogos, alertas e checkboxes | `page.getByRole('button', { name: 'Buscar missões' })`<br>`page.getByRole('link', { name: 'Reservar' })`<br>`page.getByRole('checkbox', { name: 'Alpha' })`<br>`page.getByRole('heading', { name: 'Programar missão' })` |
| **2** | `getByLabel(rótulo)` | Inputs e comboboxes/selects associados a labels | `page.getByLabel('Base lunar')`<br>`page.getByLabel('Ordenar por')` |
| **3** | `getByPlaceholder(texto)` | Inputs com placeholder descritivo | `page.getByPlaceholder('Informe seu email')`<br>`page.getByPlaceholder('Sua senha secreta')` |
| **4** | Atributos funcionais de domínio | Identificadores de regra de negócio estáveis | `page.locator('[data-mission-code="LP-0127A"]')`<br>`page.locator('a[href="/booking/LP-0127A"]')` |
| **5** | `getByTestId(id)` | Elementos sem representação semântica suficiente | `page.getByTestId('mission-form-return-date')`<br>`mission.getByTestId('departure-date')`<br>`mission.getByTestId('available-seats')` |

### O Que é Estritamente Proibido:
- **XPath Relacional ou com Subida no DOM:** Evite construções como `//span[text()="Alpha"]/..`. Conforme detalhado em `docs/aderencia.md`, seletores dependentes de hierarquia estrutural interna quebram facilmente com refatorações visuais.
- **Classes CSS de Estilização:** Nunca use classes do Tailwind/CSS (`.bg-blue-500`, `.flex`, `.button-primary`) como estratégia de localização.
