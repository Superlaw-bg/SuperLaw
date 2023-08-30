using System.ComponentModel;
using Microsoft.EntityFrameworkCore;

namespace SuperLaw.Data
{
    public static class EnumsExtensions
    {
        public static string GetEnumName<TEnum>(this TEnum item) where TEnum : Enum
        {
            return item.GetType()
                .GetField(item.ToString())
                .GetCustomAttributes(typeof(DescriptionAttribute), false)
                .Cast<DescriptionAttribute>()
                .FirstOrDefault()?.Description ?? item.ToString();
        }

        public static void SeedEnumValues<T, TEnum>(this ModelBuilder mb, Func<TEnum, T> converter)
            where T : class
        {
            Enum.GetValues(typeof(TEnum))
                .Cast<object>()
                .Select(value => converter((TEnum)value))
                .ToList()
                .ForEach(instance => mb.Entity<T>().HasData(instance));
        }
    }
}