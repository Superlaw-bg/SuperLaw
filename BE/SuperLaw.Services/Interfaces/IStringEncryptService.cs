namespace SuperLaw.Services.Interfaces
{
    public interface IStringEncryptService
    {
        public Task<string> EncryptAsync(string clearText);

        public Task<string> DecryptAsync(string encryptedText);
    }
}
