using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SuperLaw.Data.Models.Enums;

namespace SuperLaw.Services.DTO
{
    public class MeetingDto
    {
        public int Id { get; set; }

        public int ProfileId { get; set; }

        public bool IsUserTheLawyer { get; set; }

        public string Name { get; set; }

        public string Date { get; set; }

        public DateTimeOffset DateTime { get; set; }

        public string From { get; set; }

        public string To { get; set; }

        public string? CategoryName { get; set; }

        public string? Info { get; set; }

        public decimal Rating { get; set; }
    }
}
