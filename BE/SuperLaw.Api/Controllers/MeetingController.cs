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

            //from fe it is selected for example 19.10 midnight but comming to be as 18.10 21:00
            //But if today date is selected then it comes correctly
            //because of time change in the end of october also it is possible the time to come as 22
            if (input.Date.Hour == 21 || input.Date.Hour == 22)
            {
                input.Date = input.Date.AddDays(1);
            }

            await _meetingService.CreateMeetingAsync(userId, input);
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
