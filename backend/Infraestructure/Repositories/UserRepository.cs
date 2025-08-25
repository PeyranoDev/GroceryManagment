using Domain.Entities;
using Domain.Repositories;
using Domain.Tenancy;
using Microsoft.EntityFrameworkCore;

namespace Infraestructure.Repositories
{
    public class UserRepository : BaseRepository<User>, IUserRepository
    {
        public UserRepository(GroceryManagmentContext ctx, ITenantProvider tenant)
            : base(ctx, tenant) { }

        public Task<User?> GetByEmail(string email)
            => _ctx.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Email == email)!;

        public Task<bool> ExistsByEmail(string email)
            => _ctx.Users.AsNoTracking().AnyAsync(u => u.Email == email);

        public async Task<bool> IsSuperAdmin(int userId)
        {
            var u = await _ctx.Users.AsNoTracking().FirstOrDefaultAsync(x => x.Id == userId);
            return u?.IsSuperAdmin == true;
        }

        public async Task SetSuperAdmin(int userId, bool isSuperAdmin)
        {
            var u = await _ctx.Users.FirstOrDefaultAsync(x => x.Id == userId);
            if (u == null) return;
            u.IsSuperAdmin = isSuperAdmin;
            await _ctx.SaveChangesAsync();
        }
    }
}