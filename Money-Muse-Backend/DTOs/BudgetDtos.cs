using System;
using System.ComponentModel.DataAnnotations;

namespace Money_Muse_Backend.DTOs
{
    public class BudgetDto
    {
        public Guid Id { get; set; }
        public Guid CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
        public bool RolloverEnabled { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class BudgetCreateDto
    {
        [Required]
        public Guid CategoryId { get; set; }
        [Required]
        [Range(0, double.MaxValue)]
        public decimal Amount { get; set; }
        [Required]
        [Range(1, 12)]
        public int Month { get; set; }
        [Required]
        public int Year { get; set; }
        public bool RolloverEnabled { get; set; } = false;
    }

    public class BudgetUpdateDto
    {
        [Required]
        [Range(0, double.MaxValue)]
        public decimal Amount { get; set; }
        [Required]
        [Range(1, 12)]
        public int Month { get; set; }
        [Required]
        public int Year { get; set; }
        public bool RolloverEnabled { get; set; } = false;
    }

    public class BudgetOverviewDto
    {
        public decimal TotalBudgeted { get; set; }
        public decimal TotalSpent { get; set; }
        public decimal Remaining { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
    }

    public class BudgetProgressDto
    {
        public Guid BudgetId { get; set; }
        public decimal Amount { get; set; }
        public decimal Spent { get; set; }
        public decimal Remaining { get; set; }
        public double ProgressPercent { get; set; }
    }
}