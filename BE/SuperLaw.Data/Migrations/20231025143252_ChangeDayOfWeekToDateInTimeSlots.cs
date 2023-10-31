using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SuperLaw.Data.Migrations
{
    /// <inheritdoc />
    public partial class ChangeDayOfWeekToDateInTimeSlots : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DayOfWeek",
                table: "TimeSlots");

            migrationBuilder.AddColumn<DateTime>(
                name: "Date",
                table: "TimeSlots",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Date",
                table: "TimeSlots");

            migrationBuilder.AddColumn<int>(
                name: "DayOfWeek",
                table: "TimeSlots",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
