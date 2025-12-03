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

        // Staff Management Methods

        public async Task<AuthResponseDto> CreateStaff(CreateStaffDto dto, int adminGroceryId)
        {
            // Validate staff limit
            var currentStaffCount = await _userRepository.CountByGroceryId(adminGroceryId);
            if (currentStaffCount >= MAX_STAFF_PER_GROCERY)
                throw new BusinessException($"No se pueden crear más de {MAX_STAFF_PER_GROCERY} empleados por tienda.");

            // Check if email is already registered
            if (await _userRepository.ExistsByEmail(dto.Email))
                throw new DuplicateException($"El email {dto.Email} ya está registrado.");

            // Create new staff user
            var newUser = new User
            {
                Name = dto.Name,
                Email = dto.Email,
                PasswordHash = _passwordHasher.Hash(dto.Password),
                IsSuperAdmin = false,
                GroceryId = adminGroceryId,
                Role = GroceryRole.Staff
            };

            var userId = await _userRepository.Create(newUser);
            await _userRepository.SaveChanges();

            var createdUser = await _userRepository.GetById(userId);
            if (createdUser == null)
                throw new BusinessException("Error al crear el empleado.");

            var userInfo = MapUserToInfoDto(createdUser);

            return new AuthResponseDto
            {
                Token = string.Empty,
                Expiration = DateTime.UtcNow.AddHours(1),
                User = userInfo
            };
        }

        public async Task<StaffListResponseDto> GetStaffByGroceryId(int groceryId)
        {
            var users = await _userRepository.GetByGroceryId(groceryId);
            
            // Filter only staff members (exclude admin)
            var staffMembers = users
                .Where(u => u.Role == GroceryRole.Staff)
                .ToList();

            var staffList = staffMembers.Select(u => new StaffResponseDto
            {
                Id = u.Id,
                Name = u.Name,
                Email = u.Email,
                Role = u.Role ?? GroceryRole.Staff,
                GroceryId = u.GroceryId ?? groceryId
            }).ToList();

            return new StaffListResponseDto
            {
                Staff = staffList,
                Count = staffList.Count,
                MaxAllowed = MAX_STAFF_PER_GROCERY
            };
        }

        public async Task<StaffResponseDto> UpdateStaff(int staffId, UpdateStaffDto dto, int adminGroceryId)
        {
            var user = await _userRepository.GetById(staffId);
            
            if (user == null)
                throw new NotFoundException($"Empleado con ID {staffId} no encontrado.");

            // Verify the staff belongs to admin's grocery
            if (user.GroceryId != adminGroceryId)
                throw new UnauthorizedException("No tiene permisos para modificar este empleado.");

            // Verify user is staff, not admin
            if (user.Role != GroceryRole.Staff)
                throw new BusinessException("Solo se pueden modificar empleados con rol Staff.");

            // Check if email is being changed and if it's already taken
            if (!string.Equals(user.Email, dto.Email, StringComparison.OrdinalIgnoreCase)
                && await _userRepository.ExistsByEmail(dto.Email))
                throw new DuplicateException($"El email {dto.Email} ya está registrado.");

            // Update fields
            user.Name = dto.Name;
            user.Email = dto.Email;

            if (!string.IsNullOrWhiteSpace(dto.NewPassword))
                user.PasswordHash = _passwordHasher.Hash(dto.NewPassword);

            await _userRepository.Update(user);
            await _userRepository.SaveChanges();

            return new StaffResponseDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role ?? GroceryRole.Staff,
                GroceryId = user.GroceryId ?? adminGroceryId
            };
        }

        public async Task<bool> DeleteStaff(int staffId, int adminGroceryId)
        {
            var user = await _userRepository.GetById(staffId);
            
            if (user == null)
                throw new NotFoundException($"Empleado con ID {staffId} no encontrado.");

            // Verify the staff belongs to admin's grocery
            if (user.GroceryId != adminGroceryId)
                throw new UnauthorizedException("No tiene permisos para eliminar este empleado.");

            // Verify user is staff, not admin
            if (user.Role != GroceryRole.Staff)
                throw new BusinessException("Solo se pueden eliminar empleados con rol Staff.");

            await _userRepository.Delete(user);
            await _userRepository.SaveChanges();

            return true;
        }
    }
}
