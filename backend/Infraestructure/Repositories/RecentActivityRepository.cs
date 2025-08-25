using Domain.Entities;
using Domain.Repositories;
using Infraestructure.Tenancy;
using Microsoft.EntityFrameworkCore;

namespace Infraestructure.Repositories
{
    public class RecentActivityRepository : BaseRepository<RecentActivity>, IRecentActivityRepository
    {
        public RecentActivityRepository(GroceryManagmentContext ctx, ITenantProvider tenant)
            : base(ctx, tenant) { }

        public async Task<IReadOnlyList<RecentActivity>> GetRecent(int count = 10)
            => await _ctx.RecentActivities.AsNoTracking()
                .OrderByDescending(a => a.Date)
                .Take(count)
                .ToListAsync();

        public async Task<IReadOnlyList<RecentActivity>> GetByGroceryId(int groceryId)
            => await _ctx.RecentActivities.AsNoTracking()
                .Where(a => a.GroceryId == groceryId)
                .OrderByDescending(a => a.Date)
                .ToListAsync();
    }
}