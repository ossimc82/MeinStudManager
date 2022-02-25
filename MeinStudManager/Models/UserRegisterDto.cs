using System.ComponentModel.DataAnnotations;

namespace MeinStudManager.Models
{
    public class UserRegisterDto
    {
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
        [Required(ErrorMessage = "Password is required.")]
        public string Password { get; set; } = default!;
        [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; } = default!;
    }
}
