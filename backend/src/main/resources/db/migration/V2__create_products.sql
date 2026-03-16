CREATE TABLE IF NOT EXISTS products (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(180) NOT NULL,
    description TEXT,
    category VARCHAR(120),
    unit_measure VARCHAR(30) NOT NULL,
    current_quantity NUMERIC(15,2) NOT NULL DEFAULT 0,
    minimum_quantity NUMERIC(15,2) NOT NULL DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

INSERT INTO products (code, name, description, category, unit_measure, current_quantity, minimum_quantity, active, created_at, updated_at)
VALUES
('ROL-001', 'Rolamento 6205', 'Rolamento para manutenção mecânica', 'Mecânica', 'UN', 12, 5, TRUE, NOW(), NOW()),
('PAR-002', 'Parafuso 10mm', 'Parafuso de fixação', 'Fixação', 'UN', 120, 50, TRUE, NOW(), NOW()),
('LUV-003', 'Luva de proteção', 'EPI para manutenção', 'EPI', 'PAR', 8, 10, TRUE, NOW(), NOW());
