namespace SuperLaw.Services.DTO
{
    public class LawyerProfileBaseDto
    {
        public List<ScheduleDtoNew> Schedule { get; set; } = new();

        public Dictionary<DateTime, List<MeetingSimpleDto>> Meetings { get; set; } =
            new Dictionary<DateTime, List<MeetingSimpleDto>>();
    }
}
