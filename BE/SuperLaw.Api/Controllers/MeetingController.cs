using Microsoft.AspNetCore.Mvc;
using SuperLaw.Services.Input;
using SuperLaw.Services.Interfaces;

namespace SuperLaw.Api.Controllers
{
    public class MeetingController : ApiController
    {
        private readonly IMeetingService _meetingService;

        public MeetingController(IMeetingService meetingService)
        {
            _meetingService = meetingService;
        }

        [HttpPost(nameof(Create))]
        public async Task<IActionResult> Create([FromBody] CreateMeetingInput input)
        {
            var userId = GetCurrentUserId();

            if (userId == null)
            {
                return BadRequest(new ErrorDetails()
                {
                    Message = "Невалиден потребител"
                });
            }

            await _meetingService.CreateMeetingAsync(userId, input);
            return Ok();
        }
    }
}
