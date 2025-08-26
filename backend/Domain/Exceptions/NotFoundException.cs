namespace Domain.Exceptions
{
    public class NotFoundException : DomainException
    {
        public NotFoundException(string entityName, int id) 
            : base($"{entityName} con ID {id} no fue encontrado.") { }
        
        public NotFoundException(string entityName, string identifier) 
            : base($"{entityName} con identificador '{identifier}' no fue encontrado.") { }
        
        public NotFoundException(string message) 
            : base(message) { }
    }
}