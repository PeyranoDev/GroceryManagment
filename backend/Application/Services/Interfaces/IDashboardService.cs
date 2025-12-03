using Application.Schemas.Dashboard;

namespace Application.Services.Interfaces
{
    public interface IDashboardService
    {
        Task<DashboardStatsDto> GetDashboardStatsAsync();
        Task<IEnumerable<WeeklySalesDto>> GetWeeklySalesAsync();
        Task<DashboardDataDto> GetDashboardDataAsync(int recentActivitiesCount = 4, int recentActivitiesDays = 30);
    }
}
