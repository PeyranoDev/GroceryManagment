using Application.Schemas;
using Application.Schemas.Auth;
using Application.Services.Interfaces;
using Domain.Exceptions;
using Microsoft.AspNetCore.Authorization;
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
        [AllowAnonymous]
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
        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult<ApiResponse<AuthResponseDto>>> Register([FromBody] RegisterDto registerDto)
        {
            var result = await _authService.Register(registerDto);
            
            // Generar el JWT token
            result.Token = GenerateJwtToken(result.User);
            
            return Ok(ApiResponse<AuthResponseDto>.SuccessResponse(result, "Usuario registrado exitosamente"));
        }

        [HttpPost("impersonate/{userId:int}")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<AuthResponseDto>>> Impersonate(int userId)
        {
            var isSuperAdmin = User.HasClaim(c => c.Type == "isSuperAdmin" && c.Value == "true");
            if (!isSuperAdmin)
                return Forbid();

            var result = await _authService.Impersonate(userId);
            result.Token = GenerateJwtToken(result.User);
            return Ok(ApiResponse<AuthResponseDto>.SuccessResponse(result, "Impersonación exitosa"));
        }

        [Authorize(Policy = "Admin")]
        [HttpGet("staff")]
        public async Task<ActionResult<ApiResponse<StaffListResponseDto>>> GetStaff()
        {
            var groceryIdClaim = User.Claims.FirstOrDefault(c => c.Type == "groceryId")?.Value;
            var groceryId = string.IsNullOrEmpty(groceryIdClaim) ? 0 : int.Parse(groceryIdClaim);
            var list = await _authService.GetStaffByGroceryId(groceryId);
            return Ok(ApiResponse<StaffListResponseDto>.SuccessResponse(list, "Staff obtenido"));
        }

        [Authorize(Policy = "Admin")]
        [HttpPost("staff")]
        public async Task<ActionResult<ApiResponse<AuthResponseDto>>> CreateStaff([FromBody] CreateStaffDto dto)
        {
            var groceryIdClaim = User.Claims.FirstOrDefault(c => c.Type == "groceryId")?.Value;
            var groceryId = string.IsNullOrEmpty(groceryIdClaim) ? 0 : int.Parse(groceryIdClaim);
            var result = await _authService.CreateStaff(dto, groceryId);
            return Ok(ApiResponse<AuthResponseDto>.SuccessResponse(result, "Staff creado"));
        }

        [Authorize(Policy = "Admin")]
        [HttpPut("staff/{id:int}")]
        public async Task<ActionResult<ApiResponse<StaffResponseDto>>> UpdateStaff(int id, [FromBody] UpdateStaffDto dto)
        {
            var groceryIdClaim = User.Claims.FirstOrDefault(c => c.Type == "groceryId")?.Value;
            var groceryId = string.IsNullOrEmpty(groceryIdClaim) ? 0 : int.Parse(groceryIdClaim);
            var updated = await _authService.UpdateStaff(id, dto, groceryId);
            return Ok(ApiResponse<StaffResponseDto>.SuccessResponse(updated, "Staff actualizado"));
        }

        [Authorize(Policy = "Admin")]
        [HttpDelete("staff/{id:int}")]
        public async Task<ActionResult<ApiResponse>> DeleteStaff(int id)
        {
            var groceryIdClaim = User.Claims.FirstOrDefault(c => c.Type == "groceryId")?.Value;
            var groceryId = string.IsNullOrEmpty(groceryIdClaim) ? 0 : int.Parse(groceryIdClaim);
            await _authService.DeleteStaff(id, groceryId);
            return Ok(ApiResponse.SuccessResponse("Staff eliminado"));
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
