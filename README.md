# FullStock

Sistema de controle de estoque com:
- autenticacao JWT
- perfis de acesso (`ADMIN`, `ALMOXARIFE`, `USUARIO`)
- gestao de usuarios
- gestao de produtos
- movimentacoes de entrada/saida
- consulta e pesquisa de estoque
- relatorios de estoque com exportacao em `CSV`, `XML` e `PDF`

## Estrutura

```text
fullstock-base-starter/
|-- backend/   # Spring Boot + JPA + Security + Flyway
|-- frontend/  # React + Vite + TypeScript + Tailwind
|-- docs/
|   |-- endpoints.md
|   `-- guia-instalacao.md
|-- docker-compose.yml
`-- .env.example
```

## Banco via Docker (padrao do projeto)

O projeto esta preparado para rodar o PostgreSQL via Docker Compose.

Porta padrao no host: `5433` (evita conflito com PostgreSQL local na `5432`).

1. Na raiz do projeto, copie o arquivo de ambiente:
   ```bash
   copy .env.example .env
   ```
2. Suba o banco:
   ```bash
   docker compose up -d postgres
   ```
3. Confira se o container esta ativo:
   ```bash
   docker compose ps
   ```

## Como rodar a aplicacao

1. Backend (na raiz do projeto):
   ```bash
   mvn -f backend/pom.xml spring-boot:run
   ```
2. Frontend (na raiz do projeto, em outro terminal):
   ```bash
   npm install --prefix frontend
   npm run dev --prefix frontend
   ```

## Scripts uteis (raiz)

```bash
npm run db:up
npm run db:status
npm run db:logs
npm run db:down
npm run db:reset
```

## Guia completo de ambiente

Consulte `docs/guia-instalacao.md` para o passo a passo completo no Windows.
