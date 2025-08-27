FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build-env
WORKDIR /app

COPY Domain/Domain.csproj ./Domain/
COPY Application/Application.csproj ./Application/
COPY Infraestructure/Infraestructure.csproj ./Infraestructure/
COPY Presentation/Presentation.csproj ./Presentation/

RUN dotnet restore Domain/Domain.csproj
RUN dotnet restore Application/Application.csproj
RUN dotnet restore Infraestructure/Infraestructure.csproj
RUN dotnet restore Presentation/Presentation.csproj

COPY . .

RUN dotnet publish Presentation/Presentation.csproj -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app

RUN apt-get update && \
    apt-get install -y \
    postgresql-client \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY --from=build-env /app/out .

ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://0.0.0.0:8080

EXPOSE 8080

ENTRYPOINT ["dotnet", "Presentation.dll"]
