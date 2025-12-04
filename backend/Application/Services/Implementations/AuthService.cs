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
        private const int MAX_STAFF_PER_GROCERY = 4;
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
            newUser.Role = GroceryRole.Staff;
            
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

        public async Task<AuthResponseDto> CreateStaff(CreateStaffDto dto, int adminGroceryId)
        {
            var count = await _userRepository.CountByGroceryId(adminGroceryId);
            if (count >= MAX_STAFF_PER_GROCERY)
                throw new BusinessException($"Se alcanzó el máximo de {MAX_STAFF_PER_GROCERY} empleados para esta verdulería.");

            var entity = _mapper.Map<User>(dto);
            entity.GroceryId = adminGroceryId;
            entity.Role = GroceryRole.Staff;
            entity.PasswordHash = _passwordHasher.Hash(dto.Password);

            var id = await _userRepository.Create(entity);
            await _userRepository.SaveChanges();

            var created = await _userRepository.GetById(id)!;
            var info = MapUserToInfoDto(created);
            return new AuthResponseDto
            {
                Token = string.Empty,
                Expiration = DateTime.UtcNow.AddHours(1),
                User = info
            };
        }

        public async Task<StaffListResponseDto> GetStaffByGroceryId(int groceryId)
        {
            var list = await _userRepository.GetByGroceryId(groceryId);
            var staff = list.Where(u => (u.Role ?? GroceryRole.Staff) == GroceryRole.Staff)
                            .Select(_mapper.Map<StaffResponseDto>)
                            .ToList();
            return new StaffListResponseDto
            {
                Staff = staff,
                Count = staff.Count,
                MaxAllowed = MAX_STAFF_PER_GROCERY
            };
        }

        public async Task<StaffResponseDto> UpdateStaff(int staffId, UpdateStaffDto dto, int adminGroceryId)
        {
            var u = await _userRepository.GetById(staffId);
            if (u is null || (u.GroceryId ?? 0) != adminGroceryId)
                throw new NotFoundException("Empleado no encontrado en esta verdulería.");

            u.Name = dto.Name;
            u.Email = dto.Email;
            if (!string.IsNullOrWhiteSpace(dto.NewPassword))
                u.PasswordHash = _passwordHasher.Hash(dto.NewPassword);

            await _userRepository.Update(u);
            await _userRepository.SaveChanges();
            return _mapper.Map<StaffResponseDto>(u);
        }

        public async Task<bool> DeleteStaff(int staffId, int adminGroceryId)
        {
            var u = await _userRepository.GetById(staffId);
            if (u is null || (u.GroceryId ?? 0) != adminGroceryId)
                return false;
            await _userRepository.Delete(u);
            await _userRepository.SaveChanges();
            return true;
        }

        public async Task<UserInfoDto?> ValidateUser(string email, string password)
        {
            var user = await _userRepository.GetByEmail(email);
            if (user == null)
                return null;
            if (!user.IsActive)
                return null;
            if (string.IsNullOrEmpty(user.PasswordHash) || !_passwordHasher.Verify(password, user.PasswordHash))
                return null;

            return MapUserToInfoDto(user);
        }

        public async Task<AuthResponseDto> Impersonate(int userId)
        {
            var user = await _userRepository.GetById(userId);
            if (user == null)
                throw new NotFoundException($"Usuario con ID {userId} no encontrado.");
            if (!user.IsActive)
                throw new NotFoundException($"Usuario con ID {userId} no está activo.");

            var userInfo = MapUserToInfoDto(user);
            return new AuthResponseDto
            {
                Token = string.Empty,
                Expiration = DateTime.UtcNow.AddHours(1),
                User = userInfo
            };
        }

        private UserInfoDto MapUserToInfoDto(User user)
        {
            var userInfo = _mapper.Map<UserInfoDto>(user);
            
            if (user.Role == GroceryRole.SuperAdmin)
            {
                userInfo.CurrentRole = GroceryRole.SuperAdmin;
                
                if (_tenantProvider.HasTenant)
                {
                    userInfo.CurrentGroceryId = _tenantProvider.CurrentGroceryId;
                }
            }
            else if (user.GroceryId.HasValue && user.Role.HasValue)
            {
                userInfo.CurrentRole = user.Role.Value;
                userInfo.CurrentGroceryId = user.GroceryId.Value;
            }

            return userInfo;
        }
    }
}
