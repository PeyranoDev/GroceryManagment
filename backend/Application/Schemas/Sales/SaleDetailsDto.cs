using System.ComponentModel.DataAnnotations;

namespace Application.Schemas.Sales
{
    public class SaleDetailsDto
    {
        [Required]
        public DateTime Date { get; set; }
        
        [Required]
        public string Time { get; set; } = string.Empty;
        
        public string Client { get; set; } = string.Empty;
        
        [Required]
        public string PaymentMethod { get; set; } = "Efectivo";
        
        public string Observations { get; set; } = string.Empty;
        
        public bool IsOnline { get; set; }
        
        public decimal DeliveryCost { get; set; }
    }
}
