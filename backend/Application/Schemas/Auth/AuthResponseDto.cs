namespace Application.Schemas.Auth
{
    public class AuthResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public DateTime Expiration { get; set; }
        public UserInfoDto User { get; set; } = null!;
    }
    
    public class UserInfoDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public bool IsSuperAdmin { get; set; }
    }
}
