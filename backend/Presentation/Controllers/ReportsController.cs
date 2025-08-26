using Application.Schemas.Reports;
using Application.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Presentation.Filters;

namespace Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [RequireGroceryHeader]
    public class ReportsController : ControllerBase
    {
        private readonly IReportService _reportService;

        public ReportsController(IReportService reportService)
        {
            _reportService = reportService;
        }

        [HttpPost]
        public async Task<IActionResult> GetReports([FromBody] ReportFilterDto filter)
        {
            try
            {
                var reports = await _reportService.GetReportsAsync(filter);
                return Ok(reports);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("sales-summary")]
        public async Task<IActionResult> GetSalesSummary(
            [FromQuery] DateTime? startDate,
            [FromQuery] DateTime? endDate)
        {
            try
            {
                var start = startDate ?? DateTime.Today.AddDays(-30);
                var end = endDate ?? DateTime.Today.AddDays(1);
                
                var summary = await _reportService.GetSalesReportSummaryAsync(start, end);
                return Ok(summary);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("total-sales")]
        public async Task<IActionResult> GetTotalSales(
            [FromQuery] DateTime startDate,
            [FromQuery] DateTime endDate)
        {
            try
            {
                var total = await _reportService.GetTotalSalesAsync(startDate, endDate);
                return Ok(new { total });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("total-purchases")]
        public async Task<IActionResult> GetTotalPurchases(
            [FromQuery] DateTime startDate,
            [FromQuery] DateTime endDate)
        {
            try
            {
                var total = await _reportService.GetTotalPurchasesAsync(startDate, endDate);
                return Ok(new { total });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
