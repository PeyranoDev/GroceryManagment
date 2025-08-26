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
    }
}