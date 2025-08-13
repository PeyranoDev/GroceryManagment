namespace Domain.Entities
{
    public class UserGrocery
    {
        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public int GroceryId { get; set; }
        public Grocery Grocery { get; set; } = null!;

        public int RoleId { get; set; }
        public Role Role { get; set; } = null!;
    }
}