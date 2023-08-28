using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SuperLaw.Data.Models;

namespace SuperLaw.Data.EntityConfigs
{
    public class LawyerProfileJudicialRegionConfig : IEntityTypeConfiguration<LawyerProfileJudicialRegion>
    {
        public void Configure(EntityTypeBuilder<LawyerProfileJudicialRegion> entity)
        {
            entity
                .HasKey(lj => new { lj.ProfileId, lj.RegionId });

            entity
                .HasOne(lj => lj.Profile)
                .WithMany(l => l.JudicialRegions)
                .HasForeignKey(lj => lj.ProfileId)
                .OnDelete(DeleteBehavior.Restrict);

            entity
                .HasOne(lj => lj.Region)
                .WithMany(j => j.Lawyers)
                .HasForeignKey(lj => lj.RegionId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
