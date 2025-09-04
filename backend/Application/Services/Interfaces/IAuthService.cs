using Application.Schemas.Auth;

namespace Application.Services.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponseDto> Login(LoginDto loginDto);
        Task<AuthResponseDto> Register(RegisterDto registerDto, int? currentUserId = null);
        Task<AuthResponseDto> CreateEmployee(RegisterDto registerDto, int adminUserId, int groceryId);
        Task<AuthResponseDto> CreateAdminForGrocery(RegisterDto registerDto, int superAdminUserId, int groceryId);
    }
}