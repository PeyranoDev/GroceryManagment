using Domain.Entities;

namespace Domain.Repositories
{
    public interface IUserRepository : IBaseRepository<User>
    {
        Task<User?> GetByEmail(string email);
        Task<bool> ExistsByEmail(string email);
        Task<bool> IsSuperAdmin(int userId);
        Task SetSuperAdmin(int userId, bool isSuperAdmin);
        Task<int> CountByGroceryId(int groceryId);
        Task<IReadOnlyList<User>> GetByGroceryId(int groceryId);
        Task<IReadOnlyList<User>> GetByGroceryIdAll(int groceryId);
        Task Activate(int userId);
        Task SetRole(int userId, Domain.Common.Enums.GroceryRole role);
        Task SetGrocery(int userId, int groceryId);
    }
}
