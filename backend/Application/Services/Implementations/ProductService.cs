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
        private readonly ICategoryRepository _categories;
        private readonly ITenantProvider _tenantProvider;
        private readonly IMapper _mapper;

        public ProductService(IProductRepository products, ICategoryRepository categories, ITenantProvider tenantProvider, IMapper mapper)
        {
            _products = products;
            _categories = categories;
            _tenantProvider = tenantProvider;
            _mapper = mapper;
        }

        public async Task<ProductForResponseDto?> GetById(int id)
        {
            var product = await _products.GetById(id);
            if (product is null || product.GroceryId != _tenantProvider.CurrentGroceryId)
                throw new ProductNotFoundException(id);
            
            return _mapper.Map<ProductForResponseDto>(product);
        }

        public async Task<IReadOnlyList<ProductForResponseDto>> GetAll()
        {
            var list = await _products.GetAllByGroceryId(_tenantProvider.CurrentGroceryId);
            return list.Select(_mapper.Map<ProductForResponseDto>).ToList();
        }

        public async Task<ProductForResponseDto> Create(ProductForCreateDto dto)
        {
            if (await _products.ExistsByName(dto.Name))
                throw new ProductAlreadyExistsException(dto.Name);

            var categoryExists = await _categories.GetById(dto.CategoryId);
            if (categoryExists is null || categoryExists.GroceryId != _tenantProvider.CurrentGroceryId)
                throw new CategoryNotValidException(dto.CategoryId);

            if (dto.UnitPrice <= 0)
                throw new InvalidPriceException("precio unitario");
            
            if (dto.SalePrice <= 0)
                throw new InvalidPriceException("precio de venta");

            var entity = _mapper.Map<Product>(dto);
            entity.GroceryId = _tenantProvider.CurrentGroceryId;
            
            var id = await _products.Create(entity);
            var created = await _products.GetById(id);
            
            if (created is null)
                throw new ProductNotFoundException(id);
                
            return _mapper.Map<ProductForResponseDto>(created);
        }

        public async Task<ProductForResponseDto?> Update(int id, ProductForUpdateDto dto)
        {
            var entity = await _products.GetById(id);
            if (entity is null || entity.GroceryId != _tenantProvider.CurrentGroceryId) 
                throw new ProductNotFoundException(id);

            if (!string.Equals(entity.Name, dto.Name, StringComparison.OrdinalIgnoreCase)
                && await _products.ExistsByName(dto.Name))
                throw new ProductAlreadyExistsException(dto.Name);

            var categoryExists = await _categories.GetById(dto.CategoryId);
            if (categoryExists is null || categoryExists.GroceryId != _tenantProvider.CurrentGroceryId)
                throw new CategoryNotValidException(dto.CategoryId);

            if (dto.UnitPrice <= 0)
                throw new InvalidPriceException("precio unitario");
            
            if (dto.SalePrice <= 0)
                throw new InvalidPriceException("precio de venta");

            _mapper.Map(dto, entity);
            await _products.Update(entity);
            await _products.SaveChanges();
            return _mapper.Map<ProductForResponseDto>(entity);
        }

        public async Task<bool> Delete(int id)
        {
            var entity = await _products.GetById(id);
            if (entity is null || entity.GroceryId != _tenantProvider.CurrentGroceryId) 
                throw new ProductNotFoundException(id);
            
            await _products.Delete(entity);
            await _products.SaveChanges();
            return true;
        }
    }
}