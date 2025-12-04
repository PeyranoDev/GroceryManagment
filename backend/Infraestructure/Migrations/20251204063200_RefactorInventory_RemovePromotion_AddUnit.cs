using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infraestructure.Migrations
{
    /// <inheritdoc />
    public partial class RefactorInventory_RemovePromotion_AddUnit : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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
                name: "UnitPrice",
                table: "InventoryItems");

            migrationBuilder.AddColumn<string>(
                name: "Unit",
                table: "InventoryItems",
                type: "character varying(10)",
                maxLength: 10,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Unit",
                table: "InventoryItems");

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
                name: "UnitPrice",
                table: "InventoryItems",
                type: "numeric(18,2)",
                nullable: false,
                defaultValue: 0m);
        }
    }
}
