using Application.Services.Interfaces;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infraestructure.Services
{
    public class DashboardQueryService : IDashboardQueryService
    {
        private readonly IDbContextFactory<GroceryManagmentContext> _contextFactory;

        public DashboardQueryService(IDbContextFactory<GroceryManagmentContext> contextFactory)
        {
            _contextFactory = contextFactory;
        }

        public async Task<DashboardQueryResult> GetDashboardDataParallelAsync(
            int groceryId,
            DateTime today,
            DateTime yesterday,
            DateTime monthStart,
            DateTime lastMonthStart,
            DateTime lastMonthEnd,
            DateTime weekStart,
            DateTime weekEnd,
            int lowStockThreshold)
        {
            await using var ctx1 = await _contextFactory.CreateDbContextAsync();
            await using var ctx2 = await _contextFactory.CreateDbContextAsync();
            await using var ctx3 = await _contextFactory.CreateDbContextAsync();
            await using var ctx4 = await _contextFactory.CreateDbContextAsync();
            await using var ctx5 = await _contextFactory.CreateDbContextAsync();
            await using var ctx6 = await _contextFactory.CreateDbContextAsync();

            var todaySalesTask = GetSalesByDateRangeAsync(ctx1, today, today.AddDays(1), groceryId);
            var yesterdaySalesTask = GetSalesByDateRangeAsync(ctx2, yesterday, today, groceryId);
            var monthSalesTask = GetSalesByDateRangeAsync(ctx3, monthStart, DateTime.Now, groceryId);
            var lastMonthSalesTask = GetSalesByDateRangeAsync(ctx4, lastMonthStart, lastMonthEnd.AddDays(1), groceryId);
            var lowStockTask = GetLowStockAsync(ctx5, lowStockThreshold, groceryId);
            var weekSalesTask = GetSalesByDateRangeAsync(ctx6, weekStart, weekEnd, groceryId);

            await Task.WhenAll(todaySalesTask, yesterdaySalesTask, monthSalesTask, lastMonthSalesTask, lowStockTask, weekSalesTask);

            return new DashboardQueryResult
            {
                TodaySales = await todaySalesTask,
                YesterdaySales = await yesterdaySalesTask,
                MonthSales = await monthSalesTask,
                LastMonthSales = await lastMonthSalesTask,
                WeekSales = await weekSalesTask,
                LowStockItems = await lowStockTask
            };
        }

        public async Task<RecentActivityQueryResult> GetRecentActivityDataParallelAsync(
            int groceryId,
            DateTime since,
            DateTime until)
        {
            await using var ctx1 = await _contextFactory.CreateDbContextAsync();
            await using var ctx2 = await _contextFactory.CreateDbContextAsync();
            await using var ctx3 = await _contextFactory.CreateDbContextAsync();

            var salesTask = GetSalesByDateRangeAsync(ctx1, since, until, groceryId);
            var purchasesTask = GetPurchasesByDateRangeAsync(ctx2, since, until, groceryId);
            var inventoryTask = GetInventoryByGroceryIdAsync(ctx3, groceryId);

            await Task.WhenAll(salesTask, purchasesTask, inventoryTask);

            return new RecentActivityQueryResult
            {
                Sales = await salesTask,
                Purchases = await purchasesTask,
                InventoryItems = await inventoryTask
            };
        }

        private static async Task<IReadOnlyList<Sale>> GetSalesByDateRangeAsync(
            GroceryManagmentContext context, DateTime startDate, DateTime endDate, int groceryId)
        {
            return await context.Sales.AsNoTracking()
                .IgnoreQueryFilters()
                .Include(s => s.Items)
                    .ThenInclude(si => si.Product)
                .Include(s => s.User)
                .Where(s => s.Date >= startDate && s.Date <= endDate && s.GroceryId == groceryId)
                .OrderByDescending(s => s.Date)
                .ToListAsync();
        }

        private static async Task<IReadOnlyList<InventoryItem>> GetLowStockAsync(
            GroceryManagmentContext context, int threshold, int groceryId)
        {
            return await context.InventoryItems.AsNoTracking()
                .IgnoreQueryFilters()
                .Include(i => i.Product)
                    .ThenInclude(p => p.Category)
                .Include(i => i.LastUpdatedByUser)
                .Where(i => i.GroceryId == groceryId && i.Stock > 0 && i.Stock <= threshold)
                .ToListAsync();
        }

        private static async Task<IReadOnlyList<Purchase>> GetPurchasesByDateRangeAsync(
            GroceryManagmentContext context, DateTime startDate, DateTime endDate, int groceryId)
        {
            return await context.Purchases.AsNoTracking()
                .IgnoreQueryFilters()
                .Include(p => p.Items)
                    .ThenInclude(pi => pi.Product)
                .Include(p => p.User)
                .Where(p => p.GroceryId == groceryId && p.Date >= startDate && p.Date <= endDate)
                .OrderByDescending(p => p.Date)
                .ToListAsync();
        }

        private static async Task<IReadOnlyList<InventoryItem>> GetInventoryByGroceryIdAsync(
            GroceryManagmentContext context, int groceryId)
        {
            return await context.InventoryItems.AsNoTracking()
                .IgnoreQueryFilters()
                .Include(i => i.Product)
                    .ThenInclude(p => p.Category)
                .Include(i => i.LastUpdatedByUser)
                .Where(i => i.GroceryId == groceryId)
                .ToListAsync();
        }
    }
}
