-- Agregar columna deleted_at para bajas logicas
ALTER TABLE parkings ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;

-- Crear indice para mejorar consultas de parkings activos
CREATE INDEX IF NOT EXISTS idx_parkings_deleted_at ON parkings(deleted_at);
