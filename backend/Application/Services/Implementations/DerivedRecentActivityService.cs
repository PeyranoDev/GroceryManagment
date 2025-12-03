using Application.Schemas.RecentActivities;
using Application.Services.Interfaces;
using Domain.Tenancy;

namespace Application.Services.Implementations
{
    public class DerivedRecentActivityService : IDerivedRecentActivityService
    {
        private readonly IDashboardQueryService _dashboardQueryService;
        private readonly ITenantProvider _tenantProvider;

        public DerivedRecentActivityService(
            IDashboardQueryService dashboardQueryService,
            ITenantProvider tenantProvider)
        {
            _dashboardQueryService = dashboardQueryService;
            _tenantProvider = tenantProvider;
        }

        public async Task<IReadOnlyList<DerivedActivityDto>> GetRecentActivitiesAsync(int count = 10, int days = 30)
        {
            var groceryId = _tenantProvider.CurrentGroceryId;
            var since = DateTime.UtcNow.AddDays(-days);
            var until = DateTime.UtcNow;

            var data = await _dashboardQueryService.GetRecentActivityDataParallelAsync(groceryId, since, until);

            var activities = new List<DerivedActivityDto>();

            foreach (var sale in data.Sales)
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

            foreach (var purchase in data.Purchases)
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

            foreach (var item in data.InventoryItems.Where(i => i.LastUpdatedByUserId != null && i.LastUpdated >= since))
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

            return activities
                .OrderByDescending(a => a.Date)
                .Take(count)
                .ToList();
        }
    }
}
