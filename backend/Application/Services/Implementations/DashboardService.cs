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
        private readonly ITenantProvider _tenantProvider;
        private readonly IMapper _mapper;

        public DashboardService(
            ISaleRepository saleRepository,
            IInventoryRepository inventoryRepository,
            ITenantProvider tenantProvider,
            IMapper mapper)
        {
            _saleRepository = saleRepository;
            _inventoryRepository = inventoryRepository;
            _tenantProvider = tenantProvider;
            _mapper = mapper;
        }

        public async Task<DashboardStatsDto> GetDashboardStatsAsync()
        {
            var groceryId = _tenantProvider.CurrentGroceryId;
            var today = DateTime.Today;
            var yesterday = today.AddDays(-1);
            var monthStart = new DateTime(today.Year, today.Month, 1);
            var lastMonthStart = monthStart.AddMonths(-1);
            var lastMonthEnd = monthStart.AddDays(-1);

            var todaySales = await _saleRepository.GetSalesByDateRangeAndGrocery(today, today.AddDays(1), groceryId);
            var todaySalesCount = todaySales.Count;

            var yesterdaySales = await _saleRepository.GetSalesByDateRangeAndGrocery(yesterday, today, groceryId);
            var yesterdaySalesCount = yesterdaySales.Count;

            var monthSales = await _saleRepository.GetSalesByDateRangeAndGrocery(monthStart, DateTime.Now, groceryId);
            var monthlyRevenue = monthSales.Sum(s => s.Total);

            var lastMonthSales = await _saleRepository.GetSalesByDateRangeAndGrocery(lastMonthStart, lastMonthEnd.AddDays(1), groceryId);
            var lastMonthRevenue = lastMonthSales.Sum(s => s.Total);

            var lowStockItems = await _inventoryRepository.GetLowStock(10, groceryId);
            var lowStockCount = lowStockItems.Count;

            var averageTicket = todaySalesCount > 0 ? todaySales.Average(s => s.Total) : 0;
            var yesterdayAverageTicket = yesterdaySalesCount > 0 ? yesterdaySales.Average(s => s.Total) : 0;

            return new DashboardStatsDto
            {
                TodaySales = todaySalesCount,
                MonthlyRevenue = monthlyRevenue,
                LowStockCount = lowStockCount,
                AverageTicket = averageTicket,
                TodaySalesComparison = CalculatePercentageChange(todaySalesCount, yesterdaySalesCount),
                MonthlyRevenueComparison = CalculatePercentageChange(monthlyRevenue, lastMonthRevenue),
                AverageTicketComparison = CalculatePercentageChange(averageTicket, yesterdayAverageTicket)
            };
        }

        public async Task<IEnumerable<WeeklySalesDto>> GetWeeklySalesAsync()
        {
            var groceryId = _tenantProvider.CurrentGroceryId;
            var today = DateTime.Today;
            var weekStart = today.AddDays(-(int)today.DayOfWeek + 1); // Lunes de esta semana
            
            var weeklySales = new List<WeeklySalesDto>();
            
            for (int i = 0; i < 7; i++)
            {
                var day = weekStart.AddDays(i);
                var dayEnd = day.AddDays(1);
                
                var sales = await _saleRepository.GetSalesByDateRangeAndGrocery(day, dayEnd, groceryId);
                var dayTotal = sales.Sum(s => s.Total);
                
                weeklySales.Add(new WeeklySalesDto
                {
                    Day = GetDayName(day.DayOfWeek),
                    Sales = dayTotal
                });
            }
            
            return weeklySales;
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
