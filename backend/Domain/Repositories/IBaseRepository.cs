using Domain.Entities;
using System.Linq.Expressions;

namespace Domain.Repositories
{
    public interface IBaseRepository<T> where T : class, IEntity
    {
        Task<T?> GetById(int id);
        Task<IReadOnlyList<T>> GetAll();
        Task<IReadOnlyList<T>> Find(Expression<Func<T, bool>> predicate);
        Task<int> Create(T entity);
        Task Update(T entity);
        Task Delete(T entity);
        Task SaveChanges();
        Task<IReadOnlyList<T>> GetAllByGroceryId(int groceryId);
    }
}