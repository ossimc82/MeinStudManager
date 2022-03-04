using System.Web;
using MeinStudManager.Extensions;
using MeinStudManager.Models;
using MeinStudManager.Models.Forum;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MeinStudManager.Data
{
    public class ForumManager
    {
        private readonly ApplicationDbContext db;

        public ForumManager(ApplicationDbContext db)
        {
            this.db = db;
        }

        public PagingResult<ForumReply> GetReplies(Guid topic, int count, int page)
        {
            return PagingResult<ForumReply>.CreatePagingResult(
                db.ForumReplies.Where(_ => _.TopicId == topic).OrderBy(_ => _.CreationDate).Include(_ => _.Author), count, page);
        }

        public async Task<IActionResult> NewTopic(ApplicationUser user, string title, string content)
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
                Content = content
            };

            db.ForumReplies.Add(reply);
            topic.Entity.Replies.Add(reply);

            await db.SaveChangesAsync();

            return new OkObjectResult(topic.Entity.Replies[0].Id);
        }

        public PagingResult<ForumTopic> GetTopics(int count, int page)
        {
            return PagingResult<ForumTopic>.CreatePagingResult(db.ForumTopics.Include(t => t.Replies).AsEnumerable().OrderBy(_ => _.LastReply), count, page);
        }

        public async Task<string?> NewReply(Guid topicId, ApplicationUser user, string title, string content)
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
                Content = HttpUtility.HtmlEncode(content)
            };

            db.ForumReplies.Add(reply);

            topicEn.Entity.Replies.Add(reply);

            await db.SaveChangesAsync();
            return null;
        }

        public async Task<string?> EditReply(Guid topicId, Guid postId, ApplicationUser user, string title, string content)
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

            if (reply.Title == title && reply.Content == content)
                return null;

            replyEn.Entity.Title = title;
            replyEn.Entity.Content = content;

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

            var replyEn = db.Remove(reply);

            //TODO: log?

            await db.SaveChangesAsync();
            return null;
        }
    }
}
