using Microsoft.AspNetCore.Identity;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Money_Muse_Backend.Models
{
    public enum MoneyPersonalityType
    {
        NotSet = 0,
        ImpulseBuyer = 1,
        Hoarder = 2,
        TreatYourself = 3,
        InvestmentNerd = 4,
        SubscriptionAddict = 5
    }

    public class ApplicationUser : IdentityUser<int>
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid UserGuid { get; set; } = Guid.NewGuid();

        [MaxLength(100)]
        public string FirstName { get; set; } = string.Empty;

        [MaxLength(100)]
        public string LastName { get; set; } = string.Empty;

        [MaxLength(10)]
        public string Currency { get; set; } = "ZAR";

        [MaxLength(20)]
        public string DateFormat { get; set; } = "MM/dd/yyyy";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public bool IsEmailVerified { get; set; } = false;

        public MoneyPersonalityType MoneyPersonalityType { get; set; } = MoneyPersonalityType.NotSet;

        public DateTime? LastLoginAt { get; set; }
    }
}
