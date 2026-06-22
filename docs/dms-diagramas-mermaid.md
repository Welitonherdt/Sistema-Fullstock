# DMS - Diagramas Mermaid (FullStock)

## 1. Arquitetura Geral

```mermaid
flowchart LR
    U["Usuario (Browser)"] --> F["Frontend (React + Vite)"]
    F --> A["API Backend (Spring Boot)"]
    A --> S["Spring Security (JWT)"]
    A --> J["Camada JPA/Services"]
    J --> D["PostgreSQL"]
    A --> R["Modulo Relatorios (CSV/XML/PDF)"]
```

## 2. Modelo Entidade-Relacionamento (ER)

```mermaid
erDiagram
    USERS ||--o{ STOCK_MOVEMENTS : "registra"
    LOCATIONS ||--o{ PRODUCTS : "organiza"
    PRODUCTS ||--o{ STOCK_MOVEMENTS : "movimenta"

    USERS {
        bigint id PK
        varchar name
        varchar email UK
        varchar password_hash
        varchar role
        boolean active
        timestamp created_at
        timestamp updated_at
    }

    LOCATIONS {
        bigint id PK
        varchar code UK
        varchar name
        text description
        boolean active
        timestamp created_at
        timestamp updated_at
    }

    PRODUCTS {
        bigint id PK
        varchar code UK
        varchar name
        text description
        varchar category
        bigint location_id FK
        varchar unit_measure
        numeric current_quantity
        numeric minimum_quantity
        boolean active
        timestamp created_at
        timestamp updated_at
    }

    STOCK_MOVEMENTS {
        bigint id PK
        bigint product_id FK
        varchar type
        numeric quantity
        timestamp movement_date
        varchar supplier
        varchar destination
        varchar borrower_name
        text notes
        bigint created_by FK
        timestamp created_at
    }
```

## 3. Casos de Uso por Perfil

```mermaid
flowchart TB
    subgraph ADMIN["Perfil ADMIN"]
        A1["Gerenciar Usuarios"]
        A2["Gerenciar Localizacoes"]
        A3["Gerenciar Produtos"]
        A4["Registrar Entrada/Saida/Emprestimo"]
        A5["Consultar Estoque/Relatorios"]
    end

    subgraph ALMOX["Perfil ALMOXARIFE"]
        M1["Gerenciar Localizacoes"]
        M2["Gerenciar Produtos"]
        M3["Registrar Entrada/Saida/Emprestimo"]
        M4["Consultar Estoque/Relatorios"]
    end

    subgraph USER["Perfil USUARIO"]
        U1["Consultar Produtos/Estoque"]
        U2["Consultar Relatorios"]
    end
```

## 4. Fluxo de Cadastro de Produto com Localizacao

```mermaid
flowchart TD
    I["Usuario abre tela de Produtos"] --> P["Clica em Novo cadastro"]
    P --> F["Preenche dados do produto"]
    F --> L["Seleciona localizacao ativa"]
    L --> V{"Dados validos?"}
    V -- "Nao" --> E["Exibe erro de validacao"]
    E --> F
    V -- "Sim" --> S["Salva produto na API"]
    S --> O["Produto cadastrado com localizacao vinculada"]
```

## 5. Fluxo de Emprestimo

```mermaid
flowchart TD
    A["Admin/Almoxarife abre Movimentacoes"] --> B["Novo emprestimo"]
    B --> C["Seleciona produto e quantidade"]
    C --> D["Informa nome de quem pegou"]
    D --> E{"Saldo suficiente?"}
    E -- "Nao" --> X["Bloqueia e mostra erro"]
    E -- "Sim" --> F["Registra movimento LOAN"]
    F --> G["Atualiza saldo do produto"]
    G --> H["Historico com borrower_name"]
```

## 6. Sequencia - Login JWT

```mermaid
sequenceDiagram
    actor U as Usuario
    participant FE as Frontend
    participant API as Backend
    participant SEC as Security/JWT
    participant DB as PostgreSQL

    U->>FE: Informar email e senha
    FE->>API: POST /api/auth/login
    API->>DB: Buscar usuario por email
    DB-->>API: Dados do usuario
    API->>SEC: Validar senha e gerar token
    SEC-->>API: JWT
    API-->>FE: token + perfil
    FE-->>U: Login concluido
```

## 7. Sequencia - Exportacao de Relatorio PDF

```mermaid
sequenceDiagram
    actor U as Usuario
    participant FE as Frontend
    participant API as Backend
    participant REP as ReportService
    participant DB as PostgreSQL

    U->>FE: Clicar em Exportar PDF
    FE->>API: GET /api/reports/stock/export?format=pdf
    API->>REP: Gerar relatorio
    REP->>DB: Buscar dados de estoque
    DB-->>REP: Itens filtrados
    REP-->>API: PDF (bytes)
    API-->>FE: application/pdf
    FE-->>U: Download do arquivo
```
