# Documentação Funcional

## Módulo: Storefront Lunar Pass

Documento funcional e de negócio do Storefront (jornada do viajante).

---

## Funcionalidade: Busca de Missões

### História de usuário

Como viajante,
quero buscar e comparar missões por base lunar e por data de lançamento,
para escolher a viagem mais adequada ao meu destino e à minha disponibilidade.

### Regras de negócio

- O catálogo oferece exatamente quatro bases lunares como destino: Base Lunar Alpha (Mar da Tranquilidade), Base Lunar Orion (Cratera Copernicus), Base Lunar Aurora (Polo Sul Lunar) e Base Lunar Selene (Vale Taurus-Littrow).
- Toda missão é de ida e volta, com estadia fixa de 7 dias na base lunar.
- O preço da missão é um valor decimal por passageiro e é exibido em dólares americanos (USD).
- Cada missão é operada por um foguete com capacidade máxima de 4 assentos.
- Missões com todos os assentos ocupados permanecem visíveis nos resultados, identificadas como "Esgotado", e não podem ser reservadas.
- Quando nenhuma base é selecionada — ou quando todas as bases são selecionadas —, a busca considera todas as bases.
- A ordenação padrão dos resultados é por data de partida mais próxima.

### Requisitos funcionais

#### RF-01 — Buscar missões por base lunar

- Deve ser possível selecionar uma ou mais bases lunares como filtro da busca.
- A busca pode ser iniciada tanto pelo formulário da página inicial quanto pelo destaque de uma base lunar específica.
- As missões que atendem às bases selecionadas devem ser apresentadas junto com a quantidade de resultados encontrados.
- Os resultados devem indicar quais bases estão sendo usadas como filtro.

#### RF-02 — Ordenar os resultados por data de lançamento

- Deve ser possível ordenar as missões pela data de partida mais próxima ou mais distante.
- Quando o viajante não escolher uma ordenação, os resultados devem ser apresentados pela data de partida mais próxima.

#### RF-03 — Refinar a busca a partir dos resultados

- Deve ser possível alterar as bases selecionadas e a ordenação diretamente na página de resultados, sem retornar à página inicial.
- A lista de missões deve ser atualizada assim que os novos critérios forem aplicados.

#### RF-04 — Apresentar as informações de cada missão

- Cada missão dos resultados deve apresentar: identificador da missão, foguete, base lunar de destino, data de ida, data de retorno, duração da estadia, quantidade de assentos disponíveis sobre o total e preço por passageiro.
- Deve ser possível iniciar a reserva de qualquer missão que tenha assentos disponíveis.
- Missões sem assentos disponíveis devem ser identificadas como "Esgotado", sem a opção de iniciar a reserva.

#### RF-05 — Tratar a ausência de resultados

- Quando nenhuma missão atender aos filtros aplicados, deve ser exibido um aviso informando a situação.
- Nesse caso, deve ser oferecido um atalho para visualizar todas as missões sem filtro.

### Premissas e pontos em aberto

- Premissa: o catálogo exibido ao viajante contém apenas missões vigentes, mantidas pela operação da empresa; o Storefront não aplica corte por data de partida já ocorrida. Caso missões passadas possam permanecer no catálogo, é necessário definir a regra de exibição.

---

## Funcionalidade: Mapa de Assentos

### História de usuário

Como viajante,
quero visualizar a cabine do foguete e escolher os assentos da minha viagem,
para garantir os lugares desejados para mim e meus acompanhantes.

### Regras de negócio

- A cabine possui 4 assentos, organizados em duas fileiras: A1 e A2 (vista para a Terra) e B1 e B2 (vista para a Lua).
- Uma reserva deve conter no mínimo 1 e no máximo 4 assentos.
- Um assento pode estar em um de três estados: disponível, selecionado ou ocupado.
- Assentos ocupados pertencem a reservas já confirmadas e não podem ser selecionados.
- Um mesmo assento não pode ser reservado duas vezes na mesma missão.
- O valor total da reserva é expresso em USD e corresponde ao preço por passageiro multiplicado pela quantidade de assentos selecionados.

### Requisitos funcionais

#### RF-01 — Visualizar o mapa de assentos

- O mapa da cabine deve apresentar a posição de cada assento, com distinção visual entre os estados disponível, selecionado e ocupado.
- Cada assento deve informar sua identificação, seu estado, a vista associada (Terra ou Lua) e o preço por passageiro.
- A ocupação exibida deve refletir as reservas já confirmadas para a missão.

#### RF-02 — Selecionar e desmarcar assentos

- Deve ser possível selecionar assentos disponíveis e desmarcar assentos já escolhidos, em qualquer ordem.
- Ao tentar selecionar um assento ocupado, o viajante deve ser avisado de que precisa escolher outro.
- O resumo da seleção — assentos escolhidos e quantidade sobre o total da cabine — e o valor total da reserva devem ser atualizados a cada mudança na seleção.

#### RF-03 — Controlar o avanço da reserva

- Só deve ser possível avançar para a etapa de passageiros com pelo menos um assento selecionado.
- Quando todos os assentos da missão estiverem ocupados, deve ser exibido o aviso de missão esgotada, com a opção de retornar à lista de missões.

---

## Funcionalidade: Passageiros

### História de usuário

Como viajante,
quero informar os dados dos passageiros de cada assento reservado,
para que as passagens sejam emitidas em nome das pessoas que vão viajar.

### Regras de negócio

