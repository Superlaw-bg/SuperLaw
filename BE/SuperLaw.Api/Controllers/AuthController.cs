using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SuperLaw.Services;

namespace SuperLaw.Api.Controllers
{
    public class AuthController : ApiController
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [AllowAnonymous]
        [HttpPost(nameof(Register))]
        public async Task<string> Register(string email, string password)
        {
            var idToken = await _authService.Register(email, password, password);

            return idToken;
        }

        [AllowAnonymous]
        [HttpPost(nameof(Login))]
        public async Task<string> Login(string email, string password)
        {
            var idToken = await _authService.Login(email, password);

            return idToken;
        }

        [AllowAnonymous]
        [HttpGet(nameof(ConfirmEmail))]
        public async Task<bool> ConfirmEmail(string token, string email)
        {
            token = token.Replace(" ", "");
            return await _authService.ConfirmEmail(token, email);
        }

        [HttpGet(nameof(Test))]
        public string Test()
        {
            return "You are authorized";
        }

        [Authorize(Roles = "Lawyer, Admin")]
        [HttpGet(nameof(TestRoles))]
        public string TestRoles()
        {
            return "You are a lawyer";
        }
    }
}