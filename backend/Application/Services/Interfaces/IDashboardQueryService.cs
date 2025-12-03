using Domain.Entities;

namespace Application.Services.Interfaces
{
    public interface IDashboardQueryService
    {
        Task<DashboardQueryResult> GetDashboardDataParallelAsync(
            int groceryId,
            DateTime today,
            DateTime yesterday,
            DateTime monthStart,
            DateTime lastMonthStart,
            DateTime lastMonthEnd,
            DateTime weekStart,
            DateTime weekEnd,
            int lowStockThreshold);

        Task<RecentActivityQueryResult> GetRecentActivityDataParallelAsync(
            int groceryId,
            DateTime since,
            DateTime until);
    }

    public class DashboardQueryResult
    {
        public IReadOnlyList<Sale> TodaySales { get; set; } = [];
        public IReadOnlyList<Sale> YesterdaySales { get; set; } = [];
        public IReadOnlyList<Sale> MonthSales { get; set; } = [];
        public IReadOnlyList<Sale> LastMonthSales { get; set; } = [];
        public IReadOnlyList<Sale> WeekSales { get; set; } = [];
        public IReadOnlyList<InventoryItem> LowStockItems { get; set; } = [];
    }

    public class RecentActivityQueryResult
    {
        public IReadOnlyList<Sale> Sales { get; set; } = [];
        public IReadOnlyList<Purchase> Purchases { get; set; } = [];
        public IReadOnlyList<InventoryItem> InventoryItems { get; set; } = [];
    }
}
