
set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_value() {
    echo -e "  ${CYAN}$1${NC}"
}

ENVIRONMENT=${1:-dev}

print_info "Configurando variables de entorno para GroceryManagement..."

export POSTGRES_USER="grocery_user"

case "$ENVIRONMENT" in
    "dev"|"development")
        print_info "Configurando entorno de DESARROLLO"
        export ASPNETCORE_ENVIRONMENT="Development"
        export POSTGRES_DB="grocery_management_dev"
        export POSTGRES_DEV_DB="grocery_management_dev"
        export POSTGRES_PASSWORD="grocery_dev_pass123"
        export VITE_API_URL="http://localhost:5001/api"
        COMPOSE_FILE="docker-compose.dev.yml"
        ;;
    "prod"|"production")
        print_info "Configurando entorno de PRODUCCIÓN"
        export ASPNETCORE_ENVIRONMENT="Production"
        export POSTGRES_DB="grocery_management_prod"
        export POSTGRES_PASSWORD="grocery_prod_pass456"
        export REACT_APP_API_URL="http://localhost:5000/api"
        COMPOSE_FILE="docker-compose.yml"
        ;;
    *)
        echo "Uso: $0 [dev|prod]"
        exit 1
        ;;
esac

print_info "Variables configuradas:"
print_value "ASPNETCORE_ENVIRONMENT: $ASPNETCORE_ENVIRONMENT"
print_value "POSTGRES_USER: $POSTGRES_USER"
print_value "POSTGRES_DB: $POSTGRES_DB"
print_value "POSTGRES_PASSWORD: [HIDDEN]"

if [[ "$ENVIRONMENT" == "dev" || "$ENVIRONMENT" == "development" ]]; then
    print_value "POSTGRES_DEV_DB: $POSTGRES_DEV_DB"
    print_value "VITE_API_URL: $VITE_API_URL"
else
    print_value "REACT_APP_API_URL: $REACT_APP_API_URL"
fi

print_warning "Para aplicar estos cambios, ejecuta:"
echo -e "  ${YELLOW}docker-compose -f $COMPOSE_FILE down --volumes${NC}"
echo -e "  ${YELLOW}docker-compose -f $COMPOSE_FILE up --build${NC}"

print_info "Variables de entorno configuradas exitosamente!"

if [[ "${BASH_SOURCE[0]}" != "${0}" ]]; then
    print_info "Variables exportadas para la sesión actual."
    print_warning "Para hacer permanentes, agrégalas a tu ~/.bashrc o ~/.profile"
fi
