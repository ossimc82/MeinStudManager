using System.ComponentModel.DataAnnotations;

namespace MeinStudManager.Models
{
    public class UserRegisterDto
    {
        [Required(ErrorMessage = "A username is required.")]
        public string UserName { get; set; } = default!;
        [Required(ErrorMessage = "First name is required.")]
        public string FirstName { get; set; } = default!;

        [Required(ErrorMessage = "Last name is required.")]
        public string LastName { get; set; } = default!;
        [Required(ErrorMessage = "Email is required.")]
        public string Email { get; set; } = default!;
        [Required(ErrorMessage = "Password is required.")]
        public string Password { get; set; } = default!;
        [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; } = default!;
    }
}
