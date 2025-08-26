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

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        builder => builder.AllowAnyOrigin() // Allows all origins
                          .AllowAnyMethod() // Allows all HTTP methods (GET, POST, PUT, DELETE, etc.)
                          .AllowAnyHeader()); // Allows all headers
});

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Grocery Management API",
        Version = "v1",
        Description = "API para administraci�n multi-tenant de groceries."
    });

    c.AddSecurityDefinition("GroceryId", new OpenApiSecurityScheme
    {
        Type = SecuritySchemeType.ApiKey,
        In = ParameterLocation.Header,
        Name = "X-Grocery-Id",
        Description = "ID del grocery/verduler�a para multi-tenancy (requerido para todas las operaciones)"
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
            new string[] { }
        }
    });

    c.OperationFilter<GroceryIdHeaderOperationFilter>();
});

builder.Services.AddAutoMapper(cfg =>
{
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

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<GroceryManagmentContext>(options =>
{
    options.UseNpgsql(connectionString, npgsqlOptions =>
    {
        npgsqlOptions.EnableRetryOnFailure();
    });
});

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

app.UseMiddleware<GlobalExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
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
}

app.UseCors("AllowAllOrigins");

app.UseHttpsRedirection();

app.MapControllers();
app.Run();
