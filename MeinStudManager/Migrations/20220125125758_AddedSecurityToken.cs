using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MeinStudManager.Migrations
{
    public partial class AddedSecurityToken : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "SecurityToken",
                table: "AspNetUsers",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SecurityToken",
                table: "AspNetUsers");
        }
    }
}
