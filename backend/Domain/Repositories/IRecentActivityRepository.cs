using Domain.Entities;

namespace Domain.Repositories
{
    public interface IRecentActivityRepository : IBaseRepository<RecentActivity>
    {
        Task<IReadOnlyList<RecentActivity>> GetRecent(int count = 10);
        Task<IReadOnlyList<RecentActivity>> GetByGroceryId(int groceryId);
    }
}