namespace Domain.Entities
{
    public class Promotion
    {
        public decimal? DiscountPercent { get; set; }
        public decimal? DiscountAmount { get; set; }
        public DateTime? ExpirationDate { get; set; }
        
        public int? PromotionQuantity { get; set; }
        public decimal? PromotionPrice { get; set; }
    }
}
