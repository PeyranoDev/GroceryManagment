namespace Domain.Exceptions.Products
{
    public class ProductNotFoundException : NotFoundException
    {
        public ProductNotFoundException(int id) : base("Producto", id) { }
        public ProductNotFoundException(string name) : base("Producto", name) { }
    }

    public class ProductAlreadyExistsException : DuplicateException
    {
        public ProductAlreadyExistsException(string name) 
            : base("Producto", "nombre", name) { }
    }

    public class InvalidPriceException : ValidationException
    {
        public InvalidPriceException(string priceType) 
            : base($"El {priceType} debe ser mayor a 0.") { }
    }

    public class CategoryNotValidException : ValidationException
    {
        public CategoryNotValidException(int categoryId) 
            : base($"La categoría con ID {categoryId} no existe o no pertenece al grocery actual.") { }
    }
}