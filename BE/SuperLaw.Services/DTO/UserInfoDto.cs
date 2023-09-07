using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SuperLaw.Services.DTO
{
    public class UserInfoDto
    {
        public string Id { get; set; }

        public string IdToken { get; set; }

        public string Email { get; set; }

        public string Role { get; set; }
    }
}
