using Application.Schemas;
using Application.Schemas.Categories;
using Application.Services.Interfaces;
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

        public CategoriesController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        /// <summary>
        /// Obtener todas las categor�as del grocery actual
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<ApiResponse<IReadOnlyList<CategoryForResponseDto>>>> GetAll()
        {
            var categories = await _categoryService.GetAll();
            return Ok(ApiResponse<IReadOnlyList<CategoryForResponseDto>>.SuccessResponse(
                categories, 
                "Categor�as obtenidas exitosamente"
            ));
        }

        /// <summary>
        /// Obtener una categor�a por ID (validando que pertenezca al grocery actual)
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<CategoryForResponseDto>>> GetById(int id)
        {
            var category = await _categoryService.GetById(id);
            return Ok(ApiResponse<CategoryForResponseDto>.SuccessResponse(
                category!, 
                "Categor�a obtenida exitosamente"
            ));
        }

        /// <summary>
        /// Crear una nueva categor�a en el grocery actual
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<ApiResponse<CategoryForResponseDto>>> Create([FromBody] CategoryForCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<CategoryForResponseDto>.ErrorResponse("Datos de entrada inv�lidos."));

            var category = await _categoryService.Create(dto);
            return CreatedAtAction(
                nameof(GetById), 
                new { id = category.Id }, 
                ApiResponse<CategoryForResponseDto>.SuccessResponse(
                    category, 
                    "Categor�a creada exitosamente"
                )
            );
        }

        /// <summary>
        /// Actualizar una categor�a existente (validando que pertenezca al grocery actual)
        /// </summary>
        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<CategoryForResponseDto>>> Update(int id, [FromBody] CategoryForUpdateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<CategoryForResponseDto>.ErrorResponse("Datos de entrada inv�lidos."));

            var category = await _categoryService.Update(id, dto);
            return Ok(ApiResponse<CategoryForResponseDto>.SuccessResponse(
                category!, 
                "Categor�a actualizada exitosamente"
            ));
        }

        /// <summary>
        /// Eliminar una categor�a (validando que pertenezca al grocery actual)
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse>> Delete(int id)
        {
            await _categoryService.Delete(id);
            return Ok(ApiResponse.SuccessResponse("Categor�a eliminada exitosamente"));
        }
    }
}