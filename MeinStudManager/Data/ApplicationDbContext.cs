using MeinStudManager.Models;
using MeinStudManager.Models.Forum;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace MeinStudManager.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions options)
            : base(options)
        {
        }

        public DbSet<TimetableEntry> Timetables { get; set; } = default!;
        public DbSet<ForumReply> ForumReplies { get; set; } = default!;
        public DbSet<ForumTopic> ForumTopics { get; set; } = default!;

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<ApplicationUser>(b =>
            {
                b.HasMany<TimetableEntry>()
                    .WithOne()
                    .HasForeignKey(te => te.UserId).IsRequired();
            });

            builder.Entity<TimetableEntry>()
                .Property(_ => _.DisabledDates)
                .HasConversion(
                    _ => string.Join(';', _),
                    _ => _.Split(';', StringSplitOptions.RemoveEmptyEntries)
                        .Select(DateTime.Parse).ToArray(), ValueComparer.CreateDefault(typeof(DateTime[]), true));

            builder.Entity<ForumReply>()
                .HasOne(r => r.Topic)
                .WithMany(t => t.Replies)
                .HasForeignKey(r => r.TopicId);

            builder.Entity<ForumReply>()
                .HasOne(r => r.Author)
                .WithMany(u => u.ForumReplies)
                .HasForeignKey(r => r.AuthorId);
        }
    }
}
