using Microsoft.AspNetCore.Mvc;

namespace Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HealthController : ControllerBase
    {
        /// <summary>
        /// Endpoint de verificación de salud del servicio
        /// </summary>
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(new
            {
                status = "healthy",
                timestamp = DateTime.UtcNow,
                service = "GroceryManagement Backend",
                version = "1.0.0"
            });
        }

        /// <summary>
        /// Endpoint detallado de verificación de salud
        /// </summary>
        [HttpGet("detailed")]
        public IActionResult GetDetailed()
        {
            try
            {
                // Aquí podrías agregar verificaciones adicionales como:
                // - Conectividad a la base de datos
                // - Estado de servicios externos
                // - Uso de memoria, etc.

                return Ok(new
                {
                    status = "healthy",
                    timestamp = DateTime.UtcNow,
                    service = "GroceryManagement Backend",
                    version = "1.0.0",
                    uptime = DateTime.UtcNow.Subtract(System.Diagnostics.Process.GetCurrentProcess().StartTime.ToUniversalTime()),
                    environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Unknown",
                    checks = new
                    {
                        database = "healthy", // Placeholder
                        memory = "healthy",   // Placeholder
                        disk = "healthy"      // Placeholder
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(503, new
                {
                    status = "unhealthy",
                    timestamp = DateTime.UtcNow,
                    service = "GroceryManagement Backend",
                    error = ex.Message
                });
            }
        }
    }
}
