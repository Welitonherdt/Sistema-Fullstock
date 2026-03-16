CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(180) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

INSERT INTO users (name, email, password_hash, role, active, created_at, updated_at)
VALUES
('Administrador', 'admin@fullstock.local', '123456', 'ADMIN', TRUE, NOW(), NOW()),
('Almoxarife', 'almox@fullstock.local', '123456', 'ALMOXARIFE', TRUE, NOW(), NOW()),
('Usuário Consulta', 'usuario@fullstock.local', '123456', 'USUARIO', TRUE, NOW(), NOW());
