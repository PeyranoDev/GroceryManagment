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
                .ForMember(dest => dest.Date, opt => opt.MapFrom(src => src.Date))
                .ForMember(dest => dest.Total, opt => opt.Ignore())
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.GroceryId, opt => opt.Ignore())
                .ForMember(dest => dest.Grocery, opt => opt.Ignore())
                .ForMember(dest => dest.User, opt => opt.Ignore())
                .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src.Items));
            
            CreateMap<SaleItemForCreateDto, SaleItem>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.SaleId, opt => opt.Ignore())
                .ForMember(dest => dest.Sale, opt => opt.Ignore())
                .ForMember(dest => dest.Product, opt => opt.Ignore())
                .ForMember(dest => dest.GroceryId, opt => opt.Ignore())
                .ForMember(dest => dest.Grocery, opt => opt.Ignore());
                
            CreateMap<Sale, SaleForResponseDto>();
            CreateMap<SaleItem, SaleItemForResponseDto>();
            
            CreateMap<SaleDetailsDto, Sale>()
                .ForMember(dest => dest.Date, opt => opt.MapFrom(src => src.Date))
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.Total, opt => opt.Ignore())
                .ForMember(dest => dest.GroceryId, opt => opt.Ignore())
                .ForMember(dest => dest.UserId, opt => opt.Ignore())
                .ForMember(dest => dest.User, opt => opt.Ignore())
                .ForMember(dest => dest.Grocery, opt => opt.Ignore())
                .ForMember(dest => dest.Items, opt => opt.Ignore());
        }
    }
}
