using System.ComponentModel.DataAnnotations;
using MeinStudManager.Models;

namespace MeinStudManager.Data
{
    public class GradeEntry
    {
        public string UserId { get; set; }
        public string StudySection { get; set; }
        public string Subject { get; set; }
        public double Grade { get; set; }
        public int Credits { get; set; }

        public ApplicationUser User { get; set; }
    }
}
