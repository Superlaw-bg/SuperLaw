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

            var regions = new List<JudicialRegion>()
            {
                new JudicialRegion()
                {
                    Name = "Софийски"
                },
                new JudicialRegion()
                {
                    Name = "Пернишки"
                },
                new JudicialRegion()
                {
                    Name = "Варненски"
                },
                new JudicialRegion()
                {
                    Name = "Пловдивски"
                },
                new JudicialRegion()
                {
                    Name = "Шуменски"
                },
                new JudicialRegion()
                {
                    Name = "Бургаски"
                },
                new JudicialRegion()
                {
                    Name = "Кюстендилски"
                },
                new JudicialRegion()
                {
                    Name = "Русенски"
                },
            };

            _context.JudicialRegions.AddRange(regions);
            _context.SaveChanges();
        }
    }
}
