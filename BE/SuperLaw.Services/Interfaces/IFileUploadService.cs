using Microsoft.AspNetCore.Http;

namespace SuperLaw.Services.Interfaces
{
    public interface IFileUploadService
    {
        Task<string> UploadImageAsync(IFormFile image, string fileName);
        Task DeleteImageAsync(string imagePath);
    }
}
