using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SuperLaw.Common;
using SuperLaw.Services;

namespace SuperLaw.Api.Controllers
{
    public class TestController : ApiController
    {
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
    }
}
