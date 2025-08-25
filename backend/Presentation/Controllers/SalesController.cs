using Application.Schemas;
using Application.Schemas.Sales;
using Application.Services.Interfaces;
using Infraestructure.Tenancy;
using Microsoft.AspNetCore.Mvc;
using Presentation.Filters;

namespace Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [RequireGroceryHeader]
    public class SalesController : ControllerBase
    {
        private readonly ISaleService _saleService;
        private readonly ITenantProvider _tenantProvider;

        public SalesController(ISaleService saleService, ITenantProvider tenantProvider)
        {
            _saleService = saleService;
            _tenantProvider = tenantProvider;
        }

        /// <summary>
        /// Obtener todas las ventas del grocery actual
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<ApiResponse<IReadOnlyList<SaleForResponseDto>>>> GetAll()
        {
            var sales = await _saleService.GetAll();
            return Ok(ApiResponse<IReadOnlyList<SaleForResponseDto>>.SuccessResponse(
                sales, 
                "Ventas obtenidas exitosamente"
            ));
        }

        /// <summary>
        /// Obtener una venta por ID (validando que pertenezca al grocery actual)
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<SaleForResponseDto>>> GetById(int id)
        {
            var sale = await _saleService.GetById(id);
            
            if (sale != null && sale.GroceryId != _tenantProvider.CurrentGroceryId)
                return NotFound(ApiResponse<SaleForResponseDto>.ErrorResponse("Venta no encontrada."));

            return Ok(ApiResponse<SaleForResponseDto>.SuccessResponse(
                sale!, 
                "Venta obtenida exitosamente"
            ));
        }

        /// <summary>
        /// Obtener ventas por rango de fechas (del grocery actual)
        /// </summary>
        [HttpGet("date-range")]
        public async Task<ActionResult<ApiResponse<IReadOnlyList<SaleForResponseDto>>>> GetByDateRange(
            [FromQuery] DateTime startDate, 
            [FromQuery] DateTime endDate)
        {
            var sales = await _saleService.GetByDateRange(startDate, endDate);
            return Ok(ApiResponse<IReadOnlyList<SaleForResponseDto>>.SuccessResponse(
                sales, 
                "Ventas por rango de fechas obtenidas exitosamente"
            ));
        }

        /// <summary>
        /// Obtener ventas por ID de usuario (del grocery actual)
        /// </summary>
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<ApiResponse<IReadOnlyList<SaleForResponseDto>>>> GetByUserId(int userId)
        {
            var sales = await _saleService.GetByUserId(userId);
            return Ok(ApiResponse<IReadOnlyList<SaleForResponseDto>>.SuccessResponse(
                sales, 
                "Ventas del usuario obtenidas exitosamente"
            ));
        }

        /// <summary>
        /// Crear una nueva venta en el grocery actual
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<ApiResponse<SaleForResponseDto>>> Create([FromBody] SaleForCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<SaleForResponseDto>.ErrorResponse("Datos de entrada inválidos."));

            var sale = await _saleService.Create(dto);
            return CreatedAtAction(
                nameof(GetById), 
                new { id = sale.Id }, 
                ApiResponse<SaleForResponseDto>.SuccessResponse(
                    sale, 
                    "Venta creada exitosamente"
                )
            );
        }

        /// <summary>
        /// Eliminar una venta (validando que pertenezca al grocery actual)
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse>> Delete(int id)
        {
            var existingSale = await _saleService.GetById(id);
            if (existingSale.GroceryId != _tenantProvider.CurrentGroceryId)
                return NotFound(ApiResponse.ErrorResponse("Venta no encontrada."));

            await _saleService.Delete(id);
            return Ok(ApiResponse.SuccessResponse("Venta eliminada exitosamente"));
        }
    }
}