namespace Domain.Entities
{
    public class User : IEntity
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;

        public ICollection<UserGrocery> UserGroceries { get; set; } = new List<UserGrocery>();
    }
}
