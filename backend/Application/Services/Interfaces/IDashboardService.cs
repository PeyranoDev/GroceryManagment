using Application.Schemas.Dashboard;

namespace Application.Services.Interfaces
{
    public interface IDashboardService
    {
        Task<DashboardStatsDto> GetDashboardStatsAsync();
        Task<IEnumerable<WeeklySalesDto>> GetWeeklySalesAsync();
    }
}
