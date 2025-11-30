using Application.Schemas;
using Application.Schemas.Auth;
using Application.Services.Interfaces;
using Domain.Exceptions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly IAuthService _authService;

        public AuthController(IConfiguration config, IAuthService authService)
        {
            _config = config;
            _authService = authService;
        }

        /// <summary>
        /// Autentica a un usuario con email y contraseña
        /// </summary>
        /// <param name="loginDto">Datos de login del usuario</param>
        /// <returns>Token JWT y información del usuario</returns>
        [HttpPost("login")]
        public async Task<ActionResult<ApiResponse<AuthResponseDto>>> Login([FromBody] LoginDto loginDto)
        {
            var result = await _authService.Login(loginDto);
            
            // Generar el JWT token
            result.Token = GenerateJwtToken(result.User);
            
            return Ok(ApiResponse<AuthResponseDto>.SuccessResponse(result, "Inicio de sesión exitoso"));
        }

        /// <summary>
        /// Registra un nuevo usuario en el sistema
        /// </summary>
        /// <param name="registerDto">Datos del nuevo usuario</param>
        /// <returns>Token JWT y información del usuario registrado</returns>
        [HttpPost("register")]
        public async Task<ActionResult<ApiResponse<AuthResponseDto>>> Register([FromBody] RegisterDto registerDto)
        {
            var result = await _authService.Register(registerDto);
            
            // Generar el JWT token
            result.Token = GenerateJwtToken(result.User);
            
            return Ok(ApiResponse<AuthResponseDto>.SuccessResponse(result, "Usuario registrado exitosamente"));
        }

        private string GenerateJwtToken(UserInfoDto user)
        {
            var secretKey = _config["Authentication:SecretForKey"];
            if (string.IsNullOrEmpty(secretKey))
                throw new InvalidOperationException("JWT secret key is not configured.");

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim("sub", user.Id.ToString()),
                new Claim("name", user.Name),
                new Claim("email", user.Email),
                new Claim("isSuperAdmin", user.IsSuperAdmin.ToString().ToLower())
            };

            if (user.CurrentRole.HasValue)
            {
                claims.Add(new Claim("role", user.CurrentRole.Value.ToString()));
            }

            if (user.CurrentGroceryId.HasValue)
            {
                claims.Add(new Claim("groceryId", user.CurrentGroceryId.Value.ToString()));
            }

            var token = new JwtSecurityToken(
                issuer: _config["Authentication:Issuer"],
                audience: _config["Authentication:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
