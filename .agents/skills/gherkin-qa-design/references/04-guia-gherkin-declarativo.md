# Etapa 4: Guia do Gherkin declarativo

Regras operacionais extraídas do guia da equipe. O documento completo, com a argumentação e os exemplos, está em `fonte/boas-praticas-gherkin-colaboracao.md`.

## Ideia central

O Gherkin é uma ferramenta de **colaboração**. Serve para o time se alinhar sobre o comportamento esperado, com foco no negócio. O mesmo texto orienta as duas disciplinas: o DEV lê para desenvolver e o QA lê para testar. Por isso ele fala a língua do negócio.

## Regras de escrita

### 1. Declarativo, não imperativo
- Descreva o **quê** (intenção, regra, linguagem de domínio), não o **como** (cliques, campos, URLs, ids, tags).
- Teste de resistência: se o design mudar o layout, o cenário continua verdadeiro?
- Errado: "eu digito X no campo com id email-input e clico no botão Entrar".
- Certo: "eu me autentico com credenciais válidas".

### 2. Semântica de Dado, Quando e Então
- **Dado:** estado inicial e contexto. Não contém ações do usuário.
- **Quando:** ação do usuário ou evento disparado. **Preencher formulário não é pré-condição**: pertence ao **Quando**.
- **Então:** consequência ou resultado esperado, observável e validável.
- Estrutura lógica (Dado, Quando, Então) e nível de detalhamento (técnico ou de negócio) são discussões separadas. Um cenário pode ter a estrutura correta e ainda ser imperativo.

### 3. Primeira pessoa
- Escreva em primeira pessoa ("meu carrinho", "eu aplico", "eu devo ser informado"), para o DEV se colocar no lugar de quem usa e para dar continuidade à história de usuário.
- Com **mais de um ator** no mesmo cenário, deixe explícito quem age em cada passo (por exemplo, "o Administrador" e "o Cliente"), para evitar ambiguidade.
- O critério é criar entendimento compartilhado, não agradar regras de sintaxe.

### 4. Um comportamento por cenário
- Cada cenário verifica uma única regra. Isso facilita a revisão nos Três Amigos.
- Vários **E** no **Então** são aceitáveis quando descrevem o mesmo resultado (mensagem ao usuário e total inalterado). Se verificam regras diferentes, separe.

### 5. Mensagens descritas pelo negócio
- Diga que o cliente deve ser informado **do motivo**, sem fixar o texto exato, a menos que o texto esteja definido no artefato.
- O texto pode ser refinado com o Produto sem reescrever o cenário.

### 6. Casos limite, além do caminho feliz
- Inclua exceções, falhas de sistema e cenários alternativos. É onde o QA agrega valor à especificação.

### 7. Curto e sem repetição
- Nomes de cenário descrevem a **regra** verificada, não o passo a passo.
- Use **Contexto** para o que se repete em todos os cenários da funcionalidade. Com Contexto, o cenário não precisa começar com **Dado**.
- Use **Esquema do Cenário** com tabela de **Exemplos** quando o mesmo comportamento se repete com dados diferentes. Mantenha a tabela pequena e cada linha com propósito.

## Formato de saída (Markdown puro)

- Palavras-chave em **negrito**: **Funcionalidade:**, **Contexto:**, **Cenário:**, **Esquema do Cenário:**, **Exemplos:**, **Dado**, **Quando**, **Então**, **E**, **Mas**.
- Sem blocos de código e sem arquivo `.feature`. O texto deve colar bem no Notion.
- Uma linha por passo. Para quebra de linha no Markdown, termine a linha com dois espaços.
- Tabelas de exemplos em tabela Markdown.
- Valores concretos e pequenos nos exemplos (R$ 200, R$ 50), que tornam a regra fácil de conferir.

## O que não fazer

- Não escrever regra que o artefato não definiu. Sem definição, vá para as perguntas dos Três Amigos.
- Não usar linguagem de teste automatizado ("clico", "seleciono o elemento", "aguardo a requisição").
- Não colocar preenchimento de formulário, cliques ou submissões em **Dado**.
- Não repetir o mesmo cenário com pequenas variações sem propósito.
- Não tratar Cucumber, automação ou BDD como assunto da especificação.

## Sobre hipóteses no Gherkin

Um cenário baseado em regra **derivável** pode entrar na especificação, mas deve vir marcado como hipótese, logo abaixo do título, por exemplo: "Hipótese a validar: [justificativa]". Cenários de regra **a investigar** não entram como afirmativos: ficam na lista de perguntas.
