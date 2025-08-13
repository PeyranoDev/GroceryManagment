using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Reflection;

namespace Presentation.Filters
{
    public class GroceryIdHeaderOperationFilter : IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            // Lista de endpoints que NO requieren el header X-Grocery-Id
            var excludedEndpoints = new[]
            {
                "Users", // Endpoints de usuarios que pueden no requerir grocery ID
                "Auth",  // Endpoints de autenticación
                "Health" // Endpoints de health check
            };

            var controllerName = context.MethodInfo.DeclaringType?.Name;
            var actionName = context.MethodInfo.Name;

            // Si el controlador está en la lista de excluidos, no agregar el header como requerido
            if (controllerName != null && excludedEndpoints.Any(excluded => 
                controllerName.StartsWith(excluded, StringComparison.OrdinalIgnoreCase)))
            {
                return;
            }

            // Verificar si el endpoint tiene un atributo personalizado que indique que no requiere grocery ID
            var noGroceryIdRequired = context.MethodInfo.GetCustomAttribute<NoGroceryIdRequiredAttribute>() != null;
            if (noGroceryIdRequired)
            {
                return;
            }

            // Agregar el parámetro X-Grocery-Id a la operación
            operation.Parameters ??= new List<OpenApiParameter>();

            // Verificar si el parámetro ya existe para evitar duplicados
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

    /// <summary>
    /// Atributo para marcar endpoints que no requieren el header X-Grocery-Id
    /// </summary>
    [AttributeUsage(AttributeTargets.Method)]
    public class NoGroceryIdRequiredAttribute : Attribute
    {
    }
}