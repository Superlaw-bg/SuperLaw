using System.ComponentModel.DataAnnotations;

namespace SuperLaw.Services.Input
{
    public class LoginInput
    {
        public string Email { get; set; }

        public string Password { get; set; }
    }
}
