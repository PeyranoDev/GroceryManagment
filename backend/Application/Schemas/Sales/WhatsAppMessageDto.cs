namespace Application.Schemas.Sales
{
    public class WhatsAppMessageDto
    {
        public string ClientName { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public decimal Total { get; set; }
        public decimal DeliveryCost { get; set; }
        public List<SaleCartDto> Items { get; set; } = new List<SaleCartDto>();
        public DateTime Date { get; set; }
        public string Time { get; set; } = string.Empty;
        public string PaymentMethod { get; set; } = string.Empty;
        public bool IsOnline { get; set; }
    }
}
