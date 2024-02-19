using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SuperLaw.Common;
using SuperLaw.Services.Interfaces;

namespace SuperLaw.Api.Controllers
{
    public class TestController : ApiController
    {
        private readonly IStringEncryptService _service;

        public TestController(IStringEncryptService service)
        {
            _service = service;
        }

        [AllowAnonymous]
        [HttpGet(nameof(Server))]
        public string Server()
        {
            return "Server is responding.";
        }

        [HttpGet(nameof(Auth))]
        public string Auth()
        {
            return "You are authorized";
        }

        [AllowAnonymous]
        [HttpGet(nameof(ExceptionLogging))]
        public string ExceptionLogging()
        {
            throw new Exception("Test exception");
        }

        [AllowAnonymous]
        [HttpGet(nameof(BusinessExceptionLogging))]
        public string BusinessExceptionLogging()
        {
            throw new BusinessException("Test business exception");
        }

        [AllowAnonymous]
        [HttpPost(nameof(Decrypt))]
        public async Task<IActionResult> Decrypt(string text)
        {
            var res = await _service.DecryptAsync(text);

            return Ok(res);
        }
    }
}
