using Application.Schemas.Categories;

namespace Application.Schemas.Products
{
    public class ProductForResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public decimal UnitPrice { get; set; }
        public decimal SalePrice { get; set; }
        public string Unit { get; set; } = null!;
        public string? Emoji { get; set; }
        public int CategoryId { get; set; }
        public CategoryForResponseDto Category { get; set; } = null!;
        public int GroceryId { get; set; }
        public PromotionDto? Promotion { get; set; }
    }
}