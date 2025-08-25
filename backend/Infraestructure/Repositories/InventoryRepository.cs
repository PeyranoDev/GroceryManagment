using Domain.Entities;
using Domain.Repositories;
using Domain.Tenancy;
using Microsoft.EntityFrameworkCore;

namespace Infraestructure.Repositories
{
    public class InventoryRepository : BaseRepository<InventoryItem>, IInventoryRepository
    {
        public InventoryRepository(GroceryManagmentContext ctx, ITenantProvider tenant)
            : base(ctx, tenant) { }

        public async Task<IReadOnlyList<InventoryItem>> GetByProductId(int productId)
            => await _ctx.InventoryItems.AsNoTracking()
                .Include(i => i.Product)
                    .ThenInclude(p => p.Category)
                .Where(i => i.ProductId == productId && i.GroceryId == _tenant.CurrentGroceryId)
                .ToListAsync();

        public async Task<IReadOnlyList<InventoryItem>> GetByGroceryId(int groceryId)
            => await _ctx.InventoryItems.AsNoTracking()
                .Include(i => i.Product)
                    .ThenInclude(p => p.Category)
                .Where(i => i.GroceryId == groceryId)
                .ToListAsync();

        public Task<InventoryItem?> GetByProductIdAndGroceryId(int productId, int groceryId)
            => _ctx.InventoryItems.AsNoTracking()
                .Include(i => i.Product)
                    .ThenInclude(p => p.Category)
                .FirstOrDefaultAsync(i => i.ProductId == productId && i.GroceryId == groceryId)!;

        public async Task<IReadOnlyList<InventoryItem>> GetLowStock(int threshold, int groceryId)
            => await _ctx.InventoryItems.AsNoTracking()
                .Include(i => i.Product)
                    .ThenInclude(p => p.Category)
                .Where(i => i.GroceryId == groceryId && i.Stock > 0 && i.Stock <= threshold)
                .ToListAsync();

        public async Task<IReadOnlyList<InventoryItem>> GetOutOfStock(int groceryId)
            => await _ctx.InventoryItems.AsNoTracking()
                .Include(i => i.Product)
                    .ThenInclude(p => p.Category)
                .Where(i => i.GroceryId == groceryId && i.Stock == 0)
                .ToListAsync();

        public override async Task<IReadOnlyList<InventoryItem>> GetAllByGroceryId(int groceryId)
            => await _ctx.InventoryItems.AsNoTracking()
                .Include(i => i.Product)
                    .ThenInclude(p => p.Category)
                .Where(i => i.GroceryId == groceryId)
                .OrderBy(i => i.Product.Name)
                .ToListAsync();
    }
}