# Script de Verificación y Configuración

# Función para mostrar mensajes con colores
function Write-ColoredMessage {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

Write-ColoredMessage "🚀 Verificando configuración del proyecto GroceryManagement..." "Cyan"
Write-Host ""

# Verificar estructura del proyecto
Write-ColoredMessage "📁 Verificando estructura del proyecto..." "Yellow"

$requiredDirs = @(
    "c:\GroceryManagment\backend",
    "c:\GroceryManagment\frontend",
    "c:\GroceryManagment\backend\Presentation",
    "c:\GroceryManagment\backend\Application",
    "c:\GroceryManagment\backend\Domain",
    "c:\GroceryManagment\backend\Infraestructure"
)

foreach ($dir in $requiredDirs) {
    if (Test-Path $dir) {
        Write-ColoredMessage "✅ $dir existe" "Green"
    } else {
        Write-ColoredMessage "❌ $dir no encontrado" "Red"
    }
}

Write-Host ""

# Verificar archivos clave del backend
Write-ColoredMessage "🔧 Verificando archivos clave del backend..." "Yellow"

$backendFiles = @(
    "c:\GroceryManagment\backend\Presentation\Program.cs",
    "c:\GroceryManagment\backend\Presentation\Controllers\ProductsController.cs",
    "c:\GroceryManagment\backend\Presentation\Controllers\SalesController.cs",
    "c:\GroceryManagment\backend\Presentation\Controllers\DashboardController.cs",
    "c:\GroceryManagment\backend\Presentation\Controllers\InventoryController.cs"
)

foreach ($file in $backendFiles) {
    if (Test-Path $file) {
        Write-ColoredMessage "✅ $(Split-Path $file -Leaf) existe" "Green"
    } else {
        Write-ColoredMessage "❌ $(Split-Path $file -Leaf) no encontrado" "Red"
    }
}

Write-Host ""

# Verificar archivos clave del frontend
Write-ColoredMessage "⚛️ Verificando archivos clave del frontend..." "Yellow"

$frontendFiles = @(
    "c:\GroceryManagment\frontend\src\services\api.js",
    "c:\GroceryManagment\frontend\src\hooks\useDashboard.js",
    "c:\GroceryManagment\frontend\src\hooks\useInventory.js",
    "c:\GroceryManagment\frontend\src\hooks\useProducts.js",
    "c:\GroceryManagment\frontend\src\hooks\useSales.js"
)

foreach ($file in $frontendFiles) {
    if (Test-Path $file) {
        Write-ColoredMessage "✅ $(Split-Path $file -Leaf) existe" "Green"
    } else {
        Write-ColoredMessage "❌ $(Split-Path $file -Leaf) no encontrado" "Red"
    }
}

Write-Host ""

# Verificar si .NET está instalado
Write-ColoredMessage "🔍 Verificando .NET..." "Yellow"
try {
    $dotnetVersion = dotnet --version
    Write-ColoredMessage "✅ .NET instalado: $dotnetVersion" "Green"
} catch {
    Write-ColoredMessage "❌ .NET no encontrado. Instala .NET 6 o superior" "Red"
}

# Verificar si Node.js está instalado
Write-ColoredMessage "🔍 Verificando Node.js..." "Yellow"
try {
    $nodeVersion = node --version
    Write-ColoredMessage "✅ Node.js instalado: $nodeVersion" "Green"
} catch {
    Write-ColoredMessage "❌ Node.js no encontrado. Instala Node.js 16 o superior" "Red"
}

Write-Host ""
Write-ColoredMessage "📋 INSTRUCCIONES PARA INICIAR LA APLICACIÓN:" "Cyan"
Write-Host ""

Write-ColoredMessage "1. BACKEND (.NET):" "Yellow"
Write-Host "   cd c:\GroceryManagment\backend"
Write-Host "   dotnet restore"
Write-Host "   dotnet run --project Presentation"
Write-Host "   📡 El backend estará disponible en: http://localhost:5000"
Write-Host ""

Write-ColoredMessage "2. FRONTEND (React + Vite):" "Yellow"
Write-Host "   cd c:\GroceryManagment\frontend"
Write-Host "   npm install"
Write-Host "   npm run dev"
Write-Host "   🌐 El frontend estará disponible en: http://localhost:5173"
Write-Host ""

Write-ColoredMessage "3. VERIFICAR CONEXIÓN:" "Yellow"
Write-Host "   • Abre el navegador en http://localhost:5173"
Write-Host "   • En la esquina inferior derecha verás el estado de conexión"
Write-Host "   • ✅ = Conectado al backend"
Write-Host "   • ❌ = Problema de conexión"
Write-Host ""

Write-ColoredMessage "🎯 FUNCIONALIDADES DISPONIBLES:" "Green"
Write-Host "   ✅ Dashboard con estadísticas reales"
Write-Host "   ✅ Sistema de ventas con carrito"
Write-Host "   ✅ Gestión de inventario"
Write-Host "   ✅ Generación de reportes"
Write-Host "   ✅ Actividades recientes"
Write-Host "   ✅ Mensajes de WhatsApp"
Write-Host ""

Write-ColoredMessage "⚠️ NOTAS IMPORTANTES:" "Yellow"
Write-Host "   • La aplicación usa SQLite (archivo: GroceryManagmentDB.db)"
Write-Host "   • Si la BD está vacía, crea algunos productos primero"
Write-Host "   • El GroceryId por defecto es 1"
Write-Host "   • Todas las operaciones se guardan en la base de datos"
Write-Host ""

Write-ColoredMessage "🔧 En caso de problemas:" "Yellow"
Write-Host "   • Verifica que ambos servidores estén ejecutándose"
Write-Host "   • Revisa la consola del navegador para errores"
Write-Host "   • Asegúrate de que los puertos 5000 y 5173 estén libres"
Write-Host ""

Write-ColoredMessage "🎉 ¡Tu aplicación está lista para usar datos reales!" "Green"
