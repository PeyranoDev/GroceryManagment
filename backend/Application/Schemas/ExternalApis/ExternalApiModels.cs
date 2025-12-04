using System.Text.Json.Serialization;

namespace Application.Schemas.ExternalApis
{
    /// <summary>
    /// Response model from dolarapi.com/v1/dolares/{tipo}
    /// </summary>
    public class DolarApiResponse
    {
        [JsonPropertyName("moneda")]
        public string Moneda { get; set; } = string.Empty;

        [JsonPropertyName("casa")]
        public string Casa { get; set; } = string.Empty;

        [JsonPropertyName("nombre")]
        public string Nombre { get; set; } = string.Empty;

        [JsonPropertyName("compra")]
        public decimal Compra { get; set; }

        [JsonPropertyName("venta")]
        public decimal Venta { get; set; }

        [JsonPropertyName("fechaActualizacion")]
        public DateTime FechaActualizacion { get; set; }
    }

    /// <summary>
    /// Response model from api.argentinadatos.com/v1/feriados/{anio}
    /// </summary>
    public class FeriadoApiResponse
    {
        [JsonPropertyName("fecha")]
        public string Fecha { get; set; } = string.Empty;

        [JsonPropertyName("tipo")]
        public string Tipo { get; set; } = string.Empty;

        [JsonPropertyName("nombre")]
        public string Nombre { get; set; } = string.Empty;
    }
}
