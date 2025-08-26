using Application.Schemas.Products;
using System.ComponentModel.DataAnnotations;

namespace Application.Schemas.Sales
{
    public class SaleCartDto
    {
        [Required]
        public ProductForResponseDto Product { get; set; } = null!;
        
        [Required, Range(1, int.MaxValue)]
        public int Quantity { get; set; }
        
        public bool PromotionApplied { get; set; }
        
        public decimal TotalPrice => CalculateTotalPrice();

        private decimal CalculateTotalPrice()
        {
            if (PromotionApplied && Product.Promotion?.PromotionQuantity > 0 && Product.Promotion?.PromotionPrice > 0)
            {
                var promoQuantity = Product.Promotion.PromotionQuantity.Value;
                var promoPrice = Product.Promotion.PromotionPrice.Value;
                
                var promoSets = Quantity / promoQuantity;
                var remainingQty = Quantity % promoQuantity;
                
                return (promoSets * promoPrice) + (remainingQty * Product.UnitPrice);
            }
            
            return Quantity * Product.UnitPrice;
        }
    }
}
