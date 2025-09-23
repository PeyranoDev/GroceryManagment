using Application.Schemas.Products;
using System.ComponentModel.DataAnnotations;

namespace Application.Schemas.Inventory
{
    public class InventoryItemForCreateDto
    {
        [Required]
        public int ProductId { get; set; }

        [Required, Range(0, int.MaxValue, ErrorMessage = "El stock debe ser mayor o igual a 0")]
        public int Stock { get; set; }
    }
}