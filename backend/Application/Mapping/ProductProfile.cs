using Application.Schemas.Products;
using AutoMapper;
using Domain.Entities;

namespace Application.Mapping
{
    public class ProductProfile : Profile
    {
        public ProductProfile()
        {
            CreateMap<ProductForCreateDto, Product>();
            CreateMap<ProductForUpdateDto, Product>();
            CreateMap<Product, ProductForResponseDto>();
            CreateMap<Promotion, PromotionDto>().ReverseMap();
        }
    }
}