using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Domain.Common.Enums;

namespace Application.Schemas.Users
{
    public class UserForResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Email { get; set; } = null!;
        public bool IsSuperAdmin { get; set; }
        public GroceryRole? Role { get; set; }
        public bool IsActive { get; set; }
    }
}
