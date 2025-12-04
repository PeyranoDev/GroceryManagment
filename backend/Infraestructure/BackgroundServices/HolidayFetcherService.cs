using Application.Schemas.ExternalApis;
using Domain.Entities;
using Domain.Repositories;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System.Globalization;
using System.Net.Http.Json;

namespace Infraestructure.BackgroundServices
{
    /// <summary>
    /// Background service that fetches Argentine holidays from api.argentinadatos.com
    /// Executes on the 1st of each month to fetch/refresh holiday data for the current and next year
    /// </summary>
    public class HolidayFetcherService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ILogger<HolidayFetcherService> _logger;

        public HolidayFetcherService(
            IServiceScopeFactory scopeFactory,
            IHttpClientFactory httpClientFactory,
            ILogger<HolidayFetcherService> logger)
        {
            _scopeFactory = scopeFactory;
            _httpClientFactory = httpClientFactory;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("HolidayFetcherService started");

            // Initial fetch on startup
            await FetchAndStoreHolidays(stoppingToken);

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    var nextExecution = GetNextFirstOfMonth();
                    var delay = nextExecution - DateTime.UtcNow;

                    if (delay > TimeSpan.Zero)
                    {
                        _logger.LogInformation(
                            "Next holiday fetch scheduled for {NextExecution}",
                            nextExecution);

                        await Task.Delay(delay, stoppingToken);
                    }

                    if (!stoppingToken.IsCancellationRequested)
                    {
                        await FetchAndStoreHolidays(stoppingToken);
                    }
                }
                catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
                {
                    break;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error in HolidayFetcherService execution loop");
                    // Wait 1 hour before retrying after an error
                    await Task.Delay(TimeSpan.FromHours(1), stoppingToken);
                }
            }

            _logger.LogInformation("HolidayFetcherService stopped");
        }

        private static DateTime GetNextFirstOfMonth()
        {
            var now = DateTime.UtcNow;
            var nextMonth = now.Day == 1 
                ? now.AddMonths(1) 
                : new DateTime(now.Year, now.Month, 1).AddMonths(1);
            
            // Execute at 00:00 UTC on the 1st of next month
            return new DateTime(nextMonth.Year, nextMonth.Month, 1, 0, 0, 0, DateTimeKind.Utc);
        }

        private async Task FetchAndStoreHolidays(CancellationToken cancellationToken)
        {
            _logger.LogInformation("Starting holiday fetch");

            var currentYear = DateTime.UtcNow.Year;
            var yearsToFetch = new[] { currentYear, currentYear + 1 };

            using var scope = _scopeFactory.CreateScope();
            var feriadoRepository = scope.ServiceProvider.GetRequiredService<IFeriadoRepository>();
            var httpClient = _httpClientFactory.CreateClient("ArgentinaDataApi");

            foreach (var year in yearsToFetch)
            {
                try
                {
                    // Check if we already have holidays for this year
                    if (await feriadoRepository.ExistenFeriadosDelAnio(year))
                    {
                        _logger.LogInformation("Holidays for year {Year} already exist, refreshing...", year);
                        await feriadoRepository.DeleteByAnio(year);
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

                                await feriadoRepository.Create(feriado);
                            }
                            else
                            {
                                _logger.LogWarning("Could not parse date {Fecha} for holiday {Nombre}", 
                                    holiday.Fecha, holiday.Nombre);
                            }
                        }

                        _logger.LogInformation("Stored {Count} holidays for year {Year}", holidays.Count, year);
                    }
                    else
                    {
                        _logger.LogWarning("No holidays returned for year {Year}", year);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error fetching holidays for year {Year}", year);
                }
            }

            _logger.LogInformation("Holiday fetch completed");
        }
    }
}
