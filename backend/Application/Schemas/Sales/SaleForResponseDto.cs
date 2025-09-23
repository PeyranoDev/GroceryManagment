using Application.Schemas.Users;
using Application.Schemas.Products;

namespace Application.Schemas.Sales
{
    public class SaleForResponseDto
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public decimal Total { get; set; }
        public int UserId { get; set; }
        public UserForResponseDto User { get; set; } = null!;
        public List<SaleItemForResponseDto> Items { get; set; } = new List<SaleItemForResponseDto>();
    }

    public class SaleItemForResponseDto
    {
        public int Id { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public int ProductId { get; set; }
        public ProductForResponseDto Product { get; set; } = null!;
        public int SaleId { get; set; }
    }
}