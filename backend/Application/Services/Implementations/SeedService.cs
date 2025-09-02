using Application.Schemas.Categories;
using Application.Schemas.Products;
using Application.Schemas.Inventory;
using Application.Services.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Exceptions.Categories;
using Domain.Exceptions.Products;
using Domain.Repositories;

namespace Application.Services.Implementations
{
    public class SeedService : ISeedService
    {
        private readonly ICategoryRepository _categories;
        private readonly IProductRepository _products;
        private readonly IInventoryRepository _inventory;
        private readonly IMapper _mapper;

        public SeedService(
            ICategoryRepository categories,
            IProductRepository products,
            IInventoryRepository inventory,
            IMapper mapper)
        {
            _categories = categories;
            _products = products;
            _inventory = inventory;
            _mapper = mapper;
        }

        public async Task<CategoryForResponseDto> CreateCategory(CategoryForCreateDto dto, int groceryId)
        {
            if (await _categories.ExistsByName(dto.Name))
                throw new CategoryAlreadyExistsException(dto.Name);

            var entity = _mapper.Map<Category>(dto);
            entity.GroceryId = groceryId;
            
            var id = await _categories.Create(entity);
            var created = await _categories.GetById(id);
            
            if (created is null)
                throw new CategoryNotFoundException(id);
                
            return _mapper.Map<CategoryForResponseDto>(created);
        }

        public async Task<IReadOnlyList<CategoryForResponseDto>> GetCategoriesByGroceryId(int groceryId)
        {
            var list = await _categories.GetAllByGroceryId(groceryId);
            
            if (list == null)
            {
                return new List<CategoryForResponseDto>();
            }
            
            return list.Select(_mapper.Map<CategoryForResponseDto>).ToList();
        }

        public async Task<ProductForResponseDto> CreateProduct(ProductForCreateDto dto, int groceryId)
        {
            if (await _products.ExistsByName(dto.Name))
                throw new ProductAlreadyExistsException(dto.Name);

            var categoryExists = await _categories.GetById(dto.CategoryId);
            if (categoryExists is null || categoryExists.GroceryId != groceryId)
                throw new CategoryNotValidException(dto.CategoryId);

            if (dto.UnitPrice <= 0)
                throw new InvalidPriceException("precio unitario");
            
            if (dto.SalePrice <= 0)
                throw new InvalidPriceException("precio de venta");

            var entity = _mapper.Map<Product>(dto);
            entity.GroceryId = groceryId;
            
            var id = await _products.Create(entity);
            var created = await _products.GetById(id);
            
            if (created is null)
                throw new ProductNotFoundException(id);
                
            return _mapper.Map<ProductForResponseDto>(created);
        }

        public async Task<InventoryItemForResponseDto> CreateInventoryItem(InventoryItemForCreateDto dto, int groceryId)
        {
            var entity = _mapper.Map<InventoryItem>(dto);
            entity.LastUpdated = DateTime.UtcNow;
            entity.GroceryId = groceryId;
            
            var id = await _inventory.Create(entity);
            var created = await _inventory.GetById(id)!;
            return _mapper.Map<InventoryItemForResponseDto>(created);
        }
    }
}