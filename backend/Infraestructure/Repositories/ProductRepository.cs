using Domain.Entities;
using Domain.Repositories;
using Infraestructure.Tenancy;
using Microsoft.EntityFrameworkCore;

namespace Infraestructure.Repositories
{
    public class ProductRepository : BaseRepository<Product>, IProductRepository
    {
        public ProductRepository(GroceryManagmentContext ctx, ITenantProvider tenant)
            : base(ctx, tenant) { }

        public Task<bool> ExistsByName(string name)
            => _ctx.Products.AsNoTracking().AnyAsync(p => p.Name == name);

        public async Task<IReadOnlyList<Product>> GetByCategoryId(int categoryId)
            => await _ctx.Products.AsNoTracking().Where(p => p.CategoryId == categoryId).ToListAsync();

        public async Task<IReadOnlyList<Product>> GetByGroceryId(int groceryId)
            => await _ctx.Products.AsNoTracking().Where(p => p.GroceryId == groceryId).ToListAsync();
    }
}