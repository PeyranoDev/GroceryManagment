using Domain.Entities;
using Domain.Repositories;
using Domain.Tenancy;
using Microsoft.EntityFrameworkCore;

namespace Infraestructure.Repositories
{
    public class SaleRepository : BaseRepository<Sale>, ISaleRepository
    {
        public SaleRepository(GroceryManagmentContext ctx, ITenantProvider tenant)
            : base(ctx, tenant) { }

        public override async Task<int> Create(Sale entity)
        {
            entity.GroceryId = _tenant.CurrentGroceryId;
            
            foreach (var item in entity.Items)
            {
                item.GroceryId = _tenant.CurrentGroceryId;
            }

            var entry = await _ctx.Set<Sale>().AddAsync(entity);
            
            return entry.Entity.Id;
        }

        public override async Task<Sale?> GetById(int id)
            => await _ctx.Sales.AsNoTracking()
                .Include(s => s.Items)
                    .ThenInclude(si => si.Product)
                .Include(s => s.User)
                .FirstOrDefaultAsync(s => s.Id == id);

        public async Task<IReadOnlyList<Sale>> GetByDateRange(DateTime startDate, DateTime endDate)
            => await _ctx.Sales.AsNoTracking()
                .Include(s => s.Items)
                    .ThenInclude(si => si.Product)
                .Include(s => s.User)
                .Where(s => s.Date >= startDate && s.Date <= endDate && s.GroceryId == _tenant.CurrentGroceryId)
                .ToListAsync();

        public async Task<IReadOnlyList<Sale>> GetByUserId(int userId)
            => await _ctx.Sales.AsNoTracking()
                .Include(s => s.Items)
                    .ThenInclude(si => si.Product)
                .Include(s => s.User)
                .Where(s => s.UserId == userId && s.GroceryId == _tenant.CurrentGroceryId)
                .ToListAsync();

        public async Task<IReadOnlyList<Sale>> GetByGroceryId(int groceryId)
            => await _ctx.Sales.AsNoTracking()
                .Include(s => s.Items)
                    .ThenInclude(si => si.Product)
                .Include(s => s.User)
                .Where(s => s.GroceryId == groceryId)
                .ToListAsync();

        public async Task<decimal> GetTotalSalesByDateRange(DateTime startDate, DateTime endDate)
            => await _ctx.Sales.AsNoTracking()
                .Where(s => s.Date >= startDate && s.Date <= endDate && s.GroceryId == _tenant.CurrentGroceryId)
                .SumAsync(s => s.Total);

        public async Task<IReadOnlyList<Sale>> GetSalesByDateRangeAndGrocery(DateTime startDate, DateTime endDate, int groceryId)
            => await _ctx.Sales.AsNoTracking()
                .Include(s => s.Items)
                    .ThenInclude(si => si.Product)
                .Include(s => s.User)
                .Where(s => s.Date >= startDate && s.Date <= endDate && s.GroceryId == groceryId)
                .OrderByDescending(s => s.Date)
                .ToListAsync();

        public override async Task<IReadOnlyList<Sale>> GetAllByGroceryId(int groceryId)
            => await _ctx.Sales.AsNoTracking()
                .Include(s => s.Items)
                    .ThenInclude(si => si.Product)
                .Include(s => s.User)
                .Where(s => s.GroceryId == groceryId)
                .OrderByDescending(s => s.Date)
                .ToListAsync();
    }
}