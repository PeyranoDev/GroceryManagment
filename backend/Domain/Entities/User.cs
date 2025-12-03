using Domain.Common.Enums;

namespace Domain.Entities
{
    public class User : IEntity
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;
        public bool IsSuperAdmin { get; set; }
        public bool IsActive { get; set; } = true;
        
        public int? GroceryId { get; set; }
        public Grocery? Grocery { get; set; }
        
        public GroceryRole? Role { get; set; }
        
        [Obsolete("Use GroceryId and Role instead. This will be removed in future versions.")]
        public ICollection<UserGrocery> UserGroceries { get; set; } = new List<UserGrocery>();
    }
}
