using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SuperLaw.Services;
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

        [Authorize(Roles = "User, Admin")]
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

        [Authorize(Roles = "User, Admin")]
        [HttpPost(nameof(Rate))]
        public async Task<IActionResult> Rate([FromBody] RateMeetingInput input)
        {
            var userId = GetCurrentUserId();

            if (userId == null)
            {
                return BadRequest(new ErrorDetails()
                {
                    Message = "Невалиден потребител"
                });
            }

            await _meetingService.RateMeetingAsync(userId, input);
            return Ok();
        }

        [HttpGet(nameof(GetAllForUser))]
        public async Task<IActionResult> GetAllForUser()
        {
            var userId = GetCurrentUserId();

            if (userId == null)
            {
                return BadRequest(new ErrorDetails()
                {
                    Message = "Невалиден потребител"
                });
            }

            var result = await _meetingService.GetAllForUserAsync(userId);

            return Ok(result);
        }
    }
}
