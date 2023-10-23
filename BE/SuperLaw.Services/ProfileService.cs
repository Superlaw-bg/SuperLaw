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
                TimeSlots = timeSlots,
                CompletedOn = input.IsCompleted ? DateTime.UtcNow : DateTime.MinValue
            };

            await _context.LawyerProfiles.AddAsync(profile);

            await _context.SaveChangesAsync();
        }

        private List<TimeSlot> GetProfileTimeSlots(CreateProfileInput input)
        {
            var timeSlots = new List<TimeSlot>();

            for (var i = 1; i <= 7; i++)
            {
                var timeSlotsForTheDay = input.Schedule.Monday;
                var dayOfWeek = DayEnum.Monday;

                switch (i)
                {
                    case 1:
                        timeSlotsForTheDay = input.Schedule.Monday;
                        dayOfWeek = DayEnum.Monday;
                        break;
                    case 2:
                        timeSlotsForTheDay = input.Schedule.Tuesday;
                        dayOfWeek = DayEnum.Tuesday;
                        break;
                    case 3:
                        timeSlotsForTheDay = input.Schedule.Wednesday;
                        dayOfWeek = DayEnum.Wednesday;
                        break;
                    case 4:
                        timeSlotsForTheDay = input.Schedule.Thursday;
                        dayOfWeek = DayEnum.Thursday;
                        break;
                    case 5:
                        timeSlotsForTheDay = input.Schedule.Friday;
                        dayOfWeek = DayEnum.Friday;
                        break;
                    case 6:
                        timeSlotsForTheDay = input.Schedule.Saturday;
                        dayOfWeek = DayEnum.Saturday;
                        break;
                    case 7:
                        timeSlotsForTheDay = input.Schedule.Sunday;
                        dayOfWeek = DayEnum.Sunday;
                        break;
                }

                for (var j = 0; j < timeSlotsForTheDay.ToList().Count; j++)
                {
                    var timeSlotDto = timeSlotsForTheDay[j];

                    var fromHours = int.Parse(timeSlotDto.From.Split(':')[0]);
                    var fromMinutes = int.Parse(timeSlotDto.From.Split(':')[1]);

                    var toHours = int.Parse(timeSlotDto.To.Split(':')[0]);
                    var toMinutes = int.Parse(timeSlotDto.To.Split(':')[1]);

                    ValidateTimeSlot(fromHours, fromMinutes, toHours, toMinutes, dayOfWeek);

                    var otherTimeSlots = timeSlotsForTheDay.Where((x, index) => index != j).ToList();

                    ValidateTimeSlotsInDay(fromHours, fromMinutes, toHours, toMinutes, otherTimeSlots, dayOfWeek);

                    var timeSlot = new TimeSlot()
                    {
                        From = new TimeSpan(fromHours, fromMinutes, 0),
                        To = new TimeSpan(toHours, toMinutes, 0),
                        DayOfWeek = dayOfWeek
                    };

                    timeSlots.Add(timeSlot);
                }
            }

            return timeSlots;
        }

        public async Task EditProfileAsync(string userId, CreateProfileInput input)
        {
            var profile = await _context.LawyerProfiles
                .Include(x => x.JudicialRegions)
                .ThenInclude(x => x.Region)
                .Include(x => x.LegalCategories)
                .ThenInclude(x => x.Category)
                .Include(x => x.TimeSlots)
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

            var profileTimeSlots = _context.TimeSlots
                .Where(x => x.ProfileId == profile.Id)
                .ToList();
            
            _context.TimeSlots.RemoveRange(profileTimeSlots);

            var timeSlots = GetProfileTimeSlots(input);
            profile.TimeSlots = timeSlots;

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
                .Include(x => x.TimeSlots)
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
                Rating = Math.Round(userLawyerProfile.Rating, 1),
                Schedule = new ScheduleDto(),
                IsCompleted = userLawyerProfile.IsCompleted,
                IsJunior = userLawyerProfile.IsJunior,
            };

            SetScheduleForProfileDto(userLawyerProfile.TimeSlots.OrderBy(x => x.From).ToList(), result);

            return result;
        }

        public async Task<LawyerProfileDto?> GetProfileByIdAsync(int id)
        {
            var userLawyerProfile = await _context.LawyerProfiles
                .Include(x => x.JudicialRegions)
                .ThenInclude(x => x.Region)
                .Include(x => x.LegalCategories)
                .ThenInclude(x => x.Category)
                .Include(x => x.TimeSlots)
                .Include(x => x.Meetings)
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
                Rating = Math.Round(userLawyerProfile.Rating, 1),
                IsCompleted = userLawyerProfile.IsCompleted,
                IsJunior = userLawyerProfile.IsJunior,
            };

            SetScheduleForProfileDto(userLawyerProfile.TimeSlots.OrderBy(x => x.From).ToList(), result);

            SetMeetingsProfileDto(userLawyerProfile.Meetings.ToList(), result);

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
                    }).ToList(),
                    Rating = Math.Round(x.Rating, 1),
                    CityId = x.User.CityId,
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

        private void ValidateTimeSlot(int fromHours, int fromMinutes, int toHours, int toMinutes, DayEnum day) 
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

        private void ValidateTimeSlotsInDay(int fromHours, int fromMinutes, int toHours, int toMinutes, List<TimeSlotDto> timeSlots, DayEnum day)
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

        private void SetScheduleForProfileDto(List<TimeSlot> timeSlots, LawyerProfileBaseDto dto)
        {
            foreach (var timeSlot in timeSlots)
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
                    From = fromStr,
                    To = toStr
                };

                if (timeSlot.DayOfWeek == DayEnum.Monday)
                {
                    dto.Schedule.Monday.Add(timeSlotDto);
                }
                else if (timeSlot.DayOfWeek == DayEnum.Tuesday)
                {
                    dto.Schedule.Tuesday.Add(timeSlotDto);
                }
                else if (timeSlot.DayOfWeek == DayEnum.Wednesday)
                {
                    dto.Schedule.Wednesday.Add(timeSlotDto);
                }
                else if (timeSlot.DayOfWeek == DayEnum.Thursday)
                {
                    dto.Schedule.Thursday.Add(timeSlotDto);
                }
                else if (timeSlot.DayOfWeek == DayEnum.Friday)
                {
                    dto.Schedule.Friday.Add(timeSlotDto);
                }
                else if (timeSlot.DayOfWeek == DayEnum.Saturday)
                {
                    dto.Schedule.Saturday.Add(timeSlotDto);
                }
                else if (timeSlot.DayOfWeek == DayEnum.Sunday)
                {
                    dto.Schedule.Sunday.Add(timeSlotDto);
                }
            }
        }

        private void SetMeetingsProfileDto(List<Meeting> meetings, LawyerProfileBaseDto dto)
        {
            var todayDate = DateTime.UtcNow.Date;

            meetings = meetings
                .Where(x => x.DateTime.Date >= todayDate.Date)
                .ToList();

            var meetingDtos = meetings.Select(x => new MeetingSimpleDto()
            {
                Date = x.DateTime.Date,
                From = x.From,
                To = x.To,
            }).ToList();


            var res = new Dictionary<DateTime, List<MeetingSimpleDto>>();

            foreach (var meetingDto in meetingDtos)
            {
                if (!res.ContainsKey(meetingDto.Date))
                {
                    res[meetingDto.Date] = new List<MeetingSimpleDto>();
                }

                res[meetingDto.Date].Add(meetingDto);
            }

            dto.Meetings = res;
        }
    }
}
