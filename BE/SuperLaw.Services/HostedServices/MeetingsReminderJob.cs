using Microsoft.Extensions.Logging;
using Quartz;

namespace SuperLaw.Services.HostedServices
{
    [DisallowConcurrentExecution]
    public class MeetingsReminderJob : IJob
    {
        private readonly ILogger<MeetingsReminderJob> _logger;

        public MeetingsReminderJob(ILogger<MeetingsReminderJob> logger)
        {
            _logger = logger;
        }

        public Task Execute(IJobExecutionContext context)
        {
            _logger.LogInformation($"Meetings Reminder Job started at: {DateTime.UtcNow}");
            _logger.LogInformation($"Meetings Reminder Job finished at: {DateTime.UtcNow}");
            return Task.CompletedTask;
        }
    }
}
