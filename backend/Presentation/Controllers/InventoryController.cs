using Application.Schemas;
using Application.Schemas.Inventory;
using Application.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InventoryController : ControllerBase
    {
        private readonly IInventoryService _inventoryService;

        public InventoryController(IInventoryService inventoryService)
        {
            _inventoryService = inventoryService;
        }

        private int? GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst("userId");
            if (userIdClaim != null && int.TryParse(userIdClaim.Value, out var userId))
            {
                return userId;
            }
            return null;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<IReadOnlyList<InventoryItemForResponseDto>>>> GetAll()
        {
            var items = await _inventoryService.GetAll();
            return Ok(ApiResponse<IReadOnlyList<InventoryItemForResponseDto>>.SuccessResponse(
                items, 
                "Items de inventario obtenidos exitosamente"
            ));
        }

        [HttpGet("filtered")]
        public async Task<ActionResult<ApiResponse<IReadOnlyList<InventoryItemForResponseDto>>>> GetFiltered(
            [FromQuery] string? searchTerm,
            [FromQuery] string? statusFilter)
        {
            var items = await _inventoryService.GetAll();
            
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

                var userId = GetCurrentUserId();
                var updatedItem = await _inventoryService.Update(id, updateDto, userId);
                
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

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<InventoryItemForResponseDto>>> GetById(int id)
        {
            var item = await _inventoryService.GetById(id);
            return Ok(ApiResponse<InventoryItemForResponseDto>.SuccessResponse(
                item!, 
                "Item de inventario obtenido exitosamente"
            ));
        }

        [HttpGet("product/{productId}")]
        public async Task<ActionResult<ApiResponse<IReadOnlyList<InventoryItemForResponseDto>>>> GetByProductId(int productId)
        {
            var items = await _inventoryService.GetByProductId(productId);
            return Ok(ApiResponse<IReadOnlyList<InventoryItemForResponseDto>>.SuccessResponse(
                items, 
                "Items de inventario del producto obtenidos exitosamente"
            ));
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<InventoryItemForResponseDto>>> Create([FromBody] InventoryItemForCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<InventoryItemForResponseDto>.ErrorResponse("Datos de entrada inválidos."));

            var userId = GetCurrentUserId();
            var item = await _inventoryService.Create(dto, userId);
            return CreatedAtAction(
                nameof(GetById), 
                new { id = item.Id }, 
                ApiResponse<InventoryItemForResponseDto>.SuccessResponse(
                    item, 
                    "Item de inventario creado exitosamente"
                )
            );
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<InventoryItemForResponseDto>>> Update(int id, [FromBody] InventoryItemForUpdateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<InventoryItemForResponseDto>.ErrorResponse("Datos de entrada inválidos."));

            var userId = GetCurrentUserId();
            var item = await _inventoryService.Update(id, dto, userId);
            return Ok(ApiResponse<InventoryItemForResponseDto>.SuccessResponse(
                item!, 
                "Item de inventario actualizado exitosamente"
            ));
        }

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
