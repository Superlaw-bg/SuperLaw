using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace SuperLaw.Data.Models
{
    public class User : IdentityUser<string>
    {
        public User()
        {
            Id = Guid.NewGuid().ToString();
            RegisteredOn = DateTimeOffset.UtcNow;
        }

        [Required]
        [EmailAddress]
        public override string Email { get; set; } = string.Empty;

        [Phone]
        public string Phone { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string FirstName { get; set; } = string.Empty;

        [MaxLength(30)]
        public string Surname { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string LastName { get; set; } = string.Empty;

        public int CityId { get; set; }
        public City City { get; set; }

        public string? LawyerIdNumber { get; set; }

        public bool IsFlagged { get; set; }

        public DateTimeOffset RegisteredOn { get; set; }

        public ICollection<Meeting> Meetings { get; set; } = new List<Meeting>();
    }
}
