namespace Application.Schemas.Dashboard
{
    public class DashboardDataDto
    {
        public DashboardStatsDto Stats { get; set; } = new();
        public IEnumerable<WeeklySalesDto> WeeklySales { get; set; } = [];
        public IEnumerable<object> RecentActivities { get; set; } = [];
    }
}
