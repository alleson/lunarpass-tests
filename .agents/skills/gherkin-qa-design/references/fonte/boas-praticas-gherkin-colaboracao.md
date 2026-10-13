# Boas Práticas de Gherkin como Ferramenta de Colaboração

## 1. Propósito deste documento

Este documento reúne as discussões, decisões e argumentos sobre o uso do Gherkin no desenvolvimento de software com qualidade, transformados em orientações práticas para times de Produto, DEV e QA.

A ideia central que guia todas as orientações abaixo:

> O Gherkin é uma ferramenta de **colaboração** para desenvolver software com qualidade. Ele serve para o time se alinhar sobre o comportamento esperado do software, com foco no negócio.

---

## 2. O que é Gherkin

O Gherkin é uma linguagem de domínio específico (DSL) legível por humanos, criada para descrever o comportamento de um software. Ele usa palavras-chave simples (**Dado**, **Quando**, **Então**) para documentar regras de negócio de um jeito que qualquer pessoa da equipe consiga entender e validar.

Estrutura típica de um cenário:

**Funcionalidade:** Saque no Caixa Eletrônico  
**Cenário:** Saque com saldo suficiente  
**Dado** que o cliente tem R$ 500 na conta  
**Quando** ele solicita um saque de R$ 100  
**Então** o caixa eletrônico deve liberar o dinheiro  
**E** o saldo da conta deve ser atualizado para R$ 400

---

## 3. Princípio 1: Gherkin é uma linguagem comum do time

**Orientação:** use o Gherkin primeiro para alinhar expectativas de negócio e criar entendimento compartilhado entre as disciplinas.

**Na prática:**

- O Gherkin cumpre seu papel no refinamento, nas reuniões de alinhamento e no direcionamento de testes exploratórios.
- Ele funciona como um contrato visual de qualidade para o time.
- Todos leem o mesmo arquivo, e cada disciplina extrai dele um valor diferente (veja o Princípio 2).

**Observação registrada na conversa:** essa visão é baseada na experiência prática de QA, e o argumento não depende de concordância universal. É uma posição fundamentada em experiência.

---

## 4. Princípio 2: O que cada papel ganha com o Gherkin

| Papel | Foco principal | Maior benefício |
|---|---|---|
| Produto (PO/PM) | Regras de negócio e valor entregue | Traduz requisitos vagos em critérios de aceite absolutos |
| Desenvolvimento | Implementação e arquitetura | Recebe especificações claras que guiam a criação do código |
| Qualidade (QA) | Cobertura de cenários | Ganha uma base estruturada para planejar e executar testes |

### 4.1 Visão de Produto (o "O Quê")

Para PM e PO, o Gherkin é uma ferramenta de comunicação e um contrato de escopo.

- **Documentação viva:** substitui documentos de requisitos extensos e desatualizados por cenários reais de uso.
- **Critérios de aceite claros:** elimina ambiguidade. Em vez de pedir "o sistema deve ser seguro", o Produto define cenários exatos, como o de bloqueio de senha.
- **Alinhamento de negócios:** permite que stakeholders validem a lógica do sistema antes de uma linha de código ser escrita.

### 4.2 Visão de DEV (o "Como")

- **Direcionamento de código:** os cenários ditam quais estados e comportamentos a funcionalidade precisa suportar, ajudando a estruturar arquitetura e lógica.
- **Leitura para desenvolver:** o DEV lê o Gherkin para saber o que construir, e o QA lê o mesmo Gherkin para testar.

### 4.3 Visão de QA (a "Garantia")

- **Shift-left:** o QA não espera o software ficar pronto. Escreve e revisa cenários junto com Produto e DEV no planejamento, prevenindo defeitos antes do desenvolvimento.
- **Padronização:** substitui planilhas de casos de teste manuais por especificações estruturadas e reutilizáveis.
- **Casos limite (edge cases):** enquanto o Produto costuma focar no caminho feliz, o QA usa o Gherkin para mapear exceções, falhas de sistema e cenários alternativos (por exemplo: "Dado que o banco de dados está fora do ar...").

---

## 5. Princípio 3: Especifique junto, com a regra dos "Três Amigos"

**Orientação:** o poder do Gherkin não está em quem o escreve, mas na colaboração.

