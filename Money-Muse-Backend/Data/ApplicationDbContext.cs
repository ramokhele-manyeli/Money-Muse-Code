using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Money_Muse_Backend.Models;
using Microsoft.AspNetCore.Identity;

namespace Money_Muse_Backend.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser, IdentityRole<int>, int>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Budget> Budgets { get; set; }
        public DbSet<SavingsGoal> SavingsGoals { get; set; }
        public DbSet<SavingsContribution> SavingsContributions { get; set; }
        public DbSet<RecurringTransaction> RecurringTransactions { get; set; }
        public DbSet<BillSplitGroup> BillSplitGroups { get; set; }
        public DbSet<BillSplitGroupMember> BillSplitGroupMembers { get; set; }
        public DbSet<BillSplitExpense> BillSplitExpenses { get; set; }
        public DbSet<BillSplitExpenseSplit> BillSplitExpenseSplits { get; set; }
        public DbSet<UserAlert> UserAlerts { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<FinancialHealthScore> FinancialHealthScores { get; set; }
        public DbSet<Subscription> Subscriptions { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<PasswordResetOtp> PasswordResetOtps { get; set; }
        public DbSet<EmailVerificationOtp> EmailVerificationOtps { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Unique constraint for Budget: (UserId, CategoryId, Month, Year)
            modelBuilder.Entity<Budget>()
                .HasIndex(b => new { b.UserId, b.CategoryId, b.Month, b.Year })
                .IsUnique();

            // Unique constraint for BillSplitGroupMember: (GroupId, UserId)
            modelBuilder.Entity<BillSplitGroupMember>()
                .HasIndex(m => new { m.GroupId, m.UserId })
                .IsUnique();

            // Prevent cascade delete on BillSplitExpenses.GroupId to avoid multiple cascade paths
            modelBuilder.Entity<BillSplitExpense>()
                .HasOne(e => e.Group)
                .WithMany()
                .HasForeignKey(e => e.GroupId)
                .OnDelete(DeleteBehavior.Restrict);

            // Prevent cascade delete on BillSplitGroupMembers.GroupId to avoid multiple cascade paths
            modelBuilder.Entity<BillSplitGroupMember>()
                .HasOne(m => m.Group)
                .WithMany()
                .HasForeignKey(m => m.GroupId)
                .OnDelete(DeleteBehavior.Restrict);

            // Prevent cascade delete on BillSplitExpenseSplits.ExpenseId to avoid multiple cascade paths
            modelBuilder.Entity<BillSplitExpenseSplit>()
                .HasOne(s => s.Expense)
                .WithMany()
                .HasForeignKey(s => s.ExpenseId)
                .OnDelete(DeleteBehavior.Restrict);

            // Seed default categories with static CreatedAt
            var staticCreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc);

            // Seed type categories
            modelBuilder.Entity<Category>().HasData(
                new Category
                {
                    Id = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
                    UserId = null,
                    Name = "Income",
                    Icon = "💰",
                    ColorCode = "#4CAF50",
                    Description = "Categories for income sources.",
                    Type = CategoryType.Income,
                    IsDefault = true,
                    CreatedAt = staticCreatedAt,
                    UpdatedAt = staticCreatedAt
                },
                new Category
                {
                    Id = Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccccc"),
                    UserId = null,
                    Name = "Expense",
                    Icon = "💸",
                    ColorCode = "#F44336",
                    Description = "Categories for expenses.",
                    Type = CategoryType.Expense,
                    IsDefault = true,
                    CreatedAt = staticCreatedAt,
                    UpdatedAt = staticCreatedAt
                },
                new Category
                {
                    Id = Guid.Parse("dddddddd-dddd-dddd-dddd-dddddddddddd"),
                    UserId = null,
                    Name = "Both",
                    Icon = "🔄",
                    ColorCode = "#2196F3",
                    Description = "Categories for both income and expenses.",
                    Type = CategoryType.Both,
                    IsDefault = true,
                    CreatedAt = staticCreatedAt,
                    UpdatedAt = staticCreatedAt
                }
            );

            // Update existing default categories to include Description
            modelBuilder.Entity<Category>().HasData(
                new Category
                {
                    Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                    UserId = null,
                    Name = "Food & Dining",
                    Icon = "🍽️",
                    ColorCode = "",
                    Description = "Expenses for food, restaurants, and dining out.",
                    Type = CategoryType.Expense,
                    IsDefault = true,
                    CreatedAt = staticCreatedAt,
                    UpdatedAt = staticCreatedAt
                },
                new Category
                {
                    Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                    UserId = null,
                    Name = "Transport",
                    Icon = "🚗",
                    ColorCode = "",
                    Description = "Transportation-related expenses.",
                    Type = CategoryType.Expense,
                    IsDefault = true,
                    CreatedAt = staticCreatedAt,
                    UpdatedAt = staticCreatedAt
                },
                new Category
                {
                    Id = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                    UserId = null,
                    Name = "Entertainment",
                    Icon = "🎬",
                    ColorCode = "",
                    Description = "Expenses for movies, music, and other entertainment.",
                    Type = CategoryType.Expense,
                    IsDefault = true,
                    CreatedAt = staticCreatedAt,
                    UpdatedAt = staticCreatedAt
                },
                new Category
                {
                    Id = Guid.Parse("44444444-4444-4444-4444-444444444444"),
                    UserId = null,
                    Name = "Bills & Utilities",
                    Icon = "🏠",
                    ColorCode = "",
                    Description = "Monthly bills and utility payments.",
                    Type = CategoryType.Expense,
                    IsDefault = true,
                    CreatedAt = staticCreatedAt,
                    UpdatedAt = staticCreatedAt
                },
                new Category
                {
                    Id = Guid.Parse("55555555-5555-5555-5555-555555555555"),
                    UserId = null,
                    Name = "Shopping",
                    Icon = "🛍️",
                    ColorCode = "",
                    Description = "Expenses for retail shopping.",
                    Type = CategoryType.Expense,
                    IsDefault = true,
                    CreatedAt = staticCreatedAt,
                    UpdatedAt = staticCreatedAt
                },
                new Category
                {
                    Id = Guid.Parse("66666666-6666-6666-6666-666666666666"),
                    UserId = null,
                    Name = "Healthcare",
                    Icon = "🏥",
                    ColorCode = "",
                    Description = "Medical and healthcare-related expenses.",
                    Type = CategoryType.Expense,
                    IsDefault = true,
                    CreatedAt = staticCreatedAt,
                    UpdatedAt = staticCreatedAt
                },
                new Category
                {
                    Id = Guid.Parse("77777777-7777-7777-7777-777777777777"),
                    UserId = null,
                    Name = "Education",
                    Icon = "🎓",
                    ColorCode = "",
                    Description = "Tuition, books, and other education-related expenses.",
                    Type = CategoryType.Expense,
                    IsDefault = true,
                    CreatedAt = staticCreatedAt,
                    UpdatedAt = staticCreatedAt
                },
                new Category
                {
                    Id = Guid.Parse("88888888-8888-8888-8888-888888888888"),
                    UserId = null,
                    Name = "Fitness",
                    Icon = "💪",
                    ColorCode = "",
                    Description = "Expenses for gym memberships, classes, and equipment.",
                    Type = CategoryType.Expense,
                    IsDefault = true,
                    CreatedAt = staticCreatedAt,
                    UpdatedAt = staticCreatedAt
                },
                new Category
                {
                    Id = Guid.Parse("99999999-9999-9999-9999-999999999999"),
                    UserId = null,
                    Name = "Travel",
                    Icon = "✈️",
                    ColorCode = "",
                    Description = "Expenses for trips, hotels, and travel-related activities.",
                    Type = CategoryType.Expense,
                    IsDefault = true,
                    CreatedAt = staticCreatedAt,
                    UpdatedAt = staticCreatedAt
                },
                new Category
                {
                    Id = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                    UserId = null,
                    Name = "Other",
                    Icon = "⭐",
                    ColorCode = "",
                    Description = "Miscellaneous expenses that don't fit other categories.",
                    Type = CategoryType.Expense,
                    IsDefault = true,
                    CreatedAt = staticCreatedAt,
                    UpdatedAt = staticCreatedAt
                }
            );
        }
    }
}
