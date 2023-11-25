using Microsoft.AspNetCore.Http;
using SuperLaw.Services.DTO;
using SuperLaw.Services.Input;

namespace SuperLaw.Services.Interfaces
{
    public interface IProfileService
    {
        Task UploadImageAsync(int profileId, IFormFile image);

        Task<int> CreateProfileAsync(string userId, CreateProfileInput input);

        Task<int> EditProfileAsync(string userId, CreateProfileInput input);

        Task<LawyerProfileDto?> GetOwnProfileAsync(string userId);

        Task<LawyerProfileDto?> GetProfileByIdAsync(int id);

        Task<LawyerProfileEditDto> GetOwnProfileDataForEditAsync(string userId);

        List<LawyerProfileDto> GetAll(string? userId, GetAllProfilesInput input);
    }
}
