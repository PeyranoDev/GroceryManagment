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
        private readonly IInventoryRepository _inventory;
        private readonly ITenantProvider _tenantProvider;
        private readonly IMapper _mapper;

        public SaleService(ISaleRepository sales, IInventoryRepository inventory, ITenantProvider tenantProvider, IMapper mapper)
        {
            _sales = sales;
            _inventory = inventory;
            _tenantProvider = tenantProvider;
            _mapper = mapper;
        }

        public async Task<SaleForResponseDto> Create(SaleForCreateDto dto)
        {
            var entity = _mapper.Map<Sale>(dto);
            entity.GroceryId = _tenantProvider.CurrentGroceryId;
            
            entity.Items = new List<SaleItem>();
            foreach (var itemDto in dto.Items)
            {
                var saleItem = _mapper.Map<SaleItem>(itemDto);
                saleItem.GroceryId = _tenantProvider.CurrentGroceryId;
                entity.Items.Add(saleItem);

                // Update Stock
                var inventoryItem = await _inventory.GetByProductIdAndGroceryId(itemDto.ProductId, _tenantProvider.CurrentGroceryId);
                if (inventoryItem == null)
                {
                    throw new Domain.Exceptions.Inventory.ProductNotValidForInventoryException(itemDto.ProductId);
                }
                if (inventoryItem.Stock < itemDto.Quantity)
                {
                    var pname = inventoryItem.Product?.Name ?? $"Producto {itemDto.ProductId}";
                    throw new Domain.Exceptions.Inventory.InsufficientStockException(pname, inventoryItem.Stock, itemDto.Quantity);
                }
                inventoryItem.Stock -= itemDto.Quantity;
                inventoryItem.LastUpdated = DateTime.UtcNow;
                inventoryItem.LastUpdatedByUserId = dto.UserId;
                inventoryItem.Product = null!;
                inventoryItem.LastUpdatedByUser = null!;
                await _inventory.Update(inventoryItem);
            }
            
            entity.Total = entity.Items.Sum(item => item.Price * item.Quantity);
            entity.Date = DateTime.UtcNow;

            await _sales.Create(entity);
            await _sales.SaveChanges();
            await _inventory.SaveChanges();

            return _mapper.Map<SaleForResponseDto>(entity);
        }

        public async Task<SaleForResponseDto?> GetById(int id)
        {
            var entity = await _sales.GetById(id);
            if (entity is null || entity.GroceryId != _tenantProvider.CurrentGroceryId)
                return null;
            return _mapper.Map<SaleForResponseDto>(entity);
        }

        public async Task<IReadOnlyList<SaleForResponseDto>> GetAll()
        {
            var list = await _sales.GetAllByGroceryId(_tenantProvider.CurrentGroceryId);
            return list.Select(_mapper.Map<SaleForResponseDto>).ToList();
        }

        public async Task<IReadOnlyList<SaleForResponseDto>> GetByDateRange(DateTime startDate, DateTime endDate)
        {
            var list = await _sales.GetSalesByDateRangeAndGrocery(startDate, endDate, _tenantProvider.CurrentGroceryId);
            return list.Select(_mapper.Map<SaleForResponseDto>).ToList();
        }

        public async Task<IReadOnlyList<SaleForResponseDto>> GetByUserId(int userId)
        {
            var list = await _sales.GetByUserId(userId);
            return list.Select(_mapper.Map<SaleForResponseDto>).ToList();
        }

        public async Task<SaleForResponseDto?> UpdateOrderStatus(int id, string status)
        {
            var entity = await _sales.GetById(id);
            if (entity is null || entity.GroceryId != _tenantProvider.CurrentGroceryId)
                return null;
            entity.OrderStatus = status;
            await _sales.Update(entity);
            await _sales.SaveChanges();
            return _mapper.Map<SaleForResponseDto>(entity);
        }

        public async Task<SaleForResponseDto?> UpdatePaymentStatus(int id, string status)
        {
            var entity = await _sales.GetById(id);
            if (entity is null || entity.GroceryId != _tenantProvider.CurrentGroceryId)
                return null;
            entity.PaymentStatus = status;
            await _sales.Update(entity);
            await _sales.SaveChanges();
            return _mapper.Map<SaleForResponseDto>(entity);
        }

        public async Task<SaleForResponseDto?> AddPayment(int id, string method, decimal amount)
        {
            var entity = await _sales.GetById(id);
            if (entity is null || entity.GroceryId != _tenantProvider.CurrentGroceryId)
                return null;
            entity.PaymentMethod = method;
            if (amount >= entity.Total) entity.PaymentStatus = "Paid";
            await _sales.Update(entity);
            await _sales.SaveChanges();
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
