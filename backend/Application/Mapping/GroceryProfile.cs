using Application.Schemas.Groceries;
using AutoMapper;
using Domain.Entities;

namespace Application.Mapping
{
    public class GroceryProfile : Profile
    {
        public GroceryProfile()
        {
            CreateMap<GroceryForCreateDto, Grocery>();
            CreateMap<GroceryForUpdateDto, Grocery>();
            CreateMap<Grocery, GroceryForResponseDto>();
        }
    }
}