namespace Domain.Exceptions.Categories
{
    public class CategoryNotFoundException : NotFoundException
    {
        public CategoryNotFoundException(int id) : base("Categor�a", id) { }
        public CategoryNotFoundException(string name) : base("Categor�a", name) { }
    }

    public class CategoryAlreadyExistsException : DuplicateException
    {
        public CategoryAlreadyExistsException(string name) 
            : base("Categor�a", "nombre", name) { }
    }

    public class CategoryHasProductsException : BusinessException
    {
        public CategoryHasProductsException(string categoryName) 
            : base($"No se puede eliminar la categor�a '{categoryName}' porque tiene productos asociados.") { }
    }
}