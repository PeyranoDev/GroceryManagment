using Application.Schemas.RecentActivities;
using Application.Services.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Repositories;

namespace Application.Services.Implementations
{
    public class RecentActivityService : IRecentActivityService
    {
        private readonly IRecentActivityRepository _activities;
        private readonly IMapper _mapper;

        public RecentActivityService(IRecentActivityRepository activities, IMapper mapper)
        {
            _activities = activities;
            _mapper = mapper;
        }

        public async Task<RecentActivityForResponseDto?> GetById(int id)
        {
            var activity = await _activities.GetById(id);
            return activity is null ? null : _mapper.Map<RecentActivityForResponseDto>(activity);
        }

        public async Task<IReadOnlyList<RecentActivityForResponseDto>> GetAll()
        {
            var list = await _activities.GetAll();
            return list.Select(_mapper.Map<RecentActivityForResponseDto>).ToList();
        }

        public async Task<IReadOnlyList<RecentActivityForResponseDto>> GetRecent(int count = 10)
        {
            var list = await _activities.GetRecent(count);
            return list.Select(_mapper.Map<RecentActivityForResponseDto>).ToList();
        }

        public async Task<RecentActivityForResponseDto> Create(RecentActivityForCreateDto dto)
        {
            var entity = _mapper.Map<RecentActivity>(dto);
            var id = await _activities.Create(entity);
            var created = await _activities.GetById(id)!;
            return _mapper.Map<RecentActivityForResponseDto>(created);
        }

        public async Task<bool> Delete(int id)
        {
            var entity = await _activities.GetById(id);
            if (entity is null) return false;
            
            await _activities.Delete(entity);
            await _activities.SaveChanges();
            return true;
        }
    }
}