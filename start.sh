
set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_message() {
    echo -e "${2}${1}${NC}"
}

print_header() {
    echo ""
    print_message "🚀 $1" $BLUE
    echo "=============================================="
}

check_docker() {
    if ! command -v docker &> /dev/null; then
        print_message "❌ Docker no está instalado. Por favor instala Docker primero." $RED
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_message "❌ Docker Compose no está instalado. Por favor instala Docker Compose primero." $RED
        exit 1
    fi
    
    print_message "✅ Docker y Docker Compose están disponibles" $GREEN
}

show_help() {
    echo ""
    print_message "GroceryManagement - Sistema de Gestión de Verdulerías" $BLUE
    echo ""
    echo "Uso: ./start.sh [COMANDO]"
    echo ""
    echo "Comandos disponibles:"
    echo "  prod     - Iniciar en modo producción (puerto 80 y 5000)"
    echo "  dev      - Iniciar en modo desarrollo con hot-reload (puerto 3001 y 5001)"
    echo "  build    - Construir las imágenes sin ejecutar"
    echo "  stop     - Detener todos los servicios"
    echo "  clean    - Limpiar contenedores, imágenes y volúmenes"
    echo "  logs     - Mostrar logs de todos los servicios"
    echo "  status   - Mostrar estado de los servicios"
    echo "  help     - Mostrar esta ayuda"
    echo ""
}

start_production() {
    print_header "Iniciando en modo PRODUCCIÓN"
    print_message "🔧 Construyendo imágenes..." $YELLOW
    docker-compose -f docker-compose.yml build
    
    print_message "🚀 Iniciando servicios..." $YELLOW
    docker-compose -f docker-compose.yml up -d
    
    print_message "✅ Aplicación iniciada exitosamente!" $GREEN
    echo ""
    print_message "📱 Frontend disponible en: http://localhost" $BLUE
    print_message "🔌 Backend API disponible en: http://localhost:5000" $BLUE
    echo ""
    print_message "Para ver los logs: ./start.sh logs" $YELLOW
    print_message "Para detener: ./start.sh stop" $YELLOW
}

start_development() {
    print_header "Iniciando en modo DESARROLLO"
    print_message "🔧 Construyendo imágenes de desarrollo..." $YELLOW
    docker-compose -f docker-compose.dev.yml build
    
    print_message "🚀 Iniciando servicios de desarrollo..." $YELLOW
    docker-compose -f docker-compose.dev.yml up -d
    
    print_message "✅ Aplicación de desarrollo iniciada!" $GREEN
    echo ""
    print_message "📱 Frontend (Vite) disponible en: http://localhost:3001" $BLUE
    print_message "🔌 Backend API disponible en: http://localhost:5001" $BLUE
    print_message "🗄️  Adminer (DB Admin) disponible en: http://localhost:8080" $BLUE
    echo ""
    print_message "💡 Hot-reload habilitado para ambos servicios" $YELLOW
    print_message "Para ver los logs: ./start.sh logs" $YELLOW
    print_message "Para detener: ./start.sh stop" $YELLOW
}

build_images() {
    print_header "Construyendo imágenes"
    print_message "🔧 Construyendo imagen de producción..." $YELLOW
    docker-compose -f docker-compose.yml build
    
    print_message "🔧 Construyendo imagen de desarrollo..." $YELLOW
    docker-compose -f docker-compose.dev.yml build
    
    print_message "✅ Todas las imágenes construidas exitosamente!" $GREEN
}

stop_services() {
    print_header "Deteniendo servicios"
    docker-compose -f docker-compose.yml down 2>/dev/null || true
    docker-compose -f docker-compose.dev.yml down 2>/dev/null || true
    print_message "✅ Todos los servicios detenidos" $GREEN
}

clean_all() {
    print_header "Limpiando sistema Docker"
    print_message "⚠️  Esto eliminará contenedores, imágenes y volúmenes" $YELLOW
    read -p "¿Continuar? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker-compose -f docker-compose.yml down --volumes --rmi all 2>/dev/null || true
        docker-compose -f docker-compose.dev.yml down --volumes --rmi all 2>/dev/null || true
        docker system prune -f
        print_message "✅ Sistema limpio" $GREEN
    else
        print_message "❌ Operación cancelada" $YELLOW
    fi
}

show_logs() {
    print_header "Logs de servicios"
    if docker-compose -f docker-compose.yml ps | grep -q "Up"; then
        docker-compose -f docker-compose.yml logs -f
    elif docker-compose -f docker-compose.dev.yml ps | grep -q "Up"; then
        docker-compose -f docker-compose.dev.yml logs -f
    else
        print_message "❌ No hay servicios ejecutándose" $RED
    fi
}

show_status() {
    print_header "Estado de servicios"
    echo "Servicios de Producción:"
    docker-compose -f docker-compose.yml ps
    echo ""
    echo "Servicios de Desarrollo:"
    docker-compose -f docker-compose.dev.yml ps
}

main() {
    check_docker
    
    case "${1:-help}" in
        "prod"|"production")
            start_production
            ;;
        "dev"|"development")
            start_development
            ;;
        "build")
            build_images
            ;;
        "stop")
            stop_services
            ;;
        "clean")
            clean_all
            ;;
        "logs")
            show_logs
            ;;
        "status")
            show_status
            ;;
        "help"|*)
            show_help
            ;;
    esac
}

main "$@"
