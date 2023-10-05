using Microsoft.AspNetCore.Mvc;
using SuperLaw.Services.Input;

namespace SuperLaw.Api.Controllers
{
    public class MeetingController : ApiController
    {
        public MeetingController()
        {
            
        }

        [HttpPost(nameof(Create))]
        public async Task<IActionResult> Create([FromBody] CreateMeetingInput input)
        {
            
            return Ok();
        }
    }
}
