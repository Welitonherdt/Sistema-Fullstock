# Guia de Instalacao Completo (Windows)

Este guia prepara o ambiente para rodar o FullStock com:
- backend em Spring Boot
- frontend em React
- banco PostgreSQL via Docker

## 1. Ferramentas necessarias

### 1.1 Java 17 (JDK)
1. Baixe o Eclipse Temurin 17 (JDK):
   - https://adoptium.net/temurin/releases/?version=17
2. Instale com as opcoes padrao.
3. Valide no terminal:
   ```powershell
   java -version
   ```

### 1.2 Maven 3.9+
1. Baixe o Maven:
   - https://maven.apache.org/download.cgi
2. Extraia em uma pasta, por exemplo: `C:\tools\apache-maven-3.9.9`
3. Configure variavel de ambiente:
   - `MAVEN_HOME = C:\tools\apache-maven-3.9.9`
   - adicione `%MAVEN_HOME%\bin` no `Path`
4. Reabra o terminal e valide:
   ```powershell
   mvn -version
   ```

### 1.3 Node.js 20+
1. Baixe Node LTS:
   - https://nodejs.org/
2. Instale normalmente.
3. Valide:
   ```powershell
   node -v
   npm -v
   ```

### 1.4 Docker Desktop
1. Baixe Docker Desktop:
   - https://www.docker.com/products/docker-desktop/
2. Instale e abra o Docker.
3. Valide:
   ```powershell
   docker -v
   docker compose version
   ```

## 2. Configurar ambiente do projeto (uma vez)

No PowerShell, entre na raiz do projeto:

```powershell
cd C:\estagio\fullstock-base-starter
```

Copie o arquivo de variaveis:

```powershell
copy .env.example .env
```

## 3. Subir somente o banco via Docker

Ainda na raiz do projeto (`C:\estagio\fullstock-base-starter`):

```powershell
docker compose up -d postgres
```

Validar status:

```powershell
docker compose ps
```

Banco padrao criado:
- host: `localhost`
- porta: `5433`
- banco: `fullstock`
- usuario: `fullstock`
- senha: `fullstock123`

## 4. Rodar backend e frontend (ordem recomendada)

### Terminal 1 - Backend
1. Abra um terminal novo.
2. Entre na raiz:
   ```powershell
   cd C:\estagio\fullstock-base-starter
   ```
3. Rode:
   ```powershell
   mvn -f backend/pom.xml spring-boot:run
   ```
4. API em: `http://localhost:8080/api`

### Terminal 2 - Frontend
1. Abra outro terminal novo.
2. Entre na raiz:
   ```powershell
   cd C:\estagio\fullstock-base-starter
   ```
3. Instale dependencias (na primeira vez):
   ```powershell
   npm install --prefix frontend
   ```
4. Rode frontend:
   ```powershell
   npm run dev --prefix frontend
   ```
5. App em: `http://localhost:5173`

## 5. Comandos rapidos (raiz)

```powershell
npm run db:up
npm run db:status
npm run db:logs
npm run db:down
npm run db:reset
```

Observacao:
- `db:reset` apaga o volume do banco (todos os dados).

## 6. Usuarios iniciais para teste

Senha padrao inicial: `123456`

- `admin@fullstock.local` -> `ADMIN`
- `almox@fullstock.local` -> `ALMOXARIFE`
- `usuario@fullstock.local` -> `USUARIO`

## 7. Troubleshooting rapido

- Erro de autenticacao no banco (`28P01`)
  - confirme se o banco Docker esta em pe: `docker compose ps`
  - confirme se backend esta apontando para `localhost:5433`
- `docker` nao reconhecido
  - Docker Desktop nao esta instalado ou nao foi inicializado
- `mvn` nao reconhecido
  - Maven nao esta no `Path`
