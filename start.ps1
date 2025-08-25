# Script de inicialización para Windows PowerShell
# GroceryManagement - Sistema de Gestión de Verdulerías

param(
    [Parameter(Position=0)]
    [string]$Command = "help"
)

# Función para mostrar mensajes con colores
function Write-ColoredMessage {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

function Write-Header {
    param([string]$Title)
    Write-Host ""
    Write-ColoredMessage "🚀 $Title" "Cyan"
    Write-Host "=============================================="
}

# Verificar si Docker está instalado
function Test-Docker {
    try {
        $null = docker --version
        $null = docker-compose --version
        Write-ColoredMessage "✅ Docker y Docker Compose están disponibles" "Green"
        return $true
    }
    catch {
        Write-ColoredMessage "❌ Docker o Docker Compose no están instalados." "Red"
        Write-ColoredMessage "Por favor instala Docker Desktop primero." "Red"
        return $false
    }
}

# Función para mostrar ayuda
function Show-Help {
    Write-Host ""
    Write-ColoredMessage "GroceryManagement - Sistema de Gestión de Verdulerías" "Cyan"
    Write-Host ""
    Write-Host "Uso: .\start.ps1 [COMANDO]"
    Write-Host ""
    Write-Host "Comandos disponibles:"
    Write-Host "  prod     - Iniciar en modo producción (puerto 80 y 5000)"
    Write-Host "  dev      - Iniciar en modo desarrollo con hot-reload (puerto 5173 y 5000)"
    Write-Host "  build    - Construir las imágenes sin ejecutar"
    Write-Host "  stop     - Detener todos los servicios"
    Write-Host "  clean    - Limpiar contenedores, imágenes y volúmenes"
    Write-Host "  logs     - Mostrar logs de todos los servicios"
    Write-Host "  status   - Mostrar estado de los servicios"
    Write-Host "  help     - Mostrar esta ayuda"
    Write-Host ""
}

# Función para iniciar en modo producción
function Start-Production {
    Write-Header "Iniciando en modo PRODUCCIÓN"
    Write-ColoredMessage "🔧 Construyendo imágenes..." "Yellow"
    
    try {
        docker-compose -f docker-compose.yml build
        
        Write-ColoredMessage "🚀 Iniciando servicios..." "Yellow"
        docker-compose -f docker-compose.yml up -d
        
        Write-ColoredMessage "✅ Aplicación iniciada exitosamente!" "Green"
        Write-Host ""
        Write-ColoredMessage "📱 Frontend disponible en: http://localhost" "Cyan"
        Write-ColoredMessage "🔌 Backend API disponible en: http://localhost:5000" "Cyan"
        Write-Host ""
        Write-ColoredMessage "Para ver los logs: .\start.ps1 logs" "Yellow"
        Write-ColoredMessage "Para detener: .\start.ps1 stop" "Yellow"
    }
    catch {
        Write-ColoredMessage "❌ Error al iniciar la aplicación: $($_.Exception.Message)" "Red"
    }
}

# Función para iniciar en modo desarrollo
function Start-Development {
    Write-Header "Iniciando en modo DESARROLLO"
    Write-ColoredMessage "🔧 Construyendo imágenes de desarrollo..." "Yellow"
    
    try {
        docker-compose -f docker-compose.dev.yml build
        
        Write-ColoredMessage "🚀 Iniciando servicios de desarrollo..." "Yellow"
        docker-compose -f docker-compose.dev.yml up -d
        
        Write-ColoredMessage "✅ Aplicación de desarrollo iniciada!" "Green"
        Write-Host ""
        Write-ColoredMessage "📱 Frontend (Vite) disponible en: http://localhost:5173" "Cyan"
        Write-ColoredMessage "🔌 Backend API disponible en: http://localhost:5000" "Cyan"
        Write-ColoredMessage "🗄️  Adminer (DB Admin) disponible en: http://localhost:8080" "Cyan"
        Write-Host ""
        Write-ColoredMessage "💡 Hot-reload habilitado para ambos servicios" "Yellow"
        Write-ColoredMessage "Para ver los logs: .\start.ps1 logs" "Yellow"
        Write-ColoredMessage "Para detener: .\start.ps1 stop" "Yellow"
    }
    catch {
        Write-ColoredMessage "❌ Error al iniciar la aplicación: $($_.Exception.Message)" "Red"
    }
}

# Función para construir sin ejecutar
function Build-Images {
    Write-Header "Construyendo imágenes"
    
    try {
        Write-ColoredMessage "🔧 Construyendo imagen de producción..." "Yellow"
        docker-compose -f docker-compose.yml build
        
        Write-ColoredMessage "🔧 Construyendo imagen de desarrollo..." "Yellow"
        docker-compose -f docker-compose.dev.yml build
        
        Write-ColoredMessage "✅ Todas las imágenes construidas exitosamente!" "Green"
    }
    catch {
        Write-ColoredMessage "❌ Error al construir las imágenes: $($_.Exception.Message)" "Red"
    }
}

# Función para detener servicios
function Stop-Services {
    Write-Header "Deteniendo servicios"
    
    try {
        docker-compose -f docker-compose.yml down 2>$null
        docker-compose -f docker-compose.dev.yml down 2>$null
        Write-ColoredMessage "✅ Todos los servicios detenidos" "Green"
    }
    catch {
        Write-ColoredMessage "⚠️  Algunos servicios podrían no haberse detenido correctamente" "Yellow"
    }
}

# Función para limpiar todo
function Clean-All {
    Write-Header "Limpiando sistema Docker"
    Write-ColoredMessage "⚠️  Esto eliminará contenedores, imágenes y volúmenes" "Yellow"
    
    $confirmation = Read-Host "¿Continuar? (y/N)"
    if ($confirmation -eq 'y' -or $confirmation -eq 'Y') {
        try {
            docker-compose -f docker-compose.yml down --volumes --rmi all 2>$null
            docker-compose -f docker-compose.dev.yml down --volumes --rmi all 2>$null
            docker system prune -f
            Write-ColoredMessage "✅ Sistema limpio" "Green"
        }
        catch {
            Write-ColoredMessage "⚠️  Algunos elementos podrían no haberse eliminado completamente" "Yellow"
        }
    }
    else {
        Write-ColoredMessage "❌ Operación cancelada" "Yellow"
    }
}

# Función para mostrar logs
function Show-Logs {
    Write-Header "Logs de servicios"
    
    try {
        $prodRunning = docker-compose -f docker-compose.yml ps | Select-String "Up"
        $devRunning = docker-compose -f docker-compose.dev.yml ps | Select-String "Up"
        
        if ($prodRunning) {
            docker-compose -f docker-compose.yml logs -f
        }
        elseif ($devRunning) {
            docker-compose -f docker-compose.dev.yml logs -f
        }
        else {
            Write-ColoredMessage "❌ No hay servicios ejecutándose" "Red"
        }
    }
    catch {
        Write-ColoredMessage "❌ Error al obtener logs: $($_.Exception.Message)" "Red"
    }
}

# Función para mostrar estado
function Show-Status {
    Write-Header "Estado de servicios"
    
    try {
        Write-Host "Servicios de Producción:"
        docker-compose -f docker-compose.yml ps
        Write-Host ""
        Write-Host "Servicios de Desarrollo:"
        docker-compose -f docker-compose.dev.yml ps
    }
    catch {
        Write-ColoredMessage "❌ Error al obtener el estado: $($_.Exception.Message)" "Red"
    }
}

# Función principal
function Main {
    if (-not (Test-Docker)) {
        exit 1
    }
    
    switch ($Command.ToLower()) {
        "prod" { Start-Production }
        "production" { Start-Production }
        "dev" { Start-Development }
        "development" { Start-Development }
        "build" { Build-Images }
        "stop" { Stop-Services }
        "clean" { Clean-All }
        "logs" { Show-Logs }
        "status" { Show-Status }
        default { Show-Help }
    }
}

# Ejecutar función principal
Main
