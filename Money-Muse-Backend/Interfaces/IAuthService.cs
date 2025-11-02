using Money_Muse_Backend.DTOs;
using Money_Muse_Backend.Models;

namespace Money_Muse_Backend.Interfaces
{
    public interface IAuthService
    {
        Task<string> GenerateJwtToken(ApplicationUser user);
        Task<AuthResponseDto> RegisterAsync(RegisterDto dto);
        Task<AuthResponseDto> LoginAsync(LoginDto dto);
        Task<AuthResponseDto> RefreshTokenAsync(string refreshToken);
        Task LogoutAsync(string refreshToken);
        Task ForgotPasswordAsync(ForgotPasswordDto dto);
        Task ResetPasswordAsync(ResetPasswordDto dto);
        Task VerifyEmailAsync(string token);
        Task ResendVerificationEmailAsync(ResendVerificationDto dto);
    }
}
