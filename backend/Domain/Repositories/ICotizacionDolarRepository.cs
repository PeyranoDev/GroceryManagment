using Domain.Entities;

namespace Domain.Repositories
{
    public interface ICotizacionDolarRepository : IBaseRepository<CotizacionDolar>
    {
        /// <summary>
        /// Obtiene la última cotización registrada para un tipo de cambio específico
        /// </summary>
        Task<CotizacionDolar?> GetLatestByTipo(string tipoCambio);

        /// <summary>
        /// Obtiene todas las cotizaciones de un tipo específico
        /// </summary>
        Task<IReadOnlyList<CotizacionDolar>> GetByTipo(string tipoCambio);

        /// <summary>
        /// Obtiene las cotizaciones de una fecha específica
        /// </summary>
        Task<IReadOnlyList<CotizacionDolar>> GetByFecha(DateTime fecha);

        /// <summary>
        /// Obtiene las últimas cotizaciones de todos los tipos de cambio
        /// </summary>
        Task<IReadOnlyList<CotizacionDolar>> GetLatestAll();

        /// <summary>
        /// Verifica si existe una cotización para un tipo y fecha específicos
        /// </summary>
        Task<bool> ExistsByTipoAndFecha(string tipoCambio, DateTime fecha);
    }
}
