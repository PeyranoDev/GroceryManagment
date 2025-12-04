using Domain.Entities;

namespace Domain.Repositories
{
    public interface IFeriadoRepository : IBaseRepository<FeriadoArgentino>
    {
        /// <summary>
        /// Obtiene todos los feriados de un año específico
        /// </summary>
        Task<IReadOnlyList<FeriadoArgentino>> GetByAnio(int anio);

        /// <summary>
        /// Verifica si una fecha específica es feriado
        /// </summary>
        Task<bool> EsFeriado(DateOnly fecha);

        /// <summary>
        /// Verifica si ya existen feriados cargados para un año
        /// </summary>
        Task<bool> ExistenFeriadosDelAnio(int anio);

        /// <summary>
        /// Obtiene el próximo feriado desde una fecha dada
        /// </summary>
        Task<FeriadoArgentino?> GetProximoFeriado(DateOnly desde);

        /// <summary>
        /// Elimina todos los feriados de un año específico (para recargar)
        /// </summary>
        Task DeleteByAnio(int anio);
    }
}
