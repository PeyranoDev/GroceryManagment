using Application.Schemas.RecentActivities;
using Application.Services.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Repositories;
using Domain.Tenancy;

namespace Application.Services.Implementations
{
    public class RecentActivityService : IRecentActivityService
    {
        private readonly IRecentActivityRepository _activities;
        private readonly ITenantProvider _tenantProvider;
        private readonly IMapper _mapper;

        public RecentActivityService(IRecentActivityRepository activities, ITenantProvider tenantProvider, IMapper mapper)
        {
            _activities = activities;
            _tenantProvider = tenantProvider;
            _mapper = mapper;
        }

        public async Task<RecentActivityForResponseDto?> GetById(int id)
        {
            var activity = await _activities.GetById(id);
            if (activity is null || activity.GroceryId != _tenantProvider.CurrentGroceryId)
                return null;
            
            return _mapper.Map<RecentActivityForResponseDto>(activity);
        }

        public async Task<IReadOnlyList<RecentActivityForResponseDto>> GetAll()
        {
            var list = await _activities.GetAllByGroceryId(_tenantProvider.CurrentGroceryId);
            
            if (list == null)
            {
                return new List<RecentActivityForResponseDto>();
            }
            
            return list.Select(_mapper.Map<RecentActivityForResponseDto>).ToList();
        }

        public async Task<IReadOnlyList<RecentActivityForResponseDto>> GetRecent(int count = 10)
        {
            var list = await _activities.GetRecent(count);
            var filteredList = list.Where(a => a.GroceryId == _tenantProvider.CurrentGroceryId).Take(count).ToList();
            return filteredList.Select(_mapper.Map<RecentActivityForResponseDto>).ToList();
        }

        public async Task<RecentActivityForResponseDto> Create(RecentActivityForCreateDto dto)
        {
            var entity = _mapper.Map<RecentActivity>(dto);
            entity.GroceryId = _tenantProvider.CurrentGroceryId;
            entity.Date = DateTime.UtcNow;
            
            var id = await _activities.Create(entity);
            var created = await _activities.GetById(id)!;
            return _mapper.Map<RecentActivityForResponseDto>(created);
        }

        public async Task<bool> Delete(int id)
        {
            var entity = await _activities.GetById(id);
            if (entity is null || entity.GroceryId != _tenantProvider.CurrentGroceryId) 
                return false;
            
            await _activities.Delete(entity);
            await _activities.SaveChanges();
            return true;
        }

        public async Task LogActivityAsync(string action, int groceryId)
        {
            var activity = new RecentActivity
            {
                Action = action,
                Date = DateTime.UtcNow,
                GroceryId = groceryId
            };

            await _activities.Create(activity);
            await _activities.SaveChanges();
        }
    }
}