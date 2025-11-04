using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Money_Muse_Backend.Models
{
    public enum CategoryType
    {
        Income = 0,
        Expense = 1,
        Both = 2
    }

    public class Category
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; } = Guid.NewGuid();

        // Nullable: null = system default, not null = user custom
        public int? UserId { get; set; }
        public ApplicationUser? User { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(100)]
        public string Icon { get; set; } = string.Empty;

        [MaxLength(20)]
        public string ColorCode { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; } = string.Empty;

        [Required]
        public CategoryType Type { get; set; }

        public bool IsDefault { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}