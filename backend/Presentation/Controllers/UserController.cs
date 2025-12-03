using Application.Schemas;
using Application.Schemas.Users;
using Application.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Policy = "SuperAdmin")] 
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<IReadOnlyList<UserForResponseDto>>>> GetAll()
        {
            var users = await _userService.GetAll();
            return Ok(ApiResponse<IReadOnlyList<UserForResponseDto>>.SuccessResponse(
                users, 
                "Usuarios obtenidos exitosamente"
            ));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<UserForResponseDto>>> GetById(int id)
        {
            var user = await _userService.GetById(id);
            return Ok(ApiResponse<UserForResponseDto>.SuccessResponse(
                user!, 
                "Usuario obtenido exitosamente"
            ));
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<UserForResponseDto>>> Create([FromBody] UserForCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<UserForResponseDto>.ErrorResponse("Datos de entrada inv�lidos."));

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

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<UserForResponseDto>>> Update(int id, [FromBody] UserForUpdateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<UserForResponseDto>.ErrorResponse("Datos de entrada inv�lidos."));

            var user = await _userService.Update(id, dto);
            return Ok(ApiResponse<UserForResponseDto>.SuccessResponse(
                user!, 
                "Usuario actualizado exitosamente"
            ));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse>> Delete(int id)
        {
            await _userService.Delete(id);
            return Ok(ApiResponse.SuccessResponse("Usuario eliminado exitosamente"));
        }

        [HttpPatch("{id}/super-admin")]
        public async Task<ActionResult<ApiResponse<UserForResponseDto>>> SetSuperAdmin(int id, [FromBody] SetSuperAdminDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<UserForResponseDto>.ErrorResponse("Datos de entrada inv�lidos."));

            var user = await _userService.SetSuperAdmin(id, dto);
            return Ok(ApiResponse<UserForResponseDto>.SuccessResponse(
                user, 
                $"Usuario {(dto.IsSuperAdmin ? "promovido a" : "removido de")} SuperAdmin exitosamente"
            ));
        }
    }
}
