# Gherkin QA Design: Storefront Lunar Pass

## 1. Análise dos Artefatos

### Resumo
- **Objetivo de negócio:** Permitir que viajantes busquem missões espaciais, escolham seus assentos na cabine, informem os dados dos passageiros, realizem o pagamento e recebam o ticket de confirmação da reserva.
- **Atores e perfis:** Viajante.

### Regras identificadas

| # | Regra ou informação | Classe | Origem | Observação |
|---|---|---|---|---|
| R1 | 4 bases lunares disponíveis (Alpha, Orion, Aurora, Selene) e missões de ida e volta (7 dias). | Explícita | Busca | |
| R2 | Busca sem seleção de bases (ou com todas) deve retornar missões para todas as bases. | Explícita | Busca | |
| R3 | Missões totalmente ocupadas aparecem como "Esgotado" e não podem ser reservadas. | Explícita | Busca | |
| R4 | Máximo de 4 assentos por missão na cabine do foguete (A1, A2, B1, B2). | Explícita | Assentos | |
| R5 | Ocupação obedece os estados: disponível, selecionado e ocupado (este último bloqueia reserva). | Explícita | Assentos | |
| R6 | Dados de passageiro: Nome (3 a 120 caracteres) e Passaporte (5 a 30 caracteres, salvo em uppercase). | Explícita | Passageiros | Exige validação de limites. |
| R7 | Pagamento simulado com cartões de teste definindo a aprovação. Demais válidos dão erro de dados. | Explícita | Pagamento | |
| R8 | Conflito de assentos: se outro comprar durante o fluxo, reserva é bloqueada no momento do pagamento. | Explícita | Pagamento | |
| R9 | O que acontece financeiramente no simulador caso o pagamento passe mas a reserva falhe por conflito. | A investigar | Pagamento | Ponto em aberto no documento. |
| R10 | Regra de exibição de missões cuja data de lançamento já ocorreu (missões passadas). | A investigar | Busca | Premissa sem regra de negócio definida. |

### Ambiguidades, lacunas e contradições
- Não há menção sobre trava de tempo (lock) do assento enquanto o viajante está preenchendo o checkout. Assumimos que o assento fica livre para concorrência até o momento exato do pagamento.

## 2. Mapa de Variantes

| # | Variante (o que muda o comportamento) | Eixo | Regra de origem | Técnica | Decisão |
|---|---|---|---|---|---|
| V1 | Quantidade de bases no filtro (0, 1, 4) | Filtro | R2 | Partição de Equivalência | Cenário |
| V2 | Quantidade de resultados encontrados (0, >0) | Estado | R1 | Tabela de Decisão | Cenário |
| V3 | Assentos selecionados (0, 1, 4) | Estado | R4 | Análise de Valor Limite | Cenário |
| V4 | Tamanho do nome do passageiro (2, 3, 120, 121) | Dados | R6 | Análise de Valor Limite | Esquema de Cenário |
| V5 | Tamanho do passaporte (4, 5, 30, 31) | Dados | R6 | Análise de Valor Limite | Esquema de Cenário |
| V6 | Bandeira e status do cartão (Aprovado, Negado, Incorreto) | Dados | R7 | Partição de Equivalência | Cenário |
| V7 | Concorrência de assento no final do fluxo | Concorrência | R8 | Fluxo Alternativo | Cenário |
| V8 | Data da partida (passado vs futuro) | Tempo | R10 | - | Investigar (P2) |

### Técnicas aplicadas
- **Análise de Valor Limite e Partição de Equivalência:** Aplicadas aos dados de entrada dos passageiros (limites de caracteres) e no filtro de busca (selecionar nenhuma vs selecionar todas gera a mesma resposta).
- **Transição de Estados:** Observada no ciclo de vida do assento (de disponível para selecionado, de disponível para ocupado, e bloqueio na concorrência).

## 3. Especificação em Gherkin Declarativo

### Funcionalidade: Busca de Missões

**Contexto:**
**Dado** que o catálogo de missões da Lunar Pass está disponível

**Cenário:** Buscar missões para todas as bases lunares disponíveis
*Regra de origem: R2*
**Quando** eu busco missões sem aplicar filtro de base lunar
**Então** eu visualizo missões com destino a qualquer uma das quatro bases
**E** os resultados são ordenados pela data de partida mais próxima

**Cenário:** Buscar missões filtrando por uma base específica
*Regra de origem: R1*
**Quando** eu aplico o filtro pela Base Lunar Alpha
**Então** a lista exibe apenas missões com destino à Base Lunar Alpha
**E** o resumo indica quais filtros estão ativos e a quantidade de resultados

**Cenário:** Lidar com ausência de missões para os filtros
*Regra de origem: R1*
**Dado** que não existem missões vigentes para a Base Lunar Aurora
**Quando** eu aplico o filtro por essa base
**Então** eu sou avisado de que nenhuma missão atende aos filtros
**E** visualizo um atalho para limpar a busca e ver todas as missões

