using Application.Schemas;
using Application.Schemas.Products;
using Application.Services.Interfaces;
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

        public ProductsController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<IReadOnlyList<ProductForResponseDto>>>> GetAll()
        {
            var products = await _productService.GetAll();
            return Ok(ApiResponse<IReadOnlyList<ProductForResponseDto>>.SuccessResponse(
                products, 
                "Productos obtenidos exitosamente"
            ));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<ProductForResponseDto>>> GetById(int id)
        {
            var product = await _productService.GetById(id);
            return Ok(ApiResponse<ProductForResponseDto>.SuccessResponse(
                product!, 
                "Producto obtenido exitosamente"
            ));
        }

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

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<ProductForResponseDto>>> Update(int id, [FromBody] ProductForUpdateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<ProductForResponseDto>.ErrorResponse("Datos de entrada inválidos."));

            var product = await _productService.Update(id, dto);
            return Ok(ApiResponse<ProductForResponseDto>.SuccessResponse(
                product!, 
                "Producto actualizado exitosamente"
            ));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse>> Delete(int id)
        {
            await _productService.Delete(id);
            return Ok(ApiResponse.SuccessResponse("Producto eliminado exitosamente"));
        }
    }
}