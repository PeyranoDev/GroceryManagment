using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infraestructure.Tenancy
{
    public interface ITenantProvider { int CurrentGroceryId { get; } }
}
