using Application.Schemas.Categories;

namespace Application.Services.Interfaces
{
    public interface ICategoryService
    {
        Task<CategoryForResponseDto?> GetById(int id);
        Task<IReadOnlyList<CategoryForResponseDto>> GetAll();
        Task<CategoryForResponseDto> Create(CategoryForCreateDto dto);
        Task<CategoryForResponseDto?> Update(int id, CategoryForUpdateDto dto);
        Task<bool> Delete(int id);
    }
}