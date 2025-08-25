namespace Domain.Exceptions
{
    public class ValidationException : DomainException
    {
        public ValidationException(string message) : base(message) { }
        
        public ValidationException(string fieldName, string message) 
            : base($"Error de validaci�n en '{fieldName}': {message}") { }
    }
}