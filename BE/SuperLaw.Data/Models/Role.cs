using Microsoft.AspNetCore.Identity;

namespace SuperLaw.Data.Models
{
    public class Role : IdentityRole<string>
    {
        public Role(string name) : base(name)
        {
            Id = Guid.NewGuid().ToString();
            NormalizedName = name.ToUpper();
        }
    }
}
