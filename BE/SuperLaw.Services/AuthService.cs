using Firebase.Auth;

namespace SuperLaw.Services
{
    public class AuthService : IAuthService
    {
        private readonly FirebaseAuthClient _firebaseAuth;
        public AuthService(FirebaseAuthClient firebaseAuth)
        {
            _firebaseAuth = firebaseAuth;
        }

        public async Task<string?> Register(string email, string password, string confirmPassword)
        {
            if (password != confirmPassword)
            {
                throw new ArgumentException("Passwords don't match");
            }

            var userCredentials = await _firebaseAuth.CreateUserWithEmailAndPasswordAsync(email, password);

            if (userCredentials == null)
            {
                return null;
            }

            var idToken = await userCredentials.User.GetIdTokenAsync();

            return idToken;
        }

        public async Task<string?> Login(string email, string password)
        {
            var userCredentials = await _firebaseAuth.SignInWithEmailAndPasswordAsync(email, password);

            if (userCredentials == null)
            {
                return null;
            }

            var idToken = await userCredentials.User.GetIdTokenAsync();

            return idToken;
        }

        public void LogOut()
        {
            _firebaseAuth.SignOut();
        }
    }
}