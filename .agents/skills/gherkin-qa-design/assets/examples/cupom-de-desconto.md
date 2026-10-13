# Exemplo completo: cupom de desconto no carrinho

> As regras de negócio abaixo são **ilustrativas**, retiradas do guia da equipe. Em um caso real, seriam definidas pelo time nos Três Amigos.

## Artefato recebido

**Título:** Aplicar cupom de desconto no carrinho

**Como** cliente da loja virtual, **eu quero** aplicar um cupom de desconto no meu carrinho de compras, **para que** eu pague menos pelos produtos que desejo comprar.

**Critérios de aceite:**
- Um cupom válido reduz o valor total da minha compra.
- Se eu informar um cupom que não pode ser usado, recebo uma mensagem clara explicando o motivo e o valor da compra não muda.
- Eu posso remover o cupom e voltar ao valor original.
- O desconto sempre reflete o estado atual do meu carrinho.

**Regras consideradas:**
- O cupom de exemplo concede 10% de desconto sobre o valor dos produtos.
- O cupom só vale dentro do prazo de validade.
- O cupom pode exigir um valor mínimo de compra.
- Alguns cupons são de uso único por cliente.

## Etapa 1: Análise dos artefatos

| # | Regra ou informação | Classe | Origem | Observação |
|---|---|---|---|---|
| R1 | Cupom válido reduz o total da compra | Explícita | Critério 1 | |
| R2 | Cupom de exemplo dá 10% sobre o valor dos produtos | Explícita | Regras | Base de cálculo: produtos. Frete não é mencionado |
| R3 | Cupom só vale dentro da validade | Explícita | Regras | |
| R4 | Cupom pode exigir valor mínimo de compra | Explícita | Regras | |
| R5 | Cupom de uso único por cliente | Explícita | Regras | |
| R6 | Cupom não utilizável: mensagem com o motivo e total inalterado | Explícita | Critério 2 | Texto da mensagem não definido |
| R7 | Remover o cupom devolve o valor original | Explícita | Critério 3 | |
| R8 | Desconto reflete o estado atual do carrinho | Explícita | Critério 4 | Deriva-se que alterar o carrinho recalcula o desconto |
| R9 | Cupom inexistente é "não utilizável" | Derivável | Critério 2 | Justificativa: um cupom que não existe não pode ser usado |
| R10 | Se o carrinho cair abaixo do mínimo, o cupom deixa de valer | Derivável | Critério 4 + R4 | Justificativa: o desconto reflete o carrinho atual e o mínimo é condição do cupom |

**Lacunas identificadas** (a investigar): comportamento exatamente no valor mínimo; comportamento no último dia de validade; combinação de mais de um cupom; frete e o desconto; arredondamento de centavos; cupom repetido no mesmo carrinho.

## Etapa 2: Mapa de variantes

| # | Variante | Eixo | Regra | Técnica | Decisão |
|---|---|---|---|---|---|
| V1 | Cupom válido, carrinho R$ 200 | Dado | R1, R2 | Classe válida | Cenário |
| V2 | Cupom inexistente | Dado | R9, R6 | Classe inválida | Cenário |
| V3 | Cupom expirado | Tempo | R3, R6 | Classe inválida | Cenário |
| V4 | Carrinho abaixo do mínimo | Dado | R4, R6 | Classe inválida + limite | Cenário |
| V5 | Cupom de uso único já usado | Histórico | R5, R6 | Classe inválida | Cenário |
| V6 | Remover cupom aplicado | Desfazer | R7 | Estado | Cenário |
| V7 | Reduzir carrinho abaixo do mínimo após aplicar | Antes e depois | R10 | Transição de estado | Cenário (com hipótese) |
| V8 | Carrinho exatamente no valor mínimo | Limite | R4 | Valor-limite | Investigar (P1) |
| V9 | Último dia de validade | Tempo | R3 | Valor-limite | Investigar (P2) |
| V10 | Dois cupons no mesmo carrinho | Combinação | sem regra | | Investigar (P3) |
| V11 | Desconto e frete | Dado | sem regra | | Investigar (P4) |
| V12 | Aplicar outro cupom válido de mesma regra e carrinho de R$ 300 | Dado | R1, R2 | Classe válida | Descartada: equivalente à V1 |

## Etapa 3: Técnicas aplicadas

- **Classes de equivalência:** uma classe válida (V1) e as classes inválidas definidas: inexistente, expirado, abaixo do mínimo, uso único já usado. Um exemplo por classe. V12 foi descartada por ser da mesma classe de V1.
- **Valores-limite:** os limites (mínimo e último dia de validade) existem, mas a regra não diz se são inclusivos. Não escolhi um lado: viraram as perguntas P1 e P2.
- **Transição de estados:** cupom aplicado, removido e invalidado por alteração do carrinho (V6 e V7).
- **Tabela de decisão:** não aplicada. Cada motivo de recusa é independente e a regra não define prioridade entre motivos simultâneos, o que virou a pergunta P5.

