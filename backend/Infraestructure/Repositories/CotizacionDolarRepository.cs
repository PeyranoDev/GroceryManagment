using Domain.Entities;
using Domain.Repositories;
using Domain.Tenancy;
using Microsoft.EntityFrameworkCore;

namespace Infraestructure.Repositories
{
    public class CotizacionDolarRepository : BaseRepository<CotizacionDolar>, ICotizacionDolarRepository
    {
        public CotizacionDolarRepository(GroceryManagmentContext ctx, ITenantProvider tenant)
            : base(ctx, tenant)
        {
        }

        public async Task<CotizacionDolar?> GetLatestByTipo(string tipoCambio)
        {
            return await _ctx.CotizacionesDolar
                .AsNoTracking()
                .Where(c => c.TipoCambio == tipoCambio)
                .OrderByDescending(c => c.FechaActualizacion)
                .FirstOrDefaultAsync();
        }

        public async Task<IReadOnlyList<CotizacionDolar>> GetByTipo(string tipoCambio)
        {
            return await _ctx.CotizacionesDolar
                .AsNoTracking()
                .Where(c => c.TipoCambio == tipoCambio)
                .OrderByDescending(c => c.FechaActualizacion)
                .ToListAsync();
        }

        public async Task<IReadOnlyList<CotizacionDolar>> GetByFecha(DateTime fecha)
        {
            var fechaInicio = fecha.Date;
            var fechaFin = fechaInicio.AddDays(1);

            return await _ctx.CotizacionesDolar
                .AsNoTracking()
                .Where(c => c.FechaActualizacion >= fechaInicio && c.FechaActualizacion < fechaFin)
                .OrderByDescending(c => c.FechaActualizacion)
                .ToListAsync();
        }

        public async Task<IReadOnlyList<CotizacionDolar>> GetLatestAll()
        {
            // Obtiene la última cotización de cada tipo de cambio
            return await _ctx.CotizacionesDolar
                .AsNoTracking()
                .GroupBy(c => c.TipoCambio)
                .Select(g => g.OrderByDescending(c => c.FechaActualizacion).First())
                .ToListAsync();
        }

        public async Task<bool> ExistsByTipoAndFecha(string tipoCambio, DateTime fecha)
        {
            var fechaInicio = fecha.Date;
            var fechaFin = fechaInicio.AddDays(1);

            return await _ctx.CotizacionesDolar
                .AnyAsync(c => c.TipoCambio == tipoCambio 
                    && c.FechaActualizacion >= fechaInicio 
                    && c.FechaActualizacion < fechaFin);
        }
    }
}
