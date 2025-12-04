using Application.Schemas.ExternalApis;
using Domain.Entities;
using Domain.Repositories;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System.Net.Http.Json;

namespace Infraestructure.BackgroundServices
{
    /// <summary>
    /// Background service that fetches dollar exchange rates from dolarapi.com
    /// Executes on weekdays (excluding Argentine holidays) at 10:30, 13:00, and 16:30 Argentina time (UTC-3)
    /// </summary>
    public class DollarRateFetcherService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ILogger<DollarRateFetcherService> _logger;
        
        // Argentina timezone (UTC-3)
        private static readonly TimeSpan ArgentinaOffset = TimeSpan.FromHours(-3);
        
        // Scheduled times in Argentina time
        private static readonly TimeOnly[] ScheduledTimes = new[]
        {
            new TimeOnly(10, 30), // 10:30 AM
            new TimeOnly(13, 0),  // 1:00 PM
            new TimeOnly(16, 30)  // 4:30 PM
        };

        // Dollar types to fetch
        private static readonly string[] DollarTypes = new[] { "oficial", "blue" };

        public DollarRateFetcherService(
            IServiceScopeFactory scopeFactory,
            IHttpClientFactory httpClientFactory,
            ILogger<DollarRateFetcherService> logger)
        {
            _scopeFactory = scopeFactory;
            _httpClientFactory = httpClientFactory;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("DollarRateFetcherService started");

            // Initial fetch on startup
            await FetchAndStoreDollarRates(stoppingToken);

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    var nextExecution = await GetNextExecutionTime(stoppingToken);
                    var delay = nextExecution - DateTime.UtcNow;

                    if (delay > TimeSpan.Zero)
                    {
                        _logger.LogInformation(
                            "Next dollar rate fetch scheduled for {NextExecution} (Argentina time: {ArgentinaTime})",
                            nextExecution,
                            nextExecution.Add(ArgentinaOffset));

                        await Task.Delay(delay, stoppingToken);
                    }

                    if (!stoppingToken.IsCancellationRequested)
                    {
                        await FetchAndStoreDollarRates(stoppingToken);
                    }
                }
                catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
                {
                    break;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error in DollarRateFetcherService execution loop");
                    // Wait 5 minutes before retrying after an error
                    await Task.Delay(TimeSpan.FromMinutes(5), stoppingToken);
                }
            }

            _logger.LogInformation("DollarRateFetcherService stopped");
        }

        private async Task<DateTime> GetNextExecutionTime(CancellationToken cancellationToken)
        {
            var nowUtc = DateTime.UtcNow;
            var nowArgentina = nowUtc.Add(ArgentinaOffset);
            var currentTime = TimeOnly.FromDateTime(nowArgentina);
            var currentDate = DateOnly.FromDateTime(nowArgentina);

            // Find next scheduled time today
            foreach (var scheduledTime in ScheduledTimes.OrderBy(t => t))
            {
                if (scheduledTime > currentTime)
                {
                    // Check if today is a valid business day
                    if (await IsBusinessDay(currentDate, cancellationToken))
                    {
                        var targetArgentina = currentDate.ToDateTime(scheduledTime);
                        return targetArgentina.Add(-ArgentinaOffset); // Convert to UTC
                    }
                }
            }

            // No more times today, find next business day
            var nextDate = currentDate.AddDays(1);
            while (!await IsBusinessDay(nextDate, cancellationToken))
            {
                nextDate = nextDate.AddDays(1);
                // Safety: don't look more than 30 days ahead
                if (nextDate > currentDate.AddDays(30))
                {
                    _logger.LogWarning("Could not find next business day within 30 days");
                    nextDate = currentDate.AddDays(1);
                    break;
                }
            }

            var nextTargetArgentina = nextDate.ToDateTime(ScheduledTimes[0]);
            return nextTargetArgentina.Add(-ArgentinaOffset); // Convert to UTC
        }

        private async Task<bool> IsBusinessDay(DateOnly date, CancellationToken cancellationToken)
        {
            // Weekend check
            var dayOfWeek = date.DayOfWeek;
            if (dayOfWeek == DayOfWeek.Saturday || dayOfWeek == DayOfWeek.Sunday)
            {
                return false;
            }

            // Holiday check
            using var scope = _scopeFactory.CreateScope();
            var feriadoRepository = scope.ServiceProvider.GetRequiredService<IFeriadoRepository>();
            
            return !await feriadoRepository.EsFeriado(date);
        }

        private async Task FetchAndStoreDollarRates(CancellationToken cancellationToken)
        {
            _logger.LogInformation("Starting dollar rate fetch");

            using var scope = _scopeFactory.CreateScope();
            var cotizacionRepository = scope.ServiceProvider.GetRequiredService<ICotizacionDolarRepository>();
            var httpClient = _httpClientFactory.CreateClient("DolarApi");

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

                        await cotizacionRepository.Create(cotizacion);
                        
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

            _logger.LogInformation("Dollar rate fetch completed");
        }
    }
}
