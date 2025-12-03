using Application.Schemas.Purchases;
using Application.Services.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Exceptions;
using Domain.Repositories;

namespace Application.Services.Implementations
{
    public class PurchaseService : IPurchaseService
    {
        private readonly IPurchaseRepository _purchaseRepository;
        private readonly IInventoryRepository _inventoryRepository;
        private readonly IMapper _mapper;

        public PurchaseService(
            IPurchaseRepository purchaseRepository,
            IInventoryRepository inventoryRepository,
            IMapper mapper)
        {
            _purchaseRepository = purchaseRepository;
            _inventoryRepository = inventoryRepository;
            _mapper = mapper;
        }

        public async Task<PurchaseForResponseDto> CreatePurchaseAsync(PurchaseForCreateDto purchaseDto, int groceryId, int? userId = null)
        {
            var purchase = _mapper.Map<Purchase>(purchaseDto);
            purchase.GroceryId = groceryId;
            purchase.UserId = userId;
            
            purchase.Total = purchase.Items.Sum(item => item.Quantity * item.UnitCost);
            
            foreach (var item in purchase.Items)
            {
                item.GroceryId = groceryId;
                item.TotalCost = item.Quantity * item.UnitCost;
            }

            var purchaseId = await _purchaseRepository.Create(purchase);
            await _purchaseRepository.SaveChanges();

            await UpdateInventoryFromPurchase(purchase, userId);

            var createdPurchase = await _purchaseRepository.GetById(purchaseId);
            return _mapper.Map<PurchaseForResponseDto>(createdPurchase);
        }

        public async Task<PurchaseForResponseDto> UpdatePurchaseAsync(int id, PurchaseForUpdateDto purchaseDto, int groceryId)
        {
            var existingPurchase = await _purchaseRepository.GetById(id);
            if (existingPurchase == null || existingPurchase.GroceryId != groceryId)
                throw new NotFoundException("Compra no encontrada");

            _mapper.Map(purchaseDto, existingPurchase);
            existingPurchase.Total = existingPurchase.Items.Sum(item => item.Quantity * item.UnitCost);

            await _purchaseRepository.Update(existingPurchase);
            await _purchaseRepository.SaveChanges();

            return _mapper.Map<PurchaseForResponseDto>(existingPurchase);
        }

        public async Task<PurchaseForResponseDto> GetPurchaseByIdAsync(int id, int groceryId)
        {
            var purchase = await _purchaseRepository.GetById(id);
            if (purchase == null || purchase.GroceryId != groceryId)
                throw new NotFoundException("Compra no encontrada");

            return _mapper.Map<PurchaseForResponseDto>(purchase);
        }

        public async Task<IEnumerable<PurchaseForResponseDto>> GetAllPurchasesAsync(int groceryId)
        {
            var purchases = await _purchaseRepository.GetAllByGroceryId(groceryId);
            return _mapper.Map<IEnumerable<PurchaseForResponseDto>>(purchases);
        }

        public async Task<IEnumerable<PurchaseForResponseDto>> GetPurchasesBySupplierAsync(string supplier, int groceryId)
        {
            var purchases = await _purchaseRepository.GetBySupplier(supplier, groceryId);
            return _mapper.Map<IEnumerable<PurchaseForResponseDto>>(purchases);
        }

        public async Task<IEnumerable<PurchaseForResponseDto>> GetPurchasesByDateRangeAsync(DateTime startDate, DateTime endDate, int groceryId)
        {
            var purchases = await _purchaseRepository.GetByDateRangeAndGrocery(startDate, endDate, groceryId);
            return _mapper.Map<IEnumerable<PurchaseForResponseDto>>(purchases);
        }

        public async Task<bool> DeletePurchaseAsync(int id, int groceryId)
        {
            var purchase = await _purchaseRepository.GetById(id);
            if (purchase == null || purchase.GroceryId != groceryId)
                throw new NotFoundException("Compra no encontrada");

            await _purchaseRepository.Delete(purchase);
            await _purchaseRepository.SaveChanges();

            return true;
        }

        private async Task UpdateInventoryFromPurchase(Purchase purchase, int? userId)
        {
            foreach (var item in purchase.Items)
            {
                var inventoryItem = await _inventoryRepository.GetByProductIdAndGroceryId(item.ProductId, purchase.GroceryId);
                
                if (inventoryItem != null)
                {
                    inventoryItem.Stock += item.Quantity;
                    inventoryItem.LastUpdated = DateTime.UtcNow;
                    inventoryItem.LastUpdatedByUserId = userId;
                    await _inventoryRepository.Update(inventoryItem);
                }
                else
                {
                    var newInventoryItem = new InventoryItem
                    {
                        ProductId = item.ProductId,
                        Stock = item.Quantity,
                        LastUpdated = DateTime.UtcNow,
                        LastUpdatedByUserId = userId,
                        GroceryId = purchase.GroceryId,
                        UnitPrice = item.UnitCost,
                        SalePrice = item.UnitCost * 1.3m
                    };
                    await _inventoryRepository.Create(newInventoryItem);
                }
            }
            await _inventoryRepository.SaveChanges();
        }
    }
}
