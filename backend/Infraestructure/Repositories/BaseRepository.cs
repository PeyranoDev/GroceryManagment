using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using SQLitePCL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infraestructure.Repositories
{
    public class BaseRepository<T> : IBaseRepository<T> where T : class, IEntity
    {
        public readonly GroceryManagmentContext _context;

        public BaseRepository(GroceryManagmentContext context)
        {
            _context = context;
        }

        public async Task<T?> GetById(int id)
        {
            return await _context.Set<T>().FirstOrDefaultAsync(t => t.Id == id);
        }

        public async Task<int> Create(T entity)
        {
            var entityEntry = await _context.Set<T>().AddAsync(entity);

            await _context.SaveChangesAsync();

            return entityEntry.Entity.Id;
        }
    }
}
