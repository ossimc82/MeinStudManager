using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MeinStudManager.Migrations
{
    public partial class ForumVotes : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ForumVotes",
                columns: table => new
                {
                    TopicId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    ReplyId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    UserId = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Type = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ForumVotes", x => new { x.TopicId, x.ReplyId, x.UserId });
                    table.ForeignKey(
                        name: "FK_ForumVotes_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ForumVotes_ForumReplies_ReplyId",
                        column: x => x.ReplyId,
                        principalTable: "ForumReplies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ForumVotes_ForumTopics_TopicId",
                        column: x => x.TopicId,
                        principalTable: "ForumTopics",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_ForumVotes_ReplyId",
                table: "ForumVotes",
                column: "ReplyId");

            migrationBuilder.CreateIndex(
                name: "IX_ForumVotes_TopicId",
                table: "ForumVotes",
                column: "TopicId");

            migrationBuilder.CreateIndex(
                name: "IX_ForumVotes_UserId",
                table: "ForumVotes",
                column: "UserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ForumVotes");
        }
    }
}
