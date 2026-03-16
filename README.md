# FullStock - Projeto Base Inicial

Este pacote é um **projeto base** para validar o caminho técnico do FullStock antes do desenvolvimento completo.

## Objetivo
Criar um sistema web de controle de estoque com foco em:
- autenticação por perfis;
- cadastro de usuários;
- cadastro de produtos/materiais;
- entradas e saídas de estoque;
- consulta de saldo atual;
- alertas de estoque crítico;
- relatórios básicos.

## Estrutura do pacote
```text
fullstock-base-starter/
├── backend/     -> base Spring Boot + PostgreSQL + Flyway
├── frontend/    -> base React + Vite + TypeScript
├── docs/        -> backlog, regras de negócio, endpoints e modelagem
├── docker-compose.yml
└── README.md
```

## O que já vem pronto
- Estrutura de pastas sugerida
- Migrações SQL iniciais
- Entidades-base do domínio
- Endpoints-base documentados
- Front-end com navegação inicial
- Layout administrativo simples
- Dados de exemplo para visualizar o fluxo

## O que ainda está como TODO
- JWT completo
- Persistência real dos cadastros no front
- Integração real do front com a API
- Relatórios exportáveis
- Auditoria completa
- Notificações

## Stack sugerida
### Front-end
- React
- Vite
- TypeScript
- Tailwind CSS
- React Router

### Back-end
- Java 17
- Spring Boot
- Spring Web
- Spring Data JPA
- Spring Security
- Flyway
- PostgreSQL

## Como usar este pacote
1. Abra a pasta no VS Code ou IntelliJ.
2. Leia primeiro a pasta `docs/`.
3. Rode o PostgreSQL com Docker:
   ```bash
   docker compose up -d
   ```
4. Suba o backend:
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```
   ou, se estiver no Windows e sem wrapper:
   ```bash
   mvn spring-boot:run
   ```
5. Suba o frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Usuários sugeridos para teste visual
Esses dados estão apenas documentados para orientar o fluxo:
- ADMIN -> admin@fullstock.local
- ALMOXARIFE -> almox@fullstock.local
- USUARIO -> usuario@fullstock.local

## Próximo passo recomendado
Se você sentir que esse caminho faz sentido, o ideal é evoluir este pacote em 3 frentes:
1. fechar o modelo de dados final;
2. implementar autenticação e autorização reais;
3. integrar entradas/saídas com histórico completo de movimentação.


## Como rodar no Windows

### Frontend
1. Abra o terminal dentro da pasta `fullstock-base-starter`
2. Rode `npm run frontend:install`
3. Rode `npm run frontend:dev`

Ou, se preferir, entre direto na pasta `frontend` e rode:
- `npm install`
- `npm run dev`

### Backend
1. Tenha Java 17+ e Maven instalados
2. Configure o PostgreSQL
3. Rode `mvn -f backend/pom.xml spring-boot:run`

Observação: o arquivo `package.json` da raiz existe só para facilitar os comandos do frontend. O app React fica dentro de `frontend/` e o backend Spring Boot fica dentro de `backend/`.
