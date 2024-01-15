using SuperLaw.Services.DTO;
using SuperLaw.Services.Input;

namespace SuperLaw.Services.Interfaces
{
    public interface IAuthService
    {
        Task<UserInfoDto> Login(LoginInput input);
        Task RegisterUser(RegisterUserInput input);

        Task RegisterLawyer(RegisterLawyerInput input);

        Task<UserInfoDto> ConfirmEmail(string token, string email);

        void SendPhoneVerification(string phoneNumber);

        bool VerifyPhone(ConfirmPhoneInput input);

        Task ForgotPasswordAsync (string email);

        Task ResetPasswordAsync(ResetPasswordInput input);
    }
}
