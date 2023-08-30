using SuperLaw.Data.Models;

namespace SuperLaw.Data.DataSeeders
{
    public class CitySeeder
    {
        private readonly SuperLawDbContext _context;

        public CitySeeder(SuperLawDbContext context)
        {
            _context = context;
        }

        public void Run()
        {
            if (_context.Cities.Any())
                return;

            var cities = new List<City>()
            {
                new City()
                {
                    Name = "София град"
                },
                new City()
                {
                    Name = "София област"
                },
                new City()
                {
                    Name = "Перник"
                },
                new City()
                {
                    Name = "Пловдив"
                },
                new City()
                {
                    Name = "Варна"
                },
                new City()
                {
                    Name = "Бургас"
                },
                new City()
                {
                    Name = "Русе"
                },
                new City()
                {
                    Name = "Плевен"
                },
            };

            _context.Cities.AddRange(cities);
            _context.SaveChanges();
        }
    }
}
