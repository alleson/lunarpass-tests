# Execução com Playwright MCP

## Ambiente

- **Navegador:** Google Chrome.
- **Modo:** gráfico, com a janela visível (`headless: false`).
- **URL principal:** http://localhost:3000, salvo se o usuário informar outra URL para a execução.
- **Evidências:** pasta `output/` do projeto em questão, em PNG.

O modo do navegador é definido na configuração do servidor Playwright MCP. Se você perceber que ele está em headless e não puder mudar pelas ferramentas, não prossiga em silêncio: classifique como **Bloqueado** e informe o motivo.

## Ferramentas

Use apenas as ferramentas do Playwright MCP. Os nomes variam por versão; confirme as disponíveis antes de começar. Normalmente existem ferramentas para navegar, ler o snapshot de acessibilidade da página, clicar, digitar, selecionar opções, aguardar texto, tirar screenshot, gerenciar abas e fechar a página.

Dê preferência ao **snapshot de acessibilidade** para entender a tela e localizar elementos. Ele mostra o que existe de fato na página, em vez de adivinhar seletores.

## Procedimento

1. **Registre o início:** data e hora locais, obtidas pelos recursos do ambiente (não pela aplicação). Servem para a duração do relatório.
2. **Abra o Chrome em modo gráfico** e acesse a URL principal.
3. **Verifique a acessibilidade da aplicação:** a página carregou e responde? Caso contrário, é **Bloqueado**.
4. **Estabeleça as pré-condições** (ver `interpretacao-gherkin.md`).
5. **Execute os passos do Quando**, na ordem do cenário, uma ação por vez, observando o resultado de cada uma.
6. **Valide cada Então** com o que a tela mostra. Só aprove com a verificação feita.
7. **Capture evidências** PNG conforme a seção abaixo.
8. **Feche a aba** pelo Playwright MCP.
9. **Confirme o fechamento** (por exemplo, listando as abas e verificando que a usada no teste não existe mais).
10. **Emita o relatório.**

## Evidências

- Formato **PNG**, salvas em `output/<cenario>/`. Se `output/` não existir, crie-a com os recursos de gerenciamento de arquivos do ambiente. Isso não autoriza ferramentas alternativas para interagir com a aplicação.
- `<cenario>` é o nome do cenário em minúsculas, sem acentos, com hífens (por exemplo, `aplicar-cupom-valido`).
- Nome do arquivo: ordem e descrição, por exemplo `01-carrinho-com-produtos.png`, `02-cupom-aplicado.png`, `03-falha-total-incorreto.png`.
- Capture o que prova cada resultado relevante. **Sempre** capture falhas e bloqueios.
- Em Esquema do Cenário, inclua a identificação da linha no nome (`linha-2-...`).
- Salve **todas** as evidências antes de fechar a aba.

## Regras obrigatórias

- Não use modo headless, scripts externos, `curl`, Selenium ou ferramentas alternativas para interagir com o navegador e a aplicação.
- Não simule interações, resultados ou evidências.
- Não altere código, dados ou configurações da aplicação para forçar a aprovação.
- Execute somente o cenário fornecido. Não invente etapas, requisitos ou resultados esperados.
- Informação insuficiente para executar ou validar: registre a limitação e não presuma comportamento.
- Aplicação indisponível ou impedimento técnico: **Bloqueado**, com o motivo.
- Resultado esperado não atendido: **Falhou**, com as evidências.
- **O fechamento da aba vale para Passou, Falhou e Bloqueado** (após o início da execução no navegador).
- Erro inesperado no meio da execução: tente fechar a aba em uma etapa de finalização, pelo Playwright MCP, antes de concluir o relatório.
- **Nunca declare a execução concluída sem tentar fechar a aba e confirmar o fechamento.** Se o fechamento falhar, diga isso no relatório.
