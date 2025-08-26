using Application.Schemas;
using Application.Schemas.Groceries;
using Application.Services.Interfaces;
using Domain.Tenancy;
using Infraestructure.Tenancy;
using Microsoft.AspNetCore.Mvc;
using Presentation.Filters;

namespace Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GroceriesController : ControllerBase
    {
        private readonly IGroceryService _groceryService;
        private readonly ITenantProvider _tenantProvider;

        public GroceriesController(IGroceryService groceryService, ITenantProvider tenantProvider)
        {
            _groceryService = groceryService;
            _tenantProvider = tenantProvider;
        }

        /// <summary>
        /// Obtener todas las verduler�as
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<ApiResponse<IReadOnlyList<GroceryForResponseDto>>>> GetAll()
        {
            var groceries = await _groceryService.GetAll();
            return Ok(ApiResponse<IReadOnlyList<GroceryForResponseDto>>.SuccessResponse(
                groceries, 
                "Verduler�as obtenidas exitosamente"
            ));
        }

        /// <summary>
        /// Obtener el grocery actual del tenant
        /// </summary>
        [HttpGet("current")]
        [RequireGroceryHeader]
        public async Task<ActionResult<ApiResponse<GroceryForResponseDto>>> GetCurrent()
        {
            var grocery = await _groceryService.GetById(_tenantProvider.CurrentGroceryId);
            return Ok(ApiResponse<GroceryForResponseDto>.SuccessResponse(
                grocery!, 
                "Grocery actual obtenido exitosamente"
            ));
        }

        /// <summary>
        /// Obtener una verduler�a por ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<GroceryForResponseDto>>> GetById(int id)
        {
            var grocery = await _groceryService.GetById(id);
            return Ok(ApiResponse<GroceryForResponseDto>.SuccessResponse(
                grocery!, 
                "Verduler�a obtenida exitosamente"
            ));
        }

        /// <summary>
        /// Crear una nueva verduler�a
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<ApiResponse<GroceryForResponseDto>>> Create([FromBody] GroceryForCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<GroceryForResponseDto>.ErrorResponse("Datos de entrada inv�lidos."));

            var grocery = await _groceryService.Create(dto);
            return CreatedAtAction(
                nameof(GetById), 
                new { id = grocery.Id }, 
                ApiResponse<GroceryForResponseDto>.SuccessResponse(
                    grocery, 
                    "Verduler�a creada exitosamente"
                )
            );
        }

        /// <summary>
        /// Actualizar una verduler�a existente
        /// </summary>
        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<GroceryForResponseDto>>> Update(int id, [FromBody] GroceryForUpdateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<GroceryForResponseDto>.ErrorResponse("Datos de entrada inv�lidos."));

            var grocery = await _groceryService.Update(id, dto);
            return Ok(ApiResponse<GroceryForResponseDto>.SuccessResponse(
                grocery!, 
                "Verduler�a actualizada exitosamente"
            ));
        }

        /// <summary>
        /// Eliminar una verduler�a
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse>> Delete(int id)
        {
            await _groceryService.Delete(id);
            return Ok(ApiResponse.SuccessResponse("Verduler�a eliminada exitosamente"));
        }
    }
}