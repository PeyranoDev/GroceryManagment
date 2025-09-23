using Application.Schemas.Products;

namespace Application.Schemas.Purchases
{
    public class PurchaseForResponseDto
    {
        public int Id { get; set; }
        public string Supplier { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public decimal Total { get; set; }
        public string? Notes { get; set; }
        public List<PurchaseItemForResponseDto> Items { get; set; } = new List<PurchaseItemForResponseDto>();
    }
    
    public class PurchaseItemForResponseDto
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public ProductForResponseDto Product { get; set; } = null!;
        public int Quantity { get; set; }
        public decimal UnitCost { get; set; }
        public decimal TotalCost { get; set; }
    }
}
