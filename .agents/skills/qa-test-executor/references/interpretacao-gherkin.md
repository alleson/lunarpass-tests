# Interpretação do Gherkin para execução

O Gherkin recebido costuma ser **declarativo**: descreve a intenção de negócio, sem cliques, campos ou seletores. Seu trabalho é traduzir a intenção em interações na tela **sem inventar regra, dado ou resultado**.

## Mapeamento

| Elemento | Papel na execução |
|---|---|
| **Contexto** | Pré-condições aplicadas antes de cada cenário. |
| **Dado** | Estado inicial. Estabeleça ou verifique. |
| **Quando** | Ações a executar, na ordem escrita. |
| **Então / E / Mas** | Resultados esperados. Cada um é uma validação. |
| **Esquema do Cenário + Exemplos** | Uma execução por linha, substituindo as variáveis. |

## Traduzir intenção em ação

1. Leia o snapshot da tela e identifique como a intenção é realizada na interface (por exemplo, "eu removo o cupom" corresponde a um controle de remover cupom visível).
2. Se a interface oferece um caminho **claro e único**, siga-o e registre no relatório o que foi feito.
3. Se há mais de um caminho plausível ou nenhum evidente, **não escolha por palpite**: registre a limitação e classifique como **Bloqueado**, descrevendo o que faltou para interpretar o passo.
4. Use somente valores que o cenário fornece (R$ 200, "cupom válido"). Se o cenário diz "um cupom válido" e não informa qual, não invente um código: veja se o contexto fornecido (usuário, massa de dados informada) o indica. Se não indica, é limitação.

## Pré-condições (Dado e Contexto)

- **Verifique** quando o estado já deveria existir (por exemplo, "eu possuo uma conta ativa").
- Você pode **estabelecer** a pré-condição por meio de interações normais de usuário na própria aplicação, como parte da execução do cenário (por exemplo, adicionar produtos ao carrinho para chegar a "meu carrinho tem R$ 200"), e deve registrar o que fez.
- Pré-condição que exige mexer em banco de dados, código, configuração ou outra ferramenta fora do Playwright MCP **não pode ser forçada**: classifique como **Bloqueado** (pré-condição ausente).
- Se a pré-condição não puder ser estabelecida ou verificada, **não execute o resto** como se estivesse atendida.

## Validar resultados esperados (Então)

- Valide o que o cenário **diz**, no nível em que ele diz.
- Mensagem descrita pela intenção ("sou informado do motivo"): confirme que existe uma mensagem que comunica aquele motivo e **registre o texto observado**. Não reprove por o texto diferir de um que ninguém definiu.
- Valor ou estado definido ("o total deve ser R$ 180"): compare com o valor exibido.
- "Continua", "não muda", "deixa de aparecer": compare com o estado observado **antes** da ação. Por isso, capture ou anote o estado antes.
- Se o resultado esperado for subjetivo ou não observável pela interface ("mensagem clara"), registre a limitação e valide apenas a parte objetiva.
- Cada **Então** e cada **E/Mas** é validado separadamente. Basta um não atendido para o cenário **Falhar**.

## Quando registrar limitação

- O cenário referencia dado, perfil ou estado que você não pode obter.
- O passo é ambíguo e a interface não resolve a ambiguidade.
- O resultado esperado não pode ser verificado pela interface.
- O cenário cita uma hipótese marcada como "a validar" que muda o que é correto esperar: execute, mas registre que o esperado é uma hipótese e que o resultado deve ser confirmado com o Produto.

Em todos os casos: registre, não presuma.
