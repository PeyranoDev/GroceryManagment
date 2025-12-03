using Application.Schemas;
using Application.Schemas.Auth;
using Application.Services.Interfaces;
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
        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult<ApiResponse<AuthResponseDto>>> Login([FromBody] LoginDto loginDto)
        {
            var result = await _authService.Login(loginDto);
            
            // Generar el JWT token
            result.Token = GenerateJwtToken(result.User);
            
            return Ok(ApiResponse<AuthResponseDto>.SuccessResponse(result, "Inicio de sesión exitoso"));
        }

        #region Staff Management (Admin only)

        /// <summary>
        /// Obtiene la lista de staff del admin autenticado
        /// </summary>
        /// <returns>Lista de empleados de la tienda</returns>
        [HttpGet("my-staff")]
        [Authorize(Policy = "Admin")]
        public async Task<ActionResult<ApiResponse<StaffListResponseDto>>> GetMyStaff()
        {
            var groceryId = GetCurrentUserGroceryId();
            if (!groceryId.HasValue)
                return BadRequest(ApiResponse<StaffListResponseDto>.ErrorResponse("No se encontró la tienda del usuario."));

            var result = await _authService.GetStaffByGroceryId(groceryId.Value);
            return Ok(ApiResponse<StaffListResponseDto>.SuccessResponse(result, "Staff obtenido exitosamente"));
        }

        /// <summary>
        /// Crea un nuevo empleado para la tienda del admin
        /// </summary>
        /// <param name="dto">Datos del nuevo empleado</param>
        /// <returns>Token JWT e información del empleado creado</returns>
        [HttpPost("staff")]
        [Authorize(Policy = "Admin")]
        public async Task<ActionResult<ApiResponse<AuthResponseDto>>> CreateStaff([FromBody] CreateStaffDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<AuthResponseDto>.ErrorResponse("Datos de entrada inválidos."));

            var groceryId = GetCurrentUserGroceryId();
            if (!groceryId.HasValue)
                return BadRequest(ApiResponse<AuthResponseDto>.ErrorResponse("No se encontró la tienda del usuario."));

            var result = await _authService.CreateStaff(dto, groceryId.Value);
            
            // Generar el JWT token para el nuevo staff
            result.Token = GenerateJwtToken(result.User);
            
            return CreatedAtAction(nameof(GetMyStaff), ApiResponse<AuthResponseDto>.SuccessResponse(result, "Empleado creado exitosamente"));
        }

        /// <summary>
        /// Actualiza los datos de un empleado
        /// </summary>
        /// <param name="id">ID del empleado</param>
        /// <param name="dto">Datos a actualizar</param>
        /// <returns>Información del empleado actualizado</returns>
        [HttpPut("staff/{id}")]
        [Authorize(Policy = "Admin")]
        public async Task<ActionResult<ApiResponse<StaffResponseDto>>> UpdateStaff(int id, [FromBody] UpdateStaffDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<StaffResponseDto>.ErrorResponse("Datos de entrada inválidos."));

            var groceryId = GetCurrentUserGroceryId();
            if (!groceryId.HasValue)
                return BadRequest(ApiResponse<StaffResponseDto>.ErrorResponse("No se encontró la tienda del usuario."));

            var result = await _authService.UpdateStaff(id, dto, groceryId.Value);
            return Ok(ApiResponse<StaffResponseDto>.SuccessResponse(result, "Empleado actualizado exitosamente"));
        }

        /// <summary>
        /// Elimina un empleado de la tienda
        /// </summary>
        /// <param name="id">ID del empleado a eliminar</param>
        /// <returns>Confirmación de eliminación</returns>
        [HttpDelete("staff/{id}")]
        [Authorize(Policy = "Admin")]
        public async Task<ActionResult<ApiResponse>> DeleteStaff(int id)
        {
            var groceryId = GetCurrentUserGroceryId();
            if (!groceryId.HasValue)
                return BadRequest(ApiResponse.ErrorResponse("No se encontró la tienda del usuario."));

            await _authService.DeleteStaff(id, groceryId.Value);
            return Ok(ApiResponse.SuccessResponse("Empleado eliminado exitosamente"));
        }

        #endregion

        #region Helper Methods

        private int? GetCurrentUserGroceryId()
        {
            var groceryIdClaim = User.FindFirst("groceryId")?.Value;
            if (int.TryParse(groceryIdClaim, out var groceryId))
                return groceryId;
            return null;
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

        #endregion
    }
}
