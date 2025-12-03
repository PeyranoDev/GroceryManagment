using Application.Schemas.Auth;

namespace Application.Services.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponseDto> Login(LoginDto loginDto);
        Task<UserInfoDto?> ValidateUser(string email, string password);
        
        // Staff management (for Admin users)
        Task<AuthResponseDto> CreateStaff(CreateStaffDto dto, int adminGroceryId);
        Task<StaffListResponseDto> GetStaffByGroceryId(int groceryId);
        Task<StaffResponseDto> UpdateStaff(int staffId, UpdateStaffDto dto, int adminGroceryId);
        Task<bool> DeleteStaff(int staffId, int adminGroceryId);
    }
}
