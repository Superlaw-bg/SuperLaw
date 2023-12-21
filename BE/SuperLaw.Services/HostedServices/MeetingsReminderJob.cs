using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Quartz;
using SuperLaw.Common.Options;
using SuperLaw.Data;

namespace SuperLaw.Services.HostedServices
{
    [DisallowConcurrentExecution]
    public class MeetingsReminderJob : IJob
    {
        private readonly ILogger<MeetingsReminderJob> _logger;
        private readonly SuperLawDbContext _context;
        private readonly EmailService _emailService;
        private IOptions<ClientLinksOption> _options;

        public MeetingsReminderJob(ILogger<MeetingsReminderJob> logger, SuperLawDbContext context, EmailService emailService, IOptions<ClientLinksOption> options)
        {
            _logger = logger;
            _context = context;
            _emailService = emailService;
            _options = options;
        }

        public Task Execute(IJobExecutionContext context)
        {
            _logger.LogTrace($"Meetings Reminder Job started at: {DateTime.UtcNow}");

            var tomorrowDate = DateTime.UtcNow.AddDays(1).Date;

            var lawyersWithMeetings = _context.LawyerProfiles
                .Where(x => x.Meetings.Any(m => m.DateTime.Date == tomorrowDate))
                .Include(x => x.User)
                .Include(x => x.Meetings)
                .ThenInclude(x => x.Client)
                .ToList();

            _logger.LogTrace($"Meetings Reminder Job - There are {lawyersWithMeetings.Count} lawyers with meetings tomorrow");

            var usersWithMeetings = _context.Users
                .Where(x => x.Meetings.Any(m => m.DateTime.Date == tomorrowDate))
                .Include(x => x.Meetings)
                .ThenInclude(x => x.LawyerProfile)
                .ThenInclude(x => x.User)
                .ToList();

            _logger.LogTrace($"Meetings Reminder Job - There are {usersWithMeetings.Count} users with meetings tomorrow");

            foreach (var lawyer in lawyersWithMeetings)
            {
                var meetingsTomorrow = lawyer.Meetings
                    .Where(x => x.DateTime.Date == tomorrowDate)
                    .ToList();

                var sb = new StringBuilder();
                sb.AppendLine($"Уважаеми адв. {lawyer.User.LastName},");
                sb.AppendLine($"Напомняме Ви, че утре {tomorrowDate:dd.MM.yy}, имате следните консултации:");

                foreach (var meeting in meetingsTomorrow)
                {
                    sb.AppendLine($"От {meeting.From} до {meeting.To} с {meeting.Client.FirstName} {meeting.Client.LastName}");
                }

                var meetingsPageLink = $"{_options.Value.MeetingsPage}";

                sb.AppendLine($"За повече информация може да посетите страницата с предстоящи консултации: {meetingsPageLink}");
                sb.AppendLine("\r\nС уважение,\r\n Екипът на Superlaw.bg");

                _emailService.SendEmail(lawyer.User.Email, $"Предстоящи консултации {tomorrowDate:dd.MM.yy}", sb.ToString());
            }

            foreach (var user in usersWithMeetings)
            {
                var meetingsTomorrow = user.Meetings
                    .Where(x => x.DateTime.Date == tomorrowDate)
                    .ToList();

                var sb = new StringBuilder();
                sb.AppendLine("Здравейте,");
                sb.AppendLine($"Напомняме Ви, че утре {tomorrowDate:dd.MM.yy}, имате следните консултации:");

                foreach (var meeting in meetingsTomorrow)
                {
                    sb.AppendLine($"От {meeting.From} до {meeting.To} с адв.{meeting.LawyerProfile.User.LastName}");
                }

                var meetingsPageLink = $"{_options.Value.MeetingsPage}";

                sb.AppendLine($"За повече информация може да посетите страницата с предстоящи консултации: {meetingsPageLink}");
                sb.AppendLine("\r\nС уважение,\r\n Екипът на Superlaw.bg");

                _emailService.SendEmail(user.Email, $"Предстоящи консултации {tomorrowDate:dd.MM.yy}", sb.ToString());
            }
            
            _logger.LogTrace($"Meetings Reminder Job finished at: {DateTime.UtcNow}");
            return Task.CompletedTask;
        }
    }
}
