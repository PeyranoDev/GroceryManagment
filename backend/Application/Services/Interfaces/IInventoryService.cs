using Application.Schemas.Inventory;

namespace Application.Services.Interfaces
{
    public interface IInventoryService
    {
        Task<InventoryItemForResponseDto?> GetById(int id);
        Task<IReadOnlyList<InventoryItemForResponseDto>> GetAll();
        Task<InventoryItemForResponseDto> Create(InventoryItemForCreateDto dto);
        Task<InventoryItemForResponseDto?> Update(int id, InventoryItemForUpdateDto dto);
        Task<bool> Delete(int id);
        Task<IReadOnlyList<InventoryItemForResponseDto>> GetByProductId(int productId);
    }
}