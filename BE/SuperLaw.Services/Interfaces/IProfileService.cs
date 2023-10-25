using SuperLaw.Services.DTO;
using SuperLaw.Services.Input;

namespace SuperLaw.Services.Interfaces
{
    public interface IProfileService
    {
        Task CreateProfileAsync(string userId, CreateProfileInputNew input);

        Task EditProfileAsync(string userId, CreateProfileInput input);

        Task<LawyerProfileDto?> GetOwnProfileAsync(string userId);

        Task<LawyerProfileDto?> GetProfileByIdAsync(int id);

        Task<LawyerProfileEditDto> GetOwnProfileDataForEditAsync(string userId);

        List<LawyerProfileDto> GetAll(string? userId, GetAllProfilesInput input);
    }
}
