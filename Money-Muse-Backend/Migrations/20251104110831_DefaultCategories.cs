using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Money_Muse_Backend.Migrations
{
    /// <inheritdoc />
    public partial class DefaultCategories : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "Id", "ColorCode", "CreatedAt", "Icon", "IsDefault", "Name", "Type", "UserId" },
                values: new object[,]
                {
                    { new Guid("11111111-1111-1111-1111-111111111111"), "", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "🍽️", true, "Food & Dining", 1, null },
                    { new Guid("22222222-2222-2222-2222-222222222222"), "", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "🚗", true, "Transport", 1, null },
                    { new Guid("33333333-3333-3333-3333-333333333333"), "", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "🎬", true, "Entertainment", 1, null },
                    { new Guid("44444444-4444-4444-4444-444444444444"), "", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "🏠", true, "Bills & Utilities", 1, null },
                    { new Guid("55555555-5555-5555-5555-555555555555"), "", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "🛍️", true, "Shopping", 1, null },
                    { new Guid("66666666-6666-6666-6666-666666666666"), "", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "🏥", true, "Healthcare", 1, null },
                    { new Guid("77777777-7777-7777-7777-777777777777"), "", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "🎓", true, "Education", 1, null },
                    { new Guid("88888888-8888-8888-8888-888888888888"), "", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "💪", true, "Fitness", 1, null },
                    { new Guid("99999999-9999-9999-9999-999999999999"), "", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "✈️", true, "Travel", 1, null },
                    { new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"), "", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "⭐", true, "Other", 1, null }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"));

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-222222222222"));

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("33333333-3333-3333-3333-333333333333"));

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("44444444-4444-4444-4444-444444444444"));

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("55555555-5555-5555-5555-555555555555"));

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("66666666-6666-6666-6666-666666666666"));

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("77777777-7777-7777-7777-777777777777"));

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("88888888-8888-8888-8888-888888888888"));

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("99999999-9999-9999-9999-999999999999"));

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"));
        }
    }
}
