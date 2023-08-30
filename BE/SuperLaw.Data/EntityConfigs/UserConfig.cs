using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SuperLaw.Data.Models;

namespace SuperLaw.Data.EntityConfigs
{
    public class UserConfig : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> entity)
        {
            entity.Ignore(c => c.AccessFailedCount)
                .Ignore(c => c.LockoutEnabled)
                .Ignore(c => c.SecurityStamp)
                .Ignore(c => c.ConcurrencyStamp)
                .Ignore(c => c.PhoneNumber)
                .Ignore(c => c.PhoneNumberConfirmed)
                .Ignore(c => c.LockoutEnd)
                .Ignore(c => c.TwoFactorEnabled);

            entity.ToTable("Users");
        }
    }
}
