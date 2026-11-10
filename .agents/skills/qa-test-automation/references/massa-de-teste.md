# Gestão de Massa de Teste no Lunar Pass

O Lunar Pass adota o padrão **Data Management Híbrido com Database Direct Seeding**, onde a preparação e limpeza do estado ocorrem diretamente no banco de dados PostgreSQL (Supabase) via **Kysely**. Isso acelera drasticamente a execução dos testes, eliminando fluxos lentos de navegação manual de UI para setup de pré-condições.

---

## 1. Conexão e Utilitários de Banco (`playwright/support/db.ts`)

A conexão é gerenciada com `pg.Pool` e Kysely utilizando `CamelCasePlugin` para mapear automaticamente colunas em snake_case para propriedades em camelCase no TypeScript.

### Funções Disponíveis por Seção

```typescript
// ---- missions ----
cleanMission(mission: Mission): Promise<void>          // Deleta reservas, tickets e a missão
cleanAndInsertMission(mission: Mission): Promise<void> // Limpa e insere a missão de forma atômica
insertMission(mission: Mission): Promise<void>         // Insere a missão
deleteMission(id: string): Promise<void>               // Deleta a missão pelo ID

// ---- reservations ----
deleteReservation(missionId: string): Promise<void>    // Remove reservas associadas à missão

// ---- tickets ----
deleteTicket(missionId: string): Promise<void>         // Remove tickets emitidos para a missão
```

### Tipos de Domínio (`playwright/support/types.ts`)

```typescript
export interface Mission {
  id: string            // Formato LP-0000 ou LP-0000A
  rocket: string        // Ex.: 'Starship'
  baseId: string        // Ex.: 'alpha', 'orion', 'aurora', 'selene'
  departureDate: string // Formato YYYY-MM-DD
  returnDate: string    // Formato YYYY-MM-DD
  price: number         // Valor numérico (ex.: 1000.00)
}

export interface Reservation {
  missionId: string
}

export interface Ticket {
  missionId: string
}
```

---

## 2. Regras de Isolamento de Dados

1. **IDs de Missão Exclusivos:**
   - Todo teste deve utilizar um identificador único de missão (ex.: `LP-0128A`, `LP-3001A`, `LP-5050X`).
   - Nunca compartilhe o mesmo ID entre arquivos `.spec.ts` ou cenários diferentes. Em execuções paralelas (`fullyParallel: true`), colisões geram erro de violação de chave primária (`duplicate key value violates unique constraint "missions_pkey"`).
2. **Ciclo de Vida Limpo (Clean-Before & Clean-After):**
   - **Antes do teste (Arrange):** Execute `await cleanMission(mission)` ou `await cleanAndInsertMission(mission)` para assegurar estado limpo e conhecido.
   - **Depois do teste (Teardown):** Adicione `test.afterEach(async () => { await cleanMission(mission) })` para garantir a remoção de resíduos mesmo quando o teste falha ou lança exceção.
3. **Dados Complementares com Faker:**
   - Para valores aleatórios válidos (como nomes fictícios de passageiros ou números de documento), use `@faker-js/faker`:
     ```typescript
     import { faker } from '@faker-js/faker'
     ```
4. **Formatação de Datas:**
   - Utilize a função utilitária `formatDate` de `playwright/support/helpers.ts` para converter datas no formato `AAAA-MM-DD` para o texto exibido na aplicação (ex.: `'2028-01-27'` → `'27 de jan. de 2028'`).

---

## 3. Como Adicionar Novas Operações de Banco

Se um novo cenário exigir manipulação de tabelas ainda não cobertas (por exemplo, passageiros, pagamentos ou bases lunares):

1. **Atualize `playwright/support/types.ts`:** Declare a interface tipada da nova entidade.
2. **Atualize a interface `Database` em `playwright/support/db.ts`:** Mapeie o nome da tabela no Kysely.
3. **Mantenha os comentários temáticos de seção:** Agrupe as funções correlatas com comentários padronizados:
   ```typescript
   // ---- passengers ----
   export async function deletePassenger(passport: string) {
     await db.deleteFrom('passengers').where('passport', '=', passport).execute()
   }
   ```
4. **Proibido alterar a infraestrutura:** Nunca modifique a connection string, parâmetros de SSL ou credenciais de acesso existentes no arquivo `db.ts`.
