using Application.Schemas;
using Application.Schemas.Sales;
using Application.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class SalesController : ControllerBase
    {
        private readonly ISaleService _saleService;

        public SalesController(ISaleService saleService)
        {
            _saleService = saleService;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<IReadOnlyList<SaleForResponseDto>>>> GetAll()
        {
            var sales = await _saleService.GetAll();
            return Ok(ApiResponse<IReadOnlyList<SaleForResponseDto>>.SuccessResponse(
                sales, 
                "Ventas obtenidas exitosamente"
            ));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<SaleForResponseDto>>> GetById(int id)
        {
            var sale = await _saleService.GetById(id);
            return Ok(ApiResponse<SaleForResponseDto>.SuccessResponse(
                sale!, 
                "Venta obtenida exitosamente"
            ));
        }

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

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<ApiResponse<IReadOnlyList<SaleForResponseDto>>>> GetByUserId(int userId)
        {
            var sales = await _saleService.GetByUserId(userId);
            return Ok(ApiResponse<IReadOnlyList<SaleForResponseDto>>.SuccessResponse(
                sales, 
                "Ventas del usuario obtenidas exitosamente"
            ));
        }

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

        public class StatusUpdateDto { public string? Status { get; set; } }

        [HttpPost("{id}/order-status")]
        public async Task<ActionResult<ApiResponse<SaleForResponseDto>>> UpdateOrderStatus(int id, [FromBody] StatusUpdateDto dto)
        {
            var status = string.IsNullOrWhiteSpace(dto?.Status) ? "Created" : dto!.Status!;
            var sale = await _saleService.UpdateOrderStatus(id, status);
            if (sale is null) return NotFound(ApiResponse<SaleForResponseDto>.ErrorResponse("Venta no encontrada"));
            return Ok(ApiResponse<SaleForResponseDto>.SuccessResponse(sale, "Estado de pedido actualizado"));
        }

        [HttpPost("{id}/payment-status")]
        public async Task<ActionResult<ApiResponse<SaleForResponseDto>>> UpdatePaymentStatus(int id, [FromBody] StatusUpdateDto dto)
        {
            var status = string.IsNullOrWhiteSpace(dto?.Status) ? "Pending" : dto!.Status!;
            var sale = await _saleService.UpdatePaymentStatus(id, status);
            if (sale is null) return NotFound(ApiResponse<SaleForResponseDto>.ErrorResponse("Venta no encontrada"));
            return Ok(ApiResponse<SaleForResponseDto>.SuccessResponse(sale, "Estado de pago actualizado"));
        }

        [HttpPost("{id}/payments")]
        public async Task<ActionResult<ApiResponse<SaleForResponseDto>>> AddPayment(int id, [FromBody] dynamic body)
        {
            var method = (string?)body?.method ?? "Efectivo";
            var amount = (decimal?)body?.amount ?? 0m;
            var sale = await _saleService.AddPayment(id, method, amount);
            return Ok(ApiResponse<SaleForResponseDto>.SuccessResponse(sale!, "Pago registrado"));
        }

        [HttpPost("cart")]
        public async Task<ActionResult<ApiResponse<SaleForResponseDto>>> CreateSaleFromCart([FromBody] CreateSaleFromCartDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<SaleForResponseDto>.ErrorResponse("Datos de entrada inválidos."));

            try
            {
                // Combinar fecha y hora del formulario
                var saleDate = dto.Details.Date.Date; // Solo la fecha
                if (!string.IsNullOrEmpty(dto.Details.Time) && TimeSpan.TryParse(dto.Details.Time, out var time))
                {
                    saleDate = saleDate.Add(time);
                }
                
                var saleDto = new SaleForCreateDto
                {
                    UserId = dto.UserId,
                    Items = dto.Cart.Select(item => new SaleItemForCreateDto
                    {
                        ProductId = item.ProductId,
                        Quantity = item.Quantity,
                        Price = item.SalePrice,
                        PriceUSD = item.SalePriceUSD
                    }).ToList(),
                    Date = saleDate,
                    PaymentMethod = dto.Details.PaymentMethod,
                    IsOnline = dto.Details.IsOnline,
                    DeliveryCost = dto.Details.DeliveryCost,
                    CustomerName = dto.Details.Client,
                    OrderStatus = dto.Details.IsOnline ? "Created" : "Delivered",
                    PaymentStatus = dto.Details.IsOnline ? "Pending" : "Paid",
                    Moneda = dto.Moneda
                };

                var sale = await _saleService.Create(saleDto);
                
                return CreatedAtAction(
                    nameof(GetById), 
                    new { id = sale.Id }, 
                    ApiResponse<SaleForResponseDto>.SuccessResponse(
                        sale, 
                        "Venta creada exitosamente desde carrito"
                    )
                );
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<SaleForResponseDto>.ErrorResponse($"Error al crear venta: {ex.Message}"));
            }
        }

        [HttpPost("{id}/whatsapp")]
        public async Task<ActionResult<ApiResponse<WhatsAppMessageDto>>> GenerateWhatsAppMessage(int id, [FromBody] SaleDetailsDto details)
        {
            try
            {
                var sale = await _saleService.GetById(id);
                if (sale == null)
                    return NotFound(ApiResponse<WhatsAppMessageDto>.ErrorResponse("Venta no encontrada."));

                var message = GenerateWhatsAppText(sale, details);
                
                var whatsAppDto = new WhatsAppMessageDto
                {
                    ClientName = details.Client,
                    Message = message,
                    Total = sale.Total + (details.IsOnline ? details.DeliveryCost : 0),
                    DeliveryCost = details.IsOnline ? details.DeliveryCost : 0,
                    Date = details.Date,
                    Time = details.Time,
                    PaymentMethod = details.PaymentMethod,
                    IsOnline = details.IsOnline
                };

                return Ok(ApiResponse<WhatsAppMessageDto>.SuccessResponse(
                    whatsAppDto, 
                    "Mensaje de WhatsApp generado exitosamente"
                ));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<WhatsAppMessageDto>.ErrorResponse($"Error al generar mensaje: {ex.Message}"));
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse>> Delete(int id)
        {
            await _saleService.Delete(id);
            return Ok(ApiResponse.SuccessResponse("Venta eliminada exitosamente"));
        }

        

        private string GenerateWhatsAppText(SaleForResponseDto sale, SaleDetailsDto details)
        {
            var message = $"🛒 *Tomillo Verdulería*\n\n";
            message += $"📅 Fecha: {details.Date:dd/MM/yyyy}\n";
            message += $"🕐 Hora: {details.Time}\n";
            
            if (!string.IsNullOrEmpty(details.Client))
                message += $"👤 Cliente: {details.Client}\n";
            
            message += $"💳 Método de pago: {details.PaymentMethod}\n";
            
            if (details.IsOnline)
                message += $"🚚 Venta Online - Costo de envío: ${details.DeliveryCost:F0}\n";
            
            message += "\n📋 *Detalle de productos:*\n";
            
            foreach (var item in sale.Items)
            {
                message += $"• {item.Product.Name} x{item.Quantity} - ${item.Price * item.Quantity:F0}\n";
            }
            
            message += $"\n💰 *Subtotal:* ${sale.Total:F0}\n";
            
            if (details.IsOnline && details.DeliveryCost > 0)
            {
                message += $"🚚 *Envío:* ${details.DeliveryCost:F0}\n";
                message += $"💰 *Total:* ${sale.Total + details.DeliveryCost:F0}\n";
            }
            else
            {
                message += $"💰 *Total:* ${sale.Total:F0}\n";
            }
            
            if (!string.IsNullOrEmpty(details.Observations))
                message += $"\n📝 *Observaciones:* {details.Observations}";
            
            message += "\n\n¡Gracias por tu compra! 🙏";
            
            return message;
        }
    }

    public class CreateSaleFromCartDto
    {
        public int UserId { get; set; }
        public List<Application.Schemas.Sales.SaleCartSimpleDto> Cart { get; set; } = new List<Application.Schemas.Sales.SaleCartSimpleDto>();
        public SaleDetailsDto Details { get; set; } = null!;
        
        /// <summary>
        /// Moneda de la venta (1 = ARS, 2 = USD). Por defecto ARS.
        /// </summary>
        public Domain.Common.Enums.Moneda Moneda { get; set; } = Domain.Common.Enums.Moneda.ARS;
    }
}
