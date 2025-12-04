using Domain.Entities;

namespace Application.Services.Interfaces
{
    public interface IExchangeRateService
    {
        /// <summary>
        /// Obtiene y almacena las cotizaciones de dólar desde la API externa
        /// </summary>
        Task<int> FetchAndStoreDollarRatesAsync(CancellationToken cancellationToken = default);

        /// <summary>
        /// Obtiene y almacena los feriados de un año específico desde la API externa
        /// </summary>
        Task<int> FetchAndStoreHolidaysAsync(int year, CancellationToken cancellationToken = default);

        /// <summary>
        /// Obtiene y almacena los feriados del año actual y siguiente
        /// </summary>
        Task<int> FetchAndStoreCurrentAndNextYearHolidaysAsync(CancellationToken cancellationToken = default);

        /// <summary>
        /// Obtiene la última cotización del dólar oficial (venta)
        /// </summary>
        Task<decimal?> GetLatestOficialRateAsync();

        /// <summary>
        /// Obtiene la información completa de la última cotización oficial
        /// </summary>
        Task<CotizacionDolar?> GetLatestOficialCotizacionAsync();
    }
}
