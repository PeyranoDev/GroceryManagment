using Application.Schemas.Products;
using AutoMapper;
using Domain.Entities;

namespace Application.Mapping
{
    public class ProductProfile : Profile
    {
        public ProductProfile()
        {
            CreateMap<ProductForCreateDto, Product>()
                .ForMember(dest => dest.InventoryItems, opt => opt.Ignore());
            
            CreateMap<ProductForUpdateDto, Product>()
                .ForMember(dest => dest.InventoryItems, opt => opt.Ignore());

            CreateMap<Product, ProductForResponseDto>()
                .ForMember(dest => dest.SalePrice, opt => opt.Ignore())
                .ForMember(dest => dest.Unit, opt => opt.Ignore());

            
        }
    }
}
