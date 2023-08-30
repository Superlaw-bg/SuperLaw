using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SuperLaw.Data.Models;

namespace SuperLaw.Data.EntityConfigs
{
    public class LawyerProfileLegalCategoryConfig : IEntityTypeConfiguration<LawyerProfileLegalCategory>
    {
        public void Configure(EntityTypeBuilder<LawyerProfileLegalCategory> entity)
        {
            entity
                .HasKey(ll => new { ll.ProfileId, ll.CategoryId });

            entity
                .HasOne(ll => ll.Profile)
                .WithMany(l => l.LegalCategories)
                .HasForeignKey(ll => ll.ProfileId)
                .OnDelete(DeleteBehavior.Restrict);

            entity
                .HasOne(ll => ll.Category)
                .WithMany(l => l.Lawyers)
                .HasForeignKey(ll => ll.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
