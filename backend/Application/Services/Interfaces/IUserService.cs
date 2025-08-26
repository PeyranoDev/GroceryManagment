using Application.Schemas.Users;

namespace Application.Services.Interfaces
{
    public interface IUserService
    {
        Task<UserForResponseDto> Create(UserForCreateDto dto);
        Task<bool> Delete(int id);
        Task<IReadOnlyList<UserForResponseDto>> GetAll();
        Task<UserForResponseDto?> GetById(int id);
        Task<UserForResponseDto?> SetSuperAdmin(int id, SetSuperAdminDto dto);
        Task<UserForResponseDto?> Update(int id, UserForUpdateDto dto);
    }
}