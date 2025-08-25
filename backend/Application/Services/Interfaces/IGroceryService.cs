using Application.Schemas.Groceries;

namespace Application.Services.Interfaces
{
    public interface IGroceryService
    {
        Task<GroceryForResponseDto?> GetById(int id);
        Task<IReadOnlyList<GroceryForResponseDto>> GetAll();
        Task<GroceryForResponseDto> Create(GroceryForCreateDto dto);
        Task<GroceryForResponseDto?> Update(int id, GroceryForUpdateDto dto);
        Task<bool> Delete(int id);
    }
}