using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using MeinStudManager.Data;
using MeinStudManager.Models.Forum;
using Microsoft.AspNetCore.Identity;

namespace MeinStudManager.Models
{
    public class ApplicationUserDto
    {
        public string Id { get; set; } = default!;
        [Required(ErrorMessage = "A username is required.")]
        [RegularExpression(@"[A-Za-z0-9]{3,16}",
            ErrorMessage = "Username error! Your name has to be between 3-16 characters! Only alphanumerical characters are allowed.")]
        public string UserName { get; set; } = default!;
        [Required(ErrorMessage = "First name is required.")]
        [MaxLength(256, ErrorMessage = "The first name cannot exceed 256 characters")]
        [MinLength(1, ErrorMessage = "Your first name should have at least one character")]
        public string FirstName { get; set; } = default!;

        [Required(ErrorMessage = "Last name is required.")]
        [MaxLength(256, ErrorMessage = "The last name cannot exceed 256 characters")]
        [MinLength(1, ErrorMessage = "Your last name should have at least one character")]
        public string LastName { get; set; } = default!;
        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Not a valid email address")]
        public string Email { get; set; } = default!;
        [Editable(false)]
        public bool EmailConfirmed { get; set; }
        public string PhoneNumber { get; set; } = string.Empty;
        [Editable(false)]
        public bool TwoFactorEnabled { get; set; }
    }

    public class ApplicationUser : IdentityUser
    {
        //TODO firstName, lastName
        //TODO: maybe more to allow concurrent logins?
        public string SecurityToken { get; set; } = string.Empty;

        [PersonalData]
        public string? FirstName { get; set; }

        [PersonalData]
        public string? LastName { get; set; }

        [JsonIgnore]
        public List<ForumReply> ForumReplies { get; set; }
        [JsonIgnore]
        public List<ForumVote> ForumVotes { get; set; }
    }
}
