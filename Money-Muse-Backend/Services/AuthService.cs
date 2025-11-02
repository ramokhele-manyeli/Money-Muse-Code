using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Money_Muse_Backend.Data;
using Money_Muse_Backend.DTOs;
using Money_Muse_Backend.Interfaces;
using Money_Muse_Backend.Models;

namespace Money_Muse_Backend.Services
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly EmailService _emailService;

        public AuthService(ApplicationDbContext context, UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, EmailService emailService)
        {
            _context = context;
            _userManager = userManager;
            _signInManager = signInManager;
            _emailService = emailService;
        }

        public async Task<string> GenerateJwtToken(ApplicationUser user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.UserName ?? string.Empty),
                new Claim(ClaimTypes.Role, "User")
            };

            var jwtSecret = Environment.GetEnvironmentVariable("JWT_SECRET_KEY")
                ?? throw new InvalidOperationException("JWT secret missing.");

            var issuer = Environment.GetEnvironmentVariable("JWT_ISSUER") ?? "MoneyMuse.Development";
            var audience = Environment.GetEnvironmentVariable("JWT_AUDIENCE") ?? "MoneyMuse.API.Development";

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var expires = DateTime.UtcNow.AddHours(2);
            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: expires,
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
        {
            var user = new ApplicationUser
            {
                UserName = dto.Email,
                Email = dto.Email,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
                throw new Exception(string.Join("; ", result.Errors.Select(e => e.Description)));

            var token = await GenerateJwtToken(user);
            var refreshToken = await GenerateAndStoreRefreshToken(user);
            return new AuthResponseDto { Token = token, RefreshToken = refreshToken.Token, ExpiresAt = refreshToken.ExpiresAt };
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null)
                throw new Exception("Invalid credentials");
            var result = await _signInManager.CheckPasswordSignInAsync(user, dto.Password, false);
            if (!result.Succeeded)
                throw new Exception("Invalid credentials");
            var token = await GenerateJwtToken(user);
            var refreshToken = await GenerateAndStoreRefreshToken(user);
            return new AuthResponseDto { Token = token, RefreshToken = refreshToken.Token, ExpiresAt = refreshToken.ExpiresAt };
        }

        public async Task<AuthResponseDto> RefreshTokenAsync(string refreshToken)
        {
            var tokenEntity = await _context.RefreshTokens.Include(r => r.User).FirstOrDefaultAsync(r => r.Token == refreshToken);
            if (tokenEntity == null || tokenEntity.IsRevoked || tokenEntity.IsExpired)
                throw new Exception("Invalid or expired refresh token");
            var user = tokenEntity.User;
            var token = await GenerateJwtToken(user);
            var newRefreshToken = await GenerateAndStoreRefreshToken(user);
            tokenEntity.RevokedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return new AuthResponseDto { Token = token, RefreshToken = newRefreshToken.Token, ExpiresAt = newRefreshToken.ExpiresAt };
        }

        public async Task LogoutAsync(string refreshToken)
        {
            var tokenEntity = await _context.RefreshTokens.FirstOrDefaultAsync(r => r.Token == refreshToken);
            if (tokenEntity != null && !tokenEntity.IsRevoked)
            {
                tokenEntity.RevokedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }
        }

        private async Task<RefreshToken> GenerateAndStoreRefreshToken(ApplicationUser user)
        {
            var refreshToken = new RefreshToken
            {
                Token = Guid.NewGuid().ToString(),
                UserId = user.Id,
                ExpiresAt = DateTime.UtcNow.AddDays(7),
                CreatedAt = DateTime.UtcNow
            };
            _context.RefreshTokens.Add(refreshToken);
            await _context.SaveChangesAsync();
            return refreshToken;
        }

        public async Task<bool> SendForgotPasswordOtpAsync(string email)
        {
            if (string.IsNullOrEmpty(email))
                return false;

            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
                return false;

            var otp = new Random().Next(100000, 999999).ToString();

            var otpEntity = new PasswordResetOtp
            {
                UserId = user.Id,
                OtpCode = otp,
                Expiry = DateTime.UtcNow.AddMinutes(10),
                IsUsed = false
            };
            _context.PasswordResetOtps.Add(otpEntity);
            await _context.SaveChangesAsync();

            var message = $"Your Money Muse OTP code is: {otp}";
            await _emailService.SendEmailAsync(user.Email, "Password Reset OTP", message);
            return true;
        }

        public async Task ResetPasswordAsync(ResetPasswordDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null)
                throw new Exception("Invalid email");
            var result = await _userManager.ResetPasswordAsync(user, dto.Token, dto.NewPassword);
            if (!result.Succeeded)
                throw new Exception(string.Join("; ", result.Errors.Select(e => e.Description)));
        }

        public async Task VerifyEmailAsync(string token)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.SecurityStamp == token);
            if (user == null)
                throw new Exception("Invalid token");
            user.EmailConfirmed = true;
            await _context.SaveChangesAsync();
        }

        public async Task ResendVerificationEmailAsync(ResendVerificationDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null)
                return;

            var otp = new Random().Next(100000, 999999).ToString();

            var otpEntity = new EmailVerificationOtp
            {
                UserId = user.Id,
                OtpCode = otp,
                Expiry = DateTime.UtcNow.AddMinutes(10),
                IsUsed = false
            };
            _context.EmailVerificationOtps.Add(otpEntity);
            await _context.SaveChangesAsync();

            var message = $"Your Money Muse email verification OTP code is: {otp}";
            await _emailService.SendEmailAsync(user.Email, "Email Verification OTP", message);
        }

        public async Task ForgotPasswordAsync(ForgotPasswordDto dto)
        {
            // Use the OTP-based method for password reset
            var sent = await SendForgotPasswordOtpAsync(dto.Email);
            return;
        }
    }
}
