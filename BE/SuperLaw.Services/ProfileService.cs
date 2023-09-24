using Microsoft.EntityFrameworkCore;
using SuperLaw.Common;
using SuperLaw.Data;
using SuperLaw.Data.Models;
using SuperLaw.Services.DTO;
using SuperLaw.Services.Input;
using SuperLaw.Services.Interfaces;

namespace SuperLaw.Services
{
    public class ProfileService : IProfileService
    {
        private readonly SuperLawDbContext _context;
        private readonly IFileUploadService _uploadService;

        public ProfileService(SuperLawDbContext context, IFileUploadService uploadService)
        {
            _context = context;
            _uploadService = uploadService;
        }

        public async Task CreateProfileAsync(string userId, CreateProfileInput input)
        {
            var userLawyerProfile = _context.LawyerProfiles.SingleOrDefault(x => x.UserId == userId);

            if (userLawyerProfile != null)
            {
                throw new BusinessException("Вече имате адвокатски профил в системата");
            }

            var categories = _context.LegalCategories
                .Where(x => input.Categories.Contains(x.Id))
                .ToList();

            var regions = _context.JudicialRegions
                .Where(x => input.Regions.Contains(x.Id))
                .ToList();

            //If user had selected whole country option
            if (regions.SingleOrDefault(x => x.Id == 1) != null)
            {
                regions = regions.Where(x => x.Id == 1).ToList();
            }

            var imagePath = string.Empty;

            if (input.Image != null)
            {
                imagePath = await _uploadService.UploadImageAsync(input.Image, userId);
            }

            var profile = new LawyerProfile()
            {
                UserId = userId,
                ImgPath = imagePath,
                Info = input.Description,
                Address = input.Address,
                HourlyRate = input.HourlyRate,
                IsCompleted = input.IsCompleted,
                IsJunior = input.IsJunior,
                LegalCategories = categories.Select(x => new LawyerProfileLegalCategory()
                {
                    CategoryId = x.Id,
                }).ToList(),
                JudicialRegions = regions.Select(x => new LawyerProfileJudicialRegion()
                {
                    RegionId = x.Id,
                }).ToList(),
                CompletedOn = input.IsCompleted ? DateTime.UtcNow : DateTime.MinValue
            };

            await _context.LawyerProfiles.AddAsync(profile);
            await _context.SaveChangesAsync();
        }

        public async Task EditProfileAsync(string userId, CreateProfileInput input)
        {
            var profile = await _context.LawyerProfiles
                .Include(x => x.JudicialRegions)
                .ThenInclude(x => x.Region)
                .Include(x => x.LegalCategories)
                .ThenInclude(x => x.Category)
                .SingleOrDefaultAsync(x => x.UserId == userId);

            if (profile == null)
            {
                throw new BusinessException("Нямате адвокатски профил в системата");
            }

            var categories = _context.LegalCategories
                .Where(x => input.Categories.Contains(x.Id))
                .ToList();

            var regions = _context.JudicialRegions
                .Where(x => input.Regions.Contains(x.Id))
                .ToList();

            //If user had selected whole country option
            if (regions.SingleOrDefault(x => x.Id == 1) != null)
            {
                regions = regions.Where(x => x.Id == 1).ToList();
            }

            if (input.Image != null)
            {
                if (!string.IsNullOrEmpty(profile.ImgPath))
                {
                    await _uploadService.DeleteImageAsync(profile.ImgPath);
                }

                var imagePath = await _uploadService.UploadImageAsync(input.Image, userId);

                profile.ImgPath = imagePath;
            }

            profile.Address = input.Address;
            profile.HourlyRate = input.HourlyRate;
            profile.Info = input.Description;
            profile.LegalCategories = categories.Select(x => new LawyerProfileLegalCategory()
            {
                CategoryId = x.Id,
            }).ToList();
            profile.JudicialRegions = regions.Select(x => new LawyerProfileJudicialRegion()
            {
                RegionId = x.Id,
            }).ToList(); ;
            profile.IsCompleted = input.IsCompleted;
            profile.IsJunior = input.IsJunior;

            if (profile.IsCompleted)
            {
                profile.CompletedOn = DateTime.UtcNow;
            }

            _context.LawyerProfiles.Update(profile);
            await _context.SaveChangesAsync();
        }

