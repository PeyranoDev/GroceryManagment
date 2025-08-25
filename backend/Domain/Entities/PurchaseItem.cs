namespace Domain.Entities
{
    public class PurchaseItem : IEntity, IHasGrocery
    {
        public int Id { get; set; }
        public int Quantity { get; set; }
        public decimal UnitCost { get; set; }
        public decimal TotalCost { get; set; }

        public int ProductId { get; set; }
        public Product Product { get; set; } = null!;

        public int PurchaseId { get; set; }
        public Purchase Purchase { get; set; } = null!;

        public int GroceryId { get; set; }
        public Grocery Grocery { get; set; } = null!;
    }
}
