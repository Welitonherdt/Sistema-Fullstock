# DMS - Diagramas Obrigatorios (Mermaid)

## 1. Diagrama de Classe

```mermaid
classDiagram
    class Usuario {
      +Long id
      +String nome
      +String email
      +String senhaHash
      +Perfil perfil
      +Boolean ativo
      +LocalDateTime criadoEm
      +LocalDateTime atualizadoEm
    }

    class Localizacao {
      +Long id
      +String codigo
      +String nome
      +String descricao
      +Boolean ativo
      +LocalDateTime criadoEm
      +LocalDateTime atualizadoEm
    }

    class Produto {
      +Long id
      +String codigo
      +String nome
      +String descricao
      +String categoria
      +String unidadeMedida
      +BigDecimal quantidadeAtual
      +BigDecimal quantidadeMinima
      +Boolean ativo
      +LocalDateTime criadoEm
      +LocalDateTime atualizadoEm
    }

    class MovimentacaoEstoque {
      +Long id
      +TipoMovimentacao tipo
      +BigDecimal quantidade
      +LocalDateTime dataMovimentacao
      +String fornecedor
      +String destino
      +String nomeQuemPegou
      +String observacoes
      +LocalDateTime criadoEm
    }

    class Perfil {
      <<enumeration>>
      ADMIN
      ALMOXARIFE
      USUARIO
    }

    class TipoMovimentacao {
      <<enumeration>>
      ENTRADA
      SAIDA
      EMPRESTIMO
    }

    Usuario "1" --> "0..*" MovimentacaoEstoque : registra
    Produto "1" --> "0..*" MovimentacaoEstoque : recebe
    Localizacao "1" --> "0..*" Produto : organiza
    Usuario --> Perfil
    MovimentacaoEstoque --> TipoMovimentacao
```

## 2. Diagramas de Sequencia (Telas Principais)

### 2.1 Tela de Login

```mermaid
sequenceDiagram
    actor U as Usuario
    participant FE as Frontend
    participant API as AuthController
    participant SVC as AuthService
    participant DB as PostgreSQL

    U->>FE: Informa email e senha
    FE->>API: POST /api/auth/login
    API->>SVC: login(request)
    SVC->>DB: Busca usuario por email
    DB-->>SVC: Usuario
    SVC->>SVC: Valida senha e perfil ativo
    SVC-->>API: Token JWT + dados do usuario
    API-->>FE: 200 OK
    FE-->>U: Acesso liberado
```

### 2.2 Tela de Usuarios (Cadastro/Edicao)

```mermaid
sequenceDiagram
    actor A as Admin
    participant FE as Frontend
    participant API as UserController
    participant SVC as UserService
    participant DB as PostgreSQL

    A->>FE: Abrir popup de novo usuario
    FE->>API: POST /api/users
    API->>SVC: create(request)
    SVC->>DB: Verifica email existente
    DB-->>SVC: Resultado
    SVC->>SVC: Valida dados e gera hash da senha
    SVC->>DB: INSERT users
    DB-->>SVC: Usuario salvo
    SVC-->>API: UserResponse
    API-->>FE: 201 Created
    FE-->>A: Lista atualizada
```

### 2.3 Tela de Localizacoes (Cadastro/Edicao)

```mermaid
sequenceDiagram
    actor G as Admin/Almoxarife
    participant FE as Frontend
    participant API as LocationController
    participant SVC as LocationService
    participant DB as PostgreSQL

    G->>FE: Abrir popup de localizacao
    FE->>API: POST /api/locations
    API->>SVC: create(request)
    SVC->>DB: Verifica codigo existente
    DB-->>SVC: Resultado
    SVC->>DB: INSERT locations
    DB-->>SVC: Localizacao salva
    SVC-->>API: LocationResponse
    API-->>FE: 201 Created
    FE-->>G: Lista atualizada
```

### 2.4 Tela de Produtos (Vinculo com Localizacao)

```mermaid
sequenceDiagram
    actor G as Admin/Almoxarife
    participant FE as Frontend
    participant API as ProductController
    participant SVC as ProductService
    participant LOC as LocationService
    participant DB as PostgreSQL

    G->>FE: Abrir popup de produto
    G->>FE: Selecionar localizacao e salvar
    FE->>API: POST /api/products
    API->>SVC: create(request)
    SVC->>LOC: findActiveEntity(locationId)
    LOC->>DB: SELECT location
    DB-->>LOC: Localizacao
    LOC-->>SVC: Localizacao ativa
    SVC->>DB: INSERT products
    DB-->>SVC: Produto salvo
    SVC-->>API: ProductResponse
    API-->>FE: 201 Created
    FE-->>G: Lista atualizada
```

