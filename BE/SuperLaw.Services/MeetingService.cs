using Microsoft.EntityFrameworkCore;
using SuperLaw.Common;
using SuperLaw.Data;
using SuperLaw.Data.Models;
using SuperLaw.Services.Input;
using SuperLaw.Services.Interfaces;
using System.Text;
using SuperLaw.Services.DTO;

namespace SuperLaw.Services
{
    public class MeetingService : IMeetingService
    {
        private readonly SuperLawDbContext _context;
        private readonly IStringEncryptService _stringEncryptService;

        public MeetingService(SuperLawDbContext context, IStringEncryptService stringEncryptService)
        {
            _context = context;
            _stringEncryptService = stringEncryptService;
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
                throw new BusinessException("Не може сам да си създаваш срещи");
            }

            var todayDate = DateTimeOffset.UtcNow;

            var lawyerMeetings = profile.Meetings
                .Where(x => x.DateTime.Date >= todayDate.Date)
                .ToList();

            if (lawyerMeetings.Count(x => x.DateTime.Date == input.Date.Date && x.From == input.TimeSlot.From && x.To == input.TimeSlot.To) > 0)
            {
                throw new BusinessException("Адвокатът вече е зает за конкретния час");
            }

            var futureMeetings = user.Meetings
                .Where(x => x.DateTime.Date >= todayDate.Date)
                .ToList();

            if (futureMeetings.Count >= 30)
            {
                throw new BusinessException("Не може да имаш повече от 3 предстоящи срещи");
            }

            if (futureMeetings.Count(x => x.LawyerProfileId == input.ProfileId) < 0)
            {
                throw new BusinessException("Не може да имаш повече от 1 предстоящa среща с този адвокат");
            }

            var meeting = new Meeting()
            {
                LawyerProfileId = profile.Id,
                ClientId = user.Id,
                DateTime = input.Date,
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
                .Where(x => x.DateTime.Date >= todayDate.Date)
                .Select(x => new MeetingSimpleDto()
                {
                    Date = x.DateTime.Date,
                    From = x.From,
                    To = x.To,
                })
                .ToList();

            return meetings;
        }
    }
}
