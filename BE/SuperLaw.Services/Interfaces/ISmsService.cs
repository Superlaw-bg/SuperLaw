namespace SuperLaw.Services.Interfaces
{
    public interface ISmsService
    {
        void SendSms(string phoneNumber);

        bool VerifySms(string phoneNumber, string code);
    }
}
