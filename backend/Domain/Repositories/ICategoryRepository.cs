using Domain.Entities;

namespace Domain.Repositories
{
    public interface ICategoryRepository : IBaseRepository<Category>
    {
        Task<bool> ExistsByName(string name);
        Task<IReadOnlyList<Category>> GetByGroceryId(int groceryId);
    }
}