using Application.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Presentation.Filters;

namespace Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [RequireGroceryHeader]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;

        public DashboardController(IDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetDashboardStats()
        {
            try
            {
                var stats = await _dashboardService.GetDashboardStatsAsync();
                return Ok(stats);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("last-7-days-sales")]
        public async Task<IActionResult> GetLast7DaysSales()
        {
            try
            {
                var last7DaysSales = await _dashboardService.GetLast7DaysSalesAsync();
                return Ok(last7DaysSales);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