        public async Task<LawyerProfileDto?> GetOwnProfileAsync(string userId)
        {
            var userLawyerProfile = await _context.LawyerProfiles
                .Include(x => x.JudicialRegions)
                .ThenInclude(x => x.Region)
                .Include(x => x.LegalCategories)
                .ThenInclude(x => x.Category)
                .SingleOrDefaultAsync(x => x.UserId == userId);

            if (userLawyerProfile == null)
            {
                return null;
            }

            var user = await _context.Users.SingleOrDefaultAsync(x => x.Id == userId);

            if (user == null)
            {
                return null;
            }

            var result = new LawyerProfileDto()
            {
                Id = userLawyerProfile.Id,
                ImgPath = userLawyerProfile.ImgPath,
                FullName = $"{user.FirstName} {user.Surname} {user.LastName}",
                Description = userLawyerProfile.Info,
                Address = userLawyerProfile.Address,
                Phone = $"0{user.Phone}",
                HourlyRate = userLawyerProfile.HourlyRate,
                Categories = userLawyerProfile.LegalCategories
                    .Select(x => new SimpleDto()
                    {
                        Id = x.CategoryId,
                        Name = x.Category.Name
                    })
                    .OrderBy(x => x.Name)
                    .ToList(),
                Regions = userLawyerProfile.JudicialRegions
                    .Select(x => new SimpleDto()
                    {
                        Id = x.RegionId,
                        Name = x.Region.Name,
                    })
                    .OrderBy(x => x.Name)
                    .ToList(),
                IsCompleted = userLawyerProfile.IsCompleted,
                IsJunior = userLawyerProfile.IsJunior,
            };

            return result;
        }

        public async Task<LawyerProfileDto?> GetProfileByIdAsync(int id)
        {
            var userLawyerProfile = await _context.LawyerProfiles
                .Include(x => x.JudicialRegions)
                .ThenInclude(x => x.Region)
                .Include(x => x.LegalCategories)
                .ThenInclude(x => x.Category)
                .SingleOrDefaultAsync(x => x.Id == id && x.IsCompleted);

            if (userLawyerProfile == null)
            {
                return null;
            }

            var user = await _context.Users.SingleOrDefaultAsync(x => x.Id == userLawyerProfile.UserId);

            if (user == null)
            {
                return null;
            }

            var result = new LawyerProfileDto()
            {
                Id = userLawyerProfile.Id,
                ImgPath = userLawyerProfile.ImgPath,
                FullName = $"{user.FirstName} {user.Surname} {user.LastName}",
                Description = userLawyerProfile.Info,
                Address = userLawyerProfile.Address,
                Phone = $"0{user.Phone}",
                HourlyRate = userLawyerProfile.HourlyRate,
                Categories = userLawyerProfile.LegalCategories
                    .Select(x => new SimpleDto()
                    {
                        Id = x.CategoryId,
                        Name = x.Category.Name
                    })
                    .OrderBy(x => x.Name)
                    .ToList(),
                Regions = userLawyerProfile.JudicialRegions
                    .Select(x => new SimpleDto()
                    {
                        Id = x.RegionId,
                        Name = x.Region.Name,
                    })
                    .OrderBy(x => x.Name)
                    .ToList(),
                IsCompleted = userLawyerProfile.IsCompleted,
                IsJunior = userLawyerProfile.IsJunior,
            };

            return result;
        }

