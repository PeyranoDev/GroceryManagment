using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class WeeklySale : IEntity, IHasGrocery
    {
        public int Id { get; set; }
        public string Day { get; set; } = default!;
        public int Sales { get; set; }

        public int GroceryId { get; set; }
    }
}
