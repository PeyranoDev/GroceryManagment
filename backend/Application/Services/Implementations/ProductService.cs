using Application.Schemas.Products;
using Application.Services.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Exceptions.Products;
using Domain.Repositories;
using Domain.Tenancy;

namespace Application.Services.Implementations
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _products;
        private readonly IInventoryRepository _inventory;
        private readonly ICategoryRepository _categories;
        private readonly ITenantProvider _tenantProvider;
        private readonly IMapper _mapper;

        public ProductService(IProductRepository products, IInventoryRepository inventory, ICategoryRepository categories, ITenantProvider tenantProvider, IMapper mapper)
        {
            _products = products;
            _inventory = inventory;
            _categories = categories;
            _tenantProvider = tenantProvider;
            _mapper = mapper;
        }

        public async Task<ProductForResponseDto?> GetById(int id)
        {
            var product = await _products.GetById(id);
            if (product is null)
                throw new ProductNotFoundException(id);
            
            // Check if this product is in the current grocery's inventory
            var inventoryItems = await _inventory.GetByProductId(id);
            var currentGroceryItem = inventoryItems.FirstOrDefault(i => i.GroceryId == _tenantProvider.CurrentGroceryId);

            if (currentGroceryItem is null)
                throw new ProductNotFoundException(id); // Or return null, but exception is consistent with previous behavior
            
            var dto = _mapper.Map<ProductForResponseDto>(product);
            dto.UnitPrice = currentGroceryItem.UnitPrice;
            dto.SalePrice = currentGroceryItem.SalePrice;
            dto.Promotion = _mapper.Map<PromotionDto>(currentGroceryItem.Promotion);
            
            return dto;
        }

        public async Task<IReadOnlyList<ProductForResponseDto>> GetAll()
        {
            // Get products that are in the current grocery's inventory
            var list = await _products.GetByGroceryId(_tenantProvider.CurrentGroceryId);
            
            var dtos = new List<ProductForResponseDto>();
            foreach (var product in list)
            {
                var dto = _mapper.Map<ProductForResponseDto>(product);
                // Since we fetched by GroceryId using the repo method that includes InventoryItems, we can access them
                var item = product.InventoryItems.FirstOrDefault(i => i.GroceryId == _tenantProvider.CurrentGroceryId);
                if (item != null)
                {
                    dto.UnitPrice = item.UnitPrice;
                    dto.SalePrice = item.SalePrice;
                    dto.Promotion = _mapper.Map<PromotionDto>(item.Promotion);
                }
                dtos.Add(dto);
            }
            return dtos;
        }

        public async Task<ProductForResponseDto> Create(ProductForCreateDto dto)
        {
            // 1. Check if product exists globally by name
            var existingProduct = (await _products.Find(p => p.Name == dto.Name)).FirstOrDefault();

            Product product;

            if (existingProduct != null)
            {
                // 2. If exists, check if it's already in inventory
                var inventoryItems = await _inventory.GetByProductId(existingProduct.Id);
                if (inventoryItems.Any(i => i.GroceryId == _tenantProvider.CurrentGroceryId))
                    throw new ProductAlreadyExistsException(dto.Name);

                product = existingProduct;
            }
            else
            {
                // 3. If not exists, create global product
                var categoryExists = await _categories.GetById(dto.CategoryId);
                if (categoryExists is null) // Categories are now global, so no GroceryId check needed? Or should we check if category is allowed? 
                    // Assuming global categories are available to all.
                    throw new CategoryNotValidException(dto.CategoryId);

                product = _mapper.Map<Product>(dto);
                // Product no longer has GroceryId
                var id = await _products.Create(product);
                product = await _products.GetById(id)!;
            }

            // 4. Create InventoryItem
            if (dto.UnitPrice <= 0) throw new InvalidPriceException("precio unitario");
            if (dto.SalePrice <= 0) throw new InvalidPriceException("precio de venta");

            var inventoryItem = new InventoryItem
            {
                ProductId = product.Id,
                GroceryId = _tenantProvider.CurrentGroceryId,
                Stock = 0, // Default stock
                UnitPrice = dto.UnitPrice,
                SalePrice = dto.SalePrice,
                Promotion = _mapper.Map<Promotion>(dto.Promotion) ?? new Promotion(),
                LastUpdated = DateTime.UtcNow
            };

            await _inventory.Create(inventoryItem);

            // 5. Return DTO
            var responseDto = _mapper.Map<ProductForResponseDto>(product);
            responseDto.UnitPrice = inventoryItem.UnitPrice;
            responseDto.SalePrice = inventoryItem.SalePrice;
            responseDto.Promotion = _mapper.Map<PromotionDto>(inventoryItem.Promotion);

            return responseDto;
        }

        public async Task<ProductForResponseDto?> Update(int id, ProductForUpdateDto dto)
        {
            var product = await _products.GetById(id);
            if (product is null) 
                throw new ProductNotFoundException(id);

            // Check inventory
            var inventoryItems = await _inventory.GetByProductId(id);
            var currentGroceryItem = inventoryItems.FirstOrDefault(i => i.GroceryId == _tenantProvider.CurrentGroceryId);

            if (currentGroceryItem is null)
                throw new ProductNotFoundException(id);

            // Update Global Product (Name, Category, etc.)
            // WARNING: Updating global product affects ALL groceries.
            // Should we allow updating name? Maybe only if it's not used by others?
            // For now, let's assume we update it globally as per user request "product entity in various groceries".
            // But wait, if I rename "Apple" to "Pear", it changes for everyone.
            // Maybe we should ONLY update the InventoryItem prices here, and NOT the product name?
            // Or maybe we create a new product if the name changes?
            
            // Let's assume for now we update the global product.
            if (!string.Equals(product.Name, dto.Name, StringComparison.OrdinalIgnoreCase))
            {
                 if (await _products.ExistsByName(dto.Name))
                    throw new ProductAlreadyExistsException(dto.Name);
            }

            _mapper.Map(dto, product);
            await _products.Update(product);

            // Update InventoryItem prices
            if (dto.UnitPrice <= 0) throw new InvalidPriceException("precio unitario");
            if (dto.SalePrice <= 0) throw new InvalidPriceException("precio de venta");

            currentGroceryItem.UnitPrice = dto.UnitPrice;
            currentGroceryItem.SalePrice = dto.SalePrice;
            currentGroceryItem.Promotion = _mapper.Map<Promotion>(dto.Promotion) ?? new Promotion();
            currentGroceryItem.LastUpdated = DateTime.UtcNow;

            await _inventory.Update(currentGroceryItem);
            await _products.SaveChanges(); // Saves both

            var responseDto = _mapper.Map<ProductForResponseDto>(product);
            responseDto.UnitPrice = currentGroceryItem.UnitPrice;
            responseDto.SalePrice = currentGroceryItem.SalePrice;
            responseDto.Promotion = _mapper.Map<PromotionDto>(currentGroceryItem.Promotion);

            return responseDto;
        }

        public async Task<bool> Delete(int id)
        {
            // Delete only the InventoryItem for this grocery
            var inventoryItems = await _inventory.GetByProductId(id);
            var currentGroceryItem = inventoryItems.FirstOrDefault(i => i.GroceryId == _tenantProvider.CurrentGroceryId);

            if (currentGroceryItem is null)
                throw new ProductNotFoundException(id);
            
            await _inventory.Delete(currentGroceryItem);
            await _inventory.SaveChanges();
            
            // Optionally: Check if product is used by any other grocery. If not, delete the Product too?
            // For now, keep the product.
            
            return true;
        }
    }
}