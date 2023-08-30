using System.ComponentModel.DataAnnotations;

namespace SuperLaw.Data.Models
{
    public class LegalCategory
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Name { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public ICollection<LawyerProfileLegalCategory> Lawyers { get; set; } = new List<LawyerProfileLegalCategory>();
    }
}
