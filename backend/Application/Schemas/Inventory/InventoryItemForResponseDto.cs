using Application.Schemas.Products;

namespace Application.Schemas.Inventory
{
    public class InventoryItemForResponseDto
    {
        public int Id { get; set; }
        public ProductForResponseDto Product { get; set; } = null!;
        public int Stock { get; set; }
        public decimal SalePrice { get; set; }
        public string Unit { get; set; } = "u";
        public DateTime LastUpdated { get; set; }
    }
}
