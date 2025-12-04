using Domain.Tenancy;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace Infraestructure.Tenancy
{
    public class ClaimsGroceryProvider : ITenantProvider
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ClaimsGroceryProvider(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public int CurrentGroceryId
        {
            get
            {
                var user = _httpContextAccessor.HttpContext?.User;
                if (user?.Identity?.IsAuthenticated == true)
                {
                    var groceryIdClaim = user.FindFirst("groceryId");
                    if (groceryIdClaim != null && int.TryParse(groceryIdClaim.Value, out var groceryId))
                    {
                        return groceryId;
                    }
                }
                var headers = _httpContextAccessor.HttpContext?.Request?.Headers;
                if (headers != null && headers.TryGetValue("X-Grocery-Id", out var headerVal))
                {
                    var raw = headerVal.ToString();
                    if (int.TryParse(raw, out var hdrGroceryId))
                    {
                        return hdrGroceryId;
                    }
                }
                return 0;
            }
        }

        public bool HasTenant => CurrentGroceryId > 0;
    }
}
