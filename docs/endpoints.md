# Endpoints da API - FullStock

Base URL:

`http://localhost:8080/api`

## Auth

### `POST /auth/login`
Autentica o usuário e retorna token JWT.

Request:
```json
{
  "email": "admin@fullstock.local",
  "password": "123456"
}
```

Response:
```json
{
  "token": "jwt-token",
  "userId": 1,
  "name": "Administrador",
  "email": "admin@fullstock.local",
  "role": "ADMIN"
}
```

## Usuários (ADMIN)

- `GET /users`
- `GET /users/{id}`
- `POST /users`
- `PUT /users/{id}`
- `PATCH /users/{id}/status`

## Produtos

- `GET /products?search=&active=&critical=`
- `GET /products/{id}`
- `POST /products` (ADMIN, ALMOXARIFE)
- `PUT /products/{id}` (ADMIN, ALMOXARIFE)
- `PATCH /products/{id}/status` (ADMIN, ALMOXARIFE)
- `DELETE /products/{id}` (ADMIN, ALMOXARIFE)

## Movimentações

- `GET /movements?type=&productId=&startDate=&endDate=`
- `POST /movements/entry` (ADMIN, ALMOXARIFE)
- `POST /movements/exit` (ADMIN, ALMOXARIFE)

## Estoque

- `GET /inventory?search=&criticalOnly=&includeInactive=`
- `GET /inventory/critical`

## Dashboard

- `GET /dashboard/summary`

## Relatórios

- `GET /reports/stock?search=&criticalOnly=&includeInactive=`
- `GET /reports/stock/export?format=csv|xml|pdf&search=&criticalOnly=&includeInactive=`
- `GET /reports/critical-stock`
