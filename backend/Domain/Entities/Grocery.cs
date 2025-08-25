namespace Domain.Entities
{
    public class Grocery : IEntity
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;

        public ICollection<UserGrocery> UserGroceries { get; set; } = new List<UserGrocery>();
        public ICollection<Product> Products { get; set; } = new List<Product>();
        public ICollection<InventoryItem> Inventory { get; set; } = new List<InventoryItem>();
    }
}
