namespace Application.Schemas.Dashboard
{
    public class PerDaySaleDto
    {
        public string Day { get; set; } = string.Empty;
        public decimal Sales { get; set; }
    }
}
