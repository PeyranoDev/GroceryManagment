# AUSTRAL-GroceryManagment

## Descripción
Sistema de Gestion de Verdulerias.

## Requisitos Previos
- Git
- Docker
- Docker Compose

## Instalación y Configuración
Para iniciar el proyecto, ejecute el siguiente comando en la terminal:
```bash
git clone https://github.com/PeyranoDev/GroceryManagment.git
git checkout dev
```
```bash
docker-compose -f docker-compose.yml up --build
```

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
