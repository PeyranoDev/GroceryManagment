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
            var existing = (await _categories.Find(c => c.Name == dto.Name)).FirstOrDefault();
            if (existing != null)
                 return _mapper.Map<CategoryForResponseDto>(existing);

            var entity = _mapper.Map<Category>(dto);
            // Global category, no GroceryId
            
            var id = await _categories.Create(entity);
            var created = await _categories.GetById(id);
            
            if (created is null)
                throw new CategoryNotFoundException(id);
                
            return _mapper.Map<CategoryForResponseDto>(created);
        }

        public async Task<IReadOnlyList<CategoryForResponseDto>> GetCategoriesByGroceryId(int groceryId)
        {
            var list = await _categories.GetAll();
            
            if (list == null)
            {
                return new List<CategoryForResponseDto>();
            }
            
            return list.Select(_mapper.Map<CategoryForResponseDto>).ToList();
        }

        public async Task<ProductForResponseDto> CreateProduct(ProductForCreateDto dto, int groceryId)
        {
            // 1. Get or Create Global Product
            var existingProduct = (await _products.Find(p => p.Name == dto.Name)).FirstOrDefault();
            Product product;
            
            if (existingProduct != null)
            {
                product = existingProduct;
            }
            else
            {
                 var categoryExists = await _categories.GetById(dto.CategoryId);
                 if (categoryExists is null) 
                    throw new CategoryNotValidException(dto.CategoryId);

                product = _mapper.Map<Product>(dto);
                var id = await _products.Create(product);
                product = await _products.GetById(id)!;
            }

            // 2. Create Inventory Item
            var inventoryItems = await _inventory.GetByProductId(product.Id);
            if (inventoryItems.Any(i => i.GroceryId == groceryId))
                 throw new ProductAlreadyExistsException(dto.Name);

            var inventoryItem = new InventoryItem
            {
                ProductId = product.Id,
                GroceryId = groceryId,
                Stock = 0,
                UnitPrice = dto.UnitPrice,
                SalePrice = dto.SalePrice,
                Promotion = _mapper.Map<Promotion>(dto.Promotion) ?? new Promotion(),
                LastUpdated = DateTime.UtcNow
            };
            
            await _inventory.Create(inventoryItem);

            var responseDto = _mapper.Map<ProductForResponseDto>(product);
            responseDto.UnitPrice = inventoryItem.UnitPrice;
            responseDto.SalePrice = inventoryItem.SalePrice;
            responseDto.Promotion = _mapper.Map<PromotionDto>(inventoryItem.Promotion);
            
            return responseDto;
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