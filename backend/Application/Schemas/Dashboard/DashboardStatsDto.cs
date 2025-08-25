namespace Application.Schemas.Dashboard
{
    public class DashboardStatsDto
    {
        public int TodaySales { get; set; }
        public decimal MonthlyRevenue { get; set; }
        public int LowStockCount { get; set; }
        public decimal AverageTicket { get; set; }
        public string TodaySalesComparison { get; set; } = string.Empty;
        public string MonthlyRevenueComparison { get; set; } = string.Empty;
        public string AverageTicketComparison { get; set; } = string.Empty;
    }
}
