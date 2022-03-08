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
        public DbSet<ForumVote> ForumVotes { get; set; } = default!;
        public DbSet<GradeEntry> Grades { get; set; } = default!;

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            CreateTimetableModel(builder);
            CreateForumModel(builder);
            CreateGradesModel(builder);
        }

        private void CreateTimetableModel(ModelBuilder builder)
        {
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
                        .Select(DateTime.Parse).ToArray(),
                    ValueComparer.CreateDefault(typeof(DateTime[]), true));
        }

        private void CreateForumModel(ModelBuilder builder)
        {
            builder.Entity<ForumReply>()
                .HasOne(r => r.Topic)
                .WithMany(t => t.Replies)
                .HasForeignKey(r => r.TopicId);

            builder.Entity<ForumReply>()
                .HasOne(r => r.Author)
                .WithMany(u => u.ForumReplies)
                .HasForeignKey(r => r.AuthorId);

            builder.Entity<ForumVote>()
                .HasKey(v => new { v.TopicId, v.ReplyId, v.UserId });

            builder.Entity<ForumVote>()
                .HasIndex(v => v.TopicId)
                .IsUnique(false);

            builder.Entity<ForumVote>()
                .HasIndex(v => v.ReplyId)
                .IsUnique(false);

            builder.Entity<ForumVote>()
                .HasIndex(v => v.UserId)
                .IsUnique(false);

            builder.Entity<ForumVote>()
                .HasOne(v => v.User)
                .WithMany(u => u.ForumVotes)
                .HasForeignKey(v => v.UserId);

            builder.Entity<ForumVote>()
                .HasOne(v => v.Reply)
                .WithMany(r => r.Votes)
                .HasForeignKey(v => v.ReplyId);

            builder.Entity<ForumVote>()
                .HasOne(v => v.Topic)
                .WithOne()
                .HasForeignKey<ForumVote>(v => v.TopicId);
        }

        private void CreateGradesModel(ModelBuilder builder)
        {
            builder.Entity<GradeEntry>()
                .HasKey(ge => new { ge.UserId, ge.StudySection, ge.Subject });

            builder.Entity<GradeEntry>()
                .HasIndex(ge => ge.UserId)
                .IsUnique(false);

            builder.Entity<GradeEntry>()
                .HasIndex(ge => ge.StudySection)
                .IsUnique(false);

            builder.Entity<GradeEntry>()
                .HasIndex(ge => ge.Subject)
                .IsUnique(false);

            builder.Entity<GradeEntry>()
                .HasOne(ge => ge.User)
                .WithMany(u => u.Grades)
                .HasForeignKey(ge => ge.UserId);
        }
    }
}
