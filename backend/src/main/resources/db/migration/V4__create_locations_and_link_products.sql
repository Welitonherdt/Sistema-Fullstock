CREATE TABLE IF NOT EXISTS locations (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(60) NOT NULL UNIQUE,
    name VARCHAR(160) NOT NULL,
    description TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

INSERT INTO locations (code, name, description, active, created_at, updated_at)
VALUES
('PRAT-01', 'Prateleira A1', 'Area de parafusos e fixacao', TRUE, NOW(), NOW()),
('PRAT-02', 'Prateleira A2', 'Area de rolamentos e mecanica', TRUE, NOW(), NOW()),
('EPI-01', 'Setor EPI', 'Equipamentos de protecao individual', TRUE, NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

ALTER TABLE products
    ADD COLUMN IF NOT EXISTS location_id BIGINT;

UPDATE products p
SET location_id = l.id
FROM locations l
WHERE p.code = 'PAR-002' AND l.code = 'PRAT-01';

UPDATE products p
SET location_id = l.id
FROM locations l
WHERE p.code = 'ROL-001' AND l.code = 'PRAT-02';

UPDATE products p
SET location_id = l.id
FROM locations l
WHERE p.code = 'LUV-003' AND l.code = 'EPI-01';

UPDATE products
SET location_id = (SELECT id FROM locations ORDER BY id LIMIT 1)
WHERE location_id IS NULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'fk_products_locations'
    ) THEN
        ALTER TABLE products
            ADD CONSTRAINT fk_products_locations
            FOREIGN KEY (location_id) REFERENCES locations(id);
    END IF;
END $$;

ALTER TABLE products
    ALTER COLUMN location_id SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_products_location_id ON products(location_id);
