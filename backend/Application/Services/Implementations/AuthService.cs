using Application.Schemas.Auth;
using Application.Services.Interfaces;
using AutoMapper;
using Domain.Common.Enums;
using Domain.Entities;
using Domain.Exceptions;
using Domain.Repositories;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Application.Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IGroceryRepository _groceryRepository;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;

        public AuthService(
            IUserRepository userRepository,
            IGroceryRepository groceryRepository,
            IPasswordHasher passwordHasher,
            IMapper mapper,
            IConfiguration configuration)
        {
            _userRepository = userRepository;
            _groceryRepository = groceryRepository;
            _passwordHasher = passwordHasher;
            _mapper = mapper;
            _configuration = configuration;
        }

        public async Task<AuthResponseDto> Login(LoginDto loginDto)
        {
            var user = await _userRepository.GetByEmail(loginDto.Email);
            if (user == null)
                throw new UnauthorizedException("Credenciales inválidas");

            if (!_passwordHasher.Verify(loginDto.Password, user.PasswordHash))
                throw new UnauthorizedException("Credenciales inválidas");

            var token = GenerateJwtToken(user);
            var response = _mapper.Map<AuthResponseDto>(user);
            response.Token = token.Token;
            response.Expiration = token.Expiration;

            return response;
        }

        public async Task<AuthResponseDto> Register(RegisterDto registerDto, int? currentUserId = null)
        {
            // Solo superadmins pueden registrar nuevos usuarios directamente
            if (currentUserId.HasValue)
            {
                var currentUser = await _userRepository.GetById(currentUserId.Value);
                if (currentUser == null || !currentUser.IsSuperAdmin)
                    throw new UnauthorizedException("Solo los superadministradores pueden registrar usuarios");
            }

            var existingUser = await _userRepository.GetByEmail(registerDto.Email);
            if (existingUser != null)
                throw new DuplicateException($"Ya existe un usuario con el email {registerDto.Email}");

            var user = _mapper.Map<User>(registerDto);
            user.PasswordHash = _passwordHasher.Hash(registerDto.Password);
            user.IsSuperAdmin = false; // Los usuarios registrados no son superadmins por defecto

            var userId = await _userRepository.Create(user);
            var createdUser = await _userRepository.GetById(userId);
            
            if (createdUser == null)
                throw new BusinessException("Error al crear el usuario");

            var token = GenerateJwtToken(createdUser);
            var response = _mapper.Map<AuthResponseDto>(createdUser);
            response.Token = token.Token;
            response.Expiration = token.Expiration;

            return response;
        }

        public async Task<AuthResponseDto> CreateEmployee(RegisterDto registerDto, int adminUserId, int groceryId)
        {
            // Verificar que el admin tiene permisos en el grocery
            var adminUserGrocery = await _userRepository.GetUserGroceryByUserAndGrocery(adminUserId, groceryId);
            if (adminUserGrocery == null || adminUserGrocery.Role != GroceryRole.Admin)
                throw new UnauthorizedException("Solo los administradores del grocery pueden crear empleados");

            var existingUser = await _userRepository.GetByEmail(registerDto.Email);
            if (existingUser != null)
                throw new DuplicateException($"Ya existe un usuario con el email {registerDto.Email}");

            // Verificar que el grocery existe
            var grocery = await _groceryRepository.GetById(groceryId);
            if (grocery == null)
                throw new NotFoundException($"No se encontró el grocery con ID {groceryId}");

            // Crear el usuario
            var user = _mapper.Map<User>(registerDto);
            user.PasswordHash = _passwordHasher.Hash(registerDto.Password);
            user.IsSuperAdmin = false;

            var userId = await _userRepository.Create(user);
            var createdUser = await _userRepository.GetById(userId);
            
            if (createdUser == null)
                throw new BusinessException("Error al crear el usuario");

            // Asignar el usuario al grocery como empleado (Staff)
            var userGrocery = new UserGrocery
            {
                UserId = userId,
                GroceryId = groceryId,
                Role = GroceryRole.Staff
            };

            await _userRepository.AddUserToGrocery(userGrocery);

            var token = GenerateJwtToken(createdUser);
            var response = _mapper.Map<AuthResponseDto>(createdUser);
            response.Token = token.Token;
            response.Expiration = token.Expiration;

            return response;
        }

        public async Task<AuthResponseDto> CreateAdminForGrocery(RegisterDto registerDto, int superAdminUserId, int groceryId)
        {
            // Verificar que el usuario actual es superadmin
            var superAdmin = await _userRepository.GetById(superAdminUserId);
            if (superAdmin == null || !superAdmin.IsSuperAdmin)
                throw new UnauthorizedException("Solo los superadministradores pueden crear administradores de grocery");

            var existingUser = await _userRepository.GetByEmail(registerDto.Email);
            if (existingUser != null)
                throw new DuplicateException($"Ya existe un usuario con el email {registerDto.Email}");

            // Verificar que el grocery existe
            var grocery = await _groceryRepository.GetById(groceryId);
            if (grocery == null)
                throw new NotFoundException($"No se encontró el grocery con ID {groceryId}");

            // Crear el usuario
            var user = _mapper.Map<User>(registerDto);
            user.PasswordHash = _passwordHasher.Hash(registerDto.Password);
            user.IsSuperAdmin = false;

            var userId = await _userRepository.Create(user);
            var createdUser = await _userRepository.GetById(userId);
            
            if (createdUser == null)
                throw new BusinessException("Error al crear el usuario");

            // Asignar el usuario al grocery como administrador
            var userGrocery = new UserGrocery
            {
                UserId = userId,
                GroceryId = groceryId,
                Role = GroceryRole.Admin
            };

            await _userRepository.AddUserToGrocery(userGrocery);

            var token = GenerateJwtToken(createdUser);
            var response = _mapper.Map<AuthResponseDto>(createdUser);
            response.Token = token.Token;
            response.Expiration = token.Expiration;

            return response;
        }

        private (string Token, DateTime Expiration) GenerateJwtToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new(ClaimTypes.Email, user.Email),
                new(ClaimTypes.Name, user.Name),
                new("IsSuperAdmin", user.IsSuperAdmin.ToString())
            };

            // Agregar claims de roles por grocery
            foreach (var userGrocery in user.UserGroceries)
            {
                claims.Add(new Claim($"Role_{userGrocery.GroceryId}", userGrocery.Role.ToString()));
                claims.Add(new Claim("GroceryId", userGrocery.GroceryId.ToString()));
            }

            var expiration = DateTime.UtcNow.AddHours(double.Parse(_configuration["Jwt:ExpirationHours"]!));

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: expiration,
                signingCredentials: credentials
            );

            return (new JwtSecurityTokenHandler().WriteToken(token), expiration);
        }
    }
}