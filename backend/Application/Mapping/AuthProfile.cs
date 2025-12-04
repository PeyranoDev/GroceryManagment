using Application.Schemas.Auth;
using Application.Schemas.Users;
using AutoMapper;
using Domain.Common.Enums;
using Domain.Entities;

namespace Application.Mapping
{
    public class AuthProfile : Profile
    {
        public AuthProfile()
        {
            CreateMap<RegisterDto, User>()
                .ForMember(dest => dest.PasswordHash, opt => opt.Ignore())
                .ForMember(dest => dest.Id, opt => opt.Ignore());
            
            CreateMap<User, UserInfoDto>();
            
            CreateMap<User, AuthResponseDto>()
                .ForMember(dest => dest.User, opt => opt.MapFrom(src => src))
                .ForMember(dest => dest.Token, opt => opt.Ignore())
                .ForMember(dest => dest.Expiration, opt => opt.Ignore());

            CreateMap<CreateStaffDto, User>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.PasswordHash, opt => opt.Ignore())
                .ForMember(dest => dest.Role, opt => opt.MapFrom(src => GroceryRole.Staff))
                .ForMember(dest => dest.GroceryId, opt => opt.Ignore())
                .ForMember(dest => dest.Grocery, opt => opt.Ignore());

            CreateMap<User, StaffResponseDto>()
                .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.Role ?? GroceryRole.Staff))
                .ForMember(dest => dest.GroceryId, opt => opt.MapFrom(src => src.GroceryId ?? 0));
        }
    }
}
