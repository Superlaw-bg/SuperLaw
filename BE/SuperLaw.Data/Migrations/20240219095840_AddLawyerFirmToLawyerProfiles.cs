using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SuperLaw.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddLawyerFirmToLawyerProfiles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "LawyerFirm",
                table: "LawyerProfiles",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LawyerFirm",
                table: "LawyerProfiles");
        }
    }
}
