#!/bin/bash

# Script para manejar migraciones de Entity Framework
# Uso: ./migrate.sh [add|update] [nombre_migracion]

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para imprimir mensajes con color
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar si estamos en el directorio correcto
if [ ! -f "backend.sln" ]; then
    print_error "Este script debe ejecutarse desde el directorio backend/"
    exit 1
fi

# Función para agregar migración
add_migration() {
    local migration_name=$1
    if [ -z "$migration_name" ]; then
        print_error "Nombre de migración requerido"
        echo "Uso: ./migrate.sh add NombreDeLaMigracion"
        exit 1
    fi
    
    print_info "Agregando migración: $migration_name"
    dotnet ef migrations add "$migration_name" --project Infraestructure --startup-project Presentation
    
    if [ $? -eq 0 ]; then
        print_info "Migración '$migration_name' agregada exitosamente"
    else
        print_error "Error al agregar la migración"
        exit 1
    fi
}

# Función para aplicar migraciones
update_database() {
    print_info "Aplicando migraciones a la base de datos..."
    
    # Verificar si estamos usando PostgreSQL
    if [ "$DATABASE_PROVIDER" = "postgresql" ]; then
        print_info "Usando PostgreSQL"
        dotnet ef database update --project Infraestructure --startup-project Presentation
    else
        print_info "Usando SQLite (desarrollo local)"
        dotnet ef database update --project Infraestructure --startup-project Presentation
    fi
    
    if [ $? -eq 0 ]; then
        print_info "Base de datos actualizada exitosamente"
    else
        print_error "Error al actualizar la base de datos"
        exit 1
    fi
}

# Función para resetear la base de datos
reset_database() {
    print_warning "¿Estás seguro de que quieres resetear la base de datos? Esto eliminará todos los datos. (y/N)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        print_info "Eliminando base de datos..."
        dotnet ef database drop --project Infraestructure --startup-project Presentation --force
        print_info "Aplicando migraciones..."
        update_database
    else
        print_info "Operación cancelada"
    fi
}

# Función para mostrar información de la base de datos
info_database() {
    print_info "Información de la base de datos:"
    dotnet ef migrations list --project Infraestructure --startup-project Presentation
}

# Procesar argumentos
case "${1:-}" in
    "add")
        add_migration "$2"
        ;;
    "update")
        update_database
        ;;
    "reset")
        reset_database
        ;;
    "info")
        info_database
        ;;
    *)
        echo "Uso: $0 [add|update|reset|info] [nombre_migracion]"
        echo ""
        echo "Comandos:"
        echo "  add <nombre>  - Agregar nueva migración"
        echo "  update        - Aplicar migraciones pendientes"
        echo "  reset         - Resetear la base de datos completamente"
        echo "  info          - Mostrar información de migraciones"
        echo ""
        echo "Ejemplos:"
        echo "  $0 add InitialCreate"
        echo "  $0 update"
        echo "  $0 info"
        exit 1
        ;;
esac
