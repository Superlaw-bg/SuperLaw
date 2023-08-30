using Microsoft.AspNetCore.Mvc;

namespace SuperLaw.Services
{
    public interface IAuthService
    {
        Task<string> Login(string email, string password);
        Task<string> Register(string email, string password, string confirmPassword);

        Task<bool> ConfirmEmail(string token, string email);
    }
}
