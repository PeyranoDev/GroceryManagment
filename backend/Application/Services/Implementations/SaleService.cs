using Application.Schemas.Sales;
using Application.Services.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Repositories;
using Domain.Tenancy;

namespace Application.Services.Implementations
{
    public class SaleService : ISaleService
    {
        private readonly ISaleRepository _sales;
        private readonly ITenantProvider _tenantProvider;
        private readonly IMapper _mapper;

        public SaleService(ISaleRepository sales, ITenantProvider tenantProvider, IMapper mapper)
        {
            _sales = sales;
            _tenantProvider = tenantProvider;
            _mapper = mapper;
        }

        public async Task<SaleForResponseDto?> GetById(int id)
        {
            var sale = await _sales.GetById(id);
            if (sale is null || sale.GroceryId != _tenantProvider.CurrentGroceryId)
                return null;
            
            return _mapper.Map<SaleForResponseDto>(sale);
        }

        public async Task<IReadOnlyList<SaleForResponseDto>> GetAll()
        {
            var list = await _sales.GetAllByGroceryId(_tenantProvider.CurrentGroceryId);
            
            // Asegurar que la lista no sea null
            if (list == null)
            {
                return new List<SaleForResponseDto>();
            }
            
            return list.Select(_mapper.Map<SaleForResponseDto>).ToList();
        }

        public async Task<IReadOnlyList<SaleForResponseDto>> GetByDateRange(DateTime startDate, DateTime endDate)
        {
            var list = await _sales.GetByDateRange(startDate, endDate);
            // Filter by current grocery ID since the repository method might not do it
            var filteredList = list.Where(s => s.GroceryId == _tenantProvider.CurrentGroceryId).ToList();
            return filteredList.Select(_mapper.Map<SaleForResponseDto>).ToList();
        }

        public async Task<IReadOnlyList<SaleForResponseDto>> GetByUserId(int userId)
        {
            var list = await _sales.GetByUserId(userId);
            // Filter by current grocery ID since the repository method might not do it
            var filteredList = list.Where(s => s.GroceryId == _tenantProvider.CurrentGroceryId).ToList();
            return filteredList.Select(_mapper.Map<SaleForResponseDto>).ToList();
        }

        public async Task<SaleForResponseDto> Create(SaleForCreateDto dto)
        {
            // Validar que el usuario existe (aunque podría estar en otro grocery)
            if (dto.UserId <= 0)
            {
                throw new ArgumentException("El ID del usuario es requerido y debe ser válido.");
            }

            var entity = _mapper.Map<Sale>(dto);
            
            // Set grocery ID for multi-tenancy
            entity.GroceryId = _tenantProvider.CurrentGroceryId;
            
            // Mapear los items y configurar sus propiedades
            entity.Items = dto.Items.Select(itemDto => {
                var saleItem = _mapper.Map<SaleItem>(itemDto);
                saleItem.GroceryId = _tenantProvider.CurrentGroceryId;
                return saleItem;
            }).ToList();
            
            // Calcular el total
            entity.Total = entity.Items.Sum(item => item.Price * item.Quantity);
            entity.Date = DateTime.UtcNow;

            // Crear la venta con todos sus items en una sola operación
            await _sales.Create(entity);
            await _sales.SaveChanges();

            // El ID se asigna después de SaveChanges, así que obtenemos la venta por otros medios
            // o usamos la entidad que acabamos de crear
            return _mapper.Map<SaleForResponseDto>(entity);
        }

        public async Task<bool> Delete(int id)
        {
            var entity = await _sales.GetById(id);
            if (entity is null || entity.GroceryId != _tenantProvider.CurrentGroceryId) 
                return false;
            
            await _sales.Delete(entity);
            await _sales.SaveChanges();
            return true;
        }
    }
}