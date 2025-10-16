-- Activa PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS users (
    "id" BIGSERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "password" VARCHAR(255) NOT NULL,
    "role" VARCHAR(50) NOT NULL CHECK ("role" IN ('DRIVER', 'OWNER')), -- Comillas aquí
    "terms_accepted" BOOLEAN NOT NULL DEFAULT FALSE,
    "state" BOOLEAN NOT NULL DEFAULT TRUE
);

-- Si necesitas reiniciar la base de datos, usa las siguientes líneas en dbeaver
-- DROP SCHEMA public CASCADE;
-- CREATE SCHEMA public;