using System.ComponentModel.DataAnnotations;

namespace SuperLaw.Data.Models
{
    public class Meeting
    {
        public int Id { get; set; }

        public string ClientId { get; set; }
        public User Client { get; set; }
        
        public int LawyerProfileId { get; set; }
        public LawyerProfile LawyerProfile { get; set; }

        public DateTimeOffset DateTime { get; set; } 

        public string From { get; set; }

        public string To { get; set; }

        public string Info { get; set; }

        public int? CategoryId { get; set; }

        public int? RegionId { get; set; }

        [Range(0, 5)]
        public decimal Rating { get; set; }

        public bool IsUserFlagged { get; set; }

        public string ReasonForFlagging { get; set; } = string.Empty;
    }
}
