using System.ComponentModel.DataAnnotations;

namespace Application.Schemas.Products
{
    public class ProductForUpdateDto
    {
        [Required, MaxLength(200)]
        public string Name { get; set; } = null!;

        [MaxLength(10)]
        public string? Emoji { get; set; }

        [Required]
        public int CategoryId { get; set; }
    }
}
