using Money_Muse_Backend.Models;
using Money_Muse_Backend.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Money_Muse_Backend.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Http;
using System.IO;
using Money_Muse_Backend.DTOs;

public class UserService : IUserService
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public UserService(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    public async Task<UserProfileDto> GetCurrentUserProfileAsync(int userId)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null) throw new Exception("User not found");

        return new UserProfileDto
        {
            FirstName = user.FirstName,
            LastName = user.LastName,
            Currency = user.Currency,
            DateFormat = user.DateFormat,
            Bio = user.Bio,
            ProfilePictureUrl = user.ProfilePictureUrl
        };
    }

    public async Task UpdateUserProfileAsync(int userId, UserProfileDto dto)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null) throw new Exception("User not found");

        user.FirstName = dto.FirstName;
        user.LastName = dto.LastName;
        user.Currency = dto.Currency;
        user.DateFormat = dto.DateFormat;
        user.Bio = dto.Bio;
        user.ProfilePictureUrl = dto.ProfilePictureUrl;
        user.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
    }

    public async Task ChangePasswordAsync(int userId, string currentPassword, string newPassword)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null) throw new Exception("User not found");
        var result = await _userManager.ChangePasswordAsync(user, currentPassword, newPassword);
        if (!result.Succeeded)
            throw new Exception(string.Join("; ", result.Errors.Select(e => e.Description)));
    }

    public async Task DeleteAccountAsync(int userId)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null) throw new Exception("User not found");
        var result = await _userManager.DeleteAsync(user);
        if (!result.Succeeded)
            throw new Exception(string.Join("; ", result.Errors.Select(e => e.Description)));
    }

    public async Task<string> UploadProfilePictureAsync(int userId, IFormFile file)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null) throw new Exception("User not found");

        // Save file to wwwroot/profile-pics (ensure this folder exists and is writable)
        var uploads = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "profile-pics");
        Directory.CreateDirectory(uploads);
        var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
        var filePath = Path.Combine(uploads, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        // Set the URL (adjust if you use a CDN or external storage)
        user.ProfilePictureUrl = $"/profile-pics/{fileName}";
        await _context.SaveChangesAsync();

        return user.ProfilePictureUrl;
    }

    public async Task<UserStatsDto> GetUserStatsAsync(int userId)
    {
        // Example: implement your own stats logic
        var transactionsCount = await _context.Transactions.CountAsync(t => t.UserId == userId);
        var budgetsCount = await _context.Budgets.CountAsync(b => b.UserId == userId);
        return new UserStatsDto
        {
            TransactionsCount = transactionsCount,
            BudgetsCount = budgetsCount
        };
    }
}
