using Application.Schemas.RecentActivities;

namespace Application.Services.Interfaces
{
    public interface IRecentActivityService
    {
        Task<RecentActivityForResponseDto?> GetById(int id);
        Task<IReadOnlyList<RecentActivityForResponseDto>> GetAll();
        Task<RecentActivityForResponseDto> Create(RecentActivityForCreateDto dto);
        Task<bool> Delete(int id);
        Task<IReadOnlyList<RecentActivityForResponseDto>> GetRecent(int count = 10);
    }
}