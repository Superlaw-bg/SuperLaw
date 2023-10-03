using Microsoft.AspNetCore.Http;
using SuperLaw.Services.DTO;

namespace SuperLaw.Services.Input
{
    public class CreateProfileInput
    {
        public IFormFile? Image { get; set; }
        public string Description { get; set; }
        public decimal HourlyRate { get; set; }
        public string Address { get; set; }
        public List<int> Categories { get; set; }
        public List<int> Regions { get; set; }

        public ScheduleDto Schedule { get; set; }

        public bool IsJunior { get; set; }
        public bool IsCompleted { get; set; }
    }
}
