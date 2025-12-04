namespace Domain.Entities
{
    public class CotizacionDolar : IEntity
    {
        public int Id { get; set; }

        /// <summary>
        /// Tipo de dólar: "oficial", "blue", "bolsa", "contadoconliqui", etc.
        /// </summary>
        public string TipoCambio { get; set; } = string.Empty;

        /// <summary>
        /// Valor de compra en pesos argentinos
        /// </summary>
        public decimal Compra { get; set; }

        /// <summary>
        /// Valor de venta en pesos argentinos
        /// </summary>
        public decimal Venta { get; set; }

        /// <summary>
        /// Fecha y hora de la cotización según la API
        /// </summary>
        public DateTime FechaActualizacion { get; set; }

        /// <summary>
        /// Fecha y hora en que se guardó el registro en nuestra base de datos
        /// </summary>
        public DateTime FechaRegistro { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// Fuente de la cotización (ej: "dolarapi.com")
        /// </summary>
        public string Fuente { get; set; } = "dolarapi.com";
    }
}
