using System.ComponentModel.DataAnnotations;

namespace MeinStudManager.Models.Forum
{
    public class ForumPostDto
    {
        [MaxLength(128)]
        [MinLength(3)]
        [Required]
        [RegularExpression(@"[^ ]+.+[^ ]")]
        public string Title { get; set; }

        [MaxLength(2048)]
        [MinLength(3)]
        [Required]
        public string Content { get; set; }
    }
}
