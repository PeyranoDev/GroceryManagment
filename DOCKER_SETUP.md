# 🐳 Docker Setup - GroceryManagement

## Arquitectura de Microservicios

Esta aplicación está configurada como microservicios con Docker:

- **Backend**: API .NET Core (Puerto 5000)
- **Frontend**: React + Vite servido por Nginx (Puerto 80/3000)
- **Database**: SQLite compartido entre contenedores

## 📋 Requisitos Previos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Docker Compose](https://docs.docker.com/compose/install/) (incluido con Docker Desktop)

## 🚀 Inicio Rápido

### Opción 1: Script Automatizado (Recomendado)

**Windows (PowerShell):**
```powershell
# Modo Producción
.\start.ps1 prod

# Modo Desarrollo
.\start.ps1 dev
```

**Linux/macOS (Bash):**
```bash
# Dar permisos de ejecución
chmod +x start.sh

# Modo Producción
./start.sh prod

# Modo Desarrollo
./start.sh dev
```

### Opción 2: Docker Compose Manual

**Modo Producción:**
```bash
# Construir y ejecutar
docker-compose up --build -d

# Solo ejecutar (si ya está construido)
docker-compose up -d
```

**Modo Desarrollo:**
```bash
# Construir y ejecutar en modo desarrollo
docker-compose -f docker-compose.dev.yml up --build -d
```

## 🌐 URLs de Acceso

### Modo Producción
- **Frontend**: http://localhost (Puerto 80)
- **Frontend Alternativo**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Swagger UI**: http://localhost:5000

### Modo Desarrollo
- **Frontend (Vite)**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Adminer (DB)**: http://localhost:8080
- **Swagger UI**: http://localhost:5000

## 📦 Estructura de Contenedores

```
grocery-network (172.20.0.0/16)
├── grocery-database    (Volumen SQLite compartido)
├── grocery-backend     (API .NET Core)
├── grocery-frontend    (React + Nginx)
└── grocery-adminer     (Solo en desarrollo)
```

## 🔧 Comandos Disponibles

### Scripts de Gestión

**Windows:**
```powershell
.\start.ps1 help     # Mostrar ayuda
.\start.ps1 prod     # Modo producción
.\start.ps1 dev      # Modo desarrollo
.\start.ps1 build    # Solo construir imágenes
.\start.ps1 stop     # Detener servicios
.\start.ps1 clean    # Limpiar todo
.\start.ps1 logs     # Ver logs
.\start.ps1 status   # Estado de servicios
```

**Linux/macOS:**
```bash
./start.sh help      # Mostrar ayuda
./start.sh prod      # Modo producción
./start.sh dev       # Modo desarrollo
./start.sh build     # Solo construir imágenes
./start.sh stop      # Detener servicios
./start.sh clean     # Limpiar todo
./start.sh logs      # Ver logs
./start.sh status    # Estado de servicios
```

### Docker Compose Manual

```bash
# Construir servicios
docker-compose build

# Iniciar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down

# Detener y eliminar volúmenes
docker-compose down --volumes

# Reconstruir completamente
docker-compose up --build --force-recreate
```

## 🗄️ Gestión de Base de Datos

### SQLite Compartido
- La base de datos SQLite se almacena en un volumen Docker compartido
- Ubicación en contenedor: `/app/data/GroceryManagmentDB.db`
- Persistente entre reinicios de contenedores

### Acceso a la Base de Datos

**Modo Desarrollo - Adminer:**
1. Ir a http://localhost:8080
2. Sistema: SQLite
3. Servidor: `/app/data/GroceryManagmentDB.db`

**Línea de comandos:**
```bash
# Acceder al contenedor backend
docker exec -it grocery-backend bash

# Usar SQLite directamente
sqlite3 /app/data/GroceryManagmentDB.db
```

## 🔍 Verificación y Debugging

### Health Checks
- **Backend**: http://localhost:5000/api/health
- **Frontend**: http://localhost (debe cargar la interfaz)

### Logs Detallados
```bash
# Logs de un servicio específico
docker-compose logs -f frontend
docker-compose logs -f backend

# Logs de todos los servicios
docker-compose logs -f
```

### Inspección de Contenedores
```bash
# Listar contenedores activos
docker ps

# Inspeccionar un contenedor
docker inspect grocery-backend

# Ejecutar comando en contenedor
docker exec -it grocery-backend bash
docker exec -it grocery-frontend sh
```

## 🌍 Variables de Entorno

### Backend (Producción)
```
ASPNETCORE_ENVIRONMENT=Production
ASPNETCORE_URLS=http://+:5000
ConnectionStrings__GroceryManagmentDBConnectionString=Data Source=/app/data/GroceryManagmentDB.db
```

### Frontend (Producción)
```
REACT_APP_API_URL=http://localhost:5000/api
```

### Desarrollo
```
VITE_API_URL=http://localhost:5000/api
ASPNETCORE_ENVIRONMENT=Development
```

## 🚨 Resolución de Problemas

### Problemas Comunes

**1. Puerto ocupado:**
```bash
# Ver qué está usando el puerto
netstat -tulpn | grep :5000
# o en Windows:
netstat -ano | findstr :5000

# Cambiar puertos en docker-compose.yml si es necesario
```

**2. Error de conectividad Frontend->Backend:**
- Verificar que ambos contenedores estén en la misma red
- Comprobar variables de entorno de URL del API
- Revisar logs: `docker-compose logs -f`

**3. Base de datos no encontrada:**
```bash
# Verificar volumen
docker volume ls | grep sqlite

# Recrear volumen si es necesario
docker-compose down --volumes
docker-compose up -d
```

**4. Cambios en código no se reflejan:**
- **Producción**: Reconstruir imagen: `docker-compose build`
- **Desarrollo**: Hot-reload debe funcionar automáticamente

### Reinicio Completo
```bash
# Detener todo
docker-compose down --volumes --rmi all

# Limpiar sistema Docker
docker system prune -a

# Reconstruir todo
docker-compose up --build
```

## 📈 Optimizaciones

### Para Producción
- Las imágenes están optimizadas con multi-stage builds
- Frontend servido por Nginx con cache
- Backend optimizado para runtime

### Para Desarrollo
- Hot-reload habilitado en ambos servicios
- Volúmenes montados para cambios en vivo
- Herramientas de debugging incluidas

## 🔐 Seguridad

### Configuraciones Aplicadas
- Contenedores corren con usuarios no-root cuando es posible
- Red privada Docker aislada
- Variables de entorno para configuración sensible
- Headers de seguridad en Nginx

### Para Producción Real
- Usar secretos Docker para passwords
- Configurar HTTPS con certificados SSL
- Implementar autenticación y autorización
- Usar base de datos externa (PostgreSQL/MySQL)

## 📚 Documentación Adicional

- [Docker Compose Reference](https://docs.docker.com/compose/)
- [.NET Core Docker Guide](https://docs.microsoft.com/en-us/dotnet/core/docker/)
- [React Docker Best Practices](https://mherman.org/blog/dockerizing-a-react-app/)

---

¡Tu aplicación ahora funciona como microservicios con Docker! 🎉
