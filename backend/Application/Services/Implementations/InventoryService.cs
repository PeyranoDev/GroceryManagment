using Application.Schemas.Inventory;
using Application.Services.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Repositories;

namespace Application.Services.Implementations
{
    public class InventoryService : IInventoryService
    {
        private readonly IInventoryRepository _inventory;
        private readonly IMapper _mapper;

        public InventoryService(IInventoryRepository inventory, IMapper mapper)
        {
            _inventory = inventory;
            _mapper = mapper;
        }

        public async Task<InventoryItemForResponseDto?> GetById(int id)
        {
            var item = await _inventory.GetById(id);
            return item is null ? null : _mapper.Map<InventoryItemForResponseDto>(item);
        }

        public async Task<IReadOnlyList<InventoryItemForResponseDto>> GetAll()
        {
            var list = await _inventory.GetAll();
            return list.Select(_mapper.Map<InventoryItemForResponseDto>).ToList();
        }

        public async Task<IReadOnlyList<InventoryItemForResponseDto>> GetByProductId(int productId)
        {
            var list = await _inventory.GetByProductId(productId);
            return list.Select(_mapper.Map<InventoryItemForResponseDto>).ToList();
        }

        public async Task<InventoryItemForResponseDto> Create(InventoryItemForCreateDto dto)
        {
            var entity = _mapper.Map<InventoryItem>(dto);
            entity.LastUpdated = DateTime.UtcNow;
            
            var id = await _inventory.Create(entity);
            var created = await _inventory.GetById(id)!;
            return _mapper.Map<InventoryItemForResponseDto>(created);
        }

        public async Task<InventoryItemForResponseDto?> Update(int id, InventoryItemForUpdateDto dto)
        {
            var entity = await _inventory.GetById(id);
            if (entity is null) return null;

            _mapper.Map(dto, entity);
            entity.LastUpdated = DateTime.UtcNow;
            
            await _inventory.Update(entity);
            await _inventory.SaveChanges();
            return _mapper.Map<InventoryItemForResponseDto>(entity);
        }

        public async Task<bool> Delete(int id)
        {
            var entity = await _inventory.GetById(id);
            if (entity is null) return false;
            
            await _inventory.Delete(entity);
            await _inventory.SaveChanges();
            return true;
        }
    }
}