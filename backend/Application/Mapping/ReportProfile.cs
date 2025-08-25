using Application.Schemas.Reports;
using AutoMapper;
using Domain.Entities;

namespace Application.Mapping
{
    public class ReportProfile : Profile
    {
        public ReportProfile()
        {
            CreateMap<Sale, ReportDataDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => $"V-{src.Id:D4}"))
                .ForMember(dest => dest.Type, opt => opt.MapFrom(src => "Venta"))
                .ForMember(dest => dest.User, opt => opt.MapFrom(src => src.User.Name))
                .ForMember(dest => dest.Supplier, opt => opt.Ignore());
        }
    }
}
