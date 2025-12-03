using Application.Schemas.RecentActivities;
using Application.Services.Interfaces;
using Domain.Repositories;
using Domain.Tenancy;

namespace Application.Services.Implementations
{
    public class DerivedRecentActivityService : IDerivedRecentActivityService
    {
        private readonly ISaleRepository _saleRepository;
        private readonly IPurchaseRepository _purchaseRepository;
        private readonly IInventoryRepository _inventoryRepository;
        private readonly ITenantProvider _tenantProvider;

        public DerivedRecentActivityService(
            ISaleRepository saleRepository,
            IPurchaseRepository purchaseRepository,
            IInventoryRepository inventoryRepository,
            ITenantProvider tenantProvider)
        {
            _saleRepository = saleRepository;
            _purchaseRepository = purchaseRepository;
            _inventoryRepository = inventoryRepository;
            _tenantProvider = tenantProvider;
        }

        public async Task<IReadOnlyList<DerivedActivityDto>> GetRecentActivitiesAsync(int count = 10, int days = 30)
        {
            var groceryId = _tenantProvider.CurrentGroceryId;
            var since = DateTime.UtcNow.AddDays(-days);
            var until = DateTime.UtcNow;

            // Query sales and purchases in parallel
            var salesTask = _saleRepository.GetSalesByDateRangeAndGrocery(since, until, groceryId);
            var purchasesTask = _purchaseRepository.GetByDateRangeAndGrocery(since, until, groceryId);
            var inventoryTask = _inventoryRepository.GetByGroceryId(groceryId);

            await Task.WhenAll(salesTask, purchasesTask, inventoryTask);

            var sales = await salesTask;
            var purchases = await purchasesTask;
            var inventoryItems = await inventoryTask;

            var activities = new List<DerivedActivityDto>();

            // Map sales to activities
            foreach (var sale in sales)
            {
                var itemCount = sale.Items?.Count ?? 0;
                var userName = sale.User?.Name ?? "Usuario";
                
                activities.Add(new DerivedActivityDto
                {
                    Id = $"sale_{sale.Id}",
                    Type = "Venta",
                    Action = $"{userName} registró venta #{sale.Id} por ${sale.Total:N0} ({itemCount} {(itemCount == 1 ? "producto" : "productos")})",
                    Date = sale.Date,
                    UserName = userName,
                    Amount = sale.Total,
                    ItemCount = itemCount,
                    EntityId = sale.Id
                });
            }

            // Map purchases to activities
            foreach (var purchase in purchases)
            {
                var itemCount = purchase.Items?.Count ?? 0;
                var userName = purchase.User?.Name;
                
                var actionText = userName != null
                    ? $"{userName} registró compra de \"{purchase.Supplier}\" por ${purchase.Total:N0} ({itemCount} {(itemCount == 1 ? "producto" : "productos")})"
                    : $"Compra de \"{purchase.Supplier}\" registrada por ${purchase.Total:N0} ({itemCount} {(itemCount == 1 ? "producto" : "productos")})";

                activities.Add(new DerivedActivityDto
                {
                    Id = $"purchase_{purchase.Id}",
                    Type = "Compra",
                    Action = actionText,
                    Date = purchase.Date,
                    UserName = userName,
                    Amount = purchase.Total,
                    ItemCount = itemCount,
                    EntityId = purchase.Id
                });
            }

            // Map inventory updates to activities (only those with LastUpdatedByUser)
            foreach (var item in inventoryItems.Where(i => i.LastUpdatedByUserId != null && i.LastUpdated >= since))
            {
                var userName = item.LastUpdatedByUser?.Name ?? "Usuario";
                var productName = item.Product?.Name ?? "Producto";

                activities.Add(new DerivedActivityDto
                {
                    Id = $"inventory_{item.Id}",
                    Type = "Inventario",
                    Action = $"{userName} actualizó stock de \"{productName}\" a {item.Stock} unidades",
                    Date = item.LastUpdated,
                    UserName = userName,
                    Amount = null,
                    ItemCount = item.Stock,
                    EntityId = item.Id
                });
            }

            // Sort by date descending and take top N
            return activities
                .OrderByDescending(a => a.Date)
                .Take(count)
                .ToList();
        }
    }
}
