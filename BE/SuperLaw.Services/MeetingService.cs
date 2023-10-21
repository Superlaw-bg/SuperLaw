using Microsoft.EntityFrameworkCore;
using SuperLaw.Common;
using SuperLaw.Data;
using SuperLaw.Data.Models;
using SuperLaw.Services.Input;
using SuperLaw.Services.Interfaces;
using System.Text;
using Microsoft.AspNetCore.Identity;
using SuperLaw.Services.DTO;
using System.Threading;
using System.Drawing;
using Microsoft.EntityFrameworkCore.ValueGeneration.Internal;

namespace SuperLaw.Services
{
    public class MeetingService : IMeetingService
    {
        private readonly SuperLawDbContext _context;
        private readonly UserManager<User> _userManager;
        private readonly IStringEncryptService _stringEncryptService;

        public MeetingService(SuperLawDbContext context, IStringEncryptService stringEncryptService, UserManager<User> userManager)
        {
            _context = context;
            _stringEncryptService = stringEncryptService;
            _userManager = userManager;
        }

        public async Task CreateMeetingAsync(string userId, CreateMeetingInput input)
        {
            var profile = _context.LawyerProfiles
                .Include(x => x.Meetings)
                .SingleOrDefault(x => x.Id == input.ProfileId);

            if (profile == null)
            {
                throw new BusinessException("Няма такъв профил в системата");
            }

            var user = _context.Users
                .Where(x => x.Id == userId)
                .Include(x => x.Meetings)
                .ToList()[0];

            if (user == null)
            {
                throw new BusinessException("Не съществува такъв потребител");
            }

            if (profile.UserId == userId)
            {
                throw new BusinessException("Не може сам да си запазваш консултация");
            }

            var userRole = await _userManager.GetRolesAsync(user);

            if (userRole.Contains("Lawyer"))
            {
                throw new BusinessException("Адвокат не може да си записва консултации");
            }

            var todayDate = DateTimeOffset.UtcNow;

            var lawyerMeetings = profile.Meetings
                .Where(x => x.DateTime >= todayDate)
                .ToList();

            if (lawyerMeetings.Count(x => x.DateTime.Date == input.Date.Date && x.From == input.TimeSlot.From && x.To == input.TimeSlot.To) > 0)
            {
                throw new BusinessException("Адвокатът вече е зает за конкретния час");
            }

            var userMeetings = user.Meetings
                .Where(x => x.DateTime >= todayDate)
                .ToList();

            if (userMeetings.Count >= 3)
            {
                throw new BusinessException("Не може да имаш повече от 3 предстоящи срещи");
            }

            if (userMeetings.Count(x => x.LawyerProfileId == input.ProfileId) > 0)
            {
                throw new BusinessException("Не може да имаш повече от 1 предстоящa среща с този адвокат");
            }

            var toHours = int.Parse(input.TimeSlot.To.Split(':')[0]);
            var toMinutes = int.Parse(input.TimeSlot.To.Split(':')[1]);
            var meetingDateEndWithHourInUtc = input.Date.Date.AddHours(toHours).AddMinutes(toMinutes);

            //Saving the meeting date with the end hour but in utc in order to more easily decide if the meeting is in the past or not
            TimeZoneInfo easternZone = TimeZoneInfo.FindSystemTimeZoneById("E. Europe Standard Time");
          
            meetingDateEndWithHourInUtc = meetingDateEndWithHourInUtc.AddHours(0 - easternZone.GetUtcOffset(DateTime.UtcNow).Hours);

            var meeting = new Meeting()
            {
                LawyerProfileId = profile.Id,
                ClientId = user.Id,
                DateTime = meetingDateEndWithHourInUtc,
                From = input.TimeSlot.From,
                To = input.TimeSlot.To,
                CategoryId = input.CategoryId == 0 ? null : input.CategoryId,
                RegionId = input.RegionId == 0 ? null : input.RegionId,
                Info = string.Empty
            };

            if (!string.IsNullOrEmpty(input.Info))
            {
                var encryptedInfo = await _stringEncryptService.EncryptAsync(input.Info);

                meeting.Info = Encoding.Unicode.GetString(encryptedInfo);
            }

            await _context.Meetings.AddAsync(meeting);
            await _context.SaveChangesAsync();
        }

        public async Task RateMeetingAsync(string userId, RateMeetingInput input)
        {
            var meeting = _context.Meetings
                .SingleOrDefault(x => x.Id == input.MeetingId);

            if (meeting == null)
            {
                throw new BusinessException("Невалидна консултация");
            }

            if (meeting.ClientId != userId)
            {
                throw new BusinessException("Не може да оцениш тази консултация");
            }

            if (meeting.Rating != 0)
            {
                throw new BusinessException("Kонсултацията вече е с оценка");
            }

            if (meeting.DateTime >= DateTimeOffset.UtcNow)
            {
                throw new BusinessException("Консултацията все още не е приключила");
            }

            if (input.Rating is < 1 or > 5)
            {
                throw new BusinessException("Невалиден Рейтинг");
            }

            meeting.Rating = input.Rating;

            _context.Meetings.Update(meeting);

            var lawyerProfile = _context.LawyerProfiles
                .Where(x => x.Id == meeting.LawyerProfileId)
                .Include(x => x.Meetings)
                .SingleOrDefault();

            if (lawyerProfile == null)
            {
                throw new BusinessException("Невалиден адвокатски профил");
            }

            var meetings = lawyerProfile.Meetings.Where(x => x.Rating != 0).ToList();

            var ratingSum = meetings.Select(x => x.Rating).Sum();

            lawyerProfile.Rating = ratingSum / meetings.Count;

            _context.LawyerProfiles.Update(lawyerProfile);
            await _context.SaveChangesAsync();
        }

