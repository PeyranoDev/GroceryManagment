using Domain.Common.Enums;

namespace Domain.Entities
{
    public class UserGrocery : IEntity
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public int GroceryId { get; set; }
        public Grocery Grocery { get; set; } = null!;

        public GroceryRole Role { get; set; } 
    }
}
