using Application.Schemas.Reports;

namespace Application.Services.Interfaces
{
    public interface IReportService
    {
        Task<IEnumerable<ReportDataDto>> GetReportsAsync(ReportFilterDto filter);
        Task<decimal> GetTotalSalesAsync(DateTime startDate, DateTime endDate);
        Task<decimal> GetTotalPurchasesAsync(DateTime startDate, DateTime endDate);
        Task<object> GetSalesReportSummaryAsync(DateTime startDate, DateTime endDate);
    }
}
