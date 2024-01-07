namespace SuperLaw.Services.Interfaces
{
    public interface ISmsService
    {
        void SendSms(string phoneNumber);

        void VerifySms(string phoneNumber, string code);
    }
}
