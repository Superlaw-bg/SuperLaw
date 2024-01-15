namespace SuperLaw.Common.Options
{
    public class TwilioOptions
    {
        public const string Section = "Twilio";

        public string AccountSid { get; set; }
        public string AuthToken { get; set; }
        public string ServiceSId { get; set; }
    }
}
