using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SuperLaw.Data.Migrations
{
    /// <inheritdoc />
    public partial class RemoveRegionIdFromMeeting : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RegionId",
                table: "Meetings");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "RegionId",
                table: "Meetings",
                type: "int",
                nullable: true);
        }
    }
}
