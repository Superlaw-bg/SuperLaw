using SuperLaw.Services.Input;

namespace SuperLaw.Services.Interfaces
{
    public interface IAuthService
    {
        Task<string> Login(LoginInput input);
        Task RegisterUser(RegisterUserInput input);

        Task RegisterLawyer(RegisterLawyerInput input);

        Task<string> ConfirmEmail(string token, string email);
    }
}