**Cenário:** Missão esgotada aparece nos resultados sem opção de reserva
*Regra de origem: R3*
**Dado** que existe uma missão para a Base Lunar Selene sem assentos disponíveis
**Quando** eu busco por essa base
**Então** essa missão aparece nos resultados identificada como "Esgotado"
**E** eu não tenho a opção de iniciar a reserva para ela

### Funcionalidade: Mapa de Assentos

**Contexto:**
**Dado** que eu iniciei a reserva de uma missão com vagas

**Cenário:** Impedir o avanço sem seleção mínima de assentos
*Regra de origem: R4*
**Quando** eu tento avançar para a etapa de passageiros sem escolher nenhum assento
**Então** o sistema não permite o avanço
**E** eu sou instruído a selecionar pelo menos um lugar na cabine

**Cenário:** Avançar com seleção máxima de assentos permitida
*Regra de origem: R4*
**Quando** eu seleciono todos os quatro assentos disponíveis (A1, A2, B1 e B2)
**Então** o valor total é calculado para os quatro passageiros
**E** eu consigo avançar para a identificação dos passageiros

**Cenário:** Tentar selecionar assento já ocupado
*Regra de origem: R5*
**Dado** que o assento A1 já foi comprado em outra reserva
**Quando** eu tento selecionar o assento A1
**Então** a seleção não é efetuada
**E** eu sou avisado de que o lugar está ocupado e preciso escolher outro

### Funcionalidade: Passageiros

**Contexto:**
**Dado** que eu selecionei assentos e avancei para a etapa de passageiros

**Esquema do Cenário:** Validar os limites dos dados de identificação obrigatórios
*Regra de origem: R6*
**Quando** eu preencho um formulário de passageiro com um nome de <tamanho_nome> caracteres e passaporte de <tamanho_passaporte> caracteres
**Então** a validação retorna <resultado>
**E** no caso de erro, a mensagem indica o campo inválido e este ganha foco

**Exemplos:**
| tamanho_nome | tamanho_passaporte | resultado | justificativa técnica         |
|--------------|--------------------|-----------|-------------------------------|
| 3            | 5                  | Sucesso   | Mínimos válidos permitidos    |
| 120          | 30                 | Sucesso   | Máximos válidos permitidos    |
| 2            | 15                 | Erro      | Nome abaixo do limite mínimo  |
| 121          | 15                 | Erro      | Nome acima do limite máximo   |
| 30           | 4                  | Erro      | Passaporte abaixo do limite   |
| 30           | 31                 | Erro      | Passaporte acima do limite    |

### Funcionalidade: Pagamento e Emissão do Ticket

**Contexto:**
**Dado** que eu preenchi os dados dos passageiros corretamente e acessei o pagamento

**Cenário:** Emissão de tickets com sucesso após pagamento aprovado
*Regra de origem: R7*
**Quando** eu submeto um pagamento com um cartão de teste válido
**Então** minha reserva é confirmada com um código de seis caracteres
**E** é emitida uma passagem para cada passageiro associado aos assentos
**E** recebo a informação de que a cobrança foi apenas uma simulação

**Cenário:** Manter dados na tela quando o pagamento é recusado
*Regra de origem: R7*
**Quando** eu submeto o pagamento utilizando um cartão não pertencente aos de teste
**Então** o pagamento não é aprovado por dados incorretos
**E** eu permaneço na tela de pagamento com meus dados preservados para corrigir o erro

**Cenário:** Bloqueio da reserva por concorrência de assentos no momento do processamento
*Regra de origem: R8*
**Dado** que os assentos da minha seleção foram confirmados por outra pessoa instantes antes
**Quando** eu submeto o pagamento
**Então** a minha reserva falha
**E** eu sou avisado de que o assento acabou de ser ocupado e preciso escolher outro lugar

## 4. Perguntas para os Três Amigos

| # | Pergunta ou hipótese | Por que importa | Regra relacionada | Quem decide |
|---|---|---|---|---|
| P1 | **Como lidamos com o "estorno" caso o pagamento seja aprovado, mas a reserva falhe por conflito de assento na hora H?** Haverá mensagem sobre estorno para acalmar o viajante na simulação? | Previne confusão na experiência do usuário e define a mensagem de erro correta. | R9 (Pagamento e Assentos) | Produto |
| P2 | **Missões cujas datas de partida já ocorreram continuam no catálogo?** Se sim, o usuário pode comprar passagem para o passado? | Evita reservas ilógicas caso não haja um filtro automático de expiração. | R10 (Busca de Missões) | Produto |
| P3 | **Existe algum mecanismo de retenção temporária (lock) dos assentos?** Por exemplo, ao selecionar, o assento fica "reservado" por 10 minutos para garantir o pagamento pacífico? | Impacta a quantidade de cenários de concorrência e a arquitetura do sistema. | Assentos / Pagamento | Produto e DEV |
| P4 | **Há opção de cancelamento de reservas prontas?** O texto não cita essa jornada. Se houver, missões Esgotadas poderiam reabrir vagas. | Define se precisamos tratar eventos de missões que "voltam a ter lugares". | N/A | Produto |
