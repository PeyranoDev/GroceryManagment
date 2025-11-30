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
        private readonly IRecentActivityService _recentActivityService;

        public RecentActivitiesController(IRecentActivityService recentActivityService)
        {
            _recentActivityService = recentActivityService;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<IReadOnlyList<RecentActivityForResponseDto>>>> GetAll()
        {
            var activities = await _recentActivityService.GetAll();
            return Ok(ApiResponse<IReadOnlyList<RecentActivityForResponseDto>>.SuccessResponse(
                activities, 
                "Actividades recientes obtenidas exitosamente"
            ));
        }

        [HttpGet("recent")]
        public async Task<ActionResult<ApiResponse<IReadOnlyList<RecentActivityForResponseDto>>>> GetRecent([FromQuery] int count = 10)
        {
            var activities = await _recentActivityService.GetRecent(count);
            return Ok(ApiResponse<IReadOnlyList<RecentActivityForResponseDto>>.SuccessResponse(
                activities, 
                "Actividades más recientes obtenidas exitosamente"
            ));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<RecentActivityForResponseDto>>> GetById(int id)
        {
            var activity = await _recentActivityService.GetById(id);
            return Ok(ApiResponse<RecentActivityForResponseDto>.SuccessResponse(
                activity!, 
                "Actividad reciente obtenida exitosamente"
            ));
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<RecentActivityForResponseDto>>> Create([FromBody] RecentActivityForCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<RecentActivityForResponseDto>.ErrorResponse("Datos de entrada inválidos."));

            var activity = await _recentActivityService.Create(dto);
            return CreatedAtAction(
                nameof(GetById), 
                new { id = activity.Id }, 
                ApiResponse<RecentActivityForResponseDto>.SuccessResponse(
                    activity, 
                    "Actividad reciente creada exitosamente"
                )
            );
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse>> Delete(int id)
        {
            await _recentActivityService.Delete(id);
            return Ok(ApiResponse.SuccessResponse("Actividad reciente eliminada exitosamente"));
        }
    }
}
