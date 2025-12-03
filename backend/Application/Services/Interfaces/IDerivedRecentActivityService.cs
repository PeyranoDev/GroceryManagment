using Application.Schemas.RecentActivities;

namespace Application.Services.Interfaces
{
    public interface IDerivedRecentActivityService
    {
        Task<IReadOnlyList<DerivedActivityDto>> GetRecentActivitiesAsync(int count = 10, int days = 30);
    }
}
