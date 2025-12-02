using Application.Schemas.Products;
using System.ComponentModel.DataAnnotations;

namespace Application.Schemas.Inventory
{
    public class InventoryItemForUpdateDto
    {
        [Required, Range(0, int.MaxValue, ErrorMessage = "El stock debe ser mayor o igual a 0")]
        public int Stock { get; set; }

        [Required, Range(0.01, double.MaxValue, ErrorMessage = "El precio unitario debe ser mayor a 0")]
        public decimal UnitPrice { get; set; }

        [Required, Range(0.01, double.MaxValue, ErrorMessage = "El precio de venta debe ser mayor a 0")]
        public decimal SalePrice { get; set; }

        public PromotionDto? Promotion { get; set; }
    }
}