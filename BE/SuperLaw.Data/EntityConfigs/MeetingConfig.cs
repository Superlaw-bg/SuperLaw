using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SuperLaw.Data.Models;

namespace SuperLaw.Data.EntityConfigs
{
    public class MeetingConfig : IEntityTypeConfiguration<Meeting>
    {
        public void Configure(EntityTypeBuilder<Meeting> entity)
        {
            entity
                .HasOne(m => m.Client)
                .WithMany(u => u.Meetings)
                .HasForeignKey(m => m.ClientId)
                .OnDelete(DeleteBehavior.Cascade);

            entity
                .HasOne(m => m.LawyerProfile)
                .WithMany(l => l.Meetings)
                .HasForeignKey(m => m.LawyerProfileId)
                .OnDelete(DeleteBehavior.Cascade);

            entity
                .HasOne(m => m.TimeSlot)
                .WithOne(t => t.Meeting)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
