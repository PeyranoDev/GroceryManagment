namespace Domain.Entities
{
    public class Purchase : IEntity, IHasGrocery
    {
        public int Id { get; set; }
        public string Supplier { get; set; } = null!;
        public DateTime Date { get; set; }
        public decimal Total { get; set; }
        public string? Notes { get; set; }

        public int GroceryId { get; set; }
        public Grocery Grocery { get; set; } = null!;

        public int? UserId { get; set; }
        public User? User { get; set; }

        public ICollection<PurchaseItem> Items { get; set; } = new List<PurchaseItem>();
    }
}
