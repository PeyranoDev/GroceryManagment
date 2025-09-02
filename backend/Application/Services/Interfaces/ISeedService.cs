using Application.Schemas.Categories;
using Application.Schemas.Products;
using Application.Schemas.Inventory;

namespace Application.Services.Interfaces
{
    public interface ISeedService
    {
        Task<CategoryForResponseDto> CreateCategory(CategoryForCreateDto dto, int groceryId);
        Task<IReadOnlyList<CategoryForResponseDto>> GetCategoriesByGroceryId(int groceryId);
        Task<ProductForResponseDto> CreateProduct(ProductForCreateDto dto, int groceryId);
        Task<InventoryItemForResponseDto> CreateInventoryItem(InventoryItemForCreateDto dto, int groceryId);
    }
}