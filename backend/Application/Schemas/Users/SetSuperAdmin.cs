using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Domain.Common.Enums;

namespace Application.Schemas.Users
{
    public class SetSuperAdminDto
    {
        public bool IsSuperAdmin { get; set; }
        
        public GroceryRole GetRole() => IsSuperAdmin ? GroceryRole.SuperAdmin : GroceryRole.Staff;
    }
}