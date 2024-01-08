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
            try
            {
                VerificationResource.Create(
                    to: phoneNumber,
                    channel: "sms",
                    pathServiceSid: _options.Value.ServiceSId
                );
            }
            catch (Exception e)
            {
                if (e.Message.StartsWith("Invalid parameter"))
                {
                    throw new BusinessException("Невалиден телефонен номер");
                }
            }
        }

        public bool VerifySms(string phoneNumber, string code)
        {
            try
            {
                var verificationCheck = VerificationCheckResource.Create(
                    to: phoneNumber,
                    code: code,
                    pathServiceSid: _options.Value.ServiceSId
                );

                switch (verificationCheck.Status)
                {
                    case "pending":
                        return false;
                    case "approved":
                        return true;
                    default:
                        return false;
                }
            }
            catch (Exception e)
            {
                throw new BusinessException("Смс кодът е изтекъл или вече валидиран");
            }
        }
    }
}
