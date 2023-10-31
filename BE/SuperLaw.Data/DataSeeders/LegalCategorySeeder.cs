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

            var categories = new List<LegalCategory>();

            var categoriesStr = new List<string>()
            {
                "Спорове за собственост",
                "Сключване на сделки",
                "Предварителни договори",
                "Договори за кредит",
                "Принудително изпълнение",
                "Бракоразводни дела",
                "Издръжка",
                "Спорове за наследство",
                "Брачни договори",
                "Наказателни постановления, актове, фишове, глоби",
                "Жалби и сигнали",
                "Разрешения за строителство",
                "Обществени поръчки",
                "Регистрация на фирма",
                "Търговски спорове",
                "Несъстоятелност",
                "Търговски сделки",
                "Проучвания (Due diligence)",
                "Данъчно право",
                "Митническо право"
            };

            foreach (var str in categoriesStr)
            {
                var entity = new LegalCategory()
                {
                    Name = str
                };

                categories.Add(entity);
            }

            _context.LegalCategories.AddRange(categories);
            _context.SaveChanges();
        }
    }
}
