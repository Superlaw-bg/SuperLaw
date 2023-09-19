using CloudinaryDotNet.Actions;
using CloudinaryDotNet;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using SuperLaw.Common.Options;
using SuperLaw.Services.Interfaces;
using SuperLaw.Common;

namespace SuperLaw.Services
{
    public class FileUploadService : IFileUploadService
    {
        private readonly IOptions<CloudinaryOptions> _options;
        private readonly Cloudinary _cloudinary;

        public FileUploadService(Cloudinary cloudinary, IOptions<CloudinaryOptions> options)
        {
            _cloudinary = cloudinary;
            _options = options;
        }

        public async Task<string> UploadImageAsync(IFormFile image, string fileName)
        {
            byte[] destinationData;

            using (var ms = new MemoryStream())
            {
                await image.CopyToAsync(ms);
                destinationData = ms.ToArray();
            }

            UploadResult uploadResult;

            using (var ms = new MemoryStream(destinationData))
            {
                ImageUploadParams uploadParams = new ImageUploadParams
                {
                    Folder = _options.Value.ImgFolder,
                    File = new FileDescription(fileName, ms)
                };

                uploadResult = await _cloudinary.UploadAsync(uploadParams);
            }

            if (uploadResult == null)
            {
                throw new BusinessException("Снимката не успя да се качи, моля опитайте отново по-късно");
            }

            return uploadResult?.SecureUri.AbsoluteUri;
        }

        public async Task DeleteImageAsync(string imagePath)
        {
            var imageIdWithExtension = imagePath.Split($"{_options.Value.ImgFolder}/")[1];
            var imageId = imageIdWithExtension.Split(".")[0];

            await _cloudinary.DestroyAsync(new DeletionParams($"{_options.Value.ImgFolder}/{imageId}"));
        }
    }
}
