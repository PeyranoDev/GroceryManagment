namespace Domain.Entities
{
    public class SaleItem : IEntity, IHasGrocery
    {
        public int Id { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }

        public int ProductId { get; set; }
        public Product Product { get; set; } = null!;

        public int SaleId { get; set; }
        public Sale Sale { get; set; } = null!;

        public int GroceryId { get; set; }
        public Grocery Grocery { get; set; } = null!;
    }
}
