# Deploy do FullStock no Render

O deploy publica frontend React, backend Spring Boot e PostgreSQL. O frontend e
a API usam a mesma URL publica.

## 1. Enviar o projeto ao GitHub

Crie um repositorio vazio no GitHub e, na raiz do projeto, execute:

```powershell
git add .
git commit -m "Prepara deploy no Render"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
git push -u origin main
```

Se o repositorio remoto ja estiver configurado, execute apenas `git push`.

## 2. Criar o deploy

1. Acesse https://dashboard.render.com/.
2. Entre com sua conta do GitHub.
3. Clique em `New` e depois em `Blueprint`.
4. Selecione o repositorio do FullStock.
5. Confirme o arquivo `render.yaml`.
6. Informe uma senha forte em `FULLSTOCK_ADMIN_PASSWORD`.
7. Clique em `Apply`.

O Render criara:

- o servico web `fullstock`;
- o banco PostgreSQL `fullstock-db`;
- uma chave JWT aleatoria;
- a conexao privada entre a aplicacao e o banco.

O primeiro deploy pode demorar alguns minutos porque compila React e Java.

## 3. Entrar no sistema

Abra a URL exibida no servico `fullstock`, por exemplo:

```text
https://fullstock.onrender.com
```

Use:

```text
E-mail: admin@fullstock.local
Senha: valor informado em FULLSTOCK_ADMIN_PASSWORD
```

As contas de demonstracao com senha padrao sao desativadas automaticamente no
ambiente publicado.

## 4. Atualizacoes

Depois do primeiro deploy, cada `git push` para a branch conectada inicia uma
nova publicacao automaticamente.

## Observacoes do plano gratuito

O servico pode levar alguns segundos para responder depois de um periodo sem
acesso. Consulte os limites e a politica atual do plano no painel do Render.
