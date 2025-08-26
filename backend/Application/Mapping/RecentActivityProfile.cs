using Application.Schemas.RecentActivities;
using AutoMapper;
using Domain.Entities;

namespace Application.Mapping
{
    public class RecentActivityProfile : Profile
    {
        public RecentActivityProfile()
        {
            CreateMap<RecentActivityForCreateDto, RecentActivity>()
                .ForMember(dest => dest.Date, opt => opt.MapFrom(src => DateTime.UtcNow));
            
            CreateMap<RecentActivity, RecentActivityForResponseDto>();
        }
    }
}