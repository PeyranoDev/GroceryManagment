using Application.Schemas;
using Application.Schemas.Categories;
using Application.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoriesController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<IReadOnlyList<CategoryForResponseDto>>>> GetAll()
        {
            var categories = await _categoryService.GetAll();
            return Ok(ApiResponse<IReadOnlyList<CategoryForResponseDto>>.SuccessResponse(
                categories, 
                "Categorías obtenidas exitosamente"
            ));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<CategoryForResponseDto>>> GetById(int id)
        {
            var category = await _categoryService.GetById(id);
            return Ok(ApiResponse<CategoryForResponseDto>.SuccessResponse(
                category!, 
                "Categoría obtenida exitosamente"
            ));
        }

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

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<CategoryForResponseDto>>> Update(int id, [FromBody] CategoryForUpdateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<CategoryForResponseDto>.ErrorResponse("Datos de entrada inválidos."));

            var category = await _categoryService.Update(id, dto);
            return Ok(ApiResponse<CategoryForResponseDto>.SuccessResponse(
                category!, 
                "Categoría actualizada exitosamente"
            ));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse>> Delete(int id)
        {
            await _categoryService.Delete(id);
            return Ok(ApiResponse.SuccessResponse("Categoría eliminada exitosamente"));
        }
    }
}
