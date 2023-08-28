using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using SuperLaw.Data.Models.Enums;

namespace SuperLaw.Data.Models
{
    public class Role
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int Id { get; set; }

        [Required, MaxLength(20)]
        public string Name { get; set; }

        private Role(RoleEnum role)
        {
            Id = (int)role;
            Name = role.GetEnumName();
        }
        public Role() { }

        public static implicit operator Role(RoleEnum role) => new Role(role);
    }
}
