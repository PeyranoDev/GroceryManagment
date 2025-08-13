using Domain.Common.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class UserGrocery
    {
        public int UserId { get; set; }
        public int GroceryId { get; set; }
        public GroceryRole Role { get; set; }

        public User User { get; set; } = default!;
        public Grocery Grocery { get; set; } = default!;
    }
}
