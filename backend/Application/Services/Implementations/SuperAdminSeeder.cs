using Application.Services.Interfaces;
using Domain.Common.Enums;
using Domain.Entities;
using Domain.Repositories;
using Microsoft.Extensions.Logging;

namespace Application.Services.Implementations
{
    public class SuperAdminSeeder
    {
        private readonly IUserRepository _userRepository;
        private readonly IPasswordHasher _passwordHasher;
        private readonly ILogger<SuperAdminSeeder> _logger;

        public SuperAdminSeeder(
            IUserRepository userRepository,
            IPasswordHasher passwordHasher,
            ILogger<SuperAdminSeeder> logger)
        {
            _userRepository = userRepository;
            _passwordHasher = passwordHasher;
            _logger = logger;
        }

        /// <summary>
        /// Crea el SuperAdmin inicial si no existe ninguno en la base de datos
        /// </summary>
        public async Task SeedSuperAdminAsync(string email, string password, string name = "Super Admin")
        {
            try
            {
                // Verificar si ya existe un SuperAdmin
                var existingSuperAdmin = await _userRepository.GetByEmail(email);
                if (existingSuperAdmin != null)
                {
                    _logger.LogInformation("SuperAdmin con email {Email} ya existe. Saltando seed.", email);
                    return;
                }

                // Crear el SuperAdmin
                var superAdmin = new User
                {
                    Name = name,
                    Email = email,
                    PasswordHash = _passwordHasher.Hash(password),
                    IsActive = true,
                    Role = GroceryRole.SuperAdmin,
                    GroceryId = null // SuperAdmin no pertenece a una grocery específica
                };

                await _userRepository.Create(superAdmin);
                await _userRepository.SaveChanges();

                _logger.LogInformation("SuperAdmin creado exitosamente con email: {Email}", email);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al crear SuperAdmin");
                throw;
            }
        }
    }
}
