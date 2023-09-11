using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SuperLaw.Data.Models;
using SuperLaw.Services.Input;

namespace SuperLaw.Api.Controllers
{
    public class ProfileController : ApiController
    {
        [Authorize(Roles = "Lawyer")]
        [HttpPost(nameof(Create))]
        public async Task<IActionResult> Create()
        {
            var formCollection = await Request.ReadFormAsync();

            var image = formCollection.Files.FirstOrDefault();

            var success = formCollection.TryGetValue("description", out var description);

            if (!success)
            {
                return BadRequest(new ErrorDetails()
                {
                    Message = "Информацията за профила е задължителна"
                });
            }

            return Ok("All set");
        }
    }
}
