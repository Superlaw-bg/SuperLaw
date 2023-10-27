namespace SuperLaw.Services.DTO
{
    public class TimeSlotDto
    {
        public int Id { get; set; }

        public string From { get; set; }

        public string To { get; set; }

        public bool HasMeeting { get; set; }

        public string? ClientName { get; set; }
    }
}
