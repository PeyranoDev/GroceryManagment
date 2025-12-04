namespace Domain.Entities
{
    public class FeriadoArgentino : IEntity
    {
        public int Id { get; set; }

        /// <summary>
        /// Fecha del feriado
        /// </summary>
        public DateOnly Fecha { get; set; }

        /// <summary>
        /// Tipo de feriado: "inamovible", "trasladable", "puente", etc.
        /// </summary>
        public string Tipo { get; set; } = string.Empty;

        /// <summary>
        /// Nombre del feriado
        /// </summary>
        public string Nombre { get; set; } = string.Empty;

        /// <summary>
        /// Año al que pertenece este feriado
        /// </summary>
        public int Anio { get; set; }

        /// <summary>
        /// Fecha en que se registró en la base de datos
        /// </summary>
        public DateTime FechaRegistro { get; set; } = DateTime.UtcNow;
    }
}
