using System.ComponentModel;

namespace SuperLaw.Common
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
    }
}