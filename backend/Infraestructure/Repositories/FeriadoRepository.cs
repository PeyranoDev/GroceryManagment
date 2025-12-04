using Domain.Entities;
using Domain.Repositories;
using Domain.Tenancy;
using Microsoft.EntityFrameworkCore;

namespace Infraestructure.Repositories
{
    public class FeriadoRepository : BaseRepository<FeriadoArgentino>, IFeriadoRepository
    {
        public FeriadoRepository(GroceryManagmentContext ctx, ITenantProvider tenant)
            : base(ctx, tenant)
        {
        }

        public async Task<IReadOnlyList<FeriadoArgentino>> GetByAnio(int anio)
        {
            return await _ctx.FeriadosArgentinos
                .AsNoTracking()
                .Where(f => f.Anio == anio)
                .OrderBy(f => f.Fecha)
                .ToListAsync();
        }

        public async Task<bool> EsFeriado(DateOnly fecha)
        {
            return await _ctx.FeriadosArgentinos
                .AnyAsync(f => f.Fecha == fecha);
        }

        public async Task<bool> ExistenFeriadosDelAnio(int anio)
        {
            return await _ctx.FeriadosArgentinos
                .AnyAsync(f => f.Anio == anio);
        }

        public async Task<FeriadoArgentino?> GetProximoFeriado(DateOnly desde)
        {
            return await _ctx.FeriadosArgentinos
                .AsNoTracking()
                .Where(f => f.Fecha >= desde)
                .OrderBy(f => f.Fecha)
                .FirstOrDefaultAsync();
        }

        public async Task DeleteByAnio(int anio)
        {
            var feriados = await _ctx.FeriadosArgentinos
                .Where(f => f.Anio == anio)
                .ToListAsync();

            if (feriados.Any())
            {
                _ctx.FeriadosArgentinos.RemoveRange(feriados);
                await _ctx.SaveChangesAsync();
            }
        }
    }
}
