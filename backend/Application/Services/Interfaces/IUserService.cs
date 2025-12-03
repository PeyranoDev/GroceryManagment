using Application.Schemas.Users;

namespace Application.Services.Interfaces
{
    public interface IUserService
    {
        Task<UserForResponseDto> Create(UserForCreateDto dto);
        Task<bool> Delete(int id);
        Task<IReadOnlyList<UserForResponseDto>> GetAll();
        Task<IReadOnlyList<UserForResponseDto>> GetByGroceryId(int groceryId);
        Task<IReadOnlyList<UserForResponseDto>> GetByGroceryIdAll(int groceryId);
        Task<UserForResponseDto?> GetById(int id);
        Task<UserForResponseDto?> SetSuperAdmin(int id, SetSuperAdminDto dto);
        Task<UserForResponseDto?> SetRole(int id, Domain.Common.Enums.GroceryRole role);
        Task SetGrocery(int id, int groceryId);
        Task<UserForResponseDto?> Activate(int id);
        Task<UserForResponseDto?> Update(int id, UserForUpdateDto dto);
    }
}
