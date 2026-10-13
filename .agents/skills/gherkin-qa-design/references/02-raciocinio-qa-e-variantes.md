# Etapa 2: Raciocínio de QA e exploração de variantes

## Objetivo

Descobrir tudo o que **altera o comportamento** esperado. O Produto costuma descrever o caminho feliz. O QA acrescenta o que muda o resultado: condições, estados, dados, tempo e falhas.

## Eixos de exploração

Percorra cada eixo e pergunte se ele muda o comportamento nesta funcionalidade. Se não muda, descarte e registre.

**Atores e perfis**
- Perfis diferentes veem ou fazem coisas diferentes? Existe perfil sem permissão?
- O comportamento depende de quem age e de quem é afetado (ator e sujeito)?

**Estado inicial**
- Quais estados do objeto principal existem (novo, ativo, suspenso, cancelado, expirado)?
- O que muda quando o estado é vazio, mínimo, máximo ou já processado?

**Dados e valores**
- Quais entradas têm faixas, formatos, obrigatoriedade ou unicidade?
- Existem valores nas fronteiras de uma regra (limite mínimo, máximo, igual, logo abaixo, logo acima)?

**Histórico e relacionamento**
- O comportamento depende do que o usuário já fez antes (uso único, limite por período, primeira compra)?
- Depende de outros objetos (carrinho, pedido, conta, plano)?

**Tempo**
- Há prazos, validade, janelas, agendamentos, fusos?
- O que ocorre exatamente no instante da fronteira?

**Ordem e repetição**
- A ordem das ações altera o resultado? Repetir a ação tem efeito (duplicidade)?
- Alterar algo **depois** de uma ação concluída invalida o resultado anterior?
- Desfazer, cancelar ou remover retorna ao estado original?

**Falhas e exceções**
- O que acontece se um serviço externo ou o banco estiver indisponível?
- O que o usuário vê quando a operação falha no meio? Há efeito parcial?
- Erros de usuário: entrada inválida, ação não permitida, sessão expirada.

**Concorrência**
- Dois usuários ou duas abas agindo sobre o mesmo recurso ao mesmo tempo?
- Recurso limitado (estoque, vagas, cotas) que acaba durante a ação?

**Comunicação**
- O usuário é informado do resultado e do motivo? Há notificação, registro ou auditoria?

## Como registrar

Para cada variante candidata, anote no `assets/templates/mapa-de-variantes.md`:
- a variante (o que muda);
- o eixo de origem;
- a regra do artefato que a sustenta (ou "sem regra definida", que gera uma pergunta);
- a decisão provisória: **cenário**, **agrupar em esquema**, **descartar** (com motivo) ou **investigar**.

## Cuidado com a invenção

Explorar variantes é imaginar possibilidades. **Escrever o comportamento esperado** dessas variantes só é permitido quando há regra definida ou derivável. Sem regra, a variante vira pergunta ("O que deve acontecer quando X?"), e não um cenário com resultado inventado.
