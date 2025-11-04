using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Money_Muse_Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddCategoryDescription : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Categories",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "Description",
                value: "Expenses for food, restaurants, and dining out.");

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-222222222222"),
                column: "Description",
                value: "Transportation-related expenses.");

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("33333333-3333-3333-3333-333333333333"),
                column: "Description",
                value: "Expenses for movies, music, and other entertainment.");

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("44444444-4444-4444-4444-444444444444"),
                column: "Description",
                value: "Monthly bills and utility payments.");

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("55555555-5555-5555-5555-555555555555"),
                column: "Description",
                value: "Expenses for retail shopping.");

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("66666666-6666-6666-6666-666666666666"),
                column: "Description",
                value: "Medical and healthcare-related expenses.");

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("77777777-7777-7777-7777-777777777777"),
                column: "Description",
                value: "Tuition, books, and other education-related expenses.");

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("88888888-8888-8888-8888-888888888888"),
                column: "Description",
                value: "Expenses for gym memberships, classes, and equipment.");

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("99999999-9999-9999-9999-999999999999"),
                column: "Description",
                value: "Expenses for trips, hotels, and travel-related activities.");

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                column: "Description",
                value: "Miscellaneous expenses that don't fit other categories.");

            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "Id", "ColorCode", "CreatedAt", "Description", "Icon", "IsDefault", "Name", "Type", "UserId" },
                values: new object[,]
                {
                    { new Guid("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"), "#4CAF50", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Categories for income sources.", "💰", true, "Income", 0, null },
                    { new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), "#F44336", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Categories for expenses.", "💸", true, "Expense", 1, null },
                    { new Guid("dddddddd-dddd-dddd-dddd-dddddddddddd"), "#2196F3", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Categories for both income and expenses.", "🔄", true, "Both", 2, null }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"));

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"));

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("dddddddd-dddd-dddd-dddd-dddddddddddd"));

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Categories");
        }
    }
}