### 2.5 Tela de Movimentacoes - Entrada

```mermaid
sequenceDiagram
    actor G as Admin/Almoxarife
    participant FE as Frontend
    participant API as MovementController
    participant SVC as MovementService
    participant PR as ProductRepository
    participant DB as PostgreSQL

    G->>FE: Abrir popup de entrada
    FE->>API: POST /api/movements/entry
    API->>SVC: registerEntry(request)
    SVC->>PR: findByIdWithLock(productId)
    PR->>DB: SELECT produto FOR UPDATE
    DB-->>PR: Produto
    SVC->>SVC: Valida quantidade
    SVC->>SVC: Soma quantidade no saldo
    SVC->>DB: UPDATE products + INSERT stock_movements
    DB-->>SVC: Persistido
    SVC-->>API: MovementResponse
    API-->>FE: 201 Created
```

### 2.6 Tela de Movimentacoes - Saida

```mermaid
sequenceDiagram
    actor G as Admin/Almoxarife
    participant FE as Frontend
    participant API as MovementController
    participant SVC as MovementService
    participant PR as ProductRepository
    participant DB as PostgreSQL

    G->>FE: Abrir popup de saida
    FE->>API: POST /api/movements/exit
    API->>SVC: registerExit(request)
    SVC->>PR: findByIdWithLock(productId)
    PR->>DB: SELECT produto FOR UPDATE
    DB-->>PR: Produto
    SVC->>SVC: Valida saldo suficiente
    SVC->>SVC: Subtrai quantidade do saldo
    SVC->>DB: UPDATE products + INSERT stock_movements
    DB-->>SVC: Persistido
    SVC-->>API: MovementResponse
    API-->>FE: 201 Created
```

### 2.7 Tela de Movimentacoes - Emprestimo

```mermaid
sequenceDiagram
    actor G as Admin/Almoxarife
    participant FE as Frontend
    participant API as MovementController
    participant SVC as MovementService
    participant PR as ProductRepository
    participant DB as PostgreSQL

    G->>FE: Abrir popup de emprestimo
    FE->>API: POST /api/movements/loan
    API->>SVC: registerLoan(request)
    SVC->>PR: findByIdWithLock(productId)
    PR->>DB: SELECT produto FOR UPDATE
    DB-->>PR: Produto
    SVC->>SVC: Valida quantidade e nomeQuemPegou
    SVC->>SVC: Valida saldo suficiente
    SVC->>SVC: Subtrai quantidade do saldo
    SVC->>DB: UPDATE products + INSERT stock_movements(tipo LOAN)
    DB-->>SVC: Persistido
    SVC-->>API: MovementResponse
    API-->>FE: 201 Created
```

### 2.8 Tela de Relatorios (Exportacao PDF)

```mermaid
sequenceDiagram
    actor U as Usuario
    participant FE as Frontend
    participant API as ReportController
    participant SVC as ReportService
    participant INV as InventoryService
    participant DB as PostgreSQL

    U->>FE: Clicar em Exportar PDF
    FE->>API: GET /api/reports/stock/export?format=pdf
    API->>SVC: exportStockReport(...)
    SVC->>INV: stockReport(...)
    INV->>DB: Consulta produtos/estoque
    DB-->>INV: Dados
    INV-->>SVC: Lista de itens
    SVC->>SVC: Gerar bytes do PDF
    SVC-->>API: Arquivo PDF
    API-->>FE: application/pdf
    FE-->>U: Download concluido
```

## 3. Diagrama Entidade-Relacionamento (ER)

```mermaid
erDiagram
    USUARIO ||--o{ MOVIMENTACAO_ESTOQUE : registra
    LOCALIZACAO ||--o{ PRODUTO : organiza
    PRODUTO ||--o{ MOVIMENTACAO_ESTOQUE : movimenta

    USUARIO {
      int id PK
      string nome
      string email UK
      string senha_hash
      string perfil
      boolean ativo
      datetime criado_em
      datetime atualizado_em
    }

    LOCALIZACAO {
      int id PK
      string codigo UK
      string nome
      string descricao
      boolean ativo
      datetime criado_em
      datetime atualizado_em
    }

    PRODUTO {
      int id PK
      string codigo UK
      string nome
      string descricao
      string categoria
      int localizacao_id FK
      string unidade_medida
      decimal quantidade_atual
      decimal quantidade_minima
      boolean ativo
      datetime criado_em
      datetime atualizado_em
    }

    MOVIMENTACAO_ESTOQUE {
      int id PK
      int produto_id FK
      string tipo
      decimal quantidade
      datetime data_movimentacao
      string fornecedor
      string destino
      string nome_quem_pegou
      string observacoes
      int criado_por FK
      datetime criado_em
    }
```
