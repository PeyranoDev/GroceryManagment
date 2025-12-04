using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infraestructure.Infraestructure.Migrations
{
    /// <inheritdoc />
    public partial class AddCurrencyFieldsToSales : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "CotizacionDolar",
                table: "Sales",
                type: "numeric(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Moneda",
                table: "Sales",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<decimal>(
                name: "TotalARS",
                table: "Sales",
                type: "numeric(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "TotalUSD",
                table: "Sales",
                type: "numeric(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "PriceUSD",
                table: "SaleItems",
                type: "numeric(18,2)",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CotizacionDolar",
                table: "Sales");

            migrationBuilder.DropColumn(
                name: "Moneda",
                table: "Sales");

            migrationBuilder.DropColumn(
                name: "TotalARS",
                table: "Sales");

            migrationBuilder.DropColumn(
                name: "TotalUSD",
                table: "Sales");

            migrationBuilder.DropColumn(
                name: "PriceUSD",
                table: "SaleItems");
        }
    }
}
