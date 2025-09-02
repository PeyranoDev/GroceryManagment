using Domain.Entities;
using Domain.Repositories;
using Domain.Tenancy;
using Microsoft.EntityFrameworkCore;

namespace Infraestructure.Repositories
{
    public class GroceryRepository : BaseRepository<Grocery>, IGroceryRepository
    {
        public GroceryRepository(GroceryManagmentContext ctx, ITenantProvider tenant)
            : base(ctx, tenant) { }

        public Task<bool> ExistsByName(string name)
            => _ctx.Groceries.AsNoTracking().AnyAsync(g => g.Name == name);

        public Task<Grocery?> GetByName(string name)
            => _ctx.Groceries.AsNoTracking().FirstOrDefaultAsync(g => g.Name == name);

        public override async Task<int> Create(Grocery entity)
        {
            var entry = await _ctx.Set<Grocery>().AddAsync(entity);
            await _ctx.SaveChangesAsync();
            
            return entry.Entity.Id;
        }
    }
}
