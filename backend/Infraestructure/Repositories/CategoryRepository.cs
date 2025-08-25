using Domain.Entities;
using Domain.Repositories;
using Infraestructure.Tenancy;
using Microsoft.EntityFrameworkCore;

namespace Infraestructure.Repositories
{
    public class CategoryRepository : BaseRepository<Category>, ICategoryRepository
    {
        public CategoryRepository(GroceryManagmentContext ctx, ITenantProvider tenant)
            : base(ctx, tenant) { }

        public Task<bool> ExistsByName(string name)
            => _ctx.Categories.AsNoTracking().AnyAsync(c => c.Name == name);

        public async Task<IReadOnlyList<Category>> GetByGroceryId(int groceryId)
            => await _ctx.Categories.AsNoTracking().Where(c => c.GroceryId == groceryId).ToListAsync();
    }
}