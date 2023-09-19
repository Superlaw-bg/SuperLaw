﻿namespace SuperLaw.Services.DTO
{
    public class LawyerProfileEditDto
    {
        public int Id { get; set; }

        public string Description { get; set; }

        public decimal HourlyRate { get; set; }

        public string Address { get; set; }

        public List<FrontEndOptionDto> Categories { get; set; } = new List<FrontEndOptionDto>();

        public List<FrontEndOptionDto> Regions { get; set; } = new List<FrontEndOptionDto>();

        public bool IsJunior { get; set; }

        public bool IsCompleted { get; set; }
    }
}