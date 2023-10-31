using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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
    }
}
