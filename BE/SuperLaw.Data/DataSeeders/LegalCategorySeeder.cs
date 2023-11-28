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
                "Спорове за издръжка",
                "Спорове за наследство",
                "Брачни договори",
                "Наказателни постановления, актове, фишове, глоби",
                "Жалби и сигнали",
                "Разрешения за строителство",
                "Обществени поръчки",
                "Регистрация на дружества",
                "Търговски спорове",
                "Несъстоятелност",
                "Търговски сделки",
                "Проучвания (Due diligence)",
                "Данъчно право",
                "Митническо право",
                "Конкурентно",
                "Застрахователно право",
                "Международно частно право",
                "Право на ЕС",
                "Защита на потребителя",
                "Лични данни",
                "IT право",
                "Наказателно право",
                "Трудово право",
                "Осигурително право",
                "Авиационно право - обезщетения от авиокомпании",
                "Защита от домашно насилие",
                "Заповедни производства",
                "Защита от дискриминация",
                "Непозволено увреждане",
                "Обезщетения за вреди",
                "Казуси, свързани с ПТП",
                "Медицинско право"
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
