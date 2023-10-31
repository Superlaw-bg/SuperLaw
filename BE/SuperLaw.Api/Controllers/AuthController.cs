using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SuperLaw.Services.Input;
using SuperLaw.Services.Interfaces;
using System;

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
                return BadRequest(new ErrorDetails()
                {
                    Message = "Данните са невалидни"
                });
            }

            if (input.Password != input.ConfirmPassword)
            {
                return BadRequest(new ErrorDetails()
                {
                    Message = "Паролите не съвпадат"
                });
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
                return BadRequest(new ErrorDetails()
                {
                    Message = "Данните са невалидни"
                });
            }

            if (input.Password != input.ConfirmPassword)
            {
                return BadRequest(new ErrorDetails()
                {
                    Message = "Паролите не съвпадат"
                });
            }

            await _authService.RegisterLawyer(input);

            return Ok("Всеки момент ще ви изпратим имейл с линк за потвърждение на акаунта");
        }

        [AllowAnonymous]
        [HttpPost(nameof(Login))]
        public async Task<IActionResult> Login(LoginInput input)
        {
            var userInfo = await _authService.Login(input);

            return Ok(userInfo);
        }

        [AllowAnonymous]
        [HttpPost(nameof(ConfirmEmail))]
        public async Task<IActionResult> ConfirmEmail(ConfirmEmailInput input)
        {
            var userInfo = await _authService.ConfirmEmail(input.Token, input.Email);

            return Ok(userInfo);
        }


        [AllowAnonymous]
        [HttpPost(nameof(ForgotPassword))]
        public async Task<IActionResult> ForgotPassword([FromBody]string email)
        {
            await _authService.ForgotPasswordAsync(email);

            return Ok();
        }

        [AllowAnonymous]
        [HttpPost(nameof(ResetPassword))]
        public async Task<IActionResult> ResetPassword(ResetPasswordInput input)
        {
            await _authService.ResetPasswordAsync(input);

            return Ok();
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