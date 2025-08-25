using System.ComponentModel.DataAnnotations;

namespace Application.Schemas.Purchases
{
    public class PurchaseForUpdateDto
    {
        [Required]
        public string Supplier { get; set; } = string.Empty;
        
        [Required]
        public DateTime Date { get; set; }
        
        public string? Notes { get; set; }
        
        public List<PurchaseItemForUpdateDto> Items { get; set; } = new List<PurchaseItemForUpdateDto>();
    }
    
    public class PurchaseItemForUpdateDto
    {
        public int Id { get; set; }
        
        [Required]
        public int ProductId { get; set; }
        
        [Required, Range(1, int.MaxValue)]
        public int Quantity { get; set; }
        
        [Required, Range(0.01, double.MaxValue)]
        public decimal UnitCost { get; set; }
    }
}
