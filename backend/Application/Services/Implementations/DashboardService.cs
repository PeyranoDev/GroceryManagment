using Application.Schemas.Dashboard;
using Application.Services.Interfaces;
using AutoMapper;
using Domain.Repositories;
using Domain.Tenancy;

namespace Application.Services.Implementations
{
    public class DashboardService : IDashboardService
    {
        private readonly ISaleRepository _saleRepository;
        private readonly IInventoryRepository _inventoryRepository;
        private readonly IDerivedRecentActivityService _recentActivityService;
        private readonly ITenantProvider _tenantProvider;
        private readonly IMapper _mapper;

        public DashboardService(
            ISaleRepository saleRepository,
            IInventoryRepository inventoryRepository,
            IDerivedRecentActivityService recentActivityService,
            ITenantProvider tenantProvider,
            IMapper mapper)
        {
            _saleRepository = saleRepository;
            _inventoryRepository = inventoryRepository;
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

            // Parallel queries for maximum performance
            var todaySalesTask = _saleRepository.GetSalesByDateRangeAndGrocery(today, today.AddDays(1), groceryId);
            var yesterdaySalesTask = _saleRepository.GetSalesByDateRangeAndGrocery(yesterday, today, groceryId);
            var monthSalesTask = _saleRepository.GetSalesByDateRangeAndGrocery(monthStart, DateTime.Now, groceryId);
            var lastMonthSalesTask = _saleRepository.GetSalesByDateRangeAndGrocery(lastMonthStart, lastMonthEnd.AddDays(1), groceryId);
            var lowStockTask = _inventoryRepository.GetLowStock(10, groceryId);
            var weekSalesTask = _saleRepository.GetSalesByDateRangeAndGrocery(weekStart, weekEnd, groceryId);
            var recentActivitiesTask = _recentActivityService.GetRecentActivitiesAsync(recentActivitiesCount, recentActivitiesDays);

            await Task.WhenAll(todaySalesTask, yesterdaySalesTask, monthSalesTask, lastMonthSalesTask, lowStockTask, weekSalesTask, recentActivitiesTask);

            var todaySales = await todaySalesTask;
            var yesterdaySales = await yesterdaySalesTask;
            var monthSales = await monthSalesTask;
            var lastMonthSales = await lastMonthSalesTask;
            var lowStockItems = await lowStockTask;
            var weekSales = await weekSalesTask;
            var recentActivities = await recentActivitiesTask;

            var todaySalesCount = todaySales.Count;
            var yesterdaySalesCount = yesterdaySales.Count;
            var monthlyRevenue = monthSales.Sum(s => s.Total);
            var lastMonthRevenue = lastMonthSales.Sum(s => s.Total);
            var averageTicket = todaySalesCount > 0 ? todaySales.Average(s => s.Total) : 0;
            var yesterdayAverageTicket = yesterdaySalesCount > 0 ? yesterdaySales.Average(s => s.Total) : 0;

            // Build weekly sales
            var weeklySales = new List<WeeklySalesDto>();
            for (int i = 0; i < 7; i++)
            {
                var currentDay = weekStart.AddDays(i);
                var nextDay = currentDay.AddDays(1);
                var dayTotal = weekSales.Where(s => s.Date >= currentDay && s.Date < nextDay).Sum(s => s.Total);
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
                    LowStockCount = lowStockItems.Count,
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
