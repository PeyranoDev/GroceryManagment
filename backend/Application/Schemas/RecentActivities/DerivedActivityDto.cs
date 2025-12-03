namespace Application.Schemas.RecentActivities
{
    public class DerivedActivityDto
    {
        public string Id { get; set; } = null!;
        public string Type { get; set; } = null!;
        public string Action { get; set; } = null!;
        public DateTime Date { get; set; }
        public string? UserName { get; set; }
        public decimal? Amount { get; set; }
        public int? ItemCount { get; set; }
        public int EntityId { get; set; }
    }
}
