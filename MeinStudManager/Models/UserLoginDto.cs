using System.ComponentModel.DataAnnotations;

namespace MeinStudManager.Models
{
    public class UserLoginDto
    {
        [Required(ErrorMessage = "Either Email or Username is required")]
        public string Ident { get; set; }
        [Required(ErrorMessage = "Password is required.")]
        public string Password { get; set; }
    }
}
