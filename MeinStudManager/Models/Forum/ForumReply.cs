﻿using System.Text.Json.Serialization;

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

        public string AuthorName => Author.UserName;

        [JsonIgnore]
        public ApplicationUser Author { get; set; }
        [JsonIgnore]
        public ForumTopic Topic { get; set; }
    }
}