using Microsoft.AspNetCore.Mvc;
using SuperLaw.Services;

namespace SuperLaw.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost(nameof(Register))]
        public async Task<string?> Register(string email, string password)
        {
            var idToken = await _authService.Register(email, password, password);

            return idToken;
        }
    }
}