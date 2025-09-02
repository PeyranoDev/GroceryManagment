using Application.Schemas.Categories;
using Application.Schemas.Groceries;
using Application.Schemas.Products;
using Application.Schemas.Inventory;
using Application.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Application.Schemas;

namespace Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SeedController : ControllerBase
    {
        private readonly IGroceryService _groceryService;
        private readonly ISeedService _seedService;

        public SeedController(
            IGroceryService groceryService,
            ISeedService seedService)
        {
            _groceryService = groceryService;
            _seedService = seedService;
        }

        [HttpPost("grocery")]
        public async Task<ActionResult<ApiResponse<GroceryForResponseDto>>> CreateTestGrocery([FromBody] GroceryForCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<GroceryForResponseDto>.ErrorResponse("Datos de entrada inválidos."));

            var grocery = await _groceryService.Create(dto);
            
            return Ok(ApiResponse<GroceryForResponseDto>.SuccessResponse(
                grocery, 
                $"Grocery '{grocery.Name}' creado exitosamente con ID {grocery.Id}. Usa el header 'X-Grocery-Id: {grocery.Id}' en las próximas llamadas."
            ));
        }

        [HttpPost("sample-data/{groceryId:int}")]
        public async Task<ActionResult<ApiResponse>> CreateSampleData(int groceryId)
        {
            // Verificar que el grocery existe
            try
            {
                await _groceryService.GetById(groceryId);
            }
            catch
            {
                return BadRequest(ApiResponse.ErrorResponse(
                    $"No existe un grocery con ID {groceryId}. " +
                    "Primero crea un grocery usando POST /api/seed/grocery"));
            }

            var categorias = new[]
            {
                new CategoryForCreateDto { Name = "Frutas Tropicales", Icon = "??" },
                new CategoryForCreateDto { Name = "Frutas Cítricas", Icon = "??" },
                new CategoryForCreateDto { Name = "Frutas de Huerta", Icon = "??" },
                new CategoryForCreateDto { Name = "Frutas Exóticas", Icon = "??" },
                new CategoryForCreateDto { Name = "Verduras y Hortalizas", Icon = "??" },
                new CategoryForCreateDto { Name = "Verduras Raíz", Icon = "??" },
                new CategoryForCreateDto { Name = "Verduras de Hoja", Icon = "??" },
                new CategoryForCreateDto { Name = "Otros", Icon = "??" }
            };

            var categoriasCreadas = new List<CategoryForResponseDto>();
            foreach (var categoria in categorias)
            {
                try
                {
                    var created = await _seedService.CreateCategory(categoria, groceryId);
                    categoriasCreadas.Add(created);
                }
                catch (Domain.Exceptions.DuplicateException)
                {
                    // Ignorar duplicados
                }
            }

            var todasCategorias = await _seedService.GetCategoriesByGroceryId(groceryId);
            var frutasTropicales = todasCategorias.FirstOrDefault(c => c.Name == "Frutas Tropicales");

            var productosCreados = 0;
            if (frutasTropicales != null)
            {
                var productos = new[]
                {
                    new ProductForCreateDto 
                    { 
                        Name = "Mango", 
                        UnitPrice = 2000, 
                        SalePrice = 2000, 
                        Unit = "u", 
                        Emoji = "??",
                        CategoryId = frutasTropicales.Id,
                        Promotion = new Application.Schemas.Products.PromotionDto 
                        { 
                            PromotionQuantity = 2, 
                            PromotionPrice = 3500 
                        }
                    },
                    new ProductForCreateDto 
                    { 
                        Name = "Banana Bolivia", 
                        UnitPrice = 1500, 
                        SalePrice = 1500, 
                        Unit = "kg", 
                        Emoji = "??",
                        CategoryId = frutasTropicales.Id,
                        Promotion = new Application.Schemas.Products.PromotionDto 
                        { 
                            PromotionQuantity = 2, 
                            PromotionPrice = 2500 
                        }
                    }
                };

                foreach (var producto in productos)
                {
                    try
                    {
                        var created = await _seedService.CreateProduct(producto, groceryId);

                        await _seedService.CreateInventoryItem(new InventoryItemForCreateDto
                        {
                            ProductId = created.Id,
                            Stock = Random.Shared.Next(10, 50)
                        }, groceryId);
                        
                        productosCreados++;
                    }
                    catch (Domain.Exceptions.DuplicateException)
                    {
                        // Ignorar duplicados
                    }
                }
            }

            return Ok(ApiResponse.SuccessResponse(
                $"Datos de prueba creados exitosamente para el grocery con ID {groceryId}. " +
                $"Se crearon {categoriasCreadas.Count} categorías y {productosCreados} productos."));
        }

        [HttpPost("complete-setup")]
        public async Task<ActionResult<ApiResponse<object>>> CreateCompleteSetup([FromBody] GroceryForCreateDto groceryDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<object>.ErrorResponse("Datos de entrada inválidos."));

            // 1. Crear el grocery
            var grocery = await _groceryService.Create(groceryDto);

            // 2. Crear categorías
            var categorias = new[]
            {
                new CategoryForCreateDto { Name = "Frutas Tropicales", Icon = "??" },
                new CategoryForCreateDto { Name = "Frutas Cítricas", Icon = "??" },
                new CategoryForCreateDto { Name = "Frutas de Huerta", Icon = "??" },
                new CategoryForCreateDto { Name = "Frutas Exóticas", Icon = "??" },
                new CategoryForCreateDto { Name = "Verduras y Hortalizas", Icon = "??" },
                new CategoryForCreateDto { Name = "Verduras Raíz", Icon = "??" },
                new CategoryForCreateDto { Name = "Verduras de Hoja", Icon = "??" },
                new CategoryForCreateDto { Name = "Otros", Icon = "??" }
            };

            var categoriasCreadas = new List<CategoryForResponseDto>();
            foreach (var categoria in categorias)
            {
                try
                {
                    var created = await _seedService.CreateCategory(categoria, grocery.Id);
                    categoriasCreadas.Add(created);
                }
                catch (Domain.Exceptions.DuplicateException)
                {
                    // Ignorar duplicados
                }
            }

            // 3. Crear productos
            var todasCategorias = await _seedService.GetCategoriesByGroceryId(grocery.Id);
            var frutasTropicales = todasCategorias.FirstOrDefault(c => c.Name == "Frutas Tropicales");

            var productosCreados = 0;
            if (frutasTropicales != null)
            {
                var productos = new []
                {
                    new ProductForCreateDto 
                    { 
                        Name = "Mango", 
                        UnitPrice = 2000, 
                        SalePrice = 2000, 
                        Unit = "u", 
                        Emoji = "??",
                        CategoryId = frutasTropicales.Id,
                        Promotion = new Application.Schemas.Products.PromotionDto 
                        { 
                            PromotionQuantity = 2, 
                            PromotionPrice = 3500 
                        }
                    },
                    new ProductForCreateDto 
                    { 
                        Name = "Banana Bolivia", 
                        UnitPrice = 1500, 
                        SalePrice = 1500, 
                        Unit = "kg", 
                        Emoji = "??",
                        CategoryId = frutasTropicales.Id,
                        Promotion = new Application.Schemas.Products.PromotionDto 
                        { 
                            PromotionQuantity = 2, 
                            PromotionPrice = 2500 
                        }
                    }
                };

                foreach (var producto in productos)
                {
                    try
                    {
                        var created = await _seedService.CreateProduct(producto, grocery.Id);
                        await _seedService.CreateInventoryItem(new InventoryItemForCreateDto
                        {
                            ProductId = created.Id,
                            Stock = Random.Shared.Next(10, 50)
                        }, grocery.Id);
                        productosCreados++;
                    }
                    catch (Domain.Exceptions.DuplicateException)
                    {
                        // Ignorar duplicados
                    }
                }
            }

            return Ok(ApiResponse<object>.SuccessResponse(
                new 
                { 
                    grocery = grocery,
                    categoriesCreated = categoriasCreadas.Count,
                    productsCreated = productosCreados
                },
                $"Setup completo creado exitosamente. Grocery '{grocery.Name}' (ID: {grocery.Id}) con {categoriasCreadas.Count} categorías y {productosCreados} productos. " +
                $"Usa el header 'X-Grocery-Id: {grocery.Id}' en las próximas llamadas."
            ));
        }
    }
}