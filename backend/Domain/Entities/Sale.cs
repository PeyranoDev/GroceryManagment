using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Sale : IEntity, IHasGrocery
    {
        public int Id { get; set; }
        public DateTime Date { get; set; } = DateTime.UtcNow;
        public List<SaleItem> Items { get; set; } = new();
        public decimal Total { get; set; }

        public int GroceryId { get; set; }
    }

    public class SaleItem : IEntity, IHasGrocery
    {
        public int Id { get; set; }

        public int SaleId { get; set; }
        public Sale Sale { get; set; } = default!;

        public int ProductId { get; set; }
        public Product Product { get; set; } = default!;

        public decimal Quantity { get; set; }
        public decimal UnitPrice { get; set; }   

        public int GroceryId { get; set; }
    }
}