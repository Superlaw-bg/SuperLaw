namespace SuperLaw.Services.Input
{
    public class ResetPasswordInput
    {
        public string Email { get; set; }

        public string Token { get; set; }

        public string Password { get; set; }

        public string ConfirmPassword { get; set; }
    }
}
