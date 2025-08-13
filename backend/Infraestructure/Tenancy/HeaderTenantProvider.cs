using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infraestructure.Tenancy
{
    public class HeaderTenantProvider : ITenantProvider
    {
        private readonly IHttpContextAccessor _http;
        public HeaderTenantProvider(IHttpContextAccessor http) => _http = http;
        public int CurrentGroceryId
        {
            get
            {
                var raw = _http.HttpContext?.Request?.Headers["X-Grocery-Id"].FirstOrDefault();
                if (int.TryParse(raw, out var id)) return id;
                throw new InvalidOperationException("X-Grocery-Id faltante o inválido.");
            }
        }
    }
}
