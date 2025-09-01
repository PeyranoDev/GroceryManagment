using Application.Mapping;
using Application.Services.Implementations;
using Application.Services.Interfaces;
using Domain.Repositories;
using Domain.Tenancy;
using Infraestructure;
using Infraestructure.Repositories;
using Infraestructure.Tenancy;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Presentation.Filters;
using Presentation.Middleware;
using Azure.Identity;

var builder = WebApplication.CreateBuilder(args);

string conn = string.Empty;

if (builder.Environment.IsProduction())
{
    try
    {
        var keyVaultEndpoint = new Uri("https://grocerymanagerkv.vault.azure.net/");
        builder.Configuration.AddAzureKeyVault(keyVaultEndpoint, new DefaultAzureCredential());
        Console.WriteLine("Key Vault configurado correctamente.");
        
        var pgHost = builder.Configuration["PGHOST"];
        var pgPort = builder.Configuration["PGPORT"] ?? "5432";
        var pgDatabase = builder.Configuration["PGDATABASE"];
        var pgUser = builder.Configuration["PGUSER"];
        var pgPassword = builder.Configuration["PGPASSWORD"];
        var pgSslMode = builder.Configuration["PGSSLMODE"] ?? "require";
        var pgChannelBinding = builder.Configuration["PGCHANNELBINDING"] ?? "require";
        
        if (string.IsNullOrWhiteSpace(pgHost) || 
            string.IsNullOrWhiteSpace(pgDatabase) || 
            string.IsNullOrWhiteSpace(pgUser) || 
            string.IsNullOrWhiteSpace(pgPassword))
        {
            throw new InvalidOperationException("Faltan secretos requeridos en Key Vault: PGHOST, PGDATABASE, PGUSER, PGPASSWORD");
        }
        
        conn = $"Host={pgHost};Port={pgPort};Database={pgDatabase};Username={pgUser};Password={pgPassword};SSL Mode={pgSslMode};Channel Binding={pgChannelBinding}";
        
        Console.WriteLine($"Cadena de conexión construida desde Key Vault - Host: {pgHost}, Database: {pgDatabase}, User: {pgUser}");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error configurando Key Vault: {ex.Message}");
        Console.WriteLine($"Stack trace: {ex.StackTrace}");
        throw;
    }
}
else
{
    conn = builder.Configuration.GetConnectionString("DefaultConnection") 
           ?? throw new InvalidOperationException("No se encontró la cadena de conexión para desarrollo.");
}

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        p => p.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader());
});

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Grocery Management API",
        Version = "v1",
        Description = "API para administración multi-tenant de groceries."
    });

    c.AddSecurityDefinition("GroceryId", new OpenApiSecurityScheme
    {
        Type = SecuritySchemeType.ApiKey,
        In = ParameterLocation.Header,
        Name = "X-Grocery-Id",
        Description = "ID del grocery (requerido)"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "GroceryId"
                }
            },
            Array.Empty<string>()
        }
    });

    c.OperationFilter<GroceryIdHeaderOperationFilter>();
});

builder.Services.AddAutoMapper(cfg =>
{
    cfg.LicenseKey = builder.Configuration["AutoMapperLicense"];
    cfg.AddProfile<CategoryProfile>();
    cfg.AddProfile<ProductProfile>();
    cfg.AddProfile<InventoryProfile>();
    cfg.AddProfile<SaleProfile>();
    cfg.AddProfile<GroceryProfile>();
    cfg.AddProfile<UserProfile>();
    cfg.AddProfile<RecentActivityProfile>();
    cfg.AddProfile<PurchaseProfile>();
    cfg.AddProfile<DashboardProfile>();
});

builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ITenantProvider, HeaderTenantProvider>();

Console.WriteLine($"Environment: {builder.Environment.EnvironmentName}");
Console.WriteLine($"Connection string found: {!string.IsNullOrWhiteSpace(conn)}");
Console.WriteLine($"Connection string (masked): {(string.IsNullOrWhiteSpace(conn) ? "NULL" : conn.Substring(0, Math.Min(20, conn.Length)) + "...")}");

if (string.IsNullOrWhiteSpace(conn))
{
    Console.WriteLine("Available configuration keys:");
    foreach (var key in builder.Configuration.AsEnumerable())
    {
        Console.WriteLine($"  {key.Key}: {(key.Value?.Contains("password", StringComparison.OrdinalIgnoreCase) == true ? "***" : key.Value)}");
    }
    throw new InvalidOperationException("No se encontró ninguna cadena de conexión configurada.");
}

builder.Services.AddDbContext<GroceryManagmentContext>(opt =>
    opt.UseNpgsql(conn));

AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

builder.Services.AddScoped(typeof(IBaseRepository<>), typeof(BaseRepository<>));
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IInventoryRepository, InventoryRepository>();
builder.Services.AddScoped<ISaleRepository, SaleRepository>();
builder.Services.AddScoped<IGroceryRepository, GroceryRepository>();
builder.Services.AddScoped<IRecentActivityRepository, RecentActivityRepository>();
builder.Services.AddScoped<IPurchaseRepository, PurchaseRepository>();

builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IInventoryService, InventoryService>();
builder.Services.AddScoped<ISaleService, SaleService>();
builder.Services.AddScoped<IGroceryService, GroceryService>();
builder.Services.AddScoped<IRecentActivityService, RecentActivityService>();
builder.Services.AddScoped<IPurchaseService, PurchaseService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();
builder.Services.AddScoped<IReportService, ReportService>();
builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    try
    {
        var db = scope.ServiceProvider.GetRequiredService<GroceryManagmentContext>();
        
        Console.WriteLine("Verificando conexión a la base de datos...");
        await db.Database.CanConnectAsync();
        Console.WriteLine("Conexión a la base de datos exitosa.");
        
        Console.WriteLine("Aplicando migraciones...");
        await db.Database.MigrateAsync();
        logger.LogInformation($"Migraciones aplicadas correctamente en {app.Environment.EnvironmentName}.");
    }
    catch (Exception ex)
    {
        logger.LogError(ex, $"Error al conectar o aplicar migraciones en {app.Environment.EnvironmentName}");
        Console.WriteLine($"Error detallado: {ex.Message}");
        if (ex.InnerException != null)
        {
            Console.WriteLine($"Inner exception: {ex.InnerException.Message}");
        }
        throw;
    }
}

app.UseMiddleware<GlobalExceptionMiddleware>();

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Grocery Management API v1");
    c.RoutePrefix = "";
    c.DisplayRequestDuration();
    c.EnableDeepLinking();
    c.EnableFilter();
    c.ShowExtensions();
    c.EnableValidator();
});

app.UseCors("AllowAllOrigins");
app.UseHttpsRedirection();
app.MapControllers();
app.Run();