- As melhores equipes fazem reuniões rápidas chamadas **Três Amigos** (Produto, DEV e QA).
- O objetivo é debater e escrever os cenários juntos **antes do início da sprint**.
- Resultado esperado: as três visões alinhadas antes de o desenvolvimento começar.

---

## 6. Princípio 4: Especifique com foco no negócio e leia para agir

Fluxo de trabalho registrado na conversa:

1. **Especificar em Gherkin com foco no negócio.**
2. **Ler o Gherkin para desenvolver**, no caso do DEV.
3. **Ler o Gherkin para testar**, no caso do QA.

O mesmo texto orienta as duas disciplinas. Por isso ele precisa falar a língua do negócio, e não a da implementação.

---

## 7. Princípio 5: Prefira o estilo declarativo ao imperativo

### 7.1 Diferença entre os estilos

- **Imperativo (foco no "COMO"):** detalha passo a passo as interações técnicas da interface (cliques, campos, URLs).
- **Declarativo (foco no "O QUÊ"):** abstrai detalhes da tela e foca na regra de negócio, na intenção do usuário e na linguagem de domínio.

**Exemplo imperativo:**

**Funcionalidade:** Autenticação de Usuário  
**Cenário:** Realizar login com sucesso  
**Dado** que eu navego para a página "https://app.empresa.com/login"  
**E** eu digito "cliente@email.com" no campo com id "email-input"  
**E** eu digito "Senha123!" no campo com id "password-input"  
**E** eu clico no botão "Entrar"  
**Então** eu devo ser redirecionado para a URL "https://app.empresa.com/dashboard"  
**E** eu devo ver o elemento "h1" com o texto "Bem-vindo, Cliente"

**Exemplo declarativo:**

**Funcionalidade:** Autenticação de Usuário  
**Cenário:** Realizar login com sucesso  
**Dado** que o cliente possui uma conta ativa  
**Quando** ele se autentica com credenciais válidas  
**Então** ele deve ter acesso ao seu painel principal

### 7.2 Por que o declarativo é a melhor abordagem

- **Foco no negócio:** PO/PM e stakeholders pensam em intenção ("autenticar com credenciais válidas"), não em `id="email-input"` ou "clico no botão". O estilo declarativo mantém o documento acessível a qualquer pessoa da empresa.
- **Resistência a mudanças:** se o design alterar o layout do login, transformar o formulário em duas etapas ou mudar IDs de botões:
  - no formato imperativo, o cenário quebra e precisa ser reescrito, gerando retrabalho de documentação;
  - no formato declarativo, a regra de negócio permanece intacta, porque o comportamento esperado não mudou.
- **Legibilidade e concisão:** o estilo imperativo gera cenários longos e repetitivos. O declarativo condensa a intenção em poucas linhas, facilitando revisão e comunicação.
- **Risco do imperativo:** ele transforma o Gherkin em um "script de teste disfarçado de texto", anulando boa parte do valor de colaboração e de documentação viva.

---

## 8. Princípio 6: Respeite a semântica de Dado, Quando e Então

Ponto central levantado na discussão: **preencher um formulário não é pré-condição**.

| Palavra-chave | O que representa | Exemplo |
|---|---|---|
| **Dado** | Estado inicial e contexto | Estar na página de login |
| **Quando** | Ação do usuário ou evento disparado | Preencher o formulário e clicar |
| **Então** | Consequência ou resultado esperado | Redirecionamento e exibição do texto |

**Orientação:** ações do usuário pertencem ao **Quando**, não ao **Dado**.

**Separe duas discussões que costumam se confundir:**

1. **Estrutura lógica** (Dado x Quando x Então): define o papel de cada passo.
2. **Nível de detalhamento** (técnico x negócio): define se o cenário é imperativo ou declarativo.

Um cenário pode ter a estrutura lógica correta e ainda assim ser imperativo, se descrever a interface em nível de código (URLs completas, ids de elementos HTML, tags como `h1`).

**Exemplo com a estrutura correta e o nível de negócio (declarativo):**

**Funcionalidade:** Autenticação de Usuário  
**Cenário:** Realizar login com sucesso  
**Dado** que eu acesso a página de login  
**Quando** eu submeto minhas credenciais válidas  
**Então** eu devo ser direcionado para o painel principal

Note que a estrutura lógica se mantém: o acesso é o contexto (**Dado**), o preenchimento é a ação (**Quando**) e a resposta do sistema é a validação (**Então**). Se o DEV mudar `id="email-input"` para `id="username"` ou trocar `h1` por `h2`, o cenário não quebra nem precisa ser reescrito.

