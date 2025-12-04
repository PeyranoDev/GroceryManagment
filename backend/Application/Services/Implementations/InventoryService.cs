using Application.Schemas.Inventory;
using Application.Services.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Repositories;
using Domain.Tenancy;

namespace Application.Services.Implementations
{
    public class InventoryService : IInventoryService
    {
        private readonly IInventoryRepository _inventory;
        private readonly ITenantProvider _tenantProvider;
        private readonly IExchangeRateService _exchangeRateService;
        private readonly IMapper _mapper;

        public InventoryService(
            IInventoryRepository inventory, 
            ITenantProvider tenantProvider, 
            IExchangeRateService exchangeRateService,
            IMapper mapper)
        {
            _inventory = inventory;
            _tenantProvider = tenantProvider;
            _exchangeRateService = exchangeRateService;
            _mapper = mapper;
        }

        private async Task<InventoryItemForResponseDto> MapWithExchangeRate(InventoryItem item)
        {
            var dto = _mapper.Map<InventoryItemForResponseDto>(item);
            var cotizacion = await _exchangeRateService.GetLatestOficialRateAsync();
            
            if (cotizacion.HasValue && cotizacion.Value > 0)
            {
                dto.CotizacionDolar = Math.Round(cotizacion.Value, 2);
                dto.SalePriceUSD = Math.Round(item.SalePrice / cotizacion.Value, 2);
            }
            else
            {
                dto.CotizacionDolar = 0;
                dto.SalePriceUSD = 0;
            }
            
            return dto;
        }

        public async Task<InventoryItemForResponseDto?> GetById(int id)
        {
            var item = await _inventory.GetById(id);
            if (item is null || item.GroceryId != _tenantProvider.CurrentGroceryId)
                return null;
            
            return await MapWithExchangeRate(item);
        }

        public async Task<IReadOnlyList<InventoryItemForResponseDto>> GetAll()
        {
            var list = await _inventory.GetAllByGroceryId(_tenantProvider.CurrentGroceryId);
            
            if (list == null || !list.Any())
            {
                return new List<InventoryItemForResponseDto>();
            }

            // Get cotizacion once for all items
            var cotizacion = await _exchangeRateService.GetLatestOficialRateAsync();
            var cotizacionValue = cotizacion.HasValue && cotizacion.Value > 0 ? cotizacion.Value : 0;

            var result = new List<InventoryItemForResponseDto>();
            foreach (var item in list)
            {
                var dto = _mapper.Map<InventoryItemForResponseDto>(item);
                dto.CotizacionDolar = Math.Round(cotizacionValue, 2);
                dto.SalePriceUSD = cotizacionValue > 0 
                    ? Math.Round(item.SalePrice / cotizacionValue, 2) 
                    : 0;
                result.Add(dto);
            }
            
            return result;
        }

        public async Task<IReadOnlyList<InventoryItemForResponseDto>> GetByProductId(int productId)
        {
            var list = await _inventory.GetByProductId(productId);
            var filteredList = list.Where(i => i.GroceryId == _tenantProvider.CurrentGroceryId).ToList();
            
            var cotizacion = await _exchangeRateService.GetLatestOficialRateAsync();
            var cotizacionValue = cotizacion.HasValue && cotizacion.Value > 0 ? cotizacion.Value : 0;

            var result = new List<InventoryItemForResponseDto>();
            foreach (var item in filteredList)
            {
                var dto = _mapper.Map<InventoryItemForResponseDto>(item);
                dto.CotizacionDolar = Math.Round(cotizacionValue, 2);
                dto.SalePriceUSD = cotizacionValue > 0 
                    ? Math.Round(item.SalePrice / cotizacionValue, 2) 
                    : 0;
                result.Add(dto);
            }
            
            return result;
        }

        public async Task<InventoryItemForResponseDto> Create(InventoryItemForCreateDto dto, int? userId = null)
        {
            var entity = _mapper.Map<InventoryItem>(dto);
            entity.LastUpdated = DateTime.UtcNow;
            entity.LastUpdatedByUserId = userId;
            entity.GroceryId = _tenantProvider.CurrentGroceryId;
            
            var id = await _inventory.Create(entity);
            var created = await _inventory.GetById(id)!;
            return await MapWithExchangeRate(created!);
        }

        public async Task<InventoryItemForResponseDto?> Update(int id, InventoryItemForUpdateDto dto, int? userId = null)
        {
            var entity = await _inventory.GetById(id);
            if (entity is null || entity.GroceryId != _tenantProvider.CurrentGroceryId) 
                return null;

            _mapper.Map(dto, entity);
            entity.LastUpdated = DateTime.UtcNow;
            entity.LastUpdatedByUserId = userId;
            
            await _inventory.Update(entity);
            await _inventory.SaveChanges();
            return await MapWithExchangeRate(entity);
        }

        public async Task<bool> Delete(int id)
        {
            var entity = await _inventory.GetById(id);
            if (entity is null || entity.GroceryId != _tenantProvider.CurrentGroceryId) 
                return false;
            
            await _inventory.Delete(entity);
            await _inventory.SaveChanges();
            return true;
        }
    }
}