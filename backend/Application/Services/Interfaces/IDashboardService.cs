using Application.Schemas.Dashboard;

namespace Application.Services.Interfaces
{
    public interface IDashboardService
    {
        Task<DashboardStatsDto> GetDashboardStatsAsync();
        Task<IEnumerable<PerDaySaleDto>> GetLast7DaysSalesAsync();
    }
}
