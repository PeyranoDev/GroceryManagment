namespace Domain.Entities
{
    public class InventoryItem : IEntity, IHasGrocery
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public Product Product { get; set; } = null!;

        public int Stock { get; set; }
        public DateTime LastUpdated { get; set; }

        public int GroceryId { get; set; }
        public Grocery Grocery { get; set; } = null!;

        public Promotion Promotion { get; set; } = new Promotion();
    }
}