- Cada assento selecionado deve ter exatamente um passageiro associado.
- Os dados obrigatórios de cada passageiro são: nome completo e número do passaporte.
- O nome completo deve ter entre 3 e 120 caracteres.
- O número do passaporte deve ter entre 5 e 30 caracteres.
- Os dados informados são normalizados: espaços nas extremidades são removidos e o passaporte é registrado em letras maiúsculas.

### Requisitos funcionais

#### RF-01 — Cadastrar os passageiros da reserva

- Deve haver um formulário de passageiro para cada assento selecionado, identificando o assento correspondente.
- O nome completo e o passaporte são de preenchimento obrigatório para todos os passageiros.
- Dados que violem as regras de negócio devem gerar mensagem de erro junto ao campo correspondente, e o primeiro campo inválido deve receber o foco.
- Só deve ser possível avançar para o pagamento quando todos os passageiros estiverem com dados válidos.

#### RF-02 — Revisar e corrigir dados durante o fluxo

- Deve ser possível retornar à etapa de assentos sem perder os dados de passageiros já preenchidos.
- Campos com erro devem ser revalidados à medida que o viajante os corrige.

---

## Funcionalidade: Pagamento

### História de usuário

Como viajante,
quero pagar minha reserva com cartão de crédito e receber retorno imediato sobre o resultado,
para concluir a compra da viagem com segurança e clareza.

### Regras de negócio

- O pagamento do Storefront é simulado para fins acadêmicos: nenhuma cobrança real é efetuada, e o viajante é informado disso na confirmação.
- O resultado do pagamento pode ser: aprovado, negado ou dados do cartão incorretos.
- A aprovação é determinada por cartões de teste pré-definidos do simulador; qualquer outro número válido em formato resulta em "dados do cartão incorretos".
- Os dados obrigatórios do pagamento são: e-mail de contato, nome no cartão (3 a 80 caracteres), número do cartão (13 a 16 dígitos), validade (MM/AA, mês entre 01 e 12) e CVV (3 ou 4 dígitos).
- O valor total em USD é calculado pelo sistema como preço por passageiro multiplicado pela quantidade de assentos, sendo o valor decimal do servidor a referência oficial.
- A reserva só é criada após a aprovação do pagamento.
- Os dados do cartão são usados apenas no processamento e não são armazenados junto à reserva.
- As bandeiras reconhecidas são Visa, Mastercard e American Express.

### Requisitos funcionais

#### RF-01 — Informar os dados de pagamento

- Devem ser solicitados: e-mail de contato, nome no cartão, número do cartão, validade e CVV.
- Dados inválidos devem gerar mensagem de erro junto ao campo correspondente, com o foco posicionado no primeiro campo com erro.
- O número do cartão e a validade devem ser formatados automaticamente durante a digitação.
- A bandeira do cartão deve ser identificada e exibida a partir do número informado.
- O valor total da compra deve ser exibido antes da confirmação do pagamento.

#### RF-02 — Processar o pagamento

- O pagamento só deve ser processado quando todos os dados estiverem válidos.
- Enquanto o pagamento estiver em processamento, essa condição deve ser indicada visualmente e não deve ser possível alterar os dados nem reenviar o pedido.
- Quando o pagamento for aprovado, a reserva deve ser registrada e o viajante conduzido à confirmação.
- Quando o pagamento for negado, recusado por dados incorretos ou interrompido por falha de processamento, o motivo deve ser exibido e o viajante deve permanecer na etapa de pagamento com os dados preenchidos, podendo corrigir e tentar novamente.

#### RF-03 — Tratar conflito de assentos na confirmação

- Quando um dos assentos selecionados tiver sido reservado por outro viajante durante o fluxo, a reserva não deve ser criada e o viajante deve ser informado de que o assento acabou de ser ocupado e que precisa escolher outro.

### Premissas e pontos em aberto

- Ponto em aberto: o comportamento esperado quando o pagamento é aprovado mas a reserva falha por conflito de assento (ex.: estorno simulado, orientação de retorno ao mapa de assentos) precisa de definição de negócio.

---

## Funcionalidade: Emissão do Ticket

### História de usuário

Como viajante,
quero receber a confirmação da reserva com o código, as passagens e o comprovante do valor pago,
para ter a garantia da compra e as informações necessárias para o embarque.

### Regras de negócio

- A reserva confirmada recebe um código único de 6 caracteres alfanuméricos, gerado sem caracteres ambíguos; esse é seu único identificador público.
- É emitida uma passagem (ticket) por assento, vinculada ao nome completo e ao passaporte do passageiro.
- O valor total decimal registrado na reserva é calculado em USD pelo sistema (preço por passageiro × quantidade de passageiros).
- A confirmação deve deixar explícito que se trata de uma simulação e que nenhuma cobrança real foi feita.

### Requisitos funcionais

#### RF-01 — Confirmar a reserva ao viajante

- A confirmação da compra deve apresentar: código de reserva, base lunar de destino, datas de ida e retorno, foguete e assentos reservados.
- O e-mail de contato informado deve ser exibido como destino dos detalhes da reserva, junto com a orientação de guardar o código de reserva.
- O resultado do pagamento e a bandeira do cartão utilizada devem ser exibidos, acompanhados do aviso de que nenhuma cobrança foi feita.

#### RF-02 — Apresentar as passagens emitidas

- Deve ser exibida uma passagem por passageiro, contendo nome completo, passaporte e assento.
- O valor total pago pela reserva deve ser apresentado em USD na confirmação.

#### RF-03 — Iniciar uma nova compra

- Deve ser possível iniciar uma nova busca de missões quando o viajante finalizar uma reserva.