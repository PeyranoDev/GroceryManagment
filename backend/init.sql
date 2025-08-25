-- Archivo de inicialización para PostgreSQL
-- Este archivo se ejecuta automáticamente cuando se crea el contenedor

-- Crear extensiones útiles para la aplicación
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Configurar zona horaria por defecto
SET timezone = 'UTC';

-- Crear algunas funciones útiles para auditoría (opcional)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Configurar configuraciones optimizadas para el tipo de aplicación
-- Estas configuraciones pueden ser ajustadas según las necesidades específicas
ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements';
ALTER SYSTEM SET log_statement = 'none';
ALTER SYSTEM SET log_min_duration_statement = 1000;

-- Mensaje de confirmación
DO $$
BEGIN
    RAISE NOTICE 'Base de datos PostgreSQL inicializada correctamente para Grocery Management';
END
$$;
