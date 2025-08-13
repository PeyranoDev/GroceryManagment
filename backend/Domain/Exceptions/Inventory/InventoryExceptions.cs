namespace Domain.Exceptions.Inventory
{
    public class InventoryItemNotFoundException : NotFoundException
    {
        public InventoryItemNotFoundException(int id) : base("Item de inventario", id) { }
    }

    public class InsufficientStockException : BusinessException
    {
        public InsufficientStockException(string productName, int available, int requested) 
            : base($"Stock insuficiente para '{productName}'. Disponible: {available}, Solicitado: {requested}") { }
    }

    public class NegativeStockException : ValidationException
    {
        public NegativeStockException() 
            : base("El stock no puede ser negativo.") { }
    }

    public class ProductNotValidForInventoryException : ValidationException
    {
        public ProductNotValidForInventoryException(int productId) 
            : base($"El producto con ID {productId} no existe o no pertenece al grocery actual.") { }
    }
}