using Money_Muse_Backend.Data;
using Money_Muse_Backend.DTOs;
using Money_Muse_Backend.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Money_Muse_Backend.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ApplicationDbContext _context;

        public CategoryService(ApplicationDbContext context)
        {
            _context = context;
        }

        private int? GetUserId(ClaimsPrincipal user)
        {
            var claim = user.FindFirst(ClaimTypes.NameIdentifier);
            return claim != null ? int.Parse(claim.Value) : (int?)null;
        }

        public async Task<List<CategoryDto>> GetAllAsync(ClaimsPrincipal user)
        {
            int? userId = GetUserId(user);
            var categories = await _context.Categories
                .Where(c => c.UserId == null || c.UserId == userId)
                .OrderBy(c => c.Name)
                .ToListAsync();

            return categories.Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Icon = c.Icon,
                ColorCode = c.ColorCode,
                Description = c.Description,
                Type = (int)c.Type,
                IsDefault = c.IsDefault
            }).ToList();
        }

        public async Task<CategoryDto?> GetByIdAsync(Guid id, ClaimsPrincipal user)
        {
            int? userId = GetUserId(user);
            var c = await _context.Categories
                .FirstOrDefaultAsync(x => x.Id == id && (x.UserId == null || x.UserId == userId));
            if (c == null) return null;
            return new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Icon = c.Icon,
                ColorCode = c.ColorCode,
                Description = c.Description,
                Type = (int)c.Type,
                IsDefault = c.IsDefault
            };
        }

        public async Task<CategoryDto> CreateAsync(CategoryCreateDto dto, ClaimsPrincipal user)
        {
            int? userId = GetUserId(user);
            var category = new Models.Category
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Name = dto.Name,
                Icon = dto.Icon,
                ColorCode = dto.ColorCode,
                Description = dto.Description,
                Type = (Models.CategoryType)dto.Type,
                IsDefault = false,
                CreatedAt = DateTime.UtcNow
            };
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            return new CategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                Icon = category.Icon,
                ColorCode = category.ColorCode,
                Description = category.Description,
                Type = (int)category.Type,
                IsDefault = category.IsDefault
            };
        }

        public async Task<CategoryDto?> UpdateAsync(Guid id, CategoryUpdateDto dto, ClaimsPrincipal user)
        {
            int? userId = GetUserId(user);
            var c = await _context.Categories.FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);
            if (c == null) return null;

            c.Name = dto.Name;
            c.Icon = dto.Icon;
            c.ColorCode = dto.ColorCode;
            c.Description = dto.Description;
            c.Type = (Models.CategoryType)dto.Type;
            await _context.SaveChangesAsync();

            return new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Icon = c.Icon,
                ColorCode = c.ColorCode,
                Description = c.Description,
                Type = (int)c.Type,
                IsDefault = c.IsDefault,
                UpdatedAt = c.UpdatedAt
            };
        }

        public async Task<bool> DeleteAsync(Guid id, ClaimsPrincipal user)
        {
            int? userId = GetUserId(user);
            var c = await _context.Categories.FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);
            if (c == null) return false;
            _context.Categories.Remove(c);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<CategoryDto>> GetDefaultsAsync()
        {
            var categories = await _context.Categories
                .Where(c => c.UserId == null)
                .OrderBy(c => c.Name)
                .ToListAsync();

            return categories.Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Icon = c.Icon,
                ColorCode = c.ColorCode,
                Description = c.Description,
                Type = (int)c.Type,
                IsDefault = c.IsDefault
            }).ToList();
        }

        public async Task<List<CategoryDto>> GetUserCategoriesAsync(ClaimsPrincipal user)
        {
            int? userId = GetUserId(user);
            if (userId == null)
                return new List<CategoryDto>();

            var categories = await _context.Categories
                .Where(c => c.UserId == userId && !c.IsDefault)
                .OrderBy(c => c.Name)
                .ToListAsync();

            return categories.Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Icon = c.Icon,
                ColorCode = c.ColorCode,
                Description = c.Description,
                Type = (int)c.Type,
                IsDefault = c.IsDefault
            }).ToList();
        }
    }
}