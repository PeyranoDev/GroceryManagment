namespace Domain.Exceptions.Groceries
{
    public class GroceryNotFoundException : NotFoundException
    {
        public GroceryNotFoundException(int id) : base("Verduler�a", id) { }
        public GroceryNotFoundException(string name) : base("Verduler�a", name) { }
    }

    public class GroceryAlreadyExistsException : DuplicateException
    {
        public GroceryAlreadyExistsException(string name) 
            : base("Verduler�a", "nombre", name) { }
    }

    public class InvalidGroceryIdException : ValidationException
    {
        public InvalidGroceryIdException() 
            : base("X-Grocery-Id faltante o inv�lido en el header.") { }
    }
}