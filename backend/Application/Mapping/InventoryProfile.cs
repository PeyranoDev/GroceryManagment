using Application.Schemas.Inventory;
using AutoMapper;
using Domain.Entities;

namespace Application.Mapping
{
    public class InventoryProfile : Profile
    {
        public InventoryProfile()
        {
            CreateMap<InventoryItemForCreateDto, InventoryItem>();
            CreateMap<InventoryItemForUpdateDto, InventoryItem>();
            CreateMap<InventoryItem, InventoryItemForResponseDto>();
        }
    }
}