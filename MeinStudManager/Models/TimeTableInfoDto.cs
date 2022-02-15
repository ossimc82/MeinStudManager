using System.ComponentModel.DataAnnotations;

namespace MeinStudManager.Models
{
    public class TimeTableInfoDto
    {
        [Key] public Guid Id { get; set; } = Guid.NewGuid();
        public string Subject { get; set; } = default!;
        public string? Description { get; set; }
        public string? Dozent { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string Repetition { get; set; } = default!;
        public string RepeatFrequency { get; set; } = default!;
        public int Interval { get; set; }
        public DateTime[] DisabledDates { get; set; } = Array.Empty<DateTime>();
        public string Color { get; set; } = default!;
        public string Location { get; set; } = default!;
        public string Category { get; set; } = default!;

        //TODO: Reserved for later?
        public string? AdditionalInformation { get; set; }
    }
}
