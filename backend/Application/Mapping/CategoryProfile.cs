using Application.Schemas.Categories;
using AutoMapper;
using Domain.Entities;

namespace Application.Mapping
{
    public class CategoryProfile : Profile
    {
        public CategoryProfile()
        {
            CreateMap<CategoryForCreateDto, Category>();
            CreateMap<CategoryForUpdateDto, Category>();
            CreateMap<Category, CategoryForResponseDto>();
        }
    }
}