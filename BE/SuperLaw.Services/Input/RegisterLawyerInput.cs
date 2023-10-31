using System.ComponentModel.DataAnnotations;

namespace SuperLaw.Services.Input
{
    public class RegisterLawyerInput
    {
        [Required]
        public string FirstName { get; set; }

        [Required]
        public string Surname { get; set; }

        [Required]
        public string LastName { get; set; }

        [EmailAddress]
        public string Email { get; set; }

        [Phone]
        [MinLength(9)]
        [MaxLength(9)]
        public string Phone { get; set; }

        [Required]
        public string LawyerIdNumber { get; set; }

        [Required]
        public int CityId { get; set; }

        [Required]
        public string Password { get; set; }
        [Required]
        public string ConfirmPassword { get; set; }
    }
}
