using System.ComponentModel.DataAnnotations;

namespace Application.Schemas.Purchases
{
    public class PurchaseForCreateDto
    {
        [Required]
        public string Supplier { get; set; } = string.Empty;
        
        [Required]
        public DateTime Date { get; set; }
        
        [Required]
        public List<PurchaseItemForCreateDto> Items { get; set; } = new List<PurchaseItemForCreateDto>();
        
        public string? Notes { get; set; }
    }
    
    public class PurchaseItemForCreateDto
    {
        [Required]
        public int ProductId { get; set; }
        
        [Required, Range(1, int.MaxValue)]
        public int Quantity { get; set; }
        
        [Required, Range(0.01, double.MaxValue)]
        public decimal UnitCost { get; set; }
    }
}
