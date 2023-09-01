using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SuperLaw.Services.Input;
using SuperLaw.Services.Interfaces;

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
        [HttpPost(nameof(RegisterUser))]
        public async Task<IActionResult> RegisterUser(RegisterUserInput input)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Данните са невалидни");
            }

            if (input.Password != input.ConfirmPassword)
            {
                return BadRequest("Паролите не съвпадат");
            }

            await _authService.RegisterUser(input);

            return Ok("Всеки момент ще ви изпратим имейл с линк за потвърждение на акаунта");
        }

        [AllowAnonymous]
        [HttpPost(nameof(RegisterLawyer))]
        public async Task<IActionResult> RegisterLawyer(RegisterLawyerInput input)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Данните са невалидни");
            }

            if (input.Password != input.ConfirmPassword)
            {
                return BadRequest("Паролите не съвпадат");
            }

            await _authService.RegisterLawyer(input);

            return Ok();
        }

        [AllowAnonymous]
        [HttpPost(nameof(Login))]
        public async Task<IActionResult> Login(LoginInput input)
        {
            var idToken = await _authService.Login(input);

            return Ok(idToken);
        }

        [AllowAnonymous]
        [HttpGet(nameof(ConfirmEmail))]
        public async Task<IActionResult> ConfirmEmail(string token, string email)
        {
            var idToken = await _authService.ConfirmEmail(token, email);

            return Ok(idToken);
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