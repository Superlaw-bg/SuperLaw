using Microsoft.Extensions.Options;
using SuperLaw.Common;
using SuperLaw.Common.Options;
using SuperLaw.Services.Interfaces;
using Twilio.Rest.Verify.V2.Service;

namespace SuperLaw.Services
{
    public class SmsService : ISmsService
    {
        private readonly IOptions<TwilioOptions> _options;

        public SmsService(IOptions<TwilioOptions> options)
        {
            _options = options;
        }

        public void SendSms(string phoneNumber)
        {
            VerificationResource.Create(
                to: phoneNumber,
                channel: "sms",
                pathServiceSid: _options.Value.ServiceSId
            );
        }

        public void VerifySms(string phoneNumber, string code)
        {
            try
            {
                var verificationCheck = VerificationCheckResource.Create(
                    to: phoneNumber,
                    code: code,
                    pathServiceSid: _options.Value.ServiceSId
                );

                Console.WriteLine(verificationCheck.Status);
            }
            catch (Exception e)
            {
                throw new BusinessException("Смс кодът е изтекъл или вече валидиран");
            }
        }
    }
}
