using System.ComponentModel.DataAnnotations;

namespace SuperLaw.Data.Models
{
    public class LawyerProfile
    {
        public int Id { get; set; }

        public string UserId { get; set; }
        public User User { get; set; }

        public string ImgPath { get; set; } = string.Empty;

        public string Info { get; set; } = string.Empty;

        public decimal HourlyRate { get; set; }

        public string Address { get; set; } = string.Empty;

        [Range(0, 5)]
        public decimal Rating { get; set; }

        public bool IsJunior { get; set; }

        public bool IsCompleted { get; set; }

        public DateTime CompletedOn { get; set; }

        public ICollection<LawyerProfileJudicialRegion> JudicialRegions { get; set; } = new List<LawyerProfileJudicialRegion>();

        public ICollection<LawyerProfileLegalCategory> LegalCategories { get; set; } =
            new List<LawyerProfileLegalCategory>();

        public ICollection<Meeting> Meetings { get; set; } = new List<Meeting>();

        public ICollection<TimeSlot> TimeSlots { get; set; } = new List<TimeSlot>();
    }
}
