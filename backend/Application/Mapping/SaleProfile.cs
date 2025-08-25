using Application.Schemas.Sales;
using AutoMapper;
using Domain.Entities;

namespace Application.Mapping
{
    public class SaleProfile : Profile
    {
        public SaleProfile()
        {
            CreateMap<SaleForCreateDto, Sale>()
                .ForMember(dest => dest.Date, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.Total, opt => opt.Ignore());
            
            CreateMap<SaleItemForCreateDto, SaleItem>();
            CreateMap<Sale, SaleForResponseDto>();
            CreateMap<SaleItem, SaleItemForResponseDto>();
        }
    }
}