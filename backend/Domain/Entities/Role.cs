namespace Domain.Entities
{
    public class Role : IEntity
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!; 

        public ICollection<UserGrocery> UserGroceries { get; set; } = new List<UserGrocery>();
    }
}
