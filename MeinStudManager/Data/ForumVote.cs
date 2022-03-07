using System.Text.Json.Serialization;
using MeinStudManager.Models;
using MeinStudManager.Models.Forum;

namespace MeinStudManager.Data
{
    public enum ForumVoteType
    {
        Up, Down
    }

    public class ForumVote
    {
        public Guid TopicId { get; set; }
        public Guid ReplyId { get; set; }
        public string UserId { get; set; }
        public ForumVoteType Type { get; set; }

        public ApplicationUser User { get; set; }
        public ForumTopic Topic { get; set; }
        public ForumReply Reply { get; set; }
    }
}
