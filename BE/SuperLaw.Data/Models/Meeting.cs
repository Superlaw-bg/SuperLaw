namespace SuperLaw.Data.Models
{
    public class Meeting
    {
        public int Id { get; set; }

        public int ClientId { get; set; }
        public User Client { get; set; }
        
        public int LawyerProfileId { get; set; }
        public LawyerProfile LawyerProfile { get; set; }

        public DateTimeOffset DateTime { get; set; } 

        public bool IsUserFlagged { get; set; }

        public string ReasonForFlagging { get; set; } = string.Empty;
    }
}