        public async Task<LawyerProfileEditDto> GetOwnProfileDataForEditAsync(string userId)
        {
            var userLawyerProfile = await _context.LawyerProfiles
                .Include(x => x.JudicialRegions)
                .ThenInclude(x => x.Region)
                .Include(x => x.LegalCategories)
                .ThenInclude(x => x.Category)
                .SingleAsync(x => x.UserId == userId);

            var result = new LawyerProfileEditDto()
            {
                Id = userLawyerProfile.Id,
                Description = userLawyerProfile.Info,
                Address = userLawyerProfile.Address,
                HourlyRate = userLawyerProfile.HourlyRate,
                Categories = userLawyerProfile.LegalCategories
                    .Select(x => new FrontEndOptionDto()
                    {
                        Value = x.CategoryId,
                        Label = x.Category.Name
                    })
                    .OrderBy(x => x.Label)
                    .ToList(),
                Regions = userLawyerProfile.JudicialRegions
                    .Select(x => new FrontEndOptionDto()
                    {
                        Value = x.RegionId,
                        Label = x.Region.Name,
                    })
                    .OrderBy(x => x.Label)
                    .ToList(),
                IsCompleted = userLawyerProfile.IsCompleted,
                IsJunior = userLawyerProfile.IsJunior,
            };

            return result;
        }

        public List<LawyerProfileDto> GetAll(string userId, GetAllProfilesInput input)
        {
            var profiles = _context.LawyerProfiles
                .Where(x => x.IsCompleted)
                .Where(x => x.UserId != userId)
                .Include(x => x.User)
                .Include(x => x.JudicialRegions)
                .ThenInclude(x => x.Region)
                .Include(x => x.LegalCategories)
                .ThenInclude(x => x.Category)
                .Select(x => new LawyerProfileDto()
                {
                    Id = x.Id,
                    FullName = $"{x.User.FirstName} {x.User.Surname} {x.User.LastName}",
                    ImgPath = x.ImgPath,
                    Description = x.Info,
                    Address = x.Address,
                    HourlyRate = x.HourlyRate,
                    Phone = x.User.Phone,
                    IsJunior = x.IsJunior,
                    Categories = x.LegalCategories.Select(lc => new SimpleDto()
                    {
                        Id = lc.CategoryId,
                        Name = lc.Category.Name,
                    }).ToList(),
                    Regions = x.JudicialRegions.Select(r => new SimpleDto()
                    {
                        Id = r.RegionId,
                        Name = r.Region.Name,
                    }).ToList()
                })
                .ToList();

            if (!string.IsNullOrEmpty(input.Name))
            {
                profiles = profiles
                    .Where(x => x.FullName.ToLower().Contains(input.Name.ToLower()))
                    .ToList();
            }

            if (!string.IsNullOrEmpty(input.Categories))
            {
                var categoryIds = input.Categories
                    .Split(',')
                    .Select(int.Parse)
                    .ToList();

                foreach (var profile in profiles.ToList())
                {
                    var profileCategories = profile.Categories.Select(x => x.Id).ToList();

                    var commonCategories = profileCategories.Intersect(categoryIds).ToList();

                    if (commonCategories.Count == 0)
                    {
                        profiles.Remove(profile);
                    }
                }
            }

            if (!string.IsNullOrEmpty(input.Regions))
            {
                var regionIds = input.Regions
                    .Split(',')
                    .Select(int.Parse)
                    .ToList();

                foreach (var profile in profiles.ToList())
                {
                    var profileRegions = profile.Regions.Select(x => x.Id).ToList();

                    var commonRegions = profileRegions.Intersect(regionIds).ToList();

                    //Only removes profile if there are no region matches and the profile doesn't have 'whole country' option
                    if (commonRegions.Count == 0 && profile.Regions.SingleOrDefault(x => x.Name == "Цялата страна") == null)
                    {
                        profiles.Remove(profile);
                    }
                }
            }

            return profiles
                .OrderBy(x => x.FullName)
                .ToList();
        }
    }
}
