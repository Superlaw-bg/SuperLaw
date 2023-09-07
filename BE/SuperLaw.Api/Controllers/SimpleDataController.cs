using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SuperLaw.Services.DTO;
using SuperLaw.Services.Interfaces;

namespace SuperLaw.Api.Controllers
{
    public class SimpleDataController : ApiController
    {
        private readonly ISimpleDataService _dataService;

        public SimpleDataController(ISimpleDataService dataService)
        {
            _dataService = dataService;
        }

        [AllowAnonymous]
        [HttpGet(nameof(Cities))]
        public List<SimpleDto> Cities()
        {
            var result = _dataService.GetAllCities();

            return result;
        }

        [AllowAnonymous]
        [HttpGet(nameof(LegalCategories))]
        public List<SimpleDto> LegalCategories()
        {
            var result = _dataService.GetAllLegalCategories();

            return result;
        }

        [AllowAnonymous]
        [HttpGet(nameof(JudicialRegions))]
        public List<SimpleDto> JudicialRegions()
        {
            var result = _dataService.GetAllJudicialRegions();

            return result;
        }
    }
}
