namespace Domain.Exceptions
{
    public class UnauthorizedException : DomainException
    {
        public UnauthorizedException(string message = "No tiene permisos para realizar esta operación.") 
            : base(message) { }
    }
}