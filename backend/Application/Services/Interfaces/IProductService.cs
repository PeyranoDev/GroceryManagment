using Application.Schemas.Products;

namespace Application.Services.Interfaces
{
    public interface IProductService
    {
        Task<ProductForResponseDto?> GetById(int id);
        Task<IReadOnlyList<ProductForResponseDto>> GetAll();
        Task<ProductForResponseDto> Create(ProductForCreateDto dto);
        Task<ProductForResponseDto?> Update(int id, ProductForUpdateDto dto);
        Task<bool> Delete(int id);
    }
}