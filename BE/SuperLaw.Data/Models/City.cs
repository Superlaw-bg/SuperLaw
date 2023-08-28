using System.ComponentModel.DataAnnotations;

namespace SuperLaw.Data.Models
{
    public class City
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Name { get; set; } = string.Empty;
    }
}
