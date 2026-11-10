# Diagnóstico de Falhas e Estabilização no Lunar Pass

Instruções para investigar, classificar e corrigir falhas ao rodar testes recém-criados ou no modo `corrigir`.

---

## 1. Onde Inspecionar a Falha

1. **Terminal e Console do Runner:** Verifique o trecho exato do código, o locator que falhou, o valor esperado e o recebido.
2. **Pasta de Resultados (`test-results/`):**
   - Inspecione screenshots capturados no momento da falha (`screenshot: 'only-on-failure'`).
   - Verifique arquivos de contexto (`error-context.md`) gerados pelo Playwright.
3. **Playwright Trace Viewer:** Se configurado ou gerado no retry (`trace: 'on-first-retry'`), abra o trace para visualizar a linha do tempo e chamadas de rede:
   ```bash
   npx playwright show-trace test-results/.../trace.zip
   ```
4. **Relatório HTML:**
   ```bash
   npx playwright show-report
   ```

---

## 2. Matriz de Classificação de Causas

| Causa Raiz | Sintomas no Lunar Pass | Ação de Correção |
|---|---|---|
| **Colisão no Banco (Dados)** | Erro do PostgreSQL: `duplicate key value violates unique constraint "missions_pkey"` | O ID da missão (`LP-XXXX`) colidiu com outro teste ou com sobra de execução anterior. Certifique-se de chamar `cleanMission` no `beforeEach` e no `afterEach` e use IDs únicos. |
| **Locator Desalinhado** | `locator.click: Target closed` ou `strict mode violation: locator resolved to 2 elements` | O locator não é único ou a tela usa outro papel/rótulo. Ajuste o seletor no Page Object seguindo a prioridade de acessibilidade (Role > Label > Placeholder > TestId). |
| **Sincronização** | O teste falha ocasionalmente esperando uma transição de tela ou alerta | Aguarde explicitamente a visibilidade do elemento de feedback (`expect(app.toast.message).toBeVisible()`). **Nunca** insira `waitForTimeout`. |
| **Ambiente Indisponível** | `net::ERR_CONNECTION_REFUSED at http://localhost:3000` | A aplicação local está fora do ar. Não tente contornar o código. Reporte o bloqueio e entregue como "não executado". |
| **Instabilidade de Rede no Banco** | `getaddrinfo ENOTFOUND aws-0-us-east-2.pooler.supabase.com` | Falha de conexão com a instância do Supabase. Não altere a string de conexão em `db.ts`. Reporte o problema de infraestrutura. |
| **Defeito do Produto** | A aplicação exibe dados ou comportamentos divergentes do **Então** de forma consistente | **Não altere o teste.** A automação cumpriu seu papel ao detectar a não conformidade. Documente a discrepância como defeito e mantenha a asserção original. |

---

## 3. Investigando Testes Instáveis (Flakiness)

Para reproduzir e confirmar se um teste foi estabilizado:

```bash
# Executar o arquivo 5 vezes seguidas EM SÉRIE
npx playwright test playwright/e2e/<modulo>/<arquivo>.spec.ts --repeat-each=5 --workers=1
```

> [!IMPORTANT]
> **Por que `--workers=1` na checagem de repetição?**  
> Se o mesmo arquivo for repetido em paralelo com múltiplos workers, múltiplas instâncias do mesmo teste tentarão inserir simultaneamente a mesma missão com o mesmo ID fixo no PostgreSQL, gerando conflito de chave primária. Executar em série (`--workers=1`) valida a estabilidade da automação sem causar concorrência artificial de massa.

---

## 4. O Que É Proibido na Correção

- **Nunca altere asserções para o teste passar** quando a aplicação apresentar comportamento diferente do requisito.
- **Nunca use `test.skip` ou `retries` locais** para mascarar falhas crônicas.
- **Nunca comente asserções** ou remova etapas do cenário Gherkin.
