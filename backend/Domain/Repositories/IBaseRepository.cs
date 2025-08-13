namespace Infraestructure.Repositories
{
    public interface IBaseRepository<T> where T : class
    {
        Task<int> Create(T entity);
        Task<T?> GetById(int id);
    }
}