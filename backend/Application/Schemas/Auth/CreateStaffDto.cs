using System.ComponentModel.DataAnnotations;

namespace Application.Schemas.Auth
{
    public class CreateStaffDto
    {
        [Required(ErrorMessage = "El nombre es requerido")]
        [MinLength(2, ErrorMessage = "El nombre debe tener al menos 2 caracteres")]
        [MaxLength(120, ErrorMessage = "El nombre no puede exceder 120 caracteres")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "El email es requerido")]
        [EmailAddress(ErrorMessage = "El formato del email no es válido")]
        [MaxLength(200, ErrorMessage = "El email no puede exceder 200 caracteres")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "La contraseña es requerida")]
        [MinLength(6, ErrorMessage = "La contraseña debe tener al menos 6 caracteres")]
        [MaxLength(200, ErrorMessage = "La contraseña no puede exceder 200 caracteres")]
        public string Password { get; set; } = string.Empty;

        [Required(ErrorMessage = "La confirmación de contraseña es requerida")]
        [Compare("Password", ErrorMessage = "Las contraseñas no coinciden")]
        public string ConfirmPassword { get; set; } = string.Empty;
    }
}
