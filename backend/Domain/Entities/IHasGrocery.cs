namespace Domain.Entities
{
    public interface IHasGrocery
    {
        int GroceryId { get; set; }
        Grocery Grocery { get; set; }
    }
}
