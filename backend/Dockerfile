# Dockerfile para el Backend (.NET)

# Usar la imagen base de .NET SDK para la fase de construcción
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env
WORKDIR /app

# Copiar los archivos de proyecto y restaurar dependencias
COPY Domain/Domain.csproj ./Domain/
COPY Application/Application.csproj ./Application/
COPY Infraestructure/Infraestructure.csproj ./Infraestructure/
COPY Presentation/Presentation.csproj ./Presentation/

# Restaurar dependencias por separado para aprovechar el cache de Docker
RUN dotnet restore Domain/Domain.csproj
RUN dotnet restore Application/Application.csproj
RUN dotnet restore Infraestructure/Infraestructure.csproj
RUN dotnet restore Presentation/Presentation.csproj

# Copiar todo el código fuente
COPY . .

# Construir y publicar la aplicación
RUN dotnet publish Presentation/Presentation.csproj -c Release -o out

# Imagen de runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

# Instalar SQLite para el runtime
RUN apt-get update && \
    apt-get install -y sqlite3 && \
    rm -rf /var/lib/apt/lists/*

# Copiar los archivos compilados desde la imagen de construcción
COPY --from=build-env /app/out .

# Crear el directorio para la base de datos
RUN mkdir -p /app/data

# Copiar la base de datos si existe
COPY Presentation/GroceryManagmentDB.db /app/data/ 2>/dev/null || true

# Configurar variables de entorno
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:5000
ENV ConnectionStrings__GroceryManagmentDBConnectionString="Data Source=/app/data/GroceryManagmentDB.db"

# Exponer el puerto
EXPOSE 5000

# Punto de entrada
ENTRYPOINT ["dotnet", "Presentation.dll"]
