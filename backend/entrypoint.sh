#!/bin/bash
set -e

echo "🚀 Iniciando contenedor de producción..."

echo "📦 Esperando a que PostgreSQL esté disponible..."
until pg_isready -h ${POSTGRES_HOST:-grocery-postgres} -p ${POSTGRES_PORT:-5432} -U ${POSTGRES_USER:-grocery_user}
do
  echo "⏳ PostgreSQL no está disponible - esperando..."
  sleep 2
done

echo "✅ PostgreSQL está disponible!"

echo "🗄️ Aplicando migraciones de base de datos..."
dotnet ef database update --project Infraestructure --startup-project Presentation

if [ $? -eq 0 ]; then
    echo "✅ Migraciones aplicadas exitosamente!"
else
    echo "❌ Error al aplicar migraciones"
    exit 1
fi

echo "🎯 Iniciando aplicación..."
exec "$@"
