# Backend FullStock

API REST em Spring Boot com:
- autenticacao JWT
- autorizacao por perfil
- CRUD de usuarios
- CRUD de produtos
- movimentacoes de estoque
- consulta de estoque
- relatorios exportaveis (`CSV`, `XML`, `PDF`)

## Banco de dados

O backend usa PostgreSQL + Flyway e espera banco via Docker Compose.

Configuracao padrao (alinhada ao `.env.example` da raiz):
- URL: `jdbc:postgresql://localhost:5433/fullstock`
- usuario: `fullstock`
- senha: `fullstock123`

Variaveis aceitas:
- `FULLSTOCK_DB_HOST`
- `FULLSTOCK_DB_PORT`
- `FULLSTOCK_DB_NAME`
- `FULLSTOCK_DB_USER`
- `FULLSTOCK_DB_PASSWORD`
- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`

## Executar

1. Na raiz do projeto, suba o banco Docker:
   ```bash
   docker compose up -d postgres
   ```
2. Depois rode o backend:
   ```bash
   mvn -f backend/pom.xml spring-boot:run
   ```

As migrations ficam em:
- `src/main/resources/db/migration`
