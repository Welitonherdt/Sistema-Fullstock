# Regras de Negócio - FullStock

## Perfis
### ADMIN
- Pode cadastrar usuários
- Pode cadastrar produtos
- Pode registrar entradas
- Pode registrar saídas
- Pode consultar relatórios
- Pode visualizar itens críticos

### ALMOXARIFE
- Pode cadastrar produtos
- Pode registrar entradas
- Pode registrar saídas
- Pode consultar estoque
- Pode visualizar relatórios

### USUARIO
- Pode consultar estoque
- Pode visualizar alguns relatórios, se permitido
- Não pode movimentar estoque

## Regras principais
1. O código do produto deve ser único.
2. A quantidade mínima não pode ser negativa.
3. A quantidade atual não pode ficar negativa.
4. Toda movimentação deve registrar:
   - produto;
   - tipo;
   - quantidade;
   - data/hora;
   - usuário responsável;
   - observação opcional.
5. O sistema deve considerar item crítico quando:
   - `current_quantity <= minimum_quantity`
6. Movimentações não devem ser apagadas fisicamente; o ideal é permitir cancelamento/estorno futuro.
7. Somente ADMIN e ALMOXARIFE podem registrar entrada ou saída.
8. Somente ADMIN pode cadastrar e gerenciar usuários.
