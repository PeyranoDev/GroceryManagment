namespace Domain.Entities
{
    public class Product : IEntity, IHasGrocery
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public decimal Price { get; set; }

        public int GroceryId { get; set; }
        public Grocery Grocery { get; set; } = null!;

        public Promotion Promotion { get; set; } = new Promotion();
    }
}
