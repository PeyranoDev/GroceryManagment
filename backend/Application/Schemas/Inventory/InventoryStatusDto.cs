namespace Application.Schemas.Inventory
{
    public class InventoryStatusDto
    {
        public string Status { get; set; } = string.Empty; // "normal", "low", "out"
        public string StatusText { get; set; } = string.Empty;
        public string StatusColor { get; set; } = string.Empty;
    }
}
