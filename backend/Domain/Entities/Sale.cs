namespace Domain.Entities
{
    public class Sale : IEntity, IHasGrocery
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public decimal Total { get; set; }

        public int GroceryId { get; set; }
        public Grocery Grocery { get; set; } = null!;

        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public ICollection<SaleItem> Items { get; set; } = new List<SaleItem>();
    }
}
