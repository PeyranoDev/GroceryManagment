using Application.Mapping;
using Application.Services.Implementations;
using Application.Services.Interfaces;
using Domain.Repositories;
using Domain.Tenancy;
using Infraestructure;
using Infraestructure.Repositories;
using Infraestructure.Services;
using Infraestructure.Tenancy;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Presentation.Middleware;
using Azure.Identity;

var builder = WebApplication.CreateBuilder(args);

string conn = string.Empty;

if (builder.Environment.IsProduction())
{
    try
    {
        var keyVaultEndpoint = new Uri("https://grocerymanagerkv.vault.azure.net/");
        // Usar ManagedIdentityCredential para Container Apps con System-Assigned Identity
        builder.Configuration.AddAzureKeyVault(keyVaultEndpoint, new ManagedIdentityCredential());
        Console.WriteLine("Key Vault configurado correctamente con Managed Identity.");
        
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

System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();

builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
        options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Authentication:Issuer"],
            ValidAudience = builder.Configuration["Authentication:Audience"],
            IssuerSigningKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(
                System.Text.Encoding.UTF8.GetBytes(builder.Configuration["Authentication:SecretForKey"]!)),
            RoleClaimType = "role",
            NameClaimType = "name"
        };
    });

builder.Services.AddAuthorization(options =>
{
    options.FallbackPolicy = new Microsoft.AspNetCore.Authorization.AuthorizationPolicyBuilder()
        .RequireAuthenticatedUser()
        .Build();
    
    options.AddPolicy("SuperAdmin", policy =>
        policy.RequireAssertion(context =>
        {
            var allowed = new HashSet<string>(StringComparer.OrdinalIgnoreCase) { "SuperAdmin", "3" };
            // Check both custom "role" claim and standard ClaimTypes.Role
            bool hasCustomRole = context.User.Claims.Any(c => c.Type == "role" && allowed.Contains(c.Value));
            bool hasStandardRole = context.User.Claims.Any(c => c.Type == System.Security.Claims.ClaimTypes.Role && allowed.Contains(c.Value));
            return hasCustomRole || hasStandardRole;
        }));

    options.AddPolicy("Admin", policy =>
        policy.RequireAssertion(context =>
        {
            var allowed = new HashSet<string>(StringComparer.OrdinalIgnoreCase) { "Admin", "2", "SuperAdmin", "3" };
            bool hasCustomRole = context.User.Claims.Any(c => c.Type == "role" && allowed.Contains(c.Value));
            bool hasStandardRole = context.User.Claims.Any(c => c.Type == System.Security.Claims.ClaimTypes.Role && allowed.Contains(c.Value));
            return hasCustomRole || hasStandardRole;
        }));
    
    options.AddPolicy("Staff", policy =>
        policy.RequireAssertion(context =>
            context.User.HasClaim(c => c.Type == "role")));
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Grocery Management API",
        Version = "v1",
        Description = "API para administración multi-tenant de groceries."
    });
});

builder.Services.AddAutoMapper(cfg =>
{
    cfg.LicenseKey = builder.Configuration["AutoMapperLicense"];
    cfg.AddProfile<AuthProfile>();
    cfg.AddProfile<CategoryProfile>();
    cfg.AddProfile<ProductProfile>();
    cfg.AddProfile<InventoryProfile>();
    cfg.AddProfile<SaleProfile>();
    cfg.AddProfile<GroceryProfile>();
    cfg.AddProfile<UserProfile>();
    cfg.AddProfile<PurchaseProfile>();
});

builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ITenantProvider, ClaimsGroceryProvider>();

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

builder.Services.AddDbContextFactory<GroceryManagmentContext>(opt =>
    opt.UseNpgsql(conn), ServiceLifetime.Scoped);

AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

builder.Services.AddScoped(typeof(IBaseRepository<>), typeof(BaseRepository<>));
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IInventoryRepository, InventoryRepository>();
builder.Services.AddScoped<ISaleRepository, SaleRepository>();
builder.Services.AddScoped<IGroceryRepository, GroceryRepository>();
builder.Services.AddScoped<IPurchaseRepository, PurchaseRepository>();

builder.Services.AddScoped<IDashboardQueryService, DashboardQueryService>();

builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IInventoryService, InventoryService>();
builder.Services.AddScoped<ISaleService, SaleService>();
builder.Services.AddScoped<IGroceryService, GroceryService>();
builder.Services.AddScoped<IDerivedRecentActivityService, DerivedRecentActivityService>();
builder.Services.AddScoped<IPurchaseService, PurchaseService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();
builder.Services.AddScoped<IReportService, ReportService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();
builder.Services.AddScoped<ISeedService, SeedService>();

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

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();
