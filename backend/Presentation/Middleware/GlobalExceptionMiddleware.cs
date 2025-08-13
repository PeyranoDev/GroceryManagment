using Application.Schemas;
using Domain.Exceptions;
using System.Net;
using System.Text.Json;

namespace Presentation.Middleware
{
    public class GlobalExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<GlobalExceptionMiddleware> _logger;

        public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unhandled exception occurred");
                await HandleExceptionAsync(context, ex);
            }
        }

        private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";

            var response = exception switch
            {
                NotFoundException => CreateErrorResponse(HttpStatusCode.NotFound, exception.Message),
                DuplicateException => CreateErrorResponse(HttpStatusCode.Conflict, exception.Message),
                ValidationException => CreateErrorResponse(HttpStatusCode.BadRequest, exception.Message),
                BusinessException => CreateErrorResponse(HttpStatusCode.BadRequest, exception.Message),
                UnauthorizedException => CreateErrorResponse(HttpStatusCode.Unauthorized, exception.Message),
                DomainException => CreateErrorResponse(HttpStatusCode.BadRequest, exception.Message),
                _ => CreateErrorResponse(HttpStatusCode.InternalServerError, "Ha ocurrido un error interno del servidor.")
            };

            context.Response.StatusCode = (int)response.StatusCode;

            var jsonResponse = JsonSerializer.Serialize(response.ApiResponse, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });

            await context.Response.WriteAsync(jsonResponse);
        }

        private static (HttpStatusCode StatusCode, ApiResponse ApiResponse) CreateErrorResponse(HttpStatusCode statusCode, string message)
        {
            return (statusCode, ApiResponse.ErrorResponse(message));
        }
    }
}