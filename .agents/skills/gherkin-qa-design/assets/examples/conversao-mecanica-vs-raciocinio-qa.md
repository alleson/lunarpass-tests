# Conversão mecânica vs. raciocínio de QA

Pares de comparação para calibrar o que esta skill deve evitar e o que deve fazer.

## Par 1: critério de aceite simples

**Critério recebido:** "Se eu informar um cupom que não pode ser usado, recebo uma mensagem clara e o valor da compra não muda."

### Conversão mecânica (evitar)

**Cenário:** Cupom inválido  
**Dado** que eu tenho um cupom inválido  
**Quando** eu aplico o cupom  
**Então** eu recebo uma mensagem clara  
**E** o valor da compra não muda

**Problemas:**
- "Cupom inválido" é vago e cobre motivos diferentes (inexistente, expirado, mínimo, uso único) que são regras distintas.
- O **Dado** traz o cupom como se fosse contexto, mas o carrinho e seu valor estão ausentes, então "o valor não muda" não é verificável.
- "Mensagem clara" não diz o que o usuário precisa entender.
- Um cenário só, e o defeito passaria em quatro dos cinco motivos.

### Raciocínio de QA (fazer)

1. "Não pode ser usado" tem quais motivos definidos? Inexistente, expirado, mínimo, uso único.
2. Cada motivo é uma classe distinta com resultado observável distinto (o motivo informado).
3. O texto da mensagem não está definido: descrever a intenção, não inventar o texto.
4. Fronteiras (mínimo exato, último dia) não estão definidas: perguntar.

**Resultado:** um cenário por motivo, com carrinho e valor explícitos, e perguntas para as fronteiras. Exemplo do cenário de expirado:

**Cenário:** Aplicar um cupom fora do prazo de validade  
**Dado** que meu carrinho tem R$ 200 em produtos  
**Quando** eu aplico um cupom que já expirou  
**Então** eu devo ser informado de que o cupom está fora do prazo de validade  
**E** o total da minha compra deve continuar R$ 200

## Par 2: estilo imperativo

### Evitar

**Dado** que eu navego para a página de login  
**E** eu digito "cliente@email.com" no campo de e-mail  
**E** eu clico no botão "Entrar"  
**Então** eu vejo o texto "Bem-vindo, Cliente"

### Fazer

**Dado** que eu possuo uma conta ativa  
**Quando** eu me autentico com credenciais válidas  
**Então** eu devo ter acesso ao meu painel principal

**Por quê:** ações no **Quando**, intenção no lugar de interação com a tela, resistente a mudança de layout.

## Par 3: lacuna no artefato

**Critério recebido:** "O cupom exige uma compra mínima."

### Evitar (inventando a regra)

**Cenário:** Cupom com carrinho de exatamente R$ 100  
**Dado** que o cupom exige compra mínima de R$ 100  
**E** meu carrinho tem R$ 100 em produtos  
**Quando** eu aplico o cupom  
**Então** o desconto deve ser aplicado

**Problema:** o artefato não diz se o mínimo é inclusivo. O cenário afirma um comportamento que ninguém definiu e pode ser lido como decisão de negócio.

### Fazer

Não escrever o cenário. Registrar a pergunta: "Com carrinho de exatamente o valor mínimo, o cupom vale?" Depois da resposta do Produto, o cenário é escrito com a regra confirmada.

## Par 4: redundância

### Evitar

Cenários separados para "carrinho de R$ 200" e "carrinho de R$ 300" com cupom válido de 10%, sem regra que diferencie os dois.

### Fazer

Um único cenário representativo da classe "cupom válido". Registrar o descarte da variante equivalente no mapa de variantes.
