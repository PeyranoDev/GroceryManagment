using Application.Schemas.Products;
using System.ComponentModel.DataAnnotations;

namespace Application.Schemas.Sales
{
    public class SaleCartDto
    {
        [Required]
        public ProductForResponseDto Product { get; set; } = null!;
        
        [Required, Range(1, int.MaxValue)]
        public int Quantity { get; set; }
        
        public decimal TotalPrice => Quantity * Product.SalePrice;
    }
}
