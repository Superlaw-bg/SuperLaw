using SuperLaw.Services.DTO;

namespace SuperLaw.Services.Input
{
    public class CreateMeetingInput
    {
        public int ProfileId { get; set; }
        
        public DateTime Date { get; set; }
        
        public TimeSlotDto TimeSlot { get; set; } = new TimeSlotDto();

        public int CategoryId { get; set; }

        public int RegionId { get; set; }

        public string Info { get; set; }
    }
}
