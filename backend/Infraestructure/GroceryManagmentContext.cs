using Domain.Entities;
using Domain.Tenancy;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;

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

        public DbSet<User> Users { get; set; }
        public DbSet<Grocery> Groceries { get; set; }
        public DbSet<UserGrocery> UserGroceries { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<InventoryItem> InventoryItems { get; set; }
        public DbSet<WeeklySale> WeeklySales { get; set; }
        public DbSet<RecentActivity> RecentActivities { get; set; }
        public DbSet<Sale> Sales { get; set; }
        public DbSet<SaleItem> SaleItems { get; set; }
        public DbSet<Purchase> Purchases { get; set; }
        public DbSet<PurchaseItem> PurchaseItems { get; set; }

        protected override void OnModelCreating(ModelBuilder mb)
        {
            base.OnModelCreating(mb);

            mb.Entity<User>()
                .Property(u => u.PasswordHash)
                .HasMaxLength(100)
                .IsRequired();

            mb.Entity<UserGrocery>(b =>
            {
                b.HasKey(x => x.Id);
                b.HasIndex(x => new { x.UserId, x.GroceryId }).IsUnique();

                b.HasOne(x => x.User)
                 .WithMany(u => u.UserGroceries)
                 .HasForeignKey(x => x.UserId)
                 .OnDelete(DeleteBehavior.Cascade);

                b.HasOne(x => x.Grocery)
                 .WithMany(g => g.UserGroceries)
                 .HasForeignKey(x => x.GroceryId)
                 .OnDelete(DeleteBehavior.Cascade);
            });

            mb.Entity<Grocery>(b =>
            {
                b.Property(g => g.Name).IsRequired().HasMaxLength(200);
            });

            mb.Entity<Category>(b =>
            {
                b.Property(c => c.Name).IsRequired().HasMaxLength(100);
                b.Property(c => c.Icon).HasMaxLength(10);
                b.HasIndex(c => new { c.GroceryId, c.Name }).IsUnique();
            });

            mb.Entity<Product>(b =>
            {
                b.Property(p => p.Name).IsRequired().HasMaxLength(200);
                b.Property(p => p.Unit).IsRequired().HasMaxLength(50);
                b.Property(p => p.Emoji).HasMaxLength(10);
                b.Property(p => p.UnitPrice).HasColumnType("decimal(18,2)");
                b.Property(p => p.SalePrice).HasColumnType("decimal(18,2)");
                
                b.HasIndex(p => new { p.GroceryId, p.Name }).IsUnique();
                
                b.HasOne(p => p.Category)
                 .WithMany(c => c.Products)
                 .HasForeignKey(p => p.CategoryId)
                 .OnDelete(DeleteBehavior.Restrict);

                b.OwnsOne(p => p.Promotion, promo =>
                {
                    promo.Property(pr => pr.DiscountPercent).HasColumnType("decimal(5,2)");
                    promo.Property(pr => pr.DiscountAmount).HasColumnType("decimal(18,2)");
                    promo.Property(pr => pr.PromotionPrice).HasColumnType("decimal(18,2)");
                });
            });

            mb.Entity<InventoryItem>(b =>
            {
                b.HasOne(i => i.Product)
                 .WithMany(p => p.InventoryItems)
                 .HasForeignKey(i => i.ProductId)
                 .OnDelete(DeleteBehavior.Cascade);

                b.OwnsOne(i => i.Promotion, promo =>
                {
                    promo.Property(pr => pr.DiscountPercent).HasColumnType("decimal(5,2)");
                    promo.Property(pr => pr.DiscountAmount).HasColumnType("decimal(18,2)");
                    promo.Property(pr => pr.PromotionPrice).HasColumnType("decimal(18,2)");
                });
            });

            mb.Entity<Purchase>(b =>
            {
                b.Property(p => p.Supplier).IsRequired().HasMaxLength(200);
                b.Property(p => p.Total).HasColumnType("decimal(18,2)");
                b.Property(p => p.Notes).HasMaxLength(1000);
                
                b.HasMany(p => p.Items)
                 .WithOne(pi => pi.Purchase)
                 .HasForeignKey(pi => pi.PurchaseId)
                 .OnDelete(DeleteBehavior.Cascade);
            });

            mb.Entity<PurchaseItem>(b =>
            {
                b.Property(pi => pi.UnitCost).HasColumnType("decimal(18,2)");
                b.Property(pi => pi.TotalCost).HasColumnType("decimal(18,2)");
                
                b.HasOne(pi => pi.Product)
                 .WithMany()
                 .HasForeignKey(pi => pi.ProductId)
                 .OnDelete(DeleteBehavior.Restrict);
            });

            mb.Entity<Sale>(b =>
            {
                b.Property(s => s.Total).HasColumnType("decimal(18,2)");
                
                b.HasOne(s => s.User)
                 .WithMany()
                 .HasForeignKey(s => s.UserId)
                 .OnDelete(DeleteBehavior.Restrict);

                b.HasMany(s => s.Items)
                 .WithOne(si => si.Sale)
                 .HasForeignKey(si => si.SaleId)
                 .OnDelete(DeleteBehavior.Cascade);
            });

            mb.Entity<SaleItem>(b =>
            {
                b.Property(si => si.Price).HasColumnType("decimal(18,2)");
                
                b.HasOne(si => si.Product)
                 .WithMany()
                 .HasForeignKey(si => si.ProductId)
                 .OnDelete(DeleteBehavior.Restrict);
            });

            mb.Entity<RecentActivity>(b =>
            {
                b.Property(ra => ra.Action).IsRequired().HasMaxLength(500);
            });

            mb.Entity<Category>().HasQueryFilter(e => e.GroceryId == _tenant.CurrentGroceryId);
            mb.Entity<Product>().HasQueryFilter(e => e.GroceryId == _tenant.CurrentGroceryId);
            mb.Entity<InventoryItem>().HasQueryFilter(e => e.GroceryId == _tenant.CurrentGroceryId);
            mb.Entity<Sale>().HasQueryFilter(e => e.GroceryId == _tenant.CurrentGroceryId);
            mb.Entity<SaleItem>().HasQueryFilter(e => e.GroceryId == _tenant.CurrentGroceryId);
            mb.Entity<WeeklySale>().HasQueryFilter(e => e.GroceryId == _tenant.CurrentGroceryId);
            mb.Entity<RecentActivity>().HasQueryFilter(e => e.GroceryId == _tenant.CurrentGroceryId);
            mb.Entity<Purchase>().HasQueryFilter(e => e.GroceryId == _tenant.CurrentGroceryId);
            mb.Entity<PurchaseItem>().HasQueryFilter(e => e.GroceryId == _tenant.CurrentGroceryId);
        }
    }
}
