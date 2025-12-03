using Domain.Entities;
using Domain.Repositories;
using Domain.Tenancy;
using Microsoft.EntityFrameworkCore;

namespace Infraestructure.Repositories
{
    public class PurchaseRepository : BaseRepository<Purchase>, IPurchaseRepository
    {
        public PurchaseRepository(GroceryManagmentContext context, ITenantProvider tenantProvider) 
            : base(context, tenantProvider)
        {
        }

        public async Task<IReadOnlyList<Purchase>> GetBySupplier(string supplier, int groceryId)
        {
            return await _ctx.Purchases.AsNoTracking()
                .Include(p => p.Items)
                    .ThenInclude(pi => pi.Product)
                .Include(p => p.User)
                .Where(p => p.GroceryId == groceryId && p.Supplier.Contains(supplier))
                .OrderByDescending(p => p.Date)
                .ToListAsync();
        }

        public async Task<IReadOnlyList<Purchase>> GetByDateRangeAndGrocery(DateTime startDate, DateTime endDate, int groceryId)
        {
            return await _ctx.Purchases.AsNoTracking()
                .Include(p => p.Items)
                    .ThenInclude(pi => pi.Product)
                .Include(p => p.User)
                .Where(p => p.GroceryId == groceryId && p.Date >= startDate && p.Date <= endDate)
                .OrderByDescending(p => p.Date)
                .ToListAsync();
        }

        public async Task<decimal> GetTotalPurchasesByDateRange(DateTime startDate, DateTime endDate, int groceryId)
        {
            return await _ctx.Purchases.AsNoTracking()
                .Where(p => p.GroceryId == groceryId && p.Date >= startDate && p.Date <= endDate)
                .SumAsync(p => p.Total);
        }

        public override async Task<IReadOnlyList<Purchase>> GetAllByGroceryId(int groceryId)
        {
            return await _ctx.Purchases.AsNoTracking()
                .Include(p => p.Items)
                    .ThenInclude(pi => pi.Product)
                .Include(p => p.User)
                .Where(p => p.GroceryId == groceryId)
                .OrderByDescending(p => p.Date)
                .ToListAsync();
        }

        public override async Task<Purchase?> GetById(int id)
        {
            return await _ctx.Purchases.AsNoTracking()
                .Include(p => p.Items)
                    .ThenInclude(pi => pi.Product)
                .Include(p => p.User)
                .FirstOrDefaultAsync(p => p.Id == id);
        }
    }
}
