using Application.Schemas.ExternalApis;
using Application.Services.Interfaces;
using Domain.Entities;
using Domain.Repositories;
using Microsoft.Extensions.Logging;
using System.Globalization;
using System.Net.Http;
using System.Net.Http.Json;

namespace Application.Services.Implementations
{
    public class ExchangeRateService : IExchangeRateService
    {
        private readonly ICotizacionDolarRepository _cotizacionRepository;
        private readonly IFeriadoRepository _feriadoRepository;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ILogger<ExchangeRateService> _logger;

        private static readonly string[] DollarTypes = new[] { "oficial", "blue" };

        public ExchangeRateService(
            ICotizacionDolarRepository cotizacionRepository,
            IFeriadoRepository feriadoRepository,
            IHttpClientFactory httpClientFactory,
            ILogger<ExchangeRateService> logger)
        {
            _cotizacionRepository = cotizacionRepository;
            _feriadoRepository = feriadoRepository;
            _httpClientFactory = httpClientFactory;
            _logger = logger;
        }

        public async Task<int> FetchAndStoreDollarRatesAsync(CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Starting manual dollar rate fetch");
            var httpClient = _httpClientFactory.CreateClient("DolarApi");
            var stored = 0;

            foreach (var dollarType in DollarTypes)
            {
                try
                {
                    var response = await httpClient.GetFromJsonAsync<DolarApiResponse>(
                        $"v1/dolares/{dollarType}",
                        cancellationToken);

                    if (response != null)
                    {
                        var cotizacion = new CotizacionDolar
                        {
                            TipoCambio = dollarType,
                            Compra = response.Compra,
                            Venta = response.Venta,
                            FechaActualizacion = response.FechaActualizacion,
                            FechaRegistro = DateTime.UtcNow,
                            Fuente = "dolarapi.com"
                        };

                        await _cotizacionRepository.Create(cotizacion);
                        stored++;

                        _logger.LogInformation(
                            "Stored {DollarType} rate - Compra: {Compra}, Venta: {Venta}, Updated: {Updated}",
                            dollarType, response.Compra, response.Venta, response.FechaActualizacion);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error fetching {DollarType} rate", dollarType);
                }
            }

            _logger.LogInformation("Manual dollar rate fetch completed. Stored {Count} rates", stored);
            return stored;
        }

        public async Task<int> FetchAndStoreHolidaysAsync(int year, CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Starting manual holiday fetch for year {Year}", year);
            var httpClient = _httpClientFactory.CreateClient("ArgentinaDataApi");
            var stored = 0;

            try
            {
                // Check if we already have holidays for this year and delete them
                if (await _feriadoRepository.ExistenFeriadosDelAnio(year))
                {
                    _logger.LogInformation("Holidays for year {Year} already exist, refreshing...", year);
                    await _feriadoRepository.DeleteByAnio(year);
                }

                var holidays = await httpClient.GetFromJsonAsync<List<FeriadoApiResponse>>(
                    $"v1/feriados/{year}",
                    cancellationToken);

                if (holidays != null && holidays.Count > 0)
                {
                    foreach (var holiday in holidays)
                    {
                        if (DateOnly.TryParse(holiday.Fecha, CultureInfo.InvariantCulture, out var fecha))
                        {
                            var feriado = new FeriadoArgentino
                            {
                                Fecha = fecha,
                                Tipo = holiday.Tipo,
                                Nombre = holiday.Nombre,
                                Anio = year,
                                FechaRegistro = DateTime.UtcNow
                            };

                            await _feriadoRepository.Create(feriado);
                            stored++;
                        }
                        else
                        {
                            _logger.LogWarning("Could not parse date {Fecha} for holiday {Nombre}",
                                holiday.Fecha, holiday.Nombre);
                        }
                    }

                    _logger.LogInformation("Stored {Count} holidays for year {Year}", stored, year);
                }
                else
                {
                    _logger.LogWarning("No holidays returned for year {Year}", year);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching holidays for year {Year}", year);
                throw;
            }

            return stored;
        }

        public async Task<int> FetchAndStoreCurrentAndNextYearHolidaysAsync(CancellationToken cancellationToken = default)
        {
            var currentYear = DateTime.UtcNow.Year;
            var total = 0;

            total += await FetchAndStoreHolidaysAsync(currentYear, cancellationToken);
            total += await FetchAndStoreHolidaysAsync(currentYear + 1, cancellationToken);

            return total;
        }

        public async Task<decimal?> GetLatestOficialRateAsync()
        {
            var cotizacion = await _cotizacionRepository.GetLatestByTipo("oficial");
            return cotizacion?.Venta;
        }

        public async Task<CotizacionDolar?> GetLatestOficialCotizacionAsync()
        {
            return await _cotizacionRepository.GetLatestByTipo("oficial");
        }
    }
}
