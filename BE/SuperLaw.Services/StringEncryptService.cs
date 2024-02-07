using SuperLaw.Services.Interfaces;
using System.Security.Cryptography;
using System.Text;

namespace SuperLaw.Services
{
    public class StringEncryptService : IStringEncryptService
    {
        const string PassPhrase = "SuperSecurePassSuperlawBg";

        public async Task<string> EncryptAsync(string clearText)
        {
            var textBytes = Encoding.UTF8.GetBytes(clearText); // UTF8 saves Space
            var textHas = MD5.Create().ComputeHash(textBytes);

            SymmetricAlgorithm crypt = Aes.Create(); // (Default: AES-CCM (Counter with CBC-MAC))
            crypt.Key = MD5.Create().ComputeHash(Encoding.UTF8.GetBytes(PassPhrase)); // MD5: 128 Bit Hash
            crypt.IV = new byte[16]; // by Default. IV[] to 0.. is OK simple crypt

            using var memoryStream = new MemoryStream();
            using var cryptoStream = new CryptoStream(memoryStream, crypt.CreateEncryptor(), CryptoStreamMode.Write);

            await cryptoStream.WriteAsync(textBytes, 0, textBytes.Length); // User Data
            await cryptoStream.WriteAsync(textHas, 0, textHas.Length); // Add HASH
            await cryptoStream.FlushFinalBlockAsync();

            var resultString = Convert.ToBase64String(memoryStream.ToArray());

            return resultString;
        }

        public async Task<string> DecryptAsync(string encryptedText)
        {
            var encryptedBytes = Convert.FromBase64String(encryptedText);
            SymmetricAlgorithm crypt = Aes.Create();
            crypt.Key = MD5.Create().ComputeHash(Encoding.UTF8.GetBytes(PassPhrase));
            crypt.IV = new byte[16];

            using var memoryStream = new MemoryStream();
            using var cryptoStream = new CryptoStream(memoryStream, crypt.CreateDecryptor(), CryptoStreamMode.Write);

            await cryptoStream.WriteAsync(encryptedBytes, 0, encryptedBytes.Length);
            await cryptoStream.FlushFinalBlockAsync();

            var allBytes = memoryStream.ToArray();
            var textLen = allBytes.Length - 16;

            if (textLen < 0) throw new Exception("Encryption Invalid Len");   // No Hash?

            var textHash = new byte[16];
            Array.Copy(allBytes, textLen, textHash, 0, 16); // Get the 2 Hashes

            var decryptHash = MD5.Create().ComputeHash(allBytes, 0, textLen);

            if (textHash.SequenceEqual(decryptHash) == false) throw new Exception("Invalid Hash");
            var resultString = Encoding.UTF8.GetString(allBytes, 0, textLen);

            return resultString;
        }
    }
}
