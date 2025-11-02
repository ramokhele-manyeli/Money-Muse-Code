using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Money_Muse_Backend.Models;
using Money_Muse_Backend.Interfaces;
using Money_Muse_Backend.DTOs;
using System.Threading.Tasks;

namespace Money_Muse_Backend.Controllers
{
    [ApiController]
    [Route("api/users")]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly UserManager<ApplicationUser> _userManager;

        public UserController(IUserService userService, UserManager<ApplicationUser> userManager)
        {
            _userService = userService;
            _userManager = userManager;
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetMe()
        {
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
            var profile = await _userService.GetCurrentUserProfileAsync(userId);
            return Ok(profile);
        }

        [HttpPut("me")]
        public async Task<IActionResult> UpdateMe([FromBody] UserProfileDto dto)
        {
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
            await _userService.UpdateUserProfileAsync(userId, dto);
            return NoContent();
        }

        [HttpPut("me/password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
        {
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
            await _userService.ChangePasswordAsync(userId, dto.CurrentPassword, dto.NewPassword);
            return NoContent();
        }

        [HttpDelete("me")]
        public async Task<IActionResult> DeleteAccount()
        {
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
            await _userService.DeleteAccountAsync(userId);
            return NoContent();
        }

        [HttpPost("me/avatar")]
        public async Task<IActionResult> UploadProfilePicture([FromForm] UploadProfilePictureDto dto)
        {
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
            var url = await _userService.UploadProfilePictureAsync(userId, dto.File);
            return Ok(new { url });
        }

        [HttpGet("me/stats")]
        public async Task<IActionResult> GetStats()
        {
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
            var stats = await _userService.GetUserStatsAsync(userId);
            return Ok(stats);
        }
    }
}
