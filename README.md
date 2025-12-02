# AUSTRAL-GroceryManagment

## Descripción
Sistema de Gestión de Verdulerías desarrollado como microservicios con arquitectura moderna.

**Stack Tecnológico:**
- **Backend**: .NET Core 9 + Entity Framework + PostgreSQL
- **Frontend**: React + Vite + TailwindCSS
- **Base de Datos**: PostgreSQL (Producción y Desarrollo)
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

### Modo Producción
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **PostgreSQL**: localhost:5432
- **Adminer (DB Admin)**: http://localhost:8080
- **Documentación API**: http://localhost:5000 (Swagger)

### Modo Desarrollo  
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:5001
- **PostgreSQL**: localhost:5433
- **Adminer (DB Admin)**: http://localhost:8080
- **Documentación API**: http://localhost:5001 (Swagger)

## 🐳 Opciones de Docker

### Modo Producción
```bash
docker-compose up --build -d
```
- Frontend optimizado servido por Node.js (serve)
- Backend API optimizada
- PostgreSQL en producción
- Persistencia de datos completa

### Modo Desarrollo
```bash
docker-compose -f docker-compose.dev.yml up --build -d
```
- Hot-reload habilitado en Frontend y Backend
- PostgreSQL en desarrollo
- Herramientas de desarrollo incluidas
- Adminer para gestión de BD

## 🗄️ Base de Datos PostgreSQL

### Credenciales por Defecto
- **Usuario**: grocery_user
- **Contraseña**: grocery_password
- **BD Desarrollo**: grocery_management
- **BD Producción**: grocery_management_prod

### Gestión de Migraciones
```powershell
# Windows
.\backend\migrate.ps1 add NombreMigracion
.\backend\migrate.ps1 update

# Linux/macOS
./backend/migrate.sh add NombreMigracion
./backend/migrate.sh update
```

## ⚙️ Variables de Entorno

### Configuración Automática
```powershell
# Windows - Desarrollo
.\set-env.ps1 dev

# Windows - Producción  
.\set-env.ps1 prod

# Linux/macOS - Desarrollo
./set-env.sh dev

# Linux/macOS - Producción
./set-env.sh prod
```

### Variables Disponibles
| Variable | Desarrollo | Producción | Descripción |
|----------|------------|------------|-------------|
| `POSTGRES_USER` | grocery_user | grocery_user | Usuario de PostgreSQL |
| `POSTGRES_PASSWORD` | grocery_dev_pass123 | grocery_prod_pass456 | Contraseña de PostgreSQL |
| `POSTGRES_DB` | grocery_management_dev | grocery_management_prod | Nombre de la base de datos |
| `VITE_API_URL` | http://localhost:5001/api | - | URL API para desarrollo |
| `REACT_APP_API_URL` | - | http://localhost:5000/api | URL API para producción |

### Configuración Manual
```powershell
# Windows PowerShell
$env:POSTGRES_PASSWORD="tu_password_seguro"
$env:POSTGRES_DB="grocery_management_prod"
docker-compose up --build -d

# Linux/macOS Bash  
export POSTGRES_PASSWORD="tu_password_seguro"
export POSTGRES_DB="grocery_management_prod"
docker-compose up --build -d
```

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

- **Producción**: PostgreSQL persistente en volumen Docker
- **Desarrollo**: PostgreSQL con Adminer para gestión visual
- **Estructura**: Multi-tenant con soporte para múltiples verdulerías

## 🔧 Configuración Avanzada

### Variables de Entorno
- **Método Recomendado**: Scripts de configuración (`set-env.ps1` / `set-env.sh`)
- **Variables del Sistema**: Export manual de variables de entorno
- **Docker Compose**: Variables con valores por defecto usando sintaxis `${VAR:-default}`
- **Archivos de Configuración**: `appsettings.json` para configuraciones específicas de .NET

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
│   (React)       │────│   (.NET Core)   │────│  (PostgreSQL)   │
│   Port: 80/5173 │    │   Port: 5000    │    │   Shared Volume │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Semantic Release

Este proyecto usa [Semantic Release](https://semantic-release.gitbook.io/) para automatizar el versionado y la generación de releases.

### Cómo funciona

1. Cuando se hace push a `main`, el workflow de GitHub Actions analiza los commits
2. Basándose en los tipos de commits, determina el siguiente número de versión:
   - `fix:` → Patch release (1.0.0 → 1.0.1)
   - `feat:` → Minor release (1.0.0 → 1.1.0)
   - `BREAKING CHANGE:` → Major release (1.0.0 → 2.0.0)
3. Genera automáticamente:
   - Tag de Git con la versión
   - Release en GitHub con notas de cambios
   - Actualización del CHANGELOG.md

### Setup local (opcional, para validar commits)

```bash
# Instalar dependencias
npm install

# Esto configura Husky para validar commits automáticamente
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
