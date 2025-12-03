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

        public override Task<User?> GetById(int id)
            => _ctx.Users
                .AsNoTracking()
                .Include(u => u.Grocery)
                .FirstOrDefaultAsync(u => u.Id == id);

        public Task<User?> GetByEmail(string email)
            => _ctx.Users
                .AsNoTracking()
                .Include(u => u.Grocery)
                .FirstOrDefaultAsync(u => u.Email == email && u.IsActive)!;

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

        public async Task<IReadOnlyList<User>> GetByGroceryId(int groceryId)
            => await _ctx.Users
                .AsNoTracking()
                .Include(u => u.Grocery)
                .Where(u => u.GroceryId == groceryId && u.IsActive)
                .ToListAsync();

        public async Task<IReadOnlyList<User>> GetAll()
            => await _ctx.Users
                .AsNoTracking()
                .Include(u => u.Grocery)
                .Where(u => u.IsActive)
                .ToListAsync();

        public async Task<IReadOnlyList<User>> GetByGroceryIdAll(int groceryId)
            => await _ctx.Users
                .AsNoTracking()
                .Include(u => u.Grocery)
                .Where(u => u.GroceryId == groceryId)
                .ToListAsync();

        public async Task Activate(int userId)
        {
            var u = await _ctx.Users.FirstOrDefaultAsync(x => x.Id == userId);
            if (u == null) return;
            u.IsActive = true;
            await _ctx.SaveChangesAsync();
        }

        public async Task SetRole(int userId, Domain.Common.Enums.GroceryRole role)
        {
            var u = await _ctx.Users.FirstOrDefaultAsync(x => x.Id == userId);
            if (u == null) return;
            u.Role = role;
            await _ctx.SaveChangesAsync();
        }
    }
}
