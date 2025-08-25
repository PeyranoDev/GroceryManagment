using Domain.Entities;
using Domain.Repositories;
using Infraestructure.Tenancy;
using Microsoft.EntityFrameworkCore;

namespace Infraestructure.Repositories
{
    public class SaleRepository : BaseRepository<Sale>, ISaleRepository
    {
        public SaleRepository(GroceryManagmentContext ctx, ITenantProvider tenant)
            : base(ctx, tenant) { }

        public async Task<IReadOnlyList<Sale>> GetByDateRange(DateTime startDate, DateTime endDate)
            => await _ctx.Sales.AsNoTracking()
                .Where(s => s.Date >= startDate && s.Date <= endDate)
                .ToListAsync();

        public async Task<IReadOnlyList<Sale>> GetByUserId(int userId)
            => await _ctx.Sales.AsNoTracking().Where(s => s.UserId == userId).ToListAsync();

        public async Task<IReadOnlyList<Sale>> GetByGroceryId(int groceryId)
            => await _ctx.Sales.AsNoTracking().Where(s => s.GroceryId == groceryId).ToListAsync();

        public async Task<decimal> GetTotalSalesByDateRange(DateTime startDate, DateTime endDate)
            => await _ctx.Sales.AsNoTracking()
                .Where(s => s.Date >= startDate && s.Date <= endDate)
                .SumAsync(s => s.Total);
    }
}