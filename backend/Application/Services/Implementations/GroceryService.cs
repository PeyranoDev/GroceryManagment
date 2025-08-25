using Application.Schemas.Groceries;
using Application.Services.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Exceptions.Groceries;
using Domain.Repositories;

namespace Application.Services.Implementations
{
    public class GroceryService : IGroceryService
    {
        private readonly IGroceryRepository _groceries;
        private readonly IMapper _mapper;

        public GroceryService(IGroceryRepository groceries, IMapper mapper)
        {
            _groceries = groceries;
            _mapper = mapper;
        }

        public async Task<GroceryForResponseDto?> GetById(int id)
        {
            var grocery = await _groceries.GetById(id);
            if (grocery is null)
                throw new GroceryNotFoundException(id);
            
            return _mapper.Map<GroceryForResponseDto>(grocery);
        }

        public async Task<IReadOnlyList<GroceryForResponseDto>> GetAll()
        {
            var list = await _groceries.GetAll();
            return list.Select(_mapper.Map<GroceryForResponseDto>).ToList();
        }

        public async Task<GroceryForResponseDto> Create(GroceryForCreateDto dto)
        {
            if (await _groceries.ExistsByName(dto.Name))
                throw new GroceryAlreadyExistsException(dto.Name);

            var entity = _mapper.Map<Grocery>(dto);
            var id = await _groceries.Create(entity);
            var created = await _groceries.GetById(id);
            
            if (created is null)
                throw new GroceryNotFoundException(id);
                
            return _mapper.Map<GroceryForResponseDto>(created);
        }

        public async Task<GroceryForResponseDto?> Update(int id, GroceryForUpdateDto dto)
        {
            var entity = await _groceries.GetById(id);
            if (entity is null) 
                throw new GroceryNotFoundException(id);

            if (!string.Equals(entity.Name, dto.Name, StringComparison.OrdinalIgnoreCase)
                && await _groceries.ExistsByName(dto.Name))
                throw new GroceryAlreadyExistsException(dto.Name);

            _mapper.Map(dto, entity);
            await _groceries.Update(entity);
            await _groceries.SaveChanges();
            return _mapper.Map<GroceryForResponseDto>(entity);
        }

        public async Task<bool> Delete(int id)
        {
            var entity = await _groceries.GetById(id);
            if (entity is null) 
                throw new GroceryNotFoundException(id);
            
            await _groceries.Delete(entity);
            await _groceries.SaveChanges();
            return true;
        }
    }
}