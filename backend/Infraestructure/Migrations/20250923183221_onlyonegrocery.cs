using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infraestructure.Migrations
{
    /// <inheritdoc />
    public partial class onlyonegrocery : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "GroceryId",
                table: "Users",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Role",
                table: "Users",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_GroceryId",
                table: "Users",
                column: "GroceryId");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Groceries_GroceryId",
                table: "Users",
                column: "GroceryId",
                principalTable: "Groceries",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_Groceries_GroceryId",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_GroceryId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "GroceryId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Role",
                table: "Users");
        }
    }
}
