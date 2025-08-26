using System.ComponentModel.DataAnnotations;

namespace Application.Schemas.Inventory
{
    public class StockAdjustmentDto
    {
        [Required]
        public int ProductId { get; set; }
        
        [Required, Range(0, int.MaxValue)]
        public int NewStock { get; set; }
        
        public string? Reason { get; set; }
        
        [Required]
        public int UserId { get; set; }
    }
}
