namespace SuperLaw.Services.DTO
{
    public class ScheduleDtoNew
    {
        public DateTime Date { get; set; }

        public List<TimeSlotDto> TimeSlots { get; set; } = new List<TimeSlotDto>();
    }
}
