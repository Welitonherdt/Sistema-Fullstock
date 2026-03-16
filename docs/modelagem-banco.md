# Modelagem Base do Banco

## Tabela users
- id
- name
- email
- password_hash
- role
- active
- created_at
- updated_at

## Tabela products
- id
- code
- name
- description
- category
- unit_measure
- current_quantity
- minimum_quantity
- active
- created_at
- updated_at

## Tabela stock_movements
- id
- product_id
- type (ENTRY | EXIT)
- quantity
- movement_date
- supplier
- destination
- notes
- created_by
- created_at

## Relacionamentos
- Um usuário pode criar muitas movimentações
- Um produto pode ter muitas movimentações
- Cada movimentação pertence a um produto
- Cada movimentação é registrada por um usuário

## Observações
Nesta primeira base, categoria foi mantida como texto simples.
Mais adiante, pode virar tabela própria:
- categories
- suppliers
- audit_logs
- notifications
