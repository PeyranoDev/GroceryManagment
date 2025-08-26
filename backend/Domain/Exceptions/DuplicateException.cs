namespace Domain.Exceptions
{
    public class DuplicateException : DomainException
    {
        public DuplicateException(string entityName, string fieldName, string value) 
            : base($"Ya existe un {entityName} con {fieldName} '{value}'.") { }
        
        public DuplicateException(string message) 
            : base(message) { }
    }
}