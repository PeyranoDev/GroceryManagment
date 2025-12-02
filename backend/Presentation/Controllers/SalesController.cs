using Application.Schemas;
using Application.Schemas.Sales;
using Application.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
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

        [HttpPost("cart")]
        public async Task<ActionResult<ApiResponse<SaleForResponseDto>>> CreateSaleFromCart([FromBody] CreateSaleFromCartDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<SaleForResponseDto>.ErrorResponse("Datos de entrada inválidos."));

            try
            {
                var saleDto = new SaleForCreateDto
                {
                    UserId = dto.UserId,
                    Items = dto.Cart.Select(item => new SaleItemForCreateDto
                    {
                        ProductId = item.Product.Id,
                        Quantity = item.Quantity,
                        Price = item.PromotionApplied && item.Product.Promotion != null 
                            ? CalculatePromotionPrice(item) 
                            : item.Product.UnitPrice * item.Quantity
                    }).ToList()
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

        private decimal CalculatePromotionPrice(SaleCartDto item)
        {
            if (item.Product.Promotion?.PromotionQuantity > 0 && item.Product.Promotion?.PromotionPrice > 0)
            {
                var promoQuantity = item.Product.Promotion.PromotionQuantity.Value;
                var promoPrice = item.Product.Promotion.PromotionPrice.Value;
                
                var promoSets = item.Quantity / promoQuantity;
                var remainingQty = item.Quantity % promoQuantity;
                
                return (promoSets * promoPrice) + (remainingQty * item.Product.UnitPrice);
            }
            
            return item.Quantity * item.Product.UnitPrice;
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
        public List<SaleCartDto> Cart { get; set; } = new List<SaleCartDto>();
        public SaleDetailsDto Details { get; set; } = null!;
    }
}
