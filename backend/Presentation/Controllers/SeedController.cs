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
        private readonly ICategoryService _categoryService;
        private readonly IProductService _productService;
        private readonly IInventoryService _inventoryService;

        public SeedController(
            IGroceryService groceryService,
            ICategoryService categoryService, 
            IProductService productService,
            IInventoryService inventoryService)
        {
            _groceryService = groceryService;
            _categoryService = categoryService;
            _productService = productService;
            _inventoryService = inventoryService;
        }

        /// <summary>
        /// Crear datos de prueba para un grocery específico
        /// Requiere header X-Grocery-Id
        /// </summary>
        [HttpPost("sample-data")]
        public async Task<ActionResult<ApiResponse>> CreateSampleData()
        {
            // Crear categorías
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
                    var created = await _categoryService.Create(categoria);
                    categoriasCreadas.Add(created);
                }
                catch (Domain.Exceptions.DuplicateException)
                {
                    // Ya existe, continuar
                }
            }

            // Buscar categorías existentes
            var todasCategorias = await _categoryService.GetAll();
            var frutasTropicales = todasCategorias.FirstOrDefault(c => c.Name == "Frutas Tropicales");
            var frutasCitricas = todasCategorias.FirstOrDefault(c => c.Name == "Frutas Cítricas");
            var otros = todasCategorias.FirstOrDefault(c => c.Name == "Otros");

            if (frutasTropicales != null)
            {
                // Crear algunos productos de ejemplo
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

                var productosCreados = new List<ProductForResponseDto>();
                foreach (var producto in productos)
                {
                    try
                    {
                        var created = await _productService.Create(producto);
                        productosCreados.Add(created);

                        // Crear inventario para cada producto
                        await _inventoryService.Create(new InventoryItemForCreateDto
                        {
                            ProductId = created.Id,
                            Stock = Random.Shared.Next(10, 50)
                        });
                    }
                    catch (Domain.Exceptions.DuplicateException)
                    {
                        // Ya existe, continuar
                    }
                }
            }

            return Ok(ApiResponse.SuccessResponse("Datos de prueba creados exitosamente"));
        }

        /// <summary>
        /// Crear un grocery de prueba (no requiere header)
        /// </summary>
        [HttpPost("grocery")]
        public async Task<ActionResult<ApiResponse<GroceryForResponseDto>>> CreateTestGrocery([FromBody] GroceryForCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<GroceryForResponseDto>.ErrorResponse("Datos de entrada inválidos."));

            var grocery = await _groceryService.Create(dto);
            
            return Ok(ApiResponse<GroceryForResponseDto>.SuccessResponse(
                grocery, 
                $"Grocery '{grocery.Name}' creado exitosamente. Usa el header 'X-Grocery-Id: {grocery.Id}' en las próximas llamadas."
            ));
        }
    }
}