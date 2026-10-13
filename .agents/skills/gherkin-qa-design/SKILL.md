---
name: gherkin-qa-design
description: Design de testes e critérios de aceitação com raciocínio de QA, em pt-BR, que transforma histórias de usuário, critérios de aceite, regras de negócio, requisitos funcionais e tickets em especificações por exemplos escritas em Gherkin declarativo. Analisa criticamente os artefatos, separa o que é explícito, derivável ou a investigar, aplica técnicas (classes de equivalência, valores-limite, tabela de decisão, transição de estados, combinações, fluxos alternativos e de exceção) e nunca inventa regra de negócio. Use SEMPRE que o usuário mencionar Gherkin, cenários, Dado/Quando/Então, critérios de aceite, refinamento de história, Três Amigos, especificação por exemplos, casos de teste a partir de requisitos ou ticket, ou pedir para "escrever cenários", "revisar critérios de aceite" ou "pensar nos testes" de uma funcionalidade, mesmo que a palavra Gherkin não apareça.
---

# Gherkin QA Design

Esta skill transforma artefatos de requisito em uma **especificação por exemplos** em Gherkin declarativo, usando o raciocínio de um QA. O Gherkin aqui é uma **ferramenta de colaboração** entre Produto, DEV e QA: o mesmo texto é lido pelo DEV para desenvolver e pelo QA para testar. O foco é o negócio.

Responda sempre em português do Brasil.

## Princípios inegociáveis

1. **Não converta mecanicamente.** Um critério de aceite não vira um cenário só trocando as palavras por Dado/Quando/Então. Antes de escrever, analise, questione e explore variantes.
2. **Nunca invente regra de negócio.** Tudo o que não estiver definido nos artefatos vira **dúvida**, **hipótese** ou **ponto a investigar**. Não vira cenário afirmativo. Valores, prazos, mensagens e comportamentos ausentes não são preenchidos por suposição.
3. **Distinga a origem de cada informação:** explícita (está no artefato), derivável (decorre logicamente do que está no artefato, com justificativa) ou a investigar (lacuna, ambiguidade ou contradição).
4. **Exemplos representativos, sem redundância.** Cada cenário precisa verificar algo que os outros não verificam.
5. **Declarativo, no nível do negócio.** Sem URLs, ids, cliques, campos ou tags. Detalhes de tela não pertencem à especificação.

## Formato da saída

A saída é **Markdown puro**, pronta para colar no Notion: palavras-chave do Gherkin em **negrito**, sem blocos de código, sem arquivo `.feature`. Não trate de Cucumber, automação ou BDD como método. O foco é a especificação colaborativa.

Escreva em **primeira pessoa** ("meu carrinho", "eu aplico"). Quando houver mais de um ator na mesma funcionalidade, deixe explícito quem age em cada passo. Quando houver **Contexto**, os cenários não repetem o que ele já traz e o primeiro passo do cenário não precisa ser um **Dado**.

## Processo em cinco etapas

Execute as etapas em ordem. Leia o arquivo indicado no início de cada etapa, não antes.

### Etapa 1: Análise dos artefatos
Leia criticamente tudo o que o usuário forneceu. Extraia atores, objetivo, regras, condições, dados, mensagens e restrições. Classifique cada item como explícito, derivável ou a investigar. Registre ambiguidades, lacunas e contradições.
- Leia: `references/01-analise-dos-artefatos.md`
- Use o molde: `assets/templates/analise-dos-artefatos.md`

### Etapa 2: Raciocínio de QA e exploração de variantes
Pergunte "o que muda o comportamento?": perfis, estados, dados, tempo, ordem das ações, falhas de sistema, concorrência. Liste as variantes candidatas.
- Leia: `references/02-raciocinio-qa-e-variantes.md`
- Use o molde: `assets/templates/mapa-de-variantes.md`

### Etapa 3: Aplicação das técnicas de design de testes
Escolha as técnicas que se aplicam às regras encontradas e derive os exemplos representativos. Descarte variantes redundantes e explique o descarte. Não force técnicas sem regra que as justifique.
- Leia: `references/03-tecnicas-de-design-de-testes.md`

### Etapa 4: Escrita do Gherkin declarativo
Escreva os cenários seguindo o guia. Ações do usuário ficam no **Quando**, nunca no **Dado**. Um comportamento por cenário. Mensagens descritas pelo negócio, sem fixar o texto exato quando ele não estiver definido.
- Leia: `references/04-guia-gherkin-declarativo.md`
- Use o molde: `assets/templates/especificacao-gherkin.md`
- Consulte, se precisar do guia completo: `references/fonte/boas-praticas-gherkin-colaboracao.md`

### Etapa 5: Revisão da especificação
Revise o resultado contra o checklist. Corrija o que falhar antes de entregar. Reúna as dúvidas e hipóteses nas perguntas para os Três Amigos.
- Leia: `references/05-revisao-da-especificacao.md`
- Use o molde: `assets/templates/perguntas-para-tres-amigos.md`

## Entrega

Entregue, nesta ordem, na própria conversa (ou em arquivo `.md` se o usuário pedir):

1. **Análise dos artefatos:** regras explícitas, deriváveis e pontos a investigar.
2. **Mapa de variantes e técnicas aplicadas:** resumido, com o que foi descartado e por quê.
3. **Especificação em Gherkin declarativo.**
4. **Perguntas para os Três Amigos:** dúvidas e hipóteses que precisam de decisão do Produto.

Se o artefato for pequeno e o usuário pedir algo rápido, mantenha as etapas mas condense a análise. Nunca pule o registro do que ficou em aberto.

## Exemplos

Para calibrar o nível esperado, consulte `assets/examples/cupom-de-desconto.md` (fluxo completo) e `assets/examples/conversao-mecanica-vs-raciocinio-qa.md` (o que evitar e o que fazer).