---

## 9. Princípio 7: Escreva em primeira pessoa

**Orientação:** especifique sempre em primeira pessoa ("eu"), para que o DEV, ao ler o cenário, consiga se colocar no lugar de quem vai usar o software.

**Benefícios apontados:**

- **Empatia e design centrado no usuário:** ao ler "Quando eu solicito o cancelamento...", o DEV é convidado a pensar no impacto emocional, no tempo de resposta e na clareza das mensagens.
- **Continuidade com a história de usuário:** a estrutura clássica de User Story já usa a primeira pessoa, o que cria uma ponte natural entre backlog e cenários.
- **Cenário como narrativa de experiência humana**, e não como instrução fria de sistema.

**Ponto de atenção:** em sistemas com **múltiplos atores ou perfis** interagindo na mesma funcionalidade (por exemplo, um Administrador aprova o cadastro feito por um Cliente), o "eu" sozinho pode gerar ambiguidade sobre o ponto de vista de cada passo. Nesses casos, alguns times usam personas específicas em terceira pessoa (ex.: "Dado que o Cliente..." ou "Dado que a Ana (Gerente de Vendas)...").

**Regra prática:** se o contexto do cenário é claro, a primeira pessoa é um recurso humanizador forte. Se houver mais de um ator no mesmo cenário, avalie deixar explícito quem está agindo.

O critério final: o objetivo não é agradar regras acadêmicas de sintaxe, mas criar **entendimento compartilhado**. Se a primeira pessoa faz o time de DEV desenvolver com mais empatia e foco no usuário, a escolha atingiu seu objetivo.

---

## 10. Exemplos de uso: cupom de desconto no carrinho de compras

Esta seção aplica as práticas do documento em uma funcionalidade de e-commerce. As regras de negócio abaixo são **ilustrativas**, criadas apenas para servir de exemplo. Em um caso real, elas seriam definidas pelo time nas conversas de Três Amigos.

### 10.1 História de usuário

**Título:** Aplicar cupom de desconto no carrinho

**Como** cliente da loja virtual,  
**eu quero** aplicar um cupom de desconto no meu carrinho de compras,  
**para que** eu pague menos pelos produtos que desejo comprar.

**Critérios de aceite (em linguagem de negócio):**

- Um cupom válido reduz o valor total da minha compra.
- Se eu informar um cupom que não pode ser usado, recebo uma mensagem clara explicando o motivo e o valor da compra não muda.
- Eu posso remover o cupom e voltar ao valor original.
- O desconto sempre reflete o estado atual do meu carrinho.

**Regras de negócio consideradas nos exemplos:**

- O cupom de exemplo concede 10% de desconto sobre o valor dos produtos.
- O cupom só vale dentro do prazo de validade.
- O cupom pode exigir um valor mínimo de compra.
- Alguns cupons são de uso único por cliente.

### 10.2 Cenários

#### Cenário 1: Aplicar um cupom válido

**Funcionalidade:** Cupom de desconto no carrinho  
**Cenário:** Aplicar um cupom válido  
**Dado** que meu carrinho tem R$ 200 em produtos  
**Quando** eu aplico um cupom válido de 10% de desconto  
**Então** eu devo ver o desconto de R$ 20 no resumo do carrinho  
**E** o total da minha compra deve ser R$ 180

#### Cenário 2: Tentar aplicar um cupom que não existe

**Cenário:** Aplicar um cupom inexistente  
**Dado** que meu carrinho tem R$ 200 em produtos  
**Quando** eu aplico um cupom que não existe  
**Então** eu devo ser informado de que o cupom é inválido  
**E** o total da minha compra deve continuar R$ 200

#### Cenário 3: Tentar aplicar um cupom expirado

**Cenário:** Aplicar um cupom fora do prazo de validade  
**Dado** que meu carrinho tem R$ 200 em produtos  
**Quando** eu aplico um cupom que já expirou  
**Então** eu devo ser informado de que o cupom está fora do prazo de validade  
**E** o total da minha compra deve continuar R$ 200

#### Cenário 4: Tentar aplicar um cupom sem atingir o valor mínimo

