using Domain.Entities;

namespace Domain.Repositories
{
    public interface IGroceryRepository : IBaseRepository<Grocery>
    {
        Task<bool> ExistsByName(string name);
        Task<Grocery?> GetByName(string name);
    }
}