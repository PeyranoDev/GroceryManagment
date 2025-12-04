using Application.Schemas.Sales;

namespace Application.Services.Interfaces
{
    public interface ISaleService
    {
        Task<SaleForResponseDto?> GetById(int id);
        Task<IReadOnlyList<SaleForResponseDto>> GetAll();
        Task<SaleForResponseDto> Create(SaleForCreateDto dto);
        Task<bool> Delete(int id);
        Task<IReadOnlyList<SaleForResponseDto>> GetByDateRange(DateTime startDate, DateTime endDate);
        Task<IReadOnlyList<SaleForResponseDto>> GetByUserId(int userId);
        Task<SaleForResponseDto?> UpdateOrderStatus(int id, string status);
        Task<SaleForResponseDto?> UpdatePaymentStatus(int id, string status);
        Task<SaleForResponseDto?> AddPayment(int id, string method, decimal amount);
    }
}
