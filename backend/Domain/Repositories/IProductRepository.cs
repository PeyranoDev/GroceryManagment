using Domain.Entities;

namespace Domain.Repositories
{
    public interface IProductRepository : IBaseRepository<Product>
    {
        Task<bool> ExistsByName(string name);
        Task<IReadOnlyList<Product>> GetByCategoryId(int categoryId);
        Task<IReadOnlyList<Product>> GetByGroceryId(int groceryId);
    }
}