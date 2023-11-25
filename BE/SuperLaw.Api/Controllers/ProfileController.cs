using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
        [HttpPost(nameof(UploadPicture))]
        public async Task<IActionResult> UploadPicture([FromQuery] int profileId, IFormFile picture)
        {
            await _profileService.UploadImageAsync(profileId, picture);

            return Ok();
        }

        [Authorize(Roles = "Lawyer")]
        [HttpPost(nameof(Create))]
        public async Task<IActionResult> Create(CreateProfileInput input)
        {
            if (ValidateInputData(input, out var badRequest) && badRequest != null)
                return badRequest;

            var userId = GetCurrentUserId();

            var profileId = await _profileService.CreateProfileAsync(userId, input);

            return Ok(profileId);
        }

        [Authorize(Roles = "Lawyer")]
        [HttpPost(nameof(Edit))]
        public async Task<IActionResult> Edit(CreateProfileInput input)
        {
            if (ValidateInputData(input, out var badRequest) && badRequest != null)
                return badRequest;

            var userId = GetCurrentUserId();

            var profileId = await _profileService.EditProfileAsync(userId, input);

            return Ok(profileId);
        }

        [AllowAnonymous]
        [HttpGet(nameof(GetAll))]
        public IActionResult GetAll([FromQuery]GetAllProfilesInput input)
        {
            var userId = GetCurrentUserId();

            var result = _profileService.GetAll(userId, input);

            return Ok(result);
        }

        private bool ValidateInputData(CreateProfileInput input, out IActionResult? badRequest)
        {
            if (string.IsNullOrEmpty(input.Description))
            {
                {
                    badRequest = BadRequest(new ErrorDetails()
                    {
                        message = "Информацията за профила е задължителна"
                    });
                    return true;
                }
            }

            if (input.Rate < 100 || input.Rate > 500)
            {
                {
                    badRequest = BadRequest(new ErrorDetails()
                    {
                        message = "Часовата ставка е задължителна и трябва да е между 100 и 500"
                    });
                    return true;
                }
            }

            if (string.IsNullOrEmpty(input.Address))
            {
                {
                    badRequest = BadRequest(new ErrorDetails()
                    {
                        message = "Адресът е задължителен"
                    });
                    return true;
                }
            }

            if (input.Categories.Count == 0)
            {
                {
                    badRequest = BadRequest(new ErrorDetails()
                    {
                        message = "Поне една категория е задължителна"
                    });
                    return true;
                }
            }

            if (input.Regions.Count == 0)
            {
                {
                    badRequest = BadRequest(new ErrorDetails()
                    {
                        message = "Поне един съдебен район е задължителен"
                    });
                    return true;
                }
            }

            badRequest = null;

            return false;
        }
    }
}
