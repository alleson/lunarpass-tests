# Etapa 5: Revisão da especificação

Revise antes de entregar. Corrija o que falhar. O checklist junta o guia da equipe com as verificações de QA desta skill.

## Checklist de colaboração

- [ ] Os cenários estão prontos para serem debatidos entre Produto, DEV e QA (Três Amigos)?
- [ ] O texto é compreensível por qualquer pessoa do time, sem conhecimento técnico?
- [ ] Além do caminho feliz, há exceções, falhas de sistema e casos limite (quando as regras os sustentam)?

## Checklist de escrita

- [ ] O cenário é **declarativo**, sem URLs, ids, cliques, campos ou tags?
- [ ] O **Dado** traz só contexto e pré-condição, e as ações do usuário estão no **Quando**?
- [ ] O **Então** valida um resultado observável do sistema?
- [ ] Está em **primeira pessoa**, ou o ator de cada passo está claro quando há vários?
- [ ] Cada cenário verifica **um comportamento**?
- [ ] O nome do cenário descreve a regra verificada?
- [ ] O **Contexto** só contém o que é comum a todos os cenários?
- [ ] Mensagens estão descritas pelo negócio, sem texto inventado?

## Checklist de raciocínio de QA

- [ ] **Nenhuma regra foi inventada.** Cada valor, prazo, percentual e resultado tem origem no artefato ou é derivável com justificativa.
- [ ] Cenários baseados em regra derivável estão marcados como **hipótese a validar**.
- [ ] Tudo o que é ambíguo, ausente ou contraditório está nas **perguntas para os Três Amigos**, e não escondido em um cenário.
- [ ] Toda regra explícita tem ao menos um cenário que a cobre (rastreabilidade).
- [ ] Cada cenário aponta para uma regra ou critério de origem.
- [ ] Não há **redundância**: nenhum par de cenários verifica a mesma regra do mesmo jeito.
- [ ] As variantes descartadas têm motivo registrado.
- [ ] Fronteiras definidas pelo artefato foram exploradas (valores-limite).
- [ ] Combinações relevantes de condições foram consideradas (tabela de decisão).
- [ ] Estados e transições definidos foram cobertos, incluindo as proibidas.

## Checklist de leitura pelo time

- [ ] O DEV consegue ler e entender o que construir, colocando-se no lugar de quem usa?
- [ ] O QA consegue ler e entender o que testar, sem depender de detalhes de tela?

## Como corrigir problemas comuns

| Problema | Correção |
|---|---|
| Passo cita botão, campo ou URL | Reescreva como intenção de negócio |
| Ação do usuário no **Dado** | Mova para o **Quando** |
| Cenário verifica duas regras | Divida em dois cenários |
| Dois cenários equivalentes | Mantenha o mais representativo e registre o descarte |
| Valor ou mensagem sem origem | Remova o valor concreto e crie uma pergunta |
| Cenário com resultado assumido | Troque por hipótese marcada ou mova para as perguntas |
| Vários atores confusos com "eu" | Nomeie o ator em cada passo |

## Entrega da revisão

Ao final, informe em uma ou duas frases o que foi ajustado na revisão e quantas perguntas ficaram em aberto para os Três Amigos.
