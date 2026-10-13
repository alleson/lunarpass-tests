# Especificação: [nome da funcionalidade]

**Origem:** [história, ticket ou documento analisado]

**Funcionalidade:** [nome da funcionalidade em linguagem de negócio]  
[Opcional: história de usuário em primeira pessoa: **Como** [papel], **eu quero** [objetivo], **para que** [valor].]

**Contexto:**  
**Dado** [estado inicial comum a todos os cenários]  
**E** [outro estado comum, se houver]

## Caminho principal

**Cenário:** [regra verificada, em linguagem de negócio]  
*Regra de origem: R1*  
**Dado** [estado inicial]  
**Quando** [ação minha ou evento]  
**Então** [resultado observável]  
**E** [outro aspecto do mesmo resultado]

## Exceções e casos limite

**Cenário:** [regra verificada]  
*Regra de origem: R2*  
**Dado** [estado inicial]  
**Quando** [ação minha]  
**Então** [resultado: eu sou informado do motivo]  
**E** [o que não muda]

**Esquema do Cenário:** [regra verificada com dados variados]  
*Regra de origem: R3*  
**Dado** [estado com <variável>]  
**Quando** [ação minha]  
**Então** [resultado com <resultado>]

**Exemplos:**

| variável | resultado |
|---|---|
| [valor] | [resultado] |
| [valor] | [resultado] |

## Cenários baseados em hipótese

**Cenário:** [regra derivável]  
*Hipótese a validar: [justificativa da dedução]*  
**Dado** ...  
**Quando** ...  
**Então** ...

## Rastreabilidade

| Regra | Cenários |
|---|---|
| R1 | [nomes] |
| R2 | [nomes] |
| R3 | Pendente (ver pergunta P1) |
