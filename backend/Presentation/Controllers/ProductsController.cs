using Application.Schemas;
using Application.Schemas.Products;
using Application.Services.Interfaces;
using Infraestructure.Tenancy;
using Microsoft.AspNetCore.Mvc;
using Presentation.Filters;

namespace Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [RequireGroceryHeader]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;
        private readonly ITenantProvider _tenantProvider;

        public ProductsController(IProductService productService, ITenantProvider tenantProvider)
        {
            _productService = productService;
            _tenantProvider = tenantProvider;
        }

        /// <summary>
        /// Obtener todos los productos del grocery actual
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<ApiResponse<IReadOnlyList<ProductForResponseDto>>>> GetAll()
        {
            var products = await _productService.GetAll();
            return Ok(ApiResponse<IReadOnlyList<ProductForResponseDto>>.SuccessResponse(
                products, 
                "Productos obtenidos exitosamente"
            ));
        }

        /// <summary>
        /// Obtener un producto por ID (validando que pertenezca al grocery actual)
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<ProductForResponseDto>>> GetById(int id)
        {
            var product = await _productService.GetById(id);
            
            if (product != null && product.GroceryId != _tenantProvider.CurrentGroceryId)
                return NotFound(ApiResponse<ProductForResponseDto>.ErrorResponse("Producto no encontrado."));

            return Ok(ApiResponse<ProductForResponseDto>.SuccessResponse(
                product!, 
                "Producto obtenido exitosamente"
            ));
        }

        /// <summary>
        /// Crear un nuevo producto en el grocery actual
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<ApiResponse<ProductForResponseDto>>> Create([FromBody] ProductForCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<ProductForResponseDto>.ErrorResponse("Datos de entrada inválidos."));

            var product = await _productService.Create(dto);
            return CreatedAtAction(
                nameof(GetById), 
                new { id = product.Id }, 
                ApiResponse<ProductForResponseDto>.SuccessResponse(
                    product, 
                    "Producto creado exitosamente"
                )
            );
        }

        /// <summary>
        /// Actualizar un producto existente (validando que pertenezca al grocery actual)
        /// </summary>
        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<ProductForResponseDto>>> Update(int id, [FromBody] ProductForUpdateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<ProductForResponseDto>.ErrorResponse("Datos de entrada inválidos."));

            var existingProduct = await _productService.GetById(id);
            if (existingProduct.GroceryId != _tenantProvider.CurrentGroceryId)
                return NotFound(ApiResponse<ProductForResponseDto>.ErrorResponse("Producto no encontrado."));

            var product = await _productService.Update(id, dto);
            return Ok(ApiResponse<ProductForResponseDto>.SuccessResponse(
                product!, 
                "Producto actualizado exitosamente"
            ));
        }

        /// <summary>
        /// Eliminar un producto (validando que pertenezca al grocery actual)
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse>> Delete(int id)
        {
            var existingProduct = await _productService.GetById(id);
            if (existingProduct.GroceryId != _tenantProvider.CurrentGroceryId)
                return NotFound(ApiResponse.ErrorResponse("Producto no encontrado."));

            await _productService.Delete(id);
            return Ok(ApiResponse.SuccessResponse("Producto eliminado exitosamente"));
        }
    }
}