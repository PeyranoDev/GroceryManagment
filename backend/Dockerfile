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

RUN apt-get update && apt-get install -y dotnet-sdk-9.0
RUN dotnet tool install --global dotnet-ef
ENV PATH="$PATH:/root/.dotnet/tools"

COPY --from=build-env /app/Domain ./Domain
COPY --from=build-env /app/Application ./Application  
COPY --from=build-env /app/Infraestructure ./Infraestructure
COPY --from=build-env /app/Presentation ./Presentation
COPY --from=build-env /app/*.sln ./

COPY --from=build-env /app/out .

COPY entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh

ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:5000
ENV POSTGRES_HOST=grocery-postgres
ENV POSTGRES_PORT=5432
ENV POSTGRES_USER=grocery_user

EXPOSE 5000

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["dotnet", "Presentation.dll"]
