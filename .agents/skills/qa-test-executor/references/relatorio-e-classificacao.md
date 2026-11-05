# Relatório e classificação

## Critérios de classificação

- **Passou:** todos os resultados esperados do cenário foram atendidos e **validados objetivamente**.
- **Falhou:** pelo menos um resultado esperado não foi atendido.
- **Bloqueado:** não foi possível executar ou concluir o cenário por impedimento técnico, pré-condição ausente ou informação indispensável indisponível.

Regras de decisão:
- Uma validação não realizada **não é** aprovação. Se algum **Então** não pôde ser verificado, o cenário não passa. Classifique como **Bloqueado** (ou **Falhou** se outro resultado já falhou).
- Se um resultado falhou e os seguintes não puderam ser verificados por causa dele, é **Falhou**.
- Falha por **comportamento diferente do esperado** é **Falhou**. Falha por **não conseguir executar** é **Bloqueado**.

## Conteúdo do relatório

- **Cenário:** nome ou identificação (e a linha de Exemplos, se for Esquema).
- **Status:** Passou, Falhou ou Bloqueado.
- **Data e hora de início:** local.
- **Duração:** tempo total da execução.
- **Resultado observado:** resumo objetivo das validações feitas e do que foi visto, por passo ou por **Então**.
- **Falhas ou bloqueios:** o que ocorreu, em qual etapa, o esperado e o observado.
- **Evidências:** caminhos relativos dos PNGs salvos em `output/`.
- **Encerramento do navegador:** se a aba foi fechada e se o fechamento foi confirmado (e como).

Use o molde `assets/templates/relatorio-de-execucao.md`.

## Boas práticas de redação

- Escreva só o que foi observado. Nada de "provavelmente" ou "deve estar".
- Para **Falhou**: esperado versus observado, lado a lado, e a evidência correspondente.
- Para **Bloqueado**: o impedimento, a etapa em que ocorreu e o que seria necessário para executar.
- Registre as ações de preparação que você realizou (pré-condições estabelecidas pela interface).
- Registre hipóteses do cenário que precisam de confirmação do Produto.
- Seja breve. O relatório é uma prova rastreável, não uma narrativa.

## Execuções múltiplas

Um relatório por cenário (ou por linha de Exemplos). Ao final, se houver mais de um, inclua um resumo curto com o status de cada um.
