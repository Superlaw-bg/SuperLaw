namespace SuperLaw.Services.DTO
{
    public class LawyerProfileDto : LawyerProfileBaseDto
    {
        public int Id { get; set; }

        public string FullName { get; set; }

        public string ImgPath { get; set; }

        public string Description { get; set; }

        public decimal HourlyRate { get; set; }

        public string Address { get; set; }

        public string Phone { get; set; }

        public List<SimpleDto> Categories { get; set; } = new List<SimpleDto>();

        public List<SimpleDto> Regions { get; set; } = new List<SimpleDto>();

        public bool IsJunior { get; set; }

        public bool IsCompleted { get; set; }
    }
}
