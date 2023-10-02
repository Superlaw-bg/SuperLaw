using SuperLaw.Services.DTO;

namespace SuperLaw.Services.Input
{
    public class ScheduleInput
    {
        public List<TimeSlotDto> Monday { get; set; } = new List<TimeSlotDto>();

        public List<TimeSlotDto> Tuesday { get; set; } = new List<TimeSlotDto>();

        public List<TimeSlotDto> Wednesday { get; set; } = new List<TimeSlotDto>();

        public List<TimeSlotDto> Thursday { get; set; } = new List<TimeSlotDto>();

        public List<TimeSlotDto> Friday { get; set; } = new List<TimeSlotDto>();

        public List<TimeSlotDto> Saturday { get; set; } = new List<TimeSlotDto>();

        public List<TimeSlotDto> Sunday { get; set; } = new List<TimeSlotDto>();
    }
}
