using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Reflection;

namespace Presentation.Filters
{
    public class GroceryIdHeaderOperationFilter : IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            var excludedEndpoints = new[]
            {
                "Users", // Endpoints de usuarios que pueden no requerir grocery ID
                "Auth",  // Endpoints de autenticación
                "Health" // Endpoints de health check
            };

            var controllerName = context.MethodInfo.DeclaringType?.Name;
            var actionName = context.MethodInfo.Name;

            if (controllerName != null && excludedEndpoints.Any(excluded => 
                controllerName.StartsWith(excluded, StringComparison.OrdinalIgnoreCase)))
            {
                return;
            }

            var noGroceryIdRequired = context.MethodInfo.GetCustomAttribute<NoGroceryIdRequiredAttribute>() != null;
            if (noGroceryIdRequired)
            {
                return;
            }

            operation.Parameters ??= new List<OpenApiParameter>();

            if (!operation.Parameters.Any(p => p.Name == "X-Grocery-Id"))
            {
                operation.Parameters.Add(new OpenApiParameter
                {
                    Name = "X-Grocery-Id",
                    In = ParameterLocation.Header,
                    Required = true,
                    Description = "ID del grocery/verdulería (requerido para operaciones multi-tenant)",
                    Schema = new OpenApiSchema
                    {
                        Type = "integer",
                        Format = "int32",
                        Example = new Microsoft.OpenApi.Any.OpenApiInteger(1)
                    }
                });
            }
        }
    }

    [AttributeUsage(AttributeTargets.Method)]
    public class NoGroceryIdRequiredAttribute : Attribute
    {
    }
}