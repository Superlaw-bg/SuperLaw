using SuperLaw.Data.Models;

namespace SuperLaw.Data.DataSeeders
{
    public class LegalCategorySeeder
    {
        private readonly SuperLawDbContext _context;

        public LegalCategorySeeder(SuperLawDbContext context)
        {
            _context = context;
        }

        public void Run()
        {
            if (_context.LegalCategories.Any())
                return;

            var categories = new List<LegalCategory>()
            {
                new LegalCategory()
                {
                    Name = "Наследство"
                },
                new LegalCategory()
                {
                    Name = "Развод"
                },
                new LegalCategory()
                {
                    Name = "Недвижимо имущество"
                },
                new LegalCategory()
                {
                    Name = "Движимо имущество"
                },
                new LegalCategory()
                {
                    Name = "Физически разправи"
                },
                new LegalCategory()
                {
                    Name = "Катастрофи"
                },
                new LegalCategory()
                {
                    Name = "Природни бедствия"
                },
                new LegalCategory()
                {
                    Name = "Болести"
                },
            };

            _context.LegalCategories.AddRange(categories);
            _context.SaveChanges();
        }
    }
}
