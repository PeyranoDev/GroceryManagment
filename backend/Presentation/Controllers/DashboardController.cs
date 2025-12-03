using Application.Schemas;
using Application.Schemas.Dashboard;
using Application.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;

        public DashboardController(IDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        [HttpGet]
        public async Task<IActionResult> GetDashboardData([FromQuery] int activitiesCount = 4, [FromQuery] int activitiesDays = 30)
        {
            try
            {
                var data = await _dashboardService.GetDashboardDataAsync(activitiesCount, activitiesDays);
                return Ok(ApiResponse<DashboardDataDto>.SuccessResponse(data));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<DashboardDataDto>.ErrorResponse(ex.Message));
            }
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetDashboardStats()
        {
            try
            {
                var stats = await _dashboardService.GetDashboardStatsAsync();
                return Ok(ApiResponse<DashboardStatsDto>.SuccessResponse(stats));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<DashboardStatsDto>.ErrorResponse(ex.Message));
            }
        }

        [HttpGet("weekly-sales")]
        public async Task<IActionResult> GetWeeklySales()
        {
            try
            {
                var weeklySales = await _dashboardService.GetWeeklySalesAsync();
                return Ok(ApiResponse<IEnumerable<WeeklySalesDto>>.SuccessResponse(weeklySales));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<IEnumerable<WeeklySalesDto>>.ErrorResponse(ex.Message));
            }
        }
    }
}
