namespace Application.Schemas.RecentActivities
{
    public class RecentActivityForResponseDto
    {
        public int Id { get; set; }
        public string Action { get; set; } = null!;
        public DateTime Date { get; set; }
        public int GroceryId { get; set; }
    }
}