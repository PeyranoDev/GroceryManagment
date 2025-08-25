namespace Application.Schemas.Reports
{
    public class ReportDataDto
    {
        public string Id { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public decimal Total { get; set; }
        public string User { get; set; } = string.Empty;
        public string? Supplier { get; set; }
        public string Type { get; set; } = string.Empty; // "Venta" o "Compra"
    }
}
