namespace Domain.Tenancy
{
    public interface ITenantProvider 
    { 
        int CurrentGroceryId { get; }
        bool HasTenant { get; }
    }
}