using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace MeinStudManager.Models.Forum
{
    public class ForumTopic
    {
        public Guid Id { get; set; }
        public string Title => Replies.Count > 0 ? Replies[0].Title : "";
        public DateTime LastReply => Replies.Count > 0 ? Replies.Max(_ => _.CreationDate) : DateTime.MinValue;

        [JsonIgnore]
        public List<ForumReply> Replies { get; set; } = new ();
    }
}
