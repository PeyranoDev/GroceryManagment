using Microsoft.AspNetCore.Mvc;

namespace Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HealthController : ControllerBase
    {
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

        [HttpGet("detailed")]
        public IActionResult GetDetailed()
        {
            try
            {

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
