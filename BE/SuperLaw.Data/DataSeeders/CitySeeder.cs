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

            var cities = new List<City>();

            var citiesStr =
                "София, София-област, Благоевград, Бургас, Варна, Велико Търново, Видин, Враца, Габрово, Добрич, Кюстендил, Кърджали, Ловеч, Монтана, Пазарджик, Перник, Плевен, Пловдив, Разград, Русе, Силистра, Сливен, Смолян, Стара Загора, Търговище, Хасково, Шумен, Ямбол";

            var citiesStrings = citiesStr.Split(", ").ToList();

            foreach (var str in citiesStrings)
            {
                var entity = new City()
                {
                    Name = str
                };

                cities.Add(entity);
            }

            _context.Cities.AddRange(cities);
            _context.SaveChanges();
        }
    }
}
