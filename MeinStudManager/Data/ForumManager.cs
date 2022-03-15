using System.IO.Pipes;
using System.Web;
using MeinStudManager.Extensions;
using MeinStudManager.Models;
using MeinStudManager.Models.Forum;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace MeinStudManager.Data
{
    public class ForumManager
    {
        private readonly ApplicationDbContext db;

        public ForumManager(ApplicationDbContext db)
        {
            this.db = db;
        }

        public PagingResult<ForumReply> GetReplies(Guid topic, int count, int page, ApplicationUser user)
        {
            return PagingResult<ForumReply>.CreatePagingResult(
                db.ForumReplies.Where(_ => _.TopicId == topic).OrderBy(_ => _.CreationDate)
                    .Include(_ => _.Topic)
                    .Include(_ => _.Author)
                    .ThenInclude(u => u.UserRoles)
                    .ThenInclude(r => r.Role)
                    .Include(_ => _.Votes), count, page);
        }

        public async Task<IActionResult> NewTopic(ApplicationUser user, string title, string content, bool anonymous)
        {
            title = HttpUtility.HtmlEncode(title);
            content = HttpUtility.HtmlEncode(content);

            var topic = await db.ForumTopics.AddAsync(new ForumTopic
            {
                Id = Guid.NewGuid()
            });

            var reply = new ForumReply
            {
                Id = Guid.NewGuid(),
                TopicId = topic.Entity.Id,
                Author = user,
                CreationDate = DateTime.UtcNow,
                Title = title,
                Content = content,
                AnonymousPost = anonymous
            };

            db.ForumReplies.Add(reply);
            topic.Entity.Replies.Add(reply);

            await db.SaveChangesAsync();

            return new OkObjectResult(topic.Entity.Replies[0].Id);
        }

        public PagingResult<ForumTopic> GetTopics(int count, int page, ApplicationUser user)
        {
            return PagingResult<ForumTopic>.CreatePagingResult(db.ForumTopics.Include(t => t.Replies).AsEnumerable().OrderBy(_ => _.LastReply), count, page);
        }

        public async Task<string?> NewReply(Guid topicId, ApplicationUser user, string title, string content, bool anonymous)
        {
            var topic = await db.ForumTopics.FindAsync(topicId);
            if (topic == null)
                return $"Topic with id {topicId} not found!";

            var topicEn = db.Entry(topic);
            await topicEn.Collection(t => t.Replies).LoadAsync();

            var reply = new ForumReply
            {
                Id = Guid.NewGuid(),
                TopicId = topicId,
                Author = user,
                CreationDate = DateTime.UtcNow,
                Title = HttpUtility.HtmlEncode(title),
                Content = HttpUtility.HtmlEncode(content),
                AnonymousPost = anonymous
            };

            db.ForumReplies.Add(reply);

            topicEn.Entity.Replies.Add(reply);

            await db.SaveChangesAsync();
            return null;
        }

        public async Task<string?> EditReply(Guid topicId, Guid postId, ApplicationUser user, string title, string content, bool anonymous)
        {
            title = HttpUtility.HtmlEncode(title);
            content = HttpUtility.HtmlEncode(content);

            var reply = await db.ForumReplies.FirstOrDefaultAsync(_ => _.Id == postId && _.TopicId == topicId);
            if (reply == null)
                return $"Reply with id {postId} in topic with id {topicId} not found!";

            //TODO: Allow admins and mods to edit posts
            if (user.Id != reply.AuthorId)
                return "Thats not your reply, you should go and wash your mummy.";

            var replyEn = db.Entry(reply);

            if (reply.Title == title && reply.Content == content && reply.AnonymousPost == anonymous)
                return null;

            replyEn.Entity.Title = title;
            replyEn.Entity.Content = content;
            replyEn.Entity.AnonymousPost = anonymous;

            replyEn.Entity.LastEdit = DateTime.UtcNow;
            replyEn.Entity.NumberOfEdits++;

            await db.SaveChangesAsync();
            return null;
        }

        public async Task<string?> DeletePost(Guid topicId, Guid postId, ApplicationUser user)
        {
            var reply = await db.ForumReplies.FirstOrDefaultAsync(_ => _.Id == postId && _.TopicId == topicId);
            if (reply == null)
                return $"Reply with id {postId} in topic with id {topicId} not found!";
            
            if (!reply.CanBeDeleted && !user.IsModOrAdmin)
                return "Deletion time expired or your reply is not the last anymore. (Maybe mark as anonymous)";

            var replyEn = db.Remove(reply);

            //TODO: log?

            await db.SaveChangesAsync();
            return null;
        }

        public async Task<string?> Vote(Guid topicId, Guid postId, ApplicationUser user, ForumVoteType type)
        {
            var (vote, errorMessage) = await FindVote(topicId, postId, user);

            if (errorMessage != null)
                return errorMessage;

            EntityEntry<ForumVote>? voteEn = null;

            if (vote == null)
            {
                vote = new ForumVote
                {
                    TopicId = topicId,
                    ReplyId = postId,
                    UserId = user.Id
                };
                voteEn = db.ForumVotes.Add(vote);
            };

            voteEn ??= db.Attach(vote);
            voteEn.Entity.Type = type;

            await db.SaveChangesAsync();

            return null;
        }

        public async Task<string?> RemoveVote(Guid topicId, Guid postId, ApplicationUser user)
        {
            var (vote, errorMessage) = await FindVote(topicId, postId, user);

            if (errorMessage != null)
                return errorMessage;

            if (vote == null)
                return "This vote does not exist.";

            db.ForumVotes.Remove(vote);

            await db.SaveChangesAsync();
            return null;
        }

        private async Task<(ForumVote?, string?)> FindVote(Guid topicId, Guid postId, ApplicationUser user)
        {
            var topic = await db.ForumTopics.FindAsync(topicId);

            if (topic == null)
                return (null, $"Topic with id {topicId} not found.");
            
            var post = await db.ForumReplies.FindAsync(postId);

            if (post == null)
                return (null, $"Reply with id {postId} not found.");

            if (post.TopicId != topic.Id)
                return (null, $"The reply with id {postId} does not belong to the topic with id {topicId}.");

            return (await db.ForumVotes.FindAsync(topicId, postId, user.Id), null);
        }
    }
}
