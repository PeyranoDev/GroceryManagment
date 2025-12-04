using Application.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Presentation.Controllers
{
    /// <summary>
    /// Controller para reprocesamiento manual de cotizaciones y feriados.
    /// Solo accesible por SuperAdmin.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Policy = "SuperAdmin")]
    public class ExchangeRateController : ControllerBase
    {
        private readonly IExchangeRateService _exchangeRateService;
        private readonly ILogger<ExchangeRateController> _logger;

        public ExchangeRateController(
            IExchangeRateService exchangeRateService,
            ILogger<ExchangeRateController> logger)
        {
            _exchangeRateService = exchangeRateService;
            _logger = logger;
        }

        /// <summary>
        /// [SuperAdmin] Reprocesa manualmente las cotizaciones del dólar desde la API externa
        /// </summary>
        [HttpPost("reprocesar-cotizaciones")]
        public async Task<IActionResult> ReprocessDollarRates()
        {
            try
            {
                _logger.LogInformation("SuperAdmin triggered manual dollar rate fetch");
                var count = await _exchangeRateService.FetchAndStoreDollarRatesAsync();

                return Ok(new
                {
                    success = true,
                    message = $"Se obtuvieron y almacenaron {count} cotizaciones correctamente",
                    count = count,
                    timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in manual dollar rate reprocess");
                return StatusCode(500, new { success = false, message = "Error al reprocesar cotizaciones" });
            }
        }

        /// <summary>
        /// [SuperAdmin] Reprocesa manualmente los feriados de un año específico desde la API externa
        /// </summary>
        [HttpPost("reprocesar-feriados/{anio}")]
        public async Task<IActionResult> ReprocessHolidays(int anio)
        {
            try
            {
                if (anio < 2020 || anio > 2100)
                {
                    return BadRequest(new { success = false, message = "El año debe estar entre 2020 y 2100" });
                }

                _logger.LogInformation("SuperAdmin triggered manual holiday fetch for year {Year}", anio);
                var count = await _exchangeRateService.FetchAndStoreHolidaysAsync(anio);

                return Ok(new
                {
                    success = true,
                    message = $"Se obtuvieron y almacenaron {count} feriados para el año {anio}",
                    count = count,
                    anio = anio,
                    timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in manual holiday reprocess for year {Year}", anio);
                return StatusCode(500, new { success = false, message = "Error al reprocesar feriados" });
            }
        }

        /// <summary>
        /// [SuperAdmin] Reprocesa manualmente los feriados del año actual y el siguiente
        /// </summary>
        [HttpPost("reprocesar-feriados")]
        public async Task<IActionResult> ReprocessAllHolidays()
        {
            try
            {
                _logger.LogInformation("SuperAdmin triggered manual holiday fetch for current and next year");
                var count = await _exchangeRateService.FetchAndStoreCurrentAndNextYearHolidaysAsync();

                var currentYear = DateTime.UtcNow.Year;
                return Ok(new
                {
                    success = true,
                    message = $"Se obtuvieron y almacenaron {count} feriados para los años {currentYear} y {currentYear + 1}",
                    count = count,
                    anios = new[] { currentYear, currentYear + 1 },
                    timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in manual holiday reprocess");
                return StatusCode(500, new { success = false, message = "Error al reprocesar feriados" });
            }
        }
    }
}
