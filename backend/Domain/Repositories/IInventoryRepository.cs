using Domain.Entities;

namespace Domain.Repositories
{
    public interface IInventoryRepository : IBaseRepository<InventoryItem>
    {
        Task<IReadOnlyList<InventoryItem>> GetByProductId(int productId);
        Task<IReadOnlyList<InventoryItem>> GetByGroceryId(int groceryId);
        Task<InventoryItem?> GetByProductIdAndGroceryId(int productId, int groceryId);
        Task<IReadOnlyList<InventoryItem>> GetLowStock(int threshold, int groceryId);
        Task<IReadOnlyList<InventoryItem>> GetOutOfStock(int groceryId);
    }
}