using Money_Muse_Backend.DTOs;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Money_Muse_Backend.Interfaces
{
    public interface IBudgetService
    {
        Task<IEnumerable<BudgetDto>> GetAllAsync(ClaimsPrincipal user);
        Task<BudgetDto?> GetByIdAsync(Guid id, ClaimsPrincipal user);
        Task<BudgetDto> CreateAsync(BudgetCreateDto dto, ClaimsPrincipal user);
        Task<BudgetDto?> UpdateAsync(Guid id, BudgetUpdateDto dto, ClaimsPrincipal user);
        Task<bool> DeleteAsync(Guid id, ClaimsPrincipal user);
        Task<BudgetOverviewDto> GetOverviewAsync(int month, int year, ClaimsPrincipal user);
        Task<BudgetProgressDto?> GetProgressAsync(Guid id, ClaimsPrincipal user);
    }
}