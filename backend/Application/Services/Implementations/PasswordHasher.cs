using Application.Services.Interfaces;

namespace Application.Services.Implementations
{
    public class PasswordHasher : IPasswordHasher
    {
        private readonly int _workFactor;

        public PasswordHasher(int workFactor = 11) 
        {
            _workFactor = workFactor;
        }

        public string Hash(string password)
        {

            return BCrypt.Net.BCrypt.HashPassword(password, _workFactor);
        }

        public bool Verify(string password, string hash)
        {
            return BCrypt.Net.BCrypt.Verify(password, hash);
        }
    }
}
