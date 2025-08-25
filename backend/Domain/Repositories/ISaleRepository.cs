using Domain.Entities;

namespace Domain.Repositories
{
    public interface ISaleRepository : IBaseRepository<Sale>
    {
        Task<IReadOnlyList<Sale>> GetByDateRange(DateTime startDate, DateTime endDate);
        Task<IReadOnlyList<Sale>> GetByUserId(int userId);
        Task<IReadOnlyList<Sale>> GetByGroceryId(int groceryId);
        Task<decimal> GetTotalSalesByDateRange(DateTime startDate, DateTime endDate);
    }
}