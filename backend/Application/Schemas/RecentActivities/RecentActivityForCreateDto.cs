using System.ComponentModel.DataAnnotations;

namespace Application.Schemas.RecentActivities
{
    public class RecentActivityForCreateDto
    {
        [Required, MaxLength(500)]
        public string Action { get; set; } = null!;
    }
}