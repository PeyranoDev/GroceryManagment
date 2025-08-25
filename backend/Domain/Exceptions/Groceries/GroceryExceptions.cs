namespace Domain.Exceptions.Groceries
{
    public class GroceryNotFoundException : NotFoundException
    {
        public GroceryNotFoundException(int id) : base("Verdulería", id) { }
        public GroceryNotFoundException(string name) : base("Verdulería", name) { }
    }

    public class GroceryAlreadyExistsException : DuplicateException
    {
        public GroceryAlreadyExistsException(string name) 
            : base("Verdulería", "nombre", name) { }
    }

    public class InvalidGroceryIdException : ValidationException
    {
        public InvalidGroceryIdException() 
            : base("X-Grocery-Id faltante o inválido en el header.") { }
    }
}