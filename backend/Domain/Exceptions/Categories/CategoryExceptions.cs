namespace Domain.Exceptions.Categories
{
    public class CategoryNotFoundException : NotFoundException
    {
        public CategoryNotFoundException(int id) : base("Categoría", id) { }
        public CategoryNotFoundException(string name) : base("Categoría", name) { }
    }

    public class CategoryAlreadyExistsException : DuplicateException
    {
        public CategoryAlreadyExistsException(string name) 
            : base("Categoría", "nombre", name) { }
    }

    public class CategoryHasProductsException : BusinessException
    {
        public CategoryHasProductsException(string categoryName) 
            : base($"No se puede eliminar la categoría '{categoryName}' porque tiene productos asociados.") { }
    }
}