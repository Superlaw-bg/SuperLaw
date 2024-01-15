using SuperLaw.Data.Models;

namespace SuperLaw.Data.DataSeeders
{
    public class JudicialRegionSeeder
    {
        private readonly SuperLawDbContext _context;

        public JudicialRegionSeeder(SuperLawDbContext context)
        {
            _context = context;
        }

        public void Run()
        {
            if (_context.JudicialRegions.Any())
                return;

            var regions = new List<JudicialRegion>();

            var regionsStr =
                "Цялата страна, София-град, Благоевград, Бургас, Варна, Велико Търново, Видин, Враца, Габрово, Добрич, Кюстендил, Кърджали, Ловеч, Монтана, Пазарджик, Перник, Плевен, Пловдив, Разград, Русе, Силистра, Сливен, Смолян, Стара Загора, Търговище, Хасково, Шумен, Ямбол";

            var regionsStrings = regionsStr.Split(", ").ToList();

            foreach (var str in regionsStrings)
            {
                var entity = new JudicialRegion()
                {
                    Name = str
                };

                regions.Add(entity);
            }

            _context.JudicialRegions.AddRange(regions);
            _context.SaveChanges();
        }
    }
}
