using MeinStudManager.Models;
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
        }
    }
}
