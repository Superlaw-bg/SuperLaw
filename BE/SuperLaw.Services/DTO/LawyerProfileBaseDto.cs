namespace SuperLaw.Services.DTO
{
    public class LawyerProfileBaseDto
    {
        public ScheduleDto Schedule { get; set; } = new ScheduleDto();

        public Dictionary<DateTime, List<MeetingSimpleDto>> Meetings { get; set; } =
            new Dictionary<DateTime, List<MeetingSimpleDto>>();
    }
}
