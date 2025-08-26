namespace Domain.Entities
{
    public class Product : IEntity, IHasGrocery
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public decimal UnitPrice { get; set; }
        public decimal SalePrice { get; set; }
        public string Unit { get; set; } = null!; 
        public string? Emoji { get; set; }

        public int CategoryId { get; set; }
        public Category Category { get; set; } = null!;

        public int GroceryId { get; set; }
        public Grocery Grocery { get; set; } = null!;

        public Promotion Promotion { get; set; } = new Promotion();
        
        // Relación con inventario
        public ICollection<InventoryItem> InventoryItems { get; set; } = new List<InventoryItem>();
    }
}
