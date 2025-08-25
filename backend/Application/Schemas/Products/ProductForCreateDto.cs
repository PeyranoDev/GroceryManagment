using System.ComponentModel.DataAnnotations;

namespace Application.Schemas.Products
{
    public class ProductForCreateDto
    {
        [Required, MaxLength(200)]
        public string Name { get; set; } = null!;

        [Required, Range(0.01, double.MaxValue, ErrorMessage = "El precio unitario debe ser mayor a 0")]
        public decimal UnitPrice { get; set; }

        [Required, Range(0.01, double.MaxValue, ErrorMessage = "El precio de venta debe ser mayor a 0")]
        public decimal SalePrice { get; set; }

        [Required, MaxLength(50)]
        public string Unit { get; set; } = null!;

        [MaxLength(10)]
        public string? Emoji { get; set; }

        [Required]
        public int CategoryId { get; set; }

        public PromotionDto? Promotion { get; set; }
    }
}