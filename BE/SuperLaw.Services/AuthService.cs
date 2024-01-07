using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using SuperLaw.Common;
using SuperLaw.Data.Models;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Options;
using SuperLaw.Common.Options;
using SuperLaw.Services.DTO;
using SuperLaw.Services.Input;
using SuperLaw.Services.Interfaces;

namespace SuperLaw.Services
{
    public class AuthService : IAuthService
    {
        private IOptions<ClientLinksOption> _options;
        private readonly UserManager<User> _userManager;
        private readonly EmailService _emailService;
        private readonly ISimpleDataService _simpleDataService;
        private readonly ISmsService _smsService;

        private readonly string? _secret;

        public AuthService(IConfiguration configuration, IOptions<ClientLinksOption> options, UserManager<User> userManager, EmailService emailService, ISimpleDataService simpleDataService, ISmsService smsService)
        {
            _options = options;
            _userManager = userManager;
            _emailService = emailService;
            _simpleDataService = simpleDataService;
            _smsService = smsService;

            _secret = configuration["Secret"];
        }

        public async Task RegisterUser(RegisterUserInput input)
        {
            var user = await _userManager.FindByNameAsync(input.Email);

            if (user != null)
            {
                throw new BusinessException("Регистриран е вече такъв потребител");
            }

            var city = _simpleDataService.GetCity(input.CityId);

            if (city == null)
            {
                throw new BusinessException("Невалиден град");
            }

            user = new User()
            {
                FirstName = input.FirstName,
                LastName = input.LastName,
                Phone = input.Phone,
                Email = input.Email,
                UserName = input.Email,
                CityId = input.CityId,
            };

            await _userManager.CreateAsync(user, input.Password);

            await SendConfirmationEmail(input.Email, user);

            await _userManager.AddToRoleAsync(user, RoleNames.UserRole);
        }

        public async Task RegisterLawyer(RegisterLawyerInput input)
        {
            var user = await _userManager.FindByNameAsync(input.Email);

            if (user != null)
            {
                throw new BusinessException("Регистриран е вече такъв потребител");
            }

            var lawyerWithSameLawyerNumber = _userManager.Users.FirstOrDefault(x => x.LawyerIdNumber == input.LawyerIdNumber);

            if (lawyerWithSameLawyerNumber != null)
            {
                throw new BusinessException("Регистриран е адвокат с този личен номер");
            }

            var city = _simpleDataService.GetCity(input.CityId);

            if (city == null)
            {
                throw new BusinessException("Невалиден град");
            }

            user = new User()
            {
                FirstName = input.FirstName,
                Surname = input.Surname,
                LastName = input.LastName,
                Phone = input.Phone,
                Email = input.Email,
                UserName = input.Email,
                CityId = input.CityId,
                LawyerIdNumber = input.LawyerIdNumber
            };

            await _userManager.CreateAsync(user, input.Password);

            await SendConfirmationEmail(input.Email, user, true);

            await _userManager.AddToRoleAsync(user, RoleNames.LawyerRole);
        }

        public async Task<UserInfoDto> ConfirmEmail(string token, string email)
        {
            var user = await _userManager.FindByEmailAsync(email);

            if (user == null)
                throw new BusinessException("Невалиден потребител");

            var codeDecodedBytes = WebEncoders.Base64UrlDecode(token);
            var codeDecoded = Encoding.UTF8.GetString(codeDecodedBytes);

            var result = await _userManager.ConfirmEmailAsync(user, codeDecoded);

            if (!result.Succeeded)
            {
                throw new BusinessException("Невалиден имейл токен");
            }

            var roles = await _userManager.GetRolesAsync(user);

            var idToken = GenerateJwtToken(user.Id, user.Email, roles.First());

            var userInfo = new UserInfoDto()
            {
                Email = user.Email,
                Id = user.Id,
                IdToken = idToken,
                Role = roles.First()
            };

            return userInfo;
        }

        public void SendPhoneVerification(string phoneNumber)
        {
            _smsService.SendSms($"+359{phoneNumber}");
        }

