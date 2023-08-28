namespace SuperLaw.Data.Models
{
    public class LawyerProfileLegalCategory
    {
        public int ProfileId { get; set; }

        public LawyerProfile Profile { get; set; }

        public int CategoryId { get; set; }

        public LegalCategory Category { get; set; }
    }
}
