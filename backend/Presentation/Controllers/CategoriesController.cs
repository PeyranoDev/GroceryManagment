using Application.Schemas;
using Application.Schemas.Categories;
using Application.Services.Interfaces;
using Infraestructure.Tenancy;
using Microsoft.AspNetCore.Mvc;
using Presentation.Filters;

namespace Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [RequireGroceryHeader]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryService _categoryService;
        private readonly ITenantProvider _tenantProvider;

        public CategoriesController(ICategoryService categoryService, ITenantProvider tenantProvider)
        {
            _categoryService = categoryService;
            _tenantProvider = tenantProvider;
        }

        /// <summary>
        /// Obtener todas las categorías del grocery actual
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<ApiResponse<IReadOnlyList<CategoryForResponseDto>>>> GetAll()
        {
            var categories = await _categoryService.GetAll();
            return Ok(ApiResponse<IReadOnlyList<CategoryForResponseDto>>.SuccessResponse(
                categories, 
                "Categorías obtenidas exitosamente"
            ));
        }

        /// <summary>
        /// Obtener una categoría por ID (validando que pertenezca al grocery actual)
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<CategoryForResponseDto>>> GetById(int id)
        {
            var category = await _categoryService.GetById(id);
            
            if (category != null && category.GroceryId != _tenantProvider.CurrentGroceryId)
                return NotFound(ApiResponse<CategoryForResponseDto>.ErrorResponse("Categoría no encontrada."));

            return Ok(ApiResponse<CategoryForResponseDto>.SuccessResponse(
                category!, 
                "Categoría obtenida exitosamente"
            ));
        }

        /// <summary>
        /// Crear una nueva categoría en el grocery actual
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<ApiResponse<CategoryForResponseDto>>> Create([FromBody] CategoryForCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<CategoryForResponseDto>.ErrorResponse("Datos de entrada inválidos."));

            var category = await _categoryService.Create(dto);
            return CreatedAtAction(
                nameof(GetById), 
                new { id = category.Id }, 
                ApiResponse<CategoryForResponseDto>.SuccessResponse(
                    category, 
                    "Categoría creada exitosamente"
                )
            );
        }

        /// <summary>
        /// Actualizar una categoría existente (validando que pertenezca al grocery actual)
        /// </summary>
        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<CategoryForResponseDto>>> Update(int id, [FromBody] CategoryForUpdateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<CategoryForResponseDto>.ErrorResponse("Datos de entrada inválidos."));

            var existingCategory = await _categoryService.GetById(id);
            if (existingCategory.GroceryId != _tenantProvider.CurrentGroceryId)
                return NotFound(ApiResponse<CategoryForResponseDto>.ErrorResponse("Categoría no encontrada."));

            var category = await _categoryService.Update(id, dto);
            return Ok(ApiResponse<CategoryForResponseDto>.SuccessResponse(
                category!, 
                "Categoría actualizada exitosamente"
            ));
        }

        /// <summary>
        /// Eliminar una categoría (validando que pertenezca al grocery actual)
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse>> Delete(int id)
        {
            var existingCategory = await _categoryService.GetById(id);
            if (existingCategory.GroceryId != _tenantProvider.CurrentGroceryId)
                return NotFound(ApiResponse.ErrorResponse("Categoría no encontrada."));

            await _categoryService.Delete(id);
            return Ok(ApiResponse.SuccessResponse("Categoría eliminada exitosamente"));
        }
    }
}