namespace SuperLaw.Services.DTO
{
    public class ScheduleDto
    {
        public DateTime Date { get; set; }

        public List<TimeSlotDto> TimeSlots { get; set; } = new List<TimeSlotDto>();
    }
}
