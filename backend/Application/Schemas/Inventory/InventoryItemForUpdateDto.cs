using Application.Schemas.Products;
using System.ComponentModel.DataAnnotations;

namespace Application.Schemas.Inventory
{
    public class InventoryItemForUpdateDto
    {
        [Required, Range(0, int.MaxValue, ErrorMessage = "El stock debe ser mayor o igual a 0")]
        public int Stock { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "El precio de venta no puede ser negativo")]
        public decimal SalePrice { get; set; }

        [Required]
        public string Unit { get; set; } = "u";
    }
}
