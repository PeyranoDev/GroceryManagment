using System.ComponentModel.DataAnnotations;

namespace Application.Schemas.Categories
{
    public class CategoryForCreateDto
    {
        [Required, MaxLength(100)]
        public string Name { get; set; } = null!;

        [MaxLength(10)]
        public string? Icon { get; set; }
    }
}