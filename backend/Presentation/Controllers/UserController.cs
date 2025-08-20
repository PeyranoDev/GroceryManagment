using Application.Services.Interfaces;
using Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace Presentation.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        public UserController(IUserService userService)
        {
            _userService = userService;
        }
        [HttpPost] 
        public async Task<IActionResult> CreateUser([FromBody] User user)
        {

            if (user == null)
            {
                return BadRequest();
            }

            var newUserId = await _userService.CreateUser(user);

            return Ok(newUserId);
        }

    }
}
