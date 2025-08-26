using System.ComponentModel.DataAnnotations;

namespace Application.Schemas.Products
{
    public class PromotionDto
    {
        [Range(0, 100, ErrorMessage = "El descuento porcentual debe estar entre 0 y 100")]
        public decimal? DiscountPercent { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "El monto de descuento debe ser mayor o igual a 0")]
        public decimal? DiscountAmount { get; set; }

        public DateTime? ExpirationDate { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "La cantidad de promoción debe ser mayor a 0")]
        public int? PromotionQuantity { get; set; }

        [Range(0.01, double.MaxValue, ErrorMessage = "El precio de promoción debe ser mayor a 0")]
        public decimal? PromotionPrice { get; set; }
    }
}