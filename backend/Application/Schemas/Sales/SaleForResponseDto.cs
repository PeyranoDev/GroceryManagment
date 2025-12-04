using Application.Schemas.Users;
using Application.Schemas.Products;
using Domain.Common.Enums;

namespace Application.Schemas.Sales
{
    public class SaleForResponseDto
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public decimal Total { get; set; }
        public int UserId { get; set; }
        public UserForResponseDto User { get; set; } = null!;
        public string PaymentMethod { get; set; } = "Efectivo";
        public string OrderStatus { get; set; } = "Created";
        public string PaymentStatus { get; set; } = "Pending";
        public string? CustomerName { get; set; }
        public string? CustomerPhone { get; set; }
        public string? DeliveryAddress { get; set; }
        public bool IsOnline { get; set; }
        public decimal DeliveryCost { get; set; }
        public List<SaleItemForResponseDto> Items { get; set; } = new List<SaleItemForResponseDto>();
        
        /// <summary>
        /// Moneda en la que se realizó la venta
        /// </summary>
        public Moneda Moneda { get; set; }
        
        /// <summary>
        /// Cotización del dólar oficial al momento de la venta
        /// </summary>
        public decimal? CotizacionDolar { get; set; }
        
        /// <summary>
        /// Total en pesos argentinos
        /// </summary>
        public decimal TotalARS { get; set; }
        
        /// <summary>
        /// Total en dólares estadounidenses
        /// </summary>
        public decimal TotalUSD { get; set; }
    }

    public class SaleItemForResponseDto
    {
        public int Id { get; set; }
        public int Quantity { get; set; }
        
        /// <summary>
        /// Precio unitario en ARS
        /// </summary>
        public decimal Price { get; set; }
        
        /// <summary>
        /// Precio unitario en USD
        /// </summary>
        public decimal PriceUSD { get; set; }
        
        public int ProductId { get; set; }
        public ProductForResponseDto Product { get; set; } = null!;
        public int SaleId { get; set; }
    }
}
