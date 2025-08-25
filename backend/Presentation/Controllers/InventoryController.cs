using Application.Schemas;
using Application.Schemas.Inventory;
using Application.Services.Interfaces;
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

        public InventoryController(IInventoryService inventoryService)
        {
            _inventoryService = inventoryService;
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
        /// Obtener inventario con filtros (para la página de inventario del frontend)
        /// </summary>
        [HttpGet("filtered")]
        public async Task<ActionResult<ApiResponse<IReadOnlyList<InventoryItemForResponseDto>>>> GetFiltered(
            [FromQuery] string? searchTerm,
            [FromQuery] string? statusFilter)
        {
            var items = await _inventoryService.GetAll();
            
            // Aplicar filtros
            if (!string.IsNullOrEmpty(searchTerm))
            {
                items = items.Where(i => i.Product.Name.Contains(searchTerm, StringComparison.OrdinalIgnoreCase)).ToList();
            }
            
            if (!string.IsNullOrEmpty(statusFilter))
            {
                items = statusFilter.ToLower() switch
                {
                    "low" => items.Where(i => i.Stock > 0 && i.Stock <= 10).ToList(),
                    "out" => items.Where(i => i.Stock == 0).ToList(),
                    _ => items
                };
            }
            
            return Ok(ApiResponse<IReadOnlyList<InventoryItemForResponseDto>>.SuccessResponse(
                items, 
                "Items de inventario filtrados obtenidos exitosamente"
            ));
        }

        /// <summary>
        /// Obtener estado del stock para un producto
        /// </summary>
        [HttpGet("{id}/status")]
        public async Task<ActionResult<ApiResponse<InventoryStatusDto>>> GetStockStatus(int id)
        {
            var item = await _inventoryService.GetById(id);
            var status = GetStockStatusDto(item!.Stock);
            
            return Ok(ApiResponse<InventoryStatusDto>.SuccessResponse(
                status, 
                "Estado del stock obtenido exitosamente"
            ));
        }

        /// <summary>
        /// Ajustar stock de un producto (lógica del frontend)
        /// </summary>
        [HttpPost("{id}/adjust-stock")]
        public async Task<ActionResult<ApiResponse<InventoryItemForResponseDto>>> AdjustStock(int id, [FromBody] StockAdjustmentDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<InventoryItemForResponseDto>.ErrorResponse("Datos de entrada inválidos."));

            try
            {
                var updateDto = new InventoryItemForUpdateDto
                {
                    Stock = dto.NewStock
                };

                var updatedItem = await _inventoryService.Update(id, updateDto);
                
                return Ok(ApiResponse<InventoryItemForResponseDto>.SuccessResponse(
                    updatedItem!, 
                    "Stock ajustado exitosamente"
                ));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<InventoryItemForResponseDto>.ErrorResponse($"Error al ajustar stock: {ex.Message}"));
            }
        }

        /// <summary>
        /// Obtener productos con bajo stock
        /// </summary>
        [HttpGet("low-stock")]
        public async Task<ActionResult<ApiResponse<IReadOnlyList<InventoryItemForResponseDto>>>> GetLowStock([FromQuery] int threshold = 10)
        {
            var items = await _inventoryService.GetAll();
            var lowStockItems = items.Where(i => i.Stock > 0 && i.Stock <= threshold).ToList();
            
            return Ok(ApiResponse<IReadOnlyList<InventoryItemForResponseDto>>.SuccessResponse(
                lowStockItems, 
                "Productos con bajo stock obtenidos exitosamente"
            ));
        }

        /// <summary>
        /// Obtener productos sin stock
        /// </summary>
        [HttpGet("out-of-stock")]
        public async Task<ActionResult<ApiResponse<IReadOnlyList<InventoryItemForResponseDto>>>> GetOutOfStock()
        {
            var items = await _inventoryService.GetAll();
            var outOfStockItems = items.Where(i => i.Stock == 0).ToList();
            
            return Ok(ApiResponse<IReadOnlyList<InventoryItemForResponseDto>>.SuccessResponse(
                outOfStockItems, 
                "Productos sin stock obtenidos exitosamente"
            ));
        }

        /// <summary>
        /// Obtener un item de inventario por ID (validando que pertenezca al grocery actual)
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<InventoryItemForResponseDto>>> GetById(int id)
        {
            var item = await _inventoryService.GetById(id);
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
            await _inventoryService.Delete(id);
            return Ok(ApiResponse.SuccessResponse("Item de inventario eliminado exitosamente"));
        }

        private InventoryStatusDto GetStockStatusDto(int stock)
        {
            if (stock == 0)
            {
                return new InventoryStatusDto
                {
                    Status = "out",
                    StatusText = "Sin Stock",
                    StatusColor = "text-red-400"
                };
            }
            else if (stock <= 10)
            {
                return new InventoryStatusDto
                {
                    Status = "low",
                    StatusText = "Bajo Stock",
                    StatusColor = "text-yellow-400"
                };
            }
            else
            {
                return new InventoryStatusDto
                {
                    Status = "normal",
                    StatusText = "Stock Normal",
                    StatusColor = "text-green-400"
                };
            }
        }
    }
}