using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class RecentActivity : IEntity, IHasGrocery
    {
        public int Id { get; set; }
        public string Type { get; set; } = default!;
        public string Description { get; set; } = default!;
        public string Time { get; set; } = default!;   
        public string User { get; set; } = default!;

        public int GroceryId { get; set; }
    }
}
