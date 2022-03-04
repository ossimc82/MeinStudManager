using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MeinStudManager.Migrations
{
    public partial class RenameForumReplyColumns : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Text",
                table: "ForumReplies",
                newName: "Title");

            migrationBuilder.RenameColumn(
                name: "Message",
                table: "ForumReplies",
                newName: "Content");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Title",
                table: "ForumReplies",
                newName: "Text");

            migrationBuilder.RenameColumn(
                name: "Content",
                table: "ForumReplies",
                newName: "Message");
        }
    }
}
