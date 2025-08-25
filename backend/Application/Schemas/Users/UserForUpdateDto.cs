using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Schemas.Users
{
    public class UserForUpdateDto
    {
        [Required, MaxLength(120)]
        public string Name { get; set; } = null!;

        [Required, EmailAddress, MaxLength(200)]
        public string Email { get; set; } = null!;

        [MinLength(6), MaxLength(200)]
        public string? NewPassword { get; set; }
    }
}