        public void VerifyPhone(string phoneNumber, string code)
        {
            _smsService.VerifySms($"+359{phoneNumber}", code);
        }

        public async Task<UserInfoDto> Login(LoginInput input)
        {
            var user = await _userManager.FindByEmailAsync(input.Email);

            if (user == null)
            {
                throw new BusinessException("Няма потребител с този имейл");
            }

            var isPasswordValid = await _userManager.CheckPasswordAsync(user, input.Password);

            if (!isPasswordValid)
            {
                throw new BusinessException("Грешна парола");
            }

            var isEmailConfirmed = await _userManager.IsEmailConfirmedAsync(user);

            if (!isEmailConfirmed)
            {
                throw new BusinessException("Моля потвърдете имейла си");
            }

            var roles = await _userManager.GetRolesAsync(user);

            var token = GenerateJwtToken(user.Id, user.Email, roles[0]);

            var userInfo = new UserInfoDto()
            {
                Email = user.Email,
                Id = user.Id,
                IdToken = token,
                Role = roles.First()
            };

            return userInfo;
        }

        public async Task ForgotPasswordAsync(string email)
        {
           
            var user = await _userManager.FindByEmailAsync(email);

            if (user == null)
                throw new BusinessException("Няма потребител с този имейл");

            await SendPasswordResetEmail(email, user);
        }

        public async Task ResetPasswordAsync(ResetPasswordInput input)
        {
            if (input.Password == null)
                throw new BusinessException("Паролата не може да е празна");

            if (input.Password != input.ConfirmPassword)
                throw new BusinessException("Паролите не съвпадат");

            var user = await _userManager.FindByEmailAsync(input.Email);

            if (user == null)
                throw new BusinessException("Невалиден потребител");

            var codeDecodedBytes = WebEncoders.Base64UrlDecode(input.Token);
            var codeDecoded = Encoding.UTF8.GetString(codeDecodedBytes);

            var result = await _userManager.ResetPasswordAsync(user, codeDecoded, input.Password);

            if (!result.Succeeded)
            {
                throw new BusinessException("Невалиден токен за смяна на парола");
            }
        }

        private string GenerateJwtToken(string userId, string email, string role)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.NameIdentifier, userId),
                    new Claim(ClaimTypes.Name, email),
                    new Claim(ClaimTypes.Role, role)
                }),
                Expires = DateTime.UtcNow.AddDays(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var encryptedToken = tokenHandler.WriteToken(token);

            return encryptedToken;
        }

        private async Task SendConfirmationEmail(string email, User user, bool isLawyer = false)
        {
            var emailToken = await _userManager.GenerateEmailConfirmationTokenAsync(user);

            byte[] tokenGeneratedBytes = Encoding.UTF8.GetBytes(emailToken);
            var codeEncoded = WebEncoders.Base64UrlEncode(tokenGeneratedBytes);

            var confirmationLink = $"{_options.Value.EmailConfirm}?token={codeEncoded}&email={email}";

            var msg = $"Моля, потвърдете имейла си на следния линк: {confirmationLink}";

            if (isLawyer)
            {
               msg = $"Моля, потвърдете имейла си на следния линк: {confirmationLink}\r\n Не забравяйте да довършите профила си, за да бъде видим за потенциалните Ви клиенти.";
            }

            _emailService.SendEmail(email, "Потвърждение на акаунт", msg);
        }

        private async Task SendPasswordResetEmail(string email, User user)
        {
            var resetToken = await _userManager.GeneratePasswordResetTokenAsync(user);

            byte[] tokenGeneratedBytes = Encoding.UTF8.GetBytes(resetToken);
            var codeEncoded = WebEncoders.Base64UrlEncode(tokenGeneratedBytes);

            var confirmationLink = $"{_options.Value.ResetPassword}?token={codeEncoded}&email={email}";

            _emailService.SendEmail(email, "Смяна на забравена парола",
                $"За да смените Вашата парола, моля посетете страницата за забравена парола: {confirmationLink}");
        }
    }
}