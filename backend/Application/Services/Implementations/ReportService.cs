using Application.Schemas.Reports;
using Application.Services.Interfaces;
using AutoMapper;
using Domain.Repositories;
using Domain.Tenancy;

namespace Application.Services.Implementations
{
    public class ReportService : IReportService
    {
        private readonly ISaleRepository _saleRepository;
        private readonly IPurchaseRepository _purchaseRepository;
        private readonly ITenantProvider _tenantProvider;
        private readonly IMapper _mapper;

        public ReportService(
            ISaleRepository saleRepository,
            IPurchaseRepository purchaseRepository,
            ITenantProvider tenantProvider,
            IMapper mapper)
        {
            _saleRepository = saleRepository;
            _purchaseRepository = purchaseRepository;
            _tenantProvider = tenantProvider;
            _mapper = mapper;
        }

        public async Task<IEnumerable<ReportDataDto>> GetReportsAsync(ReportFilterDto filter)
        {
            var groceryId = _tenantProvider.CurrentGroceryId;
            var reports = new List<ReportDataDto>();

            // Fechas por defecto si no se especifican
            var startDate = filter.StartDate ?? DateTime.Today.AddDays(-30);
            var endDate = filter.EndDate ?? DateTime.Today.AddDays(1);

            // Obtener ventas si se solicitan
            if (filter.ReportType == "sales" || filter.ReportType == "all" || string.IsNullOrEmpty(filter.ReportType))
            {
                var sales = await _saleRepository.GetSalesByDateRangeAndGrocery(startDate, endDate, groceryId);
                var salesReports = _mapper.Map<IEnumerable<ReportDataDto>>(sales);
                reports.AddRange(salesReports);
            }

            // Obtener compras si se solicitan
            if (filter.ReportType == "purchases" || filter.ReportType == "all" || string.IsNullOrEmpty(filter.ReportType))
            {
                var purchases = await _purchaseRepository.GetByDateRangeAndGrocery(startDate, endDate, groceryId);
                var purchaseReports = _mapper.Map<IEnumerable<ReportDataDto>>(purchases);
                reports.AddRange(purchaseReports);
            }

            // Filtrar por usuario si se especifica
            if (!string.IsNullOrEmpty(filter.UserId))
            {
                reports = reports.Where(r => r.User.Contains(filter.UserId)).ToList();
            }

            // Filtrar por proveedor si se especifica
            if (!string.IsNullOrEmpty(filter.SupplierId))
            {
                reports = reports.Where(r => r.Supplier != null && r.Supplier.Contains(filter.SupplierId)).ToList();
            }

            return reports.OrderByDescending(r => r.Date);
        }

        public async Task<decimal> GetTotalSalesAsync(DateTime startDate, DateTime endDate)
        {
            var groceryId = _tenantProvider.CurrentGroceryId;
            return await _saleRepository.GetTotalSalesByDateRange(startDate, endDate);
        }

        public async Task<decimal> GetTotalPurchasesAsync(DateTime startDate, DateTime endDate)
        {
            var groceryId = _tenantProvider.CurrentGroceryId;
            return await _purchaseRepository.GetTotalPurchasesByDateRange(startDate, endDate, groceryId);
        }

        public async Task<object> GetSalesReportSummaryAsync(DateTime startDate, DateTime endDate)
        {
            var groceryId = _tenantProvider.CurrentGroceryId;
            var sales = await _saleRepository.GetSalesByDateRangeAndGrocery(startDate, endDate, groceryId);
            
            return new
            {
                TotalSales = sales.Count,
                TotalRevenue = sales.Sum(s => s.Total),
                AverageTicket = sales.Any() ? sales.Average(s => s.Total) : 0,
                DateRange = new { StartDate = startDate, EndDate = endDate },
                TopSellingDays = sales
                    .GroupBy(s => s.Date.Date)
                    .Select(g => new { Date = g.Key, Sales = g.Count(), Revenue = g.Sum(s => s.Total) })
                    .OrderByDescending(x => x.Revenue)
                    .Take(5)
            };
        }
    }
}
