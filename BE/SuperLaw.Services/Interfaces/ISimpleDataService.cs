using SuperLaw.Data.Models;
using SuperLaw.Services.DTO;

namespace SuperLaw.Services.Interfaces
{
    public interface ISimpleDataService
    {
        List<SimpleDto> GetAllCities();
        List<SimpleDto> GetAllLegalCategories();
        List<SimpleDto> GetAllJudicialRegions();

        City? GetCity(int id);
    }
}
