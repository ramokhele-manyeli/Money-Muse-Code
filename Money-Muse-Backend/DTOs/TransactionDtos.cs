using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace Money_Muse_Backend.DTOs
{
    public class TransactionDto
    {
        public Guid Id { get; set; }
        public decimal Amount { get; set; }
        public string? Description { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public string? ReceiptUrl { get; set; }
        public bool IsRecurring { get; set; }
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public int Type { get; set; }
    }

    public class TransactionQueryDto
    {
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 20;
        public string? SortBy { get; set; }
        public bool Desc { get; set; } = false;
        public int? CategoryId { get; set; }
        public int? Type { get; set; }
        public DateTime? From { get; set; }
        public DateTime? To { get; set; }
        public string? Search { get; set; }
    }

    public class TransactionCreateDto
    {
        [Required]
        public decimal Amount { get; set; }
        public string? Description { get; set; }
        [Required]
        public int CategoryId { get; set; }
        [Required]
        public DateTime Date { get; set; }
        public bool IsRecurring { get; set; }
        public string? Notes { get; set; }
        [Required]
        public int Type { get; set; }
    }

    public class TransactionUpdateDto
    {
        [Required]
        public decimal Amount { get; set; }
        public string? Description { get; set; }
        [Required]
        public int CategoryId { get; set; }
        [Required]
        public DateTime Date { get; set; }
        public bool IsRecurring { get; set; }
        public string? Notes { get; set; }
        [Required]
        public int Type { get; set; }
    }

    public class TransactionBulkCreateDto
    {
        [Required]
        public List<TransactionCreateDto> Transactions { get; set; } = new();
    }

    public class BulkCreateResultDto
    {
        public int CreatedCount { get; set; }
        public List<TransactionDto> Created { get; set; } = new();
        public List<string> Errors { get; set; } = new();
    }

    public class UploadReceiptDto : IValidatableObject
    {
        public IFormFile File { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (File == null)
            {
                yield return new ValidationResult("File is required.", new[] { nameof(File) });
                yield break;
            }
            const long maxSize = 5 * 1024 * 1024;
            if (File.Length > maxSize)
                yield return new ValidationResult("File size must not exceed 5MB.", new[] { nameof(File) });

            var allowedTypes = new[] { "image/jpeg", "image/png", "application/pdf" };
            if (!allowedTypes.Contains(File.ContentType))
                yield return new ValidationResult("Only JPEG, PNG, or PDF files are allowed.", new[] { nameof(File) });
        }
    }

    public class TransactionSummaryQueryDto
    {
        public DateTime? From { get; set; }
        public DateTime? To { get; set; }
        public int? CategoryId { get; set; }
    }

    public class TransactionSummaryDto
    {
        public decimal TotalIncome { get; set; }
        public decimal TotalExpense { get; set; }
        public int TransactionCount { get; set; }
    }

    public class TransactionTrendsQueryDto
    {
        public DateTime? From { get; set; }
        public DateTime? To { get; set; }
        public int? CategoryId { get; set; }
        public int? Type { get; set; }
        public string? Interval { get; set; } // e.g., "month", "week"
    }

    public class TransactionTrendsDto
    {
        public List<TrendPoint> Points { get; set; } = new();
        public class TrendPoint
        {
            public DateTime Period { get; set; }
            public decimal Total { get; set; }
        }
    }

    public class PaginatedResultDto<T>
    {
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }
        public List<T> Items { get; set; } = new();
    }
}