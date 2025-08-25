// Infraestructure/Repositories/BaseRepository.cs
using Domain.Entities;
using Domain.Repositories;
using Domain.Tenancy;
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

        public virtual Task<T?> GetById(int id)
            => _ctx.Set<T>().AsNoTracking().FirstOrDefaultAsync(e => e.Id == id);

        public async Task<IReadOnlyList<T>> GetAll()
        {
            var list = await _ctx.Set<T>().AsNoTracking().ToListAsync();
            return list;
        }

        public virtual async Task<IReadOnlyList<T>> GetAllByGroceryId(int groceryId)
        {
            if (typeof(IHasGrocery).IsAssignableFrom(typeof(T)))
            {
                var list = await _ctx.Set<T>().AsNoTracking()
                    .Where(e => ((IHasGrocery)e).GroceryId == groceryId)
                    .ToListAsync();
                return list;
            }
            return await GetAll();
        }

        public async Task<IReadOnlyList<T>> Find(Expression<Func<T, bool>> predicate)
            => await _ctx.Set<T>().AsNoTracking().Where(predicate).ToListAsync();

        public virtual async Task<int> Create(T entity)
        {
            if (entity is IHasGrocery hg)
                hg.GroceryId = _tenant.CurrentGroceryId;   

            var entry = await _ctx.Set<T>().AddAsync(entity);
            
            // Retornar 0 si no se ha guardado aún (el ID real se asignará después de SaveChanges)
            return entry.Entity.Id;
        }

        public Task Update(T entity) { _ctx.Set<T>().Update(entity); return Task.CompletedTask; }
        public Task Delete(T entity) { _ctx.Set<T>().Remove(entity); return Task.CompletedTask; }
        public Task SaveChanges() => _ctx.SaveChangesAsync();
    }
}
