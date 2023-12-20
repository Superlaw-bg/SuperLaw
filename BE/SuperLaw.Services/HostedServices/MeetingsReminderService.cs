using System.Diagnostics;
using Microsoft.Extensions.Hosting;

namespace SuperLaw.Services.HostedServices
{
    public class MeetingsReminderService : IHostedService
    {
        private Timer _timer;

        public Task StartAsync(CancellationToken cancellationToken)
        {
            _timer = new Timer(SendReminders, null, 0, 10000);
            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            _timer?.Change(Timeout.Infinite, 0);
            return Task.CompletedTask;
        }

        public void SendReminders(object state)
        {
            Debug.WriteLine("Hello world from the hosted service!");
        }
    }
}
