namespace SuperLaw.Data.Models
{
    public class LawyerProfileJudicialRegion
    {
        public int ProfileId { get; set; }

        public LawyerProfile Profile { get; set; }

        public int RegionId { get; set; }

        public JudicialRegion Region { get; set; }
    }
}
