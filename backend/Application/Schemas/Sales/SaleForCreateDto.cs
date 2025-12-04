using System.ComponentModel.DataAnnotations;
using Domain.Common.Enums;

namespace Application.Schemas.Sales
{
    public class SaleForCreateDto
    {
        [Required]
        public int UserId { get; set; }

        [Required]
        public List<SaleItemForCreateDto> Items { get; set; } = new List<SaleItemForCreateDto>();

        public string PaymentMethod { get; set; } = "Efectivo";
        public string OrderStatus { get; set; } = "Created";
        public string PaymentStatus { get; set; } = "Pending";
        public string? CustomerName { get; set; }
        public string? CustomerPhone { get; set; }
        public string? DeliveryAddress { get; set; }
        public bool IsOnline { get; set; }
        public decimal DeliveryCost { get; set; }
        
        /// <summary>
        /// Moneda en la que se realiza la venta (ARS=1, USD=2). Por defecto ARS.
        /// </summary>
        public Moneda Moneda { get; set; } = Moneda.ARS;
    }

    public class SaleItemForCreateDto
    {
        [Required]
        public int ProductId { get; set; }

        [Required, Range(1, int.MaxValue, ErrorMessage = "La cantidad debe ser mayor a 0")]
        public int Quantity { get; set; }

        /// <summary>
        /// Precio unitario en ARS
        /// </summary>
        [Required, Range(0.01, double.MaxValue, ErrorMessage = "El precio debe ser mayor a 0")]
        public decimal Price { get; set; }
        
        /// <summary>
        /// Precio unitario en USD (calculado con cotización del momento)
        /// </summary>
        [Required, Range(0.01, double.MaxValue, ErrorMessage = "El precio USD debe ser mayor a 0")]
        public decimal PriceUSD { get; set; }
    }
}
