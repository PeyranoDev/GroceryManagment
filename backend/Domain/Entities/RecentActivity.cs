namespace Domain.Entities
{
    public class RecentActivity : IEntity, IHasGrocery
    {
        public int Id { get; set; }
        public string Action { get; set; } = null!;
        public DateTime Date { get; set; }

        public int GroceryId { get; set; }
        public Grocery Grocery { get; set; } = null!;
    }
}
