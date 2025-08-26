using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AuthController : ControllerBase
    {
        [HttpGet("profile")]
        public IActionResult GetProfile()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ??
                        User.FindFirst("sub")?.Value;
            
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value ??
                           User.FindFirst("email")?.Value;
            
            var userName = User.FindFirst(ClaimTypes.Name)?.Value ??
                          User.FindFirst("name")?.Value;

            var isSuperAdmin = User.HasClaim("https://grocery-management-api/is_super_admin", "true");

            // Obtener roles como objetos complejos
            var userRolesClaims = User.FindAll("https://grocery-management-api/roles")
                                    .Select(c => c.Value)
                                    .ToList();

            // Parsear roles si están en formato JSON
            var userRoles = ParseUserRoles(userRolesClaims);

            return Ok(new
            {
                Id = userId,
                Name = userName,
                Email = userEmail,
                IsSuperAdmin = isSuperAdmin,
                Roles = userRoles,
                IsAuthenticated = User.Identity?.IsAuthenticated ?? false
            });
        }

        [HttpGet("grocery-role/{groceryId}")]
        public IActionResult GetGroceryRole(int groceryId)
        {
            var userRolesClaims = User.FindAll("https://grocery-management-api/roles")
                                    .Select(c => c.Value)
                                    .ToList();
            
            var userRoles = ParseUserRoles(userRolesClaims);
            var groceryRole = userRoles.FirstOrDefault(r => r.GroceryId == groceryId);
            
            var isSuperAdmin = User.HasClaim("https://grocery-management-api/is_super_admin", "true");

            return Ok(new
            {
                GroceryId = groceryId,
                Role = groceryRole?.Role ?? (isSuperAdmin ? "super_admin" : null),
                HasAccess = groceryRole != null || isSuperAdmin,
                IsSuperAdmin = isSuperAdmin
            });
        }

        [HttpGet("user-groceries")]
        public IActionResult GetUserGroceries()
        {
            var userRolesClaims = User.FindAll("https://grocery-management-api/roles")
                                    .Select(c => c.Value)
                                    .ToList();
            
            var userRoles = ParseUserRoles(userRolesClaims);
            var isSuperAdmin = User.HasClaim("https://grocery-management-api/is_super_admin", "true");

            if (isSuperAdmin)
            {
                // SuperAdmin tiene acceso a todos los groceries
                // Aquí deberías obtener todos los groceries de la BD
                return Ok(new
                {
                    IsSuperAdmin = true,
                    HasAccessToAll = true,
                    Groceries = GetAllGroceries(), // Mock por ahora
                    Roles = userRoles
                });
            }

            return Ok(new
            {
                IsSuperAdmin = false,
                HasAccessToAll = false,
                Groceries = userRoles.Select(r => new { 
                    GroceryId = r.GroceryId, 
                    Role = r.Role 
                }),
                Roles = userRoles
            });
        }

        private List<UserGroceryRole> ParseUserRoles(List<string> rolesClaims)
        {
            var roles = new List<UserGroceryRole>();
            
            foreach (var claim in rolesClaims)
            {
                try
                {
                    // Intentar parsear como JSON si está en ese formato
                    if (claim.StartsWith("{") || claim.StartsWith("["))
                    {
                        var jsonRoles = System.Text.Json.JsonSerializer.Deserialize<UserGroceryRole[]>(claim);
                        if (jsonRoles != null)
                        {
                            roles.AddRange(jsonRoles);
                        }
                    }
                    else
                    {
                        // Formato simple "groceryId:role"
                        var parts = claim.Split(':');
                        if (parts.Length == 2 && int.TryParse(parts[0], out int groceryId))
                        {
                            roles.Add(new UserGroceryRole 
                            { 
                                GroceryId = groceryId, 
                                Role = parts[1] 
                            });
                        }
                    }
                }
                catch
                {
                    // Ignorar claims mal formateados
                    continue;
                }
            }
            
            return roles;
        }

        private object[] GetAllGroceries()
        {
            // Mock de groceries - en producción esto vendría de la BD
            return new object[]
            {
                new { Id = 1, Name = "Verdulería Central", Address = "Av. Principal 123" },
                new { Id = 2, Name = "Frutas del Valle", Address = "Calle Comercio 456" },
                new { Id = 3, Name = "Mercado Fresh", Address = "Plaza Mayor 789" }
            };
        }

        public class UserGroceryRole
        {
            public int GroceryId { get; set; }
            public string Role { get; set; } = string.Empty;
        }

        [HttpGet("check")]
        public IActionResult CheckAuth()
        {
            return Ok(new
            {
                IsAuthenticated = User.Identity?.IsAuthenticated ?? false,
                User = User.Identity?.Name
            });
        }

        [HttpGet("claims")]
        public IActionResult GetClaims()
        {
            var claims = User.Claims.Select(c => new
            {
                Type = c.Type,
                Value = c.Value
            }).ToList();

            return Ok(claims);
        }

        [HttpGet("roles")]
        public IActionResult GetRoles()
        {
            var roles = User.FindAll("https://grocery-management-api/roles")
                          .Select(c => c.Value)
                          .ToList();
            
            var isSuperAdmin = User.HasClaim("https://grocery-management-api/is_super_admin", "true");

            return Ok(new { 
                Roles = roles,
                IsSuperAdmin = isSuperAdmin
            });
        }

        [HttpGet("admin-only")]
        [Authorize(Policy = "AdminOnly")]
        public IActionResult AdminOnlyEndpoint()
        {
            return Ok(new { Message = "This is an admin-only endpoint!" });
        }

        [HttpGet("super-admin-only")]
        [Authorize(Policy = "SuperAdminOnly")]
        public IActionResult SuperAdminOnlyEndpoint()
        {
            return Ok(new { Message = "This is a super admin-only endpoint!" });
        }

        [HttpGet("user-roles/{email}")]
        [AllowAnonymous] // Solo para desarrollo local
        public async Task<IActionResult> GetUserRolesByEmail(string email)
        {
            try
            {
                // Datos mock para desarrollo local - SOLO PARA TESTING
                var mockRoles = GetMockUserRoles(email);
                
                return Ok(mockRoles);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        private object GetMockUserRoles(string email)
        {
            // CAMBIAR ESTOS EMAILS POR LOS REALES
            var mockUsers = new Dictionary<string, object>
            {
                ["tu-email@gmail.com"] = new { // 👈 CAMBIA POR TU EMAIL
                    isSuperAdmin = true,
                    roles = new[] {
                        new { groceryId = 1, role = "super_admin" },
                        new { groceryId = 2, role = "super_admin" },
                        new { groceryId = 3, role = "super_admin" }
                    }
                },
                ["admin@test.com"] = new {
                    isSuperAdmin = false,
                    roles = new[] {
                        new { groceryId = 1, role = "admin" },
                        new { groceryId = 2, role = "staff" }
                    }
                },
                ["staff@test.com"] = new {
                    isSuperAdmin = false,
                    roles = new[] {
                        new { groceryId = 1, role = "staff" }
                    }
                },
                ["manager@test.com"] = new {
                    isSuperAdmin = false,
                    roles = new[] {
                        new { groceryId = 1, role = "admin" },
                        new { groceryId = 2, role = "admin" },
                        new { groceryId = 3, role = "staff" }
                    }
                }
            };

            return mockUsers.ContainsKey(email) 
                ? mockUsers[email] 
                : new { 
                    isSuperAdmin = false, 
                    roles = new[] { new { groceryId = 1, role = "staff" } } 
                };
        }
    }
}
