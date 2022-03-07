using System.Text.Json.Serialization;
using MeinStudManager.Data;

namespace MeinStudManager.Models.Forum
{
    public class ForumReply
    {
        public Guid Id { get; set; }
        public Guid TopicId { get; set; }
        public string AuthorId { get; set; }
        public DateTime CreationDate { get; set; }
        public int NumberOfEdits { get; set; }
        public DateTime? LastEdit { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }

        public int NumUpVotes => Votes.Count(_ => _.Type == ForumVoteType.Up);
        public int NumDownVotes => Votes.Count(_ => _.Type == ForumVoteType.Down);

        public string AuthorName => Author.UserName;

        [JsonIgnore]
        public ApplicationUser Author { get; set; }
        [JsonIgnore]
        public ForumTopic Topic { get; set; }
        [JsonIgnore]
        public List<ForumVote> Votes { get; set; }
    }
}
