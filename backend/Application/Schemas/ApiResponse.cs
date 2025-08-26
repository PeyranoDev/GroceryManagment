namespace Application.Schemas
{
    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public string Detail { get; set; } = string.Empty;
        public T? Data { get; set; }

        public static ApiResponse<T> SuccessResponse(T data, string detail = "Operación exitosa")
        {
            return new ApiResponse<T>
            {
                Success = true,
                Detail = detail,
                Data = data
            };
        }

        public static ApiResponse<T> ErrorResponse(string detail)
        {
            return new ApiResponse<T>
            {
                Success = false,
                Detail = detail,
                Data = default
            };
        }
    }

    public class ApiResponse
    {
        public bool Success { get; set; }
        public string Detail { get; set; } = string.Empty;

        public static ApiResponse SuccessResponse(string detail = "Operación exitosa")
        {
            return new ApiResponse
            {
                Success = true,
                Detail = detail
            };
        }

        public static ApiResponse ErrorResponse(string detail)
        {
            return new ApiResponse
            {
                Success = false,
                Detail = detail
            };
        }
    }
}