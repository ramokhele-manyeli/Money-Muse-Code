using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Money_Muse_Backend.Models
{
    public class FinancialHealthScore
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [ForeignKey(nameof(User))]
        public int UserId { get; set; }
        public ApplicationUser User { get; set; } = null!;

        [Required]
        [Range(0, 100)]
        public int OverallScore { get; set; }

        [Required]
        public int EmergencyFundScore { get; set; }

        [Required]
        public int BudgetAdherenceScore { get; set; }

        [Required]
        public int SavingsRateScore { get; set; }

        [Required]
        public int DebtManagementScore { get; set; }

        [Required]
        public DateTime CalculatedAt { get; set; }

        [Required]
        [Range(1, 12)]
        public int Month { get; set; }

        [Required]
        public int Year { get; set; }
    }
}