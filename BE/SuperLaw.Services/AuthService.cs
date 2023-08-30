using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using SuperLaw.Common;
using SuperLaw.Data.Models;

namespace SuperLaw.Services
{
    public class AuthService : IAuthService
    {
        private IConfiguration _configuration;
        private readonly UserManager<User> _userManager;

        private readonly string? _secret;

        public AuthService(IConfiguration configuration, UserManager<User> userManager)
        {
            _configuration = configuration;
            _userManager = userManager;

            _secret = configuration["Secret"];
        }

        public async Task<string> Register(string email, string password, string confirmPassword)
        {
            var user = await _userManager.FindByNameAsync(email);

            if (user != null)
            {
                throw new ArgumentException("There is already such user");
            }

            if (password != confirmPassword)
            {
                throw new ArgumentException("Passwords don't match");
            }

            user = new User()
            {
                Email = email,
                UserName = email,
                CityId = 1,
            };

            await _userManager.CreateAsync(user, password);
            await _userManager.AddToRoleAsync(user, RoleNames.LawyerRole);

            var token = GenerateJwtToken(user.Id, user.Email, RoleNames.LawyerRole);

            return token;
        }

        public async Task<string> Login(string email, string password)
        {
            var user = await _userManager.FindByEmailAsync(email);

            if (user == null)
            {
                throw new ArgumentException("There is no user with that email!");
            }

            var isPasswordValid = await _userManager.CheckPasswordAsync(user, password);

            if (!isPasswordValid)
            {
                throw new ArgumentException("Incorrect password!");
            }

            var roles = await _userManager.GetRolesAsync(user);

            var token = GenerateJwtToken(user.Id, user.Email, roles[0]);

            return token;
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
    }
}