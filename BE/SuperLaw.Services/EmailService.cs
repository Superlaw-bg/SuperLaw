using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace SuperLaw.Services
{
    public class EmailService
    {
        public void SendEmail(string email, string subject, string message)
        {
            string fromMail = "kostadinovk2001@gmail.com";
            string fromPassword = "lohgtcneszcfhavw";

            MailMessage mailMessage = new MailMessage();
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
