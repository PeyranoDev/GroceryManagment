# Dockerfile para el Frontend (React + Vite)

# Etapa de construcción
FROM node:18-alpine AS build-stage

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración de dependencias
COPY package.json package-lock.json* ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar el código fuente
COPY . .

# Construir la aplicación para producción
RUN npm run build

# Etapa de producción con Nginx
FROM nginx:alpine AS production-stage

# Copiar archivos construidos desde la etapa anterior
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto 80
EXPOSE 80

# Comando por defecto
CMD ["nginx", "-g", "daemon off;"]
