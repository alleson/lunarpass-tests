# Etapa 1: Análise dos artefatos

## Objetivo

Entender o que o artefato realmente diz, o que ele deixa implícito e o que ele não diz. Nenhum cenário é escrito nesta etapa.

## O que extrair

- **Atores e perfis:** quem interage, com quais permissões.
- **Objetivo de negócio:** o valor que a funcionalidade entrega.
- **Regras de negócio:** condições, cálculos, limites, prazos, restrições.
- **Dados envolvidos:** entradas, estados iniciais, dados de referência.
- **Resultados esperados:** o que o sistema faz, mostra ou registra.
- **Mensagens e comunicações:** se o texto é definido ou apenas a intenção.
- **Restrições e dependências:** integrações, outras funcionalidades, ordem de execução.

## Classificação obrigatória

Toda informação relevante recebe uma classificação:

| Classe | Significado | Tratamento |
|---|---|---|
| **Explícita** | Está escrita no artefato. | Pode virar cenário. Indique a origem (trecho ou critério). |
| **Derivável** | Decorre logicamente do que está escrito. | Pode virar cenário, com a justificativa registrada. Sinalize para validação. |
| **A investigar** | Lacuna, ambiguidade ou contradição. | Não vira cenário afirmativo. Vira pergunta ou hipótese. |

Como decidir entre derivável e a investigar: se duas pessoas razoáveis poderiam concluir comportamentos diferentes a partir do mesmo texto, é a investigar. Derivável exige que a conclusão seja a única coerente com o que está escrito.

## Leitura crítica: perguntas a fazer ao artefato

- Cada termo tem um único significado? ("válido", "ativo", "recente", "grande" são vagos.)
- Há critérios sem valor definido (prazo, percentual, limite, quantidade)?
- O que acontece quando a condição **não** é atendida? O artefato só descreve o caminho feliz?
- Existem regras que se contradizem entre critérios, entre a história e o ticket, ou entre telas e texto?
- Há verbos passivos que escondem o ator ("o cupom é aplicado", por quem?)
- Há critérios não testáveis ("o sistema deve ser seguro", "rápido")? Qual comportamento observável os concretiza?
- O artefato menciona estados (rascunho, ativo, cancelado)? Quais transições são permitidas?
- Há regras que dependem de tempo, de histórico ou de outros dados do usuário?

## Regras de conduta

- **Não complete lacunas com o que "costuma ser".** Se o artefato não diz, não está definido.
- Se um exemplo do artefato conflitar com a regra descrita, registre a contradição, não escolha um lado.
- Preserve os termos do domínio usados pelo negócio. Não os troque por sinônimos técnicos.
- Se o material vier de um ticket com detalhes de implementação (campos, endpoints), extraia a regra de negócio por trás e ignore o mecanismo.

## Saída da etapa

Preencha `assets/templates/analise-dos-artefatos.md` com:
1. Resumo do objetivo e dos atores.
2. Tabela de regras (com classificação e origem).
3. Ambiguidades, lacunas e contradições encontradas.
