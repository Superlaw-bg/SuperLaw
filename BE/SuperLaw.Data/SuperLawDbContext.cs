using Microsoft.EntityFrameworkCore;
using SuperLaw.Data.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace SuperLaw.Data
{
    public class SuperLawDbContext : IdentityDbContext<User, Role, string>
    {
        public SuperLawDbContext(DbContextOptions<SuperLawDbContext> options)
            : base(options)
        {
        }

        public DbSet<City> Cities { get; set; }

        public override DbSet<Role> Roles { get; set; }

        public override DbSet<User> Users { get; set; }

        public DbSet<JudicialRegion> JudicialRegions { get; set; }

        public DbSet<LegalCategory> LegalCategories { get; set; }

        public DbSet<LawyerProfile> LawyerProfiles { get; set; }

        public DbSet<Meeting> Meetings { get; set; }

        public DbSet<LawyerProfileLegalCategory> LawyerProfilesLegalCategories { get; set; }

        public DbSet<LawyerProfileJudicialRegion> LawyerProfilesJudicialRegions { get; set; }

        public DbSet<TimeSlot> TimeSlots { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            foreach (var relationship in builder.Model.GetEntityTypes().SelectMany(e => e.GetForeignKeys()))
            {
                relationship.DeleteBehavior = DeleteBehavior.Restrict;
            }

            builder.ApplyConfigurationsFromAssembly(GetType().Assembly);
        }
    }
}
