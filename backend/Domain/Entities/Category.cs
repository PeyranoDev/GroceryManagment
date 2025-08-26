namespace Domain.Entities
{
    public class Category : IEntity, IHasGrocery
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string? Icon { get; set; }

        public int GroceryId { get; set; }
        public Grocery Grocery { get; set; } = null!;

        public ICollection<Product> Products { get; set; } = new List<Product>();
    }
}