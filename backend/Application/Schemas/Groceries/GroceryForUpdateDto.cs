using System.ComponentModel.DataAnnotations;

namespace Application.Schemas.Groceries
{
    public class GroceryForUpdateDto
    {
        [Required, MaxLength(200)]
        public string Name { get; set; } = null!;
    }
}