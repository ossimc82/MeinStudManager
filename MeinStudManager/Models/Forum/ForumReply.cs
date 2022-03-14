using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;
using MeinStudManager.Data;

namespace MeinStudManager.Models.Forum
{
    public class ForumReply
    {
        public Guid Id { get; set; }
        public Guid TopicId { get; set; }
        [JsonIgnore]
        public string AuthorId { get; set; }
        public DateTime CreationDate { get; set; }
        public int NumberOfEdits { get; set; }
        public DateTime? LastEdit { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public bool AnonymousPost { get; set; }

        public int NumUpVotes => Votes.Count(_ => _.Type == ForumVoteType.Up);
        public int NumDownVotes => Votes.Count(_ => _.Type == ForumVoteType.Down);

        [JsonIgnore]
        public string AuthorName => Author.UserName;

        [JsonPropertyName("authorName")]
        public string JsonAuthorName => AnonymousPost ? $"(anonymous) {(ShouldDisplayPosterInfo() ? AuthorName : "")}" : AuthorName;

        [JsonPropertyName("authorId")]
        public string JsonAuthorId => ShouldDisplayPosterInfo() ? AuthorId : Guid.Empty.ToString();

        public DateTime CanBeDeletedDeleteUntil => CreationDate.AddHours(3);
        public bool CanBeDeleted => CanBeDeletedDeleteUntil >= DateTime.UtcNow && Topic.Replies.Last().Id == Id;

        [JsonIgnore]
        public ApplicationUser Author { get; set; }
        [JsonIgnore]
        public ForumTopic Topic { get; set; }
        [JsonIgnore]
        public List<ForumVote> Votes { get; set; }

        [JsonIgnore]
        [NotMapped]
        public ApplicationUser? Requester { get; set; }

        private bool ShouldDisplayPosterInfo()
        {
            return !AnonymousPost || Requester == null ||
                   Requester.IsModOrAdmin;
        }
    }
}