## Etapa 4: Especificação

**Funcionalidade:** Cupom de desconto no carrinho

### Caminho principal

**Cenário:** Aplicar um cupom válido  
*Regra de origem: R1, R2*  
**Dado** que meu carrinho tem R$ 200 em produtos  
**Quando** eu aplico um cupom válido de 10% de desconto  
**Então** eu devo ver o desconto de R$ 20 no resumo do carrinho  
**E** o total da minha compra deve ser R$ 180

**Cenário:** Remover um cupom aplicado  
*Regra de origem: R7*  
**Dado** que eu apliquei um cupom válido de 10% de desconto em um carrinho de R$ 200  
**Quando** eu removo o cupom  
**Então** o desconto deve deixar de aparecer no resumo do carrinho  
**E** o total da minha compra deve voltar a ser R$ 200

### Cupons que não podem ser usados

**Contexto:**  
**Dado** que meu carrinho tem R$ 200 em produtos

**Cenário:** Aplicar um cupom inexistente  
*Regra de origem: R9, R6*  
*Hipótese a validar: cupom inexistente é tratado como cupom que não pode ser usado*  
**Quando** eu aplico um cupom que não existe  
**Então** eu devo ser informado de que o cupom é inválido  
**E** o total da minha compra deve continuar R$ 200

**Cenário:** Aplicar um cupom fora do prazo de validade  
*Regra de origem: R3, R6*  
**Quando** eu aplico um cupom que já expirou  
**Então** eu devo ser informado de que o cupom está fora do prazo de validade  
**E** o total da minha compra deve continuar R$ 200

**Cenário:** Aplicar um cupom de uso único que eu já utilizei  
*Regra de origem: R5, R6*  
**Dado** que eu já usei um cupom de uso único em uma compra anterior  
**Quando** eu aplico esse mesmo cupom novamente  
**Então** eu devo ser informado de que o cupom já foi utilizado  
**E** o total da minha compra deve continuar R$ 200

### Valor mínimo de compra

**Cenário:** Aplicar um cupom com valor mínimo de compra não atingido  
*Regra de origem: R4, R6*  
**Dado** que meu carrinho tem R$ 50 em produtos  
**E** o cupom exige uma compra mínima de R$ 100  
**Quando** eu aplico esse cupom  
**Então** eu devo ser informado do valor mínimo necessário para usá-lo  
**E** o total da minha compra deve continuar R$ 50

**Cenário:** Perder o direito ao cupom ao reduzir o carrinho abaixo do valor mínimo  
*Regra de origem: R8, R10*  
*Hipótese a validar: o cupom deixa de valer quando o carrinho fica abaixo do mínimo exigido*  
**Dado** que eu apliquei um cupom com compra mínima de R$ 100 em um carrinho de R$ 120  
**Quando** eu removo um produto e meu carrinho passa a ter R$ 70  
**Então** eu devo ser informado de que o cupom não é mais válido para este carrinho  
**E** o total da minha compra deve ser R$ 70, sem desconto

## Etapa 5: Revisão e perguntas para os Três Amigos

**Revisão:** todos os cenários são declarativos, com ações no **Quando**, em primeira pessoa e com um comportamento cada. As mensagens foram descritas pelo negócio, sem texto fixo. Nenhum valor de fronteira foi assumido.

| # | Pergunta ou hipótese | Por que importa | Relacionado | Quem decide |
|---|---|---|---|---|
| P1 | O valor mínimo é inclusivo? Com carrinho de exatamente R$ 100, o cupom vale? | Define o resultado no limite | R4, V8 | Produto |
| P2 | O cupom vale durante todo o último dia da validade? | Define o resultado no limite de tempo | R3, V9 | Produto |
| P3 | Posso aplicar mais de um cupom ao mesmo carrinho? | Sem regra, o comportamento é indefinido | V10 | Produto |
| P4 | O desconto de 10% incide também sobre o frete? | O texto diz "valor dos produtos", mas o frete não é mencionado | R2, V11 | Produto |
| P5 | Se mais de um motivo de recusa acontecer ao mesmo tempo, qual motivo informar? | Define qual mensagem aparece | R6 | Produto e DEV |
| P6 | Como tratar arredondamento de centavos no desconto? | Afeta o total em valores não redondos | R2 | Produto e DEV |
| P7 | Hipótese: cupom inexistente é tratado como cupom que não pode ser usado (R9). Confere? | Sustenta o cenário do cupom inexistente | R9 | Produto |
| P8 | Hipótese: ao reduzir o carrinho abaixo do mínimo, o cupom é invalidado (R10). Confere? | Sustenta o cenário de alteração do carrinho | R10 | Produto |
