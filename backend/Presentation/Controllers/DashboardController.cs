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

        /// <summary>
        /// Obtener estadísticas del dashboard para el grocery actual
        /// </summary>
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

        /// <summary>
        /// Obtener ventas semanales para el grocery actual
        /// </summary>
        [HttpGet("weekly-sales")]
        public async Task<IActionResult> GetWeeklySales()
        {
            try
            {
                var weeklySales = await _dashboardService.GetWeeklySalesAsync();
                return Ok(weeklySales);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
