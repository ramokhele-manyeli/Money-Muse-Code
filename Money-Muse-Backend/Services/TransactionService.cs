using Money_Muse_Backend.Data;
using Money_Muse_Backend.DTOs;
using Money_Muse_Backend.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Money_Muse_Backend.Services
{
    public class TransactionService : ITransactionService
    {
        private readonly ApplicationDbContext _context;

        public TransactionService(ApplicationDbContext context)
        {
            _context = context;
        }

        private int GetUserId(ClaimsPrincipal user)
        {
            return int.Parse(user.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        }

        public async Task<PaginatedResultDto<TransactionDto>> GetAllAsync(TransactionQueryDto query, ClaimsPrincipal user)
        {
            int userId = GetUserId(user);
            var transactions = _context.Transactions
                .Where(t => t.UserId == userId && !t.IsDeleted);

            if (query.CategoryId.HasValue)
                transactions = transactions.Where(t => t.CategoryId == query.CategoryId.Value);
            if (query.Type.HasValue)
                transactions = transactions.Where(t => (int)t.Type == query.Type.Value);
            if (query.From.HasValue)
                transactions = transactions.Where(t => t.Date >= query.From.Value);
            if (query.To.HasValue)
                transactions = transactions.Where(t => t.Date <= query.To.Value);
            if (!string.IsNullOrEmpty(query.Search))
                transactions = transactions.Where(t => t.Description.Contains(query.Search));

            // Sorting
            if (!string.IsNullOrEmpty(query.SortBy))
            {
                transactions = query.SortBy.ToLower() switch
                {
                    "amount" => query.Desc ? transactions.OrderByDescending(t => t.Amount) : transactions.OrderBy(t => t.Amount),
                    "date" => query.Desc ? transactions.OrderByDescending(t => t.Date) : transactions.OrderBy(t => t.Date),
                    _ => transactions.OrderByDescending(t => t.Date)
                };
            }
            else
            {
                transactions = transactions.OrderByDescending(t => t.Date);
            }

            int total = await transactions.CountAsync();
            var items = await transactions
                .Skip((query.Page - 1) * query.PageSize)
                .Take(query.PageSize)
                .Include(t => t.Category)
                .Select(t => new TransactionDto
                {
                    Id = t.Id,
                    Amount = t.Amount,
                    Description = t.Description,
                    CategoryId = t.CategoryId,
                    CategoryName = t.Category.Name,
                    Date = t.Date,
                    ReceiptUrl = t.ReceiptUrl,
                    IsRecurring = t.IsRecurring,
                    Notes = t.Notes,
                    CreatedAt = t.CreatedAt,
                    UpdatedAt = t.UpdatedAt,
                    Type = (int)t.Type
                })
                .ToListAsync();

            return new PaginatedResultDto<TransactionDto>
            {
                Page = query.Page,
                PageSize = query.PageSize,
                TotalCount = total,
                Items = items
            };
        }

        public async Task<TransactionDto?> GetByIdAsync(Guid id, ClaimsPrincipal user)
        {
            int userId = GetUserId(user);
            var t = await _context.Transactions
                .Include(x => x.Category)
                .FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId && !x.IsDeleted);

            if (t == null) return null;

            return new TransactionDto
            {
                Id = t.Id,
                Amount = t.Amount,
                Description = t.Description,
                CategoryId = t.CategoryId,
                CategoryName = t.Category.Name,
                Date = t.Date,
                ReceiptUrl = t.ReceiptUrl,
                IsRecurring = t.IsRecurring,
                Notes = t.Notes,
                CreatedAt = t.CreatedAt,
                UpdatedAt = t.UpdatedAt,
                Type = (int)t.Type
            };
        }

        public async Task<TransactionDto> CreateAsync(TransactionCreateDto dto, ClaimsPrincipal user)
        {
            int userId = GetUserId(user);
            var transaction = new Models.Transaction
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Amount = dto.Amount,
                Description = dto.Description,
                CategoryId = dto.CategoryId,
                Date = dto.Date,
                IsRecurring = dto.IsRecurring,
                Notes = dto.Notes,
                Type = (Models.TransactionType)dto.Type,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            _context.Transactions.Add(transaction);
            await _context.SaveChangesAsync();

            // Load category name
            var category = await _context.Categories.FindAsync(dto.CategoryId);

            return new TransactionDto
            {
                Id = transaction.Id,
                Amount = transaction.Amount,
                Description = transaction.Description,
                CategoryId = transaction.CategoryId,
                CategoryName = category?.Name ?? "",
                Date = transaction.Date,
                ReceiptUrl = transaction.ReceiptUrl,
                IsRecurring = transaction.IsRecurring,
                Notes = transaction.Notes,
                CreatedAt = transaction.CreatedAt,
                UpdatedAt = transaction.UpdatedAt,
                Type = (int)transaction.Type
            };
        }

        public async Task<TransactionDto?> UpdateAsync(Guid id, TransactionUpdateDto dto, ClaimsPrincipal user)
        {
            int userId = GetUserId(user);
            var t = await _context.Transactions.FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId && !x.IsDeleted);
            if (t == null) return null;

            t.Amount = dto.Amount;
            t.Description = dto.Description;
            t.CategoryId = dto.CategoryId;
            t.Date = dto.Date;
            t.IsRecurring = dto.IsRecurring;
            t.Notes = dto.Notes;
            t.Type = (Models.TransactionType)dto.Type;
            t.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            var category = await _context.Categories.FindAsync(dto.CategoryId);

            return new TransactionDto
            {
                Id = t.Id,
                Amount = t.Amount,
                Description = t.Description,
                CategoryId = t.CategoryId,
                CategoryName = category?.Name ?? "",
                Date = t.Date,
                ReceiptUrl = t.ReceiptUrl,
                IsRecurring = t.IsRecurring,
                Notes = t.Notes,
                CreatedAt = t.CreatedAt,
                UpdatedAt = t.UpdatedAt,
                Type = (int)t.Type
            };
        }

        public async Task<bool> DeleteAsync(Guid id, ClaimsPrincipal user)
        {
            int userId = GetUserId(user);
            var t = await _context.Transactions.FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId && !x.IsDeleted);
            if (t == null) return false;
            t.IsDeleted = true;
            t.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<BulkCreateResultDto> BulkCreateAsync(TransactionBulkCreateDto dto, ClaimsPrincipal user)
        {
            int userId = GetUserId(user);
            var created = new List<TransactionDto>();
            var errors = new List<string>();

            foreach (var item in dto.Transactions)
            {
                try
                {
                    var transaction = new Models.Transaction
                    {
                        Id = Guid.NewGuid(),
                        UserId = userId,
                        Amount = item.Amount,
                        Description = item.Description,
                        CategoryId = item.CategoryId,
                        Date = item.Date,
                        IsRecurring = item.IsRecurring,
                        Notes = item.Notes,
                        Type = (Models.TransactionType)item.Type,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };
                    _context.Transactions.Add(transaction);

                    var category = await _context.Categories.FindAsync(item.CategoryId);

                    created.Add(new TransactionDto
                    {
                        Id = transaction.Id,
                        Amount = transaction.Amount,
                        Description = transaction.Description,
                        CategoryId = transaction.CategoryId,
                        CategoryName = category?.Name ?? "",
                        Date = transaction.Date,
                        ReceiptUrl = transaction.ReceiptUrl,
                        IsRecurring = transaction.IsRecurring,
                        Notes = transaction.Notes,
                        CreatedAt = transaction.CreatedAt,
                        UpdatedAt = transaction.UpdatedAt,
                        Type = (int)transaction.Type
                    });
                }
                catch (Exception ex)
                {
                    errors.Add($"Failed to add transaction: {ex.Message}");
                }
            }
            await _context.SaveChangesAsync();

            return new BulkCreateResultDto
            {
                CreatedCount = created.Count,
                Created = created,
                Errors = errors
            };
        }

        public async Task<string> UploadReceiptAsync(Guid id, IFormFile file, ClaimsPrincipal user)
        {
            int userId = GetUserId(user);
            var t = await _context.Transactions.FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId && !x.IsDeleted);
            if (t == null) throw new Exception("Transaction not found.");

            // Save file to disk or cloud storage (example: local wwwroot/receipts)
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "receipts");
            Directory.CreateDirectory(uploadsFolder);
            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Save URL to transaction
            t.ReceiptUrl = $"/receipts/{fileName}";
            t.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return t.ReceiptUrl;
        }

        public async Task<TransactionSummaryDto> GetSummaryAsync(TransactionSummaryQueryDto query, ClaimsPrincipal user)
        {
            int userId = GetUserId(user);
            var transactions = _context.Transactions
                .Where(t => t.UserId == userId && !t.IsDeleted);

            if (query.CategoryId.HasValue)
                transactions = transactions.Where(t => t.CategoryId == query.CategoryId.Value);
            if (query.From.HasValue)
                transactions = transactions.Where(t => t.Date >= query.From.Value);
            if (query.To.HasValue)
                transactions = transactions.Where(t => t.Date <= query.To.Value);

            var totalIncome = await transactions.Where(t => t.Type == Models.TransactionType.Income).SumAsync(t => (decimal?)t.Amount) ?? 0;
            var totalExpense = await transactions.Where(t => t.Type == Models.TransactionType.Expense).SumAsync(t => (decimal?)t.Amount) ?? 0;
            var count = await transactions.CountAsync();

            return new TransactionSummaryDto
            {
                TotalIncome = totalIncome,
                TotalExpense = totalExpense,
                TransactionCount = count
            };
        }

        public async Task<TransactionTrendsDto> GetTrendsAsync(TransactionTrendsQueryDto query, ClaimsPrincipal user)
        {
            int userId = GetUserId(user);
            var transactions = _context.Transactions
                .Where(t => t.UserId == userId && !t.IsDeleted);

            if (query.CategoryId.HasValue)
                transactions = transactions.Where(t => t.CategoryId == query.CategoryId.Value);
            if (query.Type.HasValue)
                transactions = transactions.Where(t => (int)t.Type == query.Type.Value);
            if (query.From.HasValue)
                transactions = transactions.Where(t => t.Date >= query.From.Value);
            if (query.To.HasValue)
                transactions = transactions.Where(t => t.Date <= query.To.Value);

            var interval = (query.Interval ?? "month").ToLower();

            if (interval == "week")
            {
                var grouped = await transactions
                    .GroupBy(t => EF.Functions.DateDiffWeek(DateTime.UnixEpoch, t.Date))
                    .Select(g => new
                    {
                        WeekNumber = g.Key,
                        Total = g.Sum(t => t.Amount)
                    })
                    .OrderBy(x => x.WeekNumber)
                    .ToListAsync();

                var points = grouped.Select(x => new TransactionTrendsDto.TrendPoint
                {
                    Period = DateTime.UnixEpoch.AddDays(x.WeekNumber * 7),
                    Total = x.Total
                }).ToList();

                return new TransactionTrendsDto { Points = points };
            }
            else
            {
                var grouped = await transactions
                    .GroupBy(t => new { t.Date.Year, t.Date.Month })
                    .Select(g => new
                    {
                        Period = new DateTime(g.Key.Year, g.Key.Month, 1),
                        Total = g.Sum(t => t.Amount)
                    })
                    .OrderBy(x => x.Period)
                    .ToListAsync();

                var points = grouped.Select(x => new TransactionTrendsDto.TrendPoint
                {
                    Period = x.Period,
                    Total = x.Total
                }).ToList();

                return new TransactionTrendsDto { Points = points };
            }
        }
    }
}