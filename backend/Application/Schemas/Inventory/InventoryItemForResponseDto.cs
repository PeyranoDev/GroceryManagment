using Application.Schemas.Products;

namespace Application.Schemas.Inventory
{
    public class InventoryItemForResponseDto
    {
        public int Id { get; set; }
        public ProductForResponseDto Product { get; set; } = null!;
        public int Stock { get; set; }
        public DateTime LastUpdated { get; set; }
    }
}