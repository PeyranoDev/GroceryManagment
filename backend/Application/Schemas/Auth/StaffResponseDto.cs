using Domain.Common.Enums;

namespace Application.Schemas.Auth
{
    public class StaffResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public GroceryRole Role { get; set; }
        public int GroceryId { get; set; }
    }

    public class StaffListResponseDto
    {
        public IReadOnlyList<StaffResponseDto> Staff { get; set; } = new List<StaffResponseDto>();
        public int Count { get; set; }
        public int MaxAllowed { get; set; } = 4;
        public bool CanCreateMore => Count < MaxAllowed;
    }
}
