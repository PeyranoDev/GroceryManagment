namespace Application.Schemas.Reports
{
    public class ReportFilterDto
    {
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? ReportType { get; set; } // "sales", "purchases", "all"
        public string? UserId { get; set; }
        public string? SupplierId { get; set; }
    }
}
