using SuperLaw.Services.Input;

namespace SuperLaw.Services.Interfaces
{
    public interface IProfileService
    {
        Task CreateProfileAsync(string userId, CreateProfileInput input);
    }
}
