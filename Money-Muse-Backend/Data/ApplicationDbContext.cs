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
                .OnDelete(DeleteBehavior.Restrict); // or DeleteBehavior.NoAction

            // Prevent cascade delete on BillSplitGroupMembers.GroupId to avoid multiple cascade paths
            modelBuilder.Entity<BillSplitGroupMember>()
                .HasOne(m => m.Group)
                .WithMany()
                .HasForeignKey(m => m.GroupId)
                .OnDelete(DeleteBehavior.Restrict); // or DeleteBehavior.NoAction

            // Prevent cascade delete on BillSplitExpenseSplits.ExpenseId to avoid multiple cascade paths
            modelBuilder.Entity<BillSplitExpenseSplit>()
                .HasOne(s => s.Expense)
                .WithMany()
                .HasForeignKey(s => s.ExpenseId)
                .OnDelete(DeleteBehavior.Restrict); // or DeleteBehavior.NoAction
        }
    }
}
