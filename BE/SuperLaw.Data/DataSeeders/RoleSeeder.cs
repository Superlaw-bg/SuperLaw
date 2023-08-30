using SuperLaw.Common;
using SuperLaw.Data.Models;

namespace SuperLaw.Data.DataSeeders
{
    public class RoleSeeder
    {
        private readonly SuperLawDbContext _context;

        public RoleSeeder(SuperLawDbContext context)
        {
            _context = context;
        }

        public void Run()
        {
            if (_context.Roles.Any())
                return;

            var roles = new List<Role>()
            {
                new Role(RoleNames.AdminRole),
                new Role(RoleNames.UserRole),
                new Role(RoleNames.LawyerRole),
            };

            _context.Roles.AddRange(roles);
            _context.SaveChanges();
        }
    }
}
