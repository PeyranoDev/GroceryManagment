# AUSTRAL-GroceryManagment

## Descripción
Sistema de Gestión de Verdulerías desarrollado como microservicios con arquitectura moderna.

**Stack Tecnológico:**
- **Backend**: .NET Core 8 + Entity Framework + SQLite
- **Frontend**: React + Vite + TailwindCSS
- **Containerización**: Docker + Docker Compose
- **Arquitectura**: Microservicios

## 🚀 Inicio Rápido con Docker

### Requisitos Previos
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Git

### Instalación y Configuración

1. **Clonar el repositorio:**
```bash
git clone https://github.com/PeyranoDev/GroceryManagment.git
cd GroceryManagment
```

2. **Iniciar la aplicación:**

**Windows (PowerShell):**
```powershell
# Modo Producción (Recomendado)
.\start.ps1 prod

# Modo Desarrollo
.\start.ps1 dev
```

**Linux/macOS:**
```bash
# Dar permisos de ejecución
chmod +x start.sh

# Modo Producción
./start.sh prod

# Modo Desarrollo  
./start.sh dev
```

3. **Acceder a la aplicación:**
- **Frontend**: http://localhost (Producción) o http://localhost:5173 (Desarrollo)
- **Backend API**: http://localhost:5000
- **Documentación API**: http://localhost:5000 (Swagger)

## 🐳 Opciones de Docker

### Modo Producción
```bash
docker-compose up --build -d
```
- Frontend optimizado servido por Nginx (Puerto 80)
- Backend API optimizada (Puerto 5000)
- Base de datos SQLite persistente

### Modo Desarrollo
```bash
docker-compose -f docker-compose.dev.yml up --build -d
```
- Hot-reload habilitado en Frontend y Backend
- Herramientas de desarrollo incluidas
- Adminer para gestión de BD (Puerto 8080)

## 📋 Comandos Útiles

### Scripts de Gestión
```bash
# Ver ayuda completa
.\start.ps1 help        # Windows
./start.sh help         # Linux/macOS

# Otros comandos
build    # Solo construir imágenes
stop     # Detener servicios
clean    # Limpiar sistema Docker
logs     # Ver logs en tiempo real
status   # Estado de servicios
```

### Docker Compose Manual
```bash
# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down

# Reconstruir completamente
docker-compose up --build --force-recreate
```

## 🌐 URLs de Acceso

| Servicio | Producción | Desarrollo |
|----------|------------|------------|
| Frontend | http://localhost | http://localhost:5173 |
| Backend API | http://localhost:5000 | http://localhost:5000 |
| Swagger UI | http://localhost:5000 | http://localhost:5000 |
| Adminer DB | - | http://localhost:8080 |

## ⚡ Desarrollo Local (Sin Docker)

Si prefieres ejecutar sin Docker:

### Backend
```bash
cd backend
dotnet restore
dotnet run --project Presentation
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🗄️ Base de Datos

- **Producción**: SQLite persistente en volumen Docker
- **Desarrollo**: SQLite con Adminer para gestión visual
- **Estructura**: Multi-tenant con soporte para múltiples verdulerías

## 🔧 Configuración Avanzada

### Variables de Entorno
- **Backend**: `appsettings.json` y variables Docker
- **Frontend**: `.env.development` y `.env.production`

### Personalización de Puertos
Editar `docker-compose.yml` para cambiar puertos por defecto.

## 📚 Documentación Adicional

- [📖 Setup Completo de Docker](./DOCKER_SETUP.md)
- [🔌 Integración Frontend-Backend](./INTEGRATION_COMPLETE.md)
- [📊 DTOs y Arquitectura](./backend/DTOS_SUMMARY.md)

## 🐛 Resolución de Problemas

### Problemas Comunes
1. **Puerto ocupado**: Cambiar puertos en docker-compose.yml
2. **Contenedores no inician**: `docker-compose down --volumes && docker-compose up --build`
3. **Cambios no se reflejan**: Reconstruir con `docker-compose build`

### Health Checks
- Backend: http://localhost:5000/api/health
- Frontend: Debe cargar la interfaz correctamente

## 🏗️ Arquitectura del Sistema

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   (React)       │────│   (.NET Core)   │────│   (SQLite)      │
│   Port: 80/5173 │    │   Port: 5000    │    │   Shared Volume │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🤝 Contribución

### Convenciones de Commits

Los mensajes de commit deben seguir el siguiente formato:

```
<tipo>(<alcance>): <descripción>
```

Tipos permitidos:

- **feat**: Se usa cuando se añade una nueva funcionalidad al código.
- **fix**: Se usa cuando se corrige un error en el código.
- **perf**: Se usa cuando se realizan cambios que mejoran el rendimiento del código.
- **docs**: Se usa cuando se realizan cambios en la documentación, como en archivos README.
- **style**: Se usa cuando se realizan cambios que no afectan el significado del código
    (espacios en blanco, formato, punto y coma faltante, etc.).
- **refactor**: Se usa cuando se realizan cambios en el código que no corrigen errores ni
    añaden funcionalidades, pero mejoran la estructura del código.
- **test**: Se usa cuando se añaden o corrigen pruebas (tests) en el código.
- **build**: Se usa cuando se realizan cambios que afectan el sistema de construcción o
    dependencias externas (ejemplos: gulp, npm).
- **ci**: Se usa cuando se realizan cambios en los archivos y scripts de configuración de
    CI (Integración Continua).
- **chore**: Se usa para cambios menores y tareas de mantenimiento que no afectan el
    código fuente ni los tests.
- **revert**: Se usa cuando se revierten commits anteriores.

Ejemplos de commits válidos:
```bash
git commit -m "feat(auth): add JWT authentication"
git commit -m "fix(api): correct status code response"
git commit -m "docs: update README"
git commit -m "style(components): format code according to guidelines"
```