        public List<MeetingSimpleDto> GetUpcomingLawyerMeetings(int profileId)
        {
            var profile = _context.LawyerProfiles
                .Include(x => x.Meetings)
                .SingleOrDefault(x => x.Id == profileId);

            if (profile == null)
            {
                throw new BusinessException("Няма такъв профил в системата");
            }

            var todayDate = DateTimeOffset.UtcNow;

            var meetings = profile.Meetings
                .Where(x => x.DateTime >= todayDate)
                .Select(x => new MeetingSimpleDto()
                {
                    Date = x.DateTime.Date,
                    From = x.From,
                    To = x.To,
                })
                .ToList();

            return meetings;
        }

        public async Task<MeetingsDto> GetAllForUserAsync(string userId)
        {
            var users = _context.Users
                .Where(x => x.Id == userId)
                .Include(x => x.Meetings)
                .ThenInclude(x => x.LawyerProfile)
                .ThenInclude(x => x.User)
                .ToList();

            if (users == null || users.Count < 1)
            {
                throw new BusinessException("Няма такъв потребител в системата");
            }

            var result = new MeetingsDto();

            var user = users[0];

            var categories = _context.LegalCategories.ToList();
            var regions = _context.JudicialRegions.ToList();

            var todayDateTime = DateTime.UtcNow;

            var userRole = await _userManager.GetRolesAsync(user);

            if (userRole.Contains("User"))
            {
                await SetMeetingsForUser(user, categories, regions, result, todayDateTime);
            }
            else
            {
                await SetMeetingsForLawyer(userId, result, categories, regions, todayDateTime);
            }

            result.Past = result.Past.OrderByDescending(x => x.DateTime).ToList();
            result.Upcoming = result.Upcoming.OrderBy(x => x.DateTime).ToList();

            return result;
        }

        private async Task SetMeetingsForLawyer(string userId, MeetingsDto result, List<LegalCategory> categories, List<JudicialRegion> regions, DateTime todayDateTime)
        {
            var profile = _context.LawyerProfiles
                .Include(x => x.Meetings)
                .ThenInclude(x => x.Client)
                .SingleOrDefault(x => x.UserId == userId);

            if (profile != null)
            {
                foreach (var meeting in profile.Meetings)
                {
                    var dto = new MeetingDto()
                    {
                        Id = meeting.Id,
                        ProfileId = 0,
                        IsUserTheLawyer = true,
                        Name = $"{meeting.Client.FirstName} {meeting.Client.LastName}",
                        Date = meeting.DateTime.ToString("dd.MM.yyyy"),
                        DateTime = meeting.DateTime,
                        From = meeting.From,
                        To = meeting.To,
                        CategoryName = categories.SingleOrDefault(x => x.Id == meeting.CategoryId)?.Name,
                        RegionName = regions.SingleOrDefault(x => x.Id == meeting.RegionId)?.Name,
                        Info = null
                    };

                    await SetDecryptedInfoToDto(meeting, dto);

                    SetDtoInMeetingsResult(result, todayDateTime, meeting, dto);
                }
            }
        }

        private async Task SetMeetingsForUser(User user, List<LegalCategory> categories, List<JudicialRegion> regions, MeetingsDto result,
            DateTime todayDateTime)
        {
            foreach (var meeting in user.Meetings)
            {
                var dto = new MeetingDto()
                {
                    Id = meeting.Id,
                    ProfileId = meeting.LawyerProfileId,
                    IsUserTheLawyer = false,
                    Name = $"{meeting.LawyerProfile.User.FirstName} {meeting.LawyerProfile.User.Surname} {meeting.LawyerProfile.User.LastName}",
                    Date = meeting.DateTime.ToString("dd.MM.yyyy"),
                    DateTime = meeting.DateTime,
                    From = meeting.From,
                    To = meeting.To,
                    CategoryName = categories.SingleOrDefault(x => x.Id == meeting.CategoryId)?.Name,
                    RegionName = regions.SingleOrDefault(x => x.Id == meeting.RegionId)?.Name,
                    Info = null
                };

                await SetDecryptedInfoToDto(meeting, dto);

                SetDtoInMeetingsResult(result, todayDateTime, meeting, dto);
            }
        }

        private static void SetDtoInMeetingsResult(MeetingsDto result, DateTime todayDateTime, Meeting meeting, MeetingDto dto)
        {
            if (todayDateTime >= meeting.DateTime)
            {
                result.Past.Add(dto);
            }
            else
            {
                result.Upcoming.Add(dto);
            }
        }

        private async Task SetDecryptedInfoToDto(Meeting meeting, MeetingDto dto)
        {
            if (!string.IsNullOrEmpty(meeting.Info))
            {
                var decryptedInfo = await _stringEncryptService.DecryptAsync(Encoding.Unicode.GetBytes(meeting.Info));

                dto.Info = decryptedInfo;
            }
        }
    }
}
