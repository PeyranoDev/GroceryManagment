namespace Domain.Entities
{
    public class Promotion
    {
        public decimal? DiscountPercent { get; set; }
        public decimal? DiscountAmount { get; set; }
        public DateTime? ExpirationDate { get; set; }
    }
}
