using Application.Schemas;
using Application.Schemas.RecentActivities;
using Application.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RecentActivitiesController : ControllerBase
    {
        private readonly IDerivedRecentActivityService _activityService;

        public RecentActivitiesController(IDerivedRecentActivityService activityService)
        {
            _activityService = activityService;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<IReadOnlyList<DerivedActivityDto>>>> GetRecentActivities(
            [FromQuery] int count = 10,
            [FromQuery] int days = 30)
        {
            var activities = await _activityService.GetRecentActivitiesAsync(count, days);
            return Ok(ApiResponse<IReadOnlyList<DerivedActivityDto>>.SuccessResponse(
                activities, 
                "Actividades recientes obtenidas exitosamente"
            ));
        }
    }
}
