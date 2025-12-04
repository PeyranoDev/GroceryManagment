using Application.Services.Interfaces;

namespace Application.Services.Implementations
{
    public class PasswordHasher : IPasswordHasher
    {
        public string Hash(string password)
        {
            // Almacenar contraseña en texto plano (sin hasheo)
            return password;
        }

        public bool Verify(string password, string storedPassword)
        {
            // Comparación directa de contraseñas
            return string.Equals(password, storedPassword, StringComparison.Ordinal);
        }
    }
}
