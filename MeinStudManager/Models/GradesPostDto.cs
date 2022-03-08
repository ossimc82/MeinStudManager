using System.ComponentModel.DataAnnotations;
using MeinStudManager.Data;

namespace MeinStudManager.Models
{
    public class GradesPostDto
    {
        [Required]
        [RegularExpression(@"[A-Za-z0-9. ]{5,256}",
            ErrorMessage = "Invalid format, check: [A-Za-z0-9.]{5,256}")]
        public string StudySection { get; set; } = default!;

        [Required]
        [RegularExpression(@"[A-Za-z0-9. ]{5,256}",
            ErrorMessage = "Invalid format, check: [A-Za-z0-9.]{5,256}")]
        public string Subject { get; set; } = default!;

        [Required] [Range(1, 5.0)] public double Grade { get; set; }
        [Required] [Range(3, 20)] public int Credits { get; set; } = 5;
    }
}
