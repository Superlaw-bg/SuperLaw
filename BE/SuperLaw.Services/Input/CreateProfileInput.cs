using SuperLaw.Services.DTO;

namespace SuperLaw.Services.Input
{
    public class CreateProfileInput
    {
        public string Description { get; set; }
        public decimal Rate { get; set; }
        public string Address { get; set; }
        public List<int> Categories { get; set; }
        public List<int> Regions { get; set; }

        public List<ScheduleDto> Schedule { get; set; } = new List<ScheduleDto>();

        public bool IsJunior { get; set; }
        public bool IsCompleted { get; set; }

        public string LawyerFirm { get; set; }
    }
}
