using Money_Muse_Backend.DTOs;
using Money_Muse_Backend.Interfaces;
using Money_Muse_Backend.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Money_Muse_Backend.Data;

namespace Money_Muse_Backend.Services
{
    public class BudgetService : IBudgetService
    {
        private readonly ApplicationDbContext _context;

        public BudgetService(ApplicationDbContext context)
        {
            _context = context;
        }

        private int GetUserId(ClaimsPrincipal user)
        {
            return int.Parse(user.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        }

        public async Task<IEnumerable<BudgetDto>> GetAllAsync(ClaimsPrincipal user)
        {
            var userId = GetUserId(user);
            return await _context.Budgets
                .Where(b => b.UserId == userId)
                .Include(b => b.Category)
                .Select(b => new BudgetDto
                {
                    Id = b.Id,
                    CategoryId = b.CategoryId,
                    CategoryName = b.Category.Name,
                    Amount = b.Amount,
                    Month = b.Month,
                    Year = b.Year,
                    RolloverEnabled = b.RolloverEnabled,
                    CreatedAt = b.CreatedAt,
                    UpdatedAt = b.UpdatedAt
                })
                .ToListAsync();
        }

        public async Task<BudgetDto?> GetByIdAsync(Guid id, ClaimsPrincipal user)
        {
            var userId = GetUserId(user);
            var budget = await _context.Budgets
                .Include(b => b.Category)
                .FirstOrDefaultAsync(b => b.Id == id && b.UserId == userId);

            if (budget == null) return null;

            return new BudgetDto
            {
                Id = budget.Id,
                CategoryId = budget.CategoryId,
                CategoryName = budget.Category.Name,
                Amount = budget.Amount,
                Month = budget.Month,
                Year = budget.Year,
                RolloverEnabled = budget.RolloverEnabled,
                CreatedAt = budget.CreatedAt,
                UpdatedAt = budget.UpdatedAt
            };
        }

        public async Task<BudgetDto> CreateAsync(BudgetCreateDto dto, ClaimsPrincipal user)
        {
            var userId = GetUserId(user);

            // Check for duplicate budget for same category/month/year
            var exists = await _context.Budgets.AnyAsync(b =>
                b.UserId == userId &&
                b.CategoryId == dto.CategoryId &&
                b.Month == dto.Month &&
                b.Year == dto.Year);

            if (exists)
                throw new InvalidOperationException("Budget for this category and period already exists.");

            var budget = new Budget
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                CategoryId = dto.CategoryId,
                Amount = dto.Amount,
                Month = dto.Month,
                Year = dto.Year,
                RolloverEnabled = dto.RolloverEnabled,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Budgets.Add(budget);
            await _context.SaveChangesAsync();

            // Load category for DTO
            var category = await _context.Categories.FindAsync(dto.CategoryId);

            return new BudgetDto
            {
                Id = budget.Id,
                CategoryId = budget.CategoryId,
                CategoryName = category?.Name ?? "",
                Amount = budget.Amount,
                Month = budget.Month,
                Year = budget.Year,
                RolloverEnabled = budget.RolloverEnabled,
                CreatedAt = budget.CreatedAt,
                UpdatedAt = budget.UpdatedAt
            };
        }

        public async Task<BudgetDto?> UpdateAsync(Guid id, BudgetUpdateDto dto, ClaimsPrincipal user)
        {
            var userId = GetUserId(user);
            var budget = await _context.Budgets
                .Include(b => b.Category)
                .FirstOrDefaultAsync(b => b.Id == id && b.UserId == userId);

            if (budget == null) return null;

            budget.Amount = dto.Amount;
            budget.Month = dto.Month;
            budget.Year = dto.Year;
            budget.RolloverEnabled = dto.RolloverEnabled;
            budget.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return new BudgetDto
            {
                Id = budget.Id,
                CategoryId = budget.CategoryId,
                CategoryName = budget.Category.Name,
                Amount = budget.Amount,
                Month = budget.Month,
                Year = budget.Year,
                RolloverEnabled = budget.RolloverEnabled,
                CreatedAt = budget.CreatedAt,
                UpdatedAt = budget.UpdatedAt
            };
        }

        public async Task<bool> DeleteAsync(Guid id, ClaimsPrincipal user)
        {
            var userId = GetUserId(user);
            var budget = await _context.Budgets.FirstOrDefaultAsync(b => b.Id == id && b.UserId == userId);
            if (budget == null) return false;

            _context.Budgets.Remove(budget);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<BudgetOverviewDto> GetOverviewAsync(int month, int year, ClaimsPrincipal user)
        {
            var userId = GetUserId(user);

            var budgets = await _context.Budgets
                .Where(b => b.UserId == userId && b.Month == month && b.Year == year)
                .Include(b => b.Category) // Include category to ensure it's loaded
                .ToListAsync();

            var categoryIds = budgets.Select(b => b.CategoryId).ToList();

            // Calculate total spent for all categories in this budget period
            var categoryIdInts = categoryIds.Select(guid => 
            {
                if (Guid.TryParse(guid.ToString(), out var parsedGuid))
                    return int.TryParse(parsedGuid.ToString(), out var intVal) ? intVal : -1;
                return -1;
            }).ToList();

            var totalSpent = await _context.Transactions
                .Where(t => t.UserId == userId
                    && t.Date.Month == month
                    && t.Date.Year == year
                    && categoryIdInts.Contains(t.CategoryId))
                .SumAsync(t => (decimal?)t.Amount) ?? 0;

            var totalBudgeted = budgets.Sum(b => b.Amount);

            return new BudgetOverviewDto
            {
                TotalBudgeted = totalBudgeted,
                TotalSpent = totalSpent,
                Remaining = totalBudgeted - totalSpent,
                Month = month,
                Year = year
            };
        }

        public async Task<BudgetProgressDto?> GetProgressAsync(Guid id, ClaimsPrincipal user)
        {
            var userId = GetUserId(user);
            var budget = await _context.Budgets
                .Include(b => b.Category)
                .FirstOrDefaultAsync(b => b.Id == id && b.UserId == userId);

            if (budget == null) return null;

            // Calculate spent amount for this specific budget's category
            var spent = await _context.Transactions
                .Where(t => t.UserId == userId
                    && t.CategoryId.ToString() == budget.CategoryId.ToString()
                    && t.Date.Month == budget.Month
                    && t.Date.Year == budget.Year)
                .SumAsync(t => (decimal?)t.Amount) ?? 0;

            var remaining = budget.Amount - spent;
            var progressPercent = budget.Amount > 0 ? (double)(spent / budget.Amount) * 100 : 0;

            return new BudgetProgressDto
            {
                BudgetId = budget.Id,
                Amount = budget.Amount,
                Spent = spent,
                Remaining = remaining,
                ProgressPercent = progressPercent
            };
        }
    }
}