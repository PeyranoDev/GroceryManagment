// Infraestructure/Repositories/BaseRepository.cs
using Domain.Entities;
using Domain.Repositories;
using Infraestructure.Tenancy;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Infraestructure.Repositories
{
    public class BaseRepository<T> : IBaseRepository<T> where T : class, IEntity
    {
        protected readonly GroceryManagmentContext _ctx;
        protected readonly ITenantProvider _tenant;

        public BaseRepository(GroceryManagmentContext ctx, ITenantProvider tenant)
        {
            _ctx = ctx;
            _tenant = tenant;
        }

        public Task<T?> GetById(int id)
            => _ctx.Set<T>().AsNoTracking().FirstOrDefaultAsync(e => e.Id == id)!;

        public Task<IReadOnlyList<T>> GetAll()
            => _ctx.Set<T>().AsNoTracking().ToListAsync() as Task<IReadOnlyList<T>>;

        public async Task<IReadOnlyList<T>> Find(Expression<Func<T, bool>> predicate)
            => await _ctx.Set<T>().AsNoTracking().Where(predicate).ToListAsync();

        public async Task<int> Create(T entity)
        {
            if (entity is IHasGrocery hg)
                hg.GroceryId = _tenant.CurrentGroceryId;   

            var entry = await _ctx.Set<T>().AddAsync(entity);
            await _ctx.SaveChangesAsync();
            return entry.Entity.Id;
        }

        public Task Update(T entity) { _ctx.Set<T>().Update(entity); return Task.CompletedTask; }
        public Task Delete(T entity) { _ctx.Set<T>().Remove(entity); return Task.CompletedTask; }
        public Task SaveChanges() => _ctx.SaveChangesAsync();
    }
}
