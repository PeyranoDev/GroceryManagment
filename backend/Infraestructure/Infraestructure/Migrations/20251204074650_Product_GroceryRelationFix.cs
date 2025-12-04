using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infraestructure.Infraestructure.Migrations
{
    /// <inheritdoc />
    public partial class Product_GroceryRelationFix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Products_Groceries_GroceryId",
                table: "Products");

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Groceries_GroceryId",
                table: "Products",
                column: "GroceryId",
                principalTable: "Groceries",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Products_Groceries_GroceryId",
                table: "Products");

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Groceries_GroceryId",
                table: "Products",
                column: "GroceryId",
                principalTable: "Groceries",
                principalColumn: "Id");
        }
    }
}
