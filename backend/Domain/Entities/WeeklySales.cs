namespace Domain.Entities
{
    public class WeeklySale : IEntity, IHasGrocery
    {
        public int Id { get; set; }
        public DateTime WeekStart { get; set; }
        public DateTime WeekEnd { get; set; }
        public decimal TotalSales { get; set; }

        public int GroceryId { get; set; }
        public Grocery Grocery { get; set; } = null!;
    }
}
