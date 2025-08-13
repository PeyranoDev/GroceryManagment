using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class InventoryItem : IEntity, IHasGrocery
    {
        public int Id { get; set; }
        public string Name { get; set; } = default!;
        public decimal Stock { get; set; }
        public string Unit { get; set; } = default!;
        public DateTime LastUpdated { get; set; }
        public decimal SalePrice { get; set; }
        public Promotion? Promotion { get; set; }   
        public int GroceryId { get; set; }
    }
}
