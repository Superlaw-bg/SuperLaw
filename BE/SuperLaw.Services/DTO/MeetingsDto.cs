namespace SuperLaw.Services.DTO
{
    public class MeetingsDto
    {
        public List<MeetingDto> Past { get; set; } = new List<MeetingDto>();

        public List<MeetingDto> Upcoming { get; set; } = new List<MeetingDto>();
    }
}
