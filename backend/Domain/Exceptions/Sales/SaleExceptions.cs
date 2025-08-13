namespace Domain.Exceptions.Sales
{
    public class SaleNotFoundException : NotFoundException
    {
        public SaleNotFoundException(int id) : base("Venta", id) { }
    }

    public class EmptySaleException : ValidationException
    {
        public EmptySaleException() 
            : base("La venta debe tener al menos un producto.") { }
    }

    public class InvalidSaleItemException : ValidationException
    {
        public InvalidSaleItemException(string message) : base(message) { }
    }

    public class UserNotValidForSaleException : ValidationException
    {
        public UserNotValidForSaleException(int userId) 
            : base($"El usuario con ID {userId} no existe o no tiene permisos en este grocery.") { }
    }
}