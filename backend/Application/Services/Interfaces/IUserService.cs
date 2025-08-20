using Domain.Entities;

namespace Application.Services
{
    public interface IUserService
    {
        Task<int> CreateUser(User userToCreate);
    }
}