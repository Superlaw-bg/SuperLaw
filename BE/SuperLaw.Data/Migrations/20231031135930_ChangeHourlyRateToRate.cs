using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SuperLaw.Data.Migrations
{
    /// <inheritdoc />
    public partial class ChangeHourlyRateToRate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "HourlyRate",
                table: "LawyerProfiles",
                newName: "Rate");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Rate",
                table: "LawyerProfiles",
                newName: "HourlyRate");
        }
    }
}
