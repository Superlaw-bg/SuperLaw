namespace SuperLaw.Services.Interfaces
{
    public interface IStringEncryptService
    {
        public Task<byte[]> EncryptAsync(string clearText);

        public Task<string> DecryptAsync(byte[] encrypted);
    }
}
