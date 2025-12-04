using Domain.Common.Enums;

namespace Domain.Entities
{
    public class Sale : IEntity, IHasGrocery
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public decimal Total { get; set; }

        public int GroceryId { get; set; }
        public Grocery Grocery { get; set; } = null!;

        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public string PaymentMethod { get; set; } = "Efectivo";
        public string OrderStatus { get; set; } = "Created";
        public string PaymentStatus { get; set; } = "Pending";
        public string? CustomerName { get; set; }
        public string? CustomerPhone { get; set; }
        public string? DeliveryAddress { get; set; }
        public bool IsOnline { get; set; }
        public decimal DeliveryCost { get; set; }

        /// <summary>
        /// Moneda en la que se realizó la venta (ARS = Pesos, USD = Dólares)
        /// </summary>
        public Moneda Moneda { get; set; } = Moneda.ARS;

        /// <summary>
        /// Cotización del dólar oficial utilizada en el momento de la venta
        /// </summary>
        public decimal? CotizacionDolar { get; set; }

        /// <summary>
        /// Total en dólares estadounidenses
        /// </summary>
        public decimal TotalUSD { get; set; }

        /// <summary>
        /// Total en pesos argentinos
        /// </summary>
        public decimal TotalARS { get; set; }

        public ICollection<SaleItem> Items { get; set; } = new List<SaleItem>();
    }
}
