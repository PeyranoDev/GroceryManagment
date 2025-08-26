using Domain.Tenancy;
using Infraestructure.Tenancy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Presentation.Filters
{
    public class RequireGroceryHeaderAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            try
            {
                var tenantProvider = context.HttpContext.RequestServices.GetRequiredService<ITenantProvider>();
                var groceryId = tenantProvider.CurrentGroceryId;
            }
            catch (InvalidOperationException ex)
            {
                context.Result = new BadRequestObjectResult(new { error = ex.Message });
                return;
            }

            base.OnActionExecuting(context);
        }
    }
}