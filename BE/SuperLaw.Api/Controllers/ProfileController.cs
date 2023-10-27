using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SuperLaw.Services.DTO;
using SuperLaw.Services.Input;
using SuperLaw.Services.Interfaces;

namespace SuperLaw.Api.Controllers
{
    public class ProfileController : ApiController
    {
        private readonly IProfileService _profileService;

        public ProfileController(IProfileService profileService)
        {
            _profileService = profileService;
        }

        [Authorize(Roles = "Lawyer")]
        [HttpGet(nameof(Own))]
        public async Task<IActionResult> Own()
        {
            var userId = GetCurrentUserId();

            var result = await _profileService.GetOwnProfileAsync(userId);

            if (result == null)
            {
                return Ok();
            }

            return Ok(result);
        }

        [Authorize(Roles = "User, Admin")]
        [HttpGet]
        [Route("Get/{id:int}")]
        public async Task<IActionResult> Get([FromRoute]int id)
        {
            var result = await _profileService.GetProfileByIdAsync(id);

            if (result == null)
            {
                return Ok();
            }

            return Ok(result);
        }

        [Authorize(Roles = "Lawyer")]
        [HttpGet(nameof(OwnDataForEdit))]
        public async Task<IActionResult> OwnDataForEdit()
        {
            var userId = GetCurrentUserId();

            var result = await _profileService.GetOwnProfileDataForEditAsync(userId);

            return Ok(result);
        }

        [Authorize(Roles = "Lawyer")]
        [HttpPost(nameof(Create))]
        public async Task<IActionResult> Create()
        {
            var formCollection = await Request.ReadFormAsync();

            var image = formCollection.Files.FirstOrDefault();

            var hasDescr = formCollection.TryGetValue("description", out var description);
            
            if (!hasDescr)
            {
                return BadRequest(new ErrorDetails()
                {
                    Message = "Информацията за профила е задължителна"
                });
            }

            var hasHourlyRate = formCollection.TryGetValue("hourlyRate", out var hourlyRateStr);

            if (!hasHourlyRate)
            {
                return BadRequest(new ErrorDetails()
                {
                    Message = "Часовата ставка е задължителна"
                });
            }

            var hasAddress = formCollection.TryGetValue("address", out var address);

            if (!hasAddress)
            {
                return BadRequest(new ErrorDetails()
                {
                    Message = "Адресът е задължителен"
                });
            }

            var hasCategories = formCollection.TryGetValue("categories", out var categoriesStr);

            if (!hasCategories)
            {
                return BadRequest(new ErrorDetails()
                {
                    Message = "Поне една категория е задължителна"
                });
            }

            var hasRegions = formCollection.TryGetValue("regions", out var regionsStr);

            if (!hasRegions)
            {
                return BadRequest(new ErrorDetails()
                {
                    Message = "Поне един съдебен район е задължителен"
                });
            }

            var hasIsJunior = formCollection.TryGetValue("isJunior", out var isJuniorStr);

            if (!hasIsJunior)
            {
                return BadRequest(new ErrorDetails()
                {
                    Message = "Отметката е задължителна"
                });
            }

            var hasIsCompleted = formCollection.TryGetValue("isCompleted", out var isCompletedStr);

            if (!hasIsCompleted)
            {
                return BadRequest(new ErrorDetails()
                {
                    Message = "Отметката е задължителна"
                });
            }

            var profileInput = new CreateProfileInput()
            {
                Image = image,
                Description = description.ToString(),
                Address = address.ToString(),
                HourlyRate = int.Parse(hourlyRateStr.ToString()),
                Categories = categoriesStr
                    .ToString()
                    .Split(',')
                    .Select(int.Parse)
                    .ToList(),
                Regions = regionsStr
                    .ToString()
                    .Split(',')
                    .Select(int.Parse)
                    .ToList(),
                IsJunior = isJuniorStr.ToString() == "true",
                IsCompleted = isCompletedStr.ToString() == "true",
            };

            var hasSchedule = formCollection.TryGetValue("schedule", out var scheduleStr);

            if (hasSchedule)
            {
                var schedule = JsonConvert.DeserializeObject<List<ScheduleDto>>(scheduleStr.ToString());
                profileInput.Schedule = schedule;
            }

            var userId = GetCurrentUserId();

            await _profileService.CreateProfileAsync(userId, profileInput);

            return Ok();
        }

        [Authorize(Roles = "Lawyer")]
        [HttpPost(nameof(Edit))]
        public async Task<IActionResult> Edit()
        {
            var formCollection = await Request.ReadFormAsync();

            var image = formCollection.Files.FirstOrDefault();

            var hasDescr = formCollection.TryGetValue("description", out var description);

            if (!hasDescr)
            {
                return BadRequest(new ErrorDetails()
                {
                    Message = "Информацията за профила е задължителна"
                });
            }

            var hasHourlyRate = formCollection.TryGetValue("hourlyRate", out var hourlyRateStr);

            if (!hasHourlyRate)
            {
                return BadRequest(new ErrorDetails()
                {
                    Message = "Часовата ставка е задължителна"
                });
            }

            var hasAddress = formCollection.TryGetValue("address", out var address);

            if (!hasAddress)
            {
                return BadRequest(new ErrorDetails()
                {
                    Message = "Адресът е задължителен"
                });
            }

            var hasCategories = formCollection.TryGetValue("categories", out var categoriesStr);

            if (!hasCategories)
            {
                return BadRequest(new ErrorDetails()
                {
                    Message = "Поне една категория е задължителна"
                });
            }

            var hasRegions = formCollection.TryGetValue("regions", out var regionsStr);

            if (!hasRegions)
            {
                return BadRequest(new ErrorDetails()
                {
                    Message = "Поне един съдебен район е задължителен"
                });
            }

            var hasIsJunior = formCollection.TryGetValue("isJunior", out var isJuniorStr);

            if (!hasIsJunior)
            {
                return BadRequest(new ErrorDetails()
                {
                    Message = "Отметката е задължителна"
                });
            }

            var hasIsCompleted = formCollection.TryGetValue("isCompleted", out var isCompletedStr);

            if (!hasIsCompleted)
            {
                return BadRequest(new ErrorDetails()
                {
                    Message = "Отметката е задължителна"
                });
            }

            var profileInput = new CreateProfileInput()
            {
                Image = image,
                Description = description.ToString(),
                Address = address.ToString(),
                HourlyRate = int.Parse(hourlyRateStr.ToString()),
                Categories = categoriesStr
                    .ToString()
                    .Split(',')
                    .Select(int.Parse)
                    .ToList(),
                Regions = regionsStr
                    .ToString()
                    .Split(',')
                    .Select(int.Parse)
                    .ToList(),
                IsJunior = isJuniorStr.ToString() == "true",
                IsCompleted = isCompletedStr.ToString() == "true",
            };

            var hasSchedule = formCollection.TryGetValue("schedule", out var scheduleStr);

            if (hasSchedule)
            {
                var schedule = JsonConvert.DeserializeObject<List<ScheduleDto>>(scheduleStr.ToString());
                profileInput.Schedule = schedule;
            }

            var userId = GetCurrentUserId();

            await _profileService.EditProfileAsync(userId, profileInput);

            return Ok();
        }

        [AllowAnonymous]
        [HttpGet(nameof(GetAll))]
        public IActionResult GetAll([FromQuery]GetAllProfilesInput input)
        {
            var userId = GetCurrentUserId();

            var result = _profileService.GetAll(userId, input);

            return Ok(result);
        }
    }
}
