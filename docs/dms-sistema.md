# DMS - Documento de Modelagem do Sistema (FullStock)

## 1. Objetivo do Documento

Este documento define a modelagem funcional e tecnica do sistema FullStock.
Ele serve como base para:
- alinhamento entre negocio e desenvolvimento;
- evolucao de requisitos;
- padronizacao de implementacao;
- onboarding de novos colaboradores.

## 2. Visao Geral do Sistema

FullStock e um sistema web para controle de estoque com autenticacao por perfil, controle de produtos, localizacoes fisicas, movimentacoes e relatorios exportaveis.

Principais capacidades atuais:
- autenticacao JWT;
- controle por perfis (`ADMIN`, `ALMOXARIFE`, `USUARIO`);
- gestao de usuarios;
- gestao de localizacoes;
- gestao de produtos com localizacao vinculada;
- movimentacoes de entrada, saida e emprestimo;
- consulta de estoque e itens criticos;
- exportacao de relatorios em CSV, XML e PDF.

## 3. Perfis e Permissoes

### 3.1 ADMIN
- acesso total ao sistema;
- gerencia usuarios;
- gerencia localizacoes;
- gerencia produtos;
- registra entradas, saidas e emprestimos;
- consulta dashboard, estoque e relatorios.

### 3.2 ALMOXARIFE
- nao gerencia usuarios;
- gerencia localizacoes;
- gerencia produtos;
- registra entradas, saidas e emprestimos;
- consulta dashboard, estoque e relatorios.

### 3.3 USUARIO
- somente leitura para dashboard, estoque, produtos, localizacoes e relatorios;
- nao registra movimentacoes;
- nao gerencia cadastros.

## 4. Modulos Funcionais

### 4.1 Autenticacao
- login via email e senha;
- emissao de token JWT;
- autorizacao por role em cada endpoint.

### 4.2 Usuarios
- cadastro, edicao e ativacao/desativacao (somente ADMIN).

### 4.3 Localizacoes
- cadastro de locais fisicos (ex.: PRAT-01, EPI-01);
- ativacao/desativacao;
- vinculacao obrigatoria no produto.

### 4.4 Produtos
- CRUD de produtos com codigo unico;
- cada produto pertence a uma localizacao ativa;
- controle de saldo atual e minimo;
- identificacao de item critico.

### 4.5 Movimentacoes
- `ENTRY` (entrada): aumenta saldo;
- `EXIT` (saida): reduz saldo;
- `LOAN` (emprestimo): reduz saldo e exige nome de quem pegou;
- validacao para impedir saldo negativo;
- historico completo sem exclusao fisica.

### 4.6 Estoque
- consulta geral;
- filtro de itens criticos;
- filtro de ativos/inativos;
- pesquisa por codigo, nome, categoria e localizacao.

### 4.7 Relatorios
- relatorio de estoque filtravel;
- exportacao em CSV, XML e PDF;
- formato PDF orientado para impressao.

## 5. Regras de Negocio Principais

1. Codigo de produto deve ser unico.
2. Codigo de localizacao deve ser unico.
3. Produto deve estar vinculado a uma localizacao valida.
4. Quantidades (saldo, minimo e movimentacoes) devem ser inteiras e nao negativas.
5. Movimentacoes de `EXIT` e `LOAN` nao podem deixar saldo negativo.
6. Emprestimo (`LOAN`) exige `borrowerName` (nome de quem pegou).
7. Movimentacoes nao sao removidas fisicamente.
8. Apenas `ADMIN` e `ALMOXARIFE` gerenciam produtos, localizacoes e movimentacoes.

## 6. Arquitetura Tecnica

### 6.1 Backend
- Java 17+
- Spring Boot
- Spring Security (JWT)
- Spring Data JPA
- Flyway
- PostgreSQL

Camadas:
- `controller` (API REST)
- `service` (regras de negocio)
- `repository` (acesso a dados)
- `dto` (contratos de entrada e saida)
- `entity` (modelo persistente)

### 6.2 Frontend
- React
- Vite
- TypeScript
- Tailwind CSS

Padrao atual:
- paginas por modulo;
- servico unico de API (`frontend/src/services/api.ts`);
- autenticacao via contexto.

## 7. Modelagem de Dados (Atual)

### 7.1 users
- id
- name
- email (unico)
- password_hash
- role
- active
- created_at
- updated_at

### 7.2 locations
- id
- code (unico)
- name
- description
- active
- created_at
- updated_at

### 7.3 products
- id
- code (unico)
- name
- description
- category
- location_id (FK -> locations.id)
- unit_measure
- current_quantity
- minimum_quantity
- active
- created_at
- updated_at

### 7.4 stock_movements
- id
- product_id (FK -> products.id)
- type (`ENTRY`, `EXIT`, `LOAN`)
- quantity
- movement_date
- supplier
- destination
- borrower_name
- notes
- created_by (FK -> users.id)
- created_at

## 8. Endpoints-Chave

Base: `http://localhost:8080/api`

- Auth: `/auth/login`
- Usuarios: `/users`
- Localizacoes: `/locations`
- Produtos: `/products`
- Movimentacoes: `/movements` (`/entry`, `/exit`, `/loan`)
- Estoque: `/inventory`
- Dashboard: `/dashboard/summary`
- Relatorios: `/reports/stock`, `/reports/stock/export`

## 9. Fluxos Essenciais

### 9.1 Cadastro de produto
1. Usuario com permissao abre tela de produtos.
2. Seleciona localizacao ativa.
3. Informa dados e salva.
4. Sistema valida unicidade e consistencia.

### 9.2 Emprestimo
1. Usuario com permissao abre "Novo emprestimo".
2. Seleciona item e quantidade.
3. Informa nome da pessoa que pegou.
4. Sistema valida saldo e registra movimentacao `LOAN`.
5. Saldo do produto e reduzido.

### 9.3 Relatorio
1. Usuario consulta relatorio de estoque.
2. Aplica filtros.
3. Exporta CSV/XML/PDF.

## 10. Requisitos Nao Funcionais (Base)

- seguranca: JWT + autorizacao por role;
- rastreabilidade: movimentacoes com usuario e data;
- portabilidade: execucao local via Docker + Maven + Node;
- manutencao: estrutura modular backend/frontend;
- usabilidade: modais de cadastro e telas de listagem por modulo.

## 11. Pendencias e Evolucoes Recomendadas

1. Devolucao de emprestimo (movimento de retorno com referencia ao emprestimo original).
2. Auditoria detalhada de alteracoes de cadastro.
3. Paginacao e ordenacao server-side em listagens grandes.
4. Testes automatizados (unitarios e integracao).
5. Dashboard com indicadores de emprestimos em aberto.
6. Alertas de estoque critico e vencimento de emprestimos.

## 12. Controle de Versao do Documento

- Versao: 1.0
- Data de criacao: 2026-05-25
- Status: Em evolucao continua