**Cenário:** Aplicar um cupom com valor mínimo de compra não atingido  
**Dado** que meu carrinho tem R$ 50 em produtos  
**E** o cupom exige uma compra mínima de R$ 100  
**Quando** eu aplico esse cupom  
**Então** eu devo ser informado do valor mínimo necessário para usá-lo  
**E** o total da minha compra deve continuar R$ 50

#### Cenário 5: Tentar reutilizar um cupom de uso único

**Cenário:** Aplicar um cupom de uso único que eu já utilizei  
**Dado** que eu já usei um cupom de uso único em uma compra anterior  
**E** meu carrinho tem R$ 200 em produtos  
**Quando** eu aplico esse mesmo cupom novamente  
**Então** eu devo ser informado de que o cupom já foi utilizado  
**E** o total da minha compra deve continuar R$ 200

#### Cenário 6: Remover um cupom aplicado

**Cenário:** Remover o cupom do carrinho  
**Dado** que eu apliquei um cupom válido de 10% de desconto em um carrinho de R$ 200  
**Quando** eu removo o cupom  
**Então** o desconto deve deixar de aparecer no resumo do carrinho  
**E** o total da minha compra deve voltar a ser R$ 200

#### Cenário 7: Alterar o carrinho depois de aplicar o cupom

**Cenário:** Perder o direito ao cupom ao reduzir o carrinho abaixo do valor mínimo  
**Dado** que eu apliquei um cupom com compra mínima de R$ 100 em um carrinho de R$ 120  
**Quando** eu removo um produto e meu carrinho passa a ter R$ 70  
**Então** eu devo ser informado de que o cupom não é mais válido para este carrinho  
**E** o total da minha compra deve ser R$ 70, sem desconto

### 10.3 Por que esses exemplos seguem as boas práticas

- **Declarativos:** nenhum cenário cita botões, campos, URLs ou elementos de tela. Falam de intenção ("aplico um cupom"), então continuam válidos mesmo que o layout do carrinho mude.
- **Ações no Quando:** aplicar e remover cupom, ou remover um produto, são ações minhas, por isso aparecem sempre no **Quando**. O **Dado** traz só o estado inicial (o carrinho, o cupom já aplicado ou o histórico de uso).
- **Primeira pessoa:** "meu carrinho", "eu aplico", "eu devo ser informado" convidam o DEV a se colocar no lugar de quem está comprando.
- **Casos limite, além do caminho feliz:** os Cenários 2 a 5 e 7 cobrem exceções e situações alternativas, que é onde o QA agrega valor na especificação.
- **Um comportamento por cenário:** cada cenário verifica uma única regra de negócio, o que facilita a revisão nos Três Amigos.
- **Mensagens descritas pelo negócio:** os cenários dizem que o cliente deve ser informado do motivo, sem fixar o texto exato da mensagem. O texto pode ser refinado com o Produto sem reescrever o cenário.

---

## 11. Checklist de boas práticas

**Colaboração**

- [ ] Os cenários foram debatidos entre Produto, DEV e QA (Três Amigos) antes da sprint?
- [ ] O Gherkin está servindo como linguagem comum, compreensível por qualquer pessoa do time?
- [ ] Os cenários trazem também exceções, falhas de sistema e casos limite, e não só o caminho feliz?

**Escrita**

- [ ] O cenário é declarativo (foca no "o quê"), sem URLs, ids de elementos, cliques ou tags HTML?
- [ ] O **Dado** traz contexto e pré-condição, e as ações do usuário estão no **Quando**?
- [ ] O **Então** valida um resultado esperado do sistema?
- [ ] O cenário está em primeira pessoa (ou, com vários atores, o ator de cada passo está claro)?
- [ ] O cenário é curto e sem repetição desnecessária?

**Leitura pelo time**

- [ ] O DEV consegue ler o cenário e entender o que construir, colocando-se no lugar de quem usa?
- [ ] O QA consegue ler o cenário e entender o que testar, sem depender de detalhes de tela?

---

## 12. Resumo das decisões

| Tema | Decisão |
|---|---|
| Papel do Gherkin | Ferramenta de colaboração e linguagem comum do time |
| Foco da especificação | Negócio |
| Leitura do cenário | DEV lê para desenvolver, QA lê para testar |
| Estilo de escrita | Declarativo (foco no "o quê") |
| Ações do usuário | No **Quando**, não no **Dado** |
| Ponto de vista | Primeira pessoa, com atenção a cenários de vários atores |
| Momento de escrever | Em conjunto (Três Amigos), antes da sprint |
