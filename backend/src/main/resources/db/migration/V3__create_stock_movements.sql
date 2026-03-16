CREATE TABLE IF NOT EXISTS stock_movements (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(id),
    type VARCHAR(20) NOT NULL,
    quantity NUMERIC(15,2) NOT NULL,
    movement_date TIMESTAMP NOT NULL,
    supplier VARCHAR(180),
    destination VARCHAR(180),
    notes TEXT,
    created_by BIGINT NOT NULL REFERENCES users(id),
    created_at TIMESTAMP NOT NULL
);

INSERT INTO stock_movements (product_id, type, quantity, movement_date, supplier, destination, notes, created_by, created_at)
VALUES
(1, 'ENTRY', 20, NOW(), 'Fornecedor Base', NULL, 'Carga inicial', 1, NOW()),
(3, 'EXIT', 4, NOW(), NULL, 'Equipe de manutenção', 'Entrega interna', 2, NOW());
