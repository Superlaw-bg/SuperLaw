using SuperLaw.Data;
using SuperLaw.Data.Models;
using SuperLaw.Services.DTO;
using SuperLaw.Services.Interfaces;

namespace SuperLaw.Services
{
    public class SimpleDataService : ISimpleDataService
    {
        private readonly SuperLawDbContext _context;

        public SimpleDataService(SuperLawDbContext context)
        {
            _context = context;
        }

        public List<SimpleDto> GetAllCities()
        {
            var result = _context.Cities.Select(x => new SimpleDto
            {
                Id = x.Id,
                Name = x.Name
            })
                .ToList();

            return result;
        }

        public City? GetCity(int id)
        {
            var city = _context.Cities.FirstOrDefault(x => x.Id == id);

            return city;
        }

        public List<SimpleDto> GetAllLegalCategories()
        {
            var result = _context.LegalCategories.Select(x => new SimpleDto
                {
                    Id = x.Id,
                    Name = x.Name,
                    Description = x.Description
                })
                .ToList();

            return result;
        }

        public List<SimpleDto> GetAllJudicialRegions()
        {
            var result = _context.JudicialRegions.Select(x => new SimpleDto
                {
                    Id = x.Id,
                    Name = x.Name
                })
                .ToList();

            return result;
        }
    }
}
