using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infraestructure.Infraestructure.Migrations
{
    /// <inheritdoc />
    public partial class ExtendSaleFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CustomerName",
                table: "Sales",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CustomerPhone",
                table: "Sales",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DeliveryAddress",
                table: "Sales",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "DeliveryCost",
                table: "Sales",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<bool>(
                name: "IsOnline",
                table: "Sales",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "OrderStatus",
                table: "Sales",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PaymentMethod",
                table: "Sales",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PaymentStatus",
                table: "Sales",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CustomerName",
                table: "Sales");

            migrationBuilder.DropColumn(
                name: "CustomerPhone",
                table: "Sales");

            migrationBuilder.DropColumn(
                name: "DeliveryAddress",
                table: "Sales");

            migrationBuilder.DropColumn(
                name: "DeliveryCost",
                table: "Sales");

            migrationBuilder.DropColumn(
                name: "IsOnline",
                table: "Sales");

            migrationBuilder.DropColumn(
                name: "OrderStatus",
                table: "Sales");

            migrationBuilder.DropColumn(
                name: "PaymentMethod",
                table: "Sales");

            migrationBuilder.DropColumn(
                name: "PaymentStatus",
                table: "Sales");
        }
    }
}
