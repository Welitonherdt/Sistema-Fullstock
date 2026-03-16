# Endpoints Base - FullStock

## Auth
### POST /api/auth/login
Autentica o usuário e retorna token + papel.

#### Exemplo de request
```json
{
  "email": "admin@fullstock.local",
  "password": "123456"
}
```

#### Exemplo de response
```json
{
  "token": "mock-jwt-token",
  "name": "Administrador",
  "role": "ADMIN"
}
```

## Usuários
- `GET /api/users`
- `POST /api/users`
- `PUT /api/users/{id}`
- `PATCH /api/users/{id}/status`

## Produtos
- `GET /api/products`
- `GET /api/products/{id}`
- `POST /api/products`
- `PUT /api/products/{id}`
- `PATCH /api/products/{id}/status`

## Movimentações
- `GET /api/movements`
- `POST /api/movements/entry`
- `POST /api/movements/exit`

## Estoque
- `GET /api/inventory`
- `GET /api/inventory/critical`

## Relatórios
- `GET /api/reports/movements`
- `GET /api/reports/critical-stock`
