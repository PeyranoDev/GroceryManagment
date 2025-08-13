using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Infraestructure.Tenancy;

namespace Infraestructure
{
    public class GroceryManagmentContext : DbContext
    {
        private readonly ITenantProvider _tenant;

        public GroceryManagmentContext(DbContextOptions<GroceryManagmentContext> options, ITenantProvider tenant)
            : base(options)
        {
            _tenant = tenant;
        }

        public DbSet<User> Users => Set<User>();
        public DbSet<Grocery> Groceries => Set<Grocery>();
        public DbSet<UserGrocery> UserGroceries => Set<UserGrocery>();
        public DbSet<Product> Products => Set<Product>();
        public DbSet<InventoryItem> Inventory => Set<InventoryItem>();
        public DbSet<WeeklySale> WeeklySales => Set<WeeklySale>();
        public DbSet<RecentActivity> RecentActivities => Set<RecentActivity>();
        public DbSet<Sale> Sales => Set<Sale>();
        public DbSet<SaleItem> SaleItems => Set<SaleItem>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // --- Configuración de Owned Types ---
            modelBuilder.Entity<Product>().OwnsOne(p => p.Promotion);
            modelBuilder.Entity<InventoryItem>().OwnsOne(i => i.Promotion);

            // --- Índices únicos por Grocery ---
            modelBuilder.Entity<Product>()
                .HasIndex(p => new { p.GroceryId, p.Name })
                .IsUnique();

            // --- Relaciones ---
            modelBuilder.Entity<UserGrocery>()
                .HasKey(ug => new { ug.UserId, ug.GroceryId });

            modelBuilder.Entity<UserGrocery>()
                .HasOne(ug => ug.User)
                .WithMany(u => u.UserGroceries)
                .HasForeignKey(ug => ug.UserId);

            modelBuilder.Entity<UserGrocery>()
                .HasOne(ug => ug.Grocery)
                .WithMany(g => g.UserGroceries)
                .HasForeignKey(ug => ug.GroceryId);

            modelBuilder.Entity<SaleItem>()
                .HasOne(si => si.Product)
                .WithMany()
                .HasForeignKey(si => si.ProductId);

            modelBuilder.Entity<SaleItem>()
                .HasOne(si => si.Sale)
                .WithMany(s => s.Items)
                .HasForeignKey(si => si.SaleId);

            modelBuilder.Entity<Product>().HasQueryFilter(e => e.GroceryId == _tenant.CurrentGroceryId);
            modelBuilder.Entity<InventoryItem>().HasQueryFilter(e => e.GroceryId == _tenant.CurrentGroceryId);
            modelBuilder.Entity<WeeklySale>().HasQueryFilter(e => e.GroceryId == _tenant.CurrentGroceryId);
            modelBuilder.Entity<RecentActivity>().HasQueryFilter(e => e.GroceryId == _tenant.CurrentGroceryId);
            modelBuilder.Entity<Sale>().HasQueryFilter(e => e.GroceryId == _tenant.CurrentGroceryId);
            modelBuilder.Entity<SaleItem>().HasQueryFilter(e => e.GroceryId == _tenant.CurrentGroceryId);
        }
    }
}
