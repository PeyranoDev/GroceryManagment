using Application.Schemas.Dashboard;
using Application.Services.Interfaces;
using AutoMapper;
using Domain.Tenancy;

namespace Application.Services.Implementations
{
    public class DashboardService : IDashboardService
    {
        private readonly IDashboardQueryService _dashboardQueryService;
        private readonly IDerivedRecentActivityService _recentActivityService;
        private readonly ITenantProvider _tenantProvider;
        private readonly IMapper _mapper;

        public DashboardService(
            IDashboardQueryService dashboardQueryService,
            IDerivedRecentActivityService recentActivityService,
            ITenantProvider tenantProvider,
            IMapper mapper)
        {
            _dashboardQueryService = dashboardQueryService;
            _recentActivityService = recentActivityService;
            _tenantProvider = tenantProvider;
            _mapper = mapper;
        }

        public async Task<DashboardDataDto> GetDashboardDataAsync(int recentActivitiesCount = 4, int recentActivitiesDays = 30)
        {
            var groceryId = _tenantProvider.CurrentGroceryId;
            var today = DateTime.Today;
            var yesterday = today.AddDays(-1);
            var monthStart = new DateTime(today.Year, today.Month, 1);
            var lastMonthStart = monthStart.AddMonths(-1);
            var lastMonthEnd = monthStart.AddDays(-1);
            var weekStart = today.AddDays(-6);
            var weekEnd = today.AddDays(1);

            var dashboardDataTask = _dashboardQueryService.GetDashboardDataParallelAsync(
                groceryId, today, yesterday, monthStart, lastMonthStart, lastMonthEnd, weekStart, weekEnd, 10);
            var recentActivitiesTask = _recentActivityService.GetRecentActivitiesAsync(recentActivitiesCount, recentActivitiesDays);

            await Task.WhenAll(dashboardDataTask, recentActivitiesTask);

            var data = await dashboardDataTask;
            var recentActivities = await recentActivitiesTask;

            var todaySalesCount = data.TodaySales.Count;
            var yesterdaySalesCount = data.YesterdaySales.Count;
            var monthlyRevenue = data.MonthSales.Sum(s => s.Total);
            var lastMonthRevenue = data.LastMonthSales.Sum(s => s.Total);
            var averageTicket = todaySalesCount > 0 ? data.TodaySales.Average(s => s.Total) : 0;
            var yesterdayAverageTicket = yesterdaySalesCount > 0 ? data.YesterdaySales.Average(s => s.Total) : 0;

            var weeklySales = new List<WeeklySalesDto>();
            for (int i = 0; i < 7; i++)
            {
                var currentDay = weekStart.AddDays(i);
                var nextDay = currentDay.AddDays(1);
                var dayTotal = data.WeekSales.Where(s => s.Date >= currentDay && s.Date < nextDay).Sum(s => s.Total);
                weeklySales.Add(new WeeklySalesDto
                {
                    Day = GetDayName(currentDay.DayOfWeek),
                    Sales = dayTotal
                });
            }

            return new DashboardDataDto
            {
                Stats = new DashboardStatsDto
                {
                    TodaySales = todaySalesCount,
                    MonthlyRevenue = monthlyRevenue,
                    LowStockCount = data.LowStockItems.Count,
                    AverageTicket = averageTicket,
                    TodaySalesComparison = CalculatePercentageChange(todaySalesCount, yesterdaySalesCount),
                    MonthlyRevenueComparison = CalculatePercentageChange(monthlyRevenue, lastMonthRevenue),
                    AverageTicketComparison = CalculatePercentageChange(averageTicket, yesterdayAverageTicket)
                },
                WeeklySales = weeklySales,
                RecentActivities = recentActivities.Cast<object>()
            };
        }

        public async Task<DashboardStatsDto> GetDashboardStatsAsync()
        {
            var data = await GetDashboardDataAsync(0, 0);
            return data.Stats;
        }

        public async Task<IEnumerable<WeeklySalesDto>> GetWeeklySalesAsync()
        {
            var data = await GetDashboardDataAsync(0, 0);
            return data.WeeklySales;
        }

        private string CalculatePercentageChange(decimal current, decimal previous)
        {
            if (previous == 0)
                return current > 0 ? "+100%" : "0%";
            
            var percentage = ((current - previous) / previous) * 100;
            var sign = percentage >= 0 ? "+" : "";
            return $"{sign}{percentage:F0}%";
        }

        private string GetDayName(DayOfWeek dayOfWeek)
        {
            return dayOfWeek switch
            {
                DayOfWeek.Monday => "Lun",
                DayOfWeek.Tuesday => "Mar",
                DayOfWeek.Wednesday => "Mié",
                DayOfWeek.Thursday => "Jue",
                DayOfWeek.Friday => "Vie",
                DayOfWeek.Saturday => "Sáb",
                DayOfWeek.Sunday => "Dom",
                _ => "---"
            };
        }
    }
}
