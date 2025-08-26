using Application.Schemas.Users;
using Application.Services.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Repositories;
using System.Security.Cryptography;
using System.Text;

namespace Application.Services.Implementations
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _users;
        private readonly IMapper _mapper;

        public UserService(IUserRepository users, IMapper mapper)
        {
            _users = users;
            _mapper = mapper;
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

        public async Task<UserForResponseDto> Create(UserForCreateDto dto)
        {
            if (await _users.ExistsByEmail(dto.Email))
                throw new InvalidOperationException("El email ya está registrado.");

            var entity = _mapper.Map<User>(dto);
            entity.PasswordHash = Hash(dto.Password);
            entity.IsSuperAdmin = dto.IsSuperAdmin;

            var id = await _users.Create(entity);
            var created = await _users.GetById(id)!;
            return _mapper.Map<UserForResponseDto>(created);
        }

        public async Task<UserForResponseDto?> Update(int id, UserForUpdateDto dto)
        {
            var entity = await _users.GetById(id);
            if (entity is null) return null;

            if (!string.Equals(entity.Email, dto.Email, StringComparison.OrdinalIgnoreCase)
                && await _users.ExistsByEmail(dto.Email))
                throw new InvalidOperationException("El email ya está registrado.");

            _mapper.Map(dto, entity);

            if (!string.IsNullOrWhiteSpace(dto.NewPassword))
                entity.PasswordHash = Hash(dto.NewPassword);

            await _users.Update(entity);
            return _mapper.Map<UserForResponseDto>(entity);
        }

        public async Task<bool> Delete(int id)
        {
            var entity = await _users.GetById(id);
            if (entity is null) return false;
            await _users.Delete(entity);
            await _users.SaveChanges();
            return true;
        }

        public async Task<UserForResponseDto?> SetSuperAdmin(int id, SetSuperAdminDto dto)
        {
            var entity = await _users.GetById(id);
            if (entity is null) return null;

            await _users.SetSuperAdmin(id, dto.IsSuperAdmin);
            entity.IsSuperAdmin = dto.IsSuperAdmin;

            return _mapper.Map<UserForResponseDto>(entity);
        }

        private static string Hash(string input)
        {
            var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(input));
            return Convert.ToHexString(bytes);
        }
    }
}
