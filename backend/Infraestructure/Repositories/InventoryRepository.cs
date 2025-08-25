using Domain.Entities;
using Domain.Repositories;
using Infraestructure.Tenancy;
using Microsoft.EntityFrameworkCore;

namespace Infraestructure.Repositories
{
    public class InventoryRepository : BaseRepository<InventoryItem>, IInventoryRepository
    {
        public InventoryRepository(GroceryManagmentContext ctx, ITenantProvider tenant)
            : base(ctx, tenant) { }

        public async Task<IReadOnlyList<InventoryItem>> GetByProductId(int productId)
            => await _ctx.InventoryItems.AsNoTracking().Where(i => i.ProductId == productId).ToListAsync();

        public async Task<IReadOnlyList<InventoryItem>> GetByGroceryId(int groceryId)
            => await _ctx.InventoryItems.AsNoTracking().Where(i => i.GroceryId == groceryId).ToListAsync();

        public Task<InventoryItem?> GetByProductIdAndGroceryId(int productId, int groceryId)
            => _ctx.InventoryItems.AsNoTracking().FirstOrDefaultAsync(i => i.ProductId == productId && i.GroceryId == groceryId)!;
    }
}