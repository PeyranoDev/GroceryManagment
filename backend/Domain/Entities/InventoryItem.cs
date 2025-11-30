namespace Domain.Entities
{
    public class InventoryItem : IEntity, IHasGrocery
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public Product Product { get; set; } = null!;

        public int Stock { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal SalePrice { get; set; }
        public Promotion Promotion { get; set; } = new Promotion();
        public DateTime LastUpdated { get; set; }

        public int GroceryId { get; set; }
        public Grocery Grocery { get; set; } = null!;
    }
}
