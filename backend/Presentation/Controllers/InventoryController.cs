using Application.Schemas;
using Application.Schemas.Inventory;
using Application.Services.Interfaces;
using Infraestructure.Tenancy;
using Microsoft.AspNetCore.Mvc;
using Presentation.Filters;

namespace Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [RequireGroceryHeader]
    public class InventoryController : ControllerBase
    {
        private readonly IInventoryService _inventoryService;
        private readonly ITenantProvider _tenantProvider;

        public InventoryController(IInventoryService inventoryService, ITenantProvider tenantProvider)
        {
            _inventoryService = inventoryService;
            _tenantProvider = tenantProvider;
        }

        /// <summary>
        /// Obtener todos los items de inventario del grocery actual
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<ApiResponse<IReadOnlyList<InventoryItemForResponseDto>>>> GetAll()
        {
            var items = await _inventoryService.GetAll();
            return Ok(ApiResponse<IReadOnlyList<InventoryItemForResponseDto>>.SuccessResponse(
                items, 
                "Items de inventario obtenidos exitosamente"
            ));
        }

        /// <summary>
        /// Obtener un item de inventario por ID (validando que pertenezca al grocery actual)
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<InventoryItemForResponseDto>>> GetById(int id)
        {
            var item = await _inventoryService.GetById(id);
            
            if (item != null && item.GroceryId != _tenantProvider.CurrentGroceryId)
                return NotFound(ApiResponse<InventoryItemForResponseDto>.ErrorResponse("Item de inventario no encontrado."));

            return Ok(ApiResponse<InventoryItemForResponseDto>.SuccessResponse(
                item!, 
                "Item de inventario obtenido exitosamente"
            ));
        }

        /// <summary>
        /// Obtener items de inventario por ID de producto (del grocery actual)
        /// </summary>
        [HttpGet("product/{productId}")]
        public async Task<ActionResult<ApiResponse<IReadOnlyList<InventoryItemForResponseDto>>>> GetByProductId(int productId)
        {
            var items = await _inventoryService.GetByProductId(productId);
            return Ok(ApiResponse<IReadOnlyList<InventoryItemForResponseDto>>.SuccessResponse(
                items, 
                "Items de inventario del producto obtenidos exitosamente"
            ));
        }

        /// <summary>
        /// Crear un nuevo item de inventario en el grocery actual
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<ApiResponse<InventoryItemForResponseDto>>> Create([FromBody] InventoryItemForCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<InventoryItemForResponseDto>.ErrorResponse("Datos de entrada inválidos."));

            var item = await _inventoryService.Create(dto);
            return CreatedAtAction(
                nameof(GetById), 
                new { id = item.Id }, 
                ApiResponse<InventoryItemForResponseDto>.SuccessResponse(
                    item, 
                    "Item de inventario creado exitosamente"
                )
            );
        }

        /// <summary>
        /// Actualizar un item de inventario existente (validando que pertenezca al grocery actual)
        /// </summary>
        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<InventoryItemForResponseDto>>> Update(int id, [FromBody] InventoryItemForUpdateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<InventoryItemForResponseDto>.ErrorResponse("Datos de entrada inválidos."));

            var existingItem = await _inventoryService.GetById(id);
            if (existingItem.GroceryId != _tenantProvider.CurrentGroceryId)
                return NotFound(ApiResponse<InventoryItemForResponseDto>.ErrorResponse("Item de inventario no encontrado."));

            var item = await _inventoryService.Update(id, dto);
            return Ok(ApiResponse<InventoryItemForResponseDto>.SuccessResponse(
                item!, 
                "Item de inventario actualizado exitosamente"
            ));
        }

        /// <summary>
        /// Eliminar un item de inventario (validando que pertenezca al grocery actual)
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse>> Delete(int id)
        {
            var existingItem = await _inventoryService.GetById(id);
            if (existingItem.GroceryId != _tenantProvider.CurrentGroceryId)
                return NotFound(ApiResponse.ErrorResponse("Item de inventario no encontrado."));

            await _inventoryService.Delete(id);
            return Ok(ApiResponse.SuccessResponse("Item de inventario eliminado exitosamente"));
        }
    }
}