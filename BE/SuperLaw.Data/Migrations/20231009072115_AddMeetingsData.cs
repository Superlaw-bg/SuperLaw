using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SuperLaw.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddMeetingsData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CategoryId",
                table: "Meetings",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "From",
                table: "Meetings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Info",
                table: "Meetings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "RegionId",
                table: "Meetings",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "To",
                table: "Meetings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CategoryId",
                table: "Meetings");

            migrationBuilder.DropColumn(
                name: "From",
                table: "Meetings");

            migrationBuilder.DropColumn(
                name: "Info",
                table: "Meetings");

            migrationBuilder.DropColumn(
                name: "RegionId",
                table: "Meetings");

            migrationBuilder.DropColumn(
                name: "To",
                table: "Meetings");
        }
    }
}
