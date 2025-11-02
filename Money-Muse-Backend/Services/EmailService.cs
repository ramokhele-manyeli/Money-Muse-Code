using MailKit.Net.Smtp;
using MimeKit;
using System.Threading.Tasks;

namespace Money_Muse_Backend.Services
{
    public class EmailService
    {
        public async Task SendEmailAsync(string to, string subject, string body)
        {
            var smtpHost = Environment.GetEnvironmentVariable("SMTP_HOST");
            var smtpPort = Environment.GetEnvironmentVariable("SMTP_PORT");
            var smtpUser = Environment.GetEnvironmentVariable("SMTP_USERNAME");
            var smtpPass = Environment.GetEnvironmentVariable("SMTP_PASSWORD");
            var smtpFrom = Environment.GetEnvironmentVariable("SMTP_FROM");

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("Money Muse", smtpFrom));
            message.To.Add(new MailboxAddress("", to));
            message.Subject = subject;
            message.Body = new TextPart("plain")
            {
                Text = body
            };

            using var client = new SmtpClient();
            await client.ConnectAsync(smtpHost, int.Parse(smtpPort), false);
            await client.AuthenticateAsync(smtpUser, smtpPass);
            await client.SendAsync(message);
            await client.DisconnectAsync(true);
        }
    }
}
