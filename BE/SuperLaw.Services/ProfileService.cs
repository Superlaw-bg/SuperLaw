using Microsoft.EntityFrameworkCore;
using SuperLaw.Common;
using SuperLaw.Data;
using SuperLaw.Data.Models;
using SuperLaw.Data.Models.Enums;
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

            var timeSlots = GetProfileTimeSlots(input);

            var profile = new LawyerProfile()
            {
                UserId = userId,
                ImgPath = imagePath,
                Info = input.Description,
                Address = input.Address,
                Rate = input.Rate,
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
                TimeSlots = timeSlots,
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
                .Include(x => x.TimeSlots)
                .ThenInclude(x => x.Meeting)
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
            profile.Rate = input.Rate;
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

            var timeSlots = GetProfileTimeSlots(input);

            var timeSlotIds = timeSlots.Select(x => x.Id).ToList();

            var toAdd = timeSlots
                .Where(x => x.Id == 0)
                .ToList();

            var todayDate = DateTime.UtcNow.Date;

            foreach (var timeSlot in profile.TimeSlots.ToList())
            {
                if (!timeSlotIds.Contains(timeSlot.Id))
                {
                    if (timeSlot.Meeting != null && timeSlot.Meeting.DateTime.Date >= todayDate)
                    {
                        continue;
                    }

                    _context.TimeSlots.Remove(timeSlot);
                }
            }

            foreach (var timeSlot in toAdd)
            {
                profile.TimeSlots.Add(timeSlot);
            }

            _context.LawyerProfiles.Update(profile);
            await _context.SaveChangesAsync();
        }

        public async Task<LawyerProfileDto?> GetOwnProfileAsync(string userId)
        {
            var userLawyerProfile = await _context.LawyerProfiles
                .Include(x => x.User)
                .ThenInclude(x => x.City)
                .Include(x => x.JudicialRegions)
                .ThenInclude(x => x.Region)
                .Include(x => x.LegalCategories)
                .ThenInclude(x => x.Category)
                .Include(x => x.TimeSlots)
                .ThenInclude(x => x.Meeting)
                .ThenInclude(x => x.Client)
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
                Rate = userLawyerProfile.Rate,
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
                Rating = Math.Round(userLawyerProfile.Rating, 1),
                City = userLawyerProfile.User.City.Name,
                IsCompleted = userLawyerProfile.IsCompleted,
                IsJunior = userLawyerProfile.IsJunior,
            };

            SetScheduleForProfileDto(userLawyerProfile.TimeSlots.OrderBy(x => x.From).ToList(), result, true);

            return result;
        }

        public async Task<LawyerProfileDto?> GetProfileByIdAsync(int id)
        {
            var userLawyerProfile = await _context.LawyerProfiles
                .Include(x => x.User)
                .ThenInclude(x => x.City)
                .Include(x => x.JudicialRegions)
                .ThenInclude(x => x.Region)
                .Include(x => x.LegalCategories)
                .ThenInclude(x => x.Category)
                .Include(x => x.TimeSlots)
                .ThenInclude(x => x.Meeting)
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
                Rate = userLawyerProfile.Rate,
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
                Rating = Math.Round(userLawyerProfile.Rating, 1),
                City = userLawyerProfile.User.City.Name,
                IsCompleted = userLawyerProfile.IsCompleted,
                IsJunior = userLawyerProfile.IsJunior,
            };
           
            SetScheduleForProfileDto(userLawyerProfile.TimeSlots.OrderBy(x => x.From).ToList(), result);

            return result;
        }

        public async Task<LawyerProfileEditDto> GetOwnProfileDataForEditAsync(string userId)
        {
            var userLawyerProfile = await _context.LawyerProfiles
                .Include(x => x.JudicialRegions)
                .ThenInclude(x => x.Region)
                .Include(x => x.LegalCategories)
                .ThenInclude(x => x.Category)
                .Include(x => x.TimeSlots)
                .ThenInclude(x => x.Meeting)
                .ThenInclude(x => x.Client)
                .SingleAsync(x => x.UserId == userId);

            var result = new LawyerProfileEditDto()
            {
                Id = userLawyerProfile.Id,
                Description = userLawyerProfile.Info,
                Address = userLawyerProfile.Address,
                Rate = userLawyerProfile.Rate,
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

            SetScheduleForProfileDto(userLawyerProfile.TimeSlots.OrderBy(x => x.From).ToList(), result);

            return result;
        }

        public List<LawyerProfileDto> GetAll(string? userId, GetAllProfilesInput input)
        {
            var profileQuery = _context.LawyerProfiles
                .Where(x => x.IsCompleted);

            if (userId != null)
            {
                profileQuery = profileQuery.Where(x => x.UserId != userId);
            }

            var profiles = profileQuery
                .Include(x => x.User)
                .ThenInclude(x => x.City)
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
                    Rate = x.Rate,
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
                    }).ToList(),
                    Rating = Math.Round(x.Rating, 1),
                    CityId = x.User.CityId,
                    City = x.User.City.Name,
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

            if (input.CityId != null && input.CityId != 0)
            {
                profiles = profiles.Where(x => x.CityId == input.CityId).ToList();
            }

            return profiles
                .OrderByDescending(x => x.Rating)
                .ThenBy(x => x.FullName)
                .ToList();
        }

        private void ValidateTimeSlot(int fromHours, int fromMinutes, int toHours, int toMinutes, DayEnum? day) 
        {
            var todayDate = DateTime.Now;

            var newFrom = new DateTime(todayDate.Year, todayDate.Month, todayDate.Day, fromHours, fromMinutes, 0);
            var newTo = new DateTime(todayDate.Year, todayDate.Month, todayDate.Day, toHours, toMinutes, 0);

            var newFromTime = newFrom.Ticks;
            var newToTime = newTo.Ticks;

            //Check if time slot is valid
            if (newFromTime >= newToTime) {
                throw new BusinessException($"{day}: Началният час не може да е след крайния");
            }

            //Check if from time is valid
            if (fromHours is >= 21 or < 6) {
                throw new BusinessException($"{day}: Началният час трябва да е между 6 и 21");
            }
  
            //Check if to time is valid
            if (toHours is >= 22 or < 6) {
                throw new BusinessException($"{day}: Крайният час трябва да е между 6 и 22");
            }

            var minuteDiffBetweenToAndFrom = Math.Abs((newFrom.Minute + (newFrom.Hour * 60)) - (newTo.Minute + (newTo.Hour * 60)));
            //Check for minute diffs if its more than 2 hours
            if (minuteDiffBetweenToAndFrom > 120)
            {
                throw new BusinessException($"{day}: Не може да е повече от 2 часа");
            }

            //Check for minute diffs if its less than half hour
            if (minuteDiffBetweenToAndFrom < 30)
            {
                throw new BusinessException($"{day}: Не може да е по-малко от половин час");
            }
        }

        private List<TimeSlot> GetProfileTimeSlots(CreateProfileInput input)
        {
            var timeSlots = new List<TimeSlot>();

            //Saving the meeting date with the end hour but in utc in order to more easily decide if the meeting is in the past or not
            TimeZoneInfo easternZone = TimeZoneInfo.FindSystemTimeZoneById("E. Europe Standard Time");

            foreach (var scheduleForDay in input.Schedule)
            {
                var i = 0;
                var timeSlotDate = scheduleForDay.Date;
                foreach (var timeSlotDto in scheduleForDay.TimeSlots)
                {
                    var fromHours = int.Parse(timeSlotDto.From.Split(':')[0]);
                    var fromMinutes = int.Parse(timeSlotDto.From.Split(':')[1]);

                    var toHours = int.Parse(timeSlotDto.To.Split(':')[0]);
                    var toMinutes = int.Parse(timeSlotDto.To.Split(':')[1]);

                    ValidateTimeSlot(fromHours, fromMinutes, toHours, toMinutes, null);

                    var otherTimeSlots = scheduleForDay.TimeSlots.Where((x, index) => index != i).ToList();

                    ValidateTimeSlotsInDay(fromHours, fromMinutes, toHours, toMinutes, otherTimeSlots, null);

                    //from fe it is selected for example 19.10 midnight but comming to be as 18.10 21:00
                    //because of time change in the end of october also it is possible the time to come as 22

                    if (timeSlotDate.Hour == 21 || timeSlotDate.Hour == 22)
                    {
                        timeSlotDate = timeSlotDate.Date.AddDays(1);
                    }

                    var meetingDateEndWithHourInUtc = timeSlotDate.Date.AddHours(toHours).AddMinutes(toMinutes);

                    var utcOffsetInHours = easternZone.GetUtcOffset(timeSlotDate.Date).Hours;
                    meetingDateEndWithHourInUtc = meetingDateEndWithHourInUtc.AddHours(0 - utcOffsetInHours);

                    var timeSlot = new TimeSlot()
                    {
                        Id = timeSlotDto.Id,
                        From = new TimeSpan(fromHours, fromMinutes, 0),
                        To = new TimeSpan(toHours, toMinutes, 0),
                        Date = meetingDateEndWithHourInUtc
                    };

                    timeSlots.Add(timeSlot);

                    i++;
                }

            }

            return timeSlots;
        }
        private void ValidateTimeSlotsInDay(int fromHours, int fromMinutes, int toHours, int toMinutes, List<TimeSlotDto> timeSlots, DayEnum? day)
        {
            var todayDate = DateTime.Now;

            var newFrom = new DateTime(todayDate.Year, todayDate.Month, todayDate.Day, fromHours, fromMinutes, 0);
            var newTo = new DateTime(todayDate.Year, todayDate.Month, todayDate.Day, toHours, toMinutes, 0);

            for (var i = 0; i < timeSlots.Count; i++)
            {
                var timeSlot = timeSlots[i];

                var timeSlotFromHours = int.Parse(timeSlot.From.Split(':')[0]);
                var timeSlotFromMinutes = int.Parse(timeSlot.From.Split(':')[1]);

                var timeSlotToHours = int.Parse(timeSlot.To.Split(':')[0]);
                var timeSlotToMinutes = int.Parse(timeSlot.To.Split(':')[1]);

                var timeSlotFrom = new DateTime(todayDate.Year, todayDate.Month, todayDate.Day, timeSlotFromHours, timeSlotFromMinutes, 0);
                var timeSlotTo = new DateTime(todayDate.Year, todayDate.Month, todayDate.Day, timeSlotToHours, timeSlotToMinutes, 0);

                if (timeSlotFrom < newTo && newFrom < timeSlotTo)
                {
                    throw new BusinessException($"{day}: Застъпват се");
                }
            }
        }

        private void SetScheduleForProfileDto(List<TimeSlot> timeSlots, LawyerProfileBaseDto dto, bool withPastTimeSlots = false)
        {
            var validTimeSlots = timeSlots;

            if (!withPastTimeSlots)
            {
                validTimeSlots = timeSlots
                    .Where(x => x.Date.Date >= DateTime.UtcNow.Date)
                    .ToList();
            }

            foreach (var timeSlot in validTimeSlots)
            {
                var fromStr = $"{timeSlot.From.Hours}:{timeSlot.From.Minutes}";
                var toStr = $"{timeSlot.To.Hours}:{timeSlot.To.Minutes}";

                if (timeSlot.From.Minutes < 10)
                {
                    fromStr = $"{timeSlot.From.Hours}:0{timeSlot.From.Minutes}";
                }

                if (timeSlot.To.Minutes < 10)
                {
                    toStr = $"{timeSlot.To.Hours}:0{timeSlot.To.Minutes}";
                }

                var timeSlotDto = new TimeSlotDto()
                {
                    Id = timeSlot.Id,
                    From = fromStr,
                    To = toStr,
                    HasMeeting = timeSlot.Meeting != null
                };

                if (timeSlotDto.HasMeeting && timeSlot.Meeting is {Client: not null})
                {
                    timeSlotDto.ClientName = $"{timeSlot.Meeting.Client.FirstName} {timeSlot.Meeting.Client.LastName}";
                }

                var scheduleDay = dto.Schedule.SingleOrDefault(x => x.Date.Date == timeSlot.Date.Date);

                if (scheduleDay == null)
                {
                    dto.Schedule.Add(new ScheduleDto()
                    {
                        Date = timeSlot.Date.Date,
                        TimeSlots = new List<TimeSlotDto>()
                        {
                            timeSlotDto
                        }
                    });
                }
                else
                {
                    scheduleDay.TimeSlots.Add(timeSlotDto);
                }
            }
        }
    }
}
