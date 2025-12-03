using Application.Schemas.Users;
using Application.Services.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Exceptions;
using Domain.Repositories;

namespace Application.Services.Implementations
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _users;
        private readonly IMapper _mapper;
        private readonly IPasswordHasher _passwordHasher;

        public UserService(IUserRepository users, IMapper mapper, IPasswordHasher passwordHasher)
        {
            _users = users;
            _mapper = mapper;
            _passwordHasher = passwordHasher;
        }

        public async Task<UserForResponseDto?> GetById(int id)
        {
            var u = await _users.GetById(id);
            return u is null ? null : _mapper.Map<UserForResponseDto>(u);
        }

        public async Task<IReadOnlyList<UserForResponseDto>> GetAll()
        {
            var list = await _users.GetAll();
            return list.Select(_mapper.Map<UserForResponseDto>).ToList();
        }

        public async Task<IReadOnlyList<UserForResponseDto>> GetByGroceryId(int groceryId)
        {
            var list = await _users.GetByGroceryId(groceryId);
            return list.Select(_mapper.Map<UserForResponseDto>).ToList();
        }

        public async Task<IReadOnlyList<UserForResponseDto>> GetByGroceryIdAll(int groceryId)
        {
            var list = await _users.GetByGroceryIdAll(groceryId);
            return list.Select(_mapper.Map<UserForResponseDto>).ToList();
        }

        public async Task<UserForResponseDto> Create(UserForCreateDto dto)
        {
            if (await _users.ExistsByEmail(dto.Email))
                throw new DuplicateException($"El email {dto.Email} ya está registrado.");

            var entity = _mapper.Map<User>(dto);
            entity.PasswordHash = _passwordHasher.Hash(dto.Password);
            entity.IsSuperAdmin = dto.IsSuperAdmin;
            entity.IsActive = true;

            var id = await _users.Create(entity);
            await _users.SaveChanges();
            var created = await _users.GetById(id)!;
            return _mapper.Map<UserForResponseDto>(created);
        }

        public async Task<UserForResponseDto?> Update(int id, UserForUpdateDto dto)
        {
            var entity = await _users.GetById(id);
            if (entity is null) 
                throw new NotFoundException($"Usuario con ID {id} no encontrado.");

            if (!string.Equals(entity.Email, dto.Email, StringComparison.OrdinalIgnoreCase)
                && await _users.ExistsByEmail(dto.Email))
                throw new DuplicateException($"El email {dto.Email} ya está registrado.");

            _mapper.Map(dto, entity);

            if (!string.IsNullOrWhiteSpace(dto.NewPassword))
                entity.PasswordHash = _passwordHasher.Hash(dto.NewPassword);

            await _users.Update(entity);
            await _users.SaveChanges();
            return _mapper.Map<UserForResponseDto>(entity);
        }

        public async Task<bool> Delete(int id)
        {
            var entity = await _users.GetById(id);
            if (entity is null) return false;
            entity.IsActive = false;
            await _users.Update(entity);
            await _users.SaveChanges();
            return true;
        }

        public async Task<UserForResponseDto?> SetSuperAdmin(int id, SetSuperAdminDto dto)
        {
            var entity = await _users.GetById(id);
            if (entity is null) 
                throw new NotFoundException($"Usuario con ID {id} no encontrado.");

            await _users.SetSuperAdmin(id, dto.IsSuperAdmin);
            entity.IsSuperAdmin = dto.IsSuperAdmin;

            return _mapper.Map<UserForResponseDto>(entity);
        }

        public async Task<UserForResponseDto?> SetRole(int id, Domain.Common.Enums.GroceryRole role)
        {
            var entity = await _users.GetById(id);
            if (entity is null) 
                throw new NotFoundException($"Usuario con ID {id} no encontrado.");

            await _users.SetRole(id, role);
            entity.Role = role;

            return _mapper.Map<UserForResponseDto>(entity);
        }

        public async Task<UserForResponseDto?> Activate(int id)
        {
            var entity = await _users.GetById(id);
            if (entity is null)
                throw new NotFoundException($"Usuario con ID {id} no encontrado.");
            await _users.Activate(id);
            entity.IsActive = true;
            return _mapper.Map<UserForResponseDto>(entity);
        }
    }
}
