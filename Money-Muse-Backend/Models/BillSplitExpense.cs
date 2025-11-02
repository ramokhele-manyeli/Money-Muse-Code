using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Money_Muse_Backend.Models
{
    public enum BillSplitExpenseType
    {
        Equal = 0,
        Custom = 1,
        Percentage = 2
    }

    public class BillSplitExpense
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [ForeignKey(nameof(Group))]
        public Guid GroupId { get; set; }
        public BillSplitGroup Group { get; set; } = null!;

        [Required]
        [ForeignKey(nameof(PaidByUser))]
        public int PaidByUserId { get; set; }
        public ApplicationUser PaidByUser { get; set; } = null!;

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }

        [MaxLength(500)]
        public string? Description { get; set; }

        [Required]
        public DateTime Date { get; set; }

        [Required]
        public BillSplitExpenseType SplitType { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}