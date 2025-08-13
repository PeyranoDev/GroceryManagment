using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infraestructure
{
    public class GroceryManagmentContext : DbContext
    {
        public GroceryManagmentContext(DbContextOptions<GroceryManagmentContext> options)
            : base(options)
        {
        }
        public DbSet<User> Users { get; set; }
    }
}
