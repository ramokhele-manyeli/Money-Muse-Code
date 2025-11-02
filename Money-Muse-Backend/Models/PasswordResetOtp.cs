using Money_Muse_Backend.Models;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class PasswordResetOtp
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int UserId { get; set; }
    [ForeignKey("UserId")]
    public ApplicationUser User { get; set; }

    [Required]
    public string OtpCode { get; set; }

    [Required]
    public DateTime Expiry { get; set; }

    public bool IsUsed { get; set; } = false;
}