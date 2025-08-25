using Application.Schemas;
using Application.Schemas.RecentActivities;
using Application.Services.Interfaces;
using Infraestructure.Tenancy;
using Microsoft.AspNetCore.Mvc;
using Presentation.Filters;

namespace Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [RequireGroceryHeader]
    public class RecentActivitiesController : ControllerBase
    {
        private readonly IRecentActivityService _recentActivityService;
        private readonly ITenantProvider _tenantProvider;

        public RecentActivitiesController(IRecentActivityService recentActivityService, ITenantProvider tenantProvider)
        {
            _recentActivityService = recentActivityService;
            _tenantProvider = tenantProvider;
        }

        /// <summary>
        /// Obtener todas las actividades recientes del grocery actual
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<ApiResponse<IReadOnlyList<RecentActivityForResponseDto>>>> GetAll()
        {
            var activities = await _recentActivityService.GetAll();
            return Ok(ApiResponse<IReadOnlyList<RecentActivityForResponseDto>>.SuccessResponse(
                activities, 
                "Actividades recientes obtenidas exitosamente"
            ));
        }

        /// <summary>
        /// Obtener las actividades más recientes del grocery actual
        /// </summary>
        [HttpGet("recent")]
        public async Task<ActionResult<ApiResponse<IReadOnlyList<RecentActivityForResponseDto>>>> GetRecent([FromQuery] int count = 10)
        {
            var activities = await _recentActivityService.GetRecent(count);
            return Ok(ApiResponse<IReadOnlyList<RecentActivityForResponseDto>>.SuccessResponse(
                activities, 
                "Actividades más recientes obtenidas exitosamente"
            ));
        }

        /// <summary>
        /// Obtener una actividad reciente por ID (validando que pertenezca al grocery actual)
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<RecentActivityForResponseDto>>> GetById(int id)
        {
            var activity = await _recentActivityService.GetById(id);
            
            if (activity != null && activity.GroceryId != _tenantProvider.CurrentGroceryId)
                return NotFound(ApiResponse<RecentActivityForResponseDto>.ErrorResponse("Actividad reciente no encontrada."));

            return Ok(ApiResponse<RecentActivityForResponseDto>.SuccessResponse(
                activity!, 
                "Actividad reciente obtenida exitosamente"
            ));
        }

        /// <summary>
        /// Crear una nueva actividad reciente en el grocery actual
        /// </summary>
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

        /// <summary>
        /// Eliminar una actividad reciente (validando que pertenezca al grocery actual)
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse>> Delete(int id)
        {
            var existingActivity = await _recentActivityService.GetById(id);
            if (existingActivity.GroceryId != _tenantProvider.CurrentGroceryId)
                return NotFound(ApiResponse.ErrorResponse("Actividad reciente no encontrada."));

            await _recentActivityService.Delete(id);
            return Ok(ApiResponse.SuccessResponse("Actividad reciente eliminada exitosamente"));
        }
    }
}