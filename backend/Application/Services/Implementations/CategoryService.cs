using Application.Schemas.Categories;
using Application.Services.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Exceptions.Categories;
using Domain.Repositories;
using Domain.Tenancy;

namespace Application.Services.Implementations
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _categories;
        private readonly ITenantProvider _tenantProvider;
        private readonly IMapper _mapper;

        public CategoryService(ICategoryRepository categories, ITenantProvider tenantProvider, IMapper mapper)
        {
            _categories = categories;
            _tenantProvider = tenantProvider;
            _mapper = mapper;
        }

        public async Task<CategoryForResponseDto?> GetById(int id)
        {
            var category = await _categories.GetById(id);
            if (category is null || category.GroceryId != _tenantProvider.CurrentGroceryId)
                throw new CategoryNotFoundException(id);
            
            return _mapper.Map<CategoryForResponseDto>(category);
        }

        public async Task<IReadOnlyList<CategoryForResponseDto>> GetAll()
        {
            var list = await _categories.GetAllByGroceryId(_tenantProvider.CurrentGroceryId);
            
            // Asegurar que la lista no sea null
            if (list == null)
            {
                return new List<CategoryForResponseDto>();
            }
            
            return list.Select(_mapper.Map<CategoryForResponseDto>).ToList();
        }

        public async Task<CategoryForResponseDto> Create(CategoryForCreateDto dto)
        {
            if (await _categories.ExistsByName(dto.Name))
                throw new CategoryAlreadyExistsException(dto.Name);

            var entity = _mapper.Map<Category>(dto);
            entity.GroceryId = _tenantProvider.CurrentGroceryId;
            
            var id = await _categories.Create(entity);
            var created = await _categories.GetById(id);
            
            if (created is null)
                throw new CategoryNotFoundException(id);
                
            return _mapper.Map<CategoryForResponseDto>(created);
        }

        public async Task<CategoryForResponseDto?> Update(int id, CategoryForUpdateDto dto)
        {
            var entity = await _categories.GetById(id);
            if (entity is null || entity.GroceryId != _tenantProvider.CurrentGroceryId) 
                throw new CategoryNotFoundException(id);

            if (!string.Equals(entity.Name, dto.Name, StringComparison.OrdinalIgnoreCase)
                && await _categories.ExistsByName(dto.Name))
                throw new CategoryAlreadyExistsException(dto.Name);

            _mapper.Map(dto, entity);
            await _categories.Update(entity);
            await _categories.SaveChanges();
            return _mapper.Map<CategoryForResponseDto>(entity);
        }

        public async Task<bool> Delete(int id)
        {
            var entity = await _categories.GetById(id);
            if (entity is null || entity.GroceryId != _tenantProvider.CurrentGroceryId) 
                throw new CategoryNotFoundException(id);
            
            // TODO: Verificar si tiene productos asociados
            // if (entity.Products.Any())
            //     throw new CategoryHasProductsException(entity.Name);
            
            await _categories.Delete(entity);
            await _categories.SaveChanges();
            return true;
        }
    }
}