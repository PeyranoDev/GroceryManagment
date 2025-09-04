using Application.Schemas;
using Application.Schemas.Auth;
using Application.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<ApiResponse<AuthResponseDto>>> Login([FromBody] LoginDto loginDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<AuthResponseDto>.ErrorResponse("Datos de entrada inválidos."));

            var response = await _authService.Login(loginDto);
            return Ok(ApiResponse<AuthResponseDto>.SuccessResponse(
                response, 
                "Inicio de sesión exitoso"
            ));
        }

        [HttpPost("register")]
        [Authorize] // Solo usuarios autenticados pueden registrar
        public async Task<ActionResult<ApiResponse<AuthResponseDto>>> Register([FromBody] RegisterDto registerDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<AuthResponseDto>.ErrorResponse("Datos de entrada inválidos."));

            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var response = await _authService.Register(registerDto, currentUserId);
            
            return CreatedAtAction(
                nameof(Login),
                null,
                ApiResponse<AuthResponseDto>.SuccessResponse(
                    response, 
                    "Usuario registrado exitosamente"
                )
            );
        }

        [HttpPost("create-employee")]
        [Authorize] // Solo usuarios autenticados pueden crear empleados
        public async Task<ActionResult<ApiResponse<AuthResponseDto>>> CreateEmployee([FromBody] CreateEmployeeDto createEmployeeDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<AuthResponseDto>.ErrorResponse("Datos de entrada inválidos."));

            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            
            var registerDto = new RegisterDto
            {
                Name = createEmployeeDto.Name,
                Email = createEmployeeDto.Email,
                Password = createEmployeeDto.Password,
                ConfirmPassword = createEmployeeDto.ConfirmPassword
            };

            var response = await _authService.CreateEmployee(registerDto, currentUserId, createEmployeeDto.GroceryId);
            
            return CreatedAtAction(
                nameof(Login),
                null,
                ApiResponse<AuthResponseDto>.SuccessResponse(
                    response, 
                    "Empleado creado y asignado al grocery exitosamente"
                )
            );
        }

        [HttpGet("me")]
        [Authorize]
        public ActionResult<ApiResponse<object>> GetCurrentUser()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            var name = User.FindFirst(ClaimTypes.Name)?.Value;
            var isSuperAdmin = bool.Parse(User.FindFirst("IsSuperAdmin")?.Value ?? "false");

            var groceryRoles = User.Claims
                .Where(c => c.Type.StartsWith("Role_"))
                .Select(c => new
                {
                    GroceryId = int.Parse(c.Type.Substring(5)), // Remove "Role_" prefix
                    Role = c.Value
                })
                .ToList();

            var userInfo = new
            {
                Id = userId,
                Email = email,
                Name = name,
                IsSuperAdmin = isSuperAdmin,
                GroceryRoles = groceryRoles
            };

            return Ok(ApiResponse<object>.SuccessResponse(
                userInfo,
                "Información del usuario obtenida exitosamente"
            ));
        }
    }
}
