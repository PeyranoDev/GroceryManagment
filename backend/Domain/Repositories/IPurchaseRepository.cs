using Domain.Entities;

namespace Domain.Repositories
{
    public interface IPurchaseRepository : IBaseRepository<Purchase>
    {
        Task<IReadOnlyList<Purchase>> GetBySupplier(string supplier, int groceryId);
        Task<IReadOnlyList<Purchase>> GetByDateRangeAndGrocery(DateTime startDate, DateTime endDate, int groceryId);
        Task<decimal> GetTotalPurchasesByDateRange(DateTime startDate, DateTime endDate, int groceryId);
        Task<PurchaseItem?> GetItemById(int itemId);
        Task DeleteItem(PurchaseItem item);
    }
}
