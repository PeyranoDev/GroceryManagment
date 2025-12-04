using Application.Schemas.Products;

namespace Application.Schemas.Inventory
{
    public class InventoryItemForResponseDto
    {
        public int Id { get; set; }
        public ProductForResponseDto Product { get; set; } = null!;
        public int Stock { get; set; }
        public decimal SalePrice { get; set; }
        
        /// <summary>
        /// Precio de venta en dólares (calculado dinámicamente con cotización oficial)
        /// </summary>
        public decimal SalePriceUSD { get; set; }
        
        /// <summary>
        /// Cotización del dólar oficial usada para calcular SalePriceUSD
        /// </summary>
        public decimal CotizacionDolar { get; set; }
        
        public string Unit { get; set; } = "u";
        public DateTime LastUpdated { get; set; }
    }
}
