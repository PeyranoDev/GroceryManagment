using System.ComponentModel.DataAnnotations;

namespace Application.Schemas.Sales
{
    public class SaleCartSimpleDto
    {
        [Required]
        public int ProductId { get; set; }

        [Required, Range(1, int.MaxValue)]
        public int Quantity { get; set; }

        /// <summary>
        /// Precio unitario en ARS
        /// </summary>
        public decimal SalePrice { get; set; }
        
        /// <summary>
        /// Precio unitario en USD (calculado dinámicamente)
        /// </summary>
        public decimal SalePriceUSD { get; set; }
    }
}

