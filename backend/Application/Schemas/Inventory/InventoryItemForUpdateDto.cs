using Application.Schemas.Products;
using System.ComponentModel.DataAnnotations;

namespace Application.Schemas.Inventory
{
    public class InventoryItemForUpdateDto
    {
        [Required, Range(0, int.MaxValue, ErrorMessage = "El stock debe ser mayor o igual a 0")]
        public int Stock { get; set; }
    }
}