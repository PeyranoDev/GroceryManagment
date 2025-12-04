namespace Domain.Entities
{
    public class Product : IEntity
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public int? GroceryId { get; set; }
        public Grocery? Grocery { get; set; }
        public int CategoryId { get; set; }
        public Category Category { get; set; } = null!;
        public string? Emoji { get; set; }

        public ICollection<InventoryItem> InventoryItems { get; set; } = new List<InventoryItem>();
    }
}
