# Etapa 3: Técnicas de design de testes

## Índice

1. Como escolher a técnica
2. Classes de equivalência
3. Valores-limite
4. Tabela de decisão (regras de negócio e combinações)
5. Transição de estados
6. Combinações (pairwise)
7. Fluxos alternativos e de exceção
8. Heurísticas complementares
9. Do exemplo ao cenário: evitando redundância

## 1. Como escolher a técnica

Escolha pela **natureza da regra**, não por hábito. Use a técnica só se houver regra que a justifique.

| Se a regra... | Use |
|---|---|
| aceita faixas ou categorias de entrada | classes de equivalência + valores-limite |
| depende de várias condições ao mesmo tempo | tabela de decisão |
| muda conforme o estado do objeto | transição de estados |
| tem muitos fatores independentes | combinações (pairwise) |
| descreve o comportamento ideal | fluxos alternativos e de exceção para o que foge dele |

Uma mesma regra pode combinar técnicas (por exemplo, classes + limites).

## 2. Classes de equivalência

**Ideia:** dividir as entradas em grupos que o sistema trata da mesma forma. Um exemplo de cada grupo representa todo o grupo.

**Como aplicar**
- Identifique as classes **válidas** e **inválidas** de cada condição.
- Escolha **um** exemplo representativo por classe.
- Não escreva dois cenários para a mesma classe, a menos que verifiquem resultados diferentes.

**Atenção:** só existem classes onde o artefato define o critério de pertencer a elas. Se o critério não estiver definido (o que é um cupom "inválido"?), registre a dúvida.

## 3. Valores-limite

**Ideia:** defeitos se concentram nas fronteiras das faixas.

**Como aplicar**
- Para cada fronteira definida, considere: logo abaixo, exatamente no limite e logo acima.
- Priorize o exemplo que expõe o critério de inclusão (a regra é "a partir de" ou "acima de"?).
- Se o valor da fronteira não está definido, **não escolha um**: pergunte.

**Exemplo de raciocínio:** "compra mínima de R$ 100". O caso decisivo é o carrinho com exatamente R$ 100, porque revela se o mínimo é inclusivo. Se o artefato não disser, esse caso vira pergunta e não cenário.

## 4. Tabela de decisão

**Ideia:** listar as condições e as combinações que levam a cada resultado, para cobrir regras com várias condições sem esquecer casos.

**Como aplicar**
1. Liste as condições (verdadeiro ou falso).
2. Enumere as combinações relevantes.
3. Indique o resultado esperado de cada combinação **somente se a regra o definir**.
4. Elimine combinações impossíveis ou equivalentes e registre o motivo.
5. Combinações sem resultado definido viram perguntas.

Quando várias linhas verificam a mesma regra com dados diferentes, use um **Esquema do Cenário** com exemplos (ver referência 04).

## 5. Transição de estados

**Ideia:** o comportamento depende do estado atual e do evento.

**Como aplicar**
- Liste os estados e os eventos.
- Para cada par (estado, evento), pergunte: permitido? Qual o novo estado? Qual o efeito?
- Cubra ao menos uma transição válida por estado relevante e as transições **proibidas** que o artefato define.
- Pares (estado, evento) sem definição viram perguntas.

## 6. Combinações (pairwise)

**Ideia:** quando há muitos fatores independentes, testar todas as combinações é inviável. Cobrir todos os **pares** de valores tende a encontrar a maioria das interações.

**Como aplicar**
- Use apenas com fatores realmente independentes e sem regra que os relacione.
- Se existir regra entre fatores, prefira tabela de decisão.
- Na especificação, agrupe em um Esquema do Cenário e mantenha a tabela de exemplos curta.

## 7. Fluxos alternativos e de exceção

**Fluxo alternativo:** outro caminho válido para o mesmo objetivo (perfil diferente, forma diferente de pagar).

**Fluxo de exceção:** algo dá errado ou é proibido.
- Entrada inválida ou fora do permitido.
- Ação sem permissão.
- Falha de sistema ("Dado que o serviço está indisponível...").
- Interrupção no meio da operação.
- Recurso esgotado ou já consumido.
- Tempo expirado.

Para cada exceção, descreva o que o usuário observa e o que **não** deve mudar (por exemplo, o valor da compra continua igual). O texto exato da mensagem só entra se estiver definido.

## 8. Heurísticas complementares

- **Zero, um, muitos:** nenhum item, um item, vários itens.
- **Vazio, nulo, máximo:** ausência de dado, dado no máximo permitido.
- **Antes e depois:** o efeito de alterar algo depois de uma ação concluída.
- **Desfazer:** remover ou cancelar leva ao estado original?
- **Repetição:** executar a mesma ação duas vezes.
- **Ordem:** trocar a ordem de duas ações independentes.
- **Persistência:** o resultado permanece após recarregar, sair e voltar?
- **Permissão:** cada perfil pode e não pode fazer o quê?

## 9. Do exemplo ao cenário: evitando redundância

Antes de virar cenário, cada exemplo passa por três perguntas:

1. **Que regra este exemplo verifica?** Se não há regra, não há cenário.
2. **Outro exemplo já verifica a mesma regra do mesmo jeito?** Se sim, descarte.
3. **Este exemplo poderia falhar sozinho?** Se um defeito passaria despercebido sem ele, mantenha.

Registre as decisões no mapa de variantes: **cenário**, **esquema**, **descartado (motivo)** ou **investigar**.
