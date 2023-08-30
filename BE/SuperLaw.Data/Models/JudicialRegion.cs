using System.ComponentModel.DataAnnotations;

namespace SuperLaw.Data.Models
{
    public class JudicialRegion
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Name { get; set; } = string.Empty;

        public ICollection<LawyerProfileJudicialRegion> Lawyers { get; set; } = new List<LawyerProfileJudicialRegion>();
    }
}
