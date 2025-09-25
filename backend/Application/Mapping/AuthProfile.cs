using Application.Schemas.Auth;
using Application.Schemas.Users;
using AutoMapper;
using Domain.Entities;

namespace Application.Mapping
{
    public class AuthProfile : Profile
    {
        public AuthProfile()
        {
            CreateMap<RegisterDto, User>()
                .ForMember(dest => dest.PasswordHash, opt => opt.Ignore()) // Se maneja por separado
                .ForMember(dest => dest.IsSuperAdmin, opt => opt.MapFrom(src => false))
                .ForMember(dest => dest.Id, opt => opt.Ignore());
            
            CreateMap<User, UserInfoDto>();
            
            CreateMap<User, AuthResponseDto>()
                .ForMember(dest => dest.User, opt => opt.MapFrom(src => src))
                .ForMember(dest => dest.Token, opt => opt.Ignore())
                .ForMember(dest => dest.Expiration, opt => opt.Ignore());
        }
    }
}
