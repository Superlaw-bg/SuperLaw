namespace SuperLaw.Services
{
    public interface IAuthService
    {
        Task<string?> Register(string email, string password, string confirmPassword);
        
        Task<string?> Login(string email, string password);

        public void LogOut();
    }
}
