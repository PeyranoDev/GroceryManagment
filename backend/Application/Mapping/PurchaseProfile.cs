using Application.Schemas.Purchases;
using Application.Schemas.Reports;
using AutoMapper;
using Domain.Entities;

namespace Application.Mapping
{
    public class PurchaseProfile : Profile
    {
        public PurchaseProfile()
        {
            CreateMap<PurchaseForCreateDto, Purchase>()
                .ForMember(dest => dest.Total, opt => opt.Ignore())
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.GroceryId, opt => opt.Ignore())
                .ForMember(dest => dest.Grocery, opt => opt.Ignore());
            
            CreateMap<PurchaseForUpdateDto, Purchase>()
                .ForMember(dest => dest.Total, opt => opt.Ignore())
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.GroceryId, opt => opt.Ignore())
                .ForMember(dest => dest.Grocery, opt => opt.Ignore());
            
            CreateMap<Purchase, PurchaseForResponseDto>();
            
            CreateMap<PurchaseItemForCreateDto, PurchaseItem>()
                .ForMember(dest => dest.TotalCost, opt => opt.MapFrom(src => src.Quantity * src.UnitCost))
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.PurchaseId, opt => opt.Ignore())
                .ForMember(dest => dest.Purchase, opt => opt.Ignore())
                .ForMember(dest => dest.Product, opt => opt.Ignore())
                .ForMember(dest => dest.GroceryId, opt => opt.Ignore())
                .ForMember(dest => dest.Grocery, opt => opt.Ignore());
            
            CreateMap<PurchaseItemForUpdateDto, PurchaseItem>()
                .ForMember(dest => dest.TotalCost, opt => opt.MapFrom(src => src.Quantity * src.UnitCost))
                .ForMember(dest => dest.PurchaseId, opt => opt.Ignore())
                .ForMember(dest => dest.Purchase, opt => opt.Ignore())
                .ForMember(dest => dest.Product, opt => opt.Ignore())
                .ForMember(dest => dest.GroceryId, opt => opt.Ignore())
                .ForMember(dest => dest.Grocery, opt => opt.Ignore());
            
            CreateMap<PurchaseItem, PurchaseItemForResponseDto>();
            
            // Mapeo para reportes
            CreateMap<Purchase, ReportDataDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => $"C-{src.Id:D4}"))
                .ForMember(dest => dest.Type, opt => opt.MapFrom(src => "Compra"))
                .ForMember(dest => dest.User, opt => opt.MapFrom(src => "Sistema"))
                .ForMember(dest => dest.Supplier, opt => opt.MapFrom(src => src.Supplier));
        }
    }
}
