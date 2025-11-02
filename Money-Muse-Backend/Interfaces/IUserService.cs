using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Money_Muse_Backend.Interfaces
{
    public interface IUserService
    {
        Task<UserProfileDto> GetCurrentUserProfileAsync(int userId);
        Task UpdateUserProfileAsync(int userId, UserProfileDto dto);
        Task ChangePasswordAsync(int userId, string currentPassword, string newPassword);
        Task DeleteAccountAsync(int userId);
        Task<string> UploadProfilePictureAsync(int userId, IFormFile file);
        Task<UserStatsDto> GetUserStatsAsync(int userId);
    }
}
