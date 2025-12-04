using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Infraestructure.Infraestructure.Migrations
{
    /// <inheritdoc />
    public partial class AddCotizacionesDolarAndFeriadosArgentinos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CotizacionesDolar",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TipoCambio = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Compra = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    Venta = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    FechaActualizacion = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    FechaRegistro = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    Fuente = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CotizacionesDolar", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "FeriadosArgentinos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Fecha = table.Column<DateOnly>(type: "date", nullable: false),
                    Tipo = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Nombre = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Anio = table.Column<int>(type: "integer", nullable: false),
                    FechaRegistro = table.Column<DateTime>(type: "timestamp without time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FeriadosArgentinos", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CotizacionesDolar_TipoCambio_FechaActualizacion",
                table: "CotizacionesDolar",
                columns: new[] { "TipoCambio", "FechaActualizacion" });

            migrationBuilder.CreateIndex(
                name: "IX_FeriadosArgentinos_Anio_Fecha",
                table: "FeriadosArgentinos",
                columns: new[] { "Anio", "Fecha" });

            migrationBuilder.CreateIndex(
                name: "IX_FeriadosArgentinos_Fecha",
                table: "FeriadosArgentinos",
                column: "Fecha",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CotizacionesDolar");

            migrationBuilder.DropTable(
                name: "FeriadosArgentinos");
        }
    }
}
