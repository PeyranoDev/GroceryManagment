using Application.Schemas.Dashboard;
using AutoMapper;
using Domain.Entities;

namespace Application.Mapping
{
    public class DashboardProfile : Profile
    {
        public DashboardProfile()
        {
            CreateMap<WeeklySale, WeeklySalesDto>()
                .ForMember(dest => dest.Day, opt => opt.MapFrom(src => GetDayName(src.WeekStart)))
                .ForMember(dest => dest.Sales, opt => opt.MapFrom(src => src.TotalSales));
        }
        
        private static string GetDayName(DateTime date)
        {
            return date.DayOfWeek switch
            {
                DayOfWeek.Monday => "Lun",
                DayOfWeek.Tuesday => "Mar",
                DayOfWeek.Wednesday => "Mié",
                DayOfWeek.Thursday => "Jue",
                DayOfWeek.Friday => "Vie",
                DayOfWeek.Saturday => "Sáb",
                DayOfWeek.Sunday => "Dom",
                _ => "---"
            };
        }
    }
}
