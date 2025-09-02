using Domain.Tenancy;
using Microsoft.AspNetCore.Http;

namespace Infraestructure.Tenancy
{
    public class HeaderTenantProvider : ITenantProvider
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public HeaderTenantProvider(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public int CurrentGroceryId
        {
            get
            {
                var context = _httpContextAccessor.HttpContext;
                if (context?.Request.Headers.TryGetValue("X-Grocery-Id", out var groceryIdHeader) == true
                    && int.TryParse(groceryIdHeader.FirstOrDefault(), out var groceryId))
                {
                    return groceryId;
                }
                return 0; // Cambiado de 1 a 0 para indicar que no hay tenant
            }
        }

        public bool HasTenant => CurrentGroceryId > 0;
    }
}
