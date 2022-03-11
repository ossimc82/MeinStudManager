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
        public MsmSortedList<ForumReply, ForumReplyComparer> Replies { get; set; } = new ();

        public class ForumReplyComparer : IComparer<ForumReply>
        {
            public int Compare(ForumReply? x, ForumReply? y)
            {
                if (ReferenceEquals(x, y)) return 0;
                if (ReferenceEquals(null, y)) return 1;
                if (ReferenceEquals(null, x)) return -1;
                return x.CreationDate.CompareTo(y.CreationDate);
            }
        }
    }
}
