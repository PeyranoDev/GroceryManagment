using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class User : IEntity
    {
        public int Id { get; set; }
        public string Name { get; set; } = default!;
        public string Email { get; set; } = default!;
        public string PasswordHash { get; set; } = default!;

        public bool IsSuperAdmin { get; set; }

        public ICollection<UserGrocery> Memberships { get; set; } = new List<UserGrocery>();
    }
}
