using System.Net.Mail;
using System.Net;
using SuperLaw.Common.Options;
using Microsoft.Extensions.Options;

namespace SuperLaw.Services
{
    public class EmailService
    {
        private readonly IOptions<EmailSendingOptions> _options;

        public EmailService(IOptions<EmailSendingOptions> options)
        {
            _options = options;
        }

        public void SendEmail(string email, string subject, string message)
        {
            var fromMail = _options.Value.Email;
            var fromPassword = _options.Value.Password;

            var mailMessage = new MailMessage();
            mailMessage.From = new MailAddress(fromMail);
            mailMessage.Subject = subject;
            mailMessage.To.Add(new MailAddress(email));
            mailMessage.Body = message;
            mailMessage.IsBodyHtml = false;

            var smtpClient = new SmtpClient("smtp.gmail.com")
            {
                Port = 587,
                Credentials = new NetworkCredential(fromMail, fromPassword),
                EnableSsl = true,
            };
            smtpClient.Send(mailMessage);
        }
    }
}
