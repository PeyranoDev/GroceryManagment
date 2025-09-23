using Application.Schemas.Auth;

namespace Application.Services.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponseDto> Login(LoginDto loginDto);
        Task<AuthResponseDto> Register(RegisterDto registerDto);
        Task<UserInfoDto?> ValidateUser(string email, string password);
    }
}
