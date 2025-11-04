using System;
using System.ComponentModel.DataAnnotations;

namespace Money_Muse_Backend.DTOs
{
    public class CategoryDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Icon { get; set; } = string.Empty;
        public string ColorCode { get; set; } = string.Empty;
        public string? Description { get; set; } = string.Empty;
        public int Type { get; set; }
        public bool IsDefault { get; set; }
        public DateTime UpdatedAt { get; set; } // <-- Add this line
    }

    public class CategoryCreateDto
    {
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
        public int Type { get; set; }
    }

    public class CategoryUpdateDto
    {
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
        public int Type { get; set; }
    }
}