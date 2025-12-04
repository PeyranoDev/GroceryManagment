using Application.Schemas.Users;
using Application.Schemas.Products;

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
    }

    public class SaleItemForResponseDto
    {
        public int Id { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public int ProductId { get; set; }
        public ProductForResponseDto Product { get; set; } = null!;
        public int SaleId { get; set; }
    }
}
