using Application.Schemas.Inventory;
using AutoMapper;
using Domain.Entities;

namespace Application.Mapping
{
    public class InventoryProfile : Profile
    {
        public InventoryProfile()
        {
            CreateMap<InventoryItemForCreateDto, InventoryItem>()
                .ForMember(dest => dest.LastUpdated, opt => opt.MapFrom(src => DateTime.UtcNow));
            
            CreateMap<InventoryItemForUpdateDto, InventoryItem>()
                .ForMember(dest => dest.LastUpdated, opt => opt.MapFrom(src => DateTime.UtcNow));
            
            CreateMap<InventoryItem, InventoryItemForResponseDto>();
            
            CreateMap<StockAdjustmentDto, InventoryItem>()
                .ForMember(dest => dest.Stock, opt => opt.MapFrom(src => src.NewStock))
                .ForMember(dest => dest.LastUpdated, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.Product, opt => opt.Ignore())
                .ForMember(dest => dest.Grocery, opt => opt.Ignore())
                .ForMember(dest => dest.GroceryId, opt => opt.Ignore())
                .ForMember(dest => dest.Promotion, opt => opt.Ignore());
        }
    }
}