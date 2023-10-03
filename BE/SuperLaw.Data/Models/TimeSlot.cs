using SuperLaw.Data.Models.Enums;

namespace SuperLaw.Data.Models
{
    public class TimeSlot
    {
        public int Id { get; set; }

        public int ProfileId { get; set; }
        public LawyerProfile Profile { get; set; }

        public DayEnum DayOfWeek { get; set; }

        public TimeSpan From { get; set; }

        public TimeSpan To { get; set; }
    }
}
