using Money_Muse_Backend.DTOs;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Money_Muse_Backend.Interfaces
{
    public interface ICategoryService
    {
        Task<List<CategoryDto>> GetAllAsync(ClaimsPrincipal user);
        Task<CategoryDto?> GetByIdAsync(Guid id, ClaimsPrincipal user);
        Task<CategoryDto> CreateAsync(CategoryCreateDto dto, ClaimsPrincipal user);
        Task<CategoryDto?> UpdateAsync(Guid id, CategoryUpdateDto dto, ClaimsPrincipal user);
        Task<bool> DeleteAsync(Guid id, ClaimsPrincipal user);
        Task<List<CategoryDto>> GetDefaultsAsync();
        Task<List<CategoryDto>> GetUserCategoriesAsync(ClaimsPrincipal user);
    }
}