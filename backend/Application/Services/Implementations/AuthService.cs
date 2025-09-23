using Application.Schemas.Auth;
using Application.Services.Interfaces;
using AutoMapper;
using Domain.Common.Enums;
using Domain.Entities;
using Domain.Exceptions;
using Domain.Repositories;
using Domain.Tenancy;

namespace Application.Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IMapper _mapper;
        private readonly ITenantProvider _tenantProvider;

        public AuthService(
            IUserRepository userRepository,
            IPasswordHasher passwordHasher,
            IMapper mapper,
            ITenantProvider tenantProvider)
        {
            _userRepository = userRepository;
            _passwordHasher = passwordHasher;
            _mapper = mapper;
            _tenantProvider = tenantProvider;
        }

        public async Task<AuthResponseDto> Login(LoginDto loginDto)
        {
            var user = await ValidateUser(loginDto.Email, loginDto.Password);
            
            if (user == null)
                throw new UnauthorizedException("Email o contraseña incorrectos.");

            return new AuthResponseDto
            {
                Token = string.Empty, 
                Expiration = DateTime.UtcNow.AddHours(1),
                User = user
            };
        }

        public async Task<AuthResponseDto> Register(RegisterDto registerDto)
        {
            if (await _userRepository.ExistsByEmail(registerDto.Email))
                throw new DuplicateException($"El email {registerDto.Email} ya está registrado.");

            var newUser = _mapper.Map<User>(registerDto);
            newUser.PasswordHash = _passwordHasher.Hash(registerDto.Password);
            newUser.IsSuperAdmin = false; 
            
            var userId = await _userRepository.Create(newUser);
            await _userRepository.SaveChanges();

            var createdUser = await _userRepository.GetById(userId);
            if (createdUser == null)
                throw new BusinessException("Error al crear el usuario.");

            var userInfo = MapUserToInfoDto(createdUser);

            return new AuthResponseDto
            {
                Token = string.Empty, 
                Expiration = DateTime.UtcNow.AddHours(1),
                User = userInfo
            };
        }

        public async Task<UserInfoDto?> ValidateUser(string email, string password)
        {
            var user = await _userRepository.GetByEmail(email);
            
            if (user == null || !_passwordHasher.Verify(password, user.PasswordHash))
                return null;

            return MapUserToInfoDto(user);
        }

        private UserInfoDto MapUserToInfoDto(User user)
        {
            var userInfo = _mapper.Map<UserInfoDto>(user);
            
            if (user.GroceryId.HasValue && user.Role.HasValue)
            {
                userInfo.CurrentRole = user.Role.Value;
                userInfo.CurrentGroceryId = user.GroceryId.Value;
            }
            else if (user.IsSuperAdmin)
            {
                userInfo.CurrentRole = GroceryRole.SuperAdmin;
                
                if (_tenantProvider.HasTenant)
                {
                    userInfo.CurrentGroceryId = _tenantProvider.CurrentGroceryId;
                }
            }

            return userInfo;
        }
    }
}
