namespace Domain.Entities
{
    public class Category : IEntity
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string? Icon { get; set; }

        public ICollection<Product> Products { get; set; } = new List<Product>();
    }
}