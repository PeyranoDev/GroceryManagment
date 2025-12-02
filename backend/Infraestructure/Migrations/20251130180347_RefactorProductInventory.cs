using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Infraestructure.Migrations
{
    /// <inheritdoc />
    public partial class RefactorProductInventory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Categories_Groceries_GroceryId",
                table: "Categories");

            migrationBuilder.DropForeignKey(
                name: "FK_Products_Groceries_GroceryId",
                table: "Products");

            migrationBuilder.DropTable(
                name: "WeeklySales");

            migrationBuilder.DropIndex(
                name: "IX_Products_GroceryId_Name",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_Categories_GroceryId_Name",
                table: "Categories");

            migrationBuilder.DropColumn(
                name: "Promotion_DiscountAmount",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "Promotion_DiscountPercent",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "Promotion_ExpirationDate",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "Promotion_PromotionPrice",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "Promotion_PromotionQuantity",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "SalePrice",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "UnitPrice",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "GroceryId",
                table: "Categories");

            migrationBuilder.AlterColumn<int>(
                name: "GroceryId",
                table: "Products",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddColumn<decimal>(
                name: "Promotion_DiscountAmount",
                table: "InventoryItems",
                type: "numeric(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Promotion_DiscountPercent",
                table: "InventoryItems",
                type: "numeric(5,2)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "Promotion_ExpirationDate",
                table: "InventoryItems",
                type: "timestamp without time zone",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Promotion_PromotionPrice",
                table: "InventoryItems",
                type: "numeric(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Promotion_PromotionQuantity",
                table: "InventoryItems",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "SalePrice",
                table: "InventoryItems",
                type: "numeric(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "UnitPrice",
                table: "InventoryItems",
                type: "numeric(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.CreateIndex(
                name: "IX_Products_GroceryId",
                table: "Products",
                column: "GroceryId");

            migrationBuilder.CreateIndex(
                name: "IX_Products_Name",
                table: "Products",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Categories_Name",
                table: "Categories",
                column: "Name",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Groceries_GroceryId",
                table: "Products",
                column: "GroceryId",
                principalTable: "Groceries",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Products_Groceries_GroceryId",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_Products_GroceryId",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_Products_Name",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_Categories_Name",
                table: "Categories");

            migrationBuilder.DropColumn(
                name: "Promotion_DiscountAmount",
                table: "InventoryItems");

            migrationBuilder.DropColumn(
                name: "Promotion_DiscountPercent",
                table: "InventoryItems");

            migrationBuilder.DropColumn(
                name: "Promotion_ExpirationDate",
                table: "InventoryItems");

            migrationBuilder.DropColumn(
                name: "Promotion_PromotionPrice",
                table: "InventoryItems");

            migrationBuilder.DropColumn(
                name: "Promotion_PromotionQuantity",
                table: "InventoryItems");

            migrationBuilder.DropColumn(
                name: "SalePrice",
                table: "InventoryItems");

            migrationBuilder.DropColumn(
                name: "UnitPrice",
                table: "InventoryItems");

            migrationBuilder.AlterColumn<int>(
                name: "GroceryId",
                table: "Products",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Promotion_DiscountAmount",
                table: "Products",
                type: "numeric(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Promotion_DiscountPercent",
                table: "Products",
                type: "numeric(5,2)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "Promotion_ExpirationDate",
                table: "Products",
                type: "timestamp without time zone",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Promotion_PromotionPrice",
                table: "Products",
                type: "numeric(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Promotion_PromotionQuantity",
                table: "Products",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "SalePrice",
                table: "Products",
                type: "numeric(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "UnitPrice",
                table: "Products",
                type: "numeric(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "GroceryId",
                table: "Categories",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "WeeklySales",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    GroceryId = table.Column<int>(type: "integer", nullable: false),
                    TotalSales = table.Column<decimal>(type: "numeric", nullable: false),
                    WeekEnd = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    WeekStart = table.Column<DateTime>(type: "timestamp without time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WeeklySales", x => x.Id);
                    table.ForeignKey(
                        name: "FK_WeeklySales_Groceries_GroceryId",
                        column: x => x.GroceryId,
                        principalTable: "Groceries",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Products_GroceryId_Name",
                table: "Products",
                columns: new[] { "GroceryId", "Name" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Categories_GroceryId_Name",
                table: "Categories",
                columns: new[] { "GroceryId", "Name" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_WeeklySales_GroceryId",
                table: "WeeklySales",
                column: "GroceryId");

            migrationBuilder.AddForeignKey(
                name: "FK_Categories_Groceries_GroceryId",
                table: "Categories",
                column: "GroceryId",
                principalTable: "Groceries",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Groceries_GroceryId",
                table: "Products",
                column: "GroceryId",
                principalTable: "Groceries",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
