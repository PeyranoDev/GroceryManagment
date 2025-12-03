using Application.Schemas.Purchases;

namespace Application.Services.Interfaces
{
    public interface IPurchaseService
    {
        Task<PurchaseForResponseDto> CreatePurchaseAsync(PurchaseForCreateDto purchaseDto, int groceryId, int? userId = null);
        Task<PurchaseForResponseDto> UpdatePurchaseAsync(int id, PurchaseForUpdateDto purchaseDto, int groceryId);
        Task<PurchaseForResponseDto> GetPurchaseByIdAsync(int id, int groceryId);
        Task<IEnumerable<PurchaseForResponseDto>> GetAllPurchasesAsync(int groceryId);
        Task<IEnumerable<PurchaseForResponseDto>> GetPurchasesBySupplierAsync(string supplier, int groceryId);
        Task<IEnumerable<PurchaseForResponseDto>> GetPurchasesByDateRangeAsync(DateTime startDate, DateTime endDate, int groceryId);
        Task<bool> DeletePurchaseAsync(int id, int groceryId);
    }
}
