namespace Application.Schemas.Categories
{
    public class CategoryForResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string? Icon { get; set; }
    }
}