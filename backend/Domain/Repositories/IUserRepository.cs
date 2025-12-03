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
    }
}