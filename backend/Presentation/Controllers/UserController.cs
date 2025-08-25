using Application.Schemas;
using Application.Schemas.Users;
using Application.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        /// <summary>
        /// Obtener todos los usuarios
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<ApiResponse<IReadOnlyList<UserForResponseDto>>>> GetAll()
        {
            var users = await _userService.GetAll();
            return Ok(ApiResponse<IReadOnlyList<UserForResponseDto>>.SuccessResponse(
                users, 
                "Usuarios obtenidos exitosamente"
            ));
        }

        /// <summary>
        /// Obtener un usuario por ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<UserForResponseDto>>> GetById(int id)
        {
            var user = await _userService.GetById(id);
            return Ok(ApiResponse<UserForResponseDto>.SuccessResponse(
                user!, 
                "Usuario obtenido exitosamente"
            ));
        }

        /// <summary>
        /// Crear un nuevo usuario
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<ApiResponse<UserForResponseDto>>> Create([FromBody] UserForCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<UserForResponseDto>.ErrorResponse("Datos de entrada inválidos."));

            var user = await _userService.Create(dto);
            return CreatedAtAction(
                nameof(GetById), 
                new { id = user.Id }, 
                ApiResponse<UserForResponseDto>.SuccessResponse(
                    user, 
                    "Usuario creado exitosamente"
                )
            );
        }

        /// <summary>
        /// Actualizar un usuario existente
        /// </summary>
        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<UserForResponseDto>>> Update(int id, [FromBody] UserForUpdateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<UserForResponseDto>.ErrorResponse("Datos de entrada inválidos."));

            var user = await _userService.Update(id, dto);
            return Ok(ApiResponse<UserForResponseDto>.SuccessResponse(
                user!, 
                "Usuario actualizado exitosamente"
            ));
        }

        /// <summary>
        /// Eliminar un usuario
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse>> Delete(int id)
        {
            await _userService.Delete(id);
            return Ok(ApiResponse.SuccessResponse("Usuario eliminado exitosamente"));
        }

        /// <summary>
        /// Establecer o quitar permisos de SuperAdmin a un usuario
        /// </summary>
        [HttpPatch("{id}/super-admin")]
        public async Task<ActionResult<ApiResponse<UserForResponseDto>>> SetSuperAdmin(int id, [FromBody] SetSuperAdminDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<UserForResponseDto>.ErrorResponse("Datos de entrada inválidos."));

            var user = await _userService.SetSuperAdmin(id, dto);
            return Ok(ApiResponse<UserForResponseDto>.SuccessResponse(
                user, 
                $"Usuario {(dto.IsSuperAdmin ? "promovido a" : "removido de")} SuperAdmin exitosamente"
            ));
        }
    }
}
