using Application.Schemas;
using Application.Schemas.Users;
using Application.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Domain.Common.Enums;

namespace Presentation.Controllers
{
    [ApiController]
    [Route("api/Users")]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly Domain.Tenancy.ITenantProvider _tenantProvider;
        private static bool HasSuperAdminRole(System.Security.Claims.ClaimsPrincipal user)
        {
            var allowed = new HashSet<string>(StringComparer.OrdinalIgnoreCase) { "SuperAdmin", "3" };
            bool hasCustom = user.Claims.Any(c => c.Type == "role" && allowed.Contains(c.Value));
            bool hasStandard = user.Claims.Any(c => c.Type == System.Security.Claims.ClaimTypes.Role && allowed.Contains(c.Value));
            return hasCustom || hasStandard;
        }

        public UserController(IUserService userService, Domain.Tenancy.ITenantProvider tenantProvider)
        {
            _userService = userService;
            _tenantProvider = tenantProvider;
        }

        [HttpGet]
        [Authorize(Policy = "SuperAdmin")]
        public async Task<ActionResult<ApiResponse<IReadOnlyList<UserForResponseDto>>>> GetAll()
        {
            var users = await _userService.GetAll();
            return Ok(ApiResponse<IReadOnlyList<UserForResponseDto>>.SuccessResponse(
                users, 
                "Usuarios obtenidos exitosamente"
            ));
        }

        [HttpGet("{id}")]
        [Authorize(Policy = "SuperAdmin")]
        public async Task<ActionResult<ApiResponse<UserForResponseDto>>> GetById(int id)
        {
            var user = await _userService.GetById(id);
            return Ok(ApiResponse<UserForResponseDto>.SuccessResponse(
                user!, 
                "Usuario obtenido exitosamente"
            ));
        }

        [HttpPost]
        [Authorize(Policy = "Admin")]
        public async Task<ActionResult<ApiResponse<UserForResponseDto>>> Create([FromBody] UserForCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<UserForResponseDto>.ErrorResponse("Datos de entrada inválidos."));
            
            var isSuperAdmin = HasSuperAdminRole(User);

            var user = await _userService.Create(dto);
            if (!isSuperAdmin)
            {
                var groceryId = _tenantProvider.CurrentGroceryId;
                await _userService.SetGrocery(user.Id, groceryId);
            }
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
        [Authorize(Policy = "Admin")]
        public async Task<ActionResult<ApiResponse<UserForResponseDto>>> Update(int id, [FromBody] UserForUpdateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<UserForResponseDto>.ErrorResponse("Datos de entrada inválidos."));
            var target = await _userService.GetById(id);
            var isSuperAdmin = HasSuperAdminRole(User);
            if (!isSuperAdmin)
            {
                if (target?.Role == GroceryRole.SuperAdmin) return Forbid();
                var groceryId = _tenantProvider.CurrentGroceryId;
                // si el usuario objetivo no pertenece a la verdulería actual, prohibir
                var list = await _userService.GetByGroceryIdAll(groceryId);
                if (!list.Any(u => u.Id == id)) return Forbid();
            }

            var user = await _userService.Update(id, dto);
            return Ok(ApiResponse<UserForResponseDto>.SuccessResponse(
                user!, 
                "Usuario actualizado exitosamente"
            ));
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = "Admin")]
        public async Task<ActionResult<ApiResponse>> Delete(int id)
        {
            var target = await _userService.GetById(id);
            var isSuperAdmin = HasSuperAdminRole(User);
            if (!isSuperAdmin)
            {
                if (target?.Role == GroceryRole.SuperAdmin) return Forbid();
                var groceryId = _tenantProvider.CurrentGroceryId;
                var list = await _userService.GetByGroceryIdAll(groceryId);
                if (!list.Any(u => u.Id == id)) return Forbid();
            }

            await _userService.Delete(id);
            return Ok(ApiResponse.SuccessResponse("Usuario eliminado exitosamente"));
        }

        [HttpPatch("{id}/super-admin")]
        [Authorize(Policy = "SuperAdmin")]
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

        [HttpGet("grocery")]
        [Authorize(Policy = "Admin")]
        public async Task<ActionResult<ApiResponse<IReadOnlyList<UserForResponseDto>>>> GetByCurrentGrocery()
        {
            var groceryId = _tenantProvider.CurrentGroceryId;
            var users = await _userService.GetByGroceryId(groceryId);
            
            // Admin/Staff no deben ver SuperAdmins en la lista
            var isSuperAdmin = HasSuperAdminRole(User);
            if (!isSuperAdmin)
            {
                users = users.Where(u => u.Role != GroceryRole.SuperAdmin).ToList();
            }
            
            return Ok(ApiResponse<IReadOnlyList<UserForResponseDto>>.SuccessResponse(
                users,
                "Usuarios de la verdulería obtenidos exitosamente"
            ));
        }

        [HttpGet("grocery/all")]
        [Authorize(Policy = "SuperAdmin")]
        public async Task<ActionResult<ApiResponse<IReadOnlyList<UserForResponseDto>>>> GetByCurrentGroceryAll()
        {
            // SuperAdmin ve TODOS los usuarios del sistema (activos e inactivos)
            var users = await _userService.GetAllIncludingInactive();
            return Ok(ApiResponse<IReadOnlyList<UserForResponseDto>>.SuccessResponse(
                users,
                "Todos los usuarios obtenidos exitosamente"
            ));
        }

        [HttpPatch("{id}/role")]
        [Authorize(Policy = "Admin")]
        public async Task<ActionResult<ApiResponse<UserForResponseDto>>> SetRole(int id, [FromBody] SetRoleDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<UserForResponseDto>.ErrorResponse("Datos de entrada inválidos."));

            var isSuperAdmin = User.Claims.Any(c => c.Type == "role" && (c.Value == "SuperAdmin" || c.Value == "3"));
            if (!isSuperAdmin && dto.Role == GroceryRole.SuperAdmin)
                return Forbid();

            var user = await _userService.SetRole(id, dto.Role);
            return Ok(ApiResponse<UserForResponseDto>.SuccessResponse(
                user!,
                "Rol del usuario actualizado exitosamente"
            ));
        }

        [HttpPatch("{id}/activate")]
        [Authorize(Policy = "SuperAdmin")]
        public async Task<ActionResult<ApiResponse<UserForResponseDto>>> Activate(int id)
        {
            var user = await _userService.Activate(id);
            return Ok(ApiResponse<UserForResponseDto>.SuccessResponse(
                user!,
                "Usuario reactivado exitosamente"
            ));
        }
    }
}
